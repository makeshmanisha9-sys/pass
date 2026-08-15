// Passage Booking & Payment Checkout Module
const BookingFlow = {
  propertyId: null,
  async startBooking(propertyId) {
    if (!App.user) {
      App.showToast('Please sign in to proceed with booking', 'info');
      App.openModal('authModal');
      return;
    }
    this.propertyId = propertyId;
    const checkIn = document.getElementById('bookCheckIn').value;
    const checkOut = document.getElementById('bookCheckOut').value;
    const guests = document.getElementById('bookGuests').value;
    if (!checkIn || !checkOut) {
      App.showToast('Please select move-in and move-out dates', 'error');
      return;
    }

    // Step 1: Verify Documents
    try {
      const docs = await App.apiRequest('/documents/my-documents');
      const hasPassport = docs.some(d => d.documentType === 'passport');
      if (!hasPassport) {
        this.openDocumentUploadModal(checkIn, checkOut, guests);
      } else {
        this.openPaymentCheckoutModal(checkIn, checkOut, guests);
      }
    } catch (e) {
      this.openPaymentCheckoutModal(checkIn, checkOut, guests);
    }
  },
  openDocumentUploadModal(checkIn, checkOut, guests) {
    const modalBody = document.getElementById('checkoutModalBody');
    App.openModal('checkoutModal');
    modalBody.innerHTML = `
      <h3 style="font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 8px;">Step 1: Passport Verification</h3>
      <p style="font-size: 13.5px; color: var(--text-muted); margin-bottom: 20px;">
        Indian law requires foreign nationals to provide passport verification for lease registration & FRRO compliance.
      </p>

      <form onsubmit="BookingFlow.handleDocumentUpload(event, '${checkIn}', '${checkOut}', '${guests}')" style="display: flex; flex-direction: column; gap: 16px;">
        <div class="form-group">
          <label>Document Type</label>
          <select id="docType">
            <option value="passport">Passport Copy (Main Page)</option>
            <option value="visa">Indian Visa Copy</option>
          </select>
        </div>
        <div class="form-group">
          <label>Upload File (Image / PDF)</label>
          <input type="file" id="docFile" accept="image/*,.pdf" />
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top: 10px;">
          Upload & Continue to Payment →
        </button>
      </form>
    `;
  },
  async handleDocumentUpload(e, checkIn, checkOut, guests) {
    e.preventDefault();
    try {
      const docType = document.getElementById('docType').value;
      const fileInput = document.getElementById('docFile');
      const formData = new FormData();
      formData.append('documentType', docType);
      if (fileInput.files.length > 0) {
        formData.append('document', fileInput.files[0]);
      } else {
        formData.append('fileUrl', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80');
        formData.append('fileName', `${docType}_passport_doc.pdf`);
      }
      await App.apiRequest('/documents/upload', 'POST', formData, true);
      App.showToast('Document uploaded & auto-verified for FRRO!', 'success');
      this.openPaymentCheckoutModal(checkIn, checkOut, guests);
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },
  async openPaymentCheckoutModal(checkIn, checkOut, guests) {
    const p = PropertyDetail.currentProperty;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const months = Math.max(1, Math.round(diffDays / 30));
    const totalINR = p.pricePerMonth * months + p.deposit;
    const modalBody = document.getElementById('checkoutModalBody');
    App.openModal('checkoutModal');
    modalBody.innerHTML = `
      <h3 style="font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 6px;">Step 2: Instant Booking & Escrow Payment</h3>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">
        Secure Payment via Razorpay / Stripe Architecture
      </p>

      <div style="background: var(--bg-secondary); padding: 18px; border-radius: 14px; margin-bottom: 20px; font-size: 13.5px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span>Home</span>
          <b>${p.title}</b>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span>City & Location</span>
          <b>${p.neighborhood}, ${p.city}</b>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span>Lease Dates</span>
          <b>${checkIn} to ${checkOut}</b>
        </div>
        <div style="display:flex; justify-content:space-between; border-top: 1px solid var(--border-glass); padding-top: 8px; font-size: 15px; font-weight: 700;">
          <span>Total Amount</span>
          <span style="color: var(--accent-gold);">${App.formatPrice(totalINR)}</span>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
        <label style="font-size: 13px; font-weight: 600;">Select Payment Method</label>
        <div style="display: flex; gap: 12px;">
          <button class="btn btn-outline" style="flex:1; justify-center;" id="payRazorpay">
            💳 Razorpay (India & Int'l Cards)
          </button>
          <button class="btn btn-outline" style="flex:1; justify-center;" id="payStripe">
            🌐 Stripe / PayPal
          </button>
        </div>
      </div>

      <button class="btn btn-primary" style="width: 100%; justify-content: center; padding: 14px;" 
              onclick="BookingFlow.executePayment('${checkIn}', '${checkOut}', ${guests}, ${totalINR})">
        Confirm & Pay ${App.formatPrice(totalINR)} →
      </button>
    `;
  },
  async executePayment(checkIn, checkOut, guests, totalAmount) {
    try {
      // 1. Create order on backend
      const order = await App.apiRequest('/payments/create-order', 'POST', {
        amount: totalAmount,
        currency: 'INR',
        provider: 'razorpay'
      });

      // 2. Double-booking check & Create Booking
      const booking = await App.apiRequest('/bookings', 'POST', {
        propertyId: this.propertyId,
        checkIn,
        checkOut,
        totalAmount,
        guests
      });

      // 3. Verify Payment
      await App.apiRequest('/payments/verify-payment', 'POST', {
        bookingId: booking._id,
        transactionId: order.orderId,
        amount: totalAmount,
        provider: 'razorpay'
      });
      App.closeModal('checkoutModal');
      App.closeModal('propertyDetailModal');
      App.showToast('🎉 Booking Confirmed & Escrow Paid!', 'success');
      Dashboards.openDashboard();
    } catch (err) {
      App.showToast(`Booking Error: ${err.message}`, 'error');
    }
  }
};