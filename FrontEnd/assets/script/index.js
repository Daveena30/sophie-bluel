"use strict";

// ********** CONSTANTS ********** //
const works = [];
let deleteBtn = [];
let token;


document.addEventListener('DOMContentLoaded', function () {
    // Code pour lancer l'application
    console.log('Application en cours de chargement...');
    token = localStorage.getItem('token');
    if (token) {
        document.getElementById('login-url').style.display = 'none';
        document.getElementById('logout').style.display = 'block';
    }
})

document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('token');
    document.getElementById('login-url').style.display = 'block';
    document.getElementById('logout').style.display = 'none';
})

const getWorks = async () => {
    const worksdoc = document.getElementById('mywork');

    try {
        const response = await fetch('http://localhost:5678/api/works');
        const data = await response.json();
        works.push(...data);

        works.forEach((work) => {
            const figure = document.createElement('figure');
            figure.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>
            `;
            worksdoc.appendChild(figure);
        });

    } catch (error) {
        console.log(error);
    }

}
document.addEventListener('DOMContentLoaded', getWorks)


const getCategories = async () => {
    const categoriesDoc = document.getElementById('categories');

    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();
        console.log(categories);

        categories.forEach((category) => {
            const categoryElement = document.createElement('button');
            categoryElement.textContent = category.name;
            categoriesDoc.appendChild(categoryElement);
        });

    } catch (error) {
        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded', getCategories)

document.getElementById('close-modal').addEventListener('click', function () {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modal').style.opacity = 0;

})

document.getElementById('open-modal').addEventListener('click', function () {
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

})

document.getElementById('open-second-modal').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modal').style.opacity = 0;
    
    document.getElementById('second-modal').style.display = 'block';
    document.getElementById('second-modal').style.opacity = 1;
});

document.getElementById('close-second-modal').addEventListener('click', () => {
    document.getElementById('second-modal').style.display = 'none';
    document.getElementById('second-modal').style.opacity = 0;
});

























