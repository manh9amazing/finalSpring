//wishList.js
//Purpose: Functionality of the wish list page. Takes in and stores wish list sets of users using interaction with firebase.
//Version: wishListFinal  Date: 5/27/2021
//Author(s): Dat Nguyen, Mike Nguyen
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

async function main(user) {
  let sumPrice = 0;

  const planDoc = await db.collection("plans").doc(user.email).get();
  let planData;
  let income;

  if (planDoc.exists) {
    planData = transformDoc(planDoc);
    income = planData.income;
  }

  const titleWarning = document.getElementById("title-warning");
  const captionWarning = document.getElementById("caption-warning");
  const itemList = document.querySelector("#item-list");
  const form = document.querySelector("#wish-list-form");

  function renderItem(doc) {
    let li = document.createElement("li");
    let item = document.createElement("span");
    let quantity = document.createElement("span");
    let where = document.createElement("span");
    let price = document.createElement("span");
    let cross = document.createElement("div");

    li.setAttribute("data-id", doc.id);
    item.textContent = doc.data().item;
    quantity.textContent = doc.data().quantity;
    where.textContent = doc.data().where;
    price.textContent = doc.data().price;
    cross.textContent = "x";

    li.appendChild(item);
    li.appendChild(quantity);
    li.appendChild(where);
    li.appendChild(price);
    li.appendChild(cross);

    itemList.appendChild(li);
    cross.addEventListener("click", (e) => {
      e.stopPropagation();
      let id = e.target.parentElement.getAttribute("data-id");
      db.collection("wishlist").doc(id).delete();
    });
  }

  //realtime - database
  db.collection("wishlist")
    .orderBy("price", "desc")
    .onSnapshot((snapshot) => {
      let changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (change.type == "added" && change.doc.data().owner == user.email) {
          renderItem(change.doc);

          sumPrice += change.doc.data().price * change.doc.data().quantity;
          if (
            income != undefined &&
            income != null &&
            income != NaN &&
            income != 0
          ) {
            if (sumPrice > income) {
              if (titleWarning.classList.contains("hide")) {
                titleWarning.classList.toggle("hide");
                captionWarning.classList.toggle("hide");
              }
            }
          }
        } else if (change.type == "removed") {
          // let li = itemList.querySelector("[data-id=" + change.doc.id + "]");
          let li = getElementByAttribute("data-id", change.doc.id, itemList);
          itemList.removeChild(li);

          sumPrice -= change.doc.data().price * change.doc.data().quantity;
          if (
            income != undefined &&
            income != null &&
            income != NaN &&
            income != 0
          ) {
            if (sumPrice <= income) {
              if (!titleWarning.classList.contains("hide")) {
                titleWarning.classList.toggle("hide");
                captionWarning.classList.toggle("hide");
              }
            }
          }
        }
      });
    });

  //save data
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
      form.item.value != "" &&
      form.quantity.value != "" &&
      form.where.value != "" &&
      form.price.value != ""
    ) {
      db.collection("wishlist").add({
        owner: user.email,
        item: form.item.value,
        quantity: parseInt(form.quantity.value),
        where: form.where.value,
        price: parseInt(form.price.value),
      });
      form.item.value = "";
      form.quantity.value = "";
      form.where.value = "";
      form.price.value = "";
    } else {
      alert("You must fill the whole form");
    }
  });
}

// Tools functions
function getElementByAttribute(attr, value, root) {
  root = root || document.body;
  if (root.hasAttribute(attr) && root.getAttribute(attr) == value) {
    return root;
  }
  var children = root.children,
    element;
  for (var i = children.length; i--; ) {
    element = getElementByAttribute(attr, value, children[i]);
    if (element) {
      return element;
    }
  }
  return null;
}

function transformDoc(firestoreDoc) {
  let data = firestoreDoc.data();
  data.id = firestoreDoc.id;
  return data;
}
