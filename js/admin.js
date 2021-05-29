//admin.js
//Purpose: Functionality of the adminstration page. Takes in and stores the users who create accounts, the adminstration, and emails.
//Version: addedHeaderComments  Date: 5/14/2021
//Author(s): Mike Nguyen, Andy Nguyen, DatDo Nguyen, Dat Nguyen
//Dependencies: Javascript

window.onload = init;
function init() {
  firebase.auth().onAuthStateChanged(authStateChangeHandler);
  function authStateChangeHandler(user) {
    let accLevel = localStorage.getItem("accLevel");
    if (user && user.emailVerified) {
      if (accLevel != "admin") {
        location.replace("../html/index.html");
      } else {
        user = firebase.auth().currentUser;
        main(user);
      }
    } else {
      location.replace("../html/register.html");
    }
  }
}

//Async means that the order in which the computer reads the script starts differently. Instead, the computer starts here to present data first.
async function main(user) {
  //-------------------------------I.User Collection---------------------------------------------
  let usersCntDoc = await firebase
    .firestore()
    .collection("counters")
    .doc("usersCnt")
    .get();
  //Number of users.
  let usersCntData = transformDoc(usersCntDoc);
  let usersCount = usersCntData.value;
  document.getElementById("numUsers").innerHTML = "";
  document.getElementById("numUsers").innerHTML +=
    `<span class="content-title">Number of users: </span>` + String(usersCount);

  let userTable = document.getElementById("userTable");
  let userCol = await firebase
    .firestore()
    .collection("users")
    .limit(usersCount)
    .get();
  //Each time a new user account is created, add to the count.
  for (i = 0; i < usersCount; i++) {
    let tempId = userCol.docs[i].id;
    let userInfoDoc = await firebase
      .firestore()
      .collection("users")
      .doc(tempId)
      .get();
    let userInfo = transformDoc(userInfoDoc);
    let name = userInfo.name;
    let mail = userInfo.mail;
    userTable.innerHTML += `                    
    <tr>
      <td>${name}</td>
      <td>${mail}</td>
    </tr>
    `;
  }

  //--------------------------------II.Feedback Section------------------------------------------
  let feedbackCntDoc = await firebase
    .firestore()
    .collection("counters")
    .doc("feedbackCnt")
    .get();
  let feedbackCntData = transformDoc(feedbackCntDoc);
  let unfinishedFB = feedbackCntData.unfinishedCnt;
  let finishedFB = feedbackCntData.finishedCnt;

  let unfinishedSect = document.getElementById("unfinished-feedback-section");
  let finishedSect = document.getElementById("finished-feedback-section");

  let orderedFeedback = await firebase
    .firestore()
    .collection("feedbacks")
    .orderBy("createdAt", "desc")
    .limit(unfinishedFB + finishedFB)
    .get();
  let unfinishedRendered = 0;
  let finishedRendered = 0;
  let unfinishedIdList = [];
  for (i = 0; i < unfinishedFB + finishedFB; i++) {
    let tempId = orderedFeedback.docs[i].id;
    let feedbackInfoDoc = await firebase
      .firestore()
      .collection("feedbacks")
      .doc(tempId)
      .get();
    let feedbackInfo = transformDoc(feedbackInfoDoc);
    let status = feedbackInfo.status;
    let name = feedbackInfo.name;
    let mail = feedbackInfo.mail;
    let time = feedbackInfo.createdAt;
    let content = feedbackInfo.content;
    if (status == "unfinished") {
      unfinishedSect.innerHTML += `
      <h3>Feedback #${unfinishedRendered + 1}</h3> 
      <div class="feedback-container" id="${tempId}">
        <div><span class="content-title">User Name: </span>${name}</div>
        <div><span class="content-title">Contact Mail: </span><a href="https://mail.google.com/mail/?view=cm&fs=1&to=${mail}" target="_blank">${mail}</a></div>
        <div><span class="content-title">Time: </span>${time}</div>
        <div><span class="content-title">Feedback: </span> <br> ${content}</div>
        <div><span class="content-title">Status: </span> <div id="status" class="unfinished">unfinished</div></div>
        <button id="solve-btn-${tempId}">Solved!</button>
      </div>
      `;
      unfinishedIdList.push(tempId);
      unfinishedRendered++;
    }
    if (status == "finished") {
      finishedSect.innerHTML += `
      <h3>Feedback #${finishedRendered + 1 + unfinishedFB}</h3> 
      <div class="feedback-container" id="${tempId}">
        <div><span class="content-title">User Name: </span>${name}</div>
        <div><span class="content-title">Contact Mail: </span><a href="https://mail.google.com/mail/?view=cm&fs=1&to=${mail}" target="_blank">${mail}</a></div>
        <div><span class="content-title">Time: </span>${time}</div>
        <div><span class="content-title">Feedback: </span> <br> ${content}</div>
        <div><span class="content-title">Status: </span> <div id="status" class="finished">finished</div></div>
        <button id="solve-btn-${tempId}" class="disabled">Solved!</button>
      </div>
      `;
      document
        .getElementById("solve-btn-" + tempId)
        .setAttribute("disabled", true);
      finishedRendered++;
    }
  }
  for (i = 0; i < unfinishedIdList.length; i++) {
    let solveBtn = document.getElementById("solve-btn-" + unfinishedIdList[i]);
    solveBtn.addEventListener("click", async function () {
      affirmation = confirm(
        "Are you 100% sure that you have done dealing with this problems and totally satisfied our customers?"
      );
      if (affirmation) {
        let tempId = solveBtn.parentNode.id;
        solveBtn.setAttribute("disabled", true);
        await firebase
          .firestore()
          .collection("counters")
          .doc("feedbackCnt")
          .update({
            unfinishedCnt: firebase.firestore.FieldValue.increment(-1),
            finishedCnt: firebase.firestore.FieldValue.increment(1),
          });
        await firebase
          .firestore()
          .collection("feedbacks")
          .doc(tempId)
          .update({ status: "finished" });
        location.reload();
      } else {
        return;
      }
    });
  }
}

function transformDoc(firestoreDoc) {
  let data = firestoreDoc.data();
  data.id = firestoreDoc.id;
  return data;
}
