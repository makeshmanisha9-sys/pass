// Root App Component for Passage Platform

window.App = function App() {
  const [currentView, setCurrentView] = React.useState('home');
  const [viewParams, setViewParams] = React.useState({});
  const [activeCurrency, setActiveCurrency] = React.useState('INR');
  const [currencyRates, setCurrencyRates] = React.useState({});
  const [properties, setProperties] = React.useState([]);

  // LocalStorage-backed guest & auth wishlist state
  const [wishlist, setWishlist] = React.useState(() => {
    try {
      const saved = localStorage.getItem('passage_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [currentUser, setCurrentUser] = React.useState(window.PassageAPI.getStoredUser());
  const [authModalMode, setAuthModalMode] = React.useState(null); // 'login' | 'register' | null
  const [aiModalOpen, setAiModalOpen] = React.useState(false);
  const [bookingDraft, setBookingDraft] = React.useState(null);
  const [selectedPropertyForBooking, setSelectedPropertyForBooking] = React.useState(null);
  const [lastConfirmedBooking, setLastConfirmedBooking] = React.useState(null);

  // Sync wishlist state to localStorage whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem('passage_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.log('LocalStorage wishlist sync err:', e);
    }
  }, [wishlist]);

  // Initial Data Fetching
  React.useEffect(() => {
    // Fetch Currency Rates
    window.PassageAPI.getCurrencyRates().then(rates => setCurrencyRates(rates || {})).catch(err => console.log('Currency rates err:', err));

    // Fetch Properties
    window.PassageAPI.getProperties().then(data => setProperties(data || [])).catch(err => console.log('Fetch properties err:', err));

    // Check Current User Session
    if (window.PassageAPI.getToken()) {
      window.PassageAPI.getCurrentUser().then(res => {
        if (res && res.user) {
          setCurrentUser(res.user);
          window.PassageAPI.setStoredUser(res.user);
        }
      }).catch(err => {
        console.log('Session expired:', err);
        window.PassageAPI.removeToken();
        window.PassageAPI.removeStoredUser();
        setCurrentUser(null);
      });

      // Fetch User Wishlist from API
      window.PassageAPI.getWishlist().then(res => {
        if (Array.isArray(res)) {
          const serverIds = res.map(p => p._id || p);
          setWishlist(prev => Array.from(new Set([...prev, ...serverIds])));
        } else if (res && res.wishlist) {
          const serverIds = res.wishlist.map(p => p._id || p);
          setWishlist(prev => Array.from(new Set([...prev, ...serverIds])));
        }
      }).catch(err => console.log('Wishlist fetch err:', err));
    }
  }, []);
  const handleNavigate = (view, params = {}) => {
    setCurrentView(view);
    setViewParams(params || {});
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handleToggleWishlist = async propertyId => {
    // Optimistic state update for instant UI feedback
    const alreadySaved = wishlist.includes(propertyId);
    const updatedWishlist = alreadySaved ? wishlist.filter(id => id !== propertyId) : [...wishlist, propertyId];
    setWishlist(updatedWishlist);

    // Sync with backend API if user is authenticated
    if (currentUser && window.PassageAPI.getToken()) {
      try {
        const res = await window.PassageAPI.toggleWishlist(propertyId);
        if (res && res.wishlist) {
          const apiIds = res.wishlist.map(p => typeof p === 'object' ? p._id : p);
          setWishlist(apiIds);
        }
      } catch (err) {
        console.log('Wishlist backend sync error:', err);
      }
    }
  };
  const handleStartBooking = (propertyId, bookingDetails) => {
    if (!currentUser) {
      setAuthModalMode('login');
      return;
    }
    const prop = properties.find(p => p._id === propertyId);
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
    onSelectProperty: id => handleNavigate('property-detail', {
      id
    }),
    onNavigate: handleNavigate,
    onOpenAI: () => setAiModalOpen(true)
  }), currentView === 'search' && /*#__PURE__*/React.createElement(window.SearchPage, {
    initialFilters: viewParams,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    wishlist: wishlist,
    onToggleWishlist: handleToggleWishlist,
    onSelectProperty: id => handleNavigate('property-detail', {
      id
    })
  }), currentView === 'property-detail' && /*#__PURE__*/React.createElement(window.PropertyDetailPage, {
    propertyId: viewParams.id,
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
    onSelectProperty: id => handleNavigate('property-detail', {
      id
    }),
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
  }), currentView === 'tourist-guide' && /*#__PURE__*/React.createElement(window.TouristGuidePage, {
    onNavigate: handleNavigate
  }), currentView === 'contact' && /*#__PURE__*/React.createElement(window.ContactPage, null), currentView === 'faq' && /*#__PURE__*/React.createElement(window.FAQPage, null), currentView === 'terms' && /*#__PURE__*/React.createElement(window.TermsPage, null), currentView === 'privacy' && /*#__PURE__*/React.createElement(window.PrivacyPage, null)), /*#__PURE__*/React.createElement(window.Footer, {
    onNavigate: handleNavigate
  }), /*#__PURE__*/React.createElement(window.AIAssistantModal, {
    isOpen: aiModalOpen,
    onClose: () => setAiModalOpen(false),
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    onSelectProperty: id => handleNavigate('property-detail', {
      id
    })
  }), authModalMode && /*#__PURE__*/React.createElement(window.AuthModal, {
    mode: authModalMode,
    onClose: () => setAuthModalMode(null),
    onAuthSuccess: handleAuthSuccess
  }));
};

// Mount Passage React App safely after Babel standalone transpiles all window components
function mountPassageApp() {
  const container = document.getElementById('root');
  if (container && window.ReactDOM && window.React && window.Navbar && window.HomePage) {
    const root = ReactDOM.createRoot(container);
    root.render(/*#__PURE__*/React.createElement(window.App, null));
  } else {
    setTimeout(mountPassageApp, 50);
  }
}
if (document.readyState === 'complete') {
  setTimeout(mountPassageApp, 50);
} else {
  window.addEventListener('load', () => setTimeout(mountPassageApp, 50));
}