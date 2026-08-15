// Passage Property Detail & Booking Date Calculator Module
const PropertyDetail = {
  currentProperty: null,
  reviews: [],
  mapInstance: null,
  async open(propertyId) {
    try {
      this.currentProperty = await App.apiRequest(`/properties/${propertyId}`);
      this.reviews = await App.apiRequest(`/reviews/property/${propertyId}`);
      this.renderModal();
      App.openModal('propertyDetailModal');

      // Initialize Leaflet Map
      setTimeout(() => this.initMap(), 300);
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },
  renderModal() {
    const p = this.currentProperty;
    const modalBody = document.getElementById('propertyDetailBody');
    if (!modalBody) return;
    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 28px;">
        <!-- Left Column: Media & Overview -->
        <div>
          <div style="position: relative; border-radius: 18px; overflow: hidden; height: 360px; margin-bottom: 16px;">
            <img id="detailMainImg" src="${p.coverImage}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            <span class="badge-city" style="top:16px; left:16px;">${p.city.toUpperCase()}</span>
          </div>

          <div style="display: flex; gap: 12px; margin-bottom: 24px; overflow-x: auto;">
            ${(p.images || [p.coverImage]).map(img => `
              <img src="${img}" onclick="document.getElementById('detailMainImg').src='${img}'" 
                   style="width: 90px; height: 65px; object-fit: cover; border-radius: 10px; cursor: pointer; border: 1px solid var(--border-glass);" />
            `).join('')}
          </div>

          <h2 style="font-family: var(--font-display); font-size: 1.8rem; margin-bottom: 8px;">${p.title}</h2>
          <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px;">
            📍 ${p.address} • Landlord: ${p.ownerId ? p.ownerId.name : 'Passage Verified Superhost'}
          </p>

          <div style="display: flex; gap: 20px; font-family: var(--font-mono); font-size: 13px; margin-bottom: 24px; padding: 14px; background: var(--bg-secondary); border-radius: 12px;">
            <span>🛏 ${p.bedrooms} Bedrooms</span>
            <span>🚿 ${p.bathrooms} Bathrooms</span>
            <span>👥 Max ${p.maxGuests} Guests</span>
            <span>🛡 FRRO Assistance</span>
          </div>

          <h3 style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 10px;">About this home</h3>
          <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 28px;">${p.description}</p>

          <h3 style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 12px;">Expat-Friendly Amenities</h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px;">
            ${p.amenities.map(a => `<span class="amenity-chip active">${a}</span>`).join('')}
          </div>

          <h3 style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 12px;">Location & Neighborhood Map</h3>
          <div id="propertyMap" style="height: 240px; border-radius: 16px; margin-bottom: 32px; background: var(--bg-secondary); border: 1px solid var(--border-glass);"></div>

          <h3 style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 16px;">
            Tenant Reviews (${p.reviewCount || this.reviews.length})
          </h3>
          <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 28px;">
            ${this.reviews.length === 0 ? '<p style="color:var(--text-muted)">No reviews yet for this listing.</p>' : this.reviews.map(r => `
                <div style="background: var(--bg-secondary); padding: 16px; border-radius: 14px;">
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                    <b>${r.tenantName} (${r.tenantCountry})</b>
                    <span style="color:var(--accent-gold)">★ ${r.rating}.0</span>
                  </div>
                  <p style="font-size:13.5px; color:var(--text-secondary);">${r.comment}</p>
                </div>
              `).join('')}
          </div>

          <!-- Add Review Form -->
          ${App.user ? `
            <form onsubmit="PropertyDetail.submitReview(event)" style="background: var(--bg-secondary); padding: 20px; border-radius: 16px;">
              <h4 style="margin-bottom:12px;">Leave a Verified Tenant Review</h4>
              <div class="form-group" style="margin-bottom:12px;">
                <label>Rating (1 to 5)</label>
                <select id="reviewRating">
                  <option value="5">5 ★★★★★ (Exceptional)</option>
                  <option value="4">4 ★★★★☆ (Very Good)</option>
                  <option value="3">3 ★★★☆☆ (Average)</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom:14px;">
                <label>Review Comment</label>
                <textarea id="reviewComment" rows="3" placeholder="Describe your experience with the home and landlord..." required></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-sm">Submit Review</button>
            </form>
          ` : ''}
        </div>

        <!-- Right Column: Booking Card -->
        <div>
          <div style="position: sticky; top: 20px; background: var(--bg-secondary); border: 1px solid var(--border-glass); border-radius: 20px; padding: 24px; box-shadow: var(--shadow-lg);">
            <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-glass); padding-bottom: 16px;">
              <div>
                <span id="detailPriceDisplay" style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; color: var(--accent-gold);">
                  ${App.formatPrice(p.pricePerMonth)}
                </span>
                <span style="font-size: 13px; color: var(--text-muted);"> / month</span>
              </div>
              <span style="font-size: 13px; font-weight: 600; color: var(--accent-gold);">★ ${p.rating}</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px;">
              <div class="form-group">
                <label>Move-In Date</label>
                <input type="date" id="bookCheckIn" onchange="PropertyDetail.calculateTotal()" />
              </div>
              <div class="form-group">
                <label>Move-Out Date</label>
                <input type="date" id="bookCheckOut" onchange="PropertyDetail.calculateTotal()" />
              </div>
              <div class="form-group">
                <label>Number of Guests</label>
                <select id="bookGuests">
                  ${Array.from({
      length: p.maxGuests
    }, (_, i) => `<option value="${i + 1}">${i + 1} Guest${i > 0 ? 's' : ''}</option>`).join('')}
                </select>
              </div>
            </div>

            <div id="bookingSummary" style="background: var(--bg-primary); border: 1px solid var(--border-glass); border-radius: 12px; padding: 14px; margin-bottom: 20px; font-size: 13px; display: none;">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span>Duration</span>
                <b id="summaryDays">0 months</b>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span>Security Deposit</span>
                <b id="summaryDeposit">${App.formatPrice(p.deposit)}</b>
              </div>
              <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border-glass); padding-top:6px; font-size:14px;">
                <b>Total Quote</b>
                <b id="summaryTotal" style="color:var(--accent-gold)">₹0</b>
              </div>
            </div>

            <button class="btn btn-primary" style="width: 100%; justify-content: center; padding: 14px;" 
                    onclick="BookingFlow.startBooking('${p._id}')">
              Reserve Verified Home →
            </button>
            <p style="font-size: 11px; color: var(--text-muted); text-align: center; margin-top: 10px;">
              🔒 Double-booking protection & Passage Escrow Guarantee
            </p>
          </div>
        </div>
      </div>
    `;
  },
  initMap() {
    const p = this.currentProperty;
    if (!p || !p.location) return;
    const mapContainer = document.getElementById('propertyMap');
    if (!mapContainer) return;
    if (typeof L !== 'undefined') {
      if (this.mapInstance) this.mapInstance.remove();
      this.mapInstance = L.map('propertyMap').setView([p.location.lat, p.location.lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(this.mapInstance);
      L.marker([p.location.lat, p.location.lng]).addTo(this.mapInstance).bindPopup(`<b>${p.title}</b><br>${p.neighborhood}, ${p.city}`).openPopup();
    } else {
      mapContainer.innerHTML = `<div style="padding:40px; text-align:center; color:var(--text-muted)">Map Coordinates: ${p.location.lat}, ${p.location.lng}</div>`;
    }
  },
  calculateTotal() {
    const checkInVal = document.getElementById('bookCheckIn').value;
    const checkOutVal = document.getElementById('bookCheckOut').value;
    const summaryBox = document.getElementById('bookingSummary');
    if (!checkInVal || !checkOutVal) return;
    const start = new Date(checkInVal);
    const end = new Date(checkOutVal);
    if (start >= end) {
      App.showToast('Check-out must be after check-in', 'error');
      return;
    }
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const months = Math.max(1, Math.round(diffDays / 30));
    const rentTotal = this.currentProperty.pricePerMonth * months;
    const grandTotal = rentTotal + this.currentProperty.deposit;
    document.getElementById('summaryDays').textContent = `${months} month${months > 1 ? 's' : ''} (${diffDays} days)`;
    document.getElementById('summaryTotal').textContent = App.formatPrice(grandTotal);
    summaryBox.style.display = 'block';
  },
  updateCurrency() {
    if (this.currentProperty) {
      document.getElementById('detailPriceDisplay').textContent = App.formatPrice(this.currentProperty.pricePerMonth);
      this.calculateTotal();
    }
  },
  async submitReview(e) {
    e.preventDefault();
    try {
      const rating = document.getElementById('reviewRating').value;
      const comment = document.getElementById('reviewComment').value;
      await App.apiRequest(`/reviews/property/${this.currentProperty._id}`, 'POST', {
        rating,
        comment
      });
      App.showToast('Review submitted successfully!', 'success');
      this.open(this.currentProperty._id);
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  }
};