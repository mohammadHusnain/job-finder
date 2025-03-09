/**
 * Employer Dashboard JavaScript
 * Handles all employer dashboard specific functionality
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    // Handle job posting form submission
    const postJobForm = document.getElementById('postJobForm');
    if (postJobForm) {
        postJobForm.addEventListener('submit', handleJobPost);
    }

    // Handle job management actions
    initializeJobManagement();

    // Handle employee management actions
    initializeEmployeeManagement();

    // Initialize dashboard charts if they exist
    initializeDashboardCharts();
});

function handleJobPost(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target);
    const jobData = Object.fromEntries(formData.entries());

    // Validate form data
    if (!validateJobData(jobData)) {
        return;
    }

    // Simulate API call to post job
    showLoadingSpinner();
    setTimeout(() => {
        // Add job to table
        addJobToTable(jobData);

        // Show success message
        showNotification('Job posted successfully!', 'success');

        // Reset form
        e.target.reset();

        hideLoadingSpinner();
    }, 1000);
}

function validateJobData(data) {
    // Add your validation logic here
    return true;
}

function initializeJobManagement() {
    // Handle edit job button clicks
    document.querySelectorAll('.btn-edit-job').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const jobId = this.dataset.jobId;
            editJob(jobId);
        });
    });

    // Handle close job button clicks
    document.querySelectorAll('.btn-close-job').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const jobId = this.dataset.jobId;
            closeJob(jobId);
        });
    });
}

function initializeEmployeeManagement() {
    // Handle view employee button clicks
    document.querySelectorAll('.btn-view-employee').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const employeeId = this.dataset.employeeId;
            viewEmployee(employeeId);
        });
    });

    // Handle edit employee button clicks
    document.querySelectorAll('.btn-edit-employee').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const employeeId = this.dataset.employeeId;
            editEmployee(employeeId);
        });
    });
}

function editJob(jobId) {
    // Add your job editing logic here
    console.log('Editing job:', jobId);
}

function closeJob(jobId) {
    if (confirm('Are you sure you want to close this job posting?')) {
        // Add your job closing logic here
        console.log('Closing job:', jobId);
        showNotification('Job closed successfully!', 'success');
    }
}

function viewEmployee(employeeId) {
    // Add your employee viewing logic here
    console.log('Viewing employee:', employeeId);
}

function editEmployee(employeeId) {
    // Add your employee editing logic here
    console.log('Editing employee:', employeeId);
}

function addJobToTable(jobData) {
    const jobsTable = document.querySelector('#manage-jobs table tbody');
    if (jobsTable) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${jobData.title}</td>
            <td>${jobData.department}</td>
            <td>${new Date().toISOString().split('T')[0]}</td>
            <td>0</td>
            <td><span class="badge bg-success">Active</span></td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary btn-edit-job" data-job-id="new">Edit</button>
                    <button class="btn btn-sm btn-danger btn-close-job" data-job-id="new">Close</button>
                </div>
            </td>
        `;
        jobsTable.insertBefore(row, jobsTable.firstChild);
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Add to document
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
    document.body.appendChild(spinner);
}

function hideLoadingSpinner() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

// Export functions for use in other scripts
window.EmployerDashboard = {
    handleJobPost,
    editJob,
    closeJob,
    viewEmployee,
    editEmployee
};

function navigateToHome() {
    window.location.href = 'index.html';
}

// Add the chart initialization function
function initializeDashboardCharts() {
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