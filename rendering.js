/* ==========================================================================
   rendering.js - UI Generation Logic (Pure Layout Pipelines)
   ========================================================================== */

function renderJobs(jobsArray) {
    const container = document.getElementById('job-postings-container');
    const counter = document.getElementById('results-counter');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (counter) {
        counter.textContent = `Showing ${jobsArray.length} job${jobsArray.length !== 1 ? 's' : ''}`;
    }

    jobsArray.forEach(job => {
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
        container.appendChild(jobCard);
    });
    
    attachDetailsListeners();
}

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

function renderRecentJobs(jobsArray, roleContext) {
    const container = document.getElementById('recent-jobs-container');
    const title = document.getElementById('home-jobs-title');
    const subtitle = document.getElementById('home-jobs-subtitle');
    if (!container) return;
    
    container.innerHTML = '';

    if (roleContext === 'company') {
        if(title) title.textContent = "Your Job Postings";
        if(subtitle) subtitle.textContent = "Manage the opportunities you've posted";
    } else {
        if(title) title.textContent = "Recent Job Postings";
        if(subtitle) subtitle.textContent = "Latest opportunities from partner companies";
    }

    jobsArray.forEach(job => {
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

function renderApplications(appsArray, roleContext) {
    const container = document.getElementById('applications-container');
    const title = document.getElementById('app-section-title');
    const subtitle = document.getElementById('app-section-subtitle');
    const icon = document.getElementById('app-section-icon');
    const viewAllBtn = document.getElementById('view-all-apps-btn');
    if (!container) return;
    
    container.innerHTML = '';

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
        if(title) title.textContent = "My Applications";
        if(subtitle) subtitle.textContent = "Track your job application status";
        if(icon) icon.style.display = 'none';
        if(viewAllBtn) viewAllBtn.style.display = 'none';

        // Static layout for users per original code requirements
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

function attachDetailsListeners() {
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const jobId = parseInt(e.target.getAttribute('data-id'));
            renderJobDetails(jobId);
        });
    });
}

function renderJobDetails(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;

    const detailsContainer = document.getElementById('job-details-content');
    const requirementsList = job.skills.map(skill => `<li><span>${skill}</span></li>`).join('');
    const currentRole = document.querySelector('.role-btn.active').getAttribute('data-role');
    const isOwnCompanyPost = (currentRole === 'company' && job.company === CURRENT_LOGGED_IN_COMPANY);
    
    let appliedBanner = '';
    let actionButton = '';

    if (currentRole === 'admin') {
        actionButton = `<button class="btn-disabled" disabled>Viewing as Admin</button>`;
    } else if (isOwnCompanyPost) {
        actionButton = '';
    } else {
        appliedBanner = job.applied ? `<div class="alert-success">✓ You have already applied for this position</div>` : '';
        actionButton = job.applied ? `<button class="btn-disabled" disabled>Already Applied</button>` : `<button class="btn-apply" id="apply-now-btn" data-id="${job.id}">Apply Now</button>`;
    }

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
    navigateToDetails();
}