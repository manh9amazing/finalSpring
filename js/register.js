//register.js
//Purpose: Create the functions for the registation page. Validates if the input is correct and registers the users data on firebase server. Used to create the account for the user.
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
  let link = document.getElementById("register-link");
  link.onclick = linkClickHandler;

  let form = document.getElementById("register-form");
  form.onsubmit = formSubmitHandler;

  function linkClickHandler() {
    location.replace("../html/login.html");
  }

  function formSubmitHandler(event) {
    event.preventDefault();
    let registerInfo = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      password: form.password.value,
      confirmPassword: form.confirmPassword.value,
    };
    // console.log(registerInfo);
    let validateResult = [
      validate(
        registerInfo.firstName,
        "firstname-error",
        "First Name is needed"
      ),
      validate(registerInfo.lastName, "lastname-error", "Last Name is needed"),
      validate(
        registerInfo.email && registerInfo.email.includes("@"),
        "email-error",
        "Please enter a viable email"
      ),
      validate(
        registerInfo.password && registerInfo.password.length >= 6,
        "password-error",
        "Password is needed and must be more than 6 characters"
      ),
      validate(
        registerInfo.confirmPassword &&
          registerInfo.confirmPassword.length >= 6 &&
          registerInfo.confirmPassword == registerInfo.password,
        "confirm-password-error",
        "Confirm Password is needed and must be the same as Password"
      ),
    ];

    if (allPassed(validateResult)) {
      register(registerInfo);
    }
  }
});

register = async function (registerInfo) {
  let email = registerInfo.email;
  let password = registerInfo.password;
  let displayName = registerInfo.firstName + " " + registerInfo.lastName;
  setText("register-error", "");
  setText("register-success", "");
  disable("register-submit-btn");
  document.getElementById("register-link").classList.toggle("disabled");
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    await firebase.auth().currentUser.updateProfile({
      displayName: displayName,
    });
    await firebase.auth().currentUser.sendEmailVerification();
    let newUser = {
      mail: email,
      name: displayName,
      budgetPlan: {},
      bookmarks: [],
      accLevel: "normal",
    };
    await firebase.firestore().collection("users").add(newUser);
    await firebase
      .firestore()
      .collection("counters")
      .doc("usersCnt")
      .update({ value: firebase.firestore.FieldValue.increment(1) });
    // console.log("number of users increasing by 1");
    firebase.auth().signOut();
    setText(
      "register-success",
      "An email verification has been sent to your email"
    );
  } catch (err) {
    setText("register-error", err.message);
  }
  enable("register-submit-btn");
  document.getElementById("register-link").classList.toggle("disabled");
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
