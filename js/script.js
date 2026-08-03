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

    // Active nav link (dynamically matches all sections including: home, about, skills, projects, certificates, experience, contact)
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
   EXPERIENCE FLIP CARD SWIPER
   A completely different swiper: 3D card flip on click + slide transition
   Controls: diamond prev/next buttons + animated progress bar
   ========================================================================== */
(function initExpFlipSwiper() {
    const cards       = Array.from(document.querySelectorAll('.exp-card'));
    const prevBtn     = document.getElementById('expPrev');
    const nextBtn     = document.getElementById('expNext');
    const progressBar = document.getElementById('expProgressBar');
    const currentEl   = document.getElementById('expCurrent');
    const totalEl     = document.getElementById('expTotal');
    const stage       = document.getElementById('expStage');

    if (!cards.length || !prevBtn || !nextBtn || !progressBar) return;

    const total = cards.length;
    let current = 0;
    let autoTimer = null;

    /* Set total display */
    if (totalEl) totalEl.textContent = total;

    /* ── Activate a card by index ── */
    function goTo(index, direction /* 'next' | 'prev' */) {
        const prev = current;
        current = (index + total) % total;

        if (prev === current) return;

        const leavingClass  = direction === 'next' ? 'exp-leaving-left'  : 'exp-leaving-right';
        const enteringClass = direction === 'next' ? 'exp-entering-left' : 'exp-entering-right';

        /* 1. Animate outgoing card */
        const outCard = cards[prev];
        outCard.classList.remove('exp-active');
        outCard.classList.remove('flipped');  /* Un-flip before hiding */
        outCard.classList.add(leavingClass);

        /* 2. Prepare incoming card off-screen */
        const inCard = cards[current];
        inCard.classList.remove('exp-active', 'exp-leaving-left', 'exp-leaving-right', 'flipped');
        inCard.classList.add(enteringClass);

        /* Force reflow so CSS transition fires */
        void inCard.offsetWidth;

        /* 3. Slide incoming card in */
        requestAnimationFrame(() => {
            inCard.classList.remove(enteringClass);
            inCard.classList.add('exp-active');
        });

        /* 4. Cleanup outgoing card after transition */
        setTimeout(() => { outCard.classList.remove(leavingClass); }, 700);

        /* 5. Update UI */
        updateUI();
    }

    /* ── Update counter, progress bar & buttons ── */
    function updateUI() {
        if (currentEl) currentEl.textContent = current + 1;
        const pct = total <= 1 ? 100 : (current / (total - 1)) * 100;
        progressBar.style.width = `${pct}%`;
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === total - 1;
    }

    /* ── Navigation buttons ── */
    prevBtn.addEventListener('click', () => { resetAuto(); goTo(current - 1, 'prev'); });
    nextBtn.addEventListener('click', () => { resetAuto(); goTo(current + 1, 'next'); });

    /* ── Keyboard navigation on stage ── */
    if (stage) {
        stage.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { resetAuto(); goTo(current + 1, 'next'); }
            if (e.key === 'ArrowLeft')  { resetAuto(); goTo(current - 1, 'prev'); }
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                cards[current].classList.toggle('flipped');
            }
        });

        /* ── Touch swipe on stage ── */
        let touchStartX = 0;
        stage.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        stage.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                resetAuto();
                goTo(diff > 0 ? current + 1 : current - 1, diff > 0 ? 'next' : 'prev');
            }
        }, { passive: true });
    }

    /* ── Flip on card click ── */
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('exp-active')) return;
            card.classList.toggle('flipped');
        });
    });

    /* ── Auto-advance (pauses on hover / flip) ── */
    function startAuto() {
        autoTimer = setInterval(() => {
            if (!cards[current].classList.contains('flipped')) {
                goTo(current < total - 1 ? current + 1 : 0, 'next');
            }
        }, 5500);
    }

    function resetAuto() {
        clearInterval(autoTimer);
        startAuto();
    }

    const expSwiper = document.getElementById('expSwiper');
    if (expSwiper) {
        expSwiper.addEventListener('mouseenter', () => clearInterval(autoTimer));
        expSwiper.addEventListener('mouseleave', startAuto);
    }

    /* ── Init — show first card ── */
    cards.forEach(card => {
        card.classList.remove('exp-active', 'exp-leaving-left', 'exp-leaving-right', 'exp-entering-left', 'exp-entering-right');
    });
    cards[0].classList.add('exp-active');
    updateUI();
    startAuto();
})();

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

/* ── Experience card "View Certificate" modal button ── */
document.querySelectorAll('.exp-cert-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.exp-card');
        if (!card) return;
        const certSrc = btn.dataset.certSrc || '';
        const title = card.querySelector('.exp-card-body-text h3')?.textContent || '';
        const org = card.querySelector('.exp-card-body-text h4')?.textContent || '';
        const year = card.querySelector('.exp-date')?.textContent || '';
        const desc = card.querySelector('.exp-card-desc')?.textContent || '';

        openModal({
            dataset: {
                image: certSrc,
                title: title,
                org: org,
                year: year,
                description: desc
            }
        });
    });
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
   MINI PROBLEM SOLVING POSTS SWIPER (SQL & Java 5-Star Achievements)
   ========================================================================== */
function initPsMiniSwiper() {
    const track = document.getElementById('psSwiperTrack');
    const tabs = document.querySelectorAll('.mini-swiper-tab');
    const prevBtn = document.getElementById('psPrevBtn');
    const nextBtn = document.getElementById('psNextBtn');
    const container = document.getElementById('psSwiperContainer');

    if (!track || !tabs.length) return;

    let currentIndex = 0;
    const totalSlides = tabs.length;
    let autoPlayTimer = null;

    function goToSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;

        // Slide track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update tabs active state
        tabs.forEach((tab, i) => {
            const isActive = i === currentIndex;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Update arrow button states
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === totalSlides - 1;
    }

    // Tab click events
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const idx = parseInt(tab.dataset.index, 10);
            resetAutoPlay();
            goToSlide(idx);
        });
    });

    // Arrow button events
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            resetAutoPlay();
            goToSlide(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            resetAutoPlay();
            goToSlide(currentIndex + 1);
        });
    }

    // Touch / Swipe support
    if (container) {
        let touchStartX = 0;
        container.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        container.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 40) {
                resetAutoPlay();
                if (diff > 0 && currentIndex < totalSlides - 1) {
                    goToSlide(currentIndex + 1);
                } else if (diff < 0 && currentIndex > 0) {
                    goToSlide(currentIndex - 1);
                }
            }
        }, { passive: true });

        container.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
        container.addEventListener('mouseleave', startAutoPlay);
    }

    function startAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => {
            goToSlide(currentIndex < totalSlides - 1 ? currentIndex + 1 : 0);
        }, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    // Init
    goToSlide(0);
    startAutoPlay();
}

/* ==========================================================================
   INIT
   ========================================================================== */
initTheme();
updateHeader();
initPsMiniSwiper();

