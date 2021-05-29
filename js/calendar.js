//calendar.js
//Purpose: Presents a calendar to the user. Can take in data from the user to plug in as events for days on the calendar.
//Version: addedHeaderComments  Date: 5/14/2021
//Author(s): DatDo Nguyen, Mike Nguyen
//Dependencies: Javascript


var addNewDay = function (day, month, year) {
  mName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // retrieve it (Or create a blank array if there isn't any info saved yet),
  var daysList = JSON.parse(localStorage.getItem("daysList")) || [];
  // add to it,
  var itemValue = String(day) + " of " + mName[month] + ", " + String(year);
  if (!daysList.includes(itemValue)) {
    daysList.push(itemValue);
  }
  // then put it back.
  localStorage.setItem("daysList", JSON.stringify(daysList));
};

var delDay = function (day, month, year) {
  mName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var daysList = JSON.parse(localStorage.getItem("daysList")) || [];
  var itemValue = String(day) + " of " + mName[month] + ", " + String(year);
  var index = daysList.indexOf(itemValue);
  if (index > -1) {
    daysList.splice(index, 1);
  }
  localStorage.setItem("daysList", JSON.stringify(daysList));
};

var cal = {
  // (A) PROPERTIES
  mName: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ], // Month Names
  data: null, // Events for the selected period
  sDay: 0, // Current selected day
  sMth: 0, // Current selected month
  sYear: 0, // Current selected year
  sMon: false, // Week start on Monday?

  // (B) DRAW CALENDAR FOR SELECTED MONTH
  list: function () {
    // (B1) BASIC CALCULATIONS - DAYS IN MONTH, START + END DAY
    // Note - Jan is 0 & Dec is 11 in JS.
    // Note - Sun is 0 & Sat is 6
    cal.sMth = parseInt(document.getElementById("cal-mth").value); // selected month
    cal.sYear = parseInt(document.getElementById("cal-yr").value); // selected year
    var daysInMth = new Date(cal.sYear, cal.sMth + 1, 0).getDate(), // number of days in selected month
      startDay = new Date(cal.sYear, cal.sMth, 1).getDay(), // first day of the month
      endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay(); // last day of the month

    // (B2) LOAD DATA FROM LOCALSTORAGE
    cal.data = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);

    if (cal.data == null) {
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, "{}");
      cal.data = {};
    } else {
      cal.data = JSON.parse(cal.data);
    }

    // (B3) DRAWING CALCULATIONS
    // Determine the number of blank squares before start of month
    var squares = [];
    if (cal.sMon && startDay != 1) {
      var blanks = startDay == 0 ? 7 : startDay;
      for (var i = 1; i < blanks; i++) {
        squares.push("b");
      }
    }
    if (!cal.sMon && startDay != 0) {
      for (var i = 0; i < startDay; i++) {
        squares.push("b");
      }
    }

    // Populate the days of the month
    for (var i = 1; i <= daysInMth; i++) {
      squares.push(i);
    }

    // Determine the number of blank squares after end of month
    if (cal.sMon && endDay != 0) {
      var blanks = endDay == 6 ? 1 : 7 - endDay;
      for (var i = 0; i < blanks; i++) {
        squares.push("b");
      }
    }
    if (!cal.sMon && endDay != 6) {
      var blanks = endDay == 0 ? 6 : 6 - endDay;
      for (var i = 0; i < blanks; i++) {
        squares.push("b");
      }
    }

    // (B4) DRAW HTML CALENDAR
    // Container
    var container = document.getElementById("cal-container"),
      cTable = document.createElement("table");
    cTable.id = "calendar";
    container.innerHTML = "";
    container.appendChild(cTable);

    // First row - Day names
    var cRow = document.createElement("tr"),
      cCell = null,
      days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    if (cal.sMon) {
      days.push(days.shift());
    }
    for (var d of days) {
      cCell = document.createElement("td");
      cCell.innerHTML = d;
      cRow.appendChild(cCell);
    }
    cRow.classList.add("head");
    cTable.appendChild(cRow);

    // Days in Month
    var total = squares.length;
    cRow = document.createElement("tr");
    cRow.classList.add("day");
    for (var i = 0; i < total; i++) {
      cCell = document.createElement("td");
      if (squares[i] == "b") {
        cCell.classList.add("blank");
      } else {
        cCell.innerHTML = "<div class='dd'>" + squares[i] + "</div>";
        if (cal.data[squares[i]]) {
          cCell.innerHTML +=
            "<div class='evt'>" + cal.data[squares[i]] + "</div>";
        }
        cCell.addEventListener("click", function () {
          cal.show(this);
        });
      }
      cRow.appendChild(cCell);
      if (i != 0 && (i + 1) % 7 == 0) {
        cTable.appendChild(cRow);
        cRow = document.createElement("tr");
        cRow.classList.add("day");
      }
    }

    //EXTRA: show changes in side-information a.k.a plans lists/ days list
    var plansList = document.getElementById("plans-list");
    var daysList = JSON.parse(localStorage.getItem("daysList")) || [];
    plansList.innerHTML = "";
    for (i = 0; i < daysList.length; i++) {
      plansList.innerHTML += "<div>" + daysList[i] + "</div>";
    }

    // (B5) REMOVE ANY PREVIOUS ADD/EDIT EVENT DOCKET
    cal.close();
  },

  // (C) SHOW EDIT EVENT DOCKET FOR SELECTED DAY
  show: function (el) {
    // (C1) FETCH EXISTING DATA
    cal.sDay = el.getElementsByClassName("dd")[0].innerHTML;

    // (C2) DRAW EVENT FORM
    var tForm = "<h1>" + (cal.data[cal.sDay] ? "EDIT" : "ADD") + " EVENT</h1>";
    tForm +=
      "<div id='evt-date'>" +
      cal.sDay +
      " " +
      cal.mName[cal.sMth] +
      " " +
      cal.sYear +
      "</div>";
    tForm +=
      "<textarea id='evt-details' required>" +
      (cal.data[cal.sDay] ? cal.data[cal.sDay] : "") +
      "</textarea>";
    tForm +=
      "<input class='hoverOpa' type='button' value='Close' onclick='cal.close()'/>";
    tForm +=
      "<input class='hoverOpa' type='button' value='Delete' onclick='cal.del()'/>";
    tForm += "<input class='hoverOpa' type='submit' value='Save'/><br>";

    //add class for input above to use css hover
    tForm += `
    <div>Save Options:</div>
    <input type='radio' id='one' name='option' value='one'/>
    <label for='one'>One day only</label><br>
    <input type='radio' id='multiple' name='option' value='multiple'/>
    <label for='multiple'>Multiple days</label><br>
    <textarea id="days-repeat" class="hidden" rows="5"
    placeholder="Please enter other dates (M/D/Y) you want to repeat the event. Remember to separate the dates by comma.
    Example: 4/3/2021,5/6/2021,..."></textarea>
    `;
    // (C3) ATTACH EVENT FORM
    var eForm = document.createElement("form");
    eForm.addEventListener("submit", cal.save);
    eForm.innerHTML = tForm;
    var container = document.getElementById("cal-event");
    container.innerHTML = "";
    container.appendChild(eForm);

    let defaultOpt = document.getElementById("one");
    let multipleOpt = document.getElementById("multiple");
    if (defaultOpt != null) {
      defaultOpt.checked = true;
    }
    defaultOpt.addEventListener("change", function () {
      document.getElementById("days-repeat").classList.toggle("hidden");
    });
    multipleOpt.addEventListener("change", function () {
      document.getElementById("days-repeat").classList.toggle("hidden");
    });
  },

  // (D) CLOSE EVENT DOCKET
  close: function () {
    document.getElementById("cal-event").innerHTML = "";
  },

  // (E) SAVE EVENT
  save: function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    // there are two options saving event: saving for only one day and saving for multiple days
    let oneOpt = document.getElementById("one");
    let multipleOpt = document.getElementById("multiple");
    if (oneOpt.checked) {
      cal.data[cal.sDay] = document.getElementById("evt-details").value;
      localStorage.setItem(
        "cal-" + cal.sMth + "-" + cal.sYear,
        JSON.stringify(cal.data)
      );
      addNewDay(cal.sDay, cal.sMth, cal.sYear);
      cal.list();
    }
    if (multipleOpt.checked) {
      //add selected days first
      cal.data[cal.sDay] = document.getElementById("evt-details").value;
      localStorage.setItem(
        "cal-" + cal.sMth + "-" + cal.sYear,
        JSON.stringify(cal.data)
      );
      addNewDay(cal.sDay, cal.sMth, cal.sYear);

      //repeat for days in the input
      let daysRepeat = document.getElementById("days-repeat").value;
      let daysRepList = daysRepeat.split(",");
      let sharedEvent = document.getElementById("evt-details").value;
      for (i = 0; i < daysRepList.length; i++) {
        let dayInfo = daysRepList[i].split("/");
        try {
          month = parseInt(dayInfo[0]);
          day = parseInt(dayInfo[1]);
          year = parseInt(dayInfo[2]);
          //Catch all errors possible
          if (isNaN(day) || isNaN(month) || isNaN(year)) {
            throw "Please look at our format again. Day, month, and year should all be numbers. Remove unnecessary commas and space.";
          }
          if (month < 1 || day < 1 || year < 1) {
            throw "We do not have zero or negative day, month or year.";
          }
          if (1990 > year > 1 || year > 2050) {
            throw "We do not support this year range. Please select another year.";
          }
          let conditionOne =
            [1, 3, 5, 7, 8, 10, 12].includes(month) && day > 31;
          let conditionTwo = [4, 6, 9, 11].includes(month) && day > 30;
          let conditionThree =
            month == 2 &&
            ((year % 4 == 0 && day > 29) || (year % 4 != 0 && day > 28));
          if (conditionOne || conditionTwo || conditionThree) {
            throw "Please take notes of how many days in a specific month.";
          }

          //Start saving events to dates
          let tempData = JSON.parse(
            localStorage.getItem("cal-" + (month - 1) + "-" + year)
          );
          if (tempData == null) {
            tempData = {};
          }
          console.log(sharedEvent);
          console.log(day);
          tempData[day] = sharedEvent;
          console.log(tempData);
          // console.log(tempData)
          localStorage.setItem(
            "cal-" + (month - 1) + "-" + year,
            JSON.stringify(tempData)
          );
          addNewDay(day, month - 1, year);
        } catch (err) {
          alert(err);
          break;
        }
      }
      cal.list();
    }
    // console.log(localStorage);
  },

  // (F) DELETE EVENT FOR SELECTED DATE
  del: function () {
    if (confirm("Remove event?")) {
      delDay(cal.sDay, cal.sMth, cal.sYear);
      delete cal.data[cal.sDay];
      localStorage.setItem(
        "cal-" + cal.sMth + "-" + cal.sYear,
        JSON.stringify(cal.data)
      );
      cal.list();
      //   console.log(localStorage);
    }
  },
};

// (G) INIT - DRAW MONTH & YEAR SELECTOR
window.addEventListener("load", function () {
  // (G1) DATE NOW
  var now = new Date(),
    nowMth = now.getMonth(),
    nowYear = parseInt(now.getFullYear());

  // (G2) APPEND MONTHS SELECTOR
  var month = document.getElementById("cal-mth");
  for (var i = 0; i < 12; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = cal.mName[i];
    if (i == nowMth) {
      opt.selected = true;
    }
    month.appendChild(opt);
  }

  // (G3) APPEND YEARS SELECTOR
  // Set to 10 years range. Change this as you like.
  var year = document.getElementById("cal-yr");
  for (var i = nowYear - 10; i <= nowYear + 10; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = i;
    if (i == nowYear) {
      opt.selected = true;
    }
    year.appendChild(opt);
  }

  // (G4) START - DRAW CALENDAR
  document.getElementById("cal-set").addEventListener("click", cal.list);
  cal.list();
});
