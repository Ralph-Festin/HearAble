/* ==========================================================================
   renderCompanies.js - Company Profiles & Directory
   ========================================================================== */

function renderCompanies(companiesArray, roleContext = 'admin') {
    const container = document.getElementById('companies-container');
    if (!container) return;
    
    container.innerHTML = '';

    companiesArray.forEach(company => {
        const compCard = document.createElement('div');
        compCard.className = 'list-item';
        
        let actionButtonHTML = '';
        if (roleContext === 'user') {
            actionButtonHTML = `<button class="btn-outline mt-8 view-company-full-btn" data-company="${company.name}">View Company Page</button>`;
        } else if (roleContext === 'admin') {
            // Changed from "Manage" to "View Profile" and added the class so Admins can click it too!
            actionButtonHTML = `<button class="btn-outline mt-8 view-company-full-btn" data-company="${company.name}">View Profile</button>`;
        }

        compCard.innerHTML = `
            <div class="applicant-info-wrapper" style="display: flex; gap: 16px; align-items: center;">
                <div class="avatar-lg" style="background: #0f172a; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                    🏢
                </div>
                <div class="item-content pr-0">
                    <h4 style="margin-bottom: 4px;">${company.name}</h4>
                    <p class="company-info" style="margin-bottom: 4px;">📍 ${company.location}</p>
                    <p class="description mb-0">Active Job Postings: <strong>${company.jobsPosted}</strong></p>
                </div>
            </div>
            <div class="item-actions">
                <span class="status-badge ${company.status}">${company.status}</span>
                ${actionButtonHTML}
            </div>
        `;
        container.appendChild(compCard);
    });
}

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