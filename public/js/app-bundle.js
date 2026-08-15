/* Passage Production Single Bundle with Auto-Retry Mount */

/* --- public/js/api.js --- */
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
  verifyProperty: async function (id, status) {
    return await this.request(`/properties/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({
        status
      })
    });
  },
  getMyProperties: async function () {
    return await this.request('/properties/my-properties');
  },
  // Currency & Rate Helper APIs
  getRates: async function () {
    try {
      return await this.request('/currency/rates');
    } catch (e) {
      return {
        INR: 1,
        USD: 0.012,
        EUR: 0.011,
        GBP: 0.0095,
        JPY: 1.8,
        SGD: 0.016,
        AUD: 0.018,
        CAD: 0.016
      };
    }
  },
  getCurrencyRates: async function () {
    return await this.getRates();
  },
  formatCurrency: function (amountInINR, currency = 'INR', rates = {}) {
    const amt = Number(amountInINR) || 0;
    const rate = rates[currency] || (currency === 'INR' ? 1 : 0.012);
    const converted = amt * rate;
    const symbols = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      SGD: 'S$',
      AUD: 'A$',
      CAD: 'C$'
    };
    const symbol = symbols[currency] || '$';
    return `${symbol}${Math.round(converted).toLocaleString()}`;
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
  updateBookingStatus: async function (id, status) {
    return await this.request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status
      })
    });
  },
  // AI Assistant APIs
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
  getPropertyReviews: async function (propertyId) {
    try {
      return await this.request(`/reviews/property/${propertyId}`);
    } catch (e) {
      return [];
    }
  },
  getReviewsByProperty: async function (propertyId) {
    return await this.getPropertyReviews(propertyId);
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

/* --- public/js/components/Navbar.jsx --- */
// Passage Clean Sleek Navbar Component with Three-Dots (⋮) Quick Menu & Tourist Places

window.Navbar = function Navbar({
  currentUser,
  activeCurrency,
  onCurrencyChange,
  wishlistCount,
  currentView,
  onNavigate,
  onOpenAuth,
  onLogout,
  onOpenAI
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [threeDotsMenuOpen, setThreeDotsMenuOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [touristDropdownOpen, setTouristDropdownOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  React.useEffect(() => {
    if (currentUser) {
      window.PassageAPI.getNotifications().then(data => setNotifications(data || [])).catch(err => console.log('Notification fetch err:', err));
    }
  }, [currentUser]);
  const unreadCount = notifications.filter(n => !n.read && !n.isRead).length;
  const handleNavClick = (view, extraParams = null) => {
    setMobileMenuOpen(false);
    setThreeDotsMenuOpen(false);
    setProfileDropdownOpen(false);
    setNotificationsOpen(false);
    setTouristDropdownOpen(false);
    onNavigate(view, extraParams);
  };
  const citiesList = [{
    name: 'Chennai',
    desc: 'Marina Beach & Temples',
    icon: 'fa-umbrella-beach'
  }, {
    name: 'Bangalore',
    desc: 'Cubbon Park & Breweries',
    icon: 'fa-tree'
  }, {
    name: 'Mumbai',
    desc: 'Gateway & Marine Drive',
    icon: 'fa-city'
  }, {
    name: 'Delhi',
    desc: 'Qutub Minar & Lodhi Art',
    icon: 'fa-monument'
  }, {
    name: 'Hyderabad',
    desc: 'Golconda Fort & Biryani',
    icon: 'fa-chess-rook'
  }, {
    name: 'Goa',
    desc: 'Ashwem Sunset Beaches',
    icon: 'fa-sun'
  }, {
    name: 'Kochi',
    desc: 'Chinese Fishing Nets',
    icon: 'fa-anchor'
  }, {
    name: 'Jaipur',
    desc: 'Hawa Mahal & Amer Fort',
    icon: 'fa-crown'
  }];
  return /*#__PURE__*/React.createElement("header", {
    className: "sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between h-20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3 cursor-pointer",
    onClick: () => handleNavClick('home')
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-900 font-extrabold text-xl shadow-lg shadow-teal-500/20"
  }, "P"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl font-extrabold tracking-tight text-white font-sans"
  }, "Passage", /*#__PURE__*/React.createElement("span", {
    className: "text-teal-400"
  }, ".")), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1"
  }, "Foreigner Homes India"))), /*#__PURE__*/React.createElement("nav", {
    className: "hidden lg:flex items-center space-x-6 text-sm font-semibold"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('search'),
    className: `hover:text-teal-400 transition-colors flex items-center space-x-2 ${currentView === 'search' ? 'text-teal-400 font-extrabold' : 'text-slate-300'}`
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-compass text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "Explore Stays")), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTouristDropdownOpen(!touristDropdownOpen),
    className: `hover:text-teal-400 transition-colors flex items-center space-x-1.5 py-2 ${currentView === 'tourist-guide' ? 'text-teal-400 font-extrabold' : 'text-slate-300'}`
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-camera text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "Tourist Places"), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chevron-down text-[10px] text-slate-400 ml-1"
  })), touristDropdownOpen && /*#__PURE__*/React.createElement("div", {
    className: "absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-2 border-b border-slate-800 mb-2 px-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] font-extrabold uppercase text-teal-400 tracking-wider"
  }, "Top Indian Destinations"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('tourist-guide'),
    className: "text-[10px] text-slate-400 hover:text-white font-bold underline"
  }, "View All")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 gap-1"
  }, citiesList.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.name,
    onClick: () => handleNavClick('tourist-guide', {
      city: c.name
    }),
    className: "w-full text-left p-2 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${c.icon}`
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xs text-white group-hover:text-teal-300 block"
  }, c.name), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 truncate block"
  }, c.desc))))))), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenAI,
    className: "bg-slate-800/80 hover:bg-slate-800 text-teal-300 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 hover:border-teal-400 shadow-sm"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-wand-magic-sparkles text-teal-400 animate-pulse"
  }), /*#__PURE__*/React.createElement("span", null, "AI Assistant")), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setThreeDotsMenuOpen(!threeDotsMenuOpen),
    className: `w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-400 flex items-center justify-center transition-all shadow-md ${threeDotsMenuOpen ? 'ring-2 ring-teal-500 bg-slate-700 text-white' : ''}`,
    title: "Open Navigation Menu"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-ellipsis-vertical text-lg"
  })), threeDotsMenuOpen && /*#__PURE__*/React.createElement("div", {
    className: "absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-3 z-50 text-slate-200 space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-3 py-2 border-b border-slate-800 flex items-center justify-between mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-teal-400 tracking-wider"
  }, "Passage Menu"), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-ellipsis text-slate-500"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('search'),
    className: "w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-compass"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xs text-white block"
  }, "Explore Verified Stays"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, "Search homes across 8 Indian cities"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('tourist-guide'),
    className: "w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-camera"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xs text-white block"
  }, "Tourist Places & Map"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, "Interactive landmarks & trip itinerary"))), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenAI,
    className: "w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-wand-magic-sparkles"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xs text-teal-300 block"
  }, "AI Relocation Assistant"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, "Natural language chat concierge"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('about'),
    className: "w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-book"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xs text-white block"
  }, "Expat & FRRO Guide"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, "Visa Form C compliance rules"))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-slate-800 my-1 pt-1"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('profile'),
    className: "w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-passport"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xs text-white block"
  }, "My Passport & Visa Vault"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, "Manage uploaded documents"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('my-bookings'),
    className: "w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-receipt"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xs text-white block"
  }, "My Reservations"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, "Active stay bookings"))), (currentUser?.role === 'owner' || currentUser?.role === 'admin') && /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('owner-dashboard'),
    className: "w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chart-line"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xs text-teal-300 block"
  }, "Owner Dashboard"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, "Manage listings & approvals"))), currentUser?.role === 'admin' && /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('admin-dashboard'),
    className: "w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-halved"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xs text-amber-400 block"
  }, "Admin Control Center"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, "Platform GMV & verify vault")))))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3 sm:space-x-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("select", {
    value: activeCurrency,
    onChange: e => onCurrencyChange(e.target.value),
    className: "bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-teal-500 cursor-pointer shadow-sm"
  }, /*#__PURE__*/React.createElement("option", {
    value: "INR"
  }, "\u20B9 INR"), /*#__PURE__*/React.createElement("option", {
    value: "USD"
  }, "$ USD"), /*#__PURE__*/React.createElement("option", {
    value: "EUR"
  }, "\u20AC EUR"), /*#__PURE__*/React.createElement("option", {
    value: "GBP"
  }, "\xA3 GBP"), /*#__PURE__*/React.createElement("option", {
    value: "AUD"
  }, "A$ AUD"), /*#__PURE__*/React.createElement("option", {
    value: "CAD"
  }, "C$ CAD"), /*#__PURE__*/React.createElement("option", {
    value: "SGD"
  }, "S$ SGD"), /*#__PURE__*/React.createElement("option", {
    value: "JPY"
  }, "\xA5 JPY"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('wishlist'),
    className: "relative p-2 text-slate-300 hover:text-teal-400 transition-colors",
    title: "Saved Wishlist"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-regular fa-heart text-xl"
  }), wishlistCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-1 -right-1 bg-teal-500 text-slate-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900"
  }, wishlistCount)), currentUser && /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setNotificationsOpen(!notificationsOpen),
    className: "relative p-2 text-slate-300 hover:text-teal-400 transition-colors",
    title: "Notifications"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-regular fa-bell text-xl"
  }), unreadCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute top-1 right-1 bg-amber-500 w-2.5 h-2.5 rounded-full ring-4 ring-slate-900 animate-ping"
  })), notificationsOpen && /*#__PURE__*/React.createElement("div", {
    className: "absolute right-0 mt-3 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-3 border-b border-slate-700 mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-sm text-white"
  }, "In-App Notifications"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-teal-400 font-semibold"
  }, unreadCount, " New")), /*#__PURE__*/React.createElement("div", {
    className: "max-h-64 overflow-y-auto space-y-2"
  }, notifications.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400 py-4 text-center"
  }, "No notifications yet.") : notifications.map((n, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "p-2.5 bg-slate-900/60 rounded-xl text-xs space-y-1 border border-slate-700/50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-teal-300 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, n.title), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, new Date(n.createdAt).toLocaleDateString())), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-300 text-[11px]"
  }, n.message)))))), !currentUser ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpenAuth('login'),
    className: "px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
  }, "Sign In"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onOpenAuth('register'),
    className: "px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-600/30 transition-all transform hover:-translate-y-0.5"
  }, "Get Started")) : /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setProfileDropdownOpen(!profileDropdownOpen),
    className: "flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full border border-slate-700 transition-colors"
  }, /*#__PURE__*/React.createElement("img", {
    src: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    alt: currentUser.name,
    className: "w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/50"
  }), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:block text-xs font-bold text-slate-200 pr-2 max-w-[100px] truncate"
  }, currentUser.name), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chevron-down text-slate-400 text-xs pr-1"
  })), profileDropdownOpen && /*#__PURE__*/React.createElement("div", {
    className: "absolute right-0 mt-3 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-slate-200 text-xs font-medium"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-2.5 border-b border-slate-700"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-white text-sm"
  }, currentUser.name), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-[11px] truncate"
  }, currentUser.email), /*#__PURE__*/React.createElement("span", {
    className: "inline-block mt-1 px-2 py-0.5 bg-teal-500/20 text-teal-300 text-[10px] font-extrabold uppercase rounded-md border border-teal-500/30"
  }, currentUser.role)), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('profile'),
    className: "w-full text-left px-4 py-2.5 hover:bg-slate-700 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-user-gear text-slate-400"
  }), /*#__PURE__*/React.createElement("span", null, "My Profile & Passport")), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('my-bookings'),
    className: "w-full text-left px-4 py-2.5 hover:bg-slate-700 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-receipt text-slate-400"
  }), /*#__PURE__*/React.createElement("span", null, "My Bookings")), (currentUser.role === 'owner' || currentUser.role === 'admin') && /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('owner-dashboard'),
    className: "w-full text-left px-4 py-2.5 hover:bg-slate-700 text-teal-300 font-bold flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chart-line text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "Owner Dashboard")), currentUser.role === 'admin' && /*#__PURE__*/React.createElement("button", {
    onClick: () => handleNavClick('admin-dashboard'),
    className: "w-full text-left px-4 py-2.5 hover:bg-slate-700 text-amber-400 font-bold flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-halved text-amber-400"
  }), /*#__PURE__*/React.createElement("span", null, "Admin Control Center")), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-slate-700 mt-1 pt-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setProfileDropdownOpen(false);
      onLogout();
    },
    className: "w-full text-left px-4 py-2.5 hover:bg-red-500/20 text-red-400 font-bold flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-right-from-bracket text-red-400"
  }), /*#__PURE__*/React.createElement("span", null, "Sign Out"))))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setThreeDotsMenuOpen(!threeDotsMenuOpen),
    className: "lg:hidden p-2 text-teal-400 hover:text-white",
    title: "Open Menu"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-ellipsis-vertical text-xl"
  }))))));
};

/* --- public/js/components/Footer.jsx --- */
// Passage Footer Component

window.Footer = function Footer({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-5 gap-8 mb-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 space-y-4 pr-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-extrabold text-lg"
  }, "P"), /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-extrabold text-white tracking-tight"
  }, "Passage", /*#__PURE__*/React.createElement("span", {
    className: "text-teal-400"
  }, "."))), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-xs leading-relaxed max-w-sm"
  }, "Passage is India's premier verified home rental platform built for foreign expats, digital nomads, and international relocation. Verified landlords, FRRO visa paperwork assistance, multi-currency escrow guarantee, and 24/7 relocation support."), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3 text-slate-400 text-sm pt-2"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-teal-400 hover:bg-slate-800 transition-colors"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-twitter"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-teal-400 hover:bg-slate-800 transition-colors"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-linkedin-in"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-teal-400 hover:bg-slate-800 transition-colors"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-instagram"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-teal-400 hover:bg-slate-800 transition-colors"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-200 text-sm uppercase tracking-wider"
  }, "Top Cities"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search', {
      city: 'Chennai'
    }),
    className: "hover:text-teal-400 transition-colors"
  }, "Chennai Expat Homes")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search', {
      city: 'Bangalore'
    }),
    className: "hover:text-teal-400 transition-colors"
  }, "Bangalore Tech Hub")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search', {
      city: 'Mumbai'
    }),
    className: "hover:text-teal-400 transition-colors"
  }, "Mumbai Sea Front")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search', {
      city: 'Delhi'
    }),
    className: "hover:text-teal-400 transition-colors"
  }, "Delhi Diplomatic Enclave")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search', {
      city: 'Goa'
    }),
    className: "hover:text-teal-400 transition-colors"
  }, "Goa Beach Villas")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search', {
      city: 'Kochi'
    }),
    className: "hover:text-teal-400 transition-colors"
  }, "Kochi Heritage Residences")))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-200 text-sm uppercase tracking-wider"
  }, "Foreigner Services"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('about'),
    className: "hover:text-teal-400 transition-colors"
  }, "FRRO Registration Form C")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('faq'),
    className: "hover:text-teal-400 transition-colors"
  }, "Visa Lease Agreements")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('faq'),
    className: "hover:text-teal-400 transition-colors"
  }, "Multi-Currency Escrow")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('contact'),
    className: "hover:text-teal-400 transition-colors"
  }, "24/7 Expat Concierge")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('owner-dashboard'),
    className: "hover:text-teal-400 transition-colors"
  }, "List Your Property")))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-200 text-sm uppercase tracking-wider"
  }, "Company & Legal"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('about'),
    className: "hover:text-teal-400 transition-colors"
  }, "About Passage")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('contact'),
    className: "hover:text-teal-400 transition-colors"
  }, "Contact Support")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('terms'),
    className: "hover:text-teal-400 transition-colors"
  }, "Terms of Service")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('privacy'),
    className: "hover:text-teal-400 transition-colors"
  }, "Privacy Policy")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('faq'),
    className: "hover:text-teal-400 transition-colors"
  }, "Cancellation & Refunds"))))), /*#__PURE__*/React.createElement("div", {
    className: "pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500"
  }, /*#__PURE__*/React.createElement("p", null, "\xA9 ", new Date().getFullYear(), " Passage Expat Living Technologies Pvt Ltd. All rights reserved."), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-1 text-slate-400"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-[#0D9488] fa-shield-halved text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "Escrow Security Guaranteed")), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-1 text-slate-400"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-passport text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "FRRO Compliant Paperwork"))))));
};

/* --- public/js/components/PropertyCard.jsx --- */
// Passage Property Card Component with Direct Navigation & WhatsApp Integration

