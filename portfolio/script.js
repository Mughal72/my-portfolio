// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('#mobile-menu a, .md\\:flex a'); // Select all nav links

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });
    }

    // --- Project Carousel ---
    const projectCarousel = document.getElementById('project-carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentIndex = 0;
    let projectsPerView = 1; // Default for mobile

    // Function to update projects per view based on screen size
    const updateProjectsPerView = () => {
        if (window.innerWidth >= 1024) { // lg breakpoint
            projectsPerView = 3;
        } else if (window.innerWidth >= 768) { // md breakpoint
            projectsPerView = 2;
        } else {
            projectsPerView = 1;
        }
    };

    // Initial call and on resize
    updateProjectsPerView();
    window.addEventListener('resize', () => {
        updateProjectsPerView();
        // Recalculate scroll position if projectsPerView changes
        updateCarouselPosition();
    });

    const projectCards = projectCarousel ? Array.from(projectCarousel.children) : [];
    const totalProjects = projectCards.length;

    const updateCarouselPosition = () => {
        if (!projectCarousel || totalProjects === 0) return;

        // Calculate the scroll amount based on the width of a single card
        // This makes it responsive to different card widths (1/3, 1/2, full)
        const cardWidth = projectCards[0].offsetWidth;
        const scrollAmount = cardWidth * currentIndex;
        projectCarousel.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    if (prevBtn && nextBtn && projectCarousel) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - projectsPerView + totalProjects) % totalProjects;
            updateCarouselPosition();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + projectsPerView) % totalProjects;
            updateCarouselPosition();
        });

        // Initial position update
        updateCarouselPosition();
    }


    // --- Scroll Animations (Fade In Up) ---
    const sections = document.querySelectorAll('section, header'); // Select all sections and header

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the class to trigger animation
                entry.target.classList.add('animate-fade-in-up-active');
                // Remove the initial hidden state if it was set by JS
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        // Add the base class for animation
        section.classList.add('animate-fade-in-up');
        observer.observe(section);
    });

    // Handle hero specific animations (they are always visible, so apply directly)
    const heroTitle = document.querySelector('#hero h1');
    const heroSubtitle = document.querySelector('#hero p');
    const heroButtons = document.querySelector('#hero .space-x-4');
    const heroImage = document.querySelector('#hero img');

    if (heroTitle) heroTitle.classList.add('animate-slide-in-left');
    if (heroSubtitle) heroSubtitle.classList.add('animate-slide-in-right');
    if (heroButtons) heroButtons.classList.add('animate-fade-in-up-delay');
    if (heroImage) heroImage.classList.add('animate-zoom-in');

    // --- Contact Form Submission with Custom Modal ---
    const contactForm = document.getElementById('contact-form');
    const messageModal = document.getElementById('message-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalIcon = document.getElementById('modal-icon');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            // In a real application, you would send this data to a backend server.
            // For now, we'll just log it and show a simple success message.
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            console.log('Form Submitted:', data);

            // Display success message in custom modal
            modalIcon.className = 'fas fa-check-circle text-green-500 mb-4';
            modalMessage.textContent = 'Thank you for your message! I will get back to you soon.';
            messageModal.classList.remove('hidden');

            contactForm.reset(); // Clear the form
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            messageModal.classList.add('hidden');
        });
        // Close modal if clicking outside (optional)
        messageModal.addEventListener('click', (event) => {
            if (event.target === messageModal) {
                messageModal.classList.add('hidden');
            }
        });
    }
});
