// Global array to store spheres with their speeds for collision detection
let allSpheres = [];

// Function to create spheres
function createSpheres(body, numOfSpheres, colours) {
  for (let i = 0; i < numOfSpheres; i++) {
    const createSphere = document.createElement("div");  // creates new div element in HTML
    createSphere.className = "sphere";  // assigning the defined sphere CSS element to 'createSphere'

    const x = Math.floor(Math.random() * (window.innerWidth - 100));  // gives random xpos
    const y = Math.floor(Math.random() * (window.innerHeight - 100));  // gives random ypos
    createSphere.style.left = x + "px";  // starts at left side of screen
    createSphere.style.top = y + "px";  // starts at top of screen

    const sphereColour = colours[Math.floor(Math.random() * colours.length)];  // gets random sphere colour
    createSphere.style.background = `radial-gradient(circle at 50% 50%, ${sphereColour}, black)`;  // assigning radial gradient
    createSphere.style.boxShadow = `0 0 3px 1.5px ${sphereColour}`;  // adding shadow for 3D effect

    body.appendChild(createSphere);  // adds sphere to HTML doc as a child of the body element
    addSphereDrag(createSphere);  // adds dragging functionality to the sphere
    addSphereDoubleClick(createSphere, allSpheres);  // adds double-click functionality for movement and collision
  }
}

// Function to add dragging events to the sphere
function addSphereDrag(sphere) {
  sphere.addEventListener('mousedown', function(event) {
    let initialX = event.clientX;  // initial xpos at mouse press
    let initialY = event.clientY;  // initial ypos at mouse press

    function mouseMove(event) {
      let diffX = event.clientX - initialX;  // difference between current and initial xpos
      let diffY = event.clientY - initialY;  // difference between current and initial ypos

      let sphereX = parseInt(sphere.style.left || 0) + diffX;  // calculates new x pos
      let sphereY = parseInt(sphere.style.top || 0) + diffY;  // calculates new y pos

      sphere.style.left = sphereX + 'px';  // sets new x pos
      sphere.style.top = sphereY + 'px';  // sets new y pos

      initialX = event.clientX;  // resets mouse press reference point
      initialY = event.clientY;
    }

    function mouseUp() {
      document.removeEventListener('mousemove', mouseMove);  // removes mouse move event listener
      document.removeEventListener('mouseup', mouseUp);  // removes mouse up event listener
    }

    document.addEventListener('mousemove', mouseMove);  // adds mouse move event listener
    document.addEventListener('mouseup', mouseUp);  // adds mouse up event listener
  });
}

// Function to add double-click events for animation to the sphere
function addSphereDoubleClick(sphere, allSpheres) {
  sphere.addEventListener('dblclick', function() {
    const speeds = { speedX: 3, speedY: 3 };
    allSpheres.push({ sphere, speeds });
    moveBall(sphere, speeds, allSpheres);  // call the moveBall function with arguments
  });
}

// Function to move the ball
function moveBall(sphere, speeds, allSpheres) {
  let posX = parseInt(sphere.style.left) || 0;  // get the current x pos of the sphere
  let posY = parseInt(sphere.style.top) || 0;  // get the current y pos of the sphere
  const sphereWidth = sphere.clientWidth || 0;  // get the width of the sphere
  const sphereHeight = sphere.clientHeight || 0;  // get the height of the sphere    

  function move() {
    // Check if the sphere has reached the left or right edge of the window.
    if (posX <= 0 || posX >= window.innerWidth - sphereWidth) {
      speeds.speedX *= -1;  // reverse direction
    }

    // Check if the sphere has reached the top or bottom edge of the window.
    if (posY <= 0 || posY >= window.innerHeight - sphereHeight) {
      speeds.speedY *= -1;  // reverse direction
    }

    posX += speeds.speedX;  // update x pos
    posY += speeds.speedY;  // update y pos

    sphere.style.left = posX + 'px';  // set new x pos
    sphere.style.top = posY + 'px';  // set new y pos

    // Check for collisions with other spheres
    for (let otherSphereObj of allSpheres) {
      let otherSphere = otherSphereObj.sphere;
      let otherSpeeds = otherSphereObj.speeds;
      if (otherSphere !== sphere && collide(sphere, otherSphere)) {
        handleCollision(sphere, otherSphere, speeds, otherSpeeds);  // call collision handler
      }
    }

    requestAnimationFrame(move);  // request the next animation frame
  }

  requestAnimationFrame(move);  // call the move function
}

// Function to check collision between two spheres
function collide(sphere1, sphere2) {
  const x1 = parseInt(sphere1.style.left) + sphere1.clientWidth / 2;  // xpos of sphere1 + radius
  const y1 = parseInt(sphere1.style.top) + sphere1.clientHeight / 2;  // ypos of sphere1 + radius
  const x2 = parseInt(sphere2.style.left) + sphere2.clientWidth / 2;  // xpos of sphere2 + radius
  const y2 = parseInt(sphere2.style.top) + sphere2.clientHeight / 2;  // ypos of sphere2 + radius

  const distanceX = x2 - x1;  // distance between two xpos
  const distanceY = y2 - y1;  // distance between two ypos
  const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);  // distance formula

  const sphereRadii = (sphere1.clientWidth / 2) + (sphere2.clientWidth / 2);  // combined radii distance before touching each other
  return totalDistance < sphereRadii;  // true if spheres collided
}

// Function to handle the collision response between two spheres
function handleCollision(sphere1, sphere2, speed1, speed2) {
  // Simple collision response
  let tempSpeedX = speed1.speedX;  // store sphere1's current speedX temporarily
  let tempSpeedY = speed1.speedY;  // store sphere1's current speedY temporarily

  speed1.speedX = speed2.speedX;  // assign sphere2's speedX to sphere1
  speed1.speedY = speed2.speedY;  // assign sphere2's speedY to sphere1

  speed2.speedX = tempSpeedX;  // assign tempSpeedX to sphere2's speedX
  speed2.speedY = tempSpeedY;  // assign tempSpeedY to sphere2's speedY
}

// Main body of the script
document.addEventListener("DOMContentLoaded", function() {
  const body = document.querySelector("body");  // gets body element of HTML 
  const numOfSpheres = Math.floor(Math.random() * 10);  // Math random creates a decimal between 0 and 1, ie 0.4785. * 10 to give 4.785 and then flooring it to 4
  const colours = ['green', 'yellow', 'blue', 'pink', 'yellow', 'purple', 'red', 'orange'];  // array of potential sphere colours

  createSpheres(body, numOfSpheres, colours);  // call the function to create spheres
});
