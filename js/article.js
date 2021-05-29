//article.js
//Purpose: Adds in the hiding and revealing feature of the article texts.
//Version: addedHeaderComments  Date: 5/14/2021
//Author(s): Dat Nguyen
//Dependencies: Javascript


//Can toggle the hide event ...
function domainExpansion(info) {
  info.nextElementSibling.classList.toggle("hide");
  info.classList.toggle("hide");
}
//Hides the event
function evtHide(info) {
  info.classList.toggle("hide");
  info.previousElementSibling.classList.toggle("hide");
}
