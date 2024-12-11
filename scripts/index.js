const urlTopTracks = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY}&format=json&limit=10`;
const urlTogTags = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptags&api_key=${API_KEY}&format=json&limit=9`;


let artistMbid =[];
const addTrendingData = async(json) => {
  let tracks = json.tracks.track;
  let elTemp = await getTemplate('./templates/rank-card.html');
  let fragment = document.createDocumentFragment();

  
  for (let i = 0; i < tracks.length; i++) {
    let el = elTemp.cloneNode(true);
    el.setAttribute("data-mbid", tracks[i].artist.mbid);
    el.getElementsByClassName('artist-name')[0].innerText = tracks[i].artist.name;
    el.getElementsByClassName('music-name')[0].innerText = tracks[i].name;
    el.getElementsByClassName('order')[0].innerText = `#${i+1}`;
    let imgSrc = await getImage(tracks[i].name,tracks[i].artist.name);
    el.getElementsByClassName("card-img")[0].src = imgSrc?.track?.album?.image[2]['#text'] ??  '';
    el.getElementsByClassName("card-img")[0].setAttribute('alt',`${tracks[i].name} Image`)
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
    el.setAttribute('data-albumname', arrObjDiscover[i].name);
    el.setAttribute('data-artist', arrObjDiscover[i].artist.name);
    el.getElementsByClassName('discover-desc')[0].innerText = `Discover songs from ${arrObjDiscover[i].artist.name}`;
    el.getElementsByClassName('discover-name')[0].innerText = arrObjDiscover[i].name;
    el.getElementsByClassName("discover-img")[0].src = arrObjDiscover[i].image[2]['#text'];
    el.getElementsByClassName("discover-img")[0].setAttribute('alt',`${arrObjDiscover[i].name} Image`)
    el.getElementsByClassName("discover-img")[0].style.backgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    // Check if there is bad data from API
    if (arrObjDiscover[i].name == '(null)') {
      continue
    }
    fragment.appendChild(el); 
    
  }
  document.getElementById('discover-container').appendChild(fragment);
  getData(urlTogTags, addGenreData);
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

const addGenreData = async(json) =>{
  let tag = json?.tags?.tag;
  let elTemp = await getTemplate('./templates/genre-card.html');
  let fragment = document.createDocumentFragment();

  for (let i = 0; i < tag.length; i++) {
    let el = elTemp.cloneNode(true);
    el.getElementsByClassName('mood-name')[0].innerText = tag[i].name;
    el.setAttribute("data-genre",tag[i].name.replaceAll(/\s/g,'+'));
    fragment.appendChild(el); 
    
  }
  
  document.getElementById('mood-wrapper').appendChild(fragment);
  addBehavior();
}

(async function(){
  await getData(urlTopTracks, addTrendingData);
})();



const addBehavior = () => {
  // Scroll
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
  document.querySelectorAll('.weekly-card').forEach(el => {
    
    const mbid = el.getAttribute("data-mbid");
    const url = `./profile.html?mbid=${mbid}`;
    
    if (!mbid || mbid === '') {
        el.classList.add('info-none'); 
        return;
    } 

    el.classList.add('info-available');
    el.addEventListener('click', elClick=>{     
      window.location.href = url;
    })
  });

  document.querySelectorAll('.discover-card').forEach(el => {
    
    const albumname = el.getAttribute("data-albumname");
    const artist = el.getAttribute("data-artist");
    const url = `./album.html?artist=${artist}&albumname=${albumname}`;
    
    el.addEventListener('click', elClick=>{     
      window.location.href = url;
    })
  });

  document.querySelectorAll('.mood-container').forEach(el => {
    
    const genre = el.getAttribute("data-genre");
    const url = `./list.html?page=home&genre=${genre}`;
    
    el.addEventListener('click', elClick=>{     
      window.location.href = url;
    })
  });
}

