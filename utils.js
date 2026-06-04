/* utils.js
   Contains small helper functions that can be reused anywhere in the application.
*/

// Generates a readable date string like "March 8, 2026"
function getFormattedDate(dateObj = new Date()) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
}

// Prevents overly long text descriptions from breaking card layouts by capping the length
function truncateText(text, maxLength = 120) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Converts an array of string skills into visually styled HTML tags, handling overflow cleanly
function generateSkillPillsHTML(skills, maxDisplay = 3) {
    if (!skills || skills.length === 0) return '';
    
    // Slice off only the maximum number to display
    const displaySkills = skills.slice(0, maxDisplay);
    const remaining = skills.length - maxDisplay;
    
    let html = `<div class="pill-row">`;
    html += displaySkills.map(skill => `<span class="skill-pill">${skill}</span>`).join('');
    
    // If there were more skills than allowed, create an overflow counter badge
    if (remaining > 0) {
        html += `<span class="skill-pill highlight-pill">+${remaining} more</span>`;
    }
    html += `</div>`;
    return html;
}

