

    //Wave Input Form Effect
    const labels = document.querySelectorAll('.form-control label')

    //for each label, the function splits the characters of the label and after 30ms will reform the labels
    labels.forEach(label => {
      label.innerHTML = label.innerText
        .split('')
        //.map accepts params letter for the character and idx for the index of the string
        .map((letter, idx) => `<span style="transition-delay:${idx * 30}ms">${letter}</span>`)
        .join('')
    })

    //var current user represents the current logged in user
    var currentUser;

    //var time represents the current date which is the time stamp for when theuser sets a reminder
    var time = Date.now || function () {
      console.log("TimeStamp works");
      return +new Date;
    };







    // Save Reminder Function  
    function saveReminderInfo() {
      //value of the reminder input
      let Name = document.getElementById("reminder").value;
      //value of the time input
      let Time = document.getElementById("time").value;
      //value of the checked button
      let Frequency = document.querySelector(
        'input[name="options"]:checked'
      ).value;

      //Authenticates the user
      firebase.auth().onAuthStateChanged((user) => {
        //If user exists
        if (user) {
          //Read the "user" collection for the user
          var currentUser = db.collection("users").doc(user.uid);
          var userID = user.uid;
          
          //Get the document for current user.
          currentUser.get().then((userDoc) => {
            //get user's Email
            var userEmail = userDoc.data().email;
            
            //Start a collection for the user then add the values.
            db.collection("reminders").add({
                UserID: userID,
                email: userEmail,
                Name: Name,
                Time: Time,
                Frequency: Frequency,
                TimeStamp: time(),
                Active: true
              })
              //.then() returns a promise, in this case a validateForm()
              .then(() => {
                validateForm();

              })
          });
        } else {
          // no user is signed in.
          console.log("no user signed in");
        }

      });
      //the input forms are not disabled unless the inputs are valid in which case we write the contents into the firestore
      document.getElementById("set-reminder").disabled = false;



    }

   

    //function that redirects to a page if inputs are not empty
    function redirect() {
      let Name = document.getElementById("reminder").value;
      let Time = document.getElementById("time").value;
      let Frequency = document.querySelector(
        'input[name="options"]:checked'
      ).value;

      //redirects the page to redirect.html and writes Name value to the other page
      window.location.href = "redirect.html?" + Name;


    }




    //Validate Form Function
    function validateForm() {
      //x as the value of reminder name
      let x = document.getElementById("reminder").value;
      //y as the value of the time input
      let y = document.getElementById("time").value;
      //alert if x is not valid
      if (!x) {
        alert("Reminder must have a name.");
        //form is not disabled so as to allow for correction
        document.getElementById("set-reminder").disabled = false;
        return false;
      }
      //alert if y is not valid
      if (!y) {
        alert("Time of the reminder must be provided.");
        //form is not disabled so as to allow for correction
        document.getElementById("set-reminder").disabled = false;
        return false;
      }

      //if x and y are valid then we can redirect
      if (x && y) {
        //function that redirects to the redirect.html page
        redirect();
      }
    }