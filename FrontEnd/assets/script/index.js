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

// SECOND MODAL

const openSecondModal = () => {
  document.getElementById("overflow-modal").style.display = "block";
  document.getElementById("overflow-modal").style.opacity = 1;
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal").style.opacity = 0;
}

const closeSecondModal = () => {
  document.getElementById("overflow-modal").style.display = "none";
  document.getElementById("overflow-modal").style.opacity = 0;
}

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

const submitWork = async (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;

  const url = URL + 'works';
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('image', file);

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.log(response);
    }
  } catch (error) {
    console.error('Failed to create work:', error);
  }
}

// RUN

const logout = () => {
  localStorage.removeItem('token');
  document.getElementById('login-url').style.display = 'block';
  document.getElementById('logout').style.display = 'none';
}

const addListeners = () => {
  document.getElementById('logout').addEventListener('click', logout);
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.getElementById('open-modal').addEventListener('click', openModal);
}

// ********** MAIN ********** //

document.addEventListener('DOMContentLoaded', function () {
  console.log('Application en cours de chargement...');
  token = localStorage.getItem('token');

  if (token) {
    document.getElementById('login-url').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
  } else {

  }

  displayWorks();
  displayCategories();

  document.getElementById('imageContainer').style.display = 'none';
})

document
  .getElementById('create-works-form')
  .addEventListener('submit', async (event) => {
    submitWork(event);
  });





























