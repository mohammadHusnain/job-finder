/**
 * Authentication functionality for Job Finder
 * Handles login, signup, and role-based routing using local storage
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize authentication forms
    initializeAuthForms();

    // Check authentication status
    checkAuthStatus();
});

function initializeAuthForms() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleLogin();
        });
    }

    // Signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleSignup();
        });
    }

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const isEmployer = document.getElementById('userTypeCompany').checked;

    // Simple validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'danger');
        return;
    }

    // Show loading spinner
    showLoadingSpinner();

    // Simulate API call with a slight delay
    setTimeout(() => {
        // Check if user exists in local storage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);

        if (user && user.password === password) {
            // Store user data
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', user.firstName + ' ' + user.lastName);
            localStorage.setItem('userType', isEmployer ? 'employer' : 'jobseeker');
            localStorage.setItem('dashboardRedirect', 'true');

            // Show success message
            showNotification('Login successful! Redirecting...', 'success');

            // Redirect to appropriate dashboard
            setTimeout(() => {
                redirectToDashboard(isEmployer);
            }, 1000);
        } else {
            // If no user found or password doesn't match, create a mock user for demo purposes
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', email.split('@')[0]);
            localStorage.setItem('userType', isEmployer ? 'employer' : 'jobseeker');
            localStorage.setItem('dashboardRedirect', 'true');

            // Show success message
            showNotification('Login successful! Redirecting...', 'success');

            // Redirect to appropriate dashboard
            setTimeout(() => {
                redirectToDashboard(isEmployer);
            }, 1000);
        }

        hideLoadingSpinner();
    }, 1000);
}

function handleSignup() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const isEmployer = document.getElementById('signupUserTypeCompany').checked;
    const termsAccepted = document.getElementById('termsCheck').checked;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showNotification('Please fill in all required fields', 'danger');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'danger');
        return;
    }

    if (!termsAccepted) {
        showNotification('Please accept the terms and conditions', 'danger');
        return;
    }

    // Show loading spinner
    showLoadingSpinner();

    // Simulate API call with a slight delay
    setTimeout(() => {
        // Store user in local storage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push({
            firstName,
            lastName,
            email,
            password,
            userType: isEmployer ? 'employer' : 'jobseeker',
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(users));

        // Store current user data
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', `${firstName} ${lastName}`);
        localStorage.setItem('userType', isEmployer ? 'employer' : 'jobseeker');
        localStorage.setItem('dashboardRedirect', 'true');

        // Show success message
        showNotification('Account created successfully! Redirecting...', 'success');

        // Redirect to appropriate dashboard
        setTimeout(() => {
            redirectToDashboard(isEmployer);
        }, 1000);

        hideLoadingSpinner();
    }, 1500);
}

function handleLogout() {
    // Show loading spinner
    showLoadingSpinner();

    // Simulate API call
    setTimeout(() => {
        // Clear user data
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
        localStorage.removeItem('dashboardRedirect');

        // Show success message
        showNotification('Logged out successfully!', 'success');

        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);

        hideLoadingSpinner();
    }, 1000);
}

function checkAuthStatus() {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userType = localStorage.getItem('userType');

    // Update UI based on authentication status
    updateAuthUI(userLoggedIn, userType);

    // Handle dashboard access
    if (window.location.pathname.includes('dashboard')) {
        if (!userLoggedIn) {
            // Redirect to home if not logged in
            showNotification('Please log in to access the dashboard', 'warning');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else if (
            (window.location.pathname.includes('company') && userType !== 'employer') ||
            (window.location.pathname.includes('jobseeker') && userType !== 'jobseeker')
        ) {
            // Redirect to correct dashboard if on wrong one
            showNotification('Redirecting to your dashboard...', 'info');
            setTimeout(() => {
                redirectToDashboard(userType === 'employer');
            }, 1000);
        }
    }
}

function updateAuthUI(isLoggedIn, userType) {
    // Update navigation based on auth status
    const loginBtn = document.querySelector('.btn[data-bs-target="#loginModal"]');
    const signupBtn = document.querySelector('.btn[data-bs-target="#signupModal"]');
    const userMenu = document.querySelector('.user-menu');

    if (loginBtn && signupBtn) {
        if (isLoggedIn) {
            // Hide login/signup buttons if logged in
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';

            // Show dashboard link if not already on dashboard
            if (!window.location.pathname.includes('dashboard')) {
                const dashboardLink = document.createElement('a');
                dashboardLink.href = userType === 'employer' ? 'company-dashboard.html' : 'user-dashboard.html';
                dashboardLink.className = 'btn btn-primary';
                dashboardLink.textContent = 'Go to Dashboard';
                dashboardLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    redirectToDashboard(userType === 'employer');
                });
                signupBtn.parentNode.appendChild(dashboardLink);
            }
        } else {
            // Show login/signup buttons if not logged in
            loginBtn.style.display = '';
            signupBtn.style.display = '';
        }
    }

    // Update user menu if it exists
    if (userMenu && isLoggedIn) {
        const userName = localStorage.getItem('userName') || localStorage.getItem('userEmail');
        const userNameElement = userMenu.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = userName;
        }
    }
}

function redirectToDashboard(isEmployer) {
    // Show loading spinner
    showLoadingSpinner();

    // Add fade-out animation to current page
    document.body.classList.add('fade-out');

    // Redirect to appropriate dashboard
    setTimeout(() => {
        window.location.href = isEmployer ? 'company-dashboard.html' : 'user-dashboard.html';
    }, 500);
}

function showLoadingSpinner() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loadingOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';

        const spinner = document.createElement('div');
        spinner.className = 'spinner-border text-primary';
        spinner.setAttribute('role', 'status');

        const spinnerText = document.createElement('span');
        spinnerText.className = 'visually-hidden';
        spinnerText.textContent = 'Loading...';

        spinner.appendChild(spinnerText);
        overlay.appendChild(spinner);
        document.body.appendChild(overlay);
    }
}

function hideLoadingSpinner() {
    const spinner = document.querySelector('.loading-overlay');
    if (spinner) {
        spinner.classList.add('fade-out');
        setTimeout(() => {
            spinner.remove();
        }, 300);
    }
}

function showNotification(message, type = 'info') {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toastContainer')) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(container);
    }

    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    // Create toast content
    const toastContent = document.createElement('div');
    toastContent.className = 'd-flex';

    const toastBody = document.createElement('div');
    toastBody.className = 'toast-body';
    toastBody.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close btn-close-white me-2 m-auto';
    closeButton.setAttribute('data-bs-dismiss', 'toast');
    closeButton.setAttribute('aria-label', 'Close');

    toastContent.appendChild(toastBody);
    toastContent.appendChild(closeButton);
    toast.appendChild(toastContent);

    // Add toast to container
    document.getElementById('toastContainer').appendChild(toast);

    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 5000 });
    bsToast.show();

    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function () {
        toast.remove();
    });
}