/* ==========================================================================
   renderJobs.js - Job Board & Details Logic
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
            ${typeof generateCompanyProfileHTML === 'function' ? generateCompanyProfileHTML(job.company) : ''}
        </div>
    `;

    document.getElementById('close-split-view').addEventListener('click', () => {
        splitLayout.classList.remove('active-split');
        if (clickedCard) clickedCard.classList.remove('selected');
    });
}

function attachDetailsListeners() {
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const jobId = parseInt(e.target.getAttribute('data-id'));
            renderJobDetails(jobId);
        });
    });
}