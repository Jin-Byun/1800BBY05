var userID;
var count = 0;
var reminderList = [];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
  "October", "November", "December"
]
const ang2rad = (angle) => {
  return angle * (Math.PI / 180);
};
const diameter = document.querySelector(".clock").offsetWidth;
const radius = diameter / 2;
const clock = document.querySelector(".clock");
const time = ['00', '04', '08', '12', '16', '20'];
const collist = ["#00ff0080", "#00ff0080", "#ffff0080", "#ffff0080", "#ff000080", "#ff000080", "#00000080",
  "#00000080"
]

let angle = -90;
const deltaAngle = 360 / time.length;

//-------------------------
//the clock
//-------------------------
const hrE1 = document.querySelector(".hour");
const minE1 = document.querySelector(".minute");
var date = new Date;
var hrdeg = date.getHours() / 24 * 360 - 90;
var mindeg = date.getMinutes() / 60 * 360 - 90;
minE1.style.transform = `rotate(${mindeg}deg)`;
hrE1.style.transform = `rotate(${hrdeg}deg)`;
//Make the hands of clock movable
setInterval(() => {
  date = new Date;
  hrdeg = date.getHours() / 24 * 360 - 90 + (date.getMinutes() / (24 * 60) * 360);
  mindeg = date.getMinutes() / 60 * 360 - 90;
  minE1.style.transform = `rotate(${mindeg}deg)`;
  hrE1.style.transform = `rotate(${hrdeg}deg)`;
}, 1000)
//placing time around the clock
time.forEach(char => {
  const charElement = document.createElement('span');
  charElement.innerText = char;
  const xPos = radius - 12 + radius * Math.cos(ang2rad(angle));
  const yPos = radius - 14.5 + radius * Math.sin(ang2rad(angle));
  const spread = `translate(${xPos}px, ${yPos}px)`;
  charElement.style.transform = spread;
  angle += deltaAngle;
  clock.appendChild(charElement);
});

