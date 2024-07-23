"use strict";


// ********** CONSTANTS ********** //

const form = document.querySelector("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const logOut = document.getElementById("login-link");
const LOGIN_URL = 'http://localhost:5678/api/users/login';


// ********** VARIABLES ********** //

let user;



// ********** FUNCTIONS ********** //
document.addEventListener('DOMContentLoaded', function () {
  // Code pour lancer l'application
  console.log('Application en cours de chargement...');
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    window.location.href = 'index.html';
  }
})

// ce code vérifie si une chaîne de caractères est une adresse e-mail valide en utilisant une expression régulière pour tester son format.
//isValidEmail est le nom de la fonction.
const isValidEmail = (emailAdresse) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(emailAdresse); // renvoie true si la chaîne de caractères est une adresse e-mail valide et false sinon. 
}; //emailPattern est une expression régulière (regex) utilisée pour vérifier si l'adresse e-mail est valide.
document
  .getElementById('login')
  .addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // if (!isValidEmail(email)) {
    //   console.log("Adresse email invalide");
    //   return;
    // }
    const loginData = {
      email: email,
      password: password,
    };
    try {
      const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      console.log(data);
      const user = {
        token: data.token,
        userId: data.userId,
      }
      localStorage.setItem('user', JSON.stringify(user));
      if (response.ok) {

        const myp = document.createElement('p');
        myp.textContent = "Connexion spécie avec l'utilisateur";
        const successContainer = document.getElementById('success-message');
        if (successContainer) {
          successContainer.appendChild(myp);
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 3000);
        }
        // Effectuer d'autres actions après une connexion réussie si nécessaire
      } else {

        const p = document.createElement('p');
        p.textContent = "mot de passe ou email incorrect";

        const errorContainer = document.getElementById('error');
        if (errorContainer) {
          errorContainer.appendChild(p);
        } else {
          console.warn('Le conteneur d\'erreurs n\'a pas été trouvé.');
        }
        // Afficher le message d'erreur
        // Gérer les cas d'erreur de connexion si nécessaire
      }
    } catch (error) {
      console.log('Erreur lors de la tentative de connexion:', error);
      // Gérer les erreurs de fetch ou d'autres exceptions
    }
  });


