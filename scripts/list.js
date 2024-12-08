const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page = urlParams.get('page');
const genre = urlParams.get('genre');

// Elements
const pgInput = document.getElementById('page-input');
let currPage = parseInt(pgInput.getAttribute('placeholder'),10) || 1;
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const searchInput = document.getElementById('search-input');
const searchTbody = document.getElementById('search-tbody');
const lastPageDisplay = document.getElementById('last-page');
const searchHeader = document.getElementById('search-header');
const thTitle = document.getElementById('th-title');
const thArtist = document.getElementById('th-artist');
let latestSetMethod;
let url;

// Fetch and load data based on the current page and genre
const getPageData = async () => {

    searchHeader.innerText = `#${genre}`
    if (page === 'home') {
        // Hompage > Mood Genre
        searchInput.style.display = 'none';
        url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${genre}&api_key=${API_KEY}&limit=10&format=json`;
        await getData(url, setGenreMusicData);
    } else if (page === 'nav') { 
        // Nav > Music, Artist

        if(genre === 'music') {
            url = `https://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&api_key=${API_KEY}&limit=10&format=json`;
            latestSetMethod = setGenreMusicData;
            await getData(url, setGenreMusicData);

        }else if(genre === 'artist') {
            //Change Table Header
            thArtist.innerText = 'Listeners';
            thTitle.innerText = 'Artist';
            url = `https://ws.audioscrobbler.com/2.0/?method=chart.getTopArtists&tag=${genre}&api_key=${API_KEY}&limit=10&format=json`;
            latestSetMethod = setArtistData;
            await getData(url, setArtistData);
        } 
        
    }
};

// set genre and music data 
const setGenreMusicData = (json) => {
    let tracks = json.tracks.track || [];

    const maxPage = Math.min(parseInt(json.tracks['@attr'].totalPages, 10), 1000);

    // Set Nav
    pgInput.setAttribute('placeholder', json.tracks['@attr'].page);
    pgInput.setAttribute('max', maxPage);
    lastPageDisplay.innerText = maxPage;

    fillTableRow(tracks);
}

// set artist data
const setArtistData = (json) => {
    let tracks = json.artists.artist || [];

    const maxPage = Math.min(parseInt(json.artists['@attr'].totalPages, 10), 1000);

    // Set Nav
    pgInput.setAttribute('placeholder', json.artists['@attr'].page);
    pgInput.setAttribute('max', maxPage);
    lastPageDisplay.innerText = maxPage;

    fillTableRow(tracks)
}

const setSearchMusic = (json) => {
    let tracks = json.results.artistmatches.artist || [];

    let tempMax = Math.floor(parseInt(json.results["opensearch:totalResults"], 10)/10)
    const maxPage = Math.min(tempMax, 1000);

    // Set Nav
    pgInput.setAttribute('placeholder', json.results["opensearch:Query"]['startPage']);
    pgInput.setAttribute('max', maxPage);
    lastPageDisplay.innerText = maxPage;

    fillTableRow(tracks)

}

const setSearchArtist = (json) => {
    let tracks = json.results.trackmatches.track || [];

    let tempMax = Math.floor(parseInt(json.results["opensearch:totalResults"], 10)/10)
    const maxPage = Math.min(tempMax, 1000);

    // Set Nav
    pgInput.setAttribute('placeholder', json.results["opensearch:Query"]['startPage']);
    pgInput.setAttribute('max', maxPage);
    lastPageDisplay.innerText = maxPage;

    fillTableRow(tracks)

}

// Fill Table Based on Data received (Genre, Music, Artist)
const fillTableRow = (tracks) => {
    // Calculate Rank
    let currRank = (currPage - 1) * 10;

    // Clear previous rows except the template
    clearTableRows();

    //Sanitize raw API return.
    if (tracks.length > 10) {
        let indexCut =  Math.min(currRank, tracks.length - 10);
        tracks = tracks.slice(indexCut, indexCut + 10); 

    }

    tracks.forEach((track, index) => {
        const elTemp = document.querySelector('.search-tr').cloneNode(true);
        elTemp.querySelector('.search-rank').textContent = `#${index + 1 + currRank}`;
        elTemp.querySelector('.search-link').innerHTML = `<a href="${track.url}">See FM Link</a>`;


        if(genre === 'music') {
            elTemp.querySelector('.search-title').textContent = track.name;
            elTemp.querySelector('.search-artist').textContent = track.artist?.name ?? track.artist;
        }else{
            elTemp.querySelector('.search-title').textContent = track.name;
            elTemp.querySelector('.search-artist').textContent = parseInt(track.listeners, 10).toLocaleString();
        }
        
        searchTbody.appendChild(elTemp);
    });
}


// Add event listeners for pagination and form submission
const addBehavior = () => {
    prevBtn.addEventListener('click', () => changePage(currPage - 1));
    nextBtn.addEventListener('click', () => changePage(currPage + 1));

    document.getElementById('page-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const inputPage = parseInt(pgInput.value, 10);
        console.log(inputPage);
        if (!isNaN(inputPage)) changePage(inputPage);
    });

    document.getElementById('search-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchVal = searchInput.value;
        currPage = 1;
        if(genre === 'music') {
            url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${searchVal}&api_key=${API_KEY}&limit=10&format=json`;
            latestSetMethod = setSearchMusic;
            await getData(url, setSearchMusic);
        }else if(genre === 'artist'){
            url = `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${searchVal}&api_key=${API_KEY}&limit=10&format=json`;
            latestSetMethod = setSearchMusic;
            await getData(url, setSearchMusic);
        }
    });

};

// Handle page changes
const changePage = async (newPage) => {
    if (newPage < 1 || newPage > parseInt(pgInput.getAttribute('max'), 10)) return;

    pgInput.setAttribute('placeholder', newPage);
    clearTableRows();
    currPage = newPage;

    const newUrl = `${url}&page=${newPage}`;

    await getData(newUrl, latestSetMethod);
};

// Clear table rows except the first template row
const clearTableRows = () => {
    searchTbody.querySelectorAll('tr.search-tr').forEach((row, index) => {
        if (index !== 0) row.remove();
    });

    prevBtn.classList.toggle('disabled', currPage === 1);
    nextBtn.classList.toggle('disabled', currPage === parseInt(lastPageDisplay.innerText, 10));
    searchInput.value = '';
    pgInput.value = '';
};

getPageData();
addBehavior();