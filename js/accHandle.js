//accHandle.js
//Purpose: Functionally of checking the account of the user on the page. Checks if the user is signed in and if not sent to registration page.
//Version: addedHeaderComments  Date: 5/14/2021
//Author(s): Mike Nguyen, Andy Nguyen, Datdo Nguyen, Dat Nguyen
//Dependencies: Javascript


window.onload = init;
function init() {
  firebase.auth().onAuthStateChanged(authStateChangeHandler);
  function authStateChangeHandler(user) {
    if (user && user.emailVerified) {
      return;
    } else {
      location.replace("../html/register.html");
    }
  }
}
