// ===== Firebase imports (must be at the top of a module) =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ===== Firebase config =====
const firebaseConfig = {
    apiKey: "AIzaSyBJWvO8rgwMNvZYPSfydbQmkCXJiUxrP-0",
    authDomain: "ffff-b3072.firebaseapp.com",
    projectId: "ffff-b3072",
    storageBucket: "ffff-b3072.firebasestorage.app",
    messagingSenderId: "346966847894",
    appId: "1:346966847894:web:9f02eb8a0522caee34adb7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const reviewsRef = collection(db, "reviews");

// ===== Helpers =====
function escapeHTML(str) {
    return String(str ?? '').replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

const defaultReview = {
    name: "Hack Club Mentor",
    role: "Reviewer",
    rating: 5,
    comment: "Ziad is a quick learner and builds super clean websites!"
};

function buildReviewCard(item) {
    const rating = Math.min(5, Math.max(1, parseInt(item.rating) || 5));
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
        <div>
            <div class="review-header">
                <div class="review-author">
                    <h4>${escapeHTML(item.name)}</h4>
                    <span>${escapeHTML(item.role)}</span>
                </div>
                <div class="review-stars">${stars}</div>
            </div>
            <p class="review-text">"${escapeHTML(item.comment)}"</p>
        </div>
    `;
    return card;
}

function renderDefaultReview(container) {
    container.innerHTML = '';
    container.appendChild(buildReviewCard(defaultReview));
}

// ===== Reviews: real-time listener =====
function listenToReviews() {
    const container = document.getElementById('reviewsList');
    if (!container) return;

    const q = query(reviewsRef, orderBy("timestamp", "desc"));

    onSnapshot(
        q,
        (snapshot) => {
            if (snapshot.empty) {
                renderDefaultReview(container);
                return;
            }
            container.innerHTML = '';
            snapshot.forEach((doc) => {
                container.appendChild(buildReviewCard(doc.data()));
            });
        },
        (error) => {
            console.error("Could not load reviews: ", error);
            renderDefaultReview(container);
        }
    );
}

// ===== Reviews: submit form =====
function setupReviewForm() {
    const form = document.getElementById('portfolioReviewForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        const name = document.getElementById('revName').value.trim().slice(0, 50);
        const role = document.getElementById('revRole').value.trim().slice(0, 50);
        const comment = document.getElementById('revComment').value.trim().slice(0, 500);
        const ratingInput = document.querySelector('input[name="revRating"]:checked');
        const rating = ratingInput ? parseInt(ratingInput.value) : 5;

        if (!name || !role || !comment) return;

        try {
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            await addDoc(reviewsRef, {
                name,
                role,
                comment,
                rating,
                timestamp: serverTimestamp()
            });

            form.reset();
        } catch (error) {
            console.error("Error adding review: ", error);
            alert("Something went wrong! Please try again.");
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== Footer year =====
function setupYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

// ===== Mobile menu =====
function setupMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    if (!menuBtn || !navLinks) return;

    const icon = menuBtn.querySelector('i');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        });
    });
}

// ===== Scroll to top button =====
function setupScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (!scrollTopBtn) return;

    const toggleBtn = () => {
        scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    };

    window.addEventListener('scroll', toggleBtn);
    toggleBtn();

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Counters animation =====
function setupCounters() {
    const counters = document.querySelectorAll('.counter');
    const statsBox = document.querySelector('.stats');
    if (!counters.length || !statsBox) return;

    const runCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            const increment = Math.max(1, Math.ceil(target / 40));
            let current = 0;

            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = current;
                    setTimeout(updateNumber, 35);
                } else {
                    counter.innerText = target;
                }
            };
            updateNumber();
        });
    };

    const observer = new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
            runCounters();
            obs.disconnect();
        }
    }, { threshold: 0.3 });

    observer.observe(statsBox);
}

// ===== Dark / Light mode =====
function setupTheme() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;

    const sunIcon = '<i class="fa-solid fa-sun"></i>';
    const moonIcon = '<i class="fa-solid fa-moon"></i>';

    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('user_theme');
    } catch (e) {}

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeBtn.innerHTML = sunIcon;
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        themeBtn.innerHTML = isLight ? sunIcon : moonIcon;

        try {
            localStorage.setItem('user_theme', isLight ? 'light' : 'dark');
        } catch (e) {}
    });
}

// ===== Typing effect =====
function setupTyping() {
    const target = document.getElementById("typingText");
    if (!target) return;

    const words = ["websites & apps", "modern UI/UX", "clean code", "cool projects"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }
        target.textContent = currentWord.substring(0, charIndex);

        let speed = isDeleting ? 60 : 120;

        if (!isDeleting && charIndex === currentWord.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 500;
        }

        setTimeout(typeEffect, speed);
    }

    typeEffect();
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    setupYear();
    setupMenu();
    setupScrollTop();
    setupCounters();
    setupTheme();
    setupTyping();
    setupReviewForm();
    listenToReviews();
});