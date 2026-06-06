/* user.js
   Manages the interactive logic inside the Account Settings view, specifically
   toggling the profile between view mode and edit mode.
*/

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
                userProfileData.headline = document.getElementById('edit-headline').value;
            }
            
            // Flip the boolean switch
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

    // Change the primary button icon and text depending on state
    editBtn.innerHTML = isEditingProfile ? `<span class="icon">💾</span> Save Profile` : `<span class="icon">📝</span> Edit Profile`;

    if (isEditingProfile) {
        // --- EDIT MODE ---
        const fields = [
            { id: 'fullName', label: 'Full Name *', value: userProfileData.fullName, type: 'text', full: false },
            { id: 'headline', label: 'Headline', value: userProfileData.headline, type: 'text', full: false },
            { id: 'email', label: 'Email *', value: userProfileData.email, type: 'email', full: false },
            { id: 'phone', label: 'Phone Number', value: userProfileData.phone, type: 'text', full: false },
            { id: 'location', label: 'Location', value: userProfileData.location, type: 'text', full: true }
        ];

        const html = fields.map(f => `
            <div class="profile-field ${f.full ? 'profile-field-full' : ''}">
                <label>${f.label}</label>
                <input type="${f.type}" id="edit-${f.id}" class="search-input" value="${f.value}">
            </div>
        `).join('');

        container.innerHTML = `
            <div class="card">
                <div class="profile-grid">${html}</div>
            </div>
        `;

    } else {
        // --- VIEW MODE ---
        const initials = userProfileData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'JG';

        container.innerHTML = `
            <div class="card" style="text-align: center; padding-bottom: 32px;">
                <div class="avatar-lg" style="width: 120px; height: 120px; font-size: 3rem; margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                    ${initials}
                </div>
                <h2 style="font-size: 2rem; margin-bottom: 8px;">${userProfileData.fullName}</h2>
                <p style="font-size: 1.1rem; color: var(--secondary-text); margin-bottom: 12px;">${userProfileData.headline}</p>
                
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px; color: var(--secondary-text); font-weight: 500;">
                    <span>📍 ${userProfileData.location}</span>
                    <span>•</span>
                    <a href="#" id="open-contact-modal-btn" style="color: var(--blue-accent); text-decoration: none; font-weight: 600;">Contact Info</a>
                </div>
            </div>

            <div class="card">
                <div class="section-header" style="margin-bottom: 16px;">
                    <h3 style="margin: 0;">🎓 Education</h3>
                </div>
                <div class="list-item" style="padding: 0; border: none;">
                    <div class="item-content pr-0">
                        <h4 style="font-size: 1.1rem; color: var(--text-color); margin-bottom: 4px;">School of Deaf Education and Applied Studies</h4>
                        <p style="color: var(--secondary-text); margin-bottom: 0;">Applied Mathematics & Mobile Application Development</p>
                    </div>
                    <div class="item-actions">
                        <span class="timestamp" style="font-size: 0.9rem;">Batch 2026</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="section-header" style="margin-bottom: 16px;">
                    <h3 style="margin: 0;">🛠️ Skills & Technologies</h3>
                </div>
                <div class="pill-row" style="margin-bottom: 0;">
                    <span class="skill-pill">.NET MAUI</span>
                    <span class="skill-pill">C#</span>
                    <span class="skill-pill">XAML</span>
                    <span class="skill-pill">Figma</span>
                    <span class="skill-pill">UI/UX Design</span>
                </div>
            </div>
        `;

        // Attach the interactive toggles for the Popup Modal
        setTimeout(() => {
            const contactBtn = document.getElementById('open-contact-modal-btn');
            const contactModal = document.getElementById('contact-info-modal');
            const closeBtn = document.getElementById('close-contact-modal');
            
            // Populate the modal with the dynamic data
            const emailDisplay = document.getElementById('modal-email-display');
            const phoneDisplay = document.getElementById('modal-phone-display');
            if(emailDisplay) emailDisplay.textContent = userProfileData.email;
            if(phoneDisplay) phoneDisplay.textContent = userProfileData.phone || 'Not provided';

            // Open the modal
            if (contactBtn && contactModal) {
                contactBtn.addEventListener('click', (e) => {
                    e.preventDefault(); 
                    contactModal.style.display = 'flex';
                });
            }

            // Close the modal via the "X" button
            if (closeBtn && contactModal) {
                closeBtn.addEventListener('click', () => {
                    contactModal.style.display = 'none';
                });
            }

            // Close the modal if clicking on the dark background
            window.addEventListener('click', (e) => {
                if (e.target === contactModal) {
                    contactModal.style.display = 'none';
                }
            });
        }, 0);
    }
}
// Global click listener to handle "Apply Now" buttons dynamically injected into the DOM
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
            if (typeof renderJobDetails === 'function') {
                renderJobDetails(jobId); 
            }
        }
    }
});