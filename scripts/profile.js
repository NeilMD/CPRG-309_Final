
const getArtistData = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const mbid = urlParams.get('mbid')
    
    const urlArtist = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=${mbid}&api_key=${API_KEY}&format=json`;
    const urlTopTracks = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&mbid=${mbid}&api_key=${API_KEY}&format=json&limit=5`;
    const urlTopAlbum = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&mbid=${mbid}&api_key=${API_KEY}&format=json&limit=10`;
    

    await getData(urlArtist, fillProfileData);
    await getData(urlTopTracks, fillSongData);
    await getData(urlTopAlbum, fillTopAlbums)
}

const fillProfileData = (json) => {
    document.getElementById('profile-name').innerText = json.artist.name;
    document.getElementById('profile-summary').innerHTML = json.artist.bio.summary;
    console.log(json)
}

const fillSongData = (json) => {
  
    for (let track of json.toptracks.track) {
        let elTd = document.getElementsByClassName("music-tr")[0].cloneNode(true);
        elTd.getElementsByClassName('td-song')[0].innerText = track.name;
        elTd.getElementsByClassName('td-artist')[0].innerText = track.artist.name;
        elTd.getElementsByClassName('td-count')[0].innerText = parseInt(track.playcount).toLocaleString();
        let elA = document.createElement('a');
        elA.setAttribute('href',track.url);
        elA.innerText = `${track.name} Link`
        elTd.getElementsByClassName('td-link')[0].appendChild(elA);
        elTd.getElementsByClassName('td-song')[0].innerText = track.name;
        console.log('asd')
        document.getElementById('music-tbody').insertAdjacentElement('beforeend',elTd)
    }
    
    console.log(json)
}

const fillTopAlbums = async(json) => {
    const elTemp = await getTemplate('./templates/picture-card.html');
    let fragment = document.createDocumentFragment();
    const album = json.topalbums.album;
    for (let i = 0; i < album.length; i++) {
        let el = elTemp.cloneNode(true);
        console.log(album[i])
        el.setAttribute('data-albumname', album[i].name);
        el.setAttribute('data-artist', album[i].artist.name);
        el.getElementsByClassName('discover-name')[0].innerText = album[i].name;
        el.getElementsByClassName("discover-img")[0].src = album[i].image[2]['#text'];
        el.getElementsByClassName("discover-img")[0].style.backgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
        // Check if there is bad data from API
        if (album[i].name == '(null)') {
            continue
        }
        fragment.appendChild(el); 

    }
    console.log(album,fragment)
    document.getElementById('discover-container').appendChild(fragment);
    addBehavior();
}

const addBehavior = () =>{
    document.querySelectorAll('.discover-card').forEach(el => {
    
        const albumname = el.getAttribute("data-albumname");
        const artist = el.getAttribute("data-artist");
        const url = `./album.html?artist=${artist}&albumname=${albumname}`;

        el.addEventListener('click', elClick=>{     
            window.location.href = url;
        })
    });
}

getArtistData();