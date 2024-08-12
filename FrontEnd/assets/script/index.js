"use strict";

// ********** CONSTANTS ********** //

const URL = 'http://localhost:5678/api/';

const worksElt = document.getElementById('work');
const categoriesElt = document.getElementById('categories');

// ********** VARIABLES ********** //

let works = [];
let categories = [];

let token = '';
let file;

// ********** FUNCTIONS ********** //

// ***** DATA ***** //

/**
 * Fetches data of a specific type from a URL and returns the parsed JSON data.
 *
 * @param {type} type - The type of data to fetch.
 * @return {Promise} Parsed JSON data fetched from the URL.
 */
const getData = async (type) => {
  try {
    const response = await fetch(URL + type);
    const data = await response.json();

    return data;

  } catch (error) {
    console.error(error);
  }
}

/**
 * Fetches works data from the server and displays them on the page.
 *
 * @return {Promise<void>} A Promise that resolves when the works are displayed.
 */
const displayWorks = async () => {
  works = await getData('works');

  for (const work of works) {
    const figure = document.createElement('figure');

    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    `;

    worksElt.appendChild(figure);
  }
}

/**
 * Asynchronously fetches category data from the server and displays them as buttons on the page.
 *
 * @return {Promise<void>} A Promise that resolves when the categories are displayed.
 */
const displayCategories = async () => {
  categories = await getData('categories');

  for (const category of categories) {
    const categoryElt = document.createElement('button');

    categoryElt.setAttribute('data-category', category.id);
    categoryElt.className = 'category__btn';
    categoryElt.addEventListener('click', () =>
      filterWorks(category.id, categoryElt)
    );

    categoryElt.textContent = category.name;
    categoriesElt.appendChild(categoryElt);
  }
}

// ***** FIRST MODAL ***** //

/**
 * Opens a modal and displays a list of works with delete buttons. When a delete button is clicked,
 * it prompts the user to confirm the deletion and sends a DELETE request to the server to delete the corresponding work.
 */
const openModal = () => {
  let deleteBtn = [];

  document.getElementById('modal').style.display = 'block';
  document.getElementById('modal').style.opacity = 1;

  const modalImages = document.getElementById('modal-images')
  modalImages.innerHTML = '';

  works.forEach((work) => {
    const li = document.createElement('li');
    li.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <span class="delete"><i class="fa-solid fa-trash-can"></i></span>
        `;
    modalImages.appendChild(li);
  });
  const deleteWorks = document.getElementsByClassName('delete');
  deleteBtn = [...deleteWorks]

  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener('click', async function () {
      if (confirm('Voulez-vous supprimer cette image ?')) {

        try {
          const response = await fetch(`http://localhost:5678/api/works/${works[i].id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        } catch (error) {

        }
      }
    })
  }
}



/**
 * Closes the modal by setting its display to 'none' and opacity to 0.
 */
const closeModal = () => {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal').style.opacity = 0;
}

/**
 * Returns to the modal by hiding the overflow modal and showing the main modal.
 */
const returnToModal = () => {
  document.getElementById("overflow-modal").style.display = "none";
  document.getElementById("overflow-modal").style.opacity = 0;
  document.getElementById("modal").style.display = "block";
  document.getElementById("modal").style.opacity = 1;
}

// ***** SECOND MODAL *****

/**
 * Opens the second modal and populates the category dropdown with options.
 */
const openSecondModal = () => {
  document.getElementById("overflow-modal").style.display = "block";
  document.getElementById("overflow-modal").style.opacity = 1;
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal").style.opacity = 0;


  const categoriesElement = document.getElementById('category');
  categoriesElement.innerHTML = '';
  const emptyOptions = document.createElement('option');
  categoriesElement.appendChild(emptyOptions);


  for (const category of categories) {
    const option = document.createElement('option');
    option.textContent = category.name;
    option.setAttribute('value', category.id);

    categoriesElement.appendChild(option);
  }
};

/**
 * Closes the second modal by setting its display to "none" and opacity to 0.
 */
const closeSecondModal = () => {
  document.getElementById("overflow-modal").style.display = "none";
  document.getElementById("overflow-modal").style.opacity = 0;
}

/**
 * Selects an image file from the user's device and displays it in the 'imageContainer' element.
 */
const selectImage = () => {
  const fileInput = document.getElementById('fileInput');

  fileInput.addEventListener('change', (event) => {
    event.stopPropagation();
    file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      /**
       * Sets the source of an image element to the result of a FileReader and
       * appends it to the 'imageContainer' element. Hides the 'imageIcon' element
       * and displays the 'imageContainer' element.
       *
       * @param {Event} e - The event object containing the result of the FileReader.
       */
      reader.onload = (e) => {
        const imgElement = document.createElement('img');
        imgElement.src = e.target.result;
        imgElement.style.maxWidth = '100%';
        document.getElementById('imageContainer').innerHTML = '';
        document.getElementById('imageContainer').appendChild(imgElement);
        document.getElementById('imageIcon').style.display = 'none';
        document.getElementById('imageContainer').style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });

  fileInput.click();
};

/**
 * Submits a work to the server.
 *
 * @param {Event} event - The event object triggered by the form submission.
 * @return {Promise<void>} A promise that resolves when the work is successfully submitted, or rejects with an error if there was a problem.
 */
const submitWork = async (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;

  if (!file || !title || !category) {
    const error = document.getElementById('error_submit');
    const span = document.createElement('span');
    span.textContent = 'Vérifier que tous les champs sont corrects';
    span.style.color = 'red';
    span.style;
    error.appendChild(span);
    return;
  } else {
    const url = URL + 'works';
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', file);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      //  const data = await response.json();

    } catch (error) {
      console.error('Failed to create work:', error);
    }
  }
};

//  ***** RUN ***** 

/**
 * Logs out the user by removing the token from local storage and updating the display of the login and logout buttons.
 */
const logout = () => {
  localStorage.removeItem('token');
  document.getElementById('login-url').style.display = 'block';
  document.getElementById('logout').style.display = 'none';
}


// ***** FILTER *****

/**
 * Filters works based on the given category ID and updates the DOM to display only the filtered works.
 *
 * @param {number} categoryId - The ID of the category to filter works by.
 * @param {HTMLElement} button - The button element that triggered the filter.
 */
const filterWorks = (categoryId, button) => {
  const worksdoc = document.getElementById('work');
  worksdoc.innerHTML = '';

  // Filtrer les travaux en fonction de l'ID de catégorie
  const filteredWorks = works.filter((work) => work.categoryId === categoryId);
  // Ajouter les éléments filtrés au DOM
  filteredWorks.forEach((work) => {
    const figure = document.createElement('figure');
    figure.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
      `;
    worksdoc.appendChild(figure);
  });

  document.querySelectorAll('.category__btn').forEach((btn) => {
    btn.classList.remove('active');
  });
  button.classList.add('active');
  document.getElementById('all-work').classList.remove('btn-all');
};

// ********** MAIN ********** //

document
  .getElementById('return-second-modal')
  .addEventListener('click', returnToModal);

document.getElementById('add-photo').addEventListener('click', openSecondModal);

document
  .getElementById('second-close-modal')
  .addEventListener('click', closeSecondModal);


// ***** FUNCTION CHANGE BUTTON COLOR *****
document.addEventListener('DOMContentLoaded', function () {
  const titleInput = document.getElementById('title');
  const fileInput = document.getElementById('fileInput');
  const categorySelect = document.getElementById('category');
  const submitButton = document.getElementById('create-works');

  /**
   * Checks if the input fields for title, category, and file are not empty.
   * If all fields are not empty, it enables the submit button and adds the 'enabled-button' class.
   * If any field is empty, it disables the submit button and adds the 'unenabled-button' class.
   */
  function checkInputs() {
    const titleValue = titleInput.value.trim();
    const categoryValue = categorySelect.value.trim();
    const fileValue = fileInput.files.length > 0;

    if (titleValue !== '' && categoryValue !== '' && fileValue) {
      submitButton.disabled = false;
      submitButton.classList.remove('unenabled-button');
      submitButton.classList.add('enabled-button');
    } else {
      submitButton.disabled = true;
      submitButton.classList.add('unenabled-button');
      submitButton.classList.remove('enabled-button');
    }
  }

  titleInput.addEventListener('input', checkInputs);
  categorySelect.addEventListener('change', checkInputs);
  fileInput.addEventListener('change', checkInputs);
});

document
  .getElementById('add-photo-modal')
  .addEventListener('click', selectImage);

document.getElementById('logout').addEventListener('click', logout);
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('open-modal').addEventListener('click', openModal);

document.addEventListener('DOMContentLoaded', function () {
  token = localStorage.getItem('token');

  if (token) {
    document.getElementById('login-url').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
    document.getElementById('categories').style.display = 'none';
  } else {
    document.getElementById('open-modal').style.display = 'none'
    document.getElementById('modifier').style.display = 'none';

  }

  displayWorks();
  displayCategories();

  document.getElementById('imageContainer').style.display = 'none';
});

document
  .getElementById('create-works-form')
  .addEventListener('submit', async (event) => {
    submitWork(event);
  });

document.getElementById('all-work').addEventListener('click', () => {
  const worksdoc = document.getElementById('work');
  worksdoc.innerHTML = '';
  works.forEach((work) => {
    const figure = document.createElement('figure');
    figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
          `;
    worksdoc.appendChild(figure);
  });

  document.getElementById('all-work').classList.add('btn-all');
  document.querySelectorAll('.category__btn').forEach((btn) => {
    btn.classList.remove('active');
  });
});














