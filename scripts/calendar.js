//-------------
//const and var
//-------------
var userID;
var reminderList = [];
const calendar = document.querySelector("#app-calendar");
const months = [
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
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fulldays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var today = new Date(Date.now());
var month = today.getMonth();
var date = today.getDate();
var year = today.getFullYear();
var day = today.getDay();
var firstday = new Date(year, month, 1);
var lastday = new Date(year, month + 1, 0);

const nth = function (d) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const isWeekend = (block) => {
  return (
    block % 7 === (1 + (7 - firstday.getDay())) % 7 ||
    block % 7 === 7 - firstday.getDay()
  );
};

const istoday = (block) => {
  return (
    today.getFullYear() == year &&
    today.getMonth() == month &&
    block === date
  );
};

//-------------------------------------------------
//---------------function and code-----------------
//-------------------------------------------------

//display todays date above calendar when first enter.
function displayDate() {
  //This is a conditional that will cause the display on top of calendar to change as the next and prev buttons are toggled.
  if (year == today.getFullYear() && month == today.getMonth()) {
    document.getElementById("date").innerHTML = year + " " + months[month] + " " + date + nth(date) + ", " + fulldays[day];
  } else {
    document.getElementById("date").innerHTML =
      year + " " + months[month];
  }
}

//clicking the button to the left of the date on top of the calendar will go back to previous month.
function go2PrevMonth() {
  //manipulating the month and year variable to show correct date and calendar.
  month -= 1;
  if (month < 0) {
    month = 11;
    year -= 1;
  }
  //Initializing first day(mon~sun) of the calendar for making date circles.
  firstday = new Date(year, month, 1);
  //calling displayDate function.
  displayDate();
  //emptying the date circles to create new date circles.
  document.getElementById("app-calendar").innerHTML = "";
  //calling getreminderCalendar, which will call fillcalendar and colour the circles.
  getReminderCalendar();
}

//clicking the button to the right of the date on top of the calendar will go up to next month.
function go2nextMonth() {
  //manipulating the month and year variable to show correct date and calendar.
  month += 1;
  if (month > 11) {
    month = 0;
    year += 1;
  }
  //Initializing first day(mon~sun) of the calendar for making date circles.
  firstday = new Date(year, month, 1);
  //calling displayDate function.
  displayDate();
  //emptying the date circles to create new date circles.
  document.getElementById("app-calendar").innerHTML = "";
  //calling getreminderCalendar, which will call fillcalendar and colour the circles.
  getReminderCalendar();
}

// Making calendar by using divs and dom. called by getReminderCalendar function
function fillCalendar() {
  //filling in the days of week
  for (let i = 0; i < 7; i++) {
    calendar.insertAdjacentHTML("beforeend",
      `<div class="date ${i == 0 || i == 6 ? "weekend" : ""}">${days[i]}</div>`);
  }
  //Making invisible divs for correct placement of first day of month.
  for (let xtrablock = 0; xtrablock < firstday.getDay(); xtrablock++) {
    calendar.insertAdjacentHTML("beforeend", `<div class="xtrablock"></div>`);
  }
  //making the date circles for the month.
  for (let block = 1; block <= monthdays[month]; block++) {
    const weekend = isWeekend(block); //check if weekend
    const now = istoday(block); //check if today
    calendar.insertAdjacentHTML("beforeend", //after existing element
      //first line makes an anchor with url of uid, year, month and date.
      //second line make div in the anchor, with class stating the day of week, weekend status and today status
      //third like prints the date in the div. 
      `<a class ="day" href="./day.html?uid=${userID}?${year}?${months[month]}?${block}"> 
                <div class="day${(firstday.getDay() + block - 1) % 7} block ${weekend ? "weekend" : ""} ${now ? "today" : ""}">
                ${block}</div></a>`
    );
  }
  //A logic for setting the height and grid row of calendar so that the date circles stay circular in shape.
  if (firstday.getDay() == 5 && monthdays[month] > 30 || firstday.getDay() == 6 && monthdays[month] >= 30) {
    document.getElementById('app-calendar').style.gridTemplateRows = `7.5% repeat(6, 1fr)`;
    document.getElementById('app-calendar').style.maxHeight = `75vh`;
    document.getElementById('app-calendar').style.height = `84.6vw`;
  } else {
    document.getElementById('app-calendar').style.gridTemplateRows = `9% repeat(5, 1fr)`;
    document.getElementById('app-calendar').style.height = `71.8vw`;
    document.getElementById('app-calendar').style.maxHeight = `65vh`;
  }
}

//get Active reminder from the firestore, sort by frequency, and colour the date circles accordingly.
function getReminderCalendar() {
  //check logged in.
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      userID = user.uid;
      fillCalendar(); //making date circles
      var activities = []; //initial array for storing active reminders, will be used to fill frequency specific array later. 
      var reminderRef = db.collection("reminders");
      //getting document from reminder collection where field has the current user uid and is active(true)
      reminderRef
        .where("UserID", "==", userID)
        .where("Active", "==", true)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            activities.push(doc.data()); //storing the firestore document to the local array.
          });
          //arrays for each frequency.
          let dailies = [];
          let weeklies = [];
          let biweeklies = [];
          activities.forEach((element) => { //Iterate over all reminders in activities array. putting reminders in to designated frequency array.     
            if (element.Frequency == "Daily") {
              dailies.push(new Date(element.TimeStamp));
            } else if (element.Frequency == "Weekly") {
              weeklies.push(new Date(element.TimeStamp));
            } else {
              biweeklies.push(new Date(element.TimeStamp));
            }
          });
          //colouring the valid date circles with addReminderClass function. 
          //daily reminders.
          for (let i = 0; i < dailies.length; i++) {
            //if it's is the next month, or longer after creation of reminder.
            if (
              year > dailies[i].getFullYear() ||
              (year == dailies[i].getFullYear() &&
                month > dailies[i].getMonth())
            ) {
              let dailychange = document.querySelectorAll(
                "#app-calendar .block"
              );
              //fill all date circles.
              for (let index = 0; index < dailychange.length; index++) {
                addReminderClass(dailychange, index);
              }
              //if it is the month when you created the reminder
            } else if (
              year == dailies[i].getFullYear() &&
              month == dailies[i].getMonth()
            ) {
              let dailychange = document.querySelectorAll(
                "#app-calendar .block"
              );
              //fill in date circles if it is after the day of creation.
              for (let index = 0; index < dailychange.length; index++) {
                if (
                  dailychange[index].innerHTML >= dailies[i].getDate()
                ) {
                  addReminderClass(dailychange, index);
                }
              }
            }
          }
          //weekly reminders.
          for (let i = 0; i < weeklies.length; i++) {
            //if it's is the next month, or longer after creation of reminder.
            if (
              year > weeklies[i].getFullYear() ||
              (year == weeklies[i].getFullYear() &&
                month > weeklies[i].getMonth())
            ) {
              let dailychange = document.querySelectorAll(
                "#app-calendar .block"
              );
              //fill in if the date circles have class of the same day of creation (mon, tues, etc)
              for (let index = 0; index < dailychange.length; index++) {
                if (
                  dailychange[index].classList.contains(
                    "day" + weeklies[i].getDay()
                  )
                ) {
                  addReminderClass(dailychange, index);
                }
              }
              //if it is the month when you created the reminder
            } else if (
              year == weeklies[i].getFullYear() &&
              month == weeklies[i].getMonth()
            ) {
              let dailychange = document.querySelectorAll(
                "#app-calendar .block"
              );
              for (let index = 0; index < dailychange.length; index++) {
                //fill in date circles if it is after the day of creation and,
                if (
                  dailychange[index].innerHTML >= weeklies[i].getDate()
                ) {
                  //if the date circles have class of the same day of creation (mon, tues, etc)
                  if (
                    dailychange[index].classList.contains(
                      "day" + weeklies[i].getDay()
                    )
                  ) {
                    addReminderClass(dailychange, index);
                  }
                }
              }
            }
          }
          //biweekly reminders
          for (let i = 0; i < biweeklies.length; i++) {
            //if it's is the next month, or longer after creation of reminder.
            if (
              year > biweeklies[i].getFullYear() ||
              (year == biweeklies[i].getFullYear() &&
                month > biweeklies[i].getMonth())
            ) {
              let dailychange = document.querySelectorAll(
                "#app-calendar .block"
              );
              // fill in the date circles if it is 14 days away from the creation date
              for (let index = 0; index < dailychange.length; index++) {
                if (
                  dailychange[index].classList.contains(
                    "day" + biweeklies[i].getDay()
                  )
                ) {
                  //Integer value of date using year and month from the calendar(changes as you click the prev and next buttons)
                  //and the date from for loop is compared with the integer value of the date when you created the reminder using %(reminder operator).
                  if ((Math.floor(new Date(year, month, index + 1) / (3600 * 1000 * 24)) -
                      Math.floor(biweeklies[i].getTime() / (3600 * 1000 * 24))
                    ) % 14 == 0) {
                    addReminderClass(dailychange, index);
                  }
                }
              }
              //If it is the month when you created the reminder.
            } else if (year == biweeklies[i].getFullYear() && month == biweeklies[i].getMonth()) {
              let dailychange = document.querySelectorAll("#app-calendar .block");
              for (let index = 0; index < dailychange.length; index++) {
                //fill in date circles if it is after the day of creation and,
                if (dailychange[index].innerHTML >= biweeklies[i].getDate()) {
                  // fill in the date circles if it is today and 14 days away from the creation date
                  if ((Math.floor(new Date(year, month, index + 1) / (3600 * 1000 * 24)) -
                      Math.floor(new Date(biweeklies[i].getFullYear(), biweeklies[i].getMonth(), biweeklies[i].getDate()) / (3600 * 1000 * 24))
                    ) % 14 == 0) {
                    addReminderClass(dailychange, index);
                  }
                }
              }
            }
          }
        });
    } else {
      // User is signed out
    }
  });
}

