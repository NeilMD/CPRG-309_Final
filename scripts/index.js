const urlTopTracks = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY}&format=json&limit=10`;
const backgroundColors = [
  '#1ED760', '#1ED760', '#D71E1E',   '#17a2b8', '#28a745', '#ffc107',   '#f8f9fa',  '#343a40',  '#007bff',  '#ff5733' 
];

//API get Data
async function getData(url, fn) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    let json = await response.json();
    fn(json)
  } catch (error) {
    console.error(error.message);
  }
}

let artistMbid =[];
const addTrendingData = async(json) => {
  let tracks = json.tracks.track;
  let elTemp = await getTemplate('./templates/rank-card.html');
  let fragment = document.createDocumentFragment();

  
  for (let i = 0; i < tracks.length; i++) {
    let el = elTemp.cloneNode(true);
    el.getElementsByClassName('artist-name')[0].innerText = tracks[i].artist.name;
    el.getElementsByClassName('music-name')[0].innerText = tracks[i].name;
    el.getElementsByClassName('order')[0].innerText = `#${i+1}`;
    let imgSrc = await getImage(tracks[i].name,tracks[i].artist.name);
    el.getElementsByClassName("card-img")[0].src = imgSrc?.track?.album?.image[2]['#text'] ??  '';
    el.getElementsByClassName("card-img")[0].style.backgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
    fragment.appendChild(el); 
    artistMbid.push(tracks[i].artist.mbid);
  }
  document.getElementById('weekly-cards-container').appendChild(fragment);
  // addBehavior();
  addDiscoverData(artistMbid)
}

const addDiscoverData = async(json) =>{
  // console.log(json)
  let artists = json?.artists?.artist;
  let elTemp = await getTemplate('./templates/picture-card.html');
  let fragment = document.createDocumentFragment();

  let arrObjDiscover = [];
  let urlTopAlbum, response, albJson, random;
  for (let i = 0 ; i < artistMbid.length; i++){  
    console.log('befpre if')
    if (artistMbid[i] === "") {
      continue
    }
    urlTopAlbum = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&mbid=${artistMbid[i]}&api_key=${API_KEY}&format=json`;
    try {
      response = await fetch(urlTopAlbum);
      albJson = await response.json();
      let albums = albJson?.topalbums?.album ?? [];
      
      // Only proceed if albums is a non-empty array
      if (albums.length > 0 && albums != "") {
        // Get a random album from the array
        randomAlbum = albums[Math.floor(Math.random() * albums.length)];
        arrObjDiscover.push(randomAlbum);
      }
    } catch (error) {
      console.error("Error fetching album data:", error);
    }
   
  }
  for (let i = 0; i < arrObjDiscover.length; i++) {
    let el = elTemp.cloneNode(true);
    el.getElementsByClassName('discover-desc')[0].innerText = `Discover songs from ${arrObjDiscover[i].artist.name}`;
    el.getElementsByClassName('discover-name')[0].innerText = arrObjDiscover[i].name;
    el.getElementsByClassName("discover-img")[0].src = arrObjDiscover[i].image[2]['#text']
    el.getElementsByClassName("discover-img")[0].style.backgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
    fragment.appendChild(el); 
    
  }
  document.getElementById('discover-container').appendChild(fragment);
  addBehavior();
}

const getImage = async(searchKey, searchArtist) => {
  let imgSrc = '';
  let json;
  try {
    let response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=c99cc5d3666194fc8e534e7681c87fca&artist=${searchArtist}&track=${searchKey}&format=json&autocorrect=1`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
   json = await response.json();
    
  } catch (error) {
    console.error(error.message);
  }
  return json
}

(async function(){
  await getData(urlTopTracks, addTrendingData);
})();
// const addImage = async (tracks)=>{
//   let url = 'https://musicbrainz.org/ws/2/release/64f0d73-1234-4e2c-8743-d77bf2191051';  // Your API endpoint or URL
//   let response = await fetch(url, {
//     method: 'GET',  // Or 'POST' if you're making a POST request
//     headers: {
//       'User-Agent': 'CPRG310/1.2.0 (http://https://github.com/NeilMD/CPRG-309_Final/deployments/github-pages)',
//       'Contact': 'aws.neilcapistra@gmail.com',  // Optional: Custom header for email or contact information
//       // Add other headers here if needed
//     }
//   });
// }



const addBehavior = () => {
  window.addEventListener('scroll', function(){
      let msg = this.document.getElementById("landing-msg");
      msg.style.transform = `translateY(-${window.scrollY/3}px)`;
  });

  //Next and Prev button
  document.getElementById('prev-btn').addEventListener('click', function() {
      const container = document.getElementById('discover-container');
      container.scrollLeft -= 250; // Scroll 100px to the left
  });

  document.getElementById('next-btn').addEventListener('click', function() {
      const container = document.getElementById('discover-container');
      container.scrollLeft += 250; // Scroll 100px to the right
  });
  // ANIMATION for trending Section
  const focus = document.querySelectorAll('.from-left, .from-right');
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      
        if(entry.target.classList.contains('from-left')) {
          entry.target.classList.toggle("left-animate", entry.isIntersecting);
        }else{
          entry.target.classList.toggle("right-animate", entry.isIntersecting);
        }
    });
  }, {
    threshold: 0.2
  });

  focus.forEach(im => slideObserver.observe(im));
}