window.PropertyCard = function PropertyCard({
  property,
  activeCurrency = 'INR',
  currencyRates = {},
  isWishlisted = false,
  onToggleWishlist,
  onSelectProperty
}) {
  if (!property) return null;
  const formattedMonthPrice = window.PassageAPI.formatCurrency(property.pricePerMonth || 45000, activeCurrency, currencyRates);
  const formattedNightPrice = window.PassageAPI.formatCurrency(property.pricePerNight || Math.round((property.pricePerMonth || 45000) / 25), activeCurrency, currencyRates);
  const handleCardClick = e => {
    e.preventDefault();
    if (typeof onSelectProperty === 'function') {
      onSelectProperty(property._id || property, property);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer",
    onClick: handleCardClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative aspect-[4/3] overflow-hidden bg-slate-100"
  }, /*#__PURE__*/React.createElement("img", {
    src: property.coverImage || property.images && property.images[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    alt: property.title || 'Expat Residence',
    className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
    loading: "lazy"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute top-3 left-3 flex flex-wrap gap-1.5 z-10"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-slate-900/90 text-teal-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg backdrop-blur-md border border-teal-500/30 shadow-md flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "FRRO Verified")), property.instantBooking && /*#__PURE__*/React.createElement("span", {
    className: "bg-emerald-600/90 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg backdrop-blur-md shadow-md"
  }, "Instant Book")), /*#__PURE__*/React.createElement("div", {
    className: "absolute top-3 right-3 z-10 flex items-center space-x-1.5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      const msg = `Hi! Check out this verified expat property "${property.title || 'Residences'}" in ${property.city || 'India'} listed on Passage: http://localhost:5000`;
      window.PassageAPI.openWhatsApp('', msg);
    },
    className: "w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border bg-emerald-600/80 hover:bg-emerald-600 text-white border-white/30 shadow-md transition-all",
    title: "Share listing on WhatsApp"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-sm"
  })), typeof onToggleWishlist === 'function' && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onToggleWishlist(property._id);
    },
    className: `w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${isWishlisted ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30' : 'bg-slate-900/60 text-white border-white/30 hover:bg-slate-900/90'}`,
    title: isWishlisted ? "Remove from Saved" : "Save Property"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-${isWishlisted ? 'solid' : 'regular'} fa-heart text-sm`
  }))), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-slate-950/80 px-2.5 py-0.5 rounded-md text-[11px] font-bold border border-slate-700"
  }, property.propertyType || 'Serviced Residence'), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-1 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-700 text-amber-400 font-extrabold text-[11px]"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-star text-amber-400 text-[10px]"
  }), /*#__PURE__*/React.createElement("span", null, property.rating || 4.9), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 font-normal"
  }, "(", property.reviewCount || 12, ")")))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 flex-1 flex flex-col justify-between space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-1.5 text-xs text-teal-700 font-bold mb-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-dot"
  }), /*#__PURE__*/React.createElement("span", null, property.neighborhood || 'Prime Location', ", ", property.city || 'India')), /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1"
  }, property.title), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed"
  }, property.description)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3 text-[11px] text-slate-600 pt-2 border-t border-slate-100 font-semibold"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bed text-slate-400"
  }), /*#__PURE__*/React.createElement("span", null, property.bedrooms || 1, " Bed")), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bath text-slate-400"
  }), /*#__PURE__*/React.createElement("span", null, property.bathrooms || 1, " Bath")), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-wifi text-slate-400"
  }), /*#__PURE__*/React.createElement("span", null, "High Speed"))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 flex items-baseline justify-between border-t border-slate-100"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-base font-extrabold text-slate-900"
  }, formattedMonthPrice), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-slate-500 font-medium"
  }, " / month")), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-teal-600"
  }, formattedNightPrice), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, " / night")))));
};

/* --- public/js/components/AIAssistantModal.jsx --- */
// Passage AI Assistant Chat Modal Component

window.AIAssistantModal = function AIAssistantModal({
  isOpen = true,
  onClose,
  activeCurrency = 'INR',
  currencyRates = {},
  onSelectProperty,
  onNavigate
}) {
  const [messages, setMessages] = React.useState([{
    sender: 'ai',
    text: "Namaste! 👋 I'm your Passage Expat AI Relocation Concierge. Ask me anything about finding homes near IT parks, calculating rent quotes, FRRO visa Form C paperwork, or top tourist places in India!"
  }]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const chatEndRef = React.useRef(null);
  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);
  if (isOpen === false) return null;
  const handleSend = async e => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;
    const userText = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, {
      sender: 'user',
      text: userText
    }]);
    setLoading(true);
    try {
      const response = await window.PassageAPI.aiChat(userText);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: response.reply || "Here are recommendations based on your query.",
        suggestedProperties: response.suggestedProperties || []
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "I am ready! Ask me about homes in Chennai, Bangalore, Mumbai, Delhi, Goa, Hyderabad, Kochi, or Jaipur, or FRRO visa paperwork."
      }]);
    } finally {
      setLoading(false);
    }
  };
  const samplePrompts = ["Find budget-friendly apartments near Chennai IT parks", "How does FRRO Form C visa paperwork work for expats?", "Show sea-facing luxury homes in Mumbai under $1200", "Show tourist places in Goa"];
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-900 border-2 border-teal-500/40 rounded-3xl w-full max-w-2xl h-[92vh] sm:h-[620px] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-fadeIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-extrabold shadow-lg shadow-teal-500/20"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-wand-magic-sparkles text-lg"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-extrabold text-white flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("span", null, "Passage AI Relocation Assistant"), /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-500/20 text-teal-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-teal-500/30"
  }, "Live Online")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400"
  }, "Ask about homes, FRRO visa paperwork, & neighborhood tourist guides"))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark text-base"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto p-6 space-y-4 text-xs leading-relaxed"
  }, messages.map((m, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: `flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `max-w-[85%] rounded-2xl p-4 space-y-3 ${m.sender === 'user' ? 'bg-teal-600 text-white rounded-br-none shadow-md font-semibold' : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-md'}`
  }, /*#__PURE__*/React.createElement("p", {
    className: "whitespace-pre-line text-xs font-medium leading-relaxed"
  }, m.text), m.suggestedProperties && m.suggestedProperties.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-slate-700/60 space-y-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-teal-300 text-[11px]"
  }, "Recommended Matches:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-2"
  }, m.suggestedProperties.map(p => /*#__PURE__*/React.createElement("div", {
    key: p._id,
    onClick: () => {
      if (typeof onClose === 'function') onClose();
      if (typeof onSelectProperty === 'function') onSelectProperty(p._id, p);
    },
    className: "bg-slate-900/90 p-2 rounded-xl border border-slate-700 hover:border-teal-400 cursor-pointer transition-all flex items-center space-x-2 group"
  }, /*#__PURE__*/React.createElement("img", {
    src: p.coverImage,
    alt: p.title,
    className: "w-12 h-12 rounded-lg object-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "overflow-hidden"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-[11px] text-white truncate group-hover:text-teal-300"
  }, p.title), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-400"
  }, p.neighborhood, ", ", p.city), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold text-teal-400"
  }, window.PassageAPI.formatCurrency(p.pricePerMonth, activeCurrency, currencyRates), "/mo"))))))))), loading && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl px-4 py-3 text-xs flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-notch fa-spin text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "Analyzing Passage database & FRRO rules..."))), /*#__PURE__*/React.createElement("div", {
    ref: chatEndRef
  })), /*#__PURE__*/React.createElement("div", {
    className: "px-6 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar text-[11px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 font-bold whitespace-nowrap"
  }, "Try asking:"), samplePrompts.map((p, idx) => /*#__PURE__*/React.createElement("button", {
    key: idx,
    onClick: () => {
      setInputMessage(p);
    },
    className: "bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 whitespace-nowrap transition-colors font-semibold"
  }, p))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSend,
    className: "p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: inputMessage,
    onChange: e => setInputMessage(e.target.value),
    placeholder: "Type your question (e.g. 'Find budget homes in Bangalore')...",
    className: "flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: !inputMessage.trim() || loading,
    className: "bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-teal-600/30 text-xs transition-all flex items-center space-x-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "Ask AI"), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paper-plane text-xs"
  })))));
};

/* --- public/js/pages/HomePage.jsx --- */
// Passage Home Page Component

window.HomePage = function HomePage({
  properties,
  activeCurrency,
  currencyRates,
  wishlist,
  onToggleWishlist,
  onSelectProperty,
  onNavigate,
  onOpenAI
}) {
  const [searchCity, setSearchCity] = React.useState('All');
  const [searchCheckIn, setSearchCheckIn] = React.useState('');
  const [searchCheckOut, setSearchCheckOut] = React.useState('');
  const [searchGuests, setSearchGuests] = React.useState('1');
  const popularCities = [{
    name: 'Chennai',
    tag: 'Coastal Metro & IT Corridor',
    count: '12+ Homes',
    img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80'
  }, {
    name: 'Bangalore',
    tag: 'Garden City & Startup Capital',
    count: '15+ Homes',
    img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80'
  }, {
    name: 'Mumbai',
    tag: 'Financial Hub & Sea Promenade',
    count: '10+ Homes',
    img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80'
  }, {
    name: 'Delhi',
    tag: 'Capital Enclave & Heritage',
    count: '11+ Homes',
    img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80'
  }, {
    name: 'Goa',
    tag: 'Tropical Beaches & Heritage Villas',
    count: '14+ Homes',
    img: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=600&q=80'
  }, {
    name: 'Hyderabad',
    tag: 'Cyberabad & Royal Heritage',
    count: '9+ Homes',
    img: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80'
  }, {
    name: 'Kochi',
    tag: 'Kerala Backwaters & Art Fort',
    count: '8+ Homes',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80'
  }, {
    name: 'Jaipur',
    tag: 'Pink City Royal Haveli Stays',
    count: '7+ Homes',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80'
  }];
  const handleSearchSubmit = e => {
    e.preventDefault();
    onNavigate('search', {
      city: searchCity,
      checkIn: searchCheckIn,
      checkOut: searchCheckOut,
      guests: searchGuests
    });
  };
  const featuredList = properties.slice(0, 6);
  const luxuryList = properties.filter(p => p.pricePerMonth >= 75000).slice(0, 4);
  const budgetList = properties.filter(p => p.pricePerMonth <= 50000).slice(0, 4);
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-16 pb-16"
  }, /*#__PURE__*/React.createElement("section", {
    className: "relative bg-slate-950 text-white min-h-[580px] flex items-center justify-center overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 z-0"
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
    alt: "Hero Background",
    className: "w-full h-full object-cover opacity-35 scale-105 transform animate-pulse duration-[10000ms]"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40"
  })), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/30 px-4 py-1.5 rounded-full text-teal-300 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-passport text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "#1 Expat Tenancy Platform for India")), /*#__PURE__*/React.createElement("h1", {
    className: "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight"
  }, "Find Your Perfect Stay in ", /*#__PURE__*/React.createElement("span", {
    className: "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300"
  }, "India")), /*#__PURE__*/React.createElement("p", {
    className: "text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
  }, "Comfortable, verified and foreigner-friendly homes across India with FRRO visa paperwork assistance, multi-currency escrow guarantee, and local concierges."), /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-slate-200/80 text-slate-800 text-left"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSearchSubmit,
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-slate-50/80 sm:bg-transparent rounded-2xl sm:rounded-none sm:border-r border-slate-200"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1"
  }, "Destination"), /*#__PURE__*/React.createElement("select", {
    value: searchCity,
    onChange: e => setSearchCity(e.target.value),
    className: "w-full bg-transparent font-bold text-sm text-slate-900 focus:outline-none cursor-pointer"
  }, /*#__PURE__*/React.createElement("option", {
    value: "All"
  }, "All Cities in India"), /*#__PURE__*/React.createElement("option", {
    value: "Chennai"
  }, "Chennai"), /*#__PURE__*/React.createElement("option", {
    value: "Bangalore"
  }, "Bangalore"), /*#__PURE__*/React.createElement("option", {
    value: "Mumbai"
  }, "Mumbai"), /*#__PURE__*/React.createElement("option", {
    value: "Delhi"
  }, "Delhi"), /*#__PURE__*/React.createElement("option", {
    value: "Hyderabad"
  }, "Hyderabad"), /*#__PURE__*/React.createElement("option", {
    value: "Goa"
  }, "Goa"), /*#__PURE__*/React.createElement("option", {
    value: "Kochi"
  }, "Kochi"), /*#__PURE__*/React.createElement("option", {
    value: "Jaipur"
  }, "Jaipur"))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-slate-50/80 sm:bg-transparent rounded-2xl sm:rounded-none sm:border-r border-slate-200"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1"
  }, "Check-in"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: searchCheckIn,
    onChange: e => setSearchCheckIn(e.target.value),
    className: "w-full bg-transparent font-semibold text-xs text-slate-800 focus:outline-none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-slate-50/80 sm:bg-transparent rounded-2xl sm:rounded-none lg:border-r border-slate-200"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1"
  }, "Check-out"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: searchCheckOut,
    onChange: e => setSearchCheckOut(e.target.value),
    className: "w-full bg-transparent font-semibold text-xs text-slate-800 focus:outline-none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-slate-50/80 sm:bg-transparent rounded-2xl sm:rounded-none"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1"
  }, "Guests"), /*#__PURE__*/React.createElement("select", {
    value: searchGuests,
    onChange: e => setSearchGuests(e.target.value),
    className: "w-full bg-transparent font-bold text-sm text-slate-900 focus:outline-none cursor-pointer"
  }, /*#__PURE__*/React.createElement("option", {
    value: "1"
  }, "1 Guest"), /*#__PURE__*/React.createElement("option", {
    value: "2"
  }, "2 Guests"), /*#__PURE__*/React.createElement("option", {
    value: "3"
  }, "3 Guests"), /*#__PURE__*/React.createElement("option", {
    value: "4"
  }, "4+ Guests"))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-1"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-xl shadow-teal-600/40 transition-all flex items-center justify-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-magnifying-glass"
  }), /*#__PURE__*/React.createElement("span", null, "Search"))))), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-semibold"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "100% Verified Landlords")), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-contract text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "FRRO Form C Assistance")), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-vault text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "Multi-Currency Escrow Deposit"))))), /*#__PURE__*/React.createElement("section", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-slate-200 pb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-teal-600 font-bold text-xs uppercase tracking-widest"
  }, "Explore Top Metros"), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl sm:text-3xl font-extrabold text-slate-900"
  }, "Popular Destinations for Foreigners")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1 mt-2 sm:mt-0"
  }, /*#__PURE__*/React.createElement("span", null, "View All Destinations"), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-right"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-4"
  }, popularCities.map((c, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    onClick: () => onNavigate('search', {
      city: c.name
    }),
    className: "group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
  }, /*#__PURE__*/React.createElement("img", {
    src: c.img,
    alt: c.name,
    className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute bottom-3 left-3 right-3 text-white"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-500/90 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase"
  }, c.count), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-extrabold mt-1"
  }, c.name), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-300 truncate"
  }, c.tag)))))), /*#__PURE__*/React.createElement("section", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-teal-600 font-bold text-xs uppercase tracking-widest"
  }, "Handpicked Listings"), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl sm:text-3xl font-extrabold text-slate-900"
  }, "Featured Properties")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "btn text-xs font-bold text-slate-700 hover:text-teal-600 flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement("span", null, "Browse All"), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chevron-right text-xs"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  }, featuredList.map(p => /*#__PURE__*/React.createElement(window.PropertyCard, {
    key: p._id,
    property: p,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    isWishlisted: wishlist.includes(p._id),
    onToggleWishlist: onToggleWishlist,
    onSelectProperty: onSelectProperty
  })))), /*#__PURE__*/React.createElement("section", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-teal-600/30 border-2 border-emerald-400/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-5 max-w-xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-amber-400 text-slate-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md inline-block"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-compass text-slate-950 mr-1.5"
  }), "Need Personal Guidance?"), /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md"
  }, "Relocating to India for Work or Travel?"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm sm:text-base font-bold text-amber-100 leading-relaxed drop-shadow"
  }, "Our AI Relocation Concierge and local human expat team will match you with pre-inspected homes, verify landlord paperwork, and arrange 4K video tours."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-4 pt-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onOpenAI,
    className: "bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black px-7 py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/40 border-2 border-yellow-200 transform hover:scale-105 transition-all flex items-center space-x-2.5"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-wand-magic-sparkles text-slate-950 text-base"
  }), /*#__PURE__*/React.createElement("span", null, "Ask AI Travel Assistant")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "bg-white hover:bg-slate-100 text-teal-950 font-black px-7 py-3.5 rounded-2xl text-sm border-2 border-white shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-magnifying-glass text-teal-700"
  }), /*#__PURE__*/React.createElement("span", null, "Find Your Stay")))), /*#__PURE__*/React.createElement("div", {
    className: "w-full md:w-80 bg-slate-950/80 backdrop-blur-md p-6 rounded-2xl border-2 border-emerald-400/30 space-y-3 text-xs shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-extrabold text-amber-300 text-sm border-b border-emerald-500/30 pb-2.5 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-halved text-emerald-400"
  }), /*#__PURE__*/React.createElement("span", null, "Why Foreigners Choose Passage")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5 font-bold text-white"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check text-emerald-400 mt-0.5 text-sm"
  }), /*#__PURE__*/React.createElement("span", null, "Standardized 2-Month Deposit (Not 10)")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check text-emerald-400 mt-0.5 text-sm"
  }), /*#__PURE__*/React.createElement("span", null, "FRRO Visa Compliant Lease Agreements")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check text-emerald-400 mt-0.5 text-sm"
  }), /*#__PURE__*/React.createElement("span", null, "Pay via Credit Card / Razorpay / Stripe")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check text-emerald-400 mt-0.5 text-sm"
  }), /*#__PURE__*/React.createElement("span", null, "300 Mbps Fiber WiFi Guaranteed")))))), /*#__PURE__*/React.createElement("section", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-teal-600 font-bold text-xs uppercase tracking-widest"
  }, "Premium Living"), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl sm:text-3xl font-extrabold text-slate-900"
  }, "Luxury Penthouses & Sea View Villas")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
  }, luxuryList.map(p => /*#__PURE__*/React.createElement(window.PropertyCard, {
    key: p._id,
    property: p,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    isWishlisted: wishlist.includes(p._id),
    onToggleWishlist: onToggleWishlist,
    onSelectProperty: onSelectProperty
  })))));
};

/* --- public/js/pages/SearchPage.jsx --- */
// Passage Search Results & Advanced Filtering Component

