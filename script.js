// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Check saved preference, otherwise default to dark
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else {
    setTheme('dark');
}

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Header shadow on scroll
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Active nav link highlighting based on scroll position
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navAnchors.forEach(a => a.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// Scroll-reveal animations for sections
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply reveal to timeline items and contact items
document.querySelectorAll('.timeline-item, .contact-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    revealObserver.observe(el);
});

// Research publications pagination
const researchCards = document.querySelectorAll('.research-card');
const perPage = 3;
const totalCards = researchCards.length;
let currentPage = 0;
const totalPages = Math.ceil(totalCards / perPage);

const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const showingCount = document.getElementById('showing-count');
const totalCount = document.getElementById('total-count');

totalCount.textContent = totalCards;

function showPage(page) {
    currentPage = page;
    const start = page * perPage;
    const end = start + perPage;

    researchCards.forEach((card, i) => {
        if (i >= start && i < end) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, (i - start) * 100);
        } else {
            card.style.display = 'none';
        }
    });

    const showing = Math.min(end, totalCards) - start;
    showingCount.textContent = `${start + 1}–${Math.min(end, totalCards)}`;

    btnPrev.disabled = page === 0;
    btnNext.disabled = page >= totalPages - 1;
}

btnPrev.addEventListener('click', () => {
    if (currentPage > 0) showPage(currentPage - 1);
});

btnNext.addEventListener('click', () => {
    if (currentPage < totalPages - 1) showPage(currentPage + 1);
});

showPage(0);
