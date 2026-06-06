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
