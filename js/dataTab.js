//dataTab.js
//Purpose: Takes input from the user and inputs it into the data Tables. The Data tables page can also take in data from the user and change it.
//Version: Get_Started_dataTab.js  Date: 5/14/2021
//Author(s): Andy Nguyen
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

function main(user){
    
}