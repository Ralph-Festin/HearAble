/* ==========================================================================
   renderUsers.js - Graduates, Applicants, and Dashboard Summaries
   ========================================================================== */

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
        
        // Notice the added 'review-app-btn' class and 'data-appid' attribute below
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
                <button class="btn-outline mt-8 review-app-btn" data-appid="${app.id}" style="margin-top: 12px;">Review Application</button>
            </div>
        `;
        container.appendChild(appCard);
    });
}

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


/* ==========================================================================
   Applicant Review Modal Logic
   ========================================================================== */

function openApplicantModal(appId) {
    // 1. Find the specific application
    const app = applicationsData.find(a => a.id === parseInt(appId));
    if (!app) return;

    // 2. Cross-reference the graduatesData database to pull their course & batch info
    const gradInfo = graduatesData.find(g => g.name === app.applicantName) || { course: "SDEAS Graduate", batch: "Recent Batch" };

    // 3. Create or find the modal wrapper
    let modal = document.getElementById('dynamic-applicant-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dynamic-applicant-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
        
        // Close modal when clicking the dark background overlay
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    const skillsHTML = app.skills.map(s => `<span class="skill-pill">${s}</span>`).join('');

    // 4. Inject the profile design into the modal
    modal.innerHTML = `
        <div class="modal-content card" style="max-width: 550px; padding: 0; overflow: hidden;">
            
            <div style="position: relative; padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid var(--border-color); background-color: var(--background-color);">
                <button id="close-applicant-modal" style="position: absolute; top: 16px; right: 24px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--secondary-text); transition: color 0.2s;">✕</button>
                
                <div class="avatar-lg" style="width: 80px; height: 80px; font-size: 2.5rem; margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                    ${app.initials}
                </div>
                <h2 style="font-size: 1.75rem; margin-bottom: 4px;">${app.applicantName}</h2>
                <p style="font-size: 1rem; color: var(--secondary-text); margin-bottom: 12px;">🎓 ${gradInfo.course} • ${gradInfo.batch}</p>
                
                <div style="display: inline-block; padding: 6px 16px; background: var(--blue-bg); color: var(--blue-accent); border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
                    Applying for: ${app.jobTitle}
                </div>
            </div>

            <div style="padding: 24px 32px;">
                <div style="margin-bottom: 24px;">
                    <h4 style="margin-bottom: 12px; color: var(--text-color);">Application Info</h4>
                    <div class="profile-grid" style="margin-top: 0; gap: 16px;">
                        <div class="profile-field">
                            <label>Date Applied</label>
                            <p style="font-weight: 500;">${app.date}</p>
                        </div>
                        <div class="profile-field">
                            <label>Status</label>
                            <p><span class="status-badge ${app.status}">${app.status}</span></p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 style="margin-bottom: 12px; color: var(--text-color);">Skills & Technologies</h4>
                    <div class="pill-row" style="margin-bottom: 0;">
                        ${skillsHTML}
                    </div>
                </div>

                <div style="margin-top: 32px; display: flex; gap: 12px; border-top: 1px solid var(--border-color); padding-top: 24px;">
                    <button class="btn-outline flex-1" onclick="alert('Message feature coming soon!')">✉️ Message Candidate</button>
                    <button class="btn-black flex-1" onclick="alert('Update status feature coming soon!');">Update Status</button>
                </div>
            </div>
        </div>
    `;

    // Listen for the 'X' button click
    document.getElementById('close-applicant-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Make the modal visible
    modal.style.display = 'flex';
}

// Global click listener to catch whenever "Review Application" is clicked anywhere in the app
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('review-app-btn')) {
        const appId = e.target.getAttribute('data-appid');
        openApplicantModal(appId);
    }
});