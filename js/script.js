/*========== menu icon navbar ==========*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');

}


/*========== scroll sections active link ==========*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*='+ id + ']') .classList.add('active');
            });
        };
    });
    /*========== sticky navbar ==========*/
    let header = document.querySelector('.header');
    header.classList.toggle('sticky',window.scrollY > 100);


    /*========== remove menu icon navbar when click navbar link (scroll) ==========*/
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');

};


/*========== swiper ==========*/
var swiper = new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      grabCurser: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
  });

/*========== dark light mode ==========*/
let darkModeIcon = document.querySelector('#darkMode-icon');

darkModeIcon.onclick = () => {
  darkModeIcon.classList.toggle('bx-sun');
  document.body.classList.toggle('dark-mode');
};

/*========== scroll reveal ==========*/
ScrollReveal({
  // reset: true,
  distance: '80px',
  duration: 2000,
  delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img img, .services-container, .portfolio-box, .testi-wrapper, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img img', { origin: 'left' });
ScrollReveal().reveal('.home-content h3, .home-content p, .about-content', { origin: 'right' });


// ================= CONTACT FORM SUCCESS =================

const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

if(contactForm){

    contactForm.addEventListener('submit', (e) => {

        e.preventDefault();

        successMessage.style.display = 'block';

        contactForm.reset();

        setTimeout(() => {

            successMessage.style.display = 'none';

        }, 3000);

    });

}

/* ================= CERTIFICATES SECTION ================= */

/* FILTER  */

const filterButtons = document.querySelectorAll('.filter-btn');
const certificateCards = document.querySelectorAll('.certificate-card');

filterButtons.forEach(button => {

    button.addEventListener('click', () => {

        document
            .querySelector('.filter-btn.active')
            .classList.remove('active');

        button.classList.add('active');

        const filter = button.dataset.filter;

        certificateCards.forEach(card => {

            if(filter === 'all' ||
               card.dataset.category === filter){

                card.style.display = 'block';

            } else {

                card.style.display = 'none';

            }

        });

    });

});

/* ================= SEARCH ================= */

const searchInput = document.getElementById('certificateSearch');

searchInput.addEventListener('keyup', () => {

    const value = searchInput.value.toLowerCase();

    certificateCards.forEach(card => {

        const text = card.innerText.toLowerCase();

        if(text.includes(value)){

            card.style.display = 'block';

        } else {

            card.style.display = 'none';

        }

    });

});

//  ================= EDUCATION SECTION ================= 

/* ================= TIMELINE ANIMATION ================= */

const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add('show');

        }

    });

}, {
    threshold: 0.2
});

timelineItems.forEach(item => {

    timelineObserver.observe(item);

});