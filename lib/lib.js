function loadJSONFileSync(url) {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType('application/json');
    xhr.open('GET', url, false);
    xhr.send(null);
    
    if (xhr.status === 200) {
      try {
        const json = JSON.parse(xhr.responseText);
        return json;
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    } else {
      console.error('Failed to load JSON file. Status:', xhr.status);
    }
  }

//2D distance
function distance(x1, y1, x2, y2) {
    const xDistance = x2 - x1;
    const yDistance = y2 - y1;
    
    // Calculate the distance using the Pythagorean theorem
    const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
    
    return distance;
}

//Disable right click menu
document.addEventListener("contextmenu", function(event) {
  event.preventDefault(); // Prevent the default context menu from showing up
});

radian_clamp=function(inputRadian, minRadian=0, maxRadian=Math.PI*2) {
  // Ensure input is within the specified range
  while (inputRadian < minRadian) {
      inputRadian += maxRadian;
  } 
   while (inputRadian > maxRadian) {
    inputRadian -= maxRadian;
  }
  return inputRadian;
}


radian_to_degrees=function(radians) {
  return radians * (180 / Math.PI);
}

// Convert degrees to radians
degrees_to_radian=function(degrees) {
  return degrees * (Math.PI / 180);
}