window.SearchPage = function SearchPage({
  initialFilters = {},
  activeCurrency,
  currencyRates,
  wishlist,
  onToggleWishlist,
  onSelectProperty
}) {
  const [properties, setProperties] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState('grid'); // 'grid' or 'map'
  const [showMobileFilters, setShowMobileFilters] = React.useState(false);

  // Filters State
  const [city, setCity] = React.useState(initialFilters.city || 'All');
  const [searchKey, setSearchKey] = React.useState(initialFilters.search || '');
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const [propertyType, setPropertyType] = React.useState('All');
  const [bedrooms, setBedrooms] = React.useState('All');
  const [rating, setRating] = React.useState('All');
  const [sort, setSort] = React.useState('recommended');
  const [selectedAmenities, setSelectedAmenities] = React.useState([]);
  const [instantBooking, setInstantBooking] = React.useState(false);
  const [shortTerm, setShortTerm] = React.useState(false);
  const mapRef = React.useRef(null);
  const leafletInstance = React.useRef(null);
  const fetchFilteredProperties = React.useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = {
        city,
        search: searchKey,
        minPrice,
        maxPrice,
        propertyType,
        bedrooms,
        rating,
        sort,
        amenity: selectedAmenities,
        instantBooking: instantBooking ? 'true' : '',
        shortTerm: shortTerm ? 'true' : ''
      };
      const data = await window.PassageAPI.getProperties(queryParams);
      setProperties(data || []);
    } catch (err) {
      console.error('Search fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [city, searchKey, minPrice, maxPrice, propertyType, bedrooms, rating, sort, selectedAmenities, instantBooking, shortTerm]);
  React.useEffect(() => {
    fetchFilteredProperties();
  }, [fetchFilteredProperties]);

  // Leaflet Map Initialization
  React.useEffect(() => {
    if (viewMode === 'map' && mapRef.current && properties.length > 0) {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
      }
      const centerLat = properties[0].location?.lat || 13.0245;
      const centerLng = properties[0].location?.lng || 80.2452;
      const map = L.map(mapRef.current).setView([centerLat, centerLng], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      properties.forEach(p => {
        if (p.location && p.location.lat && p.location.lng) {
          const priceText = window.PassageAPI.formatCurrency(p.pricePerMonth, activeCurrency, currencyRates);
          const marker = L.marker([p.location.lat, p.location.lng]).addTo(map);
          marker.bindPopup(`
            <div style="font-family: sans-serif; max-width: 200px;">
              <img src="${p.coverImage}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px;" />
              <h4 style="font-weight: bold; font-size: 12px; margin-top: 6px;">${p.title}</h4>
              <p style="font-size: 10px; color: #64748b;">${p.neighborhood}, ${p.city}</p>
              <p style="font-weight: font-extrabold; font-size: 12px; color: #0d9488; margin-top: 4px;">${priceText} / mo</p>
            </div>
          `);
        }
      });
      leafletInstance.current = map;
    }
  }, [viewMode, properties, activeCurrency, currencyRates]);
  const toggleAmenity = amenityName => {
    if (selectedAmenities.includes(amenityName)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenityName));
    } else {
      setSelectedAmenities([...selectedAmenities, amenityName]);
    }
  };
  const resetFilters = () => {
    setCity('All');
    setSearchKey('');
    setMinPrice('');
    setMaxPrice('');
    setPropertyType('All');
    setBedrooms('All');
    setRating('All');
    setSort('recommended');
    setSelectedAmenities([]);
    setInstantBooking(false);
    setShortTerm(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl sm:text-2xl font-extrabold text-slate-900"
  }, "Furnished Expat Homes in India"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-0.5"
  }, "Showing ", properties.length, " verified listings with FRRO registration support")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-3 w-full md:w-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex-1 md:w-64"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: searchKey,
    onChange: e => setSearchKey(e.target.value),
    placeholder: "Neighborhood, keywords...",
    className: "w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 pl-9 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"
  })), /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: e => setSort(e.target.value),
    className: "bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
  }, /*#__PURE__*/React.createElement("option", {
    value: "recommended"
  }, "Sort: Recommended"), /*#__PURE__*/React.createElement("option", {
    value: "price_asc"
  }, "Price: Low to High"), /*#__PURE__*/React.createElement("option", {
    value: "price_desc"
  }, "Price: High to Low"), /*#__PURE__*/React.createElement("option", {
    value: "rating"
  }, "Highest Rated"), /*#__PURE__*/React.createElement("option", {
    value: "newest"
  }, "Newest First")), /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setViewMode('grid'),
    className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-grid-2 mr-1"
  }), " Grid"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setViewMode('map'),
    className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-map-location-dot mr-1"
  }), " Map")))), /*#__PURE__*/React.createElement("div", {
    className: "lg:hidden flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-sm"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowMobileFilters(!showMobileFilters),
    className: "w-full bg-slate-900 text-teal-400 hover:bg-slate-800 font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-between transition-all"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-sliders"
  }), /*#__PURE__*/React.createElement("span", null, showMobileFilters ? 'Hide Search Filters' : 'Filter Homes (City, Budget, Type)')), /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${showMobileFilters ? 'fa-chevron-up' : 'fa-chevron-down'}`
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-4 gap-8 items-start"
  }, /*#__PURE__*/React.createElement("aside", {
    className: `lg:col-span-1 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-xs text-slate-700 ${showMobileFilters ? 'block' : 'hidden lg:block'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-3 border-b border-slate-100"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-sm text-slate-900 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-sliders text-teal-600"
  }), /*#__PURE__*/React.createElement("span", null, "Filters")), /*#__PURE__*/React.createElement("button", {
    onClick: resetFilters,
    className: "text-teal-600 hover:underline font-bold text-[11px]"
  }, "Reset All")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "font-extrabold text-slate-900 uppercase tracking-wider text-[11px]"
  }, "City"), /*#__PURE__*/React.createElement("select", {
    value: city,
    onChange: e => setCity(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold focus:outline-none focus:border-teal-500"
  }, /*#__PURE__*/React.createElement("option", {
    value: "All"
  }, "All Indian Cities"), /*#__PURE__*/React.createElement("option", {
    value: "Chennai"
  }, "Chennai"), /*#__PURE__*/React.createElement("option", {
    value: "Bangalore"
  }, "Bangalore"), /*#__PURE__*/React.createElement("option", {
    value: "Mumbai"
  }, "Mumbai"), /*#__PURE__*/React.createElement("option", {
    value: "Delhi"
  }, "Delhi"), /*#__PURE__*/React.createElement("option", {
    value: "Hyderabad"
  }, "Hyderabad"), /*#__PURE__*/React.createElement("option", {
    value: "Goa"
  }, "Goa"), /*#__PURE__*/React.createElement("option", {
    value: "Kochi"
  }, "Kochi"), /*#__PURE__*/React.createElement("option", {
    value: "Jaipur"
  }, "Jaipur"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "font-extrabold text-slate-900 uppercase tracking-wider text-[11px]"
  }, "Monthly Budget (INR)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: minPrice,
    onChange: e => setMinPrice(e.target.value),
    placeholder: "Min \u20B9",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:border-teal-500"
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: maxPrice,
    onChange: e => setMaxPrice(e.target.value),
    placeholder: "Max \u20B9",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:border-teal-500"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "font-extrabold text-slate-900 uppercase tracking-wider text-[11px]"
  }, "Property Type"), /*#__PURE__*/React.createElement("select", {
    value: propertyType,
    onChange: e => setPropertyType(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold focus:outline-none"
  }, /*#__PURE__*/React.createElement("option", {
    value: "All"
  }, "All Property Types"), /*#__PURE__*/React.createElement("option", {
    value: "Villa"
  }, "Villa (All Villas)"), /*#__PURE__*/React.createElement("option", {
    value: "Sea-Facing Villa"
  }, "Sea-Facing Villa"), /*#__PURE__*/React.createElement("option", {
    value: "Lake View Villa"
  }, "Lake View Villa"), /*#__PURE__*/React.createElement("option", {
    value: "Bungalow"
  }, "Bungalow & Haveli"), /*#__PURE__*/React.createElement("option", {
    value: "Penthouse"
  }, "Penthouse"), /*#__PURE__*/React.createElement("option", {
    value: "Executive Loft"
  }, "Executive Loft"), /*#__PURE__*/React.createElement("option", {
    value: "Heritage Home"
  }, "Heritage Home"), /*#__PURE__*/React.createElement("option", {
    value: "Studio"
  }, "Studio"), /*#__PURE__*/React.createElement("option", {
    value: "Serviced Apartment"
  }, "Serviced Apartment"), /*#__PURE__*/React.createElement("option", {
    value: "Garden Flat"
  }, "Garden Flat"), /*#__PURE__*/React.createElement("option", {
    value: "Luxury Duplex"
  }, "Luxury Duplex"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "font-extrabold text-slate-900 uppercase tracking-wider text-[11px]"
  }, "Bedrooms"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5"
  }, ['All', '1', '2', '3', '4'].map(b => /*#__PURE__*/React.createElement("button", {
    key: b,
    onClick: () => setBedrooms(b),
    className: `flex-1 py-1.5 rounded-xl font-bold border transition-colors ${bedrooms === b ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`
  }, b === '4' ? '4+' : b)))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "font-extrabold text-slate-900 uppercase tracking-wider text-[11px]"
  }, "Key Amenities"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5 max-h-48 overflow-y-auto pr-1"
  }, ['WiFi', 'Air Conditioning', 'Power Backup', 'FRRO Assistance', 'Furnished', 'Gym', 'Balcony', 'Swimming Pool', 'Security', 'Parking'].map(a => /*#__PURE__*/React.createElement("label", {
    key: a,
    className: "flex items-center space-x-2 cursor-pointer hover:text-teal-700"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: selectedAmenities.includes(a),
    onChange: () => toggleAmenity(a),
    className: "rounded border-slate-300 text-teal-600 focus:ring-teal-500"
  }), /*#__PURE__*/React.createElement("span", null, a))))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-slate-100 space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "flex items-center justify-between cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-800"
  }, "Instant Booking Only"), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: instantBooking,
    onChange: e => setInstantBooking(e.target.checked),
    className: "rounded border-slate-300 text-teal-600"
  })), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center justify-between cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-800"
  }, "Short-Term Allowed"), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: shortTerm,
    onChange: e => setShortTerm(e.target.checked),
    className: "rounded border-slate-300 text-teal-600"
  })))), /*#__PURE__*/React.createElement("main", {
    className: "lg:col-span-3"
  }, loading ? /*#__PURE__*/React.createElement("div", {
    className: "py-20 text-center space-y-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-notch fa-spin text-3xl text-teal-600"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-slate-500"
  }, "Searching Passage verified properties...")) : properties.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-house-crack"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-extrabold text-slate-900"
  }, "No properties matched your criteria"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 max-w-sm mx-auto"
  }, "Try expanding your price range or selecting another city from our 50+ listings across India."), /*#__PURE__*/React.createElement("button", {
    onClick: resetFilters,
    className: "px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-md"
  }, "Reset All Filters")) : viewMode === 'map' ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-3 rounded-3xl border border-slate-200 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    ref: mapRef,
    className: "w-full h-[600px] rounded-2xl z-10"
  })) : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  }, properties.map(p => /*#__PURE__*/React.createElement(window.PropertyCard, {
    key: p._id,
    property: p,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    isWishlisted: wishlist.includes(p._id),
    onToggleWishlist: onToggleWishlist,
    onSelectProperty: onSelectProperty
  }))))));
};

/* --- public/js/pages/PropertyDetailPage.jsx --- */
// Passage Property Detail Page Component with Guaranteed Immediate Rendering & WhatsApp Integration

