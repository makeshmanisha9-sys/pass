// Main Passage Expat Housing Application Component

window.App = function App() {
  const [currentView, setCurrentView] = React.useState('home');
  const [viewParams, setViewParams] = React.useState({});
  
  // App Global State
  const [currentUser, setCurrentUser] = React.useState(null);
  const [activeCurrency, setActiveCurrency] = React.useState('INR');
  const [currencyRates, setCurrencyRates] = React.useState({ INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.8, SGD: 0.016, AUD: 0.018, CAD: 0.016 });
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
      window.PassageAPI.getWishlist()
        .then(res => {
          if (Array.isArray(res)) {
            setWishlist(res.map(p => p._id || p));
          }
        })
        .catch(() => {});
    }

    // Fetch Currency Exchange Rates
    window.PassageAPI.getRates()
      .then(rates => {
        if (rates && typeof rates === 'object') {
          setCurrencyRates(rates);
        }
      })
      .catch(() => {});

    // Pre-load Verified Properties
    window.PassageAPI.getProperties()
      .then(res => {
        if (Array.isArray(res) && res.length > 0) {
          setProperties(res);
        }
      })
      .catch(console.error);
  }, []);

  const handleNavigate = (view, params = {}) => {
    if (params && params.booking) {
      setLastConfirmedBooking(params.booking);
    }
    setCurrentView(view);
    setViewParams(params || {});
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectProperty = (id, propertyObj) => {
    const targetProp = propertyObj || (Array.isArray(properties) ? properties.find(p => p && (p._id === id || String(p._id) === String(id))) : null);
    if (targetProp) {
      setSelectedPropertyForBooking(targetProp);
    }
    handleNavigate('property-detail', { id: (id && id._id) || id, property: targetProp });
  };

  const handleToggleWishlist = async (propertyId) => {
    try {
      const res = await window.PassageAPI.toggleWishlist(propertyId);
      if (res && res.wishlist) {
        setWishlist(res.wishlist.map(p => p._id || p));
      } else {
        setWishlist(prev => 
          prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
        );
      }
    } catch (err) {
      // Optimistic update fallback
      setWishlist(prev => 
        prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
      );
    }
  };

  const handleStartBooking = (propertyId, bookingDetails) => {
    if (!currentUser) {
      setAuthModalMode('login');
      return;
    }
    const prop = selectedPropertyForBooking || properties.find(p => p._id === propertyId);
    setSelectedPropertyForBooking(prop);
    setBookingDraft(bookingDetails);
    handleNavigate('booking');
  };

  const handleProceedToPayment = (finalDraft) => {
    if (!currentUser) {
      setAuthModalMode('login');
      return;
    }
    setBookingDraft(finalDraft);
    handleNavigate('payment');
  };

  const handlePaymentSuccess = (confirmedBooking) => {
    setLastConfirmedBooking(confirmedBooking);
    handleNavigate('booking-confirmation');
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setAuthModalMode(null);
    window.PassageAPI.getWishlist()
      .then(res => {
        if (Array.isArray(res)) {
          setWishlist(res.map(p => p._id || p));
        }
      })
      .catch(() => {});
  };

  const handleLogout = () => {
    window.PassageAPI.removeToken();
    window.PassageAPI.removeStoredUser();
    setCurrentUser(null);
    handleNavigate('home');
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Global Navigation Header */}
      <window.Navbar 
        currentUser={currentUser}
        activeCurrency={activeCurrency}
        onCurrencyChange={setActiveCurrency}
        wishlistCount={wishlist.length}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onLogout={handleLogout}
        onOpenAI={() => setAiModalOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <window.HomePage 
            properties={properties}
            activeCurrency={activeCurrency}
            currencyRates={currencyRates}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onSelectProperty={handleSelectProperty}
            onNavigate={handleNavigate}
            onOpenAI={() => setAiModalOpen(true)}
          />
        )}

        {currentView === 'search' && (
          <window.SearchPage 
            initialFilters={viewParams}
            activeCurrency={activeCurrency}
            currencyRates={currencyRates}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onSelectProperty={handleSelectProperty}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'property-detail' && (
          <window.PropertyDetailPage 
            propertyId={viewParams?.id}
            initialProperty={viewParams?.property || selectedPropertyForBooking}
            properties={properties}
            activeCurrency={activeCurrency}
            currencyRates={currencyRates}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onStartBooking={handleStartBooking}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'booking' && (
          <window.BookingPage 
            property={selectedPropertyForBooking}
            bookingDraft={bookingDraft}
            activeCurrency={activeCurrency}
            currencyRates={currencyRates}
            onProceedToPayment={handleProceedToPayment}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'payment' && (
          <window.PaymentPage 
            bookingDraft={bookingDraft}
            property={selectedPropertyForBooking}
            activeCurrency={activeCurrency}
            currencyRates={currencyRates}
            onPaymentSuccess={handlePaymentSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'booking-confirmation' && (
          <window.BookingConfirmationPage 
            booking={lastConfirmedBooking}
            activeCurrency={activeCurrency}
            currencyRates={currencyRates}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'my-bookings' && (
          <window.MyBookingsPage 
            activeCurrency={activeCurrency}
            currencyRates={currencyRates}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'wishlist' && (
          <window.WishlistPage 
            wishlist={wishlist}
            properties={properties}
            activeCurrency={activeCurrency}
            currencyRates={currencyRates}
            onToggleWishlist={handleToggleWishlist}
            onSelectProperty={handleSelectProperty}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'profile' && (
          <window.UserProfilePage 
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onAuthSuccess={handleAuthSuccess}
          />
        )}

        {currentView === 'owner-dashboard' && (
          <window.OwnerDashboard 
            currentUser={currentUser}
            activeCurrency={activeCurrency}
            currencyRates={currencyRates}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <window.AdminDashboard 
            currentUser={currentUser}
            activeCurrency={activeCurrency}
            currencyRates={currencyRates}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'about' && <window.AboutPage onNavigate={handleNavigate} />}
        {currentView === 'frro-guide' && <window.FrroGuidePage onNavigate={handleNavigate} />}
        {currentView === 'faq' && <window.FaqPage onNavigate={handleNavigate} />}
        {currentView === 'privacy' && <window.PrivacyPage onNavigate={handleNavigate} />}
        {currentView === 'terms' && <window.TermsPage onNavigate={handleNavigate} />}
        {currentView === 'tourist-guide' && <window.TouristGuidePage onNavigate={handleNavigate} onSelectProperty={handleSelectProperty} />}
      </main>

      {/* Global Navigation Footer */}
      <window.Footer onNavigate={handleNavigate} />

      {/* Auth Modal (Login / Signup) */}
      {authModalMode && (
        <window.AuthModal 
          mode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onSuccess={handleAuthSuccess}
          onSwitchMode={(newMode) => setAuthModalMode(newMode)}
        />
      )}

      {/* AI Assistant Drawer Modal */}
      {aiModalOpen && (
        <window.AIAssistantModal 
          isOpen={true}
          onClose={() => setAiModalOpen(false)}
          activeCurrency={activeCurrency}
          currencyRates={currencyRates}
          onNavigate={handleNavigate}
          onSelectProperty={handleSelectProperty}
        />
      )}

    </div>
  );
};
