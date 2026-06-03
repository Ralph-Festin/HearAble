/* rendering.js
   This file acts as our visual factory. Its only job is to receive arrays of data 
   and loop through them, churning out HTML cards that get injected into the DOM.
*/

// Draws the main list of jobs on the Job Postings page
function renderJobs(jobsArray) {
    const container = document.getElementById('job-postings-container');
    const counter = document.getElementById('results-counter');
    
    // Safety check in case the element doesn't exist
    if (!container) return;
    
    // Clear out any old jobs before drawing new ones
    container.innerHTML = '';
    
    // Update the counter text
    if (counter) {
        counter.textContent = `Showing ${jobsArray.length} job${jobsArray.length !== 1 ? 's' : ''}`;
    }

    // Loop through the data and build a card for each item
    jobsArray.forEach(job => {
        // Uses a utility function to turn an array of skills into nice visual badges
        const skillsHTML = generateSkillPillsHTML(job.skills, 3);
        const jobCard = document.createElement('div');
        jobCard.className = 'job-board-item';
        
        jobCard.innerHTML = `
            <div class="job-board-header">
                <div class="job-title-row">
                    <h4>${job.title}</h4>
                    <span class="tag">${job.type}</span>
                </div>
                <p class="job-meta-details">
                    <span>🏢 ${job.company}</span>
                    <span>📍 ${job.location}</span>
                    <span>🕒 Posted on ${job.date}</span>
                </p>
            </div>
            <p class="description">${job.description}</p>
            ${skillsHTML}
            <div class="job-board-footer">
                <button class="btn-black view-details-btn" data-id="${job.id}">View Details</button>
            </div>
        `;
        // Attach the finished card to the screen
        container.appendChild(jobCard);
    });
    
    // Re-attach click listeners to the new buttons we just generated
    attachDetailsListeners();
}

// Draws the list of graduates for the Admin view
function renderGraduates(gradsArray) {
    const container = document.getElementById('graduates-container');
    if (!container) return;
    container.innerHTML = '';

    gradsArray.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'list-item';
        
        userCard.innerHTML = `
            <div class="applicant-info-wrapper">
                <div class="avatar-lg avatar-md">${user.initials}</div>
                <div class="item-content pr-0">
                    <h4 class="mb-2">${user.name}</h4>
                    <p class="company-info">🎓 ${user.course} • ${user.batch}</p>
                </div>
            </div>
            <div class="item-actions">
                <span class="status-badge ${user.status}">${user.status}</span>
                <button class="btn-outline mt-8">View Profile</button>
            </div>
        `;
        container.appendChild(userCard);
    });
}

// Draws the list of approved companies for the Admin view
function renderCompanies(companiesArray) {
    const container = document.getElementById('companies-container');
    if (!container) return;
    container.innerHTML = '';

    companiesArray.forEach(company => {
        const compCard = document.createElement('div');
        compCard.className = 'list-item';
        
        compCard.innerHTML = `
            <div class="item-content">
                <h4>${company.name}</h4>
                <p class="company-info">📍 ${company.location}</p>
                <p class="description mb-0">Active Job Postings: <strong>${company.jobsPosted}</strong></p>
            </div>
            <div class="item-actions">
                <span class="status-badge ${company.status}">${company.status}</span>
                <button class="btn-outline mt-8">Manage</button>
            </div>
        `;
        container.appendChild(compCard);
    });
}

// Draws the abbreviated list of jobs shown on the Home dashboard
function renderRecentJobs(jobsArray, roleContext) {
    const container = document.getElementById('recent-jobs-container');
    const title = document.getElementById('home-jobs-title');
    const subtitle = document.getElementById('home-jobs-subtitle');
    if (!container) return;
    
    container.innerHTML = '';

    // Adjust titles based on who is looking at the dashboard
    if (roleContext === 'company') {
        if(title) title.textContent = "Your Job Postings";
        if(subtitle) subtitle.textContent = "Manage the opportunities you've posted";
    } else {
        if(title) title.textContent = "Recent Job Postings";
        if(subtitle) subtitle.textContent = "Latest opportunities from partner companies";
    }

    jobsArray.forEach(job => {
        // Chop off long descriptions so they fit nicely on the home page
        const shortDesc = truncateText(job.description, 120);
        const listItem = document.createElement('div');
        listItem.className = 'list-item';
        
        listItem.innerHTML = `
            <div class="item-content">
                <h4>${job.title}</h4>
                <p class="company-info">🏢 ${job.company} 📍 ${job.location}</p>
                <p class="description">${shortDesc}</p>
                <span class="timestamp">🕒 Posted on ${job.date}</span>
            </div>
            <div class="item-actions">
                <span class="tag">${job.type}</span>
                <button class="btn-outline view-details-btn" data-id="${job.id}">View Details</button>
            </div>
        `;
        container.appendChild(listItem);
    });
    
    attachDetailsListeners();
}