//filling the clock with the arc(slices) of reminder time slot.
function makeScheduleArc(collection, int) {
  //Make canvas for each reminders.
  clock.insertAdjacentHTML("afterbegin",
    `<canvas id="reminder${int}" width="${diameter}" height="${diameter}"></canvas>`);
  //get time from the reminder collection and make start angle and end angle of the arc
    let timeSplit = collection.Time.split(':');
  let startangle = (parseInt(timeSplit[0]) / 24 * 360 - 90) * Math.PI / 180 + (parseInt(timeSplit[1]) / (60 * 24) * 2 * Math
    .PI);
  let endangle = startangle + 1 / 24 * 2 * Math.PI;
  //call the specific canvas to fill with drawing
  let c = document.getElementById("reminder" + int);
  //drawing the arc
  let ctx = c.getContext('2d');
  ctx.fillStyle = collist[int];
  ctx.beginPath();
  ctx.moveTo(radius, radius);
  ctx.arc(radius - 6, radius - 6, radius - 2, startangle, endangle, false);
  ctx.lineTo(radius, radius);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

//same function as found in calendar except for the removal of canvas.
function counterUp(clickedid) {
  let urlstring = new URL(window.location.href);
  let stringSplit = urlstring.searchParams.get("uid").split('?');
  let currUID = stringSplit[0];
  let disable = document.createAttribute("disabled");
  document.getElementById(clickedid).setAttributeNode(disable);
  db.collection("users").doc(currUID).get().then(query => {
    let thing = query.data();
    thing.counter += 1;
    query.ref.update(thing);
  });
}
//same function as found in calendar
function removeReminder(clickedid) {
  let remNum = clickedid.substring('cremove'.length);
  let remID = document.getElementById('ctitle' + remNum);
  let remContent = remID.innerHTML.split('</p>')[0].substring('<p>'.length);
  db.collection("reminders").where("Name", "==", remContent).limit(1).get().then(query => {
    let thing = query.docs[0];
    let tmp = thing.data();
    tmp.Active = false;
    thing.ref.update(tmp);
    document.getElementById("reminders-go-here").innerHTML = "";
    //canvas completely emptied from clock.
    let elem = document.getElementsByTagName("canvas");
    while (elem[0]) {
      elem[0].parentNode.removeChild(elem[0])
    }
    //refill data
    getReminder();
  });
}

//show today's date using data in url and the todo message on the bottom
function showDate() {
  // create a URL object
  let params = new URL(window.location.href);
  let data = params.searchParams.get("uid").split('?'); // data[0] = uid, 1 = year, 2= month, 3 = date
  //create string from year month and date
  let message = data[1] + " " + data[2] + " " + data[3];
  //input string.
  document.getElementById("date-go-here").innerHTML = message;
  let currentUser = db.collection("users").doc(data[0])
  currentUser.get().then(userDoc => {
    //get first name of the user
    fullName = userDoc.data().name.split(' ');
    firstName = fullName[0];
    //check if it's today, and if yes, say "name" for today. if not, say "name" for "date"
    let todoheading = firstName + ", " +
      (date.getFullYear() == data[1] && months[date.getMonth()] == data[2] && date.getDate() ==
        data[3] ? "for today" : "on " + (data[1] + " " + data[2] + " " + data[3])) + ":";
    document.getElementById("to_do_date").innerHTML = todoheading;
  })
}

//similar to one found in calendar.js except that the month, year and date are from the url
function getReminder() {
  let params = new URL(window.location.href);
  let datedata = params.searchParams.get("uid").split('?');
  let year = datedata[1];
  let month = months.indexOf(datedata[2]);
  let date = datedata[3];
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      userID = user.uid;
      var activities = [];
      var reminderRef = db.collection("reminders");
      reminderRef.where("UserID", "==", userID).where("Active", "==", true).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            activities.push(doc.data());
          });
          reminderList = [];
          let dailies = [];
          let weeklies = [];
          let biweeklies = [];
          activities.forEach(element => {
            if (element.Frequency == "Daily") {
              dailies.push(element);
            } else if (element.Frequency == "Weekly") {
              weeklies.push(element);
            } else {
              biweeklies.push(element);
            }
          });
          for (let i = 0; i < dailies.length; i++) {
            if (year > new Date(dailies[i].TimeStamp).getFullYear() || (year ==
                new Date(dailies[i].TimeStamp).getFullYear() &&
                month > new Date(dailies[i].TimeStamp).getMonth())) {
              reminderList.push(dailies[i]);

            } else if (year == new Date(dailies[i].TimeStamp).getFullYear() && month ==
              new Date(dailies[i].TimeStamp).getMonth()) {
              reminderList.push(dailies[i]);
            }
          }
          for (let i = 0; i < weeklies.length; i++) {
            if (year > new Date(weeklies[i].TimeStamp).getFullYear() || (year ==
                new Date(weeklies[i].TimeStamp).getFullYear() &&
                month > new Date(weeklies[i].TimeStamp).getMonth())) {
              if (new Date(year, month, date).getDay() == new Date(weeklies[i]
                  .TimeStamp).getDay()) {
                reminderList.push(weeklies[i]);
              }
            } else
            if (year == new Date(weeklies[i].TimeStamp).getFullYear() && month ==
              new Date(weeklies[i].TimeStamp).getMonth()) {
              if (new Date(year, month, date).getDay() == new Date(weeklies[i]
                  .TimeStamp).getDay()) {
                reminderList.push(weeklies[i]);
              }
            }
          }
          for (let i = 0; i < biweeklies.length; i++) {
            if (year > new Date(biweeklies[i].TimeStamp).getFullYear() || (year ==
                new Date(biweeklies[i].TimeStamp).getFullYear() &&
                month > new Date(biweeklies[i].TimeStamp).getMonth())) {
              if (new Date(year, month, date).getDay() == new Date(biweeklies[i]
                  .TimeStamp).getDay()) {
                if (((Math.floor(new Date(year, month, date))) - Math.floor(
                    new Date(new Date(biweeklies[i].TimeStamp)
                      .getFullYear(), new Date(biweeklies[i].TimeStamp)
                      .getMonth(), new Date(biweeklies[i].TimeStamp)
                      .getDate()))) % 14 == 0) {
                  reminderList.push(biweeklies[i]);
                }
              }
            } else
            if (year == new Date(biweeklies[i].TimeStamp).getFullYear() && month ==
              new Date(biweeklies[i].TimeStamp).getMonth()) {
              if (new Date(year, month, date).getDay() == new Date(biweeklies[i]
                  .TimeStamp).getDay()) {
                if ((Math.floor(new Date(year, month, date)) - Math.floor(new Date(
                    new Date(biweeklies[i].TimeStamp).getFullYear(),
                    new Date(biweeklies[i].TimeStamp).getMonth(),
                    new Date(biweeklies[i].TimeStamp).getDate()))) % 14 == 0) {
                  reminderList.push(biweeklies[i]);

                }
              }
            }
          }
          displayRems(reminderList);
        })
    } else {
      // User is signed out
    }
  });
}

//same as the one in the calendar.js except we call makeScheduleArc here
function displayRems(list) {
  var j = 1;
  let urlstring = new URL(window.location.href);
  let stringSplit = urlstring.searchParams.get("uid").split('?');
  for (let i = 0; i < list.length; i++) { //iterate thru each doc
    makeScheduleArc(list[i], j);

    let reminder = list[i].Name;
    let startTime = list[i].Time;
    let endTime = (parseInt(startTime.split(':')[0]) + 1 == 24 ? "00" : (parseInt(startTime.split(':')[0]) + 1 < 10 ? "0" : "") + (parseInt(startTime.split(':')[0]) + 1)) + ':' + startTime.split(':')[1];
    let newcard = CardTemplate.content.cloneNode(true);

    newcard.querySelector('.card-title').innerHTML = `<p>${reminder}</p><p>from ${startTime + "~" + endTime}</p>`;

    // //give unique ids to all elements for future use
    let disable = document.createAttribute("disabled");
    if (parseInt(stringSplit[1]) > date.getFullYear() || (parseInt(stringSplit[1]) == date.getFullYear() && months.indexOf(stringSplit[2]) > date.getMonth()) || (parseInt(stringSplit[1]) == date.getFullYear() && months.indexOf(stringSplit[2]) == date.getMonth() && parseInt(stringSplit[3]) > date.getDate())) {
      newcard.querySelector('.form-check-input').setAttributeNode(disable);
      newcard.querySelector('.card-title').setAttribute("style", "color: rgba(0,0,0,0.4);");
    }
    newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
    newcard.querySelector('.form-check-input').setAttribute("id", "cdone" + i);
    newcard.querySelector('.bttn').setAttribute("id", "cremove" + i);
    document.getElementById("reminders-go-here").appendChild(newcard);
    j++;

  }
}