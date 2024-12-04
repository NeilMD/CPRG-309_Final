window.addEventListener('scroll', function(){
    let msg = this.document.getElementById("landing-msg");
    msg.style.transform = `translateY(-${window.scrollY/3}px)`;
});



document.getElementById('prev-btn').addEventListener('click', function() {
    const container = document.getElementById('discover-container');
    container.scrollLeft -= 250; // Scroll 100px to the left
});

document.getElementById('next-btn').addEventListener('click', function() {
    const container = document.getElementById('discover-container');
    container.scrollLeft += 250; // Scroll 100px to the right
});