//budget.js
//Purpose: Takes in the data input from the budget of the user. Than stores it on firebase. Manipulates data based off of savings alorgithms and presents it back to the user in the form of a piechart.
//Version: addedHeaderComments  Date: 5/14/2021
//Author(s): DatDo Nguyen, Mike Nguyen, Andy Nguyen
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

function main(user) {
  let budgetStyle = "norm";
  loadDataFromServer(user);

  //different percentage for need, want, save respectively in each budgeting style
  let budgetStylePercent = { norm: [50, 30, 20], prog: [60, 10, 30] };

  normBtn = document.getElementById("norm");
  progBtn = document.getElementById("prog");
  normBtn.addEventListener("click", () => {
    progBtn.style.opacity = "30%";
    normBtn.style.opacity = "100%";
    budgetStyle = "norm";
  });

  progBtn.addEventListener("click", () => {
    progBtn.style.opacity = "100%";
    normBtn.style.opacity = "30%";
    budgetStyle = "prog";
  });

  let elementsArray = document.querySelectorAll(".btn-list");
  btnNeed = document.getElementById("btnNeed");
  inputNeed = document.getElementById("txtNeed");
  listNeed = document.getElementById("containerNeed");
  priorityNeed = document.getElementById("numNeed");
  btnWant = document.getElementById("btnWant");
  inputWant = document.getElementById("txtWant");
  listWant = document.getElementById("containerWant");
  priorityWant = document.getElementById("numWant");
  btnSave = document.getElementById("btnSave");
  inputSave = document.getElementById("txtSave");
  listSave = document.getElementById("containerSave");
  prioritySave = document.getElementById("numSave");
  elementsArray.forEach(function (elem) {
    elem.addEventListener("click", function (e) {
      e.preventDefault();
      tempId = elem.parentNode.id;
      if (tempId == "formNeed") {
        inputText = inputNeed;
        list = listNeed;
        priority = priorityNeed;
      } else if (tempId == "formWant") {
        inputText = inputWant;
        list = listWant;
        priority = priorityWant;
      } else {
        inputText = inputSave;
        list = listSave;
        priority = prioritySave;
      }
      if (inputText.value != "") {
        const myLi = document.createElement("li");
        myLi.innerHTML =
          priority.value +
          "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" +
          inputText.value;
        list.appendChild(myLi);
        const mySpan = document.createElement("span");
        mySpan.id = "innerInput";
        mySpan.innerHTML = "x";
        myLi.appendChild(mySpan);
      }
      const close = document.querySelectorAll("span");
      for (let i = 0; i < close.length; i++) {
        close[i].addEventListener("click", () => {
          close[i].parentElement.style.opacity = 0;
          setTimeout(() => {
            close[i].parentElement.style.display = "none";
          }, 500);
        });
      }
      inputText.value = "";
      priority.value = "";
    });
  });
  const saveButton = document.querySelector("#save");
  saveButton.addEventListener("click", (e) => {
    const close = document.querySelectorAll("span");
    const incomeInput = document.getElementById("income");
    var income = incomeInput.value;
    var dataList = [];
    for (let i = 0; i < close.length; i++) {
      if (
        close[i].parentElement.style.display == "none" ||
        close[i].id != "innerInput"
      )
        continue;
      else {
        var process = close[i].parentElement.innerText;
        var parentId = close[i].previousSibling.parentElement.parentElement.id;
        dataList.push(processString(process, parentId));
      }
    }
    var totalPriorityNeed = 0;
    var totalPriorityWant = 0;
    var totalPrioritySave = 0;
    var numberItemNeed = 0;
    var numberItemWant = 0;
    var numberItemSave = 0;
    var extraSave = 0;
    // process the dataList to print the algorithm
    for (var i = 0; i < dataList.length; i++) {
      tempParentId = dataList[i][2];
      if (tempParentId == "containerNeed") {
        totalPriorityNeed += dataList[i][0];
        numberItemNeed++;
      } else if (tempParentId == "containerWant") {
        totalPriorityWant += dataList[i][0];
        numberItemWant++;
      } else {
        totalPrioritySave += dataList[i][0];
        numberItemSave++;
      } // get sum of priority for each type
    }

    if (numberItemNeed == 0) {
      extraSave += (income / 100) * budgetStylePercent[budgetStyle][0];
    }
    if (numberItemWant == 0) {
      extraSave += (income / 100) * budgetStylePercent[budgetStyle][1];
    }
    if (numberItemSave == 0) {
      extraSave += (income / 100) * budgetStylePercent[budgetStyle][2];
    }

    for (var i = 0; i < dataList.length; i++) {
      tempParentId = dataList[i][2];
      if (tempParentId == "containerNeed") {
        dataList[i][3] = dataList[i][0];
        dataList[i][0] = intToFloat(
          (numberItemNeed + 1 - dataList[i][0]) / totalPriorityNeed,
          2
        );
        dataList[i][0] = Math.floor(
          ((dataList[i][0] * income) / 100) * budgetStylePercent[budgetStyle][0]
        );
      } else if (tempParentId == "containerWant") {
        dataList[i][3] = dataList[i][0];
        dataList[i][0] = intToFloat(
          (numberItemWant + 1 - dataList[i][0]) / totalPriorityWant,
          2
        );
        dataList[i][0] = Math.floor(
          ((dataList[i][0] * income) / 100) * budgetStylePercent[budgetStyle][1]
        );
      } else {
        dataList[i][3] = dataList[i][0];
        dataList[i][0] = intToFloat(
          (numberItemSave + 1 - dataList[i][0]) / totalPrioritySave,
          2
        );
        dataList[i][0] = Math.floor(
          ((dataList[i][0] * income) / 100) * budgetStylePercent[budgetStyle][2]
        );
      } // get sum of priority for each type
    }

    if (extraSave > 0) {
      dataList.push([extraSave, "EXTRA SAVING", null]);
    }
    saveToServer(dataList, user, budgetStyle);
    displayChart(dataList);
  });
}

