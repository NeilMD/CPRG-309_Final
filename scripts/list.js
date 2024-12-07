const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const page = urlParams.get('page');

// Elements
const pgInput = document.getElementById('page-input');
let currPage = parseInt(pgInput.getAttribute('placeholder')) || 1;
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const searchInput = document.getElementById('search-input');
const searchTbody = document.getElementById('search-tbody');
const lastPageDisplay = document.getElementById('last-page');
const searchHeader = document.getElementById('search-header');
let url;

// Fetch and load data based on the current page and genre
const getPageData = async () => {

    
    if (page === 'home') {
        // Hompage > Mood Genre
        searchInput.style.display = 'none';
        const genre = urlParams.get('genre');
        url = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${genre}&api_key=${API_KEY}&limit=10&format=json`;
        searchHeader.innerText = `#${genre}`
        await getData(url, fillGenreData);
    } else if (page === 'nav') { 
        // Nav > Music, Artist
    }
};

// Fill the table with genre track data
const fillGenreData = (json) => {
    let tracks = json.tracks.track || [];

    const maxPage = Math.min(parseInt(json.tracks['@attr'].totalPages, 10), 1000);

    // Set Nav
    pgInput.setAttribute('placeholder', json.tracks['@attr'].page);
    pgInput.setAttribute('max', maxPage);
    lastPageDisplay.innerText = maxPage;

    // Calculate Rank
    let currRank = (currPage - 1) * 10;

    // Clear previous rows except the template
    clearTableRows();

    if (tracks.length > 10) {
        currRank = Math.min(currRank, tracks.length - 10);  
        tracks = tracks.slice(currRank, currRank + 10); 
    }

    tracks.forEach((track, index) => {
        const elTemp = document.querySelector('.search-tr').cloneNode(true);
        elTemp.querySelector('.search-rank').textContent = `#${index + 1 + currRank}`;
        elTemp.querySelector('.search-title').textContent = track.name;
        elTemp.querySelector('.search-artist').textContent = track.artist.name;
        elTemp.querySelector('.search-link').innerHTML = `<a href="${track.url}">See FM Link</a>`;
        searchTbody.appendChild(elTemp);
    });
};

// Add event listeners for pagination and form submission
const addBehavior = () => {
    prevBtn.addEventListener('click', () => changePage(currPage - 1));
    nextBtn.addEventListener('click', () => changePage(currPage + 1));

    document.getElementById('page-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const inputPage = parseInt(pgInput.value, 10);
        if (!isNaN(inputPage)) changePage(inputPage);
    });
};

// Handle page changes
const changePage = async (newPage) => {
    if (newPage < 1 || newPage > parseInt(pgInput.getAttribute('max'), 10)) return;

    pgInput.setAttribute('placeholder', newPage);
    clearTableRows();
    currPage = newPage;

    const newUrl = `${url}&page=${newPage}`;
    await getData(newUrl, fillGenreData);
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