var today = new Date(Date.now()); //get today's timestamp (local time)

//Create table row for showing reminders that the user had made and is currently active.
function displayRems() {
  //Check if user is logged in.
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let userID = user.uid; //assign uid to userID variable.
      var activities = []; //Array to be filled with active reminders.
      var reminderRef = db.collection("reminders"); //reference to the reminder collection in firestore.
      reminderRef.where("UserID", "==", userID).where("Active", "==", true).get() //getting reminders from the reminder collection where the field contains current userID and active boolean is true. 
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => { //for each of the document with the above condition.
            activities.push(doc.data()); // add to the array.
          });
          // If there are no active reminders, display "no active reminder"
          if (activities.length == 0) {
            let newcard = CardTemplate.content.cloneNode(true);
            newcard.querySelector('.card-isEmpty').innerText = "No active reminder!";
            document.getElementById("isEmpty-go-here").appendChild(newcard);
          } else {
            // If there are active reminders, do the following
            activities.forEach(element => { //iterate thru each activity in the array.

              let reminder = element.Name; //getting reminder detail in variable.
              let startTime = element.Time; //getting the time created in variable.
              let endTime = (parseInt(startTime.split(':')[0]) + 1 == 24 ? "00" : (parseInt(startTime
                  .split(':')[0]) + 1 < 10 ? "0" : "") + (parseInt(startTime.split(':')[0]) + 1)) + ':' +
                startTime.split(':')[1]; // adding one hour for a one hour reminder, but using ternary conditional to make sure end hour is within the 24 hour limit.
              let freq = element.Frequency; //getting the frequency of reminder in variable.
              let newcard = CardTemplate.content.cloneNode(true); //make card from template.

              //putting reminder detail and duration in the card-title.
              newcard.querySelector('.card-title').innerHTML =
                `<p>${reminder}</p><p>from ${startTime + "~" + endTime}</p>`;
                //putting reminder frequency in the card-freq.
              newcard.querySelector('.card-freq').innerHTML = freq;
              // appending the new card from template to the reminders-go-here
              document.getElementById("reminders-go-here").appendChild(newcard); 
            })
          }
        })
    }
  });
}

//insert user's name in the welcome message.
function insertNameAndCounter() {
  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
      // Do something for the current logged-in user here: 
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUser.get()
        .then(userDoc => {
          var user_Name = userDoc.data().name;
          //method #1:  insert with html only
          document.getElementById("name-goes-here").innerText = user_Name; //using javascript
          //Inserting the number of reminders done.
          document.getElementById("counter").innerText = userDoc.data().counter;
        })
    } else {
      // No user is signed in.
    }
  });
}

//insert quote of the day from type.fit api (free)
function addQuote() {
  //get data from the url as a json.
  fetch("https://type.fit/api/quotes").then(function (response) {
    return response.json();
  }).then(function (data) {
    //storing a specific quote with it's author into the variable. ((month * 100 + date)th quote from the json. e.g. if december 3rd, 12 * 100 = 1200, 3rd = 3, so, 1203rd quote from json.)
    let todayQ = data[(today.getMonth() + 1) * 100 + today.getDate()].text;
    let todayA = data[(today.getMonth() + 1) * 100 + today.getDate()].author;

    //place quote in the containers.
    document.getElementById("quote-goes-here").innerHTML = todayQ;
    document.getElementById("author-goes-here").innerHTML = todayA;

  });
}