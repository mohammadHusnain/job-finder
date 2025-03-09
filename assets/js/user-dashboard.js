/**
 * User Dashboard JavaScript
 * Handles functionality specific to the user/job seeker dashboard
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize dashboard components
    initializeDashboard();

    // Load user data
    loadUserData();

    // Load job recommendations
    loadJobRecommendations();

    // Load recent applications
    loadRecentApplications();
});

/**
 * Initialize dashboard components and event listeners
 */
function initializeDashboard() {
    // Initialize sidebar navigation
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
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Initialize mobile sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            document.querySelector('.dashboard-sidebar').classList.toggle('active');
        });
    }

    // Initialize resume upload
    const resumeUpload = document.getElementById('resumeUpload');
    const resumePreview = document.getElementById('resumePreview');
    const uploadResumeBtn = document.getElementById('uploadResumeBtn');

    if (resumeUpload && resumePreview && uploadResumeBtn) {
        resumeUpload.addEventListener('change', function () {
            if (this.files.length > 0) {
                resumePreview.textContent = this.files[0].name;
                uploadResumeBtn.disabled = false;
            } else {
                resumePreview.textContent = 'No file selected';
                uploadResumeBtn.disabled = true;
            }
        });

        uploadResumeBtn.addEventListener('click', function () {
            showLoadingSpinner();

            // Simulate upload and analysis
            setTimeout(() => {
                hideLoadingSpinner();

                // Show resume analysis
                const analysisSection = document.getElementById('resumeAnalysisSection');
                if (analysisSection) {
                    analysisSection.innerHTML = `
                        <div class="alert alert-success">
                            <h5>Resume Analysis Complete</h5>
                            <p>Your resume has been analyzed successfully. Here are some insights:</p>
                            <ul>
                                <li>Match score: 78%</li>
                                <li>Skills detected: JavaScript, HTML, CSS, React</li>
                                <li>Experience level: Mid-level</li>
                            </ul>
                            <p>We've updated your job recommendations based on your resume.</p>
                        </div>
                    `;
                }

                // Show notification
                showNotification('Resume uploaded and analyzed successfully!', 'success');

                // Refresh job recommendations
                loadJobRecommendations();
            }, 2000);
        });
    }

    // Initialize form submissions
    initializeFormSubmissions();
}

/**
 * Initialize form submissions
 */
function initializeFormSubmissions() {
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();

            showLoadingSpinner();

            // Simulate saving profile
            setTimeout(() => {
                hideLoadingSpinner();
                showNotification('Profile updated successfully!', 'success');

                // Update user data in local storage
                const firstName = document.getElementById('profileFirstName').value;
                const lastName = document.getElementById('profileLastName').value;
                localStorage.setItem('userName', `${firstName} ${lastName}`);

                // Update UI
                document.getElementById('profileName').textContent = `${firstName} ${lastName}`;
                document.getElementById('welcomeUsername').textContent = firstName;
            }, 1000);
        });
    }

    // Add experience form
    const saveExperienceBtn = document.getElementById('saveExperienceBtn');
    if (saveExperienceBtn) {
        saveExperienceBtn.addEventListener('click', function () {
            const jobTitle = document.getElementById('jobTitle').value;
            const company = document.getElementById('company').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('currentJob').checked ? 'Present' : document.getElementById('endDate').value;
            const description = document.getElementById('jobDescription').value;

            if (!jobTitle || !company || !startDate || !description) {
                showNotification('Please fill in all required fields', 'danger');
                return;
            }

            showLoadingSpinner();

            // Simulate saving experience
            setTimeout(() => {
                hideLoadingSpinner();

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('addExperienceModal'));
                modal.hide();

                // Add experience to UI
                const timeline = document.querySelector('#profile .timeline');
                const newExperience = document.createElement('div');
                newExperience.className = 'timeline-item';
                newExperience.innerHTML = `
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <h6 class="timeline-title">${jobTitle}</h6>
                            <span class="timeline-date">${formatDate(startDate)} - ${formatDate(endDate)}</span>
                        </div>
                        <div class="timeline-company">${company}</div>
                        <div class="timeline-description">
                            <p>${description}</p>
                        </div>
                        <div class="timeline-actions">
                            <button class="btn btn-sm btn-outline-primary">Edit</button>
                            <button class="btn btn-sm btn-outline-danger">Delete</button>
                        </div>
                    </div>
                `;

                timeline.prepend(newExperience);

                // Show notification
                showNotification('Experience added successfully!', 'success');

                // Reset form
                document.getElementById('experienceForm').reset();
            }, 1000);
        });
    }

    // Add education form
    const saveEducationBtn = document.getElementById('saveEducationBtn');
    if (saveEducationBtn) {
        saveEducationBtn.addEventListener('click', function () {
            // Similar implementation as experience form
            showNotification('Education added successfully!', 'success');
        });
    }

    // Add skill form
    const addSkillBtn = document.getElementById('addSkillBtn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function () {
            const skillInput = document.getElementById('skillInput');
            const skill = skillInput.value.trim();

            if (!skill) {
                showNotification('Please enter a skill', 'warning');
                return;
            }

            // Add skill to UI
            const skillTags = document.getElementById('skillTags');
            const newSkill = document.createElement('span');
            newSkill.className = 'skill-tag';
            newSkill.innerHTML = `${skill} <button class="skill-remove-btn" onclick="removeSkill(this)"><i class="fas fa-times"></i></button>`;

            skillTags.appendChild(newSkill);

            // Clear input
            skillInput.value = '';

            // Show notification
            showNotification('Skill added successfully!', 'success');
        });
    }
}

