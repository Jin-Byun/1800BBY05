const levelRankColor = ["linear-gradient(50deg, #FBE9A7, #FCA733, #FBE9A7)", "linear-gradient(50deg, #4CE0FF, #FF761E, #4CE0FF)", "linear-gradient(50deg, #393355, #FBE993, #393355)", "linear-gradient(50deg, #3BB1EE, #9B48FF, #3BB1EE)", "linear-gradient(50deg, #FFA83D, #E4749A, #FFA83D)"]
        const levelUpThres = [2, 3, 5, 7, 10, 13, 18]
        var currentUser;
        var level;
        var count;
        var counter;
    
        function levelIndicatorBar(lv) {
            switch (lv) {
                case 0:
                    break;
                case 1:
                    document.getElementById("level-1").style.background = levelRankColor[0];
                    document.getElementById("level-1").innerText = 1;
                    break;
                case 2:
                document.getElementById("level-10").style.background = levelRankColor[1];
                document.getElementById("level-10").innerText = 1;
                    break;
                case 3:
                document.getElementById("level-1").style.background = levelRankColor[1];
                document.getElementById("level-10").style.background = levelRankColor[1];
                document.getElementById("level-1").innerText = 1;
                document.getElementById("level-10").innerText = 1;
                    break;
                case 4:
                document.getElementById("level-100").style.background = levelRankColor[2];
                document.getElementById("level-100").innerText = 1;
                    break;
                case 5:
                document.getElementById("level-100").style.background = levelRankColor[2];
                document.getElementById("level-1").style.background = levelRankColor[2];
                document.getElementById("level-100").innerText = 1;
                document.getElementById("level-1").innerText = 1;
                    break;
                case 6:
                document.getElementById("level-100").style.background = levelRankColor[2];
                document.getElementById("level-10").style.background = levelRankColor[2];
                document.getElementById("level-10").innerText = 1;
                document.getElementById("level-100").innerText = 1;
                break;
                case 7:
                document.getElementById("level-100").style.background =levelRankColor[2];
                document.getElementById("level-10").style.background =levelRankColor[2];
                document.getElementById("level-1").style.background =levelRankColor[2];
                document.getElementById("level-1").innerText = 1;
                document.getElementById("level-10").innerText = 1;
                document.getElementById("level-100").innerText = 1;
                break;  
                case 8:
                document.getElementById("level-1000").style.background = levelRankColor[3];
                document.getElementById("level-1000").innerText = 1;
                break;  
                case 9:
                document.getElementById("level-1000").style.background = levelRankColor[3];
                document.getElementById("level-1000").innerText = 1;
                document.getElementById("level-1").style.background = levelRankColor[3];
                document.getElementById("level-1").innerText = 1;
                break;  
                case 10:
                document.getElementById("level-1000").style.background = levelRankColor[3];
                document.getElementById("level-1000").innerText = 1;
                document.getElementById("level-10").style.background = levelRankColor[3];
                document.getElementById("level-10").innerText = 1;
                break;  

            }
        }

        function makeExpBar() {
            let levelpercent = 0;
            let level = 1;
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    db.collection("users").doc(user.uid).get().then(docs => {
                        counter = docs.data().counter;
                        for (let i = 0; i < levelUpThres.length; i++) {
                            if (counter < levelUpThres[i]) {
                                levelpercent = Math.floor(100 * counter / levelUpThres[i]); {
                                    break;
                                }
                            } else {
                                level++;
                                counter -= levelUpThres[i];
                            }
                        }
                        document.getElementById("expPercent").innerText = levelpercent + "%";
                        document.querySelector(".bg-c-blue").style.background =
                            `linear-gradient(90deg,rgba(243,127,82,1) ${levelpercent-(50-(100-levelpercent)/2)}%, rgba(243,127,82,0.6) ${levelpercent-(5-(100-levelpercent)/20)}%, rgba(0,0,0,0) ${levelpercent}.9%, rgba(0,0,0,0) 100%)`;
                        document.getElementById("currLevel").innerText = level;
                        levelIndicatorBar(level);

                    })
                }

            });
        }


        function populateInfo() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    currentUser = db.collection("users").doc(user.uid)
                    currentUser.get()
                        .then(userDoc => {
                            var userName = userDoc.data().name;
                            var userAge = userDoc.data().age;
                            var userDescription = userDoc.data().description;
                        })
                } else {
                    console.log("No user is signed in");
                }
            });
        }

        

        function insertName() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    currentUser = db.collection("users").doc(user.uid)
                    currentUser.get()
                        .then(userDoc => {
                            var user_Name = userDoc.data().name;
                            $("#name-goes-here").text(user_Name);
                        })
                } else {
                    // No user is signed in.
                }
            });
        }
        

        function insertEmail() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    currentUser = db.collection("users").doc(user.uid)
                    currentUser.get()
                        .then(userDoc => {
                            var user_Email = userDoc.data().email;
                            $("#email-goes-here").text(user_Email); 
                        })
                } else {
                    // No user is signed in.
                }
            });
        }
        


        function insertAge() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    db.collection("users").doc(user.uid).get().then(docs => {
                        if (docs.exists) {
                        }
                        document.getElementById("age-goes-here").innerText = docs.data().age;
                    })
                }
            });
        }
        

        function insertDescription() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    db.collection("users").doc(user.uid).get().then(docs => {
                        if (docs.exists) {}
                        document.getElementById("description-goes-here").innerText = docs.data()
                            .description;


                    })
                }
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
        

        function showUploadedPicture() {
            const fileInput = document.getElementById("profile-img-file"); 
            const image = document.getElementById("profile-img"); 
            fileInput.addEventListener('change', function (e) {
                var blob = URL.createObjectURL(e.target.files[0]);
                image.src = blob; 
            })
        }        


        function displayUserProfilePic() {
            firebase.auth().onAuthStateChanged(function (user) { 
                db.collection("users").doc(user.uid) 
                    .get() 
                    .then(function (doc) {
                        var picUrl = doc.data().profilePic; 
                        $("profile-img").append("<img src='" + picUrl + "'>")
                        $("#profile-img").attr("src", picUrl);
                    })
            })
        }
        
// Function that counts the reminders set by a user.
function countReminders() {
    //Count initialized to 0
    count = 0;
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            userID = user.uid;
            var reminders = [];
            //Variable representing the 'reminders' collection
            var remindersRef = db.collection("reminders");
            //Reads the 'reminders' collection
            remindersRef.where("UserID", "==", userID).get()
                //Promise that accepts a callback function
                .then((querySnapshot) => {
                    //forEach accepts the doc of the user
                    querySnapshot.forEach((doc) => {
                    //Appends the data of the doc into the reminders arrary
                    reminders.push(doc.data());
                    //Increments the count for each reminder read
                    ++count;
                    //Reward function is called if conditions are met. (5 reminders)
                    reward();

                    });


                });
        }
    })
}

// The reward function populates the badge section if the condition is met
function reward() {
    if (count == 5) {
        var img = document.createElement("img");
        img.src = "images/badge1.png";
        var circleBadge = document.getElementById("badge-one");
        circleBadge.appendChild(img);
        img.style.cssText = `
            border-radius: 50%;
            border: 1px solid yellow;
            max-width: 100%;
            max-height: 100%;
            height: 100%;
            width: 100%;
        `;
    } 

}