window.PropertyDetailPage = function PropertyDetailPage({
  propertyId,
  initialProperty,
  properties = [],
  activeCurrency = 'INR',
  currencyRates = {},
  wishlist = [],
  onToggleWishlist,
  onStartBooking,
  onNavigate
}) {
  // Find in-memory property instantly from initialProperty or properties array
  const existingProp = initialProperty || (Array.isArray(properties) ? properties.find(p => p && (p._id === propertyId || String(p._id) === String(propertyId) || p === propertyId)) : null);
  const [property, setProperty] = React.useState(existingProp);
  const [loading, setLoading] = React.useState(!existingProp);
  const [activeImage, setActiveImage] = React.useState(0);
  const [reviews, setReviews] = React.useState([]);

  // Booking Form State
  const [checkIn, setCheckIn] = React.useState('');
  const [checkOut, setCheckOut] = React.useState('');
  const [guests, setGuests] = React.useState(1);
  const detailMapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  React.useEffect(() => {
    // If we already have property loaded, sync reviews and background details
    const targetId = propertyId || property && property._id;
    if (targetId) {
      window.PassageAPI.getPropertyById(targetId).then(data => {
        if (data && (data._id || data.title)) {
          setProperty(data);
        }
        setLoading(false);
      }).catch(err => {
        console.error('Error fetching property detail:', err);
        setLoading(false);
      });
      window.PassageAPI.getPropertyReviews(targetId).then(revs => setReviews(Array.isArray(revs) ? revs : [])).catch(err => console.error(err));
    } else if (Array.isArray(properties) && properties.length > 0) {
      // Fallback: pick first property if no ID specified
      setProperty(properties[0]);
      setLoading(false);
    } else {
      window.PassageAPI.getProperties().then(list => {
        if (Array.isArray(list) && list.length > 0) {
          setProperty(list[0]);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [propertyId]);

  // Leaflet Map Initialization
  React.useEffect(() => {
    if (!property || !detailMapRef.current || !window.L) return;
    const lat = property.location?.lat || 13.0827;
    const lng = property.location?.lng || 80.2707;
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {}
    }
    try {
      const map = L.map(detailMapRef.current, {
        scrollWheelZoom: false
      }).setView([lat, lng], 14);
      mapInstanceRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color: #0d9488; color: white; padding: 6px 12px; border-radius: 20px; font-weight: 800; font-size: 11px; box-shadow: 0 4px 12px rgba(13,148,136,0.4); border: 2px solid white; display: flex; align-items: center; gap: 4px;">
                 <i class="fa-solid fa-house" style="font-size: 10px;"></i>
                 <span>${property.city || 'India'}</span>
               </div>`,
        iconSize: [100, 36],
        iconAnchor: [50, 18]
      });
      L.marker([lat, lng], {
        icon: customIcon
      }).addTo(map).bindPopup(`<b>${property.title || 'Residence'}</b><br/>${property.neighborhood || ''}, ${property.city || ''}`).openPopup();
    } catch (e) {
      console.log('Leaflet map init error:', e);
    }
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, [property]);
  if (loading && !property) {
    return /*#__PURE__*/React.createElement("div", {
      className: "py-24 text-center space-y-3"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-circle-notch fa-spin text-3xl text-teal-600"
    }), /*#__PURE__*/React.createElement("p", {
      className: "text-xs font-bold text-slate-500"
    }, "Loading property details..."));
  }

  // If still no property, display fallback view cleanly
  const activeProperty = property || Array.isArray(properties) && properties[0] || {
    _id: 'default',
    title: 'Luxury Expat Serviced Apartment',
    city: 'Chennai',
    address: 'Nungambakkam High Road, Chennai, Tamil Nadu',
    bedrooms: 2,
    bathrooms: 2,
    pricePerMonth: 45000,
    pricePerNight: 1800,
    rating: 4.9,
    description: 'Fully furnished, high-speed fiber internet, power backup, and FRRO Form C compliance assistance.',
    coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
  };
  const isWishlisted = Array.isArray(wishlist) && activeProperty ? wishlist.includes(activeProperty._id) : false;

  // Price Calculation Logic
  let nightCount = 1;
  if (checkIn && checkOut) {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    if (diff > 0) nightCount = diff;
  }
  const isMonthlyLease = nightCount >= 30;
  const baseRentInINR = isMonthlyLease ? Math.round((activeProperty.pricePerMonth || 45000) / 30 * nightCount) : (activeProperty.pricePerNight || Math.round((activeProperty.pricePerMonth || 45000) / 25)) * nightCount;
  const depositInINR = activeProperty.deposit || (activeProperty.pricePerMonth || 45000) * 2;
  const serviceFeeInINR = Math.round(baseRentInINR * 0.05);
  const grandTotalINR = baseRentInINR + serviceFeeInINR + (isMonthlyLease ? depositInINR : 0);
  const formattedTotal = window.PassageAPI.formatCurrency(grandTotalINR, activeCurrency, currencyRates);
  const formattedRent = window.PassageAPI.formatCurrency(baseRentInINR, activeCurrency, currencyRates);
  const formattedDeposit = window.PassageAPI.formatCurrency(depositInINR, activeCurrency, currencyRates);
  const imagesList = activeProperty.images && activeProperty.images.length > 0 ? activeProperty.images : [activeProperty.coverImage || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'];
  const ownerPhone = activeProperty.ownerId && typeof activeProperty.ownerId === 'object' && activeProperty.ownerId.phone ? activeProperty.ownerId.phone : '919876543210';
  const ownerName = activeProperty.ownerId && typeof activeProperty.ownerId === 'object' && activeProperty.ownerId.name ? activeProperty.ownerId.name : 'Verified Host';
  const ownerAvatar = activeProperty.ownerId && typeof activeProperty.ownerId === 'object' && activeProperty.ownerId.avatar ? activeProperty.ownerId.avatar : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';
  const handleWhatsAppHost = () => {
    const message = `Hello! I am an expat interested in booking your property "${activeProperty.title || 'Passage Residence'}" in ${activeProperty.city || 'India'} listed on Passage. Is it available for my stay?`;
    window.PassageAPI.openWhatsApp(ownerPhone, message);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row md:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-500/10 text-teal-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md border border-teal-500/30"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check mr-1"
  }), " FRRO Form C Verified"), /*#__PURE__*/React.createElement("span", {
    className: "bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-md"
  }, activeProperty.propertyType || 'Serviced Apartment')), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl sm:text-3xl font-extrabold text-slate-900"
  }, activeProperty.title), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-1 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-dot text-teal-600"
  }), /*#__PURE__*/React.createElement("span", null, activeProperty.address || activeProperty.city))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleWhatsAppHost,
    className: "px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-2 transition-all"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-sm"
  }), /*#__PURE__*/React.createElement("span", null, "WhatsApp Host")), typeof onToggleWishlist === 'function' && /*#__PURE__*/React.createElement("button", {
    onClick: () => onToggleWishlist(activeProperty._id),
    className: `px-4 py-2 rounded-xl text-xs font-bold border flex items-center space-x-2 transition-colors ${isWishlisted ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-${isWishlisted ? 'solid' : 'regular'} fa-heart`
  }), /*#__PURE__*/React.createElement("span", null, isWishlisted ? 'Saved' : 'Save')))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-3 rounded-3xl overflow-hidden shadow-lg aspect-[16/9] md:aspect-[21/9]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 relative group bg-slate-900"
  }, /*#__PURE__*/React.createElement("img", {
    src: imagesList[activeImage] || activeProperty.coverImage || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    alt: activeProperty.title,
    className: "w-full h-full object-cover"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hidden md:grid grid-rows-2 gap-3"
  }, imagesList.slice(0, 2).map((img, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    onClick: () => setActiveImage(idx),
    className: `relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${activeImage === idx ? 'border-teal-500 ring-2 ring-teal-500/50' : 'border-transparent opacity-80 hover:opacity-100'}`
  }, /*#__PURE__*/React.createElement("img", {
    src: img,
    alt: "Property thumbnail",
    className: "w-full h-full object-cover"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm grid grid-cols-4 gap-4 text-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400 block"
  }, "Bedrooms"), /*#__PURE__*/React.createElement("span", {
    className: "text-base font-extrabold text-slate-900"
  }, activeProperty.bedrooms || 1, " BHK")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400 block"
  }, "Bathrooms"), /*#__PURE__*/React.createElement("span", {
    className: "text-base font-extrabold text-slate-900"
  }, activeProperty.bathrooms || 1, " Baths")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400 block"
  }, "Max Guests"), /*#__PURE__*/React.createElement("span", {
    className: "text-base font-extrabold text-slate-900"
  }, activeProperty.maxGuests || 2, " Guests")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400 block"
  }, "Rating"), /*#__PURE__*/React.createElement("span", {
    className: "text-base font-extrabold text-amber-500"
  }, "\u2605 ", activeProperty.rating || '4.8'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-base text-slate-900"
  }, "About this Expat Residence"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-600 leading-relaxed font-medium"
  }, activeProperty.description)), /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-3xl border border-emerald-200/70 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement("img", {
    src: ownerAvatar,
    alt: ownerName,
    className: "w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block"
  }, "Verified Landlord Host"), /*#__PURE__*/React.createElement("h4", {
    className: "font-extrabold text-base text-slate-900"
  }, ownerName), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "FRRO Registration & Form C Legal Partner"))), /*#__PURE__*/React.createElement("button", {
    onClick: handleWhatsAppHost,
    className: "bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all w-full sm:w-auto justify-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-base"
  }), /*#__PURE__*/React.createElement("span", null, "Chat with Host on WhatsApp"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-base text-slate-900"
  }, "Amenities & Expat Facilities"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 gap-3"
  }, (activeProperty.amenities || ['WiFi', 'Air Conditioning', 'Power Backup', 'FRRO Assistance', 'Furnished']).map((amenity, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3 text-xs"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check text-teal-600 font-bold"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-slate-800"
  }, amenity))))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-base text-slate-900"
  }, "Location Map"), /*#__PURE__*/React.createElement("div", {
    ref: detailMapRef,
    className: "w-full h-64 rounded-2xl border border-slate-200"
  })), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-base text-slate-900 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("span", null, "Verified Expat Reviews"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-teal-600 font-bold"
  }, "(", reviews.length, ")")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, reviews.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "No written reviews yet for this home.") : reviews.map((r, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("img", {
    src: r.tenantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    alt: r.tenantName || 'Reviewer',
    className: "w-8 h-8 rounded-full object-cover"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xs text-slate-900"
  }, r.tenantName || 'Expat Guest'), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 block"
  }, r.tenantCountry || 'Foreign National'))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-1 text-amber-500 text-xs font-bold"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-star"
  }), /*#__PURE__*/React.createElement("span", null, r.rating || 5))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-600 font-medium italic"
  }, "\"", r.comment, "\"")))))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sticky top-28 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline justify-between pb-4 border-b border-slate-100"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl font-extrabold text-slate-900"
  }, window.PassageAPI.formatCurrency(activeProperty.pricePerMonth || 45000, activeCurrency, currencyRates)), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-slate-500 font-semibold"
  }, " / month")), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-teal-600"
  }, window.PassageAPI.formatCurrency(activeProperty.pricePerNight || Math.round((activeProperty.pricePerMonth || 45000) / 25), activeCurrency, currencyRates), " / night")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Check-in"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: checkIn,
    onChange: e => setCheckIn(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Check-out"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: checkOut,
    onChange: e => setCheckOut(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-teal-500"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Guests"), /*#__PURE__*/React.createElement("select", {
    value: guests,
    onChange: e => setGuests(Number(e.target.value)),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none"
  }, Array.from({
    length: activeProperty.maxGuests || 4
  }).map((_, i) => /*#__PURE__*/React.createElement("option", {
    key: i + 1,
    value: i + 1
  }, i + 1, " ", i === 0 ? 'Guest' : 'Guests'))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "Rental Price (", nightCount, " nights)"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-900"
  }, formattedRent)), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "Passage Service & Escrow Fee"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-900"
  }, window.PassageAPI.formatCurrency(serviceFeeInINR, activeCurrency, currencyRates))), isMonthlyLease && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-teal-700"
  }, /*#__PURE__*/React.createElement("span", null, "Refundable Security Deposit"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, formattedDeposit)), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900"
  }, /*#__PURE__*/React.createElement("span", null, "Total Amount (", activeCurrency, ")"), /*#__PURE__*/React.createElement("span", {
    className: "text-teal-600"
  }, formattedTotal))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => typeof onStartBooking === 'function' && onStartBooking(activeProperty._id, {
      checkIn,
      checkOut,
      guests,
      totalINR: grandTotalINR
    }),
    disabled: !checkIn || !checkOut,
    className: "w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-lock"
  }), /*#__PURE__*/React.createElement("span", null, "Book Now & Reserve")), /*#__PURE__*/React.createElement("button", {
    onClick: handleWhatsAppHost,
    className: "w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs py-3 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-base"
  }), /*#__PURE__*/React.createElement("span", null, "WhatsApp Host Directly"))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-400 text-center"
  }, "You won't be charged yet. Payments held securely under Passage Escrow.")))));
};

/* --- public/js/pages/BookingPage.jsx --- */
// Passage Booking & Payment Flow Pages

window.BookingPage = function BookingPage({
  bookingDraft,
  property,
  activeCurrency,
  currencyRates,
  onProceedToPayment,
  onNavigate
}) {
  const [specialRequests, setSpecialRequests] = React.useState('');
  const [frroRequired, setFrroRequired] = React.useState(true);
  if (!property || !bookingDraft) {
    return /*#__PURE__*/React.createElement("div", {
      className: "py-24 text-center space-y-4"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold text-slate-900"
    }, "No booking session found"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onNavigate('search'),
      className: "px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
    }, "Return to Properties"));
  }
  const handleContinue = e => {
    e.preventDefault();
    onProceedToPayment({
      ...bookingDraft,
      specialRequests,
      frroRequired
    });
  };
  const totalFormatted = window.PassageAPI.formatCurrency(bookingDraft.totalINR, activeCurrency, currencyRates);
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-4xl mx-auto px-4 py-10 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 text-xs text-slate-500"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "hover:underline"
  }, "Search"), /*#__PURE__*/React.createElement("span", null, "/"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('property-detail', {
      id: property._id
    }),
    className: "hover:underline"
  }, property.title), /*#__PURE__*/React.createElement("span", null, "/"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-900"
  }, "Booking Review")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-b border-slate-100 pb-4"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl font-extrabold text-slate-900"
  }, "1. Confirm Your Rental Details"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Review your stay dates and special expat assistance requirements")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 font-bold block uppercase text-[10px]"
  }, "Check-In"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-900 text-sm"
  }, bookingDraft.checkIn)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 font-bold block uppercase text-[10px]"
  }, "Check-Out"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-900 text-sm"
  }, bookingDraft.checkOut))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-800 mb-1"
  }, "Special Arrival Requests"), /*#__PURE__*/React.createElement("textarea", {
    rows: "3",
    value: specialRequests,
    onChange: e => setSpecialRequests(e.target.value),
    placeholder: "E.g. Flight FRA #102 arriving at 2 AM, need key box code or airport cab arrangement.",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start space-x-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: "frro",
    checked: frroRequired,
    onChange: e => setFrroRequired(e.target.checked),
    className: "mt-1 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "frro",
    className: "cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-teal-900 block text-xs"
  }, "Request Free FRRO Registration (Form C) Paperwork"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-teal-700 block mt-0.5"
  }, "The landlord will prepare an official notarized lease draft required for online Indian immigration (FRRO) registration.")))), /*#__PURE__*/React.createElement("button", {
    onClick: handleContinue,
    className: "w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center space-x-2"
  }, /*#__PURE__*/React.createElement("span", null, "Proceed to Payment"), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-right"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex space-x-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: property.coverImage,
    alt: property.title,
    className: "w-20 h-20 rounded-xl object-cover"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase text-teal-600 bg-teal-50 px-2 py-0.5 rounded"
  }, property.city), /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-xs text-slate-900 line-clamp-2 mt-1"
  }, property.title))), /*#__PURE__*/React.createElement("div", {
    className: "pt-3 border-t border-slate-100 text-xs space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-slate-600"
  }, /*#__PURE__*/React.createElement("span", null, "Guests"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-900"
  }, bookingDraft.guests, " Guest(s)")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-slate-600"
  }, /*#__PURE__*/React.createElement("span", null, "Escrow Security"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-teal-600"
  }, "Guaranteed")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between pt-2 border-t border-slate-200 font-extrabold text-sm text-slate-900"
  }, /*#__PURE__*/React.createElement("span", null, "Total Price"), /*#__PURE__*/React.createElement("span", {
    className: "text-teal-600"
  }, totalFormatted))))));
};

/* --- public/js/pages/PaymentPage.jsx --- */
// Passage Payment Integration Page Component with 1-Click Test Card Fill

window.PaymentPage = function PaymentPage({
  bookingDraft,
  property,
  activeCurrency = 'INR',
  currencyRates = {},
  onPaymentSuccess,
  onNavigate
}) {
  const [provider, setProvider] = React.useState('razorpay'); // 'razorpay' or 'stripe'
  const [cardName, setCardName] = React.useState('Dr. Michael Weber');
  const [cardNumber, setCardNumber] = React.useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = React.useState('12/28');
  const [cardCvc, setCardCvc] = React.useState('888');
  const [processing, setProcessing] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  if (!property || !bookingDraft) {
    return /*#__PURE__*/React.createElement("div", {
      className: "py-24 text-center space-y-4"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold text-slate-900"
    }, "Session expired or no property selected"), /*#__PURE__*/React.createElement("button", {
      onClick: () => typeof onNavigate === 'function' && onNavigate('search'),
      className: "px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
    }, "Return to Properties"));
  }
  const fillTestCard = () => {
    setCardName('Dr. Michael Weber');
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('888');
  };
  const handlePay = async e => {
    e.preventDefault();
    setProcessing(true);
    setErrorMsg('');
    try {
      // Create booking via API
      const bookingData = {
        propertyId: property._id,
        checkIn: bookingDraft.checkIn,
        checkOut: bookingDraft.checkOut,
        totalAmount: bookingDraft.totalINR,
        guests: bookingDraft.guests,
        specialRequests: bookingDraft.specialRequests || 'Expat long term reservation'
      };
      const result = await window.PassageAPI.createBooking(bookingData);

      // Simulate instant payment verification
      setTimeout(() => {
        setProcessing(false);
        if (typeof onPaymentSuccess === 'function') {
          onPaymentSuccess(result);
        } else if (typeof onNavigate === 'function') {
          onNavigate('booking-confirmation');
        }
      }, 1000);
    } catch (err) {
      setProcessing(false);
      setErrorMsg(err.message || 'Payment processing failed. Please check your card details.');
    }
  };
  const totalFormatted = window.PassageAPI.formatCurrency(bookingDraft.totalINR, activeCurrency, currencyRates);
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-3xl mx-auto px-4 py-10 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-b border-slate-100 pb-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl font-extrabold text-slate-900"
  }, "2. Secure Payment Gateway"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Encrypted multi-currency payment via Razorpay / Stripe Architecture")), /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-50 text-teal-700 font-extrabold text-xs px-3 py-1 rounded-full border border-teal-200"
  }, totalFormatted)), errorMsg && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200"
  }, errorMsg), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-extrabold uppercase tracking-wider text-slate-700"
  }, "Select Gateway Provider"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: fillTestCard,
    className: "text-[11px] font-bold text-teal-600 hover:underline"
  }, "\u26A1 Fill Test Card (4242)")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setProvider('razorpay'),
    className: `p-3 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${provider === 'razorpay' ? 'border-teal-600 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500/20' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bolt text-teal-600"
  }), /*#__PURE__*/React.createElement("span", null, "Razorpay (Cards / UPI / NetBanking)")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setProvider('stripe'),
    className: `p-3 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${provider === 'stripe' ? 'border-teal-600 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500/20' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-stripe text-indigo-600 text-base"
  }), /*#__PURE__*/React.createElement("span", null, "Stripe Global Checkout")))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handlePay,
    className: "space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Cardholder Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: cardName,
    onChange: e => setCardName(e.target.value),
    placeholder: "Dr. Michael Weber",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Card Number"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: cardNumber,
    onChange: e => setCardNumber(e.target.value),
    placeholder: "4242 4242 4242 4242",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500 tracking-widest"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute right-3 top-3 flex space-x-1 text-slate-400 text-base"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-cc-visa"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-cc-mastercard"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Expiry Date (MM/YY)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: cardExpiry,
    onChange: e => setCardExpiry(e.target.value),
    placeholder: "12/28",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500 text-center"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "CVV / CVC"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    required: true,
    maxLength: "4",
    value: cardCvc,
    onChange: e => setCardCvc(e.target.value),
    placeholder: "888",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500 text-center"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-emerald-800"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-[11px] block uppercase tracking-wider"
  }, "Passage Escrow Protection Active"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] leading-relaxed"
  }, "Your payment will be held securely in Passage Escrow and only released to the host after check-in & FRRO Form C document submission.")), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: processing,
    className: "w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold text-sm py-4 rounded-2xl shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center space-x-2"
  }, processing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-notch fa-spin"
  }), /*#__PURE__*/React.createElement("span", null, "Verifying Payment with Escrow Bank...")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-halved"
  }), /*#__PURE__*/React.createElement("span", null, "Pay ", totalFormatted, " & Authorize Escrow"))))));
};

/* --- public/js/pages/BookingConfirmationPage.jsx --- */
// Passage Digital Expat Booking Ticket & Pass Component

window.BookingConfirmationPage = function BookingConfirmationPage({
  booking,
  activeCurrency = 'INR',
  currencyRates = {},
  onNavigate
}) {
  if (!booking) {
    return /*#__PURE__*/React.createElement("div", {
      className: "py-24 text-center space-y-4"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold text-slate-900"
    }, "No recent confirmation found"), /*#__PURE__*/React.createElement("button", {
      onClick: () => typeof onNavigate === 'function' && onNavigate('my-bookings'),
      className: "px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
    }, "View My Bookings"));
  }
  const prop = booking.propertyId || {};
  const owner = booking.ownerId || {};
  const tenant = booking.tenantId || {};
  const formattedTotal = window.PassageAPI.formatCurrency(booking.totalAmount, activeCurrency, currencyRates);
  const bookingRef = booking.bookingNumber || 'PAS-' + Math.floor(100000 + Math.random() * 900000);
  const checkInDate = booking.checkIn ? new Date(booking.checkIn).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'Flexible';
  const checkOutDate = booking.checkOut ? new Date(booking.checkOut).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'Flexible';
  const handlePrint = () => {
    window.print();
  };
  const hostPhone = owner.phone || '919876543210';
  const waMsg = `Hi ${owner.name || 'Host'}, I have confirmed my booking #${bookingRef} for "${prop.title || 'Residence'}". Dates: ${checkInDate} to ${checkOutDate}.`;
  const waUrl = window.PassageAPI.generateWhatsAppUrl(hostPhone, waMsg);
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-4xl mx-auto px-4 py-8 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "print:hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-2xl shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-extrabold text-lg"
  }, "\u2713"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-teal-400 uppercase tracking-widest block"
  }, "Booking Verified"), /*#__PURE__*/React.createElement("h1", {
    className: "text-sm font-extrabold text-white"
  }, "Digital Expat Residence Ticket"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handlePrint,
    className: "bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1.5"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-print"
  }), /*#__PURE__*/React.createElement("span", null, "Print / Save Ticket")), /*#__PURE__*/React.createElement("button", {
    onClick: () => typeof onNavigate === 'function' && onNavigate('my-bookings'),
    className: "bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700"
  }, "My Bookings"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl border-2 border-slate-300 shadow-2xl overflow-hidden print:border-none print:shadow-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-teal-500"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider"
  }, "Official Expat Stay Pass"), /*#__PURE__*/React.createElement("span", {
    className: "bg-emerald-500/20 text-emerald-300 font-bold text-[10px] px-2.5 py-0.5 rounded-md border border-emerald-500/30"
  }, "CONFIRMED & ESCROW GUARANTEED")), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-extrabold tracking-tight"
  }, "PASSAGE EXPAT RESIDENCE TICKET"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400"
  }, "Verified Long-Term Foreigner Rental Entry Voucher \u2022 India")), /*#__PURE__*/React.createElement("div", {
    className: "text-left sm:text-right bg-slate-900 p-3 rounded-2xl border border-slate-800 font-mono"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 uppercase tracking-widest block font-sans"
  }, "Ticket Ref Code"), /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-black text-teal-400 tracking-wider"
  }, bookingRef))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 sm:p-8 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 flex space-x-4 items-start"
  }, /*#__PURE__*/React.createElement("img", {
    src: prop.coverImage || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80',
    alt: prop.title || 'Residence',
    className: "w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-md"
  }), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase"
  }, prop.propertyType || 'Serviced Residence'), /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-slate-900 text-base leading-snug"
  }, prop.title || 'Luxury Expat Residence'), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-600 font-medium flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-dot text-teal-600"
  }), /*#__PURE__*/React.createElement("span", null, prop.address || (prop.city ? `${prop.city}, India` : 'India'))), /*#__PURE__*/React.createElement("div", {
    className: "pt-1 flex items-center space-x-3 text-slate-500 text-[11px]"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bed text-teal-600 mr-1"
  }), prop.bedrooms || 2, " Beds"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bath text-teal-600 mr-1"
  }), prop.bathrooms || 2, " Baths"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-wifi text-teal-600 mr-1"
  }), "300 Mbps WiFi")))), /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block border-b border-slate-200 pb-1"
  }, "Ticket Holder Details"), /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-slate-900 text-sm"
  }, tenant.name || 'Expat Guest'), /*#__PURE__*/React.createElement("div", {
    className: "text-slate-600 space-y-0.5"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-slate-400"
  }, "Nationality:"), " ", tenant.nationality || 'Foreign National'), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-slate-400"
  }, "Email:"), " ", tenant.email || 'tenant@passage.com'), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-slate-400"
  }, "Guests:"), " ", booking.guests || 1, " Person(s)")))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-teal-50/60 rounded-2xl border border-teal-200/80 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block"
  }, "Check-In Date"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-900 text-sm block mt-0.5"
  }, checkInDate), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-teal-700"
  }, "12:00 PM Check-In")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block"
  }, "Check-Out Date"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-900 text-sm block mt-0.5"
  }, checkOutDate), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-teal-700"
  }, "11:00 AM Check-Out")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block"
  }, "Payment Status"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-emerald-700 text-sm block mt-0.5"
  }, "PAID & ESCROWED"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-500"
  }, "Escrow Protected")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block"
  }, "Total Amount"), /*#__PURE__*/React.createElement("span", {
    className: "font-black text-teal-700 text-base block mt-0.5"
  }, formattedTotal), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-500"
  }, "Rent + Deposit"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-2xl border border-slate-200 bg-white space-y-2 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block"
  }, "Verified Landlord Host Info"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-extrabold text-slate-900 text-sm"
  }, owner.name || 'Verified Host'), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500"
  }, owner.email || 'owner@passage.com')), /*#__PURE__*/React.createElement("a", {
    href: waUrl,
    target: "_blank",
    rel: "noreferrer",
    className: "print:hidden bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-[11px] flex items-center space-x-1.5 shadow-md"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-sm"
  }), /*#__PURE__*/React.createElement("span", null, "Chat Host")))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-passport text-teal-600"
  }), /*#__PURE__*/React.createElement("span", null, "FRRO Form C Registration Status")), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-600 text-[11px] leading-relaxed"
  }, "This ticket serves as proof of accommodation for foreign nationals under Indian immigration rules. Landlord Form C filing is active."))), /*#__PURE__*/React.createElement("div", {
    className: "pt-6 border-t-2 border-dashed border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mono text-center sm:text-left space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-900 text-white px-4 py-2 rounded-lg tracking-[0.3em] font-extrabold text-sm inline-block"
  }, "||||| |||| ||||| || |||||| |||"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-500 font-sans"
  }, "Passage Encrypted Verification Hash \u2022 ", bookingRef)), /*#__PURE__*/React.createElement("div", {
    className: "text-center sm:text-right space-y-1 text-[11px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-700 block"
  }, "Passage Expat Rentals India"), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500"
  }, "24/7 Expat Helpline: support@passage.com"))))));
};

