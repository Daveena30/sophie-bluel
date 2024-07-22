"use strict";


document.addEventListener('DOMContentLoaded', function () {
    // Code pour lancer l'application
    console.log('Application en cours de chargement...');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      document.getElementById('login-url').style.display = 'none';
      document.getElementById('logout').style.display = 'block';
    }
  })

  document.getElementById('logout').addEventListener('click', function () {
    localStorage.removeItem('user');
    document.getElementById('login-url').style.display = 'block';
    document.getElementById('logout').style.display = 'none';
  })

  const getWorks = async () => { 
    const worksdoc = document.getElementById('mywork');

    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();
        console.log(works);

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










