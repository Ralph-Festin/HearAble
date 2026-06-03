/* modals.js
   Handles all logic related to opening, closing, and submitting the Add Job popup.
*/

document.addEventListener('DOMContentLoaded', () => {

    // Grab elements by their IDs
    const modal = document.getElementById('add-job-modal');
    const openModalBtn = document.getElementById('add-job-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const addJobForm = document.getElementById('add-job-form');

    // Make the modal overlay visible on click
    if (openModalBtn) openModalBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
    
    // Hide the modal overlay on cancel
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    
    // Close the modal if the user clicks the dark background outside of the white card
    window.addEventListener('click', (e) => { 
        if (e.target === modal) modal.style.display = 'none'; 
    });

    // Handle the actual form submission
    if (addJobForm) {
        addJobForm.addEventListener('submit', function(e) {
            // Prevent the browser from refreshing the page when submitting the form
            e.preventDefault(); 

            // Extract values typed by the user
            const formDesc = document.getElementById('job-desc').value;
            const reqsInput = document.getElementById('job-requirements').value;
            
            // Clean up the skills input by splitting commas and stripping out extra spaces
            const skillsArray = reqsInput.split(',').map(skill => skill.trim()).filter(skill => skill !== "");

            // Construct a new job data object structured exactly like the ones in data.js
            const newJob = {
                id: Date.now(), // Uses current timestamp as a unique ID
                title: document.getElementById('job-title').value,
                company: CURRENT_LOGGED_IN_COMPANY, 
                location: document.getElementById('job-location').value,
                type: document.getElementById('job-type').value,
                description: formDesc,
                skills: skillsArray.length > 0 ? skillsArray : ["No specific requirements listed"],
                companyBio: "A valued partner company looking for fresh talent from the SDEAS program.",
                date: getFormattedDate(), 
                applied: false 
            };

            // Unshift adds the new job to the very top of our data array
            jobsData.unshift(newJob); 
            
            // Ping navigation.js to force a re-draw so the new job instantly appears on screen
            if (typeof updateDashboardsForCurrentRole === 'function') {
                updateDashboardsForCurrentRole();
            }

            // Hide the popup and clear out the form fields for next time
            modal.style.display = 'none';
            this.reset(); 
        });
    }
});