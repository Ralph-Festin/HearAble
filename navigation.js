/* ==========================================================================
   navigation.js - Routing, Layout Setup, and Access Control
   ========================================================================== */

// Inject our HTML templates into the blank index.html
mountViews();

document.addEventListener('DOMContentLoaded', () => {
    updateDashboardsForCurrentRole();
    renderGraduates(graduatesData);
    renderCompanies(companiesData);
    
    setupNavigation();
    setupViewAllButton(); 
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
   Existing Setup Functions
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

    if(homeView) homeView.innerHTML = ViewTemplates.home;
    if(jobsView) jobsView.innerHTML = ViewTemplates.jobs;
    if(gradsView) gradsView.innerHTML = ViewTemplates.graduates;
    if(compsView) compsView.innerHTML = ViewTemplates.companies;
    if(detailsView) detailsView.innerHTML = ViewTemplates.jobDetails;
    if(profileView) profileView.innerHTML = ViewTemplates.profile;
    if(switchAccountView) switchAccountView.innerHTML = ViewTemplates.switchAccount;
    if(notifView) notifView.innerHTML = ViewTemplates.notifications;
}

function updateDashboardsForCurrentRole() {
    const currentRole = document.querySelector('.role-btn.active').getAttribute('data-role');
    
    if (typeof renderHomeProfile === 'function') {
        renderHomeProfile(currentRole);
    }

    const displayJobs = currentRole === 'company' 
        ? jobsData.filter(job => job.company === CURRENT_LOGGED_IN_COMPANY) 
        : jobsData;
    
    renderJobs(displayJobs);

    const recentJobs = currentRole === 'company'
        ? displayJobs 
        : jobsData.slice(0, 2); 
    
    renderRecentJobs(recentJobs, currentRole);

    const displayApps = currentRole === 'company'
        ? applicationsData.filter(app => app.company === CURRENT_LOGGED_IN_COMPANY)
        : []; 
    renderApplications(displayApps, currentRole);
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');
            switchToView(targetId);
        });
    });
}

function setupViewAllButton() {
    const viewAllBtn = document.getElementById('view-all-jobs-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            switchToView('jobs-view');
        });
    }
}

function setupBackButton() {
    const backBtn = document.getElementById('back-to-jobs');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            switchToView('jobs-view');
        });
    }
}

function navigateToDetails() {
    switchToView('job-details-view');
}

function setupRoleSwitcher() {
    const roleButtons = document.querySelectorAll('.role-btn');
    const roleContents = document.querySelectorAll('.role-content');
    const addJobBtn = document.getElementById('add-job-btn'); 
    const adminNavLinks = document.querySelectorAll('.nav-link.admin-only');

    if (addJobBtn) addJobBtn.style.display = 'none';

    roleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            roleButtons.forEach(b => b.classList.remove('active'));
            roleContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');

            const targetRole = btn.getAttribute('data-role');
            document.getElementById(`role-content-${targetRole}`).classList.add('active');

            if (addJobBtn) {
                addJobBtn.style.display = targetRole === 'company' ? 'block' : 'none';
            }
            
            adminNavLinks.forEach(link => {
                link.style.display = targetRole === 'admin' ? 'flex' : 'none';
            });
            
            updateDashboardsForCurrentRole();

            // e.isTrusted prevents the app from auto-navigating home on page refresh
            if (e.isTrusted) {
                switchToView('home-view');
            }
        });
    });

    const defaultRoleBtn = document.querySelector('.role-btn.active');
    if (defaultRoleBtn) {
        defaultRoleBtn.click();
    }
}

function setupSearchAndFilters() {
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

function setupProfileDropdown() {
    const trigger = document.getElementById('profile-dropdown-trigger');
    const menu = document.getElementById('profile-dropdown-menu');

    if (!trigger || !menu) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); 
        menu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target)) {
            menu.classList.remove('active');
        }
    });

    const items = menu.querySelectorAll('.dropdown-item');
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            
            // Uses the URL router to open the correct pages
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