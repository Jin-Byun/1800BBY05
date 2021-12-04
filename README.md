## BCIT Team Project Web Application (Hej)

Jin, Basil, Ryan

Team BBY05
COMP 1800

## HEJ

* [General info](#general-info)
* [Technologies](#technologies)
* [Contents](#content)

## General Info
Hej is an interactive mobile-friendly application that lets users set and keep track of reminders they have accomplished. Through visually appealing layout and design, users can gain a sense of accomplishment and management of their busy schedules. Hej allows the user to set a custom profile with a photo and short description. The reminders page writes the inputs of the user into the database which then is read by the other functions to the application. Data from the user is represented by a visually appealing clock that has a color-based system for helping the user identify patterns in their schedules. As the color changes to black, the user is reminded that setting too many reminders and attempting to accomplish too many things can have a negative result. 
	
## Technologies
Technologies used for this project:
* HTML, CSS
* JavaScript
* Bootstrap
* Firebase and Firestore 
	
## Content
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── index.html               # index HTML file, this is what users see when you come to the url
├── login.html               # login HTML file, the log-in page
├── frontpage.html           # main HTML file, the landing page after log-in or user set-up
├── create_profile.html      # main create profile file, where users land after logging in
├── profile_user.html        # main profile file, where users view their info and achievements
├── edit_profile.html        # edit profile file, users can edit their information
├── create_reminder.html     # create reminder html file, users set a task or reminder
├── calendar.html            # calendar html file, the reminder is sent to the calendar 
├── day.html                 # day html file, the calendar info is sent to the clock to display
└── README.md                # hello! you're reading this now!

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── images                   # Folder for images
        /icons
            /activity.svg
        /login.jpg
        /list of avatars.jpg
        
├── scripts                         # Folder for scripts
        /firebase_api.js            # firebase API stuff, shared across pages
        /login_firebase.js          # JS for login.html
        /calendar.js 
        /create_profile.js
        /create_schedule.js
        /day.js
        /edit_profile.js
        /frontpage.js
        /index.js
        /login.js
        /profile_user.js
        /profiles.js
        /redirect.js

├── styles                          # Folder for styles
        /index.css                  # style for index.html
        /login.css                  # style for login.html
        /frontpage.css              # style for frontpage.htm
        /calendar.css
        /create_profile.css
        /create_schedule.css
        /day.css
        /edit_profile.css
        /my_style.css
        /profile_user.css

Firebase hosting files: 
├── .firebase
	/hosting..cache
├── .firebaserc
├── 404.html
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── storage.rules

```

## Resources

## Contact 
* Jin Byun -
* Basil Kim -
* Ryan Carnegie - rcarnegie1@my.bcit.ca

## Acknowledgements 
* <a href="https://fontawesome.com/">Font Awesome</a>
* <a href="https://fonts.adobe.com/">Adobe Fonts</a> 
* <a href="https://fonts.google.com/">Google Fonts</a>
* <a href="https://getbootstrap.com/">Bootstrap</a>
