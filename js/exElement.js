//exElement.js
//Purpose: Control functionality of the adminstration requirements. Checks the level of the user and if the password inputted is correct in order to unlock admin page.
//Version: addedHeaderComments  Date: 5/14/2021
//Author(s): Mike Nguyen
//Dependencies: Javascript


window.addEventListener("load", function () {
  logOutBtn = document.getElementById("logout-btn");
  logout = function () {
    localStorage.setItem("email", "");
    localStorage.setItem("name", "");
    localStorage.setItem("accLevel", "");
    firebase.auth().signOut();
  };
  logOutBtn.onclick = logout;

  adminCheck();
});

async function adminCheck() {
  var email = localStorage.getItem("email");
  let ref = await firebase
    .firestore()
    .collection("users")
    .where("mail", "==", email)
    .get();
  let userID = ref.docs[0].id;
  let doc = await firebase.firestore().collection("users").doc(userID).get();
  let user = transformDoc(doc);
  let accLevel = user.accLevel;
  localStorage.setItem("accLevel", accLevel);
  if (accLevel == "admin") {
    document.getElementById(
      "secret-tab"
    ).innerHTML += `<a id="secret-link">Admin<img src="../assets/home/crown.png" class="y-down"></a>`;
    secretLink = document.getElementById("secret-link");
    if (secretLink) {
      secretLink.onclick = function () {
        password = prompt("What is the admin special code?");
        if (password == "madd") {
          location.replace("../html/admin.html");
        } else {
          return;
        }
      };
    }
  }
}

function transformDoc(firestoreDoc) {
  let data = firestoreDoc.data();
  data.id = firestoreDoc.id;
  return data;
}
