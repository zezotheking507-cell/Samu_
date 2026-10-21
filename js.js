// Wait for DOM to load fully
document.addEventListener('DOMContentLoaded', () => {

    // Set auto year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Toggle menu for mobile screen
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close menu on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    // Scroll to top button display
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Numbers Counter Animation
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    window.addEventListener('scroll', () => {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        const sectionPos = heroSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight;

        if (sectionPos < screenPos && !hasAnimated) {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                let current = 0;
                const increment = Math.ceil(target / 40);

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
            hasAnimated = true;
        }
    });

    // Contact Form Action
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            formStatus.style.color = '#06b6d4';
            formStatus.textContent = 'Sending message...';

            setTimeout(() => {
                formStatus.style.color = '#10b981';
                formStatus.textContent = 'Message sent successfully! ✅';
                contactForm.reset();
            }, 1200);
        });
    }

});