/* --- public/js/pages/MyBookingsPage.jsx --- */
// Passage My Bookings Component with Direct Landlord WhatsApp Contact

window.MyBookingsPage = function MyBookingsPage({
  activeCurrency,
  currencyRates,
  onNavigate
}) {
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedBookingForReview, setSelectedBookingForReview] = React.useState(null);

  // Review form state
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [submittingReview, setSubmittingReview] = React.useState(false);
  const user = window.PassageAPI.getStoredUser();
  React.useEffect(() => {
    window.PassageAPI.getMyBookings().then(data => {
      setBookings(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);
  const handleReviewSubmit = async e => {
    e.preventDefault();
    if (!selectedBookingForReview || !comment.trim()) return;
    setSubmittingReview(true);
    try {
      await window.PassageAPI.createReview({
        propertyId: selectedBookingForReview.propertyId._id || selectedBookingForReview.propertyId,
        bookingId: selectedBookingForReview._id,
        tenantName: user ? user.name : 'Expat Tenant',
        tenantCountry: user ? user.nationality : 'Foreign Expats',
        tenantAvatar: user ? user.avatar : '',
        rating: Number(rating),
        cleanliness: Number(rating),
        location: Number(rating),
        communication: Number(rating),
        value: Number(rating),
        comment: comment.trim()
      });
      alert('Thank you! Your verified review has been submitted.');
      setSelectedBookingForReview(null);
      setComment('');
    } catch (err) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };
  const handleWhatsAppHost = booking => {
    const prop = booking.propertyId || {};
    const ownerPhone = booking.ownerId?.phone || prop.ownerId?.phone || '919876543210';
    const tenantName = user ? user.name : 'Expat Guest';
    const message = `Hi! This is ${tenantName} regarding reservation #${booking.bookingNumber} for "${prop.title || 'Passage Residence'}". Status: ${booking.status.toUpperCase()}. Let me know if you need any check-in details or FRRO Form C passport copies!`;
    window.PassageAPI.openWhatsApp(ownerPhone, message);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-5xl mx-auto px-4 py-10 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-slate-200 pb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "My Rental Reservations"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Track active bookings, payment receipts, and landlord FRRO documents")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
  }, "Browse More Homes")), loading ? /*#__PURE__*/React.createElement("div", {
    className: "py-20 text-center space-y-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-notch fa-spin text-3xl text-teal-600"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-slate-500"
  }, "Fetching your reservation history...")) : bookings.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl text-slate-400"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-receipt"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-bold text-slate-900"
  }, "No active or past bookings"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "You haven't reserved any Passage verified homes yet."), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl"
  }, "Explore Furnished Homes")) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, bookings.map(b => {
    const prop = b.propertyId || {};
    const priceFormatted = window.PassageAPI.formatCurrency(b.totalAmount, activeCurrency, currencyRates);
    return /*#__PURE__*/React.createElement("div", {
      key: b._id,
      className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center space-x-4"
    }, /*#__PURE__*/React.createElement("img", {
      src: prop.coverImage || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=300&q=80',
      alt: prop.title,
      className: "w-20 h-20 rounded-2xl object-cover"
    }), /*#__PURE__*/React.createElement("div", {
      className: "space-y-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center space-x-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "bg-teal-50 text-teal-700 text-[10px] font-extrabold px-2 py-0.5 rounded border border-teal-200 uppercase"
    }, b.bookingNumber), /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`
    }, b.status)), /*#__PURE__*/React.createElement("h3", {
      className: "font-extrabold text-sm text-slate-900"
    }, prop.title || 'Passage Residence'), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-500"
    }, prop.address || prop.city), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-slate-400"
    }, new Date(b.checkIn).toLocaleDateString(), " \u2014 ", new Date(b.checkOut).toLocaleDateString()))), /*#__PURE__*/React.createElement("div", {
      className: "flex md:flex-col items-end justify-between w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-base font-extrabold text-teal-600 block"
    }, priceFormatted), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-slate-400 block font-semibold"
    }, "Payment: ", b.paymentStatus)), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 flex flex-wrap items-center gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onNavigate('booking-confirmation', {
        booking: b
      }),
      className: "px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold rounded-xl flex items-center space-x-1 shadow-sm"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-ticket text-xs"
    }), /*#__PURE__*/React.createElement("span", null, "View Ticket")), /*#__PURE__*/React.createElement("button", {
      onClick: () => handleWhatsAppHost(b),
      className: "px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center space-x-1 shadow-sm",
      title: "Chat directly with Landlord Host on WhatsApp"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-brands fa-whatsapp text-sm"
    }), /*#__PURE__*/React.createElement("span", null, "WhatsApp Host")), /*#__PURE__*/React.createElement("button", {
      onClick: () => setSelectedBookingForReview(b),
      className: "px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
    }, "Write Review"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onNavigate('property-detail', {
        id: prop._id
      }),
      className: "px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold rounded-xl"
    }, "View Home"))));
  })), selectedBookingForReview && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-xs text-slate-800 shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b pb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-sm text-slate-900"
  }, "Leave a Verified Review"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSelectedBookingForReview(null),
    className: "text-slate-400 hover:text-slate-600"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleReviewSubmit,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Overall Rating (1 to 5 Stars)"), /*#__PURE__*/React.createElement("select", {
    value: rating,
    onChange: e => setRating(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: "5"
  }, "\u2B50\u2B50\u2B50\u2B50\u2B50 (5/5 - Outstanding Expat Stay)"), /*#__PURE__*/React.createElement("option", {
    value: "4"
  }, "\u2B50\u2B50\u2B50\u2B50 (4/5 - Very Good)"), /*#__PURE__*/React.createElement("option", {
    value: "3"
  }, "\u2B50\u2B50\u2B50 (3/5 - Average)"), /*#__PURE__*/React.createElement("option", {
    value: "2"
  }, "\u2B50\u2B50 (2/5 - Poor)"), /*#__PURE__*/React.createElement("option", {
    value: "1"
  }, "\u2B50 (1/5 - Terrible)"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Your Review & Experience"), /*#__PURE__*/React.createElement("textarea", {
    rows: "4",
    required: true,
    value: comment,
    onChange: e => setComment(e.target.value),
    placeholder: "Mention landlord FRRO help, internet reliability, neighborhood safety...",
    className: "w-full bg-slate-50 border rounded-xl p-3 text-xs"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: submittingReview,
    className: "w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold py-3 rounded-xl shadow-md"
  }, submittingReview ? 'Submitting...' : 'Submit Verified Review')))));
};

/* --- public/js/pages/WishlistPage.jsx --- */
// Passage Saved Wishlist Page Component

window.WishlistPage = function WishlistPage({
  wishlist,
  properties,
  activeCurrency,
  currencyRates,
  onToggleWishlist,
  onSelectProperty,
  onNavigate
}) {
  const savedProperties = properties.filter(p => wishlist.includes(p._id));
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-b border-slate-200 pb-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "Saved Wishlist"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, savedProperties.length, " homes saved for your upcoming stay in India")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
  }, "Explore More Homes")), savedProperties.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-regular fa-heart"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-bold text-slate-900"
  }, "Your wishlist is empty"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 max-w-sm mx-auto"
  }, "Click the heart icon on any property card while browsing to save homes here."), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl"
  }, "Browse Verified Homes")) : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  }, savedProperties.map(p => /*#__PURE__*/React.createElement(window.PropertyCard, {
    key: p._id,
    property: p,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    isWishlisted: true,
    onToggleWishlist: onToggleWishlist,
    onSelectProperty: onSelectProperty
  }))));
};

/* --- public/js/pages/UserProfilePage.jsx --- */
// Passage User Profile & Passport Upload Component

window.UserProfilePage = function UserProfilePage({
  currentUser,
  onNavigate,
  onAuthSuccess
}) {
  const [user, setUser] = React.useState(currentUser || {});
  const [name, setName] = React.useState(currentUser?.name || '');
  const [nationality, setNationality] = React.useState(currentUser?.nationality || 'Germany');
  const [passportNumber, setPassportNumber] = React.useState(currentUser?.passportNumber || '');
  const [phone, setPhone] = React.useState(currentUser?.phone || '');
  const [saving, setSaving] = React.useState(false);

  // Document Upload State
  const [documents, setDocuments] = React.useState([]);
  const [docType, setDocType] = React.useState('passport');
  const [fileName, setFileName] = React.useState('');
  const [fileUrl, setFileUrl] = React.useState('');
  const [uploading, setUploading] = React.useState(false);

  // Synchronize component state whenever currentUser updates
  React.useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.name || '');
      setNationality(currentUser.nationality || 'Germany');
      setPassportNumber(currentUser.passportNumber || '');
      setPhone(currentUser.phone || '');
      window.PassageAPI.getMyDocuments().then(data => setDocuments(data || [])).catch(err => console.log('Doc fetch err:', err));
    }
  }, [currentUser]);
  const handleProfileSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await window.PassageAPI.updateProfile({
        name,
        nationality,
        passportNumber,
        phone
      });
      alert('Profile updated successfully!');
      const updatedUser = res.user || res;
      setUser(updatedUser);
      if (typeof onAuthSuccess === 'function') {
        onAuthSuccess(updatedUser);
      }
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };
  const handleDocUpload = async e => {
    e.preventDefault();
    if (!fileName.trim() || !fileUrl.trim()) {
      alert('Please enter document title and file URL reference.');
      return;
    }
    setUploading(true);
    try {
      const newDoc = await window.PassageAPI.uploadDocument({
        documentType: docType,
        fileName: fileName.trim(),
        fileUrl: fileUrl.trim()
      });
      setDocuments([newDoc, ...documents]);
      setFileName('');
      setFileUrl('');
      alert('Document uploaded! Passage verification team will review within 24 hours.');
    } catch (err) {
      alert(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-4xl mx-auto px-4 py-10 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-b border-slate-200 pb-4"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "Expat Profile & Passport Documents"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Manage personal details, nationality, and FRRO visa verification paperwork")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    alt: user.name || 'User',
    className: "w-24 h-24 rounded-3xl object-cover mx-auto ring-4 ring-teal-500/30"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "font-extrabold text-base text-slate-900"
  }, user.name), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, user.email), /*#__PURE__*/React.createElement("span", {
    className: "inline-block mt-2 px-3 py-1 bg-teal-50 text-teal-700 font-extrabold text-[10px] uppercase rounded-full border border-teal-200"
  }, user.role, " Account \u2022 ", user.nationality)), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleProfileSave,
    className: "space-y-3 text-left pt-3 border-t text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Full Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: name,
    onChange: e => setName(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Nationality"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: nationality,
    onChange: e => setNationality(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Passport Number"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: passportNumber,
    onChange: e => setPassportNumber(e.target.value),
    placeholder: "DE98273641",
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-mono uppercase focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Contact Phone"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: phone,
    onChange: e => setPhone(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: saving,
    className: "w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-extrabold py-2.5 rounded-xl shadow text-xs transition-colors"
  }, saving ? 'Saving Changes...' : 'Save Profile Changes'))), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-base text-slate-900 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-passport text-teal-600"
  }), /*#__PURE__*/React.createElement("span", null, "Upload Passport / Visa for FRRO Verification")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Indian immigration rules require foreigners to submit passport & visa copies to landlords for Form C submission within 14 days of arrival."), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleDocUpload,
    className: "space-y-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Document Type"), /*#__PURE__*/React.createElement("select", {
    value: docType,
    onChange: e => setDocType(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-semibold"
  }, /*#__PURE__*/React.createElement("option", {
    value: "passport"
  }, "Passport Copy"), /*#__PURE__*/React.createElement("option", {
    value: "visa"
  }, "Employment / Tourist Visa"), /*#__PURE__*/React.createElement("option", {
    value: "frro"
  }, "FRRO Registration Form C"), /*#__PURE__*/React.createElement("option", {
    value: "lease_agreement"
  }, "Notarized Lease Copy"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Document Label / File Title"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: fileName,
    onChange: e => setFileName(e.target.value),
    placeholder: "e.g. passport_germany_page1.pdf",
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Document File Reference URL"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: fileUrl,
    onChange: e => setFileUrl(e.target.value),
    placeholder: "https://passage-uploads.s3.amazonaws.com/passport_copy.pdf",
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-mono"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: uploading,
    className: "w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-teal-600/30 text-xs transition-colors"
  }, uploading ? 'Encrypting & Saving...' : 'Securely Upload Document'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-sm text-slate-900"
  }, "Your Document Vault"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, documents.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 py-4 text-center"
  }, "No passport documents uploaded yet.") : documents.map(d => /*#__PURE__*/React.createElement("div", {
    key: d._id,
    className: "p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-pdf text-red-500 text-lg"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-900 block"
  }, d.fileName), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 uppercase font-bold"
  }, d.documentType, " \u2022 ", new Date(d.uploadedAt).toLocaleDateString()))), /*#__PURE__*/React.createElement("span", {
    className: `px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${d.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`
  }, d.status))))))));
};

/* --- public/js/pages/AuthPages.jsx --- */
// Passage Auth Pages & Modal Components (Login / Register / Forgot Password)

window.AuthPages = function AuthPages({
  mode = 'login',
  onAuthSuccess,
  onSuccess,
  onNavigate
}) {
  const [authMode, setAuthMode] = React.useState(mode);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('tenant');
  const [nationality, setNationality] = React.useState('Germany');
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const callback = onAuthSuccess || onSuccess || (() => {});
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (authMode === 'login') {
        const res = await window.PassageAPI.login(email, password);
        callback(res.user || res);
      } else if (authMode === 'register') {
        const res = await window.PassageAPI.register({
          name,
          email,
          password,
          role,
          nationality,
          phone
        });
        callback(res.user || res);
      } else if (authMode === 'forgot') {
        alert(`Reset instructions sent to ${email}`);
        setAuthMode('login');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-[500px] flex items-center justify-center py-6 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-extrabold text-xl mx-auto shadow-lg shadow-teal-500/20"
  }, "P"), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-extrabold text-slate-900"
  }, authMode === 'login' && 'Sign In to Passage', authMode === 'register' && 'Create Your Passage Account', authMode === 'forgot' && 'Reset Your Password'), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, authMode === 'login' && 'Access your expat stays, FRRO forms & wishlist', authMode === 'register' && 'Join thousands of foreigners & verified hosts across India', authMode === 'forgot' && 'Enter your registered email address')), authMode === 'login' && /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-[11px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-700 block uppercase tracking-wider text-[10px]"
  }, "1-Click Demo Credentials:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-1.5 font-bold"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => fillDemo('tenant@passage.com', 'tenant123'),
    className: "bg-white hover:bg-teal-50 p-1.5 rounded-xl border border-slate-200 text-teal-700 truncate"
  }, "\uD83C\uDDE9\uD83C\uDDEA Expat"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => fillDemo('owner@passage.com', 'owner123'),
    className: "bg-white hover:bg-teal-50 p-1.5 rounded-xl border border-slate-200 text-teal-700 truncate"
  }, "\uD83C\uDFE1 Host"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => fillDemo('admin@passage.com', 'admin123'),
    className: "bg-white hover:bg-teal-50 p-1.5 rounded-xl border border-slate-200 text-teal-700 truncate"
  }, "\uD83D\uDEE1\uFE0F Admin"))), error && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200"
  }, error), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4 text-xs"
  }, authMode === 'register' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Full Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "e.g. Dr. Michael Weber",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Email Address"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    required: true,
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "e.g. tenant@passage.com",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "font-bold text-slate-700"
  }, "Password"), authMode === 'login' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setAuthMode('forgot'),
    className: "text-[11px] font-bold text-teal-600 hover:underline"
  }, "Forgot Password?")), /*#__PURE__*/React.createElement("input", {
    type: "password",
    required: true,
    value: password,
    onChange: e => setPassword(e.target.value),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500"
  })), authMode === 'register' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "I am a..."), /*#__PURE__*/React.createElement("select", {
    value: role,
    onChange: e => setRole(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none"
  }, /*#__PURE__*/React.createElement("option", {
    value: "tenant"
  }, "Foreign Expat Tenant"), /*#__PURE__*/React.createElement("option", {
    value: "owner"
  }, "Landlord Host"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Nationality"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: nationality,
    onChange: e => setNationality(e.target.value),
    placeholder: "Germany",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Phone Number (WhatsApp Direct)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: phone,
    onChange: e => setPhone(e.target.value),
    placeholder: "+49 151 23456789",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: loading,
    className: "w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-teal-600/30 transition-all"
  }, loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : authMode === 'register' ? 'Create Account' : 'Send Reset Link')), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium"
  }, authMode === 'login' ? /*#__PURE__*/React.createElement("p", null, "Don't have an account?", ' ', /*#__PURE__*/React.createElement("button", {
    onClick: () => setAuthMode('register'),
    className: "text-teal-600 font-bold hover:underline"
  }, "Create one now")) : /*#__PURE__*/React.createElement("p", null, "Already have an account?", ' ', /*#__PURE__*/React.createElement("button", {
    onClick: () => setAuthMode('login'),
    className: "text-teal-600 font-bold hover:underline"
  }, "Sign In")))));
};

// Window AuthModal Overlay Wrapper
window.AuthModal = function AuthModal({
  mode = 'login',
  onClose,
  onAuthSuccess,
  onSuccess
}) {
  const handleSuccess = onAuthSuccess || onSuccess || (() => {});
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-full max-w-md"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center shadow-lg"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark text-sm"
  })), /*#__PURE__*/React.createElement(window.AuthPages, {
    mode: mode,
    onAuthSuccess: handleSuccess,
    onSuccess: handleSuccess
  })));
};

/* --- public/js/pages/OwnerDashboard.jsx --- */
// Passage Property Owner Dashboard Component with WhatsApp Integration

window.OwnerDashboard = function OwnerDashboard({
  currentUser,
  activeCurrency,
  currencyRates,
  onNavigate
}) {
  const [properties, setProperties] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingProperty, setEditingProperty] = React.useState(null);

  // Form State
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [city, setCity] = React.useState('Chennai');
  const [neighborhood, setNeighborhood] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [pricePerMonth, setPricePerMonth] = React.useState(45000);
  const [deposit, setDeposit] = React.useState(90000);
  const [bedrooms, setBedrooms] = React.useState(2);
  const [bathrooms, setBathrooms] = React.useState(2);
  const [maxGuests, setMaxGuests] = React.useState(4);
  const [propertyType, setPropertyType] = React.useState('Serviced Apartment');
  const [coverImage, setCoverImage] = React.useState('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80');
  const [frroSupported, setFrroSupported] = React.useState(true);
  const resetForm = () => {
    setEditingProperty(null);
    setTitle('');
    setDescription('');
    setCity('Chennai');
    setNeighborhood('');
    setAddress('');
    setPricePerMonth(45000);
    setDeposit(90000);
    setBedrooms(2);
    setBathrooms(2);
    setMaxGuests(4);
    setPropertyType('Serviced Apartment');
    setCoverImage('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80');
    setFrroSupported(true);
  };
  const loadOwnerData = React.useCallback(async () => {
    setLoading(true);
    try {
      const propData = await window.PassageAPI.getProperties({
        status: 'all'
      });
      const myProps = propData.filter(p => p.ownerId?._id === currentUser?._id || p.ownerId === currentUser?._id);
      setProperties(myProps);
      const bookingData = await window.PassageAPI.getOwnerBookings();
      setBookings(bookingData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  React.useEffect(() => {
    loadOwnerData();
  }, [loadOwnerData]);
  const handleSaveProperty = async e => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !address.trim()) {
      alert('Please fill in title, description, and full address.');
      return;
    }
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        city,
        neighborhood: neighborhood.trim() || city,
        address: address.trim(),
        location: {
          lat: 13.0245,
          lng: 80.2452
        },
        pricePerNight: Math.round(Number(pricePerMonth) / 25),
        pricePerMonth: Number(pricePerMonth),
        deposit: Number(deposit),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        maxGuests: Number(maxGuests),
        propertyType,
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        images: [coverImage.trim() || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'],
        frroSupported,
        amenities: ['WiFi', 'Air Conditioning', 'Power Backup', 'FRRO Assistance', 'Furnished']
      };
      if (editingProperty) {
        await window.PassageAPI.updateProperty(editingProperty._id, payload);
        alert('Property updated successfully!');
      } else {
        await window.PassageAPI.createProperty(payload);
        alert('Property created successfully! It is now listed.');
      }
      setShowAddModal(false);
      resetForm();
      loadOwnerData();
    } catch (err) {
      alert(err.message || 'Error saving property');
    }
  };
  const handleDeleteProperty = async id => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await window.PassageAPI.deleteProperty(id);
        alert('Listing deleted');
        loadOwnerData();
      } catch (err) {
        alert(err.message);
      }
    }
  };
  const handleBookingStatus = async (id, status) => {
    try {
      await window.PassageAPI.updateBookingStatus(id, status);
      alert(`Booking ${status}`);
      loadOwnerData();
    } catch (err) {
      alert(err.message);
    }
  };

  // WhatsApp Messaging Helpers
  const handleWhatsAppTenant = booking => {
    const tenantName = booking.tenantId?.name || 'Expat Guest';
    const propTitle = booking.propertyId?.title || 'Passage Residence';
    const bookingCode = booking.bookingNumber || 'PAS-BOOKING';
    const tenantPhone = booking.tenantId?.phone || '919876543210';
    const message = `Hello ${tenantName}! I am your host on Passage regarding reservation #${bookingCode} for "${propTitle}". Status: ${booking.status.toUpperCase()}. Welcome to India! Let me know if you have any check-in questions or need assistance with Form C / FRRO registration.`;
    window.PassageAPI.openWhatsApp(tenantPhone, message);
  };
  const handleShareListingWhatsApp = property => {
    const shareMessage = `🏡 Verified Expat Residence in ${property.city}: "${property.title}" (${property.bedrooms} BHK, FRRO Form C Supported). Check out the listing on Passage: http://localhost:5000`;
    window.PassageAPI.openWhatsApp('', shareMessage);
  };

  // KPI Calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const activeCount = bookings.filter(b => b.status === 'confirmed').length;
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-50 text-teal-700 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-teal-200"
  }, "Property Owner Dashboard"), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900 mt-1"
  }, "Landlord Management Console")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const msg = `Hello Passage Landlord Support! I need assistance managing my properties or tenant FRRO verification.`;
      window.PassageAPI.openWhatsApp('919876543210', msg);
    },
    className: "bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-colors"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-sm"
  }), /*#__PURE__*/React.createElement("span", null, "Passage WhatsApp Support")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      resetForm();
      setShowAddModal(true);
    },
    className: "bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-teal-600/30 flex items-center space-x-2 transition-colors"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  }), /*#__PURE__*/React.createElement("span", null, "Add New Property")))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-700/50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-emerald-400 text-xl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-sm text-emerald-300 uppercase tracking-wider"
  }, "WhatsApp Host Suite Active")), /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-lg text-white"
  }, "Direct Expat Communication & Instant Booking Alerts"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-emerald-100/80 max-w-xl"
  }, "Communicate directly with foreign tenants via WhatsApp. Send pre-filled check-in instructions, FRRO Form C guidance, or share listings with 1-click.")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const msg = `Check out my verified rental listings across India for expats on Passage: http://localhost:5000`;
      window.PassageAPI.openWhatsApp('', msg);
    },
    className: "bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow transition-colors flex items-center space-x-1.5"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-emerald-600 text-base"
  }), /*#__PURE__*/React.createElement("span", null, "Broadcast All Listings")))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400"
  }, "Total Listings"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-slate-900"
  }, properties.length)), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400"
  }, "Active Bookings"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-teal-600"
  }, activeCount)), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400"
  }, "Monthly Revenue"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-slate-900"
  }, window.PassageAPI.formatCurrency(totalRevenue, activeCurrency, currencyRates))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400"
  }, "Occupancy Rate"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-emerald-600"
  }, "84%"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-base text-slate-900"
  }, "Received Booking Requests"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-slate-500 font-bold"
  }, "Direct WhatsApp Tenant Messaging Enabled")), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]"
  }, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-2"
  }, "Booking ID"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-2"
  }, "Foreign Tenant"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-2"
  }, "Property"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-2"
  }, "Dates"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-2"
  }, "Rent Paid"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-2"
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-2"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, bookings.length === 0 ? /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "7",
    className: "text-center py-6 text-slate-400"
  }, "No booking requests received yet.")) : bookings.map(b => /*#__PURE__*/React.createElement("tr", {
    key: b._id,
    className: "border-b border-slate-100 hover:bg-slate-50"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-2 font-mono font-bold text-teal-600"
  }, b.bookingNumber), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-900 block"
  }, b.tenantId?.name || 'Expat'), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, b.tenantId?.nationality, " \u2022 ", b.tenantId?.passportNumber)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-2 font-semibold text-slate-800"
  }, b.propertyId?.title || 'Residence'), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-2 text-slate-500"
  }, new Date(b.checkIn).toLocaleDateString(), " \u2014 ", new Date(b.checkOut).toLocaleDateString()), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-2 font-bold text-slate-900"
  }, window.PassageAPI.formatCurrency(b.totalAmount, activeCurrency, currencyRates)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800"
  }, b.status)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-2 flex items-center space-x-1.5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleBookingStatus(b._id, 'confirmed'),
    className: "px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[10px]"
  }, "Approve"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleWhatsAppTenant(b),
    className: "px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] flex items-center space-x-1",
    title: "Chat with Tenant on WhatsApp"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-xs"
  }), /*#__PURE__*/React.createElement("span", null, "WhatsApp")), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleBookingStatus(b._id, 'cancelled'),
    className: "px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-[10px]"
  }, "Reject")))))))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-base text-slate-900"
  }, "My Property Listings"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  }, properties.map(p => /*#__PURE__*/React.createElement("div", {
    key: p._id,
    className: "bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs"
  }, /*#__PURE__*/React.createElement("img", {
    src: p.coverImage,
    alt: p.title,
    className: "w-full h-36 object-cover rounded-xl"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-100 text-teal-800 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase"
  }, p.status), /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-sm text-slate-900 mt-1 line-clamp-1"
  }, p.title), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500"
  }, p.neighborhood, ", ", p.city), /*#__PURE__*/React.createElement("p", {
    className: "font-extrabold text-teal-600 mt-1"
  }, window.PassageAPI.formatCurrency(p.pricePerMonth, activeCurrency, currencyRates), " / month")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 pt-2 border-t border-slate-200"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setEditingProperty(p);
      setTitle(p.title || '');
      setDescription(p.description || '');
      setCity(p.city || 'Chennai');
      setNeighborhood(p.neighborhood || '');
      setAddress(p.address || '');
      setPricePerMonth(p.pricePerMonth || 45000);
      setDeposit(p.deposit || 90000);
      setBedrooms(p.bedrooms || 2);
      setBathrooms(p.bathrooms || 2);
      setMaxGuests(p.maxGuests || 4);
      setPropertyType(p.propertyType || 'Serviced Apartment');
      setCoverImage(p.coverImage || '');
      setFrroSupported(p.frroSupported ?? true);
      setShowAddModal(true);
    },
    className: "flex-1 py-1.5 bg-slate-800 text-white font-bold rounded-lg text-center"
  }, "Edit"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleShareListingWhatsApp(p),
    className: "py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-center flex items-center space-x-1",
    title: "Share listing on WhatsApp"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-sm"
  }), /*#__PURE__*/React.createElement("span", null, "Share")), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDeleteProperty(p._id),
    className: "py-1.5 px-3 bg-red-500 text-white font-bold rounded-lg text-center"
  }, "Delete")))))), showAddModal && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl p-6 max-w-xl w-full space-y-4 text-xs text-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b pb-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-sm text-slate-900"
  }, editingProperty ? 'Edit Property Listing' : 'Add New Expat Residence'), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowAddModal(false),
    className: "text-slate-400 hover:text-slate-600"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSaveProperty,
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Property Title"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: title,
    onChange: e => setTitle(e.target.value),
    placeholder: "e.g. Executive Loft near 100ft Road",
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Description"), /*#__PURE__*/React.createElement("textarea", {
    rows: "3",
    required: true,
    value: description,
    onChange: e => setDescription(e.target.value),
    placeholder: "Mention FRRO help, optical fiber WiFi, generator backup...",
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "City"), /*#__PURE__*/React.createElement("select", {
    value: city,
    onChange: e => setCity(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-bold"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Chennai"
  }, "Chennai"), /*#__PURE__*/React.createElement("option", {
    value: "Bangalore"
  }, "Bangalore"), /*#__PURE__*/React.createElement("option", {
    value: "Mumbai"
  }, "Mumbai"), /*#__PURE__*/React.createElement("option", {
    value: "Delhi"
  }, "Delhi"), /*#__PURE__*/React.createElement("option", {
    value: "Hyderabad"
  }, "Hyderabad"), /*#__PURE__*/React.createElement("option", {
    value: "Goa"
  }, "Goa"), /*#__PURE__*/React.createElement("option", {
    value: "Kochi"
  }, "Kochi"), /*#__PURE__*/React.createElement("option", {
    value: "Jaipur"
  }, "Jaipur"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Neighborhood"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: neighborhood,
    onChange: e => setNeighborhood(e.target.value),
    placeholder: "e.g. Koramangala",
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Full Address"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: address,
    onChange: e => setAddress(e.target.value),
    placeholder: "e.g. 12th Main, Koramangala, Bengaluru",
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Monthly Rent (INR)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    required: true,
    value: pricePerMonth,
    onChange: e => setPricePerMonth(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Security Deposit (INR)"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    required: true,
    value: deposit,
    onChange: e => setDeposit(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Bedrooms"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    max: "10",
    required: true,
    value: bedrooms,
    onChange: e => setBedrooms(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Bathrooms"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    max: "10",
    required: true,
    value: bathrooms,
    onChange: e => setBathrooms(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Max Guests"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    max: "20",
    required: true,
    value: maxGuests,
    onChange: e => setMaxGuests(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Cover Image URL"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: coverImage,
    onChange: e => setCoverImage(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-mono"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold py-3 rounded-xl shadow-md transition-colors"
  }, editingProperty ? 'Save Changes' : 'Submit Listing for Verification')))));
};

/* --- public/js/pages/AdminDashboard.jsx --- */
// Passage Executive Admin Dashboard Component with WhatsApp Integration

window.AdminDashboard = function AdminDashboard({
  currentUser,
  activeCurrency,
  currencyRates,
  onNavigate
}) {
  const [stats, setStats] = React.useState(null);
  const [properties, setProperties] = React.useState([]);
  const [documents, setDocuments] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState('overview');
  const [loading, setLoading] = React.useState(true);
  const loadAdminData = React.useCallback(async () => {
    setLoading(true);
    try {
      const statsData = await window.PassageAPI.getAdminStats();
      setStats(statsData || {});
      const propData = await window.PassageAPI.getProperties({
        status: 'all'
      });
      setProperties(propData || []);
      const docData = await window.PassageAPI.getAllDocuments();
      setDocuments(docData || []);
      const userData = await window.PassageAPI.getAllUsers();
      setUsers(userData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  React.useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);
  const handlePropertyVerify = async (id, status) => {
    try {
      await window.PassageAPI.verifyProperty(id, status);
      alert(`Property status updated to ${status}`);
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };
  const handleDocVerify = async (id, status) => {
    try {
      await window.PassageAPI.verifyDocument(id, status);
      alert(`Document status updated to ${status}`);
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // WhatsApp Messaging Actions for Admin
  const handleWhatsAppOwner = (ownerName, phone, propTitle) => {
    const msg = `Hello ${ownerName || 'Landlord Host'}! This is Passage Admin regarding your property listing "${propTitle}". We require quick verification details to list it live on the expat portal.`;
    window.PassageAPI.openWhatsApp(phone || '919876543210', msg);
  };
  const handleWhatsAppTenant = (tenantName, phone, docName) => {
    const msg = `Hello ${tenantName || 'Expat Guest'}! This is Passage Support regarding your document "${docName || 'Passport Copy'}". Your FRRO Form C compliance check has been updated. Let us know if you need assistance!`;
    window.PassageAPI.openWhatsApp(phone || '919876543210', msg);
  };
  const metrics = stats?.metrics || {
    totalUsers: users.length || 142,
    totalTenants: 98,
    totalOwners: 44,
    totalProperties: properties.length || 56,
    verifiedProperties: properties.filter(p => p.status === 'verified').length || 52,
    pendingProperties: properties.filter(p => p.status === 'pending_verification').length || 4,
    totalBookings: 218,
    activeBookings: 34,
    totalRevenue: 28400000
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "bg-amber-50 text-amber-700 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-200"
  }, "Executive Admin Control Center"), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900 mt-1"
  }, "Platform Operations & Compliance Console")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const msg = `Passage Admin System Broadcast: All FRRO compliance & host verification channels active.`;
      window.PassageAPI.openWhatsApp('', msg);
    },
    className: "bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-colors"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-sm"
  }), /*#__PURE__*/React.createElement("span", null, "WhatsApp Admin Broadcast")))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400"
  }, "Total Registered Users"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-slate-900"
  }, metrics.totalUsers), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-teal-600 font-bold"
  }, metrics.totalTenants, " Expats \u2022 ", metrics.totalOwners, " Hosts")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400"
  }, "Total Properties"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-slate-900"
  }, metrics.totalProperties), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-emerald-600 font-bold"
  }, metrics.verifiedProperties, " Verified Live")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400"
  }, "Platform GMV"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-amber-600"
  }, window.PassageAPI.formatCurrency(metrics.totalRevenue, activeCurrency, currencyRates)), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 font-bold"
  }, "Escrow Protected")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400"
  }, "FRRO Pending Docs"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold text-rose-600"
  }, documents.filter(d => d.status === 'pending').length), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 font-bold"
  }, "Require Review"))), /*#__PURE__*/React.createElement("div", {
    className: "flex space-x-2 border-b border-slate-200 pb-2 text-xs font-extrabold"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('overview'),
    className: `px-4 py-2 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`
  }, "All Activity"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('properties'),
    className: `px-4 py-2 rounded-xl transition-all ${activeTab === 'properties' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`
  }, "Property Approvals (", properties.filter(p => p.status === 'pending_verification').length, ")"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('documents'),
    className: `px-4 py-2 rounded-xl transition-all ${activeTab === 'documents' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`
  }, "Passport Vault Compliance (", documents.length, ")")), (activeTab === 'overview' || activeTab === 'properties') && /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-base text-slate-900"
  }, "Property Verification & Host WhatsApp Hub"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-slate-500 font-bold"
  }, "Direct Landlord Contact Enabled")), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]"
  }, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-2"
  }, "Property Title"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-2"
  }, "City"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-2"
  }, "Owner / Host"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-2"
  }, "Rent / Month"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-2"
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-2"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, properties.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p._id,
    className: "border-b border-slate-100 hover:bg-slate-50"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-2 font-bold text-slate-900"
  }, p.title), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-2 text-slate-600"
  }, p.city), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-2 text-slate-600 font-semibold"
  }, p.ownerId?.name || 'Landlord Host'), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-2 font-extrabold text-teal-600"
  }, window.PassageAPI.formatCurrency(p.pricePerMonth, activeCurrency, currencyRates)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: `px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${p.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`
  }, p.status)), /*#__PURE__*/React.createElement("td", {
    className: "py-3 px-2 flex items-center space-x-1.5"
  }, p.status !== 'verified' && /*#__PURE__*/React.createElement("button", {
    onClick: () => handlePropertyVerify(p._id, 'verified'),
    className: "px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px]"
  }, "Approve"), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleWhatsAppOwner(p.ownerId?.name, p.ownerId?.phone, p.title),
    className: "px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] flex items-center space-x-1",
    title: "Contact Host on WhatsApp"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-xs"
  }), /*#__PURE__*/React.createElement("span", null, "WhatsApp Host")), p.status !== 'rejected' && /*#__PURE__*/React.createElement("button", {
    onClick: () => handlePropertyVerify(p._id, 'rejected'),
    className: "px-2.5 py-1 bg-red-500 text-white rounded-lg font-bold text-[10px]"
  }, "Reject")))))))), (activeTab === 'overview' || activeTab === 'documents') && /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-base text-slate-900"
  }, "Foreign Expat Passport & Visa Verification"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-slate-500 font-bold"
  }, "Direct Expat WhatsApp Communication")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, documents.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400"
  }, "No passport documents uploaded yet.") : documents.map(d => /*#__PURE__*/React.createElement("div", {
    key: d._id,
    className: "p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-pdf text-red-500 text-xl"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-900 block"
  }, d.fileName), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-500 text-[11px]"
  }, "Type: ", d.documentType.toUpperCase(), " \u2022 User: ", d.userId?.name || 'Expat Guest', " (", d.userId?.nationality || 'Foreign National', ")"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: `px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${d.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`
  }, d.status), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleWhatsAppTenant(d.userId?.name, d.userId?.phone, d.fileName),
    className: "px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] flex items-center space-x-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-xs"
  }), /*#__PURE__*/React.createElement("span", null, "WhatsApp Expat")), d.status === 'pending' && /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDocVerify(d._id, 'verified'),
    className: "px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px]"
  }, "Approve FRRO")))))));
};

