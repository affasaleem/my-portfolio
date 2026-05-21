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




// =========================================================
// SKILLS ANIMATION
// =========================================================

const skillSection = document.querySelector('.skills');

const progressBars = document.querySelectorAll('.skill-progress-bar');

const skillNumbers = document.querySelectorAll('.skill-number');

let started = false;

function startSkillAnimation() {

    if (started) return;

    const sectionTop = skillSection.getBoundingClientRect().top;

    if (sectionTop < window.innerHeight - 100) {

        // Animate Progress Bars
        progressBars.forEach((bar) => {

            const width = bar.getAttribute('data-width');

            bar.style.width = width;
        });

        // Animate Numbers
        skillNumbers.forEach((number) => {

            const target = +number.getAttribute('data-target');

            let count = 0;

            const speed = target / 50;

            function updateCounter() {

                count += speed;

                if (count < target) {

                    number.innerText = `${Math.ceil(count)}%`;

                    requestAnimationFrame(updateCounter);

                } else {

                    number.innerText = `${target}%`;
                }
            }

            updateCounter();
        });

        started = true;
    }
}

// Scroll Animation
window.addEventListener('scroll', startSkillAnimation);

// Load Animation
window.addEventListener('load', startSkillAnimation);





// ================= CERTIFICATE MODAL =================

const certificateCards = document.querySelectorAll('.certificate-card');

const certificateModal = document.getElementById('certificateModal');

const modalImage = document.getElementById('modalCertificateImage');
const modalTitle = document.getElementById('modalCertificateTitle');
const modalOrg = document.getElementById('modalCertificateOrg');
const modalYear = document.getElementById('modalCertificateYear');
const modalDescription = document.getElementById('modalCertificateDescription');

const closeCertificateModal = document.querySelector('.certificate-close-btn');

// ================= OPEN MODAL =================

certificateCards.forEach(card => {

    card.addEventListener('click', () => {

        const image = card.dataset.image;
        const title = card.dataset.title;
        const org = card.dataset.org;
        const year = card.dataset.year;
        const description = card.dataset.description;

        modalImage.src = image;
        modalTitle.textContent = title;
        modalOrg.textContent = org;
        modalYear.textContent = year;
        modalDescription.textContent = description;

        certificateModal.classList.add('active');

        document.body.style.overflow = 'hidden';
    });

});

// ================= CLOSE MODAL =================

closeCertificateModal.addEventListener('click', () => {

    certificateModal.classList.remove('active');

    document.body.style.overflow = 'auto';

});

// ================= CLICK OUTSIDE =================

certificateModal.addEventListener('click', (e) => {

    if (e.target === certificateModal) {

        certificateModal.classList.remove('active');

        document.body.style.overflow = 'auto';
    }

});

// ================= ESC KEY =================

document.addEventListener('keydown', (e) => {

    if (e.key === 'Escape') {

        certificateModal.classList.remove('active');

        document.body.style.overflow = 'auto';
    }

});


/* ================= Education SECTION ================= */

// Education section animations (optional)

const educationCards = document.querySelectorAll('.timeline-content');

educationCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 0 25px rgba(117, 78, 249, 0.25)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

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