/**
 * Main JavaScript functionality for Job Finder
 * Handles theme switching, animations, and general UI functionality
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize theme
    initializeTheme();

    // Initialize animations
    initializeAnimations();

    // Initialize tooltips and popovers
    initializeBootstrapComponents();

    // Initialize form validation
    initializeFormValidation();

    // Check for dashboard redirect
    checkDashboardRedirect();

    // Initialize auth state
    checkAuthState();

    // Initialize event listeners
    initializeEventListeners();
});

function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const isDarkMode = localStorage.getItem('theme') === 'dark';

    // Set initial theme
    body.classList.toggle('dark-mode', isDarkMode);
    updateThemeIcon(isDarkMode);

    // Handle theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            body.classList.toggle('dark-mode');
            const newTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme === 'dark');
        });
    }
}

function updateThemeIcon(isDarkMode) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = isDarkMode ?
            '<i class="fas fa-sun"></i>' :
            '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('title', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
}

function initializeAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.animate__animated');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__fadeIn');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Add hover animations to cards
    document.querySelectorAll('.card, .stat-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.classList.add('card-hover');
        });
        card.addEventListener('mouseleave', function () {
            this.classList.remove('card-hover');
        });
    });
}

function initializeBootstrapComponents() {
    // Initialize all tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    // Initialize all popovers
    const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    popovers.forEach(popover => new bootstrap.Popover(popover));

    // Initialize all toasts
    const toasts = document.querySelectorAll('.toast');
    toasts.forEach(toast => new bootstrap.Toast(toast));
}

function initializeFormValidation() {
    // Add validation classes and feedback
    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function () {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
        });
    });
}

function checkDashboardRedirect() {
    // Only redirect from home page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const userType = localStorage.getItem('userType');
        const dashboardRedirect = localStorage.getItem('dashboardRedirect');

        if (userLoggedIn && dashboardRedirect === 'true') {
            // Show loading animation
            showLoadingSpinner();

            // Add fade-out animation
            document.body.classList.add('fade-out');

            // Redirect to appropriate dashboard
            setTimeout(() => {
                window.location.href = userType === 'employer' ? 'company-dashboard.html' : 'jobseeker-dashboard.html';
            }, 300);
        }
    }
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

function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    const container = document.querySelector('.toast-container') || createToastContainer();
    container.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}

// Check auth state
function checkAuthState() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');

    if (isLoggedIn && userEmail) {
        // User is signed in
        console.log('User is signed in:', userEmail);
    } else {
        // User is signed out
        console.log('User is signed out');
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            logoutUser()
                .then(() => {
                    showNotification('Logged out successfully', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                })
                .catch((error) => {
                    console.error('Logout error:', error);
                    showNotification(error.message, 'error');
                });
        });
    }
}

// Export functions for use in other scripts
window.JobFinder = {
    showNotification,
    showLoadingSpinner,
    initializeTheme,
    initializeAnimations
};