//Increment counter of user in user collection
function counterUp(clickedid) {
  //creating an attribute called disabled to disable bootstrap checkbox after click
  let disable = document.createAttribute("disabled");
  //disabling the button
  document.getElementById(clickedid).setAttributeNode(disable);
  //getting the user document and incrementing the counter.
  db.collection("users")
    .doc(userID)
    .get()
    .then((query) => {
      //temporary array for the user data.
      let thing = query.data();
      //increment counter in the temporary array.
      thing.counter += 1;
      //updating the firestore.
      query.ref.update(thing);
    });
}

//Remove reminder from the client access by switching the active to false
function removeReminder(clickedid) {
  // getting the number from button for accessing the reminder detail.
  let remNum = clickedid.substring("cremove".length);
  let remID = document.getElementById("ctitle" + remNum);
  // getting the reminder detail (equivalent to name in firestore)
  let remContent = remID.innerHTML
    .split("</p>")[0]
    .substring("<p>".length);
  //getting the reminder with the specified reminder name and uid.
  db.collection("reminders")
    .where("UserID", "==", userID)
    .where("Name", "==", remContent)
    .limit(1)
    .get()
    .then((query) => {
      //update the active status
      let thing = query.docs[0];
      let tmp = thing.data();
      tmp.Active = false;
      // console.log(tmp);
      thing.ref.update(tmp);
      //clearing the calendar and reminder container before refilling them.
      document.getElementById("reminders-go-here").innerHTML = "";
      document.getElementById("app-calendar").innerHTML = "";
      //refilling the calendar and the reminder collection.
      getReminder();
      getReminderCalendar();
    });
}

