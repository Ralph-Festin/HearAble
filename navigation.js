/* ==========================================================================
   navigation.js - Routing, Layout Setup, and Access Control
   ========================================================================== */

// 1. Instantly inject the HTML into the page BEFORE other scripts run
mountViews();

document.addEventListener('DOMContentLoaded', () => {
    // 2. Run your existing initialization
    updateDashboardsForCurrentRole();
    renderGraduates(graduatesData);
    renderCompanies(companiesData);
    
    setupNavigation();
    setupViewAllButton(); 
    setupBackButton();
    setupRoleSwitcher(); 
    setupSearchAndFilters();
});

// Injects the HTML strings from views.js into their respective container divs
function mountViews() {
    const homeView = document.getElementById('home-view');
    const jobsView = document.getElementById('jobs-view');
    const gradsView = document.getElementById('graduates-view');
    const compsView = document.getElementById('companies-view');
    const detailsView = document.getElementById('job-details-view');
    const accView = document.getElementById('account-view');

    if(homeView) homeView.innerHTML = ViewTemplates.home;
    if(jobsView) jobsView.innerHTML = ViewTemplates.jobs;
    if(gradsView) gradsView.innerHTML = ViewTemplates.graduates;
    if(compsView) compsView.innerHTML = ViewTemplates.companies;
    
    // For job details, we append the template so we don't overwrite the static back button in index.html, 
    // or you can just inject the whole thing:
    if(detailsView) detailsView.innerHTML = ViewTemplates.jobDetails;
    if(accView) accView.innerHTML = ViewTemplates.account;
}

// Centralized dispatcher for layout updates based on role
function updateDashboardsForCurrentRole() {
    const currentRole = document.querySelector('.role-btn.active').getAttribute('data-role');
    
    // 1. Filter Job Postings
    const displayJobs = currentRole === 'company' 
        ? jobsData.filter(job => job.company === CURRENT_LOGGED_IN_COMPANY) 
        : jobsData;
    renderJobs(displayJobs);

    // 2. Filter Recent Home Jobs
    const recentJobs = currentRole === 'company'
        ? displayJobs 
        : jobsData.slice(0, 2); 
    renderRecentJobs(recentJobs, currentRole);

    // 3. Filter Applications
    const displayApps = currentRole === 'company'
        ? applicationsData.filter(app => app.company === CURRENT_LOGGED_IN_COMPANY)
        : []; 
    renderApplications(displayApps, currentRole);
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const viewSections = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            viewSections.forEach(v => v.classList.remove('active'));
            link.classList.add('active');
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

function setupViewAllButton() {
    const viewAllBtn = document.getElementById('view-all-jobs-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            const jobsTab = document.querySelector('.nav-link[data-target="jobs-view"]');
            if (jobsTab) jobsTab.click();
        });
    }
}

function setupBackButton() {
    const backBtn = document.getElementById('back-to-jobs');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const jobsTab = document.querySelector('.nav-link[data-target="jobs-view"]');
            if (jobsTab) jobsTab.click();
        });
    }
}

function navigateToDetails() {
    document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById('job-details-view').classList.add('active');
    document.querySelector('.nav-link[data-target="jobs-view"]').classList.add('active');
}

function setupRoleSwitcher() {
    const roleButtons = document.querySelectorAll('.role-btn');
    const roleContents = document.querySelectorAll('.role-content');
    const addJobBtn = document.getElementById('add-job-btn'); 
    const adminNavLinks = document.querySelectorAll('.nav-link.admin-only');

    if (addJobBtn) addJobBtn.style.display = 'none';

    roleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
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

            if (targetRole !== 'admin') {
                const isViewingAdminPage = document.querySelector('#graduates-view.active, #companies-view.active');
                if (isViewingAdminPage) {
                    document.querySelector('.nav-link[data-target="home-view"]').click();
                }
            }
            
            updateDashboardsForCurrentRole();
        });
    });
}

function setupSearchAndFilters() {
    // 1. Job Postings Search
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

    // 2. Graduates Search
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

    // 3. New Companies Search
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