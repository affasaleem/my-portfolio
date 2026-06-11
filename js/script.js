/**
 * Affa Saleem Portfolio — Main Script
 * Handles navigation, theme, scroll animations, skills, modal, and form
 */

'use strict';

/* ==========================================================================
   DOM REFERENCES
   ========================================================================== */
const header = document.getElementById('header');
const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const certificateModal = document.getElementById('certificateModal');
const certificateCards = document.querySelectorAll('.certificate-card');
const revealElements = document.querySelectorAll('.reveal');
const skillSection = document.querySelector('.skills');

/* ==========================================================================
   THEME TOGGLE (Dark / Light Mode)
   ========================================================================== */
const THEME_KEY = 'portfolio-theme';

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
    localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (prefersDark ? 'dark' : 'light'));
}

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function closeMenu() {
    nav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

function openMenu() {
    nav.classList.add('open');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

menuToggle.addEventListener('click', () => {
    nav.classList.contains('open') ? closeMenu() : openMenu();
});

navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

/* ==========================================================================
   STICKY HEADER & ACTIVE NAV LINK
   ========================================================================== */
const sections = document.querySelectorAll('section[id]');

function updateHeader() {
    const scrollY = window.scrollY;

    // Sticky header
    header.classList.toggle('scrolled', scrollY > 50);

    // Active nav link
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}

window.addEventListener('scroll', updateHeader, { passive: true });

/* ==========================================================================
   SCROLL REVEAL (Intersection Observer)
   Lightweight alternative to ScrollReveal library
   ========================================================================== */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

/* ==========================================================================
   SKILLS PROGRESS ANIMATION
   ========================================================================== */
let skillsAnimated = false;

function animateSkills() {
    if (skillsAnimated || !skillSection) return;

    const rect = skillSection.getBoundingClientRect();
    if (rect.top > window.innerHeight - 80) return;

    const skillItems = skillSection.querySelectorAll('.skill-item[data-level]');

    skillItems.forEach(item => {
        const level = parseInt(item.dataset.level, 10);
        const fill = item.querySelector('.skill-fill');
        const percent = item.querySelector('.skill-percent');

        if (fill) fill.style.width = `${level}%`;

        // Animate counter
        if (percent) {
            let count = 0;
            const step = level / 40;

            function tick() {
                count += step;
                if (count < level) {
                    percent.textContent = `${Math.ceil(count)}%`;
                    requestAnimationFrame(tick);
                } else {
                    percent.textContent = `${level}%`;
                }
            }
            tick();
        }
    });

    skillsAnimated = true;
}

window.addEventListener('scroll', animateSkills, { passive: true });
window.addEventListener('load', animateSkills);

/* ==========================================================================
   CREATIVE SWIPER — Reusable vanilla slider
   Supports: buttons, dots, touch swipe, keyboard, auto-play
   ========================================================================== */
function createSwiper({ trackId, prevBtnId, nextBtnId, dotsContainerId, autoPlayDelay = 4500 }) {
    const track      = document.getElementById(trackId);
    const prevBtn    = document.getElementById(prevBtnId);
    const nextBtn    = document.getElementById(nextBtnId);
    const dotsWrap   = document.getElementById(dotsContainerId);

    if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

    const slides     = Array.from(track.children);
    let current      = 0;
    let autoTimer    = null;
    let touchStartX  = 0;
    let touchEndX    = 0;
    let isDragging   = false;

    /* ── How many slides are visible at once? ── */
    function getSlidesPerView() {
        const slide = slides[0];
        if (!slide) return 1;
        const trackW = track.parentElement.offsetWidth;
        const slideW = slide.offsetWidth;
        return Math.max(1, Math.round(trackW / slideW));
    }

    /* ── Total "pages" ── */
    function totalPages() {
        return Math.ceil(slides.length / getSlidesPerView());
    }

    /* ── Build dot buttons ── */
    function buildDots() {
        dotsWrap.innerHTML = '';
        const pages = totalPages();
        for (let i = 0; i < pages; i++) {
            const dot = document.createElement('button');
            dot.className = 'swiper-dot' + (i === current ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(dot);
        }
    }

    /* ── Update dot states ── */
    function syncDots() {
        const dots = dotsWrap.querySelectorAll('.swiper-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    /* ── Animate track to current page ── */
    function goTo(index) {
        const pages = totalPages();
        current = Math.max(0, Math.min(index, pages - 1));

        /* Calculate pixel offset using the actual slide width */
        const slideW  = slides[0].offsetWidth;
        const perView = getSlidesPerView();
        const gapPx   = parseFloat(getComputedStyle(track).gap) || 0;
        const offset  = current * perView * (slideW + gapPx);

        track.style.transform = `translateX(-${offset}px)`;

        /* Button states */
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current >= pages - 1;

        syncDots();
    }

    /* ── Navigation ── */
    prevBtn.addEventListener('click', () => {
        resetAuto();
        goTo(current - 1);
    });

    nextBtn.addEventListener('click', () => {
        resetAuto();
        goTo(current + 1);
    });

    /* ── Touch / Drag swipe ── */
    track.parentElement.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    track.parentElement.addEventListener('touchend', e => {
        if (!isDragging) return;
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            resetAuto();
            goTo(diff > 0 ? current + 1 : current - 1);
        }
        isDragging = false;
    }, { passive: true });

    /* ── Mouse drag (desktop) ── */
    track.parentElement.addEventListener('mousedown', e => {
        touchStartX = e.clientX;
        isDragging = true;
    });

    track.parentElement.addEventListener('mouseup', e => {
        if (!isDragging) return;
        touchEndX = e.clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            resetAuto();
            goTo(diff > 0 ? current + 1 : current - 1);
        }
        isDragging = false;
    });

    /* ── Keyboard ── */
    track.parentElement.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  { resetAuto(); goTo(current - 1); }
        if (e.key === 'ArrowRight') { resetAuto(); goTo(current + 1); }
    });

    /* ── Auto-play ── */
    function startAuto() {
        autoTimer = setInterval(() => {
            const pages = totalPages();
            goTo(current >= pages - 1 ? 0 : current + 1);
        }, autoPlayDelay);
    }

    function resetAuto() {
        clearInterval(autoTimer);
        startAuto();
    }

    /* Pause on hover */
    const outerEl = track.parentElement.parentElement;
    outerEl.addEventListener('mouseenter', () => clearInterval(autoTimer));
    outerEl.addEventListener('mouseleave', startAuto);

    /* ── Re-init on resize ── */
    window.addEventListener('resize', () => {
        buildDots();
        goTo(Math.min(current, totalPages() - 1));
    });

    /* ── Init ── */
    buildDots();
    goTo(0);
    startAuto();
}

/* Projects Swiper */
createSwiper({
    trackId:          'projectsTrack',
    prevBtnId:        'projectsPrev',
    nextBtnId:        'projectsNext',
    dotsContainerId:  'projectsDots',
    autoPlayDelay:    5000,
});

/* Certificates Swiper */
createSwiper({
    trackId:          'certsTrack',
    prevBtnId:        'certsPrev',
    nextBtnId:        'certsNext',
    dotsContainerId:  'certsDots',
    autoPlayDelay:    4000,
});

/* ==========================================================================
   CERTIFICATE MODAL
   ========================================================================== */
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalOrg = document.getElementById('modalOrg');
const modalYear = document.getElementById('modalYear');
const modalDesc = document.getElementById('modalDesc');

function openModal(card) {
    modalImage.src = card.dataset.image;
    modalImage.alt = card.dataset.title;
    modalTitle.textContent = card.dataset.title;
    modalOrg.textContent = card.dataset.org;
    modalYear.textContent = card.dataset.year;
    modalDesc.textContent = card.dataset.description;

    certificateModal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Focus trap — focus close button
    certificateModal.querySelector('.modal-close').focus();
}

function closeModal() {
    certificateModal.hidden = true;
    document.body.style.overflow = '';
}

certificateCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));

    const btn = card.querySelector('.certificate-btn');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(card);
        });
    }
});

certificateModal.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !certificateModal.hidden) closeModal();
});

/* ==========================================================================
   CONTACT FORM
   ========================================================================== */
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        formSuccess.hidden = false;
        contactForm.reset();

        setTimeout(() => {
            formSuccess.hidden = true;
        }, 4000);
    });
}

/* ==========================================================================
   SMOOTH SCROLL OFFSET FOR FIXED HEADER
   ========================================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const offset = header.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ==========================================================================
   INIT
   ========================================================================== */
initTheme();
updateHeader();
