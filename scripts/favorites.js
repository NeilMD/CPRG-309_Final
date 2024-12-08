


const fillFavorites = async()=>{
    let elTemp = await getTemplate('./templates/favorite-card.html');
    const favorites = JSON.parse(localStorage.getItem(storageName));

    for (let fav of favorites) {
        let el = elTemp.cloneNode(true);
        
        el.getElementsByClassName('card-img')[0].src = fav.img
        el.getElementsByClassName('music-name')[0].innerText = fav.name
        el.getElementsByClassName('artist-name')[0].innerText = fav.artist
        el.getElementsByClassName('duration')[0].innerText = fav.duration;

        document.getElementById('music-wrapper').insertAdjacentElement('beforeend',el);
    }
   
}

fillFavorites();