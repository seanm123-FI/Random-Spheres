// Global array to store spheres with their speeds for collision detection
let allSpheres = [];

// Define Ireland's latitude and longitude
const IRELAND_COORDS = {
  lat: 53.1424, 
  lng: -7.6921
};

// Function to create spheres
function createSpheres(body, numOfSpheres, colours) {
  for (let i = 0; i < numOfSpheres; i++) {
    let createSphere = document.createElement('div'); // creates new div element
    createSphere.className = 'sphere'; // assigning the defined sphere CSS element to 'createSphere'

    const x = Math.floor(Math.random() * (window.innerWidth - 100)); // gives random xpos
    const y = Math.floor(Math.random() * (window.innerHeight - 100)); // gives random ypos
    createSphere.style.left = x + 'px'; // starts at left side of screen
    createSphere.style.top = y + 'px'; // starts at top of screen

    document.body.appendChild(createSphere);
    let isOverlapping = checkOverlapOnCreation(createSphere, allSpheres);

    if (isOverlapping) {
      console.log('Overlap detected, repositioning sphere.');
      document.body.removeChild(createSphere); // Remove from DOM if overlapping
    } else {
      const randomIndex = Math.floor(Math.random() * colours.length);
      const sphereColour = colours[randomIndex]; // gets random sphere colour
      createSphere.style.background = `radial-gradient(circle at 50% 50%, ${sphereColour}, black)`; // assigning radial gradient
      createSphere.style.boxShadow = `0 0 3px 1.5px ${sphereColour}`; // adding shadow for 3D effect

      body.appendChild(createSphere); // adds sphere to body
      const speeds = { speedX: 5, speedY: 5 };
      allSpheres.push({ sphere: createSphere, speeds });
      addSphereDrag(createSphere); // adds dragging functionality
      addSphereDoubleClick(createSphere, speeds); // adds double-click functionality for movement and collision
      updateShadow(createSphere)
    }
  }
}

function checkOverlapOnCreation(newSphere, existingSpheres) {
  for (let existingSphereObj of existingSpheres) {
    if (collide(newSphere, existingSphereObj.sphere)) {
      return true;
    }
  }
  return false;
}

// Function to add dragging events to the sphere
function addSphereDrag(sphere) {
  sphere.addEventListener('mousedown', function (event) {
    let initialX = event.clientX; // initial xpos at mouse press
    let initialY = event.clientY; // initial ypos at mouse press

    function mouseMove(event) {
      let diffX = event.clientX - initialX; // difference between current and initial xpos
      let diffY = event.clientY - initialY; // difference between current and initial ypos

      let sphereX = parseInt(sphere.style.left || 0) + diffX; // calculates new x pos
      let sphereY = parseInt(sphere.style.top || 0) + diffY; // calculates new y pos

      sphere.style.left = sphereX + 'px'; // sets new x pos
      sphere.style.top = sphereY + 'px'; // sets new y pos

      initialX = event.clientX; // resets mouse press reference point
      initialY = event.clientY;

      updateShadow(sphere);
    }

    function mouseUp() {
      document.removeEventListener('mousemove', mouseMove); // removes mouse move event listener
      document.removeEventListener('mouseup', mouseUp); // removes mouse up event listener
    }

    document.addEventListener('mousemove', mouseMove); // adds mouse move event listener
    document.addEventListener('mouseup', mouseUp); // adds mouse up event listener
  });
}

// Function to add double-click event to the sphere
function addSphereDoubleClick(sphere, speeds) {
  sphere.addEventListener('dblclick', function () {
    moveBall(sphere, speeds); // call the moveBall function with arguments
  });
}

// Function to move the ball
function moveBall(sphere, speeds) {
  console.log('Starting moveBall');
  let posX = parseInt(sphere.style.left) || 0; // get the current x pos of the sphere
  let posY = parseInt(sphere.style.top) || 0; // get the current y pos of the sphere
  const sphereWidth = sphere.clientWidth || 0; // get the width of the sphere
  const sphereHeight = sphere.clientHeight || 0; // get the height of the sphere

  function move() {
    if (posX <= 0 || posX >= window.innerWidth - sphereWidth) {
      speeds.speedX *= -1; // reverse direction
    }

    if (posY <= 0 || posY >= window.innerHeight - sphereHeight) {
      speeds.speedY *= -1; // reverse direction
    }

    posX += speeds.speedX; // update x pos
    posY += speeds.speedY; // update y pos

    sphere.style.left = posX + 'px'; // set new x pos
    sphere.style.top = posY + 'px'; // set new y pos

    updateShadow(sphere);

    // Check for collisions with other spheres
    for (let otherSphereObj of allSpheres) {
      let otherSphere = otherSphereObj.sphere;
      let otherSpeeds = otherSphereObj.speeds;
      if (otherSphere !== sphere && collide(sphere, otherSphere)) {
        console.log('COLLISION');
        handleCollision(sphere, otherSphere, speeds, otherSpeeds); // call collision handler
      }
    }
    if (speeds.speedX != 0 || speeds.speedY != 0) {
      requestAnimationFrame(move); // request the next animation frame
    }
  }
  requestAnimationFrame(move); // call the move function
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
  const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY); // Euclidean distance

  const combinedRadii = (sphere1.clientWidth / 2) + (sphere2.clientWidth / 2);

  return totalDistance < combinedRadii;
}

