// Passage Dashboards Module (Tenant, Owner & Admin)
const Dashboards = {
  async openDashboard() {
    if (!App.user) {
      App.showToast('Please sign in first', 'info');
      App.openModal('authModal');
      return;
    }

    App.openModal('dashboardModal');
    this.renderDashboardTabs();
  },

  renderDashboardTabs() {
    const role = App.user.role;
    const tabHeader = document.getElementById('dashTabHeader');
    const contentBox = document.getElementById('dashContentBox');
    if (!tabHeader || !contentBox) return;

    if (role === 'tenant') {
      tabHeader.innerHTML = `
        <button class="dash-tab-btn active" onclick="Dashboards.showTenantBookings(this)">My Bookings</button>
        <button class="dash-tab-btn" onclick="Dashboards.showTenantWishlist(this)">Wishlist</button>
        <button class="dash-tab-btn" onclick="Dashboards.showTenantDocuments(this)">My Documents</button>
        <button class="dash-tab-btn" onclick="Dashboards.showAiRecommendations(this)">✨ AI Match Engine</button>
      `;
      this.showTenantBookings();
    } else if (role === 'owner') {
      tabHeader.innerHTML = `
        <button class="dash-tab-btn active" onclick="Dashboards.showOwnerProperties(this)">My Listings</button>
        <button class="dash-tab-btn" onclick="Dashboards.showOwnerBookings(this)">Received Bookings</button>
        <button class="btn btn-primary btn-sm" onclick="Dashboards.openAddPropertyModal()" style="margin-left:auto;">+ Add New Property</button>
      `;
      this.showOwnerProperties();
    } else if (role === 'admin') {
      tabHeader.innerHTML = `
        <button class="dash-tab-btn active" onclick="Dashboards.showAdminAnalytics(this)">Analytics</button>
        <button class="dash-tab-btn" onclick="Dashboards.showAdminPropertyQueue(this)">Property Queue</button>
        <button class="dash-tab-btn" onclick="Dashboards.showAdminDocQueue(this)">Documents Queue</button>
        <button class="dash-tab-btn" onclick="Dashboards.showAdminInquiries(this)">Get Matched Inquiries</button>
        <button class="dash-tab-btn" onclick="Dashboards.showAdminUsers(this)">Users & Logs</button>
      `;
      this.showAdminAnalytics();
    }
  },

  setActiveTab(btn) {
    document.querySelectorAll('.dash-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  },

  // ---------------- TENANT VIEWS ----------------
  async showTenantBookings(btn) {
    this.setActiveTab(btn);
    const box = document.getElementById('dashContentBox');
    box.innerHTML = '<p style="color:var(--text-muted)">Loading your reservations...</p>';

    try {
      const bookings = await App.apiRequest('/bookings/my-bookings');
      if (bookings.length === 0) {
        box.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:40px;">No active bookings found. Explore verified homes across India!</p>';
        return;
      }

      box.innerHTML = `
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Home Title</th>
                <th>City</th>
                <th>Check In / Out</th>
                <th>Total Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.map(b => `
                <tr>
                  <td><b>${b.bookingNumber}</b></td>
                  <td>${b.propertyId ? b.propertyId.title : 'Verified Property'}</td>
                  <td>${b.propertyId ? b.propertyId.city : 'India'}</td>
                  <td>${new Date(b.checkIn).toLocaleDateString()} - ${new Date(b.checkOut).toLocaleDateString()}</td>
                  <td><b>${App.formatPrice(b.totalAmount)}</b></td>
                  <td><span class="status-badge status-confirmed">${b.status.toUpperCase()}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      box.innerHTML = `<p style="color:var(--accent-red)">Error loading bookings: ${err.message}</p>`;
    }
  },

  async showTenantWishlist(btn) {
    this.setActiveTab(btn);
    const box = document.getElementById('dashContentBox');
    try {
      const items = await App.apiRequest('/wishlist');
      if (items.length === 0) {
        box.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:40px;">Your wishlist is empty.</p>';
        return;
      }
      box.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:16px;">
          ${items.map(p => `
            <div style="background:var(--bg-secondary); border-radius:14px; padding:16px; display:flex; gap:16px;">
              <img src="${p.coverImage}" style="width:100px; height:80px; object-fit:cover; border-radius:10px;" />
              <div>
                <b>${p.title}</b>
                <p style="font-size:12px; color:var(--text-muted);">${p.neighborhood}, ${p.city}</p>
                <div style="font-weight:700; color:var(--accent-gold); margin-top:4px;">${App.formatPrice(p.pricePerMonth)}/mo</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } catch (e) {
      box.innerHTML = `<p style="color:var(--accent-red)">${e.message}</p>`;
    }
  },

  async showTenantDocuments(btn) {
    this.setActiveTab(btn);
    const box = document.getElementById('dashContentBox');
    try {
      const docs = await App.apiRequest('/documents/my-documents');
      box.innerHTML = `
        <div style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
          <h3>FRRO & Visa Documents</h3>
          <button class="btn btn-primary btn-sm" onclick="BookingFlow.openDocumentUploadModal('','','')">+ Upload Document</button>
        </div>
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Document Type</th>
                <th>File Name</th>
                <th>Uploaded Date</th>
                <th>Verification Status</th>
              </tr>
            </thead>
            <tbody>
              ${docs.map(d => `
                <tr>
                  <td><b>${d.documentType.toUpperCase()}</b></td>
                  <td>${d.fileName}</td>
                  <td>${new Date(d.uploadedAt).toLocaleDateString()}</td>
                  <td><span class="status-badge status-verified">${d.status.toUpperCase()}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (e) {
      box.innerHTML = `<p>${e.message}</p>`;
    }
  },

  async showAiRecommendations(btn) {
    this.setActiveTab(btn);
    const box = document.getElementById('dashContentBox');
    box.innerHTML = '<p style="color:var(--text-muted)">Querying Passage AI Recommendation Engine...</p>';

    try {
      const res = await App.apiRequest('/ai/recommend', 'POST', {
        city: 'All',
        nationality: App.user.nationality || 'Foreign Expat',
        purpose: 'Relocation & Remote Work'
      });

      box.innerHTML = `
        <div style="background:var(--glow-gold); border:1px solid var(--accent-gold); border-radius:16px; padding:18px; margin-bottom:24px;">
          <h4 style="color:var(--accent-gold); margin-bottom:6px;">✨ Passage AI Match Summary</h4>
          <p style="font-size:13.5px;">${res.summary}</p>
        </div>

        <div style="display:flex; flex-direction:column; gap:16px;">
          ${res.recommendations.map(r => `
            <div style="background:var(--bg-secondary); border-radius:16px; padding:18px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span class="status-badge status-confirmed" style="margin-bottom:6px;">${r.matchScore}% MATCH</span>
                <h4 style="font-family:var(--font-display); font-size:1.1rem;">${r.property.title} (${r.property.city})</h4>
                <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">${r.aiReasoning}</p>
              </div>
              <button class="btn btn-primary btn-sm" onclick="PropertyDetail.open('${r.property._id}')">View Match →</button>
            </div>
          `).join('')}
        </div>
      `;
    } catch (e) {
      box.innerHTML = `<p style="color:var(--accent-red)">${e.message}</p>`;
    }
  },

  // ---------------- OWNER VIEWS ----------------
  async showOwnerProperties(btn) {
    this.setActiveTab(btn);
    const box = document.getElementById('dashContentBox');
    try {
      const properties = await App.apiRequest('/properties?status=All');
      const myProps = properties.filter(p => p.ownerId && p.ownerId._id === App.user._id);

      box.innerHTML = `
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>City</th>
                <th>Price / Mo</th>
                <th>FRRO Ready</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${myProps.map(p => `
                <tr>
                  <td><b>${p.title}</b></td>
                  <td>${p.city}</td>
                  <td>${App.formatPrice(p.pricePerMonth)}</td>
                  <td>${p.frroSupported ? 'Yes' : 'No'}</td>
                  <td><span class="status-badge status-${p.status === 'verified' ? 'verified' : 'pending'}">${p.status.toUpperCase()}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (e) {
      box.innerHTML = `<p>${e.message}</p>`;
    }
  },

  async showOwnerBookings(btn) {
    this.setActiveTab(btn);
    const box = document.getElementById('dashContentBox');
    try {
      const bookings = await App.apiRequest('/bookings/owner-bookings');
      box.innerHTML = `
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Tenant Name</th>
                <th>Nationality</th>
                <th>Check In / Out</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.map(b => `
                <tr>
                  <td><b>${b.bookingNumber}</b></td>
                  <td>${b.tenantId ? b.tenantId.name : 'Foreign Tenant'}</td>
                  <td>${b.tenantId ? b.tenantId.nationality : 'Expat'}</td>
                  <td>${new Date(b.checkIn).toLocaleDateString()} - ${new Date(b.checkOut).toLocaleDateString()}</td>
                  <td><b>${App.formatPrice(b.totalAmount)}</b></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (e) {
      box.innerHTML = `<p>${e.message}</p>`;
    }
  },

  openAddPropertyModal() {
    App.openModal('addPropertyModal');
  },

  async handleAddProperty(e) {
    e.preventDefault();
    try {
      const title = document.getElementById('addTitle').value;
      const city = document.getElementById('addCity').value;
      const neighborhood = document.getElementById('addNeighborhood').value;
      const address = document.getElementById('addAddress').value;
      const pricePerMonth = Number(document.getElementById('addPrice').value);
      const bedrooms = Number(document.getElementById('addBedrooms').value);
      const coverImage = document.getElementById('addCoverImg').value;
      const description = document.getElementById('addDescription').value;

      await App.apiRequest('/properties', 'POST', {
        title,
        city,
        neighborhood,
        address,
        location: { lat: 13.0827, lng: 80.2707 },
        pricePerMonth,
        deposit: pricePerMonth * 2,
        bedrooms,
        coverImage,
        description,
        amenities: ['WiFi', 'Air Conditioning', 'Power Backup', 'FRRO Assistance', 'Furnished']
      });

      App.closeModal('addPropertyModal');
      App.showToast('Property created & sent for Admin Verification!', 'success');
      this.showOwnerProperties();
      Search.fetchProperties();
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },

  // ---------------- ADMIN VIEWS ----------------
  async showAdminAnalytics(btn) {
    this.setActiveTab(btn);
    const box = document.getElementById('dashContentBox');
    try {
      const data = await App.apiRequest('/admin/analytics');
      const m = data.metrics;

      box.innerHTML = `
        <div class="metrics-row">
          <div class="metric-card">
            <b>${m.totalUsers}</b>
            <span>Total Registered Users</span>
          </div>
          <div class="metric-card">
            <b>${m.verifiedProperties} / ${m.totalProperties}</b>
            <span>Verified Homes</span>
          </div>
          <div class="metric-card">
            <b>${m.totalBookings}</b>
            <span>Confirmed Reservations</span>
          </div>
          <div class="metric-card">
            <b style="color:var(--accent-gold)">${App.formatPrice(m.totalRevenue)}</b>
            <span>Platform Revenue</span>
          </div>
        </div>
      `;
    } catch (e) {
      box.innerHTML = `<p>${e.message}</p>`;
    }
  },

  async showAdminPropertyQueue(btn) {
    this.setActiveTab(btn);
    const box = document.getElementById('dashContentBox');
    try {
      const props = await App.apiRequest('/properties?status=All');
      box.innerHTML = `
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>City</th>
                <th>Landlord</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${props.map(p => `
                <tr>
                  <td><b>${p.title}</b></td>
                  <td>${p.city}</td>
                  <td>${p.ownerId ? p.ownerId.name : 'Owner'}</td>
                  <td><span class="status-badge status-${p.status === 'verified' ? 'verified' : 'pending'}">${p.status.toUpperCase()}</span></td>
                  <td>
                    ${p.status !== 'verified' ? `<button class="btn btn-primary btn-sm" onclick="Dashboards.verifyProperty('${p._id}', 'verified')">Approve</button>` : ''}
                    ${p.status !== 'rejected' ? `<button class="btn btn-ghost btn-sm" onclick="Dashboards.verifyProperty('${p._id}', 'rejected')">Reject</button>` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (e) {
      box.innerHTML = `<p>${e.message}</p>`;
    }
  },

  async verifyProperty(id, status) {
    try {
      await App.apiRequest(`/properties/${id}/verify`, 'PATCH', { status });
      App.showToast(`Property marked as ${status}`, 'success');
      this.showAdminPropertyQueue();
      Search.fetchProperties();
    } catch (e) {
      App.showToast(e.message, 'error');
    }
  },

  async showAdminDocQueue(btn) {
    this.setActiveTab(btn);
    const box = document.getElementById('dashContentBox');
    try {
      const docs = await App.apiRequest('/documents/all');
      box.innerHTML = `
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tenant Name</th>
                <th>Nationality</th>
                <th>Passport / Visa</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${docs.map(d => `
                <tr>
                  <td><b>${d.userId ? d.userId.name : 'Tenant'}</b></td>
                  <td>${d.userId ? d.userId.nationality : 'Foreign Expat'}</td>
                  <td>${d.fileName}</td>
                  <td><span class="status-badge status-verified">${d.status.toUpperCase()}</span></td>
                  <td>
                    <button class="btn btn-ghost btn-sm" onclick="App.showToast('Document Verified!')">Verify FRRO ✓</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (e) {
      box.innerHTML = `<p>${e.message}</p>`;
    }
  },

  async showAdminInquiries(btn) {
    this.setActiveTab(btn);
    const box = document.getElementById('dashContentBox');
    try {
      const list = await App.apiRequest('/inquiries');
      box.innerHTML = `
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Email</th>
                <th>Country</th>
                <th>Target City</th>
                <th>Budget</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(i => `
                <tr>
                  <td><b>${i.fullName}</b></td>
                  <td>${i.email}</td>
                  <td>${i.countryOfOrigin}</td>
                  <td>${i.preferredCity}</td>
                  <td>${i.monthlyBudget}</td>
                  <td><span class="status-badge status-confirmed">${i.status.toUpperCase()}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (e) {
      box.innerHTML = `<p>${e.message}</p>`;
    }
  },

  async showAdminUsers(btn) {
    this.setActiveTab(btn);
    const box = document.getElementById('dashContentBox');
    try {
      const users = await App.apiRequest('/admin/users');
      box.innerHTML = `
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Nationality</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td><b>${u.name}</b></td>
                  <td>${u.email}</td>
                  <td><span class="status-badge status-confirmed">${u.role.toUpperCase()}</span></td>
                  <td>${u.nationality || 'Expats'}</td>
                  <td>${u.isVerified ? '✓' : 'Pending'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (e) {
      box.innerHTML = `<p>${e.message}</p>`;
    }
  }
};
