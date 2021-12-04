 //Button Ripple Effect Function
 const buttons = document.querySelectorAll('.ripple')
 //Listens for the click and creates a span element that is styled as a circle that expands and disappears after 500ms-->
 buttons.forEach(button => {
     button.addEventListener('click', function (e) {
         const x = e.clientX
         const y = e.clientY

         const buttonTop = e.target.offsetTop
         const buttonLeft = e.target.offsetLeft

         const xInside = x - buttonLeft
         const yInside = y - buttonTop
         //Creates a span representing the circle
         const circle = document.createElement('span')
         //Adds circle to the html div
         circle.classList.add('circle')
         //Takes the top and left portions of the button and adds px
         circle.style.top = yInside + 'px'
         circle.style.left = xInside + 'px'
         //Append this(circle) to circle
         this.appendChild(circle)
         //Circels disappear after 500ms to display the appearance and disappearance of ripples-->
         setTimeout(() => circle.remove(), 500)

     })
 })

 //Redirect to the login page function
 function goToLogin() {
     //Sets a timeout of 500ms to showcase the ripple effect to the user else the effect is not noticable. 
     setTimeout(() => window.location.href = "login.html?", 500)

 }