<<<<<<< HEAD
// ================= MOBILE NAVBAR =================

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// ================= DARK MODE =================

let darkModeIcon = document.querySelector('#darkMode-icon');

darkModeIcon.onclick = () => {
    darkModeIcon.classList.toggle('bx-sun');
    document.body.classList.toggle('dark-mode');
};

// ================= FILTER PROJECTS =================

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {

    button.addEventListener('click', () => {

        document.querySelector('.filter-btn.active')
            .classList.remove('active');

        button.classList.add('active');

        const filter = button.dataset.filter;

        projectCards.forEach(card => {

            if(filter === 'all' ||
               card.classList.contains(filter)) {

                card.style.display = 'block';

            } else {

                card.style.display = 'none';
            }

        });

    });

});

// ================= SEARCH =================

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keyup', () => {

    const value = searchInput.value.toLowerCase();

    projectCards.forEach(card => {

        const title = card.querySelector('h3')
            .textContent.toLowerCase();

        if(title.includes(value)) {

            card.style.display = 'block';

        } else {

            card.style.display = 'none';
        }

    });

});

// ================= MODAL =================

const modal = document.getElementById('projectModal');
const detailButtons = document.querySelectorAll('.details-btn');
const closeModal = document.querySelector('.close-modal');

detailButtons.forEach(button => {

    button.addEventListener('click', () => {

        modal.style.display = 'flex';

    });

});

closeModal.onclick = () => {

    modal.style.display = 'none';

};

window.onclick = (e) => {

    if(e.target == modal){

        modal.style.display = 'none';
    }
};

// ================= STICKY HEADER =================

window.addEventListener('scroll', () => {

    let header = document.querySelector('.header');

    header.classList.toggle('sticky', window.scrollY > 100);

=======
// ================= MOBILE NAVBAR =================

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// ================= DARK MODE =================

let darkModeIcon = document.querySelector('#darkMode-icon');

darkModeIcon.onclick = () => {
    darkModeIcon.classList.toggle('bx-sun');
    document.body.classList.toggle('dark-mode');
};

// ================= FILTER PROJECTS =================

const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {

    button.addEventListener('click', () => {

        document.querySelector('.filter-btn.active')
            .classList.remove('active');

        button.classList.add('active');

        const filter = button.dataset.filter;

        projectCards.forEach(card => {

            if(filter === 'all' ||
               card.classList.contains(filter)) {

                card.style.display = 'block';

            } else {

                card.style.display = 'none';
            }

        });

    });

});

// ================= SEARCH =================

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keyup', () => {

    const value = searchInput.value.toLowerCase();

    projectCards.forEach(card => {

        const title = card.querySelector('h3')
            .textContent.toLowerCase();

        if(title.includes(value)) {

            card.style.display = 'block';

        } else {

            card.style.display = 'none';
        }

    });

});

// ================= MODAL =================

const modal = document.getElementById('projectModal');
const detailButtons = document.querySelectorAll('.details-btn');
const closeModal = document.querySelector('.close-modal');

detailButtons.forEach(button => {

    button.addEventListener('click', () => {

        modal.style.display = 'flex';

    });

});

closeModal.onclick = () => {

    modal.style.display = 'none';

};

window.onclick = (e) => {

    if(e.target == modal){

        modal.style.display = 'none';
    }
};

// ================= STICKY HEADER =================

window.addEventListener('scroll', () => {

    let header = document.querySelector('.header');

    header.classList.toggle('sticky', window.scrollY > 100);

>>>>>>> 992c8a27c15d1f772c3306f7c3be5c6c428f8082
});