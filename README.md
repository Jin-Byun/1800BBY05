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
        /list of avatars.jpg # Folder for avatars and badges
        
├── scripts                         # Folder for scripts
        /firebase_api.js            # firebase API stuff, shared across pages
        /login_firebase.js          # JS for login.html
        /calendar.js 		    # JS for calendar.html
        /create_profile.js	    # JS for create_profile.html
        /create_schedule.js	    # JS for create_schedule.html
        /day.js			    # JS for day.html
        /edit_profile.js	    # JS for edit_profile.html
        /frontpage.js		    # JS for frontpage.html
        /index.js		    # JS for index.html
        /login.js		    # JS for login.html
        /profile_user.js	    # JS for profile_user.html
        /profiles.js		    # JS for profiles.html
        /redirect.js		    # JS for redirect.html

├── styles                          # Folder for styles
        /index.css                  # style for index.html
        /login.css                  # style for login.html
        /frontpage.css              # style for frontpage.html
        /calendar.css		    # style for calendar.html
        /create_profile.css	    # style for create_profile.html
        /create_schedule.css	    # style for create_schedule.html
        /day.css		    # style for day.html
        /edit_profile.css	    # style for edit_profile.html
        /my_style.css		    # style for global styles
        /profile_user.css	    # style for profile_user.html

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
