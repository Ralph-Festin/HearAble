/* views.js
   This object acts as our dictionary of HTML templates. 
   Instead of writing HTML directly in index.html, we store it here as text strings.
   This keeps our main HTML file clean and allows JavaScript to instantly swap "pages".
*/

const ViewTemplates = {
    // The dashboard welcome screen
    home: `
        <header class="hero">
            <h1>Welcome Back!</h1>
            <p>Discover new opportunities and track your applications</p>
        </header>
        <section class="card announcements">
            <div class="section-header">
                <span class="icon-blue">📢</span>
                <div>
                    <h3>Announcements</h3>
                    <p class="subtext">Stay updated with the latest news and updates from SDEAS</p>
                </div>
            </div>
            <div class="inner-card">
                <h4>New Job Postings Available</h4>
                <p>We have added new job postings from our partner companies. Check them out on the job board!</p>
                <span class="timestamp">🕒 Posted Mar 11, 2026</span>
            </div>
        </section>
        <div class="stats-row">
            <div class="stat-card">
                <span class="stat-label">Active Applications</span>
                <span class="stat-number">7</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Available Jobs</span>
                <span class="stat-number">6</span>
            </div>
        </div>
        <section class="card">
            <div class="card-header-flex">
                <div>
                    <h3 id="home-jobs-title">Recent Job Postings</h3>
                    <p class="subtext" id="home-jobs-subtitle">Latest opportunities from partner companies</p>
                </div>
                <button class="btn-black" id="view-all-jobs-btn">View All</button>
            </div>
            <div id="recent-jobs-container"></div>
        </section>
        <section class="card">
            <div class="card-header-flex mb-20">
                <div class="flex-start-gap">
                    <span id="app-section-icon" class="icon-blue">👤</span>
                    <div>
                        <h3 id="app-section-title">My Applications</h3>
                        <p class="subtext" id="app-section-subtitle">Track your job application status</p>
                    </div>
                </div>
                <button class="btn-outline btn-sm" id="view-all-apps-btn">View All →</button>
            </div>
            <div id="applications-container"></div>
        </section>
    `,

    // The main job search and listing page
    jobs: `
        <header class="hero">
            <div class="flex-between-center">
                <div>
                    <h1>Job Postings</h1>
                    <p>Explore opportunities from SDEAS partner companies</p>
                </div>
                <button id="add-job-btn" class="btn-black">+ Add New Job</button>
            </div>
        </header>
        <div class="filter-panel">
            <div class="search-box-wrapper">
                <span class="search-icon">🔍</span>
                <input type="text" placeholder="Search jobs or companies..." class="search-input">
            </div>
            <select class="filter-select">
                <option>All Locations</option>
            </select>
            <select class="filter-select">
                <option>All Types</option>
            </select>
        </div>
        <div class="results-counter" id="results-counter">Showing 0 jobs</div>
        <div id="job-postings-container"></div>

        <div id="add-job-modal" class="modal">
            <div class="modal-content card">
                <h3>Create New Job Posting</h3>
                <form id="add-job-form">
                    <input type="text" id="job-title" placeholder="Job Title" required>
                    <input type="text" id="job-location" placeholder="Location" required>
                    <select id="job-type">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                    </select>
                    <input type="text" id="job-requirements" placeholder="Requirements (comma separated)" required>
                    <textarea id="job-desc" placeholder="Job Description" rows="4" required></textarea>
                    <div class="btn-group">
                        <button type="submit" class="btn-black flex-1">Post Job</button>
                        <button type="button" id="close-modal" class="btn-outline flex-1">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `,

    // Directory for tracking graduates
    graduates: `
        <header class="hero">
            <h1>Graduates Directory</h1>
            <p>Manage and monitor SDEAS alumni</p>
        </header>
        <section class="card">
            <div class="card-header-flex">
                <div>
                    <h3>Registered Graduates</h3>
                    <p class="subtext">Overview of all student and alumni accounts</p>
                </div>
                <div class="search-box-wrapper max-w-sm">
                    <span class="search-icon">🔍</span>
                    <input type="text" placeholder="Search by name or batch..." class="search-input">
                </div>
            </div>
            <div id="graduates-container"></div>
        </section>
    `,

    // Directory for tracking companies
    companies: `
        <header class="hero">
            <h1>Partner Companies</h1>
            <p>Manage the SDEAS partner network</p>
        </header>
        <section class="card">
            <div class="card-header-flex">
                <div>
                    <h3>Approved Partners</h3>
                    <p class="subtext">Overview of companies hiring from SDEAS</p>
                </div>
                <div class="header-actions">
                    <div class="search-box-wrapper max-w-sm">
                        <span class="search-icon">🔍</span>
                        <input type="text" id="company-search" placeholder="Search companies..." class="search-input">
                    </div>
                    <button class="btn-black">+ Add Company</button>
                </div>
            </div>
            <div id="companies-container"></div>
        </section>
    `,

    // The individual job view screen
    jobDetails: `
        <button class="back-btn" id="back-to-jobs">← Back to Jobs</button>
        <div class="card" id="job-details-content"></div>
    `,

    // Profile settings and role switching
    account: `
        <header class="hero">
            <h1>Account Settings</h1>
            <p>Manage your profile info and preferences</p>
        </header>

        <div class="card role-switcher-card">
            <div class="section-header mb-16">
                <div>
                    <h3>Preview Dashboard As:</h3>
                    <p class="subtext">Switch roles to see different account features</p>
                </div>
            </div>
            <div class="toggle-group">
                <button class="role-btn active" data-role="user">Applicant (User)</button>
                <button class="role-btn" data-role="company">Company Partner</button>
                <button class="role-btn" data-role="admin">System Admin</button>
            </div>
        </div>

        <div id="role-content-user" class="role-content active">
            <div class="card-header-flex mb-20">
                <div>
                    <h2 class="details-title">My Profile</h2>
                    <p class="subtext">Manage your personal information</p>
                </div>
                <button class="btn-black" id="edit-profile-btn">
                    <span class="icon">📝</span> Edit Profile
                </button>
            </div>
            <div class="card">
                <div class="mb-16">
                    <h3>Personal Information</h3>
                    <p class="subtext">Your profile information</p>
                </div>
                <div id="profile-content-display"></div>
            </div>
        </div>

        <div id="role-content-company" class="role-content">
            <div class="card">
                <h3>Company Profile</h3>
                <p class="subtext mb-16">Manage your SDEAS partnership details.</p>
                <div class="flex-col-gap">
                    <input type="text" class="search-input" value="Tech Solutions Inc." readonly>
                    <textarea class="search-input" rows="3" readonly>A trusted SDEAS partner company committed to providing opportunities for graduates.</textarea>
                    <button class="btn-black w-fit">Edit Company Info</button>
                </div>
            </div>
        </div>

        <div id="role-content-admin" class="role-content">
            <div class="card">
                <h3>System Administration</h3>
                <p class="subtext mb-16">Manage platform users and approve job postings.</p>
                <div class="stats-row">
                    <div class="stat-card stat-card-sm">
                        <span class="stat-label">Pending Users</span>
                        <span class="stat-number text-md">12</span>
                    </div>
                    <div class="stat-card stat-card-sm">
                        <span class="stat-label">Flagged Jobs</span>
                        <span class="stat-number text-md text-danger">2</span>
                    </div>
                </div>
                <button class="btn-outline mt-16">View System Logs</button>
            </div>
        </div>
    `
};