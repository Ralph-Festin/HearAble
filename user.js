/* user.js
   Manages the interactive logic inside the Account Settings view, specifically
   toggling the profile between view mode and edit mode.
*/

// Tracks whether the user is currently editing their profile
let isEditingProfile = false;

document.addEventListener('DOMContentLoaded', () => {
    // Draw the profile on initial page load
    renderProfile();

    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            // If we are already editing and they clicked save, capture the input values
            if (isEditingProfile) {
                userProfileData.fullName = document.getElementById('edit-fullName').value;
                userProfileData.email = document.getElementById('edit-email').value;
                userProfileData.phone = document.getElementById('edit-phone').value;
                userProfileData.location = document.getElementById('edit-location').value;
                userProfileData.skills = document.getElementById('edit-skills').value;
                userProfileData.biodata = document.getElementById('edit-biodata').value;
            }
            
            // Flip the boolean switch (true becomes false, false becomes true)
            isEditingProfile = !isEditingProfile;
            
            // Redraw the profile area reflecting the new state
            renderProfile();
        });
    }
});

function renderProfile() {
    const container = document.getElementById('profile-content-display');
    const editBtn = document.getElementById('edit-profile-btn');
    if (!container) return;

    // Define the data fields to generate HTML programmatically rather than writing repetitive code
    const fields = [
        { id: 'fullName', label: 'Full Name *', value: userProfileData.fullName, type: 'text', full: false },
        { id: 'email', label: 'Email *', value: userProfileData.email, type: 'email', full: false },
        { id: 'phone', label: 'Phone Number', value: userProfileData.phone, type: 'text', full: false },
        { id: 'location', label: 'Location', value: userProfileData.location, type: 'text', full: false },
        { id: 'skills', label: 'Skills', value: userProfileData.skills, type: 'text', full: true },
        { id: 'biodata', label: 'Biodata', value: userProfileData.biodata, isTextArea: true, full: true }
    ];

    // Change the primary button icon and text depending on state
    editBtn.innerHTML = isEditingProfile ? `<span class="icon">💾</span> Save Profile` : `<span class="icon">📝</span> Edit Profile`;

    // Map over the fields array and generate HTML for each item
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

    // Inject the generated grid into the container
    container.innerHTML = `<div class="profile-grid">${html}</div>`;
}

// Global click listener to handle "Apply Now" buttons dynamically injected into the DOM
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'apply-now-btn') {
        const isUserRoleActive = document.querySelector('.role-btn[data-role="user"]').classList.contains('active');
        
        // Security block to ensure companies/admins can't apply for jobs
        if (!isUserRoleActive) {
            alert("Only applicants can apply for jobs. Please switch to the User role in Account Settings.");
            return;
        }

        const jobId = parseInt(e.target.getAttribute('data-id'));
        // Find exactly where this job lives in our data array
        const jobIndex = jobsData.findIndex(j => j.id === jobId);
        
        if (jobIndex !== -1) {
            // Update the data record
            jobsData[jobIndex].applied = true;
            // Force rendering.js to redraw the details view, which will now show the green success banner
            renderJobDetails(jobId); 
        }
    }
});