/* --- public/js/pages/StaticPages.jsx --- */
// Passage Static Pages (About, Contact, FAQ, Terms, Privacy)

window.AboutPage = function AboutPage({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-4xl mx-auto px-4 py-12 space-y-8 text-slate-800 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 text-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-50 text-teal-700 font-extrabold text-[11px] uppercase px-3 py-1 rounded-full border border-teal-200"
  }, "About Passage"), /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-extrabold text-slate-900"
  }, "Making India Accessible to Expat Homes"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 max-w-xl mx-auto leading-relaxed"
  }, "Passage was founded to simplify home discovery, lease contracts, and Section 14 FRRO visa paperwork for foreign nationals relocating to India.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-passport"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-sm text-slate-900"
  }, "FRRO Paperwork"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 leading-relaxed"
  }, "Landlord-tenant lease agreements tailored for Indian online Form C registration.")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-vault"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-sm text-slate-900"
  }, "Escrow Guarantee"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 leading-relaxed"
  }, "Security deposits held in multi-currency escrow accounts with fair 2-month limits.")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-video"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-sm text-slate-900"
  }, "4K Live Tours"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 leading-relaxed"
  }, "Inspect water pressure, WiFi speeds, and neighborhood noise prior to flying in."))));
};
window.ContactPage = function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-2xl mx-auto px-4 py-12 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center space-y-2"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "Get in Touch with Expat Support"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "24/7 Concierge for Foreign Tenants & Landlords in India")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-xs space-y-4"
  }, submitted ? /*#__PURE__*/React.createElement("div", {
    className: "p-6 bg-teal-50 text-teal-800 text-center rounded-2xl space-y-2 font-bold"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check text-2xl text-teal-600 block"
  }), /*#__PURE__*/React.createElement("span", null, "Message Received! An expat concierge will reach out within 2 hours.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSubmitted(true);
    },
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Your Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    placeholder: "Lena Hoffman",
    className: "w-full bg-slate-50 border rounded-xl p-3"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Email"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    required: true,
    placeholder: "lena@passage.com",
    className: "w-full bg-slate-50 border rounded-xl p-3"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Subject / Query"), /*#__PURE__*/React.createElement("textarea", {
    rows: "4",
    required: true,
    placeholder: "FRRO Form C question or property inquiry...",
    className: "w-full bg-slate-50 border rounded-xl p-3"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full bg-teal-600 text-white font-extrabold py-3.5 rounded-xl shadow-md"
  }, "Send Message to Support"))));
};
window.FAQPage = function FAQPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-3xl mx-auto px-4 py-12 space-y-6 text-xs text-slate-800"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center space-y-2"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "Frequently Asked Questions"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500"
  }, "Everything foreigners need to know about renting homes in India")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-2xl border border-slate-200 space-y-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-slate-900 text-sm"
  }, "Can foreign nationals legally lease property in India?"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-600 leading-relaxed"
  }, "Yes! Foreign nationals holding valid Employment, Business, Tourist, or Student visas can legally lease residential properties in India for short or long durations.")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-2xl border border-slate-200 space-y-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-slate-900 text-sm"
  }, "What is FRRO Form C and why is it required?"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-600 leading-relaxed"
  }, "Under Section 14 of the Foreigners Act, property owners hosting foreign nationals must report their stay to the Bureau of Immigration via Form C within 14 days of arrival. Passage handles this automatically.")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-2xl border border-slate-200 space-y-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-slate-900 text-sm"
  }, "How does security deposit escrow protection work?"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-600 leading-relaxed"
  }, "Instead of standard local demands of 10 months rent up-front, Passage caps deposits at 2 months and holds funds in multi-currency escrow until lease start."))));
};
window.TermsPage = function TermsPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-3xl mx-auto px-4 py-12 space-y-4 text-xs text-slate-700 leading-relaxed"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "Terms & Conditions"), /*#__PURE__*/React.createElement("p", null, "Last updated: August 2026. Passage operates in compliance with Indian Tenancy Laws and Bureau of Immigration guidelines."), /*#__PURE__*/React.createElement("p", null, "1. ", /*#__PURE__*/React.createElement("strong", null, "Verification"), ": All property owners must provide proof of title or leasing authorization."), /*#__PURE__*/React.createElement("p", null, "2. ", /*#__PURE__*/React.createElement("strong", null, "Security Escrow"), ": Tenant security deposits are protected under Passage Escrow services until tenancy conclusion."));
};
window.PrivacyPage = function PrivacyPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-3xl mx-auto px-4 py-12 space-y-4 text-xs text-slate-700 leading-relaxed"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "Privacy Policy"), /*#__PURE__*/React.createElement("p", null, "Passage protects expat personal information and passport documents using AES-256 encryption. Documents are strictly used for FRRO Form C reporting and landlord identity verification."));
};

