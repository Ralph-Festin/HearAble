/* ==========================================================================
   modals.js - Add Job Form Submission Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    const modal = document.getElementById('add-job-modal');
    const openModalBtn = document.getElementById('add-job-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const addJobForm = document.getElementById('add-job-form');

    if (openModalBtn) openModalBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    
    window.addEventListener('click', (e) => { 
        if (e.target === modal) modal.style.display = 'none'; 
    });

    if (addJobForm) {
        addJobForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const formDesc = document.getElementById('job-desc').value;
            const reqsInput = document.getElementById('job-requirements').value;
            
            const skillsArray = reqsInput.split(',').map(skill => skill.trim()).filter(skill => skill !== "");

            const newJob = {
                id: Date.now(), 
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

            // Add to data store and update UI
            jobsData.unshift(newJob); 
            renderJobs();
            renderRecentJobs(); 

            modal.style.display = 'none';
            this.reset(); 
        });
    }

});