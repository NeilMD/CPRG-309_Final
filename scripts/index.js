window.addEventListener('scroll', function(){
    let msg = this.document.getElementById("landing-msg");
    msg.style.transform = `translateY(-${window.scrollY/3}px)`;
});



