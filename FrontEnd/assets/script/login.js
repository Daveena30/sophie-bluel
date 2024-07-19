//! ************ VARIABLES GLOBALES et CONSTANTES ************

const email = document.getElementById("email").value;




//! ************ VARIABLE ************





//! ************ FUNCTIONS ************





//! ************ MAIN ************




document
  .getElementById("login")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const password = document.getElementById("password").value;

    //if (!isValidEmail(email)) {
     //alert("Veuillez entrer une adresse e-mail valide.");
      //return;
  //  }

    //console.log(email, password);

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      //const data = await response.json();
      if (response.ok) {
        console.log("Connexion reussie avec l'utilisateur");
      }
      //console.log(data);
    } catch (error) {
      console.log(error);
    }
  });

function isValidEmail(emailAdresse) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
}