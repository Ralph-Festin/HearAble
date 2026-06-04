/* ==========================================================================
   views.js - Static HTML Templates
   ========================================================================== */

const ViewTemplates = {
    home: `
        <header class="hero">
            <h1>Welcome Back!</h1>
            <p>Discover new opportunities and track your applications</p>
        </header>

        <div class="dashboard-grid">
            <aside class="dashboard-sidebar">
                <div id="home-profile-container"></div>
            </aside>

            <div class="dashboard-main">
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
            </div>
        </div>
    `,

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
                    <input type="text" id="job-title" placeholder="Job Title (e.g., Frontend Developer)" required>
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

    jobDetails: `
        <button class="back-btn" id="back-to-jobs">← Back to Jobs</button>
        <div class="card" id="job-details-content"></div>
    `,

    // NEW: Just the profile section
    profile: `
        <header class="hero">
            <h1>My Profile</h1>
            <p>Manage your account details and view your specific settings</p>
        </header>

        <div id="role-content-user" class="role-content active">
            <div class="card-header-flex mb-20">
                <div>
                    <h2 class="details-title">Applicant Profile</h2>
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
    `,

    // NEW: Just the Account Switcher section
    switchAccount: `
        <header class="hero">
            <h1>Change Account</h1>
            <p>Switch roles to preview different dashboard features</p>
        </header>

        <div class="card role-switcher-card">
            <div class="section-header mb-16">
                <div>
                    <h3>Preview Dashboard As:</h3>
                    <p class="subtext">Select a role below</p>
                </div>
            </div>
            <div class="toggle-group">
                <button class="role-btn" data-role="user">Applicant (User)</button>
                <button class="role-btn" data-role="company">Company Partner</button>
                <button class="role-btn active" data-role="admin">System Admin</button>
            </div>
        </div>
    `,

    notifications: `
        <header class="hero">
            <div class="flex-between-center">
                <div>
                    <h1>Notifications</h1>
                    <p>Important updates regarding your applications and account</p>
                </div>
                <button class="btn-outline">Mark All as Read</button>
            </div>
        </header>

        <section class="card">
            <div>
                <div class="list-item">
                    <div class="item-content">
                        <h4 style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: var(--blue-accent); font-size: 0.8rem;">●</span> 
                            Application Update
                        </h4>
                        <p class="description" style="margin-bottom: 4px;">Your application for <strong>Frontend Developer</strong> is now under review by Tech Solutions Inc.</p>
                        <span class="timestamp">2 hours ago</span>
                    </div>
                </div>

                <div class="list-item">
                    <div class="item-content">
                        <h4 style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: var(--warning-color); font-size: 0.8rem;">●</span> 
                            Profile Reminder
                        </h4>
                        <p class="description" style="margin-bottom: 4px;">Your profile is 80% complete. Add a portfolio link to stand out to employers.</p>
                        <span class="timestamp">1 day ago</span>
                    </div>
                </div>
            </div>
        </section>
    `
};