document.addEventListener("DOMContentLoaded", function() {
  // Good practice to use event listener to ensure that all content is loaded before JS script runs
  const body = document.querySelector("body");  // gets body element of HTML 

  const numOfSpheres = Math.floor(Math.random() * 10);  // Math random creates a decimal between 0 and 1, e.g., 0.4785. * 10 to give 4.785 and then flooring it to 4
  const colours = ['green', 'yellow', 'blue', 'pink', 'yellow', 'purple', 'red', 'orange'];   // array of potential sphere colours

  for (let i = 0; i < numOfSpheres; i++) {

      const createSphere = document.createElement("div");  // creates new div element in HTML
      createSphere.className = "sphere";  // assigning the defined sphere CSS element to 'createSphere'

      const x = Math.floor(Math.random() * (window.innerWidth - 100));  // gives random xpos by getting a number between 0 and 1, e.g., 0.2324, and multiplying by screen width, e.g., 1000, to give 232.4 and flooring it to give sphere xpos of 232
      const y = Math.floor(Math.random() * (window.innerHeight - 100));  // gives random ypos by getting a number between 0 and 1, e.g., 0.5712, and multiplying by screen height, e.g., 1000, to give 571.2 and flooring it to give sphere ypos of 571
      createSphere.style.left = x + "px";  // starts at the left side of the screen and places sphere onto screen at xpos by whatever the "x" amount was calculated at
      createSphere.style.top = y + "px";  // starts at the top of the screen and places sphere onto screen at ypos by whatever the "y" amount was calculated at

      const sphereColour = colours[Math.floor(Math.random() * colours.length)];  // gets a number between 0 and 1, e.g., 0.3489 * 8 = 2.7912, floored to 2, so blue is selected and assigned to "sphereColour"
      createSphere.style.background = `radial-gradient(circle at 50% 50%, ${sphereColour}, black)`; // assigning radial gradient background style to sphere to give more spherical perception, sphere colour is the random selection in the previous line, and black is the second colour of the gradient
      createSphere.style.boxShadow = `0 0 3px 1.5px ${sphereColour}`;       

      body.appendChild(createSphere);  // adds sphere to HTML doc as a child of the body element which makes it visible on the page

      // Draggable functionality
      createSphere.addEventListener('mousedown', function(event) {
          let initialX = event.clientX;
          let initialY = event.clientY;
          const sphere = this;

          function mouseMove(event) {
              const diffX = event.clientX - initialX;
              const diffY = event.clientY - initialY;

              const sphereX = parseInt(sphere.style.left || 0) + diffX;
              const sphereY = parseInt(sphere.style.top || 0) + diffY;

              sphere.style.left = sphereX + 'px';
              sphere.style.top = sphereY + 'px';

              initialX = event.clientX;
              initialY = event.clientY;
          }

          function mouseUp() {
              document.removeEventListener('mousemove', mouseMove);
              document.removeEventListener('mouseup', mouseUp);
          }

          document.addEventListener('mousemove', mouseMove);
          document.addEventListener('mouseup', mouseUp);
      });

      // Double-click to bounce functionality
      createSphere.addEventListener('dblclick', function() {
          const speedX = 3;
          const speedY = 3;
          const sphere = this;

          function moveBall() {
              let posX = parseInt(sphere.style.left) || 0;
              let posY = parseInt(sphere.style.top) || 0;
              const sphereWidth = sphere.clientWidth || 0;
              const sphereHeight = sphere.clientHeight || 0;

              if (posX <= 0 || posX >= window.innerWidth - sphereWidth) {
                  speedX *= -1;
              }
              if (posY <= 0 || posY >= window.innerHeight - sphereHeight) {
                  speedY *= -1;
              }

              posX += speedX;
              posY += speedY;

              sphere.style.left = posX + 'px';
              sphere.style.top = posY + 'px';

              requestAnimationFrame(moveBall);
          }

          moveBall();
      });
  }
});
