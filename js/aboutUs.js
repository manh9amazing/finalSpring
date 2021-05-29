//aboutUs.js
//Purpose: Main functionally of the aboutUs page. Takes in user data and stores it in firebase for the user feedback on the website.
//Version: addedHeaderComments  Date: 5/14/2021
//Author(s): Mike Nguyen, Andy Nguyen, Datdo Nguyen, Dat Nguyen
//Dependencies: Javascript


window.onload = init;
function init() {
  firebase.auth().onAuthStateChanged(authStateChangeHandler);
  function authStateChangeHandler(user) {
    if (user && user.emailVerified) {
      user = firebase.auth().currentUser;
      main(user);
    } else {
      location.replace("../html/register.html");
    }
  }
}

// Window (object supported by all browsers)
// AddeventListener to user of feedback on form.

//Main function that takes in user.
function main(user) {
  var form = document.getElementById("feedbackForm");
  //Gets the element feedbackFrom and assigns it to variable form.
  formSubmitHandler = async function (e) {
    e.preventDefault();
    disable("feedbackBtn");
    let newFeed = {
      mail: form.email.value,
      name: form.name.value,
      content: form.feedback.value,
      createdAt: new Date().toISOString(),
      status: "unfinished",
    };
    //Add feedback to firestore data base.
    await firebase.firestore().collection("feedbacks").add(newFeed);
    await firebase
      .firestore()
      .collection("counters")
      .doc("feedbackCnt")
      .update({ unfinishedCnt: firebase.firestore.FieldValue.increment(1) });
    alert("Thank you for your feedback! We will make it better.");
    enable("feedbackBtn");
  };
  form.onsubmit = formSubmitHandler;
}

function disable(id) {
  document.getElementById(id).setAttribute("disabled", true);
}

function enable(id) {
  document.getElementById(id).removeAttribute("disabled");
}
