   //call the front page function
   goToFrontpage();
   //decodes the URI
   var queryString = decodeURIComponent(window.location.search);
   var queries = queryString.split("?");
   var Name = queries[1];

   //how to add strings dynamically through js
   var para = document.getElementById("reminder-here").innerHTML = Name;
   document.body.appendChild(para);
   var node = document.createTextNode(Name);
   para.appendChild(node);



   function goToFrontpage() {
       //time out of 2s then redirect to frontpage
       setTimeout(() => window.location.href = "frontpage.html?", 2000)

   }