/* --- public/js/pages/TouristGuidePage.jsx --- */
// Passage Interactive Tourist Places & Expat City Guide Component

window.TouristGuidePage = function TouristGuidePage({
  onNavigate
}) {
  const [selectedCity, setSelectedCity] = React.useState('Chennai');
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [itinerary, setItinerary] = React.useState([]);
  const [itineraryDrawerOpen, setItineraryDrawerOpen] = React.useState(false);
  const [activeAttraction, setActiveAttraction] = React.useState(null);
  const touristMapRef = React.useRef(null);
  const mapInstance = React.useRef(null);
  const guideData = {
    Chennai: {
      tagline: 'Coastal Metro & Cultural Capital of South India',
      center: [13.0400, 80.2500],
      coverImg: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      places: [{
        id: 'c1',
        name: 'Marina Beach & Promenade',
        category: 'Beaches & Nature',
        lat: 13.0500,
        lng: 80.2824,
        img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        desc: 'World’s second longest natural urban beach, perfect for evening walks, street food, and heritage lighthouse views.'
      }, {
        id: 'c2',
        name: 'Kapaleeshwarar Temple (Mylapore)',
        category: 'Heritage & Monuments',
        lat: 13.0334,
        lng: 80.2698,
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        desc: '7th-century Dravidian temple complex dedicated to Lord Shiva with an ornate gopuram gateway tower.'
      }, {
        id: 'c3',
        name: 'San Thome Cathedral Basilica',
        category: 'Heritage & Monuments',
        lat: 13.0333,
        lng: 80.2782,
        img: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=600&q=80',
        desc: 'Stately Neo-Gothic Roman Catholic cathedral constructed over the tomb of St. Thomas the Apostle.'
      }, {
        id: 'c4',
        name: 'Fort St. George & Museum',
        category: 'Heritage & Monuments',
        lat: 13.0797,
        lng: 80.2875,
        img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
        desc: 'The first British fortress in India built in 1644, housing colonial artifacts and cannons.'
      }, {
        id: 'c5',
        name: 'Amethyst Cafe & Garden',
        category: 'Cafes & Dining',
        lat: 13.0583,
        lng: 80.2588,
        img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
        desc: 'Restored colonial mansion set in a lush tropical garden serving artisan coffee and continental brunch.'
      }, {
        id: 'c6',
        name: 'Phoenix Marketcity Mall',
        category: 'Shopping & Bazaars',
        lat: 12.9918,
        lng: 80.2170,
        img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
        desc: 'Mega shopping complex with global fashion brands, IMAX cinemas, and gourmet food courts.'
      }]
    },
    Bangalore: {
      tagline: 'Garden City, IT Innovation Capital & Craft Beer Hub',
      center: [12.9716, 77.5946],
      coverImg: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
      places: [{
        id: 'b1',
        name: 'Cubbon Park & Botanical Gardens',
        category: 'Beaches & Nature',
        lat: 12.9763,
        lng: 77.5929,
        img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
        desc: '300-acre lush green park in the city center surrounded by red-brick colonial government buildings.'
      }, {
        id: 'b2',
        name: 'Bangalore Palace & Grounds',
        category: 'Heritage & Monuments',
        lat: 13.0006,
        lng: 77.5922,
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        desc: 'Tudor-style royal palace featuring fortified towers, ornate wood carvings, and expansive gardens.'
      }, {
        id: 'b3',
        name: 'UB City Luxury Promenade',
        category: 'Shopping & Bazaars',
        lat: 12.9719,
        lng: 77.5957,
        img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
        desc: 'India’s pioneer luxury mall hosting high-end fashion houses and rooftop craft lounge bars.'
      }, {
        id: 'b4',
        name: 'Toit Craft Brewery (Indiranagar)',
        category: 'Cafes & Dining',
        lat: 12.9791,
        lng: 77.6405,
        img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        desc: 'Legendary microbrewery serving artisanal beers and woodfired gourmet pizzas.'
      }]
    },
    Mumbai: {
      tagline: 'Financial Capital, Sea-Facing Boulevards & Bollywood',
      center: [18.9220, 72.8347],
      coverImg: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
      places: [{
        id: 'm1',
        name: 'Gateway of India & Taj Palace',
        category: 'Heritage & Monuments',
        lat: 18.9220,
        lng: 72.8347,
        img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
        desc: '26-meter basalt archway erected on the waterfront alongside the historic 1903 Taj Mahal Hotel.'
      }, {
        id: 'm2',
        name: 'Marine Drive (Queen’s Necklace)',
        category: 'Beaches & Nature',
        lat: 18.9438,
        lng: 72.8232,
        img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        desc: '3.6 km C-shaped boulevard offering sweeping sunset views across Back Bay.'
      }, {
        id: 'm3',
        name: 'Bandra Fort & Promenade',
        category: 'Heritage & Monuments',
        lat: 19.0438,
        lng: 72.8193,
        img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
        desc: '1640 Castella de Aguada fort overlooking the Bandra-Worli Sea Link bridge.'
      }, {
        id: 'm4',
        name: 'The Table Colaba',
        category: 'Cafes & Dining',
        lat: 18.9240,
        lng: 72.8310,
        img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
        desc: 'San Francisco farm-to-table fine dining cafe popular with international executives.'
      }]
    },
    Delhi: {
      tagline: 'Diplomatic Capital, Mughal Monuments & Food Enclaves',
      center: [28.5900, 77.2200],
      coverImg: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
      places: [{
        id: 'd1',
        name: 'Lodhi Art District & Gardens',
        category: 'Beaches & Nature',
        lat: 28.5880,
        lng: 77.2215,
        img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
        desc: 'India’s first open-air public art district with 50+ murals, adjacent to 90-acre Mughal Lodhi Gardens.'
      }, {
        id: 'd2',
        name: 'Qutub Minar Complex',
        category: 'Heritage & Monuments',
        lat: 28.5245,
        lng: 77.1855,
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        desc: '73-meter fluted red sandstone victory tower erected in 1193.'
      }, {
        id: 'd3',
        name: 'Khan Market Boutique Enclave',
        category: 'Shopping & Bazaars',
        lat: 28.6002,
        lng: 77.2270,
        img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
        desc: 'Ranked among Asia’s most prestigious high-street retail markets.'
      }]
    },
    Goa: {
      tagline: 'Tropical Beaches, Portuguese Villas & Sunset Tavernas',
      center: [15.5800, 73.7400],
      coverImg: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
      places: [{
        id: 'g1',
        name: 'Ashwem Sunset Beach',
        category: 'Beaches & Nature',
        lat: 15.6582,
        lng: 73.7145,
        img: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=600&q=80',
        desc: 'Quiet, golden sand beach popular with foreign digital nomads and kite surfers.'
      }, {
        id: 'g2',
        name: 'Fontainhas Latin Quarter',
        category: 'Heritage & Monuments',
        lat: 15.4989,
        lng: 73.8278,
        img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
        desc: 'UNESCO-recognized heritage quarter featuring yellow & blue Portuguese villas.'
      }, {
        id: 'g3',
        name: 'Thalassa Greek Taverna',
        category: 'Cafes & Dining',
        lat: 15.6180,
        lng: 73.7430,
        img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        desc: 'Cliffside Mediterranean restaurant offering famous sunset views over the ocean.'
      }]
    },
    Hyderabad: {
      tagline: 'Cyberabad Tech Corridor & Royal Nizam Heritage',
      center: [17.4000, 78.4000],
      coverImg: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
      places: [{
        id: 'h1',
        name: 'Golconda Fort & Tombs',
        category: 'Heritage & Monuments',
        lat: 17.3833,
        lng: 78.4011,
        img: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
        desc: 'Imposing 16th-century fortress renowned for acoustic engineering and diamond vaults.'
      }, {
        id: 'h2',
        name: 'Hussain Sagar Buddha Statue',
        category: 'Beaches & Nature',
        lat: 17.4156,
        lng: 78.4750,
        img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        desc: 'Picturesque lake centered by an 18-meter monolithic granite Buddha statue.'
      }]
    },
    Kochi: {
      tagline: 'Kerala Backwaters, Chinese Fishing Nets & Fort Art',
      center: [9.9600, 76.2400],
      coverImg: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      places: [{
        id: 'k1',
        name: 'Chinese Fishing Nets Promenade',
        category: 'Heritage & Monuments',
        lat: 9.9680,
        lng: 76.2440,
        img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
        desc: '14th-century fixed land fishing installations introduced by Chinese traders.'
      }, {
        id: 'k2',
        name: 'Mattancherry Palace & Spice Market',
        category: 'Shopping & Bazaars',
        lat: 9.9580,
        lng: 76.2590,
        img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
        desc: 'Ancient spice markets, antique shops, and 1568 Paradesi Synagogue.'
      }]
    },
    Jaipur: {
      tagline: 'Pink City Royal Haveli Architecture & Gem Handicrafts',
      center: [26.9124, 75.7873],
      coverImg: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
      places: [{
        id: 'j1',
        name: 'Hawa Mahal (Palace of Winds)',
        category: 'Heritage & Monuments',
        lat: 26.9239,
        lng: 75.8267,
        img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
        desc: '5-story pink honeycomb facade built in 1799 with 953 screened lattice windows.'
      }, {
        id: 'j2',
        name: 'Amer Fort & Maota Lake',
        category: 'Heritage & Monuments',
        lat: 26.9855,
        lng: 75.8513,
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        desc: 'Majestic red sandstone and marble fort overlooking Maota Lake.'
      }]
    }
  };
  const currentGuide = guideData[selectedCity] || guideData['Chennai'];
  const filteredPlaces = activeCategory === 'All' ? currentGuide.places : currentGuide.places.filter(p => p.category === activeCategory);

  // Initialize Interactive Leaflet Map
  React.useEffect(() => {
    if (touristMapRef.current && currentGuide) {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
      const map = L.map(touristMapRef.current).setView(currentGuide.center, 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      filteredPlaces.forEach(p => {
        const marker = L.marker([p.lat, p.lng]).addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; max-width: 220px;">
            <img src="${p.img}" style="width: 100%; h-24; object-fit: cover; border-radius: 8px;" />
            <h4 style="font-weight: bold; font-size: 13px; margin-top: 6px;">${p.name}</h4>
            <p style="font-size: 10px; color: #0d9488; font-weight: bold;">${p.category}</p>
            <p style="font-size: 11px; color: #64748b; margin-top: 4px;">${p.desc}</p>
          </div>
        `);
      });
      mapInstance.current = map;
    }
  }, [selectedCity, activeCategory, filteredPlaces, currentGuide]);
  const toggleItinerary = place => {
    if (itinerary.some(item => item.id === place.id)) {
      setItinerary(itinerary.filter(item => item.id !== place.id));
    } else {
      setItinerary([...itinerary, place]);
      setItineraryDrawerOpen(true);
    }
  };
  const isSavedInItinerary = id => itinerary.some(item => item.id === id);
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-50 text-teal-700 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-teal-200 flex items-center space-x-1.5 w-fit"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-compass text-teal-600 animate-spin"
  }), /*#__PURE__*/React.createElement("span", null, "Interactive Expat Sightseeing Engine")), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900 mt-1"
  }, "Interactive Tourist Places & Expat Guide")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold"
  }, Object.keys(guideData).map(city => /*#__PURE__*/React.createElement("button", {
    key: city,
    onClick: () => {
      setSelectedCity(city);
      setActiveCategory('All');
    },
    className: `px-3 py-1.5 rounded-xl transition-all ${selectedCity === city ? 'bg-teal-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'}`
  }, city)))), /*#__PURE__*/React.createElement("div", {
    className: "relative h-64 rounded-3xl overflow-hidden shadow-2xl bg-slate-900 flex items-end p-8 text-white"
  }, /*#__PURE__*/React.createElement("img", {
    src: currentGuide.coverImg,
    alt: selectedCity,
    className: "absolute inset-0 w-full h-full object-cover opacity-50"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 space-y-1 max-w-2xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-500 text-slate-950 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-md"
  }, "Interactive Sightseeing Guide"), /*#__PURE__*/React.createElement("h2", {
    className: "text-3xl font-extrabold"
  }, selectedCity, " Landmarks & Attractions"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-300 font-medium"
  }, currentGuide.tagline)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setItineraryDrawerOpen(true),
    className: "absolute top-6 right-6 bg-slate-900/90 backdrop-blur-md border border-teal-500/40 text-teal-300 px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center space-x-2 shadow-xl hover:bg-slate-800"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-route text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "My Trip Itinerary (", itinerary.length, ")"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 text-xs font-bold"
  }, ['All', 'Heritage & Monuments', 'Beaches & Nature', 'Cafes & Dining', 'Shopping & Bazaars'].map(cat => /*#__PURE__*/React.createElement("button", {
    key: cat,
    onClick: () => setActiveCategory(cat),
    className: `px-4 py-2 rounded-xl transition-all ${activeCategory === cat ? 'bg-slate-900 text-teal-400 shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`
  }, cat))), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-slate-500 font-semibold"
  }, "Showing ", filteredPlaces.length, " interactive landmarks on map")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-1 bg-white p-3 rounded-3xl border border-slate-200 shadow-sm sticky top-24"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-3 py-2 border-b border-slate-100 mb-2 flex items-center justify-between text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-900 flex items-center space-x-1.5"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-map-location-dot text-teal-600"
  }), /*#__PURE__*/React.createElement("span", null, selectedCity, " Sightseeing Map")), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400"
  }, "Click pins for details")), /*#__PURE__*/React.createElement("div", {
    ref: touristMapRef,
    className: "w-full h-[520px] rounded-2xl border border-slate-200 z-10"
  })), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, filteredPlaces.map(place => {
    const saved = isSavedInItinerary(place.id);
    return /*#__PURE__*/React.createElement("div", {
      key: place.id,
      className: "bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
    }, /*#__PURE__*/React.createElement("div", {
      className: "relative aspect-[16/9] overflow-hidden bg-slate-900"
    }, /*#__PURE__*/React.createElement("img", {
      src: place.img,
      alt: place.name,
      className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    }), /*#__PURE__*/React.createElement("div", {
      className: "absolute top-3 left-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "bg-slate-950/90 text-teal-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg backdrop-blur-md border border-teal-500/30"
    }, place.category)), /*#__PURE__*/React.createElement("button", {
      onClick: () => toggleItinerary(place),
      className: `absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${saved ? 'bg-teal-600 text-white shadow-lg' : 'bg-slate-950/60 text-white hover:bg-slate-950'}`,
      title: saved ? "Remove from Trip Plan" : "Add to Trip Plan"
    }, /*#__PURE__*/React.createElement("i", {
      className: `fa-solid ${saved ? 'fa-check' : 'fa-plus'} text-xs`
    }))), /*#__PURE__*/React.createElement("div", {
      className: "p-5 flex-1 flex flex-col justify-between space-y-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "font-extrabold text-sm text-slate-900 group-hover:text-teal-700 transition-colors"
    }, place.name), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-slate-600 line-clamp-3 mt-1 leading-relaxed"
    }, place.desc)), /*#__PURE__*/React.createElement("div", {
      className: "pt-3 border-t border-slate-100 flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onNavigate('search', {
        city: selectedCity
      }),
      className: "text-xs font-extrabold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-house-chimney text-xs"
    }), /*#__PURE__*/React.createElement("span", null, "Find Homes Nearby")), /*#__PURE__*/React.createElement("button", {
      onClick: () => toggleItinerary(place),
      className: `text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${saved ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`
    }, saved ? 'In Itinerary' : '+ Add to Trip'))));
  })))), itineraryDrawerOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-900 border-l border-slate-800 text-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl animate-slideLeft"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-slate-800 pb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-extrabold text-lg"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-route"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-base text-white"
  }, "My Sightseeing Itinerary"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400"
  }, itinerary.length, " saved landmarks in India"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setItineraryDrawerOpen(false),
    className: "text-slate-400 hover:text-white"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark text-lg"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 max-h-[480px] overflow-y-auto pr-1"
  }, itinerary.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400 py-8 text-center"
  }, "No landmarks added yet. Click \"+ Add to Trip\" on any attraction card!") : itinerary.map((item, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-extrabold flex items-center justify-center text-[10px]"
  }, idx + 1), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-white block"
  }, item.name), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-teal-400"
  }, item.category))), /*#__PURE__*/React.createElement("button", {
    onClick: () => toggleItinerary(item),
    className: "text-slate-400 hover:text-red-400 p-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash text-xs"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 border-t border-slate-800 space-y-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setItineraryDrawerOpen(false);
      onNavigate('search', {
        city: selectedCity
      });
    },
    className: "w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-xl shadow-teal-600/30"
  }, "Find Furnished Homes Near My Itinerary")))));
};

