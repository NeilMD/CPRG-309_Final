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


// ANIMATION for Focus Section
const focus = document.querySelectorAll('.from-left, .from-right');
const slideObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    
      if(entry.target.classList.contains('from-left')) {
        entry.target.classList.toggle("left-animate", entry.isIntersecting);
      }else{
        entry.target.classList.toggle("right-animate", entry.isIntersecting);
      }
  });
}, {
  threshold: 0.2
});

focus.forEach(im => slideObserver.observe(im));