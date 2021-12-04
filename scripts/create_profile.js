var currentUser;

function populateInfo() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid)
      currentUser.get()
        .then(userDoc => {
          var user_Name = userDoc.data().name;
          var user_Age = userDoc.data().age;
          var user_Description = userDoc.data().description;
          if (user_Name != null) {
            document.getElementById("nameInput").value = user_Name;
          }
          if (user_Age != null) {
            document.getElementById("ageInput").value = user_Age;
          }
          if (user_Description != null) {
            document.getElementById("descriptionInput").value = user_Description;
          }
        })
    } else {
      console.log("No user is signed in");
    }
  });
}

function editUserInfo() {
  document.getElementById("personalinfo").disabled = false;
}

function saveUserInfo() {
  name = document.getElementById('nameInput').value;
  age = document.getElementById('ageInput').value;
  description = document.getElementById('descriptionInput').value;
  currentUser.update({
    name: name,
    age: age,
    description: description,
  }).then(goHome());
}

function insertName() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid)
      currentUser.get()
        .then(userDoc => {
          var user_Name = userDoc.data().name;
        })
    } else {

    }
  });
}


function insertAge() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid)
      currentUser.get()
        .then(userDoc => {
          var user_Age = userDoc.data().age;
          $("#age-goes-here").text(user_Age);
        })
    } else {}
  });
}

function insertDescription() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid)
      currentUser.get()
        .then(userDoc => {
          var user_Description = userDoc.data().description;
          $("#description-goes-here").text(user_Description);


        })
    } else {}
  });
}

function uploadUserProfilePic() {

  firebase.auth().onAuthStateChanged(function (user) {
    var fileInput = document.getElementById("profile-img-file");
    const image = document.getElementById("profile-img");
    fileInput.addEventListener('change', function (e) {
      var file = e.target.files[0];
      var blob = URL.createObjectURL(file);
      image.src = blob;
      var storageRef = storage.ref("images/" + user.uid + ".jpg");

      storageRef.put(file)
        .then(function () {
          console.log('Uploaded to Cloud Storage.');
        })

      storageRef.getDownloadURL()
        .then(function (url) {
          console.log(url);
          db.collection("users").doc(user.uid).update({
              "profilePic": url
            })
            .then(function () {
              console.log('Added Profile Pic URL to Firestore.');
            })
        })
    })
  })
}

function goHome() {
  setTimeout(() => window.location.href = "frontpage.html?", 800)
}

function showUploadedPicture() {
  const fileInput = document.getElementById("profile-img-file");
  const image = document.getElementById("profile-img");
  fileInput.addEventListener('change', function (e) {
    var img_file = URL.createObjectURL(e.target.files[0]);
    image.src = img_file;
  })
}

function displayUserProfilePic() {
  firebase.auth().onAuthStateChanged(function (user) {
    db.collection("users").doc(user.uid)
      .get()
      .then(function (doc) {
        var picUrl = doc.data().profilePic;
        $("#profile-img").attr("src", picUrl);
      })
  })
}