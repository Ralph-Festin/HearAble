/* ==========================================================================
   rendering.js - UI Generation Logic
   ========================================================================== */

/* Draws the main list of jobs on the Job Postings page. */
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

/* Draws the list of graduates for the Admin view. */
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

/* Draws the list of approved companies. Adjusts actions based on role. */
function renderCompanies(companiesArray, roleContext = 'admin') {
    const container = document.getElementById('companies-container');
    if (!container) return;
    
    container.innerHTML = '';

    companiesArray.forEach(company => {
        const compCard = document.createElement('div');
        compCard.className = 'list-item';
        
        // Change the button depending on who is logged in
        let actionButtonHTML = '';
        if (roleContext === 'user') {
            // Reuses the class and data attribute that triggers our full-page view!
            actionButtonHTML = `<button class="btn-outline mt-8 view-company-full-btn" data-company="${company.name}">View Profile</button>`;
        } else if (roleContext === 'admin') {
            actionButtonHTML = `<button class="btn-outline mt-8">Manage</button>`;
        }

        compCard.innerHTML = `
            <div class="item-content">
                <h4>${company.name}</h4>
                <p class="company-info">📍 ${company.location}</p>
                <p class="description mb-0">Active Job Postings: <strong>${company.jobsPosted}</strong></p>
            </div>
            <div class="item-actions">
                <span class="status-badge ${company.status}">${company.status}</span>
                ${actionButtonHTML}
            </div>
        `;
        container.appendChild(compCard);
    });
}

/* Draws the abbreviated list of jobs shown on the Home dashboard. */
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

/* Draws the user's application history on the Home Dashboard. */
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

/* Draws the list of job applicants for the Company's dedicated Applicants page. */
function renderCompanyApplicantsPage(appsArray) {
    const container = document.getElementById('graduates-container');
    if (!container) return;
    
    container.innerHTML = '';

    if (appsArray.length === 0) {
        container.innerHTML = '<p style="color: var(--secondary-text); padding: 16px 0;">No applications received yet.</p>';
        return;
    }

    appsArray.forEach(app => {
        const skillsHTML = generateSkillPillsHTML(app.skills, 4);
        const appCard = document.createElement('div');
        appCard.className = 'applicant-card';
        
        appCard.innerHTML = `
            <div class="applicant-info-wrapper">
                <div class="avatar-lg">${app.initials}</div>
                <div class="applicant-details">
                    <h4 style="font-size: 1.15rem; color: var(--text-color); margin-bottom: 4px;">${app.applicantName}</h4>
                    <div class="job-title" style="color: var(--primary-color); font-weight: 500;">Applying for: ${app.jobTitle}</div>
                    <div class="applied-date">📅 Applied ${app.date}</div>
                    ${skillsHTML}
                </div>
            </div>
            <div class="item-actions">
                <span class="status-badge ${app.status}">${app.status}</span>
                <button class="btn-outline mt-8" style="margin-top: 12px;">Review Application</button>
            </div>
        `;
        container.appendChild(appCard);
    });
}

/* Draws the dynamic profile card on the Home dashboard. */
function renderHomeProfile(roleContext) {
    const container = document.getElementById('home-profile-container');
    if (!container) return;

    if (roleContext === 'user') {
        const initials = userProfileData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'JG';
        container.innerHTML = `
            <div class="card profile-summary-card">
                <div class="avatar-lg">${initials}</div>
                <h3 style="margin-top: 12px;">${userProfileData.fullName}</h3>
                <p class="subtext">${userProfileData.headline}</p>
                <hr>
                <div class="profile-meta">
                    <p><strong>📍 Location</strong> ${userProfileData.location}</p>
                </div>
                <button class="btn-outline w-full" style="margin-top: 16px;" onclick="switchToView('profile-view')">
                    Edit Profile
                </button>
            </div>
        `;
    } else if (roleContext === 'company') {
        container.innerHTML = `
            <div class="card profile-summary-card">
                <div class="avatar-lg" style="background: #0f172a;">🏢</div>
                <h3 style="margin-top: 12px;">${CURRENT_LOGGED_IN_COMPANY}</h3>
                <p class="subtext">SDEAS Partner Company</p>
                <hr>
                <div class="profile-meta">
                    <p><strong>📍 Location</strong> Manila, Philippines</p>
                    <p><strong>💼 Active Postings</strong> ${jobsData.filter(job => job.company === CURRENT_LOGGED_IN_COMPANY).length}</p>
                </div>
                <button class="btn-outline w-full" style="margin-top: 16px;" onclick="switchToView('profile-view')">
                    Edit Profile
                </button>
            </div>
        `;
    } else if (roleContext === 'admin') {
        container.innerHTML = `
            <div class="card profile-summary-card">
                <div class="avatar-lg" style="background: #ef4444;">🛡️</div>
                <h3 style="margin-top: 12px;">System Admin</h3>
                <p class="subtext">Platform Management</p>
                <hr>
                <div class="profile-meta">
                    <p><strong>👥 Total Users</strong> ${graduatesData.length}</p>
                    <p><strong>🏢 Partners</strong> ${companiesData.length}</p>
                </div>
                <button class="btn-outline w-full" style="margin-top: 16px;" onclick="switchToView('graduates-view')">
                    Manage Platform
                </button>
            </div>
        `;
    }
}

