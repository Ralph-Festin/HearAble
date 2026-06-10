/* ==========================================================================
   views.js - Static HTML Templates
   ========================================================================== */

const ViewTemplates = {
home: `
        <div class="dashboard-grid" style="margin-top: 24px;">
            <aside class="dashboard-sidebar">
                <div id="home-profile-container"></div>
            </aside>

            <div class="dashboard-main">
                <section class="card">
                    <div class="card-header-flex" style="margin-bottom: 16px;">
                        <h3 id="home-jobs-title" style="margin: 0;">Recent Job Postings</h3>
                    </div>
                    
                    <div id="recent-jobs-container"></div>
                    
                    <div style="margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 16px;">
                        <button class="btn-outline w-full" id="view-all-jobs-btn">View All Jobs</button>
                    </div>
                </section>

                <section class="card">
                    <div class="card-header-flex mb-20">
                        <div class="flex-start-gap">
                            <span id="app-section-icon" class="icon-blue">👤</span>
                            <h3 id="app-section-title" style="margin: 0;">My Applications</h3>
                        </div>
                        <button class="btn-outline btn-sm" id="view-all-apps-btn">View All →</button>
                    </div>
                    <div id="applications-container"></div>
                </section>
            </div>
        </div>
    `,

    jobs: `
        <!-- Removed Job Board text, kept the button aligned to the right -->
        <div style="display: flex; justify-content: flex-end;">
            <button class="btn-black" id="add-job-btn" style="display: none; margin-bottom: 24px;">+ Post a Job</button>
        </div>

        <div id="jobs-split-layout" class="jobs-split-layout">
            <div class="jobs-list-column">
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
            </div>

            <div id="job-details-column" class="job-details-column"></div>
        </div>

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
        <section class="card">
            <!-- Removed text, allowed search bar to stretch natively -->
            <div class="card-header-flex" style="justify-content: flex-end; margin-bottom: 24px;">
                <div class="search-box-wrapper" style="width: 100%;">
                    <span class="search-icon">🔍</span>
                    <input type="text" placeholder="Search by name or batch..." class="search-input">
                </div>
            </div>
            <div id="graduates-container"></div>
        </section>
    `,

    companies: `
        <section class="card">
            <!-- Removed text, allowed search bar to stretch natively -->
            <div class="card-header-flex" style="justify-content: flex-end; margin-bottom: 24px;">
                <div class="header-actions" style="width: 100%; display: flex; gap: 12px; align-items: center;">
                    <div class="search-box-wrapper" style="flex: 1;">
                        <span class="search-icon">🔍</span>
                        <input type="text" id="company-search" placeholder="Search companies..." class="search-input">
                    </div>
                    <button class="btn-black" id="add-company-btn">+ Add Company</button>
                </div>
            </div>
            <div id="companies-container"></div>
        </section>
    `,

    companyDetails: `
        <button class="back-btn" onclick="window.history.back()">← Back</button>
        <div id="company-details-content"></div>
    `,

    jobDetails: `
        <button class="back-btn" id="back-to-jobs">← Back to Jobs</button>
        <!-- Removed the 'card' class here so we can inject multiple cards -->
        <div id="job-details-content"></div>
    `,
    profile: `
        <div id="role-content-user" class="role-content active" style="margin-top: 24px;">
            <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
                <button class="btn-black" id="edit-profile-btn">
                    <span class="icon">📝</span> Edit Profile
                </button>
            </div>
            
            <div id="profile-content-display"></div>

            <div id="contact-info-modal" class="modal">
                <div class="modal-content card" style="max-width: 400px; gap: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                        <h3 style="margin: 0;">Contact Information</h3>
                        <button id="close-contact-modal" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--secondary-text);">✕</button>
                    </div>
                    <div class="profile-field">
                        <label>Email Address</label>
                        <p style="font-weight: 500; color: var(--text-color);" id="modal-email-display"></p>
                    </div>
                    <div class="profile-field">
                        <label>Phone Number</label>
                        <p style="font-weight: 500; color: var(--text-color);" id="modal-phone-display"></p>
                    </div>
                </div>
            </div>
        </div>

        <div id="role-content-company" class="role-content" style="margin-top: 24px;">
            <div class="card">
                <!-- Edit Button Header -->
                <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
                    <button class="btn-black" id="edit-company-profile-btn">
                        <span class="icon">📝</span> Edit Profile
                    </button>
                </div>
                
                <!-- Company Profile Display -->
                <div id="company-profile-content-display">
                    <!-- Hero Section -->
                    <div style="text-align: center; padding-bottom: 16px;">
                        <div class="avatar-lg" style="width: 120px; height: 120px; font-size: 3rem; margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #0f172a;">
                            🏢
                        </div>
                        <h2 style="font-size: 2rem; margin-bottom: 8px;">Tech Solutions Inc.</h2>
                        <p style="font-size: 1.1rem; color: #64748b; margin-bottom: 8px;">Software Development</p>
                        <p style="color: #94a3b8; font-weight: 500;">📍 Manila, Philippines</p>
                    </div>
                    
                    <!-- Mini Navbar / Tab Switcher -->
                    <div style="display: flex; justify-content: center; gap: 8px; border-bottom: 1px solid var(--border-color); margin-bottom: 24px; padding-bottom: 16px;">
                        <button class="nav-link active" style="padding: 8px 24px;">Home</button>
                        <button class="nav-link" style="padding: 8px 24px;">About</button>
                        <button class="nav-link" style="padding: 8px 24px;">Posts</button>
                    </div>
                    
                    <!-- Tab Content (Defaults to Home/About Grid) -->
                    <div class="profile-grid">
                        <div class="profile-field">
                            <label>Website</label>
                            <p style="font-weight: 500;">www.techsolutions.com</p>
                        </div>
                        <div class="profile-field">
                            <label>Active Postings</label>
                            <p style="font-weight: 500;">5 Roles</p>
                        </div>
                        <div class="profile-field profile-field-full">
                            <label>About the Company</label>
                            <p style="font-weight: 500;">Tech Solutions Inc. is a trusted SDEAS partner company committed to providing opportunities for graduates.</p>
                        </div>
                    </div>
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

    switchAccount: `
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