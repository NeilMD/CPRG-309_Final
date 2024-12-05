
const getArtistData = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const mbid = urlParams.get('mbid')
    
    const urlArtist = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=${mbid}&api_key=${API_KEY}&format=json`;
    const urlTopTracks = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&mbid=${mbid}&api_key=${API_KEY}&format=json&limit=5`;

    await getData(urlArtist, fillProfileData);
    await getData(urlTopTracks, fillSongData);
}

const fillProfileData = (json) => {
    document.getElementById('profile-name').innerText = json.artist.name;
    document.getElementById('profile-summary').innerText = json.artist.bio.summary;
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

const fillSimilarArtist = (json) => {
    console.log(json)
}

getArtistData();