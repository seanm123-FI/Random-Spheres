 document.addEventListener("DOMContentLoaded", function() {    //good practice to use eventlistener as it ensure that all content is loaded before js script is run
    var body = document.querySelector("body");  // gets body element of HTML 

    var numOfSpheres = Math.floor(Math.random() * 10);  //Math random creates a decimal between 0 and 1, ie 0.4785. * 10 to give 4.785 and then flooring it to 4
    var colours = ['green', 'yellow', 'blue', 'pink', 'yellow', 'purple', 'red', 'orange'];   //array of potential sphere colours

    for (var i = 0; i < numOfSpheres; i++) {

        var createSphere = document.createElement("div");  //creates new div element in HTML
        createSphere.className = "sphere";                //assigning the defined sphere CSS element to 'createSphere'

        var x = Math.floor(Math.random() * (window.innerWidth - 100));       //gives random xpos by getting number between 0 and 1 ie. 0.2324 and multiplying by screen width ie. 1000 = 232.4 and flooring it to give sphere xpos of 232
        var y = Math.floor(Math.random() * (window.innerHeight - 100));       //gives random ypos by getting number between 0 and 1 ie. 0.5712 and multiplying by screen height ie. 1000 = 571.2 and flooring it to give sphere xpos of 571
        createSphere.style.left = x + "px";                             //starts at left side of screen and places sphere onto screen at xpos by whatever the x amount was calculated at
        createSphere.style.bottom = y + "px";                           //starts at bottom of screen and places sphere onto screen at ypos by whatever the y amount was calculated at

        var sphereColour = colours[Math.floor(Math.random() * colours.length)];      //gets number between 0 and 1 ie. 0.3489 * 8 = 2.7912, floored to 2 so blue is selected and assigned to sphereColour
        createSphere.style.background = `radial-gradient(circle at 50% 50%, ${sphereColour}, black)`; //assigning radial gradient background style to sphere to give more spherical perception, sphere colour is the random selection in prev line and black is the second colour of the gradient
        createSphere.style.boxShadow = ` 0 0 3px 1.5px ${sphereColour}`;       
   
        body.appendChild(createSphere);  //adds sphere to HTML doc as a child of the body element which makes it visible on page
    }
 });

            