"use strict";

// ********** CONSTANTS ********** //

const URL = 'http://localhost:5678/api/';

const worksElt      = document.getElementById('work');
const categoriesElt = document.getElementById('categories');

// ********** VARIABLES ********** //

let works = [];
let categories = [];

let token = '';
let file;

// ********** FUNCTIONS ********** //

// DATA

const getData = async (type) => {
  try {
    const response = await fetch(URL + type);
    const data = await response.json();
    console.log(data);

    return data;

  } catch (error) {
    console.log(error);
  }
}

const displayWorks = async () => {
  works = await getData('works');

  for (const work of works) {
    const figure = document.createElement('figure');
    console.log(work);

    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    `;

    worksElt.appendChild(figure);
  }
}

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

// FIRST MODAL

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
  console.log(deleteWorks);
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

const closeModal = () => {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal').style.opacity = 0;
}

const returnToModal = () => {
  document.getElementById("overflow-modal").style.display = "none";
  document.getElementById("overflow-modal").style.opacity = 0;
  document.getElementById("modal").style.display = "block";
  document.getElementById("modal").style.opacity = 1;
}

document
  .getElementById('return-second-modal')
  .addEventListener('click', returnToModal);

// SECOND MODAL

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



document.getElementById('add-photo').addEventListener('click', openSecondModal);

const closeSecondModal = () => {
  document.getElementById("overflow-modal").style.display = "none";
  document.getElementById("overflow-modal").style.opacity = 0;
}

document
  .getElementById('second-close-modal')
  .addEventListener('click', closeSecondModal);

const selectImage = () => {
  const fileInput = document.getElementById('fileInput');

  fileInput.addEventListener('change', (event) => {
    event.stopPropagation();
    file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
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


// FOUNCTION CHANGE BUTTON COLOR
document.addEventListener('DOMContentLoaded', function () {
  const titleInput = document.getElementById('title');
  const fileInput = document.getElementById('fileInput');
  const categorySelect = document.getElementById('category');
  const submitButton = document.getElementById('create-works');

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



const submitWork = async (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;

  if (!file || !title || !category) {
    const error = document.getElementById('error_submit');
    const span = document.createElement('span');
    span.textContent = 'Verifier que tous les champs sont correct';
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

      console.log(response);
      //  const data = await response.json();

      if (!response.ok) {
        console.log(response);
      }
    } catch (error) {
      console.error('Failed to create work:', error);
    }
  }
};

// RUN

/**
 * Logs out the user by removing the token from local storage and updating the display of the login and logout buttons.
 */
const logout = () => {
  localStorage.removeItem('token');
  document.getElementById('login-url').style.display = 'block';
  document.getElementById('logout').style.display = 'none';
}

document.getElementById('logout').addEventListener('click', logout);
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('open-modal').addEventListener('click', openModal);

// ********** MAIN ********** //

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


  // FILTER
const filterWorks = (categoryId, button) => {
  const worksdoc = document.getElementById('work');
  worksdoc.innerHTML = '';

  // Filtrer les travaux en fonction de l'ID de catégorie
  const filteredWorks = works.filter((work) => work.categoryId === categoryId);
  console.log(filteredWorks);
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





