// Draws either the company applicants list or the user's application history
function renderApplications(appsArray, roleContext) {
    const container = document.getElementById('applications-container');
    const title = document.getElementById('app-section-title');
    const subtitle = document.getElementById('app-section-subtitle');
    const icon = document.getElementById('app-section-icon');
    const viewAllBtn = document.getElementById('view-all-apps-btn');
    if (!container) return;
    
    container.innerHTML = '';

    // Companies need to see a detailed card for every person who applied
    if (roleContext === 'company') {
        if(title) title.textContent = "Recent Applications";
        if(subtitle) subtitle.textContent = "Latest candidates who applied to your positions";
        if(icon) icon.style.display = 'block';
        if(viewAllBtn) viewAllBtn.style.display = 'block';

        appsArray.forEach(app => {
            const skillsHTML = generateSkillPillsHTML(app.skills, 4);
            const appCard = document.createElement('div');
            appCard.className = 'applicant-card';
            
            appCard.innerHTML = `
                <div class="applicant-info-wrapper">
                    <div class="avatar-lg">${app.initials}</div>
                    <div class="applicant-details">
                        <h4>${app.applicantName}</h4>
                        <div class="job-title">${app.jobTitle}</div>
                        <div class="applied-date">📅 Applied ${app.date}</div>
                        ${skillsHTML}
                    </div>
                </div>
                <span class="status-badge ${app.status}">${app.status}</span>
            `;
            container.appendChild(appCard);
        });
    } else {
        // Users just see a simple status update of the jobs they've applied to
        if(title) title.textContent = "My Applications";
        if(subtitle) subtitle.textContent = "Track your job application status";
        if(icon) icon.style.display = 'none';
        if(viewAllBtn) viewAllBtn.style.display = 'none';

        // Static mockup data for users to visualize the design
        container.innerHTML = `
            <div class="list-item-status">
                <div>
                    <h4>Frontend Developer</h4>
                    <p class="company-info">Tech Solutions Inc.</p>
                    <p class="timestamp">Applied 3/9/2026</p>
                </div>
                <span class="status-badge reviewing">reviewing</span>
            </div>
            <div class="list-item-status">
                <div>
                    <h4>Backend Developer</h4>
                    <p class="company-info">Digital Innovations</p>
                    <p class="timestamp">Applied 3/10/2026</p>
                </div>
                <span class="status-badge pending">pending</span>
            </div>
        `;
    }
}

// Binds click events to any "View Details" button currently on the screen
function attachDetailsListeners() {
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            // Retrieve the stored ID to know which job data object to look up
            const jobId = parseInt(e.target.getAttribute('data-id'));
            renderJobDetails(jobId);
        });
    });
}

// Builds the massive full-page view for a single job posting
function renderJobDetails(jobId) {
    // Search the database for the exact job matching the ID
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;

    const detailsContainer = document.getElementById('job-details-content');
    
    // Transform the array of skills into HTML list items
    const requirementsList = job.skills.map(skill => `<li><span>${skill}</span></li>`).join('');
    
    // Logic to determine what the primary action button should do
    const currentRole = document.querySelector('.role-btn.active').getAttribute('data-role');
    const isOwnCompanyPost = (currentRole === 'company' && job.company === CURRENT_LOGGED_IN_COMPANY);
    
    let appliedBanner = '';
    let actionButton = '';

    if (currentRole === 'admin') {
        actionButton = `<button class="btn-disabled" disabled>Viewing as Admin</button>`;
    } else if (isOwnCompanyPost) {
        // Companies don't need to apply to their own jobs
        actionButton = '';
    } else {
        // Users get an active apply button, or a disabled one if they already applied
        appliedBanner = job.applied ? `<div class="alert-success">✓ You have already applied for this position</div>` : '';
        actionButton = job.applied ? `<button class="btn-disabled" disabled>Already Applied</button>` : `<button class="btn-apply" id="apply-now-btn" data-id="${job.id}">Apply Now</button>`;
    }

    // Inject everything into the container
    detailsContainer.innerHTML = `
        <div class="details-header">
            <h2 class="details-title">${job.title}</h2>
            <span class="tag">${job.type}</span>
        </div>
        <div class="details-meta">
            <span>🏢 ${job.company}</span>
            <span>📍 ${job.location}</span>
            <span>💼 ${job.type}</span>
        </div>
        <div class="details-date">🕒 Posted on ${job.date}</div>
        ${appliedBanner}
        <div class="details-section">
            <h4>Job Description</h4>
            <p>${job.description}</p>
        </div>
        <div class="details-section">
            <h4>Requirements</h4>
            <ul class="requirements-list">
                ${requirementsList}
            </ul>
        </div>
        <div class="details-section">
            <h4>Company Information</h4>
            <div class="company-card">
                <h5>${job.company}</h5>
                <p>${job.location}</p>
                <p class="company-desc">${job.companyBio}</p>
            </div>
        </div>
        <div class="action-footer">
            ${actionButton}
        </div>
    `;
    
    // Switch the view to show the newly built details page
    navigateToDetails();
}