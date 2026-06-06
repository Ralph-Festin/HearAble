/* ==========================================================================
   navigation.js - Routing, Layout Setup, and Access Control
   ========================================================================== */

// Inject our HTML templates into the blank index.html
mountViews();

document.addEventListener('DOMContentLoaded', () => {
    updateDashboardsForCurrentRole();
    
    // Initial renders (safe to call here, they get populated correctly by role later)
    if (typeof renderGraduates === 'function') renderGraduates(graduatesData);
    if (typeof renderCompanies === 'function') renderCompanies(companiesData);
    
    setupNavigation();
    setupViewAllButtons(); 
    setupBackButton();
    setupRoleSwitcher(); 
    setupSearchAndFilters();
    setupProfileDropdown(); 

    // ---> ROUTER: Initialize the Hash Router <---
    // Listen for anytime the URL changes (e.g., user clicks the Back button)
    window.addEventListener('hashchange', handleRouting);
    
    // Run it once immediately when the page loads to check if they refreshed on a specific page
    handleRouting(); 
});

/* ==========================================================================
   HASH ROUTER LOGIC
   ========================================================================== */
function handleRouting() {
    // Grab the text after the '#' in the URL (e.g., "jobs-view")
    let hash = window.location.hash.substring(1);

    // If there is no hash (they just typed index.html), default to the home page
    if (!hash) {
        window.location.hash = 'home-view';
        return; // Changing the hash will trigger this function again automatically
    }

    // 1. Hide all views and remove highlights from all navbar links
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    // 2. Find the view that matches the URL hash and show it
    const targetView = document.getElementById(hash);
    if (targetView) targetView.classList.add('active');

    // 3. Find the navbar button that matches the URL hash and highlight it
    const targetLink = document.querySelector(`.nav-link[data-target="${hash}"]`);
    if (targetLink) targetLink.classList.add('active');
}

/* HELPER: Now, changing a view is as simple as updating the URL! */
function switchToView(viewId) {
    window.location.hash = viewId;
}

/* ==========================================================================
   Setup Functions
   ========================================================================== */
function mountViews() {
    const homeView = document.getElementById('home-view');
    const jobsView = document.getElementById('jobs-view');
    const gradsView = document.getElementById('graduates-view');
    const compsView = document.getElementById('companies-view');
    const detailsView = document.getElementById('job-details-view');
    const profileView = document.getElementById('profile-view');
    const switchAccountView = document.getElementById('switch-account-view');
    const notifView = document.getElementById('notifications-view');
    const companyDetailsView = document.getElementById('company-details-view');

    if(homeView) homeView.innerHTML = ViewTemplates.home;
    if(jobsView) jobsView.innerHTML = ViewTemplates.jobs;
    if(gradsView) gradsView.innerHTML = ViewTemplates.graduates;
    if(compsView) compsView.innerHTML = ViewTemplates.companies;
    if(detailsView) detailsView.innerHTML = ViewTemplates.jobDetails;
    if(profileView) profileView.innerHTML = ViewTemplates.profile;
    if(switchAccountView) switchAccountView.innerHTML = ViewTemplates.switchAccount;
    if(notifView) notifView.innerHTML = ViewTemplates.notifications;
    if(companyDetailsView) companyDetailsView.innerHTML = ViewTemplates.companyDetails;
}

