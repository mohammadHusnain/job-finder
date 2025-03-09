/**
 * Navigation functionality for Job Finder
 * Handles navigation and routing between pages
 */

document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    handleMobileNavigation();
    initializeScrollBehavior();
    initializeDashboardNavigation();
    initializeAboutPage();
});

function initializeNavigation() {
    // Handle navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Don't prevent default for modal triggers
            if (this.hasAttribute('data-bs-toggle')) {
                return;
            }

            e.preventDefault();
            navigateToSection(href.substring(1));
        });
    });

    // Handle back to home button
    const homeButton = document.querySelector('.home-button');
    if (homeButton) {
        homeButton.addEventListener('click', function (e) {
            e.preventDefault();
            navigateToHome();
        });
    }

    // Handle dashboard navigation
    const dashboardLinks = document.querySelectorAll('.dashboard-nav-link');
    dashboardLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetDashboard = this.getAttribute('href');
            navigateToDashboard(targetDashboard);
        });
    });
}

function handleMobileNavigation() {
    // Toggle mobile menu
    const menuToggle = document.querySelector('.navbar-toggler');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            document.body.classList.toggle('mobile-menu-open');
        });
    }

    // Handle sidebar overlay for mobile
    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(sidebarOverlay);

    sidebarOverlay.addEventListener('click', function () {
        document.body.classList.remove('sidebar-show');
    });

    // Update sidebar behavior
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function (e) {
            e.preventDefault();
            document.body.classList.toggle('sidebar-show');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (document.body.classList.contains('mobile-menu-open') &&
            !e.target.closest('.navbar-collapse') &&
            !e.target.closest('.navbar-toggler')) {
            document.body.classList.remove('mobile-menu-open');
        }
    });
}

function initializeScrollBehavior() {
    // Smooth scroll to sections
    document.querySelectorAll('a[href^="#"]:not([data-bs-toggle])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle navbar transparency on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }

            if (currentScroll > lastScroll) {
                navbar.classList.add('navbar-hidden');
            } else {
                navbar.classList.remove('navbar-hidden');
            }

            lastScroll = currentScroll;
        }
    });
}

function initializeDashboardNavigation() {
    // Handle dashboard section navigation
    const dashboardNavLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const dashboardSections = document.querySelectorAll('.dashboard-section');

    dashboardNavLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all links and sections
            dashboardNavLinks.forEach(l => l.classList.remove('active'));
            dashboardSections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Show corresponding section with fade animation
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                targetSection.classList.add('active', 'fade-in');
                setTimeout(() => targetSection.classList.remove('fade-in'), 300);
            }

            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                document.body.classList.remove('sidebar-show');
            }
        });
    });

    // Initialize first section
    const defaultSection = dashboardNavLinks[0];
    if (defaultSection) {
        defaultSection.click();
    }
}

function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function navigateToHome() {
    // Show loading animation
    showLoadingSpinner();

    // Add fade-out animation
    document.body.classList.add('fade-out');

    // Redirect after animation
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
}

function navigateToDashboard(targetDashboard) {
    // Check if user is logged in
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userType = localStorage.getItem('userType');

    if (!userLoggedIn) {
        // Show login modal if not logged in
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }

    // Show loading animation
    showLoadingSpinner();

    // Add fade-out animation
    document.body.classList.add('fade-out');

    // Redirect to appropriate dashboard
    setTimeout(() => {
        window.location.href = userType === 'employer' ? 'company-dashboard.html' : 'jobseeker-dashboard.html';
    }, 300);
}

function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    document.body.appendChild(spinner);
}

/**
 * Initialize About page animations and interactions
 */
function initializeAboutPage() {
    // Check if we're on the About page
    if (window.location.pathname.includes('about.html')) {
        // Animate elements when they come into view
        const fadeElements = document.querySelectorAll('.fade-in');

        // Add fade-in classes to elements
        document.querySelectorAll('.mission-icon').forEach((el, index) => {
            el.classList.add('fade-in', `fade-in-${index + 1}`);
        });

        document.querySelectorAll('.team-member').forEach((el, index) => {
            el.classList.add('fade-in', `fade-in-${index + 1}`);
        });

        document.querySelectorAll('.stat-item').forEach((el, index) => {
            el.classList.add('fade-in', `fade-in-${index + 1}`);
        });

        document.querySelectorAll('.contact-item').forEach((el, index) => {
            el.classList.add('fade-in', `fade-in-${index + 1}`);
        });

        // Function to check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
        }

        // Function to handle scroll animation
        function handleScrollAnimation() {
            fadeElements.forEach(element => {
                if (isInViewport(element) && !element.classList.contains('active')) {
                    element.classList.add('active');
                }
            });
        }

        // Initial check for elements in viewport
        handleScrollAnimation();

        // Listen for scroll events
        window.addEventListener('scroll', handleScrollAnimation);

        // Handle contact form submission
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // Show loading spinner
                showLoadingSpinner();

                // Simulate form submission
                setTimeout(() => {
                    hideLoadingSpinner();

                    // Show success message
                    showNotification('Your message has been sent successfully!', 'success');

                    // Reset form
                    contactForm.reset();
                }, 1500);
            });
        }
    }
}

// Export functions for use in other scripts
window.Navigation = {
    navigateToHome,
    navigateToDashboard,
    showLoadingSpinner,
    initializeDashboardNavigation
};