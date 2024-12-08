
const objFav = {
    img:'',
    name:'',
    artist:'',
    duration:''
}
let arrFav = JSON.parse(window.localStorage.getItem(storageName));
let artistName;

const getAlbumData = async() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const albumname = urlParams.get('albumname');
    const artist = urlParams.get('artist');

    const urlAlbumInfo = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&album=${albumname}&artist=${artist}&autocorrect=1&format=json`;

    await getData(urlAlbumInfo, fillAlbumHeader);
}

const fillAlbumHeader = (json) =>{
    const album = json?.album;
    if (!json?.album) {
        document.getElementById("album-img").style.display = 'none' 
        document.getElementById("album-artist").innerText = 'No info'
        document.getElementById("album-genre").innerText = 'No info'
        document.getElementById("album-year").innerText = 'No info'
        document.getElementById("album-desc").innerHTML = 'No info'
        document.getElementById("album-name").innerText = 'No Album Found.';
        console.log('Once')
        let elNoTracks = `<tr><td id='no-tracks' colspan='3'> No Tracks Found.</td></tr>`
        document.getElementById('songs-tbody').insertAdjacentHTML('beforeend',elNoTracks)
        return  
    }
    document.getElementById("album-img").src = album?.image[2]['#text']
    document.getElementById("album-name").innerText = album.name;
    document.getElementById("album-artist").innerText = album.artist;
    artistName = album.artist;
    if (album.tags) {
        let tag = typeof album.tags?.tag === 'object' && !Array.isArray(album.tags?.tag) ? [album.tags?.tag] : album.tags?.tag;
        document.getElementById("album-genre").innerText = tag.map(item => item.name).join(', ') ?? 'No Info';
    }
    
    document.getElementById("album-year").innerText = album.wiki?.published ? new Date(album.wiki.published).getFullYear() : 'No info'
    document.getElementById("album-desc").innerHTML = album.wiki?.summary ?? 'No info'

    fillTrackData(album.tracks?.track);
}

const fillTrackData = (track) =>{
    // If no tracks
    if (!track) {
        let elNoTracks = `<tr><td id='no-tracks' colspan='4'> No Tracks Found.</td></tr>`
        document.getElementById('songs-tbody').insertAdjacentHTML('beforeend',elNoTracks)
        return;
    }

    let songs = typeof track === 'object' && !Array.isArray(track) ? [track] : track;
    
    for(let i = 0; i < songs.length; i++){
        let elTemp = document.getElementsByClassName('songs-tr')[0].cloneNode(true);

        elTemp.getElementsByClassName('song-num')[0].innerText = `${i+1}.`;
        elTemp.getElementsByClassName('song-name')[0].innerText = songs[i].name;
        if(songs[i].duration != null && songs[i].duration != '') {
            const min = String(Math.floor(songs[i].duration / 60)).padStart(2,0);
            const sec = String(songs[i].duration % 60).padStart(2,0);
            elTemp.getElementsByClassName('song-duration')[0].innerText = `${min}:${sec}`;
        }

        // Check if already favorited
        let exist = arrFav.findIndex(obj => {return obj.name === songs[i].name && obj.artist === artistName});
        if(exist > -1) {
           elTemp.classList.add('favorited')
        }

        document.getElementById('songs-tbody').insertAdjacentElement('beforeend',elTemp)
    }
    addBehavior();
}

const addBehavior = () => {
    document.querySelectorAll('.playlist-add').forEach(el => {
        el.addEventListener('click',()=>setFavorite(el));
    })
}

const setFavorite = (el) => {
    let fav = objFav;
    fav.name = el.getElementsByClassName("song-name")[0].innerText;
    fav.artist = document.getElementById("album-artist").innerText;
    

    if( el.classList.contains('favorited')) {

        let index = arrFav.findIndex(obj => obj.name === fav.name && obj.artist === fav.artist);
        arrFav.splice(index,1);

        window.localStorage.setItem(storageName, JSON.stringify(arrFav));
        el.classList.remove('favorited');
    } else {
        fav.img = document.getElementById("album-img").src;
        fav.duration = el.getElementsByClassName("song-duration")[0].innerText;

        // Avoid adding duplicate
        let exist = arrFav.find(obj => obj.name === fav.name && obj.artist === fav.artist);
        if(exist === undefined) {
            arrFav.push(fav);
        }
    
        window.localStorage.setItem(storageName, JSON.stringify(arrFav));
        el.classList.add('favorited');
    }
    
}

getAlbumData();
