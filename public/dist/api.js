// Centralized Passage API Client & Utilities

const API_BASE = '/api';
window.PassageAPI = {
  // Token Helper
  getToken: () => localStorage.getItem('passage_token'),
  setToken: token => localStorage.setItem('passage_token', token),
  removeToken: () => localStorage.removeItem('passage_token'),
  // User Auth State Helper
  getStoredUser: () => {
    try {
      const u = localStorage.getItem('passage_user');
      if (!u || u === 'undefined' || u === 'null') return null;
      return JSON.parse(u);
    } catch (e) {
      return null;
    }
  },
  setStoredUser: user => {
    if (user) {
      localStorage.setItem('passage_user', JSON.stringify(user));
    }
  },
  removeStoredUser: () => localStorage.removeItem('passage_user'),
  // Fetch Wrapper
  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const config = {
      ...options,
      headers
    };
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'API Request Failed');
      }
      return data;
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  },
  // Authentication APIs
  login: async function (email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    });
    if (data.token) this.setToken(data.token);
    const userObj = data.user || data;
    this.setStoredUser(userObj);
    return {
      token: data.token,
      user: userObj
    };
  },
  register: async function (userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (data.token) this.setToken(data.token);
    const userObj = data.user || data;
    this.setStoredUser(userObj);
    return {
      token: data.token,
      user: userObj
    };
  },
  getCurrentUser: async function () {
    const data = await this.request('/auth/me');
    const userObj = data.user || data;
    this.setStoredUser(userObj);
    return {
      user: userObj
    };
  },
  updateProfile: async function (profileData) {
    const data = await this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    const userObj = data.user || data;
    this.setStoredUser(userObj);
    return {
      user: userObj
    };
  },
  // Properties APIs
  getProperties: async function (queryParams = {}) {
    const query = new URLSearchParams();
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== undefined && queryParams[key] !== null && queryParams[key] !== '') {
        query.append(key, queryParams[key]);
      }
    });
    return await this.request(`/properties?${query.toString()}`);
  },
  getPropertyById: async function (id) {
    return await this.request(`/properties/${id}`);
  },
  createProperty: async function (propertyData) {
    return await this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData)
    });
  },
  updateProperty: async function (id, propertyData) {
    return await this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData)
    });
  },
  deleteProperty: async function (id) {
    return await this.request(`/properties/${id}`, {
      method: 'DELETE'
    });
  },
  verifyProperty: async function (id, status) {
    return await this.request(`/properties/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({
        status
      })
    });
  },
  // Currency API
  getCurrencyRates: async function () {
    return await this.request('/currency/rates');
  },
  // Currency Converter Utility
  convertPrice: (priceInINR, currency, rates = {}) => {
    if (!priceInINR) return 0;
    if (currency === 'INR') return priceInINR;
    const rate = rates[currency] || 0.012;
    return Math.round(priceInINR * rate);
  },
  formatCurrency: (priceInINR, currency = 'INR', rates = {}) => {
    const symbols = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      AUD: 'A$',
      CAD: 'C$',
      SGD: 'S$',
      JPY: '¥'
    };
    const converted = window.PassageAPI.convertPrice(priceInINR, currency, rates);
    const sym = symbols[currency] || '₹';
    return `${sym}${converted.toLocaleString()}`;
  },
  // Bookings APIs
  createBooking: async function (bookingData) {
    return await this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },
  getMyBookings: async function () {
    return await this.request('/bookings/my-bookings');
  },
  getOwnerBookings: async function () {
    return await this.request('/bookings/owner-bookings');
  },
  getAllBookings: async function () {
    return await this.request('/bookings/all');
  },
  updateBookingStatus: async function (id, status) {
    return await this.request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status
      })
    });
  },
  // AI & Chatbot APIs
  aiRecommend: async function (payload) {
    return await this.request('/ai/recommend', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  aiChat: async function (message) {
    return await this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        message
      })
    });
  },
  // Reviews APIs
  getReviewsByProperty: async function (propertyId) {
    return await this.request(`/reviews/property/${propertyId}`);
  },
  createReview: async function (reviewData) {
    return await this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  },
  // Wishlist APIs
  getWishlist: async function () {
    return await this.request('/wishlist');
  },
  toggleWishlist: async function (propertyId) {
    return await this.request('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({
        propertyId
      })
    });
  },
  // Document Upload APIs
  uploadDocument: async function (docData) {
    return await this.request('/documents/upload', {
      method: 'POST',
      body: JSON.stringify(docData)
    });
  },
  getMyDocuments: async function () {
    return await this.request('/documents/my-documents');
  },
  getAllDocuments: async function () {
    return await this.request('/documents/all');
  },
  verifyDocument: async function (id, status) {
    return await this.request(`/documents/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({
        status
      })
    });
  },
  // Notifications API
  getNotifications: async function () {
    return await this.request('/notifications');
  },
  markNotificationsRead: async function () {
    return await this.request('/notifications/read-all', {
      method: 'PUT'
    });
  },
  // Admin Portal APIs
  getAdminStats: async function () {
    return await this.request('/admin/stats');
  },
  getAllUsers: async function () {
    return await this.request('/admin/users');
  },
  // WhatsApp Integration Utility
  generateWhatsAppUrl: function (phone, message) {
    let cleanPhone = (phone || '919876543210').replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    const encodedText = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  },
  openWhatsApp: function (phone, message) {
    const url = this.generateWhatsAppUrl(phone, message);
    window.open(url, '_blank');
  }
};