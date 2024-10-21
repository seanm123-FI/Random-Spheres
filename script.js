// Global array to store spheres with their speeds for collision detection
let allSpheres = [];

// Function to create spheres
function createSpheres(body, numOfSpheres, colours) {
  for (let i = 0; i < numOfSpheres; i++) {
    let attempts = 0;           
    createSphere = document.createElement("div");  // creates new div element in HTML
    createSphere.className = "sphere";  // assigning the defined sphere CSS element to 'createSphere'

    const x = Math.floor(Math.random() * (window.innerWidth - 100));  // gives random xpos
    const y = Math.floor(Math.random() * (window.innerHeight - 100));  // gives random ypos
    createSphere.style.left = x + "px";  // starts at left side of screen
    createSphere.style.top = y + "px";  // starts at top of screen

    document.body.appendChild(createSphere);
    isOverlapping = checkOverlapOnCreation(createSphere, allSpheres);
    

  if (isOverlapping) {
    attempts++;
    console.log('Overlap detected, repositioning sphere.');
    document.body.removeChild(createSphere); // Remove from DOM if overlapping
    }
  else
    {
      const randomIndex = Math.floor(Math.random() * colours.length);
      const sphereColour = colours[randomIndex]; // gets random sphere colour
      createSphere.style.background = `radial-gradient(circle at 50% 50%, ${sphereColour}, black)`; // assigning radial gradient
      createSphere.style.boxShadow = `0 0 3px 1.5px ${sphereColour}`; // adding shadow for 3D effect

      body.appendChild(createSphere);  // adds sphere to HTML doc as a child of the body element  
    // createSpheres(body, numOfSpheres, colours);  
      const speeds = { speedX: 5, speedY: 5 };  
      allSpheres.push({ sphere: createSphere, speeds });
      addSphereDrag(createSphere);  // adds dragging functionality to the sphere
      addSphereDoubleClick(createSphere, speeds);  // adds double-click functionality for movement and collision
      //I had too many arguments in double click func
    }
  }
}


 function checkOverlapOnCreation(newSphere, existingSpheres){
        for (let existingSphereObj of existingSpheres) {
          if(collide(newSphere, existingSphereObj.sphere)){
            return true;
          }
        }
        return false;
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


function addSphereDoubleClick(sphere, speeds) {
  sphere.addEventListener('dblclick', function() {
    moveBall(sphere, speeds);  // call the moveBall function with arguments
  });
}

// Function to move the ball
function moveBall(sphere, speeds) {
  console.log('Starting moveBall'); 
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
        console.log("COLLISION")
        handleCollision(sphere, otherSphere, speeds, otherSpeeds);  // call collision handler
            
      }
    }
    if(speeds.speedX != 0 || speeds.speedY != 0){ //no need to call new frame if sphere not moving
    requestAnimationFrame(move);  // request the next animation frame
  }
}
  requestAnimationFrame(move);  // call the move function 
}

// Function to check collision between two spheres
function collide(sphere1, sphere2) {
  // Calculate the center coordinates of sphere1
  const x1 = parseInt(sphere1.style.left) + (sphere1.clientWidth / 2);
  const y1 = parseInt(sphere1.style.top) + (sphere1.clientHeight / 2);
  
  // Calculate the center coordinates of sphere2
  const x2 = parseInt(sphere2.style.left) + (sphere2.clientWidth / 2);
  const y2 = parseInt(sphere2.style.top) + (sphere2.clientHeight / 2);

  
  // Compute distance between the centers
  const distanceX = x2 - x1;
  const distanceY = y2 - y1;
  const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);  // Euclidean distance
  
  // Compute the sum of the radii
  const combinedRadii = (sphere1.clientWidth / 2) + (sphere2.clientWidth / 2);
  
  // Return true if totalDistance is less than combinedRadii
  return totalDistance < combinedRadii;
}


// Function to handle the collision response between two spheres
function handleCollision(movingSphere, staticSphere, movingSpeeds){

    // Calculate the center coordinates of movingSphere
    const x1 = parseInt(movingSphere.style.left) + (movingSphere.clientWidth / 2);
    const y1 = parseInt(movingSphere.style.top) + (movingSphere.clientHeight / 2);
  
    // Calculate the center coordinates of staticSphere
    const x2 = parseInt(staticSphere.style.left) + (staticSphere.clientWidth / 2);
    const y2 = parseInt(staticSphere.style.top) + (staticSphere.clientHeight / 2);

      // Calculate distance
    const distanceX = x2 - x1;
    const distanceY = y2 - y1;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);


        // Calculate overlap
    const overlap = ((movingSphere.clientWidth / 2) + (staticSphere.clientWidth / 2)) - distance;

    // Normalize
    const normX = distanceX / distance;
    const normY = distanceY / distance;

    // Move moving sphere apart from static sphere
    const pushX = overlap * normX;
    const pushY = overlap * normY;

    movingSphere.style.left = `${parseInt(movingSphere.style.left) - pushX}px`;
    movingSphere.style.top = `${parseInt(movingSphere.style.top) - pushY}px`;

    // Reflect the velocity of the moving sphere
    const dotProduct = movingSpeeds.speedX * normX + movingSpeeds.speedY * normY;
    movingSpeeds.speedX -= 2 * dotProduct * normX;
    movingSpeeds.speedY -= 2 * dotProduct * normY;
}

async function getDateTime(){
  const response = await
  fetch('http://worldtimeapi.org/api/ip');
    const data = await response.json();
    return new Date(data.datetime);
}


function getSunPosition(datetime){
  const hours = datetime.getHours();
  const minutes = datetime.getMinutes();
  const totalMinutes = (hours * 60) + minutes;
  const xpos = (window.innerWidth / 1440) * totalMinutes;

  return{x: xpos, y: 100};
}

// Function to get a random number between min and max (inclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRGBColour(){
  var red = getRandomNumber(0, 255);
  var green = getRandomNumber(0, 255);
  var blue = getRandomNumber(0, 255);
  return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
}

async function initialise() {
  const body = document.querySelector("body");
  const sun = document.createElement("div");
  sun.className = "sun";
  body.appendChild(sun);

  const datetime = await getDateTime();
  const sunPosition = getSunPosition(datetime);
  sun.style.left = `${sunPosition.x}px`;
  sun.style.top = `${sunPosition.y}px`;

  const numOfSpheres = Math.floor(Math.random() * 10);  // generates a random number of spheres between 0 and 10
  const colours = [];
  for (let i = 0; i < numOfSpheres; i++) {
    colours.push(getRandomRGBColour()); // generates a random color and adds it to the colours array
  }

  createSpheres(body, numOfSpheres, colours);  // call the function to create spheres
}

document.addEventListener("DOMContentLoaded", initialise);



//es6        

//use css definitions for shadow creation
//sun is its own separate object, no collisions