/**
 * Load user data from local storage
 */
function loadUserData() {
    const userName = localStorage.getItem('userName') || localStorage.getItem('userEmail');
    const firstName = userName ? userName.split(' ')[0] : 'User';

    // Update UI with user data
    const userNameElements = document.querySelectorAll('#username, #profileName');
    userNameElements.forEach(el => {
        if (el) el.textContent = userName;
    });

    const welcomeElement = document.getElementById('welcomeUsername');
    if (welcomeElement) welcomeElement.textContent = firstName;
}

/**
 * Load job recommendations
 */
function loadJobRecommendations() {
    const jobRecommendations = document.getElementById('jobRecommendations');
    if (!jobRecommendations) return;

    // Simulate loading job recommendations
    showLoadingSpinner();

    setTimeout(() => {
        hideLoadingSpinner();

        // Job recommendations are already in the HTML
        console.log('Job recommendations loaded');
    }, 1000);
}

/**
 * Load recent applications
 */
function loadRecentApplications() {
    // Implementation similar to loadJobRecommendations
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (dateString === 'Present') return 'Present';

    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Remove skill from UI
 */
function removeSkill(button) {
    const skillTag = button.parentElement;
    skillTag.remove();
    showNotification('Skill removed', 'info');
}

/**
 * Apply for job
 */
function applyForJob(jobId) {
    showLoadingSpinner();

    // Simulate applying for job
    setTimeout(() => {
        hideLoadingSpinner();
        showNotification('Application submitted successfully!', 'success');
    }, 1500);
}

/**
 * Save job
 */
function saveJob(jobId) {
    const button = event.currentTarget;
    button.innerHTML = button.innerHTML.includes('far') ?
        '<i class="fas fa-bookmark"></i>' :
        '<i class="far fa-bookmark"></i>';

    showNotification(
        button.innerHTML.includes('fas') ?
            'Job saved to your bookmarks' :
            'Job removed from your bookmarks',
        'info'
    );
}

/**
 * Show loading spinner
 */
function showLoadingSpinner() {
    // Check if there's a global function
    if (typeof window.showLoadingSpinner === 'function') {
        window.showLoadingSpinner();
        return;
    }

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

/**
 * Hide loading spinner
 */
function hideLoadingSpinner() {
    // Check if there's a global function
    if (typeof window.hideLoadingSpinner === 'function') {
        window.hideLoadingSpinner();
        return;
    }

    const spinner = document.querySelector('.loading-overlay');
    if (spinner) {
        spinner.classList.add('fade-out');
        setTimeout(() => {
            spinner.remove();
        }, 300);
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Check if there's a global function
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }

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