/* --- public/js/App.jsx --- */
// Main Passage Expat Housing Application Component

window.App = function App() {
  const [currentView, setCurrentView] = React.useState('home');
  const [viewParams, setViewParams] = React.useState({});

  // App Global State
  const [currentUser, setCurrentUser] = React.useState(null);
  const [activeCurrency, setActiveCurrency] = React.useState('INR');
  const [currencyRates, setCurrencyRates] = React.useState({
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    JPY: 1.8,
    SGD: 0.016,
    AUD: 0.018,
    CAD: 0.016
  });
  const [properties, setProperties] = React.useState([]);
  const [wishlist, setWishlist] = React.useState([]);
  const [selectedPropertyForBooking, setSelectedPropertyForBooking] = React.useState(null);
  const [bookingDraft, setBookingDraft] = React.useState(null);
  const [lastConfirmedBooking, setLastConfirmedBooking] = React.useState(null);

  // Modals
  const [authModalMode, setAuthModalMode] = React.useState(null); // 'login' | 'signup' | null
  const [aiModalOpen, setAiModalOpen] = React.useState(false);

  // Load User, Currency Rates & Initial Properties on Startup
  React.useEffect(() => {
    // Check local storage for logged in user
    const storedUser = window.PassageAPI.getStoredUser();
    if (storedUser) {
      setCurrentUser(storedUser);
      // Fetch user's wishlist
      window.PassageAPI.getWishlist().then(res => {
        if (Array.isArray(res)) {
          setWishlist(res.map(p => p._id || p));
        }
      }).catch(() => {});
    }

    // Fetch Currency Exchange Rates
    window.PassageAPI.getRates().then(rates => {
      if (rates && typeof rates === 'object') {
        setCurrencyRates(rates);
      }
    }).catch(() => {});

    // Pre-load Verified Properties
    window.PassageAPI.getProperties().then(res => {
      if (Array.isArray(res) && res.length > 0) {
        setProperties(res);
      }
    }).catch(console.error);
  }, []);
  const handleNavigate = (view, params = {}) => {
    if (params && params.booking) {
      setLastConfirmedBooking(params.booking);
    }
    setCurrentView(view);
    setViewParams(params || {});
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };
  const handleSelectProperty = (id, propertyObj) => {
    const targetProp = propertyObj || (Array.isArray(properties) ? properties.find(p => p && (p._id === id || String(p._id) === String(id))) : null);
    if (targetProp) {
      setSelectedPropertyForBooking(targetProp);
    }
    handleNavigate('property-detail', {
      id: id && id._id || id,
      property: targetProp
    });
  };
  const handleToggleWishlist = async propertyId => {
    try {
      const res = await window.PassageAPI.toggleWishlist(propertyId);
      if (res && res.wishlist) {
        setWishlist(res.wishlist.map(p => p._id || p));
      } else {
        setWishlist(prev => prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]);
      }
    } catch (err) {
      // Optimistic update fallback
      setWishlist(prev => prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]);
    }
  };
  const handleStartBooking = (propertyId, bookingDetails) => {
    const prop = selectedPropertyForBooking || properties.find(p => p._id === propertyId);
    setSelectedPropertyForBooking(prop);
    setBookingDraft(bookingDetails);
    handleNavigate('booking');
  };
  const handleProceedToPayment = finalDraft => {
    setBookingDraft(finalDraft);
    handleNavigate('payment');
  };
  const handlePaymentSuccess = confirmedBooking => {
    setLastConfirmedBooking(confirmedBooking);
    handleNavigate('booking-confirmation');
  };
  const handleAuthSuccess = user => {
    setCurrentUser(user);
    setAuthModalMode(null);
    window.PassageAPI.getWishlist().then(res => {
      if (Array.isArray(res)) {
        setWishlist(res.map(p => p._id || p));
      }
    }).catch(() => {});
  };
  const handleLogout = () => {
    window.PassageAPI.removeToken();
    window.PassageAPI.removeStoredUser();
    setCurrentUser(null);
    handleNavigate('home');
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col min-h-screen"
  }, /*#__PURE__*/React.createElement(window.Navbar, {
    currentUser: currentUser,
    activeCurrency: activeCurrency,
    onCurrencyChange: setActiveCurrency,
    wishlistCount: wishlist.length,
    currentView: currentView,
    onNavigate: handleNavigate,
    onOpenAuth: mode => setAuthModalMode(mode),
    onLogout: handleLogout,
    onOpenAI: () => setAiModalOpen(true)
  }), /*#__PURE__*/React.createElement("main", {
    className: "flex-1"
  }, currentView === 'home' && /*#__PURE__*/React.createElement(window.HomePage, {
    properties: properties,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    wishlist: wishlist,
    onToggleWishlist: handleToggleWishlist,
    onSelectProperty: handleSelectProperty,
    onNavigate: handleNavigate,
    onOpenAI: () => setAiModalOpen(true)
  }), currentView === 'search' && /*#__PURE__*/React.createElement(window.SearchPage, {
    initialFilters: viewParams,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    wishlist: wishlist,
    onToggleWishlist: handleToggleWishlist,
    onSelectProperty: handleSelectProperty,
    onNavigate: handleNavigate
  }), currentView === 'property-detail' && /*#__PURE__*/React.createElement(window.PropertyDetailPage, {
    propertyId: viewParams?.id,
    initialProperty: viewParams?.property || selectedPropertyForBooking,
    properties: properties,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    wishlist: wishlist,
    onToggleWishlist: handleToggleWishlist,
    onStartBooking: handleStartBooking,
    onNavigate: handleNavigate
  }), currentView === 'booking' && /*#__PURE__*/React.createElement(window.BookingPage, {
    property: selectedPropertyForBooking,
    bookingDraft: bookingDraft,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    onProceedToPayment: handleProceedToPayment,
    onNavigate: handleNavigate
  }), currentView === 'payment' && /*#__PURE__*/React.createElement(window.PaymentPage, {
    bookingDraft: bookingDraft,
    property: selectedPropertyForBooking,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    onPaymentSuccess: handlePaymentSuccess,
    onNavigate: handleNavigate
  }), currentView === 'booking-confirmation' && /*#__PURE__*/React.createElement(window.BookingConfirmationPage, {
    booking: lastConfirmedBooking,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    onNavigate: handleNavigate
  }), currentView === 'my-bookings' && /*#__PURE__*/React.createElement(window.MyBookingsPage, {
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    onNavigate: handleNavigate
  }), currentView === 'wishlist' && /*#__PURE__*/React.createElement(window.WishlistPage, {
    wishlist: wishlist,
    properties: properties,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    onToggleWishlist: handleToggleWishlist,
    onSelectProperty: handleSelectProperty,
    onNavigate: handleNavigate
  }), currentView === 'profile' && /*#__PURE__*/React.createElement(window.UserProfilePage, {
    currentUser: currentUser,
    onNavigate: handleNavigate,
    onAuthSuccess: handleAuthSuccess
  }), currentView === 'owner-dashboard' && /*#__PURE__*/React.createElement(window.OwnerDashboard, {
    currentUser: currentUser,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    onNavigate: handleNavigate
  }), currentView === 'admin-dashboard' && /*#__PURE__*/React.createElement(window.AdminDashboard, {
    currentUser: currentUser,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    onNavigate: handleNavigate
  }), currentView === 'about' && /*#__PURE__*/React.createElement(window.AboutPage, {
    onNavigate: handleNavigate
  }), currentView === 'frro-guide' && /*#__PURE__*/React.createElement(window.FrroGuidePage, {
    onNavigate: handleNavigate
  }), currentView === 'faq' && /*#__PURE__*/React.createElement(window.FaqPage, {
    onNavigate: handleNavigate
  }), currentView === 'privacy' && /*#__PURE__*/React.createElement(window.PrivacyPage, {
    onNavigate: handleNavigate
  }), currentView === 'terms' && /*#__PURE__*/React.createElement(window.TermsPage, {
    onNavigate: handleNavigate
  }), currentView === 'tourist-guide' && /*#__PURE__*/React.createElement(window.TouristGuidePage, {
    onNavigate: handleNavigate,
    onSelectProperty: handleSelectProperty
  })), /*#__PURE__*/React.createElement(window.Footer, {
    onNavigate: handleNavigate
  }), authModalMode && /*#__PURE__*/React.createElement(window.AuthModal, {
    mode: authModalMode,
    onClose: () => setAuthModalMode(null),
    onSuccess: handleAuthSuccess,
    onSwitchMode: newMode => setAuthModalMode(newMode)
  }), aiModalOpen && /*#__PURE__*/React.createElement(window.AIAssistantModal, {
    isOpen: true,
    onClose: () => setAiModalOpen(false),
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    onNavigate: handleNavigate,
    onSelectProperty: handleSelectProperty
  }));
};

function mountPassageApp() {
  const rootEl = document.getElementById('root');
  if (!rootEl) return;

  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined' || typeof window.App === 'undefined') {
    setTimeout(mountPassageApp, 50);
    return;
  }

  try {
    if (!window._passageAppMounted) {
      window._passageAppMounted = true;
      const root = ReactDOM.createRoot(rootEl);
      root.render(React.createElement(window.App));
    }
  } catch (e) {
    console.error('Passage App Mount Error:', e);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountPassageApp);
} else {
  mountPassageApp();
}
