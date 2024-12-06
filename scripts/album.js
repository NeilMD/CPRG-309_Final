
const getAlbumData = async() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const albumname = urlParams.get('albumname');
    const artist = urlParams.get('artist');

    const urlAlbumInfo = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&album=${albumname}&artist=${artist}&format=json`;

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
    document.getElementById("album-artist").innerText = album.artist
    let tag = typeof album.tags?.tag === 'object' && !Array.isArray(album.tags?.tag) ? [album.tags?.tag] : album.tags?.tag;
    document.getElementById("album-genre").innerText = tag.map(item => item.name).join(', ') ?? 'No Info';
    document.getElementById("album-year").innerText = album.wiki?.published ? new Date(album.wiki.published).getFullYear() : 'No info'
    document.getElementById("album-desc").innerHTML = album.wiki?.summary ?? 'No info'

    fillTrackData(album.tracks?.track);
}

const fillTrackData = (track) =>{
    console.log(track)
    // If no tracks
    if (!track) {
        let elNoTracks = `<tr><td id='no-tracks' colspan='3'> No Tracks Found.</td></tr>`
        document.getElementById('songs-tbody').insertAdjacentHTML('beforeend',elNoTracks)
        return;
    }

    let songs = typeof track === 'object' && !Array.isArray(track) ? [track] : track;
    console.log(songs)
    for(let i = 0; i < songs.length; i++){
        console.log('enter')
        let elTemp = document.getElementsByClassName('songs-tr')[0].cloneNode(true);

        elTemp.getElementsByClassName('song-num')[0].innerText = `${i+1}.`;
        elTemp.getElementsByClassName('song-name')[0].innerText = songs[i].name;
        console.log(songs[i].duration)
        if(songs[i].duration != null && songs[i].duration != '') {
            const min = String(Math.floor(songs[i].duration / 60)).padStart(2,0);
            const sec = String(songs[i].duration % 60).padStart(2,0);
            elTemp.getElementsByClassName('song-duration')[0].innerText = `${min}:${sec}`;
        }
       
        document.getElementById('songs-tbody').insertAdjacentElement('beforeend',elTemp)
    }
}

getAlbumData();