function updateDashboardsForCurrentRole() {
    // Check which role button is currently active
    const roleBtn = document.querySelector('.role-btn.active');
    if (!roleBtn) return;
    
    const currentRole = roleBtn.getAttribute('data-role');
    
    // 1. Update Home Profile Widget
    if (typeof renderHomeProfile === 'function') {
        renderHomeProfile(currentRole);
    }

    // 2. Update Jobs View (Companies only see their own jobs)
    const displayJobs = currentRole === 'company' 
        ? jobsData.filter(job => job.company === CURRENT_LOGGED_IN_COMPANY) 
        : jobsData;
    if (typeof renderJobs === 'function') renderJobs(displayJobs);

    // 3. Update Home Recent Jobs Widget
    const recentJobs = currentRole === 'company'
        ? displayJobs 
        : jobsData.slice(0, 2); 
    if (typeof renderRecentJobs === 'function') renderRecentJobs(recentJobs, currentRole);

    // 4. Update Home Applications Widget (Companies only see their applicants)
    const displayApps = currentRole === 'company'
        ? applicationsData.filter(app => app.company === CURRENT_LOGGED_IN_COMPANY)
        : []; 
    if (typeof renderApplications === 'function') renderApplications(displayApps, currentRole);

    // 5. Update the shared "Graduates/Applicants" page dynamically
    const gradsTitle = document.querySelector('#graduates-view h3');
    const gradsSubtext = document.querySelector('#graduates-view .subtext');
    
    if (currentRole === 'company') {
        // Morph the page into the Company Applicants view
        if (gradsTitle) gradsTitle.textContent = "Job Applicants";
        if (gradsSubtext) gradsSubtext.textContent = "Review candidates who applied to your postings";
        if (typeof renderCompanyApplicantsPage === 'function') {
            renderCompanyApplicantsPage(displayApps);
        }
    } else if (currentRole === 'admin') {
        // Morph the page into the Admin Manage Users view
        if (gradsTitle) gradsTitle.textContent = "Registered Graduates";
        if (gradsSubtext) gradsSubtext.textContent = "Overview of all student and alumni accounts";
        if (typeof renderGraduates === 'function') {
            renderGraduates(graduatesData);
        }
    }

    // 6. Update the Companies View with role context
    // This passes the currentRole so we know whether to show the "Manage" or "View Profile" buttons
    if (typeof renderCompanies === 'function') {
        renderCompanies(companiesData, currentRole);
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');
            if (targetId) switchToView(targetId);
        });
    });
}

function setupViewAllButtons() {
    const viewAllJobsBtn = document.getElementById('view-all-jobs-btn');
    if (viewAllJobsBtn) {
        viewAllJobsBtn.addEventListener('click', () => switchToView('jobs-view'));
    }
    
    // Wire up the "View All Applications" button on the Company home dashboard
    const viewAllAppsBtn = document.getElementById('view-all-apps-btn');
    if (viewAllAppsBtn) {
        viewAllAppsBtn.addEventListener('click', () => {
            const currentRole = document.querySelector('.role-btn.active').getAttribute('data-role');
            if (currentRole === 'company') switchToView('graduates-view'); // Takes them to their applicants page
        });
    }
}

function setupBackButton() {
    const backBtn = document.getElementById('back-to-jobs');
    if (backBtn) {
        backBtn.addEventListener('click', () => switchToView('jobs-view'));
    }
}

function setupRoleSwitcher() {
    // 1. Grab our buttons and content areas
    const roleButtons = document.querySelectorAll('.role-btn');
    const roleContents = document.querySelectorAll('.role-content');
    
    // Grab the action buttons we need to hide/show
    const addJobBtn = document.getElementById('add-job-btn'); 
    const addCompanyBtn = document.getElementById('add-company-btn'); 
    
    // Grab all our role-specific navigation links
    const adminNavLinks = document.querySelectorAll('.nav-link.admin-only');
    const userNavLinks = document.querySelectorAll('.nav-link.user-only');
    const companyNavLinks = document.querySelectorAll('.nav-link.company-only');

    // Default safety: hide the add job button on load
    if (addJobBtn) addJobBtn.style.display = 'none';

    // 2. Attach click listeners to the Switch Account buttons
    roleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active classes from all buttons and content panels
            roleButtons.forEach(b => b.classList.remove('active'));
            roleContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to the clicked button
            btn.classList.add('active');

            const targetRole = btn.getAttribute('data-role');
            
            // Show corresponding profile settings content (in the Switch Account view)
            const targetContent = document.getElementById(`role-content-${targetRole}`);
            if (targetContent) targetContent.classList.add('active');

            // --- PERMISSION TOGGLES ---
            
            // 1. Toggle Action Buttons
            if (addJobBtn) {
                addJobBtn.style.display = targetRole === 'company' ? 'block' : 'none';
            }
            if (addCompanyBtn) {
                addCompanyBtn.style.display = targetRole === 'admin' ? 'block' : 'none';
            }
            
            // 2. Toggle Navigation Links
            adminNavLinks.forEach(link => { link.style.display = targetRole === 'admin' ? 'flex' : 'none'; });
            userNavLinks.forEach(link => { link.style.display = targetRole === 'user' ? 'flex' : 'none'; });
            companyNavLinks.forEach(link => { link.style.display = targetRole === 'company' ? 'flex' : 'none'; });
            
            // 3. Force the application to redraw data based on the new role
            updateDashboardsForCurrentRole();

            // e.isTrusted checks if a real human clicked the button. 
            // This prevents the app from auto-navigating to the home page if we trigger a silent click on page refresh
            if (e.isTrusted) {
                switchToView('home-view');
            }
        });
    });

    // Trigger a fake click on the default active role so the app sets itself up correctly when you first load the website
    const defaultRoleBtn = document.querySelector('.role-btn.active');
    if (defaultRoleBtn) {
        defaultRoleBtn.click();
    }
}

