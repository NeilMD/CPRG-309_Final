let favorites = JSON.parse(localStorage.getItem(storageName));

const fillData = async()=>{
    let elTemp = await getTemplate('./templates/favorite-card.html');
    

    setTotalTime();

    for (let fav of favorites) {
        let el = elTemp.cloneNode(true);
        
        el.getElementsByClassName('card-img')[0].src = fav.img
        el.getElementsByClassName('card-img')[0].setAttribute('alt',`${favname} album cover`)
        el.getElementsByClassName('music-name')[0].innerText = fav.name
        el.getElementsByClassName('artist-name')[0].innerText = fav.artist
        el.getElementsByClassName('duration')[0].innerText = fav.duration;

        document.getElementById('music-wrapper').insertAdjacentElement('beforeend',el);
    }
    addBehavior();
}

const setTotalTime = ()=>{
    let totalDuration = 0;
    favorites.forEach(element => {
        const durationParts = element.duration.split(':');
        const result = durationParts.length === 1 && durationParts[0] === "" ? ['0', '0'] : durationParts;
        totalDuration += (parseInt(result[0],10) * 60);
        totalDuration += (parseInt(result[1],10));
    });

    let timeBuilder = ' | ';
    let hours = '00';
    if(totalDuration > 3600) {
        hours = String(Math.floor((totalDuration / 60 )/ 60)).padStart(2,0);
        totalDuration =totalDuration / 60;
        timeBuilder+= `${hours} hours `
    }
    
    const min = String(Math.floor(totalDuration / 60)).padStart(2,0);
    const sec = String(Math.floor(totalDuration % 60)).padStart(2,0);

    // Concate minutes and seconds
    min != '00' ? timeBuilder+= `${min} minutes `: null;
    sec != '00' ? timeBuilder+= `${sec} seconds `: null;
    
    timeBuilder = totalDuration == 0 ? '' : timeBuilder
    
    year.innerText = new Date().getFullYear();
    detail.innerText = `${favorites.length} songs${timeBuilder}`
}

const addBehavior = () => {

    document.querySelectorAll('.music-card').forEach((el)=>{
        let name = el.getElementsByClassName('music-name')[0].innerText;
        let artist = el.getElementsByClassName('artist-name')[0].innerText;
        el.addEventListener('click', ()=>{
            let index = favorites.findIndex(el => {
                return el.name.toLowerCase() == name.toLowerCase() && el.artist.toLowerCase() == artist.toLowerCase()
            } );
           
            favorites.splice(index, 1);
            localStorage.setItem(storageName, JSON.stringify(favorites));
            el.classList.add('slide-out');
            setTimeout(()=>{
                el.classList.add('hidden');
                setTotalTime();
            },500);
        });

    })
}

fillData();