async function loadDataFromServer(user) {
  let doc = await firebase
    .firestore()
    .collection("plans")
    .doc(user.email)
    .get();
  if (doc.exists) {
    let plan = transformDoc(doc);
    let planData = plan.planData;
    let budgetStyle = plan.style;
    let styleBtn = document.getElementById(budgetStyle);
    styleBtn.click();
    // get back data list structure
    planList = [];
    for (const [key, value] of Object.entries(planData)) {
      planList.push(value);
      if (value[2] != null) {
        ulContainer = document.getElementById(value[2]);
        priority = value[3];
        inputText = value[1];
        if (inputText.value != "") {
          const myLi = document.createElement("li");
          myLi.innerHTML =
            priority +
            "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" +
            inputText;
          ulContainer.appendChild(myLi);
          const mySpan = document.createElement("span");
          mySpan.id = "innerInput";
          mySpan.innerHTML = "x";
          myLi.appendChild(mySpan);
        }
        const close = document.querySelectorAll("span");
        for (let i = 0; i < close.length; i++) {
          close[i].addEventListener("click", () => {
            close[i].parentElement.style.opacity = 0;
            setTimeout(() => {
              close[i].parentElement.style.display = "none";
            }, 500);
          });
        }
      }
    }
    const incomeInput = document.getElementById("income");
    incomeInput.value = plan.income;
    displayChart(planList);
  }
}

async function saveToServer(dataList, user, budgetStyle) {
  // workaround as firebase do not accept nested array
  dataDict = {};
  for (i = 0; i < dataList.length; i++) {
    dataDict[i] = dataList[i];
  }
  const incomeInput = document.getElementById("income");
  var income = parseInt(incomeInput.value);
  newPlan = {
    owner: user.email,
    style: budgetStyle,
    income: income,
    planData: dataDict,
  };
  await firebase.firestore().collection("plans").doc(user.email).set(newPlan);
}

function displayChart(dataList) {
  var googleData = [["Name", "Priority"]];
  for (var i = 0; i < dataList.length; i++) {
    googleData.push([dataList[i][1], dataList[i][0]]);
  }
  google.charts.load("current", { packages: ["corechart"] });
  // draw charts
  google.charts.setOnLoadCallback(drawPie);
  google.charts.setOnLoadCallback(drawBar);
  google.charts.setOnLoadCallback(drawLine);

  // specific chart functions
  function drawPie() {
    var data = google.visualization.arrayToDataTable(googleData);
    var options = {
      backgroundColor: "#e8a880",
      title: "Recommendation based on the priority (plot on pie graph)",
      is3D: true,
    };
    var chart = new google.visualization.PieChart(
      document.getElementById("piechart_3d")
    );
    chart.draw(data, options);
  }

  function drawLine() {
    var data = google.visualization.arrayToDataTable(googleData);
    var options = {
      backgroundColor: "#32a852",
      title: "Recommendation based on the priority (plot on line graph)",
      legend: {
        position: "none",
      },
      hAxis: {
        title: "Expenses/Items to spend on",
        titleTextStyle: {
          color: "yellow",
          italic: false,
        },
      },
      vAxis: {
        title: "Amount of money (flexible unit)",
        titleTextStyle: {
          color: "yellow",
          italic: false,
        },
      },
    };
    var chart = new google.visualization.LineChart(
      document.getElementById("lineChart")
    );
    chart.draw(data, options);
  }

  function drawBar() {
    var data = google.visualization.arrayToDataTable(googleData);
    var options = {
      backgroundColor: "teal",
      title: "Recommendation based on the priority (plot on bar graph)",
      legend: {
        position: "none",
      },
      hAxis: {
        title: "Amount of money (flexible unit)",
        titleTextStyle: {
          color: "#ff9900",
          italic: false,
        },
      },
      vAxis: {
        title: "Expenses/Items to spend on",
        titleTextStyle: {
          color: "#ff9900",
          italic: false,
        },
      },
    };
    var chart = new google.visualization.BarChart(
      document.getElementById("barChart")
    );
    chart.draw(data, options);
  }
}

//Tools function
function intToFloat(num, decPlaces) {
  return num.toFixed(decPlaces);
}

function processString(textString, parentId) {
  var len = textString.length;
  var num = "";
  var name = "";
  for (var i = 0; i < len; i++) {
    if (textString.charAt(i) == " ") break;
    else {
      num = num + textString.charAt(i);
    }
  }
  var check = 0;
  for (var i = 0; i < len; i++) {
    if (
      check == 1 &&
      (textString.charAt(i) == "\u00A0" || textString.charAt(i) == "\n")
    ) {
      break;
    }
    if (check == 1) {
      name = name + textString.charAt(i);
      continue;
    }
    if (
      textString.charAt(i) === "\u00A0" &&
      textString.charAt(i + 1) != "\u00A0"
    ) {
      check = 1;
    }
  }
  return [parseInt(num), name, parentId];
}

function transformDoc(firestoreDoc) {
  let data = firestoreDoc.data();
  data.id = firestoreDoc.id;
  return data;
}