//getting the reminders for filling the today's todo
function getReminder() {
  //get today's year, month and date.
  let year = today.getFullYear();
  let month = today.getMonth();
  let date = today.getDate();
  //check logged in.
  firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        userID = user.uid;
        var activities = [];
        //get reminders that are of the user and is active.
        var reminderRef = db.collection("reminders");
        reminderRef
          .where("UserID", "==", userID)
          .where("Active", "==", true)
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach((doc) => { //for all valid reminders.
                activities.push(doc.data()); //fill the temporary array.
              });
              //initialize and fill in today's todo array.
              //logic similar to the one found on getCalendarReminder
              reminderList = [];
              for (let i = 0; i < activities.length; i++) {
                if (activities[i].Frequency == "Daily") {
                  if (
                    year > new Date(activities[i].TimeStamp).getFullYear() ||
                    (year == new Date(activities[i].TimeStamp).getFullYear() &&
                      month > new Date(activities[i].TimeStamp).getMonth())
                  ) {
                    reminderList.push(activities[i]);
                  } else if (
                    year == new Date(activities[i].TimeStamp).getFullYear() &&
                    month == new Date(activities[i].TimeStamp).getMonth()
                  ) {
                    reminderList.push(activities[i]);
                  }
                } else if (activities[i].Frequency == "Weekly") {
                  if (
                    year > new Date(activities[i].TimeStamp).getFullYear() ||
                    (year == new Date(activities[i].TimeStamp).getFullYear() &&
                      month > new Date(activities[i].TimeStamp).getMonth())
                  ) {
                    if (
                      new Date(year, month, date).getDay() ==
                      new Date(activities[i].TimeStamp).getDay()
                    ) {
                      reminderList.push(activities[i]);
                    }
                  } else if (
                    year == new Date(activities[i].TimeStamp).getFullYear() &&
                    month == new Date(activities[i].TimeStamp).getMonth()
                  ) {
                    if (
                      new Date(year, month, date).getDay() ==
                      new Date(activities[i].TimeStamp).getDay()
                    ) {
                      reminderList.push(activities[i]);
                    }
                  }
                } else {
                  if (
                    year > new Date(activities[i].TimeStamp).getFullYear() ||
                    (year == new Date(activities[i].TimeStamp).getFullYear() &&
                      month > new Date(activities[i].TimeStamp).getMonth())
                  ) {
                    if (
                      new Date(year, month, date).getDay() ==
                      new Date(activities[i].TimeStamp).getDay()
                    ) {
                      if (
                        (Math.floor(new Date(year, month, date)) -
                          Math.floor(
                            new Date(
                              new Date(activities[i].TimeStamp).getFullYear(),
                              new Date(activities[i].TimeStamp).getMonth(),
                              new Date(activities[i].TimeStamp).getDate()
                            )
                          )) %
                        14 ==
                        0
                      ) {
                        reminderList.push(activities[i]);
                      }
                    }
                  } else if (
                    year == new Date(activities[i].TimeStamp).getFullYear() &&
                    month == new Date(activities[i].TimeStamp).getMonth()
                  ) {
                    if (
                      new Date(year, month, date).getDay() ==
                      new Date(activities[i].TimeStamp).getDay()
                    ) {
                      if (
                        (Math.floor(new Date(year, month, date)) -
                          Math.floor(
                            new Date(
                              new Date(activities[i].TimeStamp).getFullYear(),
                              new Date(activities[i].TimeStamp).getMonth(),
                              new Date(activities[i].TimeStamp).getDate()
                            )
                          )) %
                        14 ==
                        0
                      ) {
                        reminderList.push(activities[i]);
                      }
                    }
                  }
                }
              }
              //calling displayRems function with reminderList as the parameter to fill the container with reminders in the array.
                displayRems(reminderList);
              });
          }
        else {
          // User is signed out
        }
      });
  }

  //adding history trivia from the historymuffinlab api (free)
  function addHistory() {
    //getting the data in the api as json.
    fetch("https://history.muffinlabs.com/date").then(function (response) {
      return response.json();
    }).then(function (history) {
      todayInfo = history.data;
      //randomly picking event, birth and death to display.
      let Event_Num = Math.floor(Math.random() * todayInfo.Events.length);
      let Birth_Num = Math.floor(Math.random() * todayInfo.Births.length);
      let Death_Num = Math.floor(Math.random() * todayInfo.Deaths.length);
      let todayEvent = todayInfo.Events[Event_Num];
      let todayBirth = todayInfo.Births[Birth_Num];
      let todayDeath = todayInfo.Deaths[Death_Num];
      //putting the event, birth and death in the containers.
      document.getElementById("event-goes-here").innerHTML = todayEvent.text + " (" + todayEvent.year + ")";
      document.getElementById("birth-goes-here").innerText = todayBirth.text + " was born. (" + todayBirth.year +
        ")";
      document.getElementById("death-goes-here").innerHTML = todayDeath.text + " passed away. (" + todayDeath
        .year + ")";
    });
  }

  //putting reminders from getReminder in the todo container.
  function displayRems(list) {
    for (let i = 0; i < list.length; i++) { //iterate thru each reminder
      // filling and making a row, one at a time.
      let reminder = list[i].Name;
      let startTime = list[i].Time;
      //The same as the one found in frontpage.js
      let endTime = (parseInt(startTime.split(':')[0]) + 1 == 24 ? "00" : (parseInt(startTime.split(':')[0]) +
        1 < 10 ? "0" : "") + (parseInt(startTime.split(':')[0]) + 1)) + ':' + startTime.split(':')[1];
      let newcard = CardTemplate.content.cloneNode(true);

      newcard.querySelector('.card-title').innerHTML =
        `<p>${reminder}</p><p>from ${startTime + "~" + endTime}</p>`;

      // //give unique ids to all elements for future use
      newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
      newcard.querySelector('.form-check-input').setAttribute("id", "cdone" + i);
      newcard.querySelector('.bttn').setAttribute("id", "cremove" + i);
      document.getElementById("reminders-go-here").appendChild(newcard);
    }
  }

  //adding class to date circles to colour them in.
  function addReminderClass(classArr, index) {
    if (classArr[index].classList.contains("rem6")) {
      classArr[index].classList.add("rem7");
    } else if (classArr[index].classList.contains("rem5")) {
      classArr[index].classList.add("rem6");
    } else if (classArr[index].classList.contains("rem4")) {
      classArr[index].classList.add("rem5");
    } else if (classArr[index].classList.contains("rem3")) {
      classArr[index].classList.add("rem4");
    } else if (classArr[index].classList.contains("rem2")) {
      classArr[index].classList.add("rem3");
    } else if (classArr[index].classList.contains("rem1")) {
      classArr[index].classList.add("rem2");
    } else {
      classArr[index].classList.add("rem1");
    }
  }