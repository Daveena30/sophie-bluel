"use strict";

// ********** CONSTANTS ********** //

const URL = 'http://localhost:5678/api/users/login';

const email = document.getElementById("email");
const password = document.getElementById("password");
const form = document.getElementById("login");
const error = document.getElementById('error');

// ********** FUNCTION ********** //

/**
 * Permet de se connecter
 * Avec les informations de l'utilisateur
 * En envoyant une requête POST
 * Puis en enregistrant le token dans le localStorage
 * Et de rediriger vers l'accueil
 */
const login = async () => {
  const credentials = {
    email: email.value,
    password: password.value,
  };

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      localStorage.setItem('token', data.token);
      window.location.href = 'index.html';
      
    } else {
      error.textContent = "mot de passe ou email incorrect";
    }

  } catch (error) {
    console.log('Erreur lors de la tentative de connexion:', error);
  }
}

// ********** MAIN ********** //

form.addEventListener('submit', async function (event) {
  event.preventDefault();
  login();
});