function setupSearchAndFilters() {
    // 1. Search Logic for Jobs Page
    const jobSearchInput = document.querySelector('#jobs-view .search-input');
    if (jobSearchInput) {
        jobSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const currentRole = document.querySelector('.role-btn.active').getAttribute('data-role');
            
            let baseJobs = currentRole === 'company' 
                ? jobsData.filter(job => job.company === CURRENT_LOGGED_IN_COMPANY)
                : jobsData;

            const filteredJobs = baseJobs.filter(job => 
                job.title.toLowerCase().includes(searchTerm) || 
                job.company.toLowerCase().includes(searchTerm) ||
                job.description.toLowerCase().includes(searchTerm)
            );

            if (typeof renderJobs === 'function') renderJobs(filteredJobs);
        });
    }

    // 2. Search Logic for Graduates/Applicants Page
    const gradSearchInput = document.querySelector('#graduates-view .search-input');
    if (gradSearchInput) {
        gradSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const currentRole = document.querySelector('.role-btn.active').getAttribute('data-role');
            
            if (currentRole === 'company') {
                // Companies search through their applicants
                const companyApps = applicationsData.filter(app => app.company === CURRENT_LOGGED_IN_COMPANY);
                const filteredApps = companyApps.filter(app => 
                    app.applicantName.toLowerCase().includes(searchTerm) || 
                    app.jobTitle.toLowerCase().includes(searchTerm)
                );
                if (typeof renderCompanyApplicantsPage === 'function') renderCompanyApplicantsPage(filteredApps);
            } else {
                // Admins search through the global database of graduates
                const filteredGrads = graduatesData.filter(user => 
                    user.name.toLowerCase().includes(searchTerm) || 
                    user.course.toLowerCase().includes(searchTerm) || 
                    user.batch.toLowerCase().includes(searchTerm)
                );
                if (typeof renderGraduates === 'function') renderGraduates(filteredGrads);
            }
        });
    }

    // 3. Search Logic for Companies Page
    const companySearchInput = document.querySelector('#company-search');
    if (companySearchInput) {
        companySearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredCompanies = companiesData.filter(company => 
                company.name.toLowerCase().includes(searchTerm) || 
                company.location.toLowerCase().includes(searchTerm)
            );
            if (typeof renderCompanies === 'function') renderCompanies(filteredCompanies);
        });
    }
}

function setupProfileDropdown() {
    const trigger = document.getElementById('profile-dropdown-trigger');
    const menu = document.getElementById('profile-dropdown-menu');

    if (!trigger || !menu) return;

    // Toggle dropdown when clicking the avatar
    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); 
        menu.classList.toggle('active');
    });

    // Close the dropdown if the user clicks anywhere else on the screen
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target)) {
            menu.classList.remove('active');
        }
    });

    // Handle clicks on individual dropdown items
    const items = menu.querySelectorAll('.dropdown-item');
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            
            // Route to correct views based on the action
            if (action === 'view-profile') {
                switchToView('profile-view');
            } else if (action === 'switch-account') {
                switchToView('switch-account-view');
            } else if (action === 'sign-out') {
                alert('Logging out of HearAble...');
            }
            
            menu.classList.remove('active');
        });
    });
}