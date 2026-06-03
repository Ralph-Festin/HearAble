/* ==========================================================================
   user.js - Logic specific to Applicants (Users)
   ========================================================================== */

let isEditingProfile = false;

document.addEventListener('DOMContentLoaded', () => {
    renderProfile();

    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            if (isEditingProfile) {
                userProfileData.fullName = document.getElementById('edit-fullName').value;
                userProfileData.email = document.getElementById('edit-email').value;
                userProfileData.phone = document.getElementById('edit-phone').value;
                userProfileData.location = document.getElementById('edit-location').value;
                userProfileData.skills = document.getElementById('edit-skills').value;
                userProfileData.biodata = document.getElementById('edit-biodata').value;
            }
            
            isEditingProfile = !isEditingProfile;
            renderProfile();
        });
    }
});

function renderProfile() {
    const container = document.getElementById('profile-content-display');
    const editBtn = document.getElementById('edit-profile-btn');
    if (!container) return;

    // Define fields here to eliminate HTML duplication
    const fields = [
        { id: 'fullName', label: 'Full Name *', value: userProfileData.fullName, type: 'text', full: false },
        { id: 'email', label: 'Email *', value: userProfileData.email, type: 'email', full: false },
        { id: 'phone', label: 'Phone Number', value: userProfileData.phone, type: 'text', full: false },
        { id: 'location', label: 'Location', value: userProfileData.location, type: 'text', full: false },
        { id: 'skills', label: 'Skills', value: userProfileData.skills, type: 'text', full: true },
        { id: 'biodata', label: 'Biodata', value: userProfileData.biodata, isTextArea: true, full: true }
    ];

    editBtn.innerHTML = isEditingProfile ? `<span class="icon">💾</span> Save Profile` : `<span class="icon">📝</span> Edit Profile`;

    const html = fields.map(f => `
        <div class="profile-field ${f.full ? 'profile-field-full' : ''}">
            <label>${f.label}</label>
            ${isEditingProfile 
                ? (f.isTextArea 
                    ? `<textarea id="edit-${f.id}" class="search-input" rows="3">${f.value}</textarea>`
                    : `<input type="${f.type}" id="edit-${f.id}" class="search-input" value="${f.value}">`)
                : `<p>${f.value}</p>`
            }
        </div>
    `).join('');

    container.innerHTML = `<div class="profile-grid">${html}</div>`;
}

document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'apply-now-btn') {
        const isUserRoleActive = document.querySelector('.role-btn[data-role="user"]').classList.contains('active');
        
        if (!isUserRoleActive) {
            alert("Only applicants can apply for jobs. Please switch to the User role in Account Settings.");
            return;
        }

        const jobId = parseInt(e.target.getAttribute('data-id'));
        const jobIndex = jobsData.findIndex(j => j.id === jobId);
        
        if (jobIndex !== -1) {
            jobsData[jobIndex].applied = true;
            renderJobDetails(jobId); 
        }
    }
});