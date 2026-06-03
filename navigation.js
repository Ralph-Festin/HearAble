/* navigation.js 
   This is the brain of the application. It handles filling the screen with HTML,
   deciding which data to show based on the user's role, and setting up all the click events.
*/

// Before anything else happens, we inject our HTML templates into the blank index.html
mountViews();

// DOMContentLoaded ensures the browser has finished reading the HTML before we try to modify it
document.addEventListener('DOMContentLoaded', () => {
    // Generate the initial UI state based on whatever role is currently active
    updateDashboardsForCurrentRole();
    renderGraduates(graduatesData);
    renderCompanies(companiesData);
    
    // Attach event listeners to make buttons and search bars interactive
    setupNavigation();
    setupViewAllButton(); 
    setupBackButton();
    setupRoleSwitcher(); 
    setupSearchAndFilters();
});

// Takes the string templates from views.js and inserts them into the empty containers
function mountViews() {
    const homeView = document.getElementById('home-view');
    const jobsView = document.getElementById('jobs-view');
    const gradsView = document.getElementById('graduates-view');
    const compsView = document.getElementById('companies-view');
    const detailsView = document.getElementById('job-details-view');
    const accView = document.getElementById('account-view');

    // We check if the element exists before trying to modify it to prevent errors
    if(homeView) homeView.innerHTML = ViewTemplates.home;
    if(jobsView) jobsView.innerHTML = ViewTemplates.jobs;
    if(gradsView) gradsView.innerHTML = ViewTemplates.graduates;
    if(compsView) compsView.innerHTML = ViewTemplates.companies;
    if(detailsView) detailsView.innerHTML = ViewTemplates.jobDetails;
    if(accView) accView.innerHTML = ViewTemplates.account;
}

// Looks at the currently selected role and figures out what data should be displayed
function updateDashboardsForCurrentRole() {
    // Finds the button with the 'active' class to determine the current role
    const currentRole = document.querySelector('.role-btn.active').getAttribute('data-role');
    
    // Filters the job list. Companies only see their own jobs, everyone else sees all jobs.
    const displayJobs = currentRole === 'company' 
        ? jobsData.filter(job => job.company === CURRENT_LOGGED_IN_COMPANY) 
        : jobsData;
    
    // Passes the filtered list to the drawing function
    renderJobs(displayJobs);

    // Determines what goes on the home screen. Companies see their full list, users see the top few.
    const recentJobs = currentRole === 'company'
        ? displayJobs 
        : jobsData.slice(0, 2); 
    
    // Passes the filtered home list and the role context to adjust titles
    renderRecentJobs(recentJobs, currentRole);

    // Filters applicant data. Companies only see people who applied to them.
    const displayApps = currentRole === 'company'
        ? applicationsData.filter(app => app.company === CURRENT_LOGGED_IN_COMPANY)
        : []; 
    renderApplications(displayApps, currentRole);
}

// Handles switching between main tabs (Home, Jobs, Account)
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const viewSections = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove the 'active' class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            viewSections.forEach(v => v.classList.remove('active'));
            
            // Add 'active' back to only the link that was clicked
            link.classList.add('active');
            
            // Find the target section ID stored in the button's data attribute and make it visible
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Helper to switch to the jobs tab when clicking a "View All" button
function setupViewAllButton() {
    const viewAllBtn = document.getElementById('view-all-jobs-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            // Simulates a click on the actual navigation link to trigger the view change
            const jobsTab = document.querySelector('.nav-link[data-target="jobs-view"]');
            if (jobsTab) jobsTab.click();
        });
    }
}

// Helper to return to the jobs list from the detailed view
function setupBackButton() {
    const backBtn = document.getElementById('back-to-jobs');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const jobsTab = document.querySelector('.nav-link[data-target="jobs-view"]');
            if (jobsTab) jobsTab.click();
        });
    }
}

// Manually forces the application to display the job details screen
function navigateToDetails() {
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    document.getElementById('job-details-view').classList.add('active');
    document.querySelector('.nav-link[data-target="jobs-view"]').classList.add('active');
}

// Handles the logic when a user changes their role preview in Account Settings
function setupRoleSwitcher() {
    const roleButtons = document.querySelectorAll('.role-btn');
    const roleContents = document.querySelectorAll('.role-content');
    const addJobBtn = document.getElementById('add-job-btn'); 
    const adminNavLinks = document.querySelectorAll('.nav-link.admin-only');

    // Default the 'Add Job' button to hidden
    if (addJobBtn) addJobBtn.style.display = 'none';

    roleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Visual toggle to highlight the active button
            roleButtons.forEach(b => b.classList.remove('active'));
            roleContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');

            // Show the correct settings panel based on the selected role
            const targetRole = btn.getAttribute('data-role');
            document.getElementById(`role-content-${targetRole}`).classList.add('active');

            // Only companies are allowed to post jobs
            if (addJobBtn) {
                addJobBtn.style.display = targetRole === 'company' ? 'block' : 'none';
            }
            
            // Only admins get to see the Graduates and Companies links in the navbar
            adminNavLinks.forEach(link => {
                link.style.display = targetRole === 'admin' ? 'flex' : 'none';
            });

            // Security catch: If someone is on an admin page and switches to a standard user, boot them to home
            if (targetRole !== 'admin') {
                const isViewingAdminPage = document.querySelector('#graduates-view.active, #companies-view.active');
                if (isViewingAdminPage) {
                    document.querySelector('.nav-link[data-target="home-view"]').click();
                }
            }
            
            // Recalculate what data should be shown across the entire app
            updateDashboardsForCurrentRole();
        });
    });
}

// Connects typing in search bars to filtering the data arrays
function setupSearchAndFilters() {
    const jobSearchInput = document.querySelector('#jobs-view .search-input');
    if (jobSearchInput) {
        // Triggers every time a letter is typed
        jobSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const currentRole = document.querySelector('.role-btn.active').getAttribute('data-role');
            
            // Base the search pool on the current role
            let baseJobs = currentRole === 'company' 
                ? jobsData.filter(job => job.company === CURRENT_LOGGED_IN_COMPANY)
                : jobsData;

            // Filter the pool looking for matches in title, company, or description
            const filteredJobs = baseJobs.filter(job => 
                job.title.toLowerCase().includes(searchTerm) || 
                job.company.toLowerCase().includes(searchTerm) ||
                job.description.toLowerCase().includes(searchTerm)
            );

            // Ask rendering.js to redraw the screen with only the matches
            renderJobs(filteredJobs);
        });
    }

    const gradSearchInput = document.querySelector('#graduates-view .search-input');
    if (gradSearchInput) {
        gradSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredGrads = graduatesData.filter(user => 
                user.name.toLowerCase().includes(searchTerm) || 
                user.course.toLowerCase().includes(searchTerm) || 
                user.batch.toLowerCase().includes(searchTerm)
            );
            renderGraduates(filteredGrads);
        });
    }

    const companySearchInput = document.querySelector('#company-search');
    if (companySearchInput) {
        companySearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredCompanies = companiesData.filter(company => 
                company.name.toLowerCase().includes(searchTerm) || 
                company.location.toLowerCase().includes(searchTerm)
            );
            renderCompanies(filteredCompanies);
        });
    }
}