/* Binds click events to "View Details" buttons. */
function attachDetailsListeners() {
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const jobId = parseInt(e.target.getAttribute('data-id'));
            renderJobDetails(jobId);
        });
    });
}

/* Generates the embedded Company Profile card. */
function generateCompanyProfileHTML(companyName) {
    const companyProfile = companiesData.find(c => c.name === companyName);
    
    if (!companyProfile) {
        return `
            <div class="company-card">
                <h5>${companyName}</h5>
                <p>Company information currently unavailable.</p>
            </div>
        `;
    }

    return `
        <div class="company-card company-profile-embedded">
            <div class="flex-between-center mb-8" style="margin-bottom: 8px;">
                <h5 style="margin: 0;">🏢 ${companyProfile.name}</h5>
                <span class="tag">${companyProfile.industry || 'Technology'}</span>
            </div>
            <p class="company-info" style="margin-bottom: 8px;">📍 ${companyProfile.location} • 🌐 ${companyProfile.website || 'No website provided'}</p>
            <p class="company-desc" style="margin-bottom: 16px;">${companyProfile.bio}</p>
            <button class="btn-outline btn-sm view-company-full-btn" data-company="${companyProfile.name}" style="width: 100%;">View Full Company Page</button>
        </div>
    `;
}

/* Builds the Master-Detail split view for a job posting. */
function renderJobDetails(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;

    if (typeof switchToView === 'function') {
        switchToView('jobs-view');
    }

    const splitLayout = document.getElementById('jobs-split-layout');
    const detailsColumn = document.getElementById('job-details-column');
    
    if (splitLayout) splitLayout.classList.add('active-split');

    document.querySelectorAll('.job-board-item').forEach(card => card.classList.remove('selected'));
    const clickedCard = document.querySelector(`.view-details-btn[data-id="${jobId}"]`)?.closest('.job-board-item');
    if (clickedCard) clickedCard.classList.add('selected');

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

    detailsColumn.innerHTML = `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
            <button id="close-split-view" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--secondary-text); transition: color 0.2s;">✕</button>
        </div>
        
        <div class="card">
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
            
            <div class="action-footer">
                ${actionButton}
            </div>
        </div>
        
        <div class="card">
            <div class="section-header" style="margin-bottom: 16px;">
                <h3 style="margin: 0;">About the Company</h3>
            </div>
            ${generateCompanyProfileHTML(job.company)}
        </div>
    `;

    document.getElementById('close-split-view').addEventListener('click', () => {
        splitLayout.classList.remove('active-split');
        if (clickedCard) clickedCard.classList.remove('selected');
    });
}

/* ==========================================================================
   Full Page Company Profile Logic
   ========================================================================== */
function renderCompanyFullProfile(companyName) {
    const company = companiesData.find(c => c.name === companyName);
    if (!company) return;

    const companyJobs = jobsData.filter(j => j.company === company.name);
    
    const jobsListHTML = companyJobs.map(job => `
        <div class="job-board-item" style="padding: 20px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h5 style="margin-bottom: 4px; font-size: 1.1rem; color: var(--text-color);">${job.title}</h5>
                    <p style="font-size: 0.9rem; color: var(--secondary-text); margin-bottom: 0;">📍 ${job.location} • 💼 ${job.type}</p>
                </div>
                <button class="btn-outline view-details-btn" data-id="${job.id}">View Job</button>
            </div>
        </div>
    `).join('') || '<p style="color: var(--secondary-text);">No active postings at this time.</p>';

    const container = document.getElementById('company-details-content');
    if (!container) return;

    container.innerHTML = `
        <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 32px;">
            <div style="padding: 48px 32px 32px 32px; text-align: center; border-bottom: 1px solid var(--border-color); background-color: var(--background-color);">
                <div class="avatar-lg" style="width: 120px; height: 120px; font-size: 3rem; margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #0f172a;">
                    🏢
                </div>
                <h2 style="font-size: 2.25rem; margin-bottom: 8px;">${company.name}</h2>
                <p style="font-size: 1.15rem; color: var(--secondary-text); margin-bottom: 16px;">${company.industry || 'Technology'}</p>
                <div style="display: flex; justify-content: center; gap: 24px; font-size: 1rem; color: var(--secondary-text); font-weight: 500;">
                    <span>📍 ${company.location}</span>
                    <span>🌐 ${company.website || 'No website available'}</span>
                </div>
            </div>

            <div style="padding: 32px;">
                <div style="margin-bottom: 40px;">
                    <h3 style="margin-bottom: 12px; font-size: 1.25rem;">About Us</h3>
                    <p style="font-size: 1.05rem; color: var(--secondary-text); line-height: 1.7;">${company.bio}</p>
                </div>
                
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="margin: 0; font-size: 1.25rem;">Active Postings</h3>
                        <span class="tag">${companyJobs.length} Roles</span>
                    </div>
                    ${jobsListHTML}
                </div>
            </div>
        </div>
    `;

    if (typeof switchToView === 'function') {
        switchToView('company-details-view');
    }
    
    if (typeof attachDetailsListeners === 'function') {
        attachDetailsListeners();
    }
}

// Global click listener for navigating to full company profiles
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('view-company-full-btn')) {
        const companyName = e.target.getAttribute('data-company');
        renderCompanyFullProfile(companyName);
    }
});