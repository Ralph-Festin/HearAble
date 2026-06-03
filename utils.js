/* ==========================================================================
   1. Shared Utility Functions
   ========================================================================== */
function getFormattedDate(dateObj = new Date()) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
}

function truncateText(text, maxLength = 120) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function generateSkillPillsHTML(skills, maxDisplay = 3) {
    if (!skills || skills.length === 0) return '';
    const displaySkills = skills.slice(0, maxDisplay);
    const remaining = skills.length - maxDisplay;
    
    let html = `<div class="pill-row">`;
    html += displaySkills.map(skill => `<span class="skill-pill">${skill}</span>`).join('');
    if (remaining > 0) {
        html += `<span class="skill-pill highlight-pill">+${remaining} more</span>`;
    }
    html += `</div>`;
    return html;
}