// Function to handle the collision response between two spheres
function handleCollision(movingSphere, staticSphere, movingSpeeds) {
  const x1 = parseInt(movingSphere.style.left) + (movingSphere.clientWidth / 2);
  const y1 = parseInt(movingSphere.style.top) + (movingSphere.clientHeight / 2);

  const x2 = parseInt(staticSphere.style.left) + (staticSphere.clientWidth / 2);
  const y2 = parseInt(staticSphere.style.top) + (staticSphere.clientHeight / 2);

  const distanceX = x2 - x1;
  const distanceY = y2 - y1;
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  const overlap = (movingSphere.clientWidth / 2) + (staticSphere.clientWidth / 2) - distance;

  const normX = distanceX / distance;
  const normY = distanceY / distance;

  const pushX = overlap * normX;
  const pushY = overlap * normY;

  movingSphere.style.left = `${parseInt(movingSphere.style.left) - pushX}px`;
  movingSphere.style.top = `${parseInt(movingSphere.style.top) - pushY}px`;

  const dotProduct = movingSpeeds.speedX * normX + movingSpeeds.speedY * normY;
  movingSpeeds.speedX -= 2 * dotProduct * normX;
  movingSpeeds.speedY -= 2 * dotProduct * normY;
}

async function getSunPosition(date, coords) {
  const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${coords.lat}&lng=${coords.lng}&formatted=0&date=${date}`);
  const data = await response.json();
  console.log(data);
  return data;
  
}

function convertToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function calculateSunPosition(sunrise, sunset, currentTime) {
  const sunriseMinutes = convertToMinutes(sunrise);
  const sunsetMinutes = convertToMinutes(sunset);
  const currentTimeMinutes = convertToMinutes(currentTime);

  const totalMinutesOfDaylight = sunsetMinutes - sunriseMinutes;
  const sunPositionPercentage = (currentTimeMinutes - sunriseMinutes) / totalMinutesOfDaylight;

  return sunPositionPercentage * window.innerWidth;
}

// Function to get current time in HH:MM format
function getCurrentTime() {
  const now = new Date();
  console.log(now)
  return now.toISOString().substring(11, 16);
}

// Function to get a random number between min and max (inclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRGBColour() {
  const red = getRandomNumber(0, 255);
  const green = getRandomNumber(0, 255);
  const blue = getRandomNumber(0, 255);
  return `rgb(${red}, ${green}, ${blue})`;
}

// Function to update shadow based on the sun's position
function updateShadow(sphere) {
  const sun = document.querySelector('.sun');
  
  const sunX = parseInt(sun.style.left) + (sun.clientWidth / 2);
  const sunY = parseInt(sun.style.top) + (sun.clientHeight / 2);
  
  const sphereX = parseInt(sphere.style.left) + (sphere.clientWidth / 2);
  const sphereY = parseInt(sphere.style.top) + (sphere.clientHeight / 2);
  
  // Calculate angle between sun and sphere
  const angle = Math.atan2(sphereY - sunY, sphereX - sunX);
  console.log(angle)
  
  // Calculate distance between sun and sphere
  const distance = Math.sqrt(Math.pow(sphereX - sunX, 2) + Math.pow(sphereY - sunY, 2));

  // Set shadow direction and length
  const shadowLength = Math.min(100, distance / 10); // Cap the shadow length
  const shadowX = Math.cos(angle) * shadowLength;
  const shadowY = Math.sin(angle) * shadowLength;

  // Update sphere shadow
  sphere.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowLength}px rgba(0,0,0,0.8)`;
}
   

async function initialise() {
  const body = document.querySelector('body');

  // Add the sun
  const sun = document.createElement('div');
  sun.className = 'sun';
  body.appendChild(sun);

  const currentDate = new Date().toISOString().split('T')[0];
  const sunData = await getSunPosition(currentDate, IRELAND_COORDS);
  
  const sunrise = sunData.results.sunrise.split('T')[1].substring(0, 5);
  const sunset = sunData.results.sunset.split('T')[1].substring(0, 5);
  console.log('sunrise ' + sunrise + ',', 'sunset '+ sunset);
  const currentTime = getCurrentTime();

  const sunXPos = calculateSunPosition(sunrise, sunset, currentTime);
  sun.style.left = `${sunXPos}px`;
  sun.style.top = '100px'; // Fixed height for simplicity

  // Create spheres
  const numOfSpheres = Math.floor(Math.random() * 10); // generates a random number of spheres between 0 and 10
  const colours = Array.from({ length: numOfSpheres }, getRandomRGBColour);

  createSpheres(body, numOfSpheres, colours); // call the function to create spheres
}

document.addEventListener('DOMContentLoaded', initialise);
