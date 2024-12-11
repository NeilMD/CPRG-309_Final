// Function to load a template and inject it into a specific container
function loadTemplate(templatePath, containerId) {
    fetch(templatePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
        })
        .catch(error => console.error('Error fetching template:', error));
}

// Load the header and footer templates
loadTemplate('./templates/header.html', 'header-container');
loadTemplate('./templates/footer.html', 'footer-container');


// Getting templates
async function getTemplate(templatePath) {
    let elTemp=  await fetch(templatePath)
    const htmlString = await elTemp.text();    // Wait for the text conversion of the response
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();      // Trim to avoid whitespace issues
    return template.content.firstChild;  // Get the first child element
}

//API Key
const API_KEY = 'c99cc5d3666194fc8e534e7681c87fca';
//API get Data
async function getData(url, fn) {
    try {
      let response = await fetch(url);
      let json = await response.json();
      if (!response.ok) {
        if (json.message == 'Album not found') {
          fn(json);
          return;
        } else{
          throw new Error(`Response status: ${response.status}`);
        }
        
      }
      fn(json)
    } catch (error) {
     
      console.error(error.message);
    }
}

const backgroundColors = [
  '#1ED760', // Green
  '#8A2BE2', // Blue-Violet
  '#D71E1E', // Red
  '#17a2b8', // Teal
  '#28a745', // Green
  '#ffc107', // Yellow
  '#007bff', // Blue
  '#ff5733'  // Orange
];

const storageName = 'beat_favorites';
if(localStorage.getItem(storageName) === null){
  let arr =[];
  localStorage.setItem(storageName, JSON.stringify(arr));
};

// Setting default image when image does not exist
const defaultImg = () =>{
  event.target.setAttribute("src","./assets/default_img.svg");
}