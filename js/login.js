//login.js
//Purpose: Creates the functions of the login page. Asks for user input and checks for validation of the correct input in order to login.
//Version: addedHeaderComments  Date: 5/14/2021
//Author(s): Mike Nguyen
//Dependencies: Javascript



window.onload = init;
function init() {
  firebase.auth().onAuthStateChanged(authStateChangeHandler);
  function authStateChangeHandler(user) {
    if (user && user.emailVerified) {
      location.replace("../html/index.html");
    } else {
      return;
    }
  }
}

window.addEventListener("load", function () {
  let link = document.getElementById("login-link");
  link.onclick = linkClickHandler;

  let form = document.getElementById("login-form");
  form.onsubmit = formSubmitHandler;

  function linkClickHandler() {
    location.replace("../html/register.html");
  }

  function formSubmitHandler(event) {
    event.preventDefault();
    let loginInfo = {
      email: form.email.value,
      password: form.password.value,
    };
    let validateResult = [
      validate(loginInfo.email, "email-error", "Invalid Email"),
      validate(loginInfo.password, "password-error", "Invalid Password"),
    ];
    if (allPassed(validateResult)) {
      login(loginInfo);
    }
  }
});

login = async function (loginInfo) {
  let email = loginInfo.email;
  let password = loginInfo.password;
  setText("login-error", "");
  disable("login-submit-btn");
  document.getElementById("login-link").classList.toggle("disabled");
  try {
    let result = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    if (!result.user.emailVerified) {
      throw new Error("You must verify email");
    }
    localStorage.setItem("email", email);
    localStorage.setItem("name", result.user.displayName);
  } catch (err) {
    setText("login-error", err.message);
    enable("login-submit-btn");
    document.getElementById("login-link").classList.toggle("disabled");
  }
};

// Tools function used in both register and login
function setText(id, text) {
  document.getElementById(id).innerText = text;
}

function validate(condition, idErrorTag, messageError) {
  if (condition) {
    setText(idErrorTag, "");
    return true;
  } else {
    setText(idErrorTag, messageError);
    return false;
  }
}

function disable(id) {
  document.getElementById(id).setAttribute("disabled", true);
}

function enable(id) {
  document.getElementById(id).removeAttribute("disabled");
}

function allPassed(validateResult) {
  for (let validate of validateResult) {
    if (!validate) {
      return false;
    }
  }
  return true;
}
