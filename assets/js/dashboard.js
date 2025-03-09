/**
 * Dashboard functionality for Job Finder
 * Handles both job seeker and employer dashboard interactions
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all tooltips
    initializeTooltips();

    // Initialize navigation
    initializeNavigation();

    // Initialize job actions
    initializeJobActions();

    // Initialize profile actions
    initializeProfileActions();

    // Initialize charts if they exist
    initializeCharts();

    // Set user information
    setUserInfo();

    // Initialize search and filters
    initializeSearchAndFilters();
});

function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const sections = document.querySelectorAll('.dashboard-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                // Add animation class
                targetSection.classList.add('fade-in');
                setTimeout(() => targetSection.classList.remove('fade-in'), 300);
            }
        });
    });
}

function initializeJobActions() {
    // Apply for job buttons
    document.querySelectorAll('.btn-apply-job').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const jobId = this.dataset.jobId;
            applyForJob(jobId);
        });
    });

    // Save job buttons
    document.querySelectorAll('.btn-save-job').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const jobId = this.dataset.jobId;
            saveJob(jobId);
        });
    });

    // Job posting form (for employer dashboard)
    const postJobForm = document.getElementById('postJobForm');
    if (postJobForm) {
        postJobForm.addEventListener('submit', handleJobPost);
    }

    // Job management buttons (for employer dashboard)
    document.querySelectorAll('.btn-edit-job').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const jobId = this.dataset.jobId;
            editJob(jobId);
        });
    });

    document.querySelectorAll('.btn-close-job').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const jobId = this.dataset.jobId;
            closeJob(jobId);
        });
    });
}

function initializeProfileActions() {
    // Resume upload
    const resumeUpload = document.getElementById('resumeUpload');
    if (resumeUpload) {
        resumeUpload.addEventListener('change', handleResumeUpload);
    }

    // Profile edit buttons
    document.querySelectorAll('.btn-edit-profile').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.dataset.section;
            enableProfileEdit(section);
        });
    });

    // Profile save buttons
    document.querySelectorAll('.btn-save-profile').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const section = this.dataset.section;
            saveProfileChanges(section);
        });
    });
}

function initializeCharts() {
    // Initialize charts only if we're on the employer dashboard
    if (window.location.pathname.includes('company-dashboard')) {
        initializeEmployerCharts();
    } else if (window.location.pathname.includes('jobseeker-dashboard')) {
        initializeJobSeekerCharts();
    }
}

function initializeEmployerCharts() {
    // Department distribution chart
    const departmentCtx = document.getElementById('departmentChart')?.getContext('2d');
    if (departmentCtx) {
        new Chart(departmentCtx, {
            type: 'pie',
            data: {
                labels: ['Engineering', 'Design', 'Marketing', 'Sales', 'HR'],
                datasets: [{
                    data: [30, 20, 15, 25, 10],
                    backgroundColor: [
                        '#4e73df',
                        '#1cc88a',
                        '#36b9cc',
                        '#f6c23e',
                        '#e74a3b'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Employee Distribution by Department'
                    }
                }
            }
        });
    }

    // Employee growth chart
    const growthCtx = document.getElementById('employeeGrowthChart')?.getContext('2d');
    if (growthCtx) {
        new Chart(growthCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Total Employees',
                    data: [85, 90, 95, 100, 105, 110],
                    borderColor: '#4e73df',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Employee Growth Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function initializeJobSeekerCharts() {
    // Resume match score chart
    const scoreCtx = document.getElementById('resumeScoreChart')?.getContext('2d');
    if (scoreCtx) {
        new Chart(scoreCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [78, 22],
                    backgroundColor: ['#4e73df', '#e9ecef']
                }]
            },
            options: {
                responsive: true,
                cutout: '80%',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

function initializeSearchAndFilters() {
    // Job search
    const jobSearch = document.getElementById('jobSearch');
    if (jobSearch) {
        jobSearch.addEventListener('input', debounce(handleJobSearch, 300));
    }

    // Filters
    document.querySelectorAll('.job-filter').forEach(filter => {
        filter.addEventListener('change', handleJobFilter);
    });
}

function setUserInfo() {
    const userName = localStorage.getItem('userName') || localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');

    // Update user name in header
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement && userName) {
        userNameElement.textContent = userName;
    }

    // Update dashboard title based on user type
    const dashboardTitle = document.querySelector('.dashboard-title');
    if (dashboardTitle && userType) {
        dashboardTitle.textContent = userType === 'employer' ? 'Company Dashboard' : 'Job Seeker Dashboard';
    }
}

// Job Actions
function applyForJob(jobId) {
    showLoadingSpinner();
    // Simulate API call
    setTimeout(() => {
        showNotification('Application submitted successfully!', 'success');
        hideLoadingSpinner();
        // Update UI to reflect application
        const applyBtn = document.querySelector(`[data-job-id="${jobId}"]`);
        if (applyBtn) {
            applyBtn.textContent = 'Applied';
            applyBtn.disabled = true;
        }
    }, 1000);
}

function saveJob(jobId) {
    const btn = document.querySelector(`[data-job-id="${jobId}"]`);
    if (btn) {
        btn.classList.toggle('active');
        showNotification(
            btn.classList.contains('active') ? 'Job saved!' : 'Job removed from saved jobs',
            'success'
        );
    }
}

function handleJobPost(e) {
    e.preventDefault();
    showLoadingSpinner();

    // Get form data
    const formData = new FormData(e.target);
    const jobData = Object.fromEntries(formData.entries());

    // Validate data
    if (!validateJobData(jobData)) {
        hideLoadingSpinner();
        return;
    }

    // Simulate API call
    setTimeout(() => {
        addJobToTable(jobData);
        showNotification('Job posted successfully!', 'success');
        e.target.reset();
        hideLoadingSpinner();
    }, 1000);
}

function validateJobData(data) {
    const required = ['title', 'department', 'location', 'type', 'experience', 'description'];
    const missing = required.filter(field => !data[field]);

    if (missing.length > 0) {
        showNotification(`Please fill in all required fields: ${missing.join(', ')}`, 'danger');
        return false;
    }
    return true;
}

// Profile Actions
function handleResumeUpload(e) {
    const file = e.target.files[0];
    if (file) {
        showLoadingSpinner();
        // Simulate upload
        setTimeout(() => {
            showNotification('Resume uploaded successfully!', 'success');
            hideLoadingSpinner();
        }, 1500);
    }
}

function enableProfileEdit(section) {
    const container = document.querySelector(`#${section}`);
    if (container) {
        const inputs = container.querySelectorAll('input, textarea');
        inputs.forEach(input => input.removeAttribute('disabled'));

        // Show save button, hide edit button
        container.querySelector('.btn-edit-profile')?.classList.add('d-none');
        container.querySelector('.btn-save-profile')?.classList.remove('d-none');
    }
}

function saveProfileChanges(section) {
    showLoadingSpinner();
    // Simulate API call
    setTimeout(() => {
        const container = document.querySelector(`#${section}`);
        if (container) {
            const inputs = container.querySelectorAll('input, textarea');
            inputs.forEach(input => input.setAttribute('disabled', 'true'));

            // Show edit button, hide save button
            container.querySelector('.btn-edit-profile')?.classList.remove('d-none');
            container.querySelector('.btn-save-profile')?.classList.add('d-none');
        }
        showNotification('Changes saved successfully!', 'success');
        hideLoadingSpinner();
    }, 1000);
}

// Utility Functions
function showLoadingSpinner() {
    if (!document.getElementById('loadingSpinner')) {
        const spinner = document.createElement('div');
        spinner.id = 'loadingSpinner';
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;
        document.body.appendChild(spinner);
    }
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.remove();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other scripts
window.Dashboard = {
    initializeCharts,
    showNotification,
    showLoadingSpinner,
    hideLoadingSpinner
};