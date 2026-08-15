// Passage Clean Sleek Navbar Component with Three-Dots (⋮) Quick Menu & Tourist Places

window.Navbar = function Navbar({ currentUser, activeCurrency, onCurrencyChange, wishlistCount, currentView, onNavigate, onOpenAuth, onLogout, onOpenAI }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [threeDotsMenuOpen, setThreeDotsMenuOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [touristDropdownOpen, setTouristDropdownOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    if (currentUser) {
      window.PassageAPI.getNotifications()
        .then(data => setNotifications(data || []))
        .catch(err => console.log('Notification fetch err:', err));
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

  const citiesList = [
    { name: 'Chennai', desc: 'Marina Beach & Temples', icon: 'fa-umbrella-beach' },
    { name: 'Bangalore', desc: 'Cubbon Park & Breweries', icon: 'fa-tree' },
    { name: 'Mumbai', desc: 'Gateway & Marine Drive', icon: 'fa-city' },
    { name: 'Delhi', desc: 'Qutub Minar & Lodhi Art', icon: 'fa-monument' },
    { name: 'Hyderabad', desc: 'Golconda Fort & Biryani', icon: 'fa-chess-rook' },
    { name: 'Goa', desc: 'Ashwem Sunset Beaches', icon: 'fa-sun' },
    { name: 'Kochi', desc: 'Chinese Fishing Nets', icon: 'fa-anchor' },
    { name: 'Jaipur', desc: 'Hawa Mahal & Amer Fort', icon: 'fa-crown' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-900 font-extrabold text-xl shadow-lg shadow-teal-500/20">
              P
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
                Passage<span className="text-teal-400">.</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Foreigner Homes India
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold">
            
            <button 
              onClick={() => handleNavClick('search')} 
              className={`hover:text-teal-400 transition-colors flex items-center space-x-2 ${currentView === 'search' ? 'text-teal-400 font-extrabold' : 'text-slate-300'}`}
            >
              <i className="fa-solid fa-compass text-teal-400"></i>
              <span>Explore Stays</span>
            </button>

            {/* Tourist Places Dropdown Menu */}
            <div className="relative">
              <button 
                onClick={() => setTouristDropdownOpen(!touristDropdownOpen)} 
                className={`hover:text-teal-400 transition-colors flex items-center space-x-1.5 py-2 ${currentView === 'tourist-guide' ? 'text-teal-400 font-extrabold' : 'text-slate-300'}`}
              >
                <i className="fa-solid fa-camera text-teal-400"></i>
                <span>Tourist Places</span>
                <i className="fa-solid fa-chevron-down text-[10px] text-slate-400 ml-1"></i>
              </button>

              {touristDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-slate-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2 px-2">
                    <span className="text-[11px] font-extrabold uppercase text-teal-400 tracking-wider">Top Indian Destinations</span>
                    <button 
                      onClick={() => handleNavClick('tourist-guide')} 
                      className="text-[10px] text-slate-400 hover:text-white font-bold underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    {citiesList.map(c => (
                      <button 
                        key={c.name}
                        onClick={() => handleNavClick('tourist-guide', { city: c.name })}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs">
                          <i className={`fa-solid ${c.icon}`}></i>
                        </div>
                        <div>
                          <span className="font-bold text-xs text-white group-hover:text-teal-300 block">{c.name}</span>
                          <span className="text-[10px] text-slate-400 truncate block">{c.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={onOpenAI} 
              className="bg-slate-800/80 hover:bg-slate-800 text-teal-300 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-2 hover:border-teal-400 shadow-sm"
            >
              <i className="fa-solid fa-wand-magic-sparkles text-teal-400 animate-pulse"></i>
              <span>AI Assistant</span>
            </button>

            {/* THREE DOTS (⋮) QUICK KEBAB MENU TRIGGER BUTTON */}
            <div className="relative">
              <button 
                onClick={() => setThreeDotsMenuOpen(!threeDotsMenuOpen)}
                className={`w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-400 flex items-center justify-center transition-all shadow-md ${
                  threeDotsMenuOpen ? 'ring-2 ring-teal-500 bg-slate-700 text-white' : ''
                }`}
                title="Open Navigation Menu"
              >
                <i className="fa-solid fa-ellipsis-vertical text-lg"></i>
              </button>

              {/* THREE DOTS (⋮) FLOATING QUICK MENU DRAWER */}
              {threeDotsMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-3 z-50 text-slate-200 space-y-1">
                  
                  <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase text-teal-400 tracking-wider">Passage Menu</span>
                    <i className="fa-solid fa-ellipsis text-slate-500"></i>
                  </div>

                  <button 
                    onClick={() => handleNavClick('search')} 
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs">
                      <i className="fa-solid fa-compass"></i>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">Explore Verified Stays</span>
                      <span className="text-[10px] text-slate-400">Search homes across 8 Indian cities</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleNavClick('tourist-guide')} 
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs">
                      <i className="fa-solid fa-camera"></i>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">Tourist Places & Map</span>
                      <span className="text-[10px] text-slate-400">Interactive landmarks & trip itinerary</span>
                    </div>
                  </button>

                  <button 
                    onClick={onOpenAI} 
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs">
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-teal-300 block">AI Relocation Assistant</span>
                      <span className="text-[10px] text-slate-400">Natural language chat concierge</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleNavClick('about')} 
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs">
                      <i className="fa-solid fa-book"></i>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">Expat & FRRO Guide</span>
                      <span className="text-[10px] text-slate-400">Visa Form C compliance rules</span>
                    </div>
                  </button>

                  <div className="border-t border-slate-800 my-1 pt-1"></div>

                  <button 
                    onClick={() => handleNavClick('profile')} 
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs">
                      <i className="fa-solid fa-passport"></i>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">My Passport & Visa Vault</span>
                      <span className="text-[10px] text-slate-400">Manage uploaded documents</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => handleNavClick('my-bookings')} 
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-xs">
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">My Reservations</span>
                      <span className="text-[10px] text-slate-400">Active stay bookings</span>
                    </div>
                  </button>

                  {(currentUser?.role === 'owner' || currentUser?.role === 'admin') && (
                    <button 
                      onClick={() => handleNavClick('owner-dashboard')} 
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs">
                        <i className="fa-solid fa-chart-line"></i>
                      </div>
                      <div>
                        <span className="font-bold text-xs text-teal-300 block">Owner Dashboard</span>
                        <span className="text-[10px] text-slate-400">Manage listings & approvals</span>
                      </div>
                    </button>
                  )}

                  {currentUser?.role === 'admin' && (
                    <button 
                      onClick={() => handleNavClick('admin-dashboard')} 
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center space-x-3 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs">
                        <i className="fa-solid fa-shield-halved"></i>
                      </div>
                      <div>
                        <span className="font-bold text-xs text-amber-400 block">Admin Control Center</span>
                        <span className="text-[10px] text-slate-400">Platform GMV & verify vault</span>
                      </div>
                    </button>
                  )}

                </div>
              )}
            </div>

          </nav>

          {/* Controls & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Currency Selector */}
            <div className="relative">
              <select 
                value={activeCurrency}
                onChange={(e) => onCurrencyChange(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:border-teal-500 cursor-pointer shadow-sm"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
                <option value="AUD">A$ AUD</option>
                <option value="CAD">C$ CAD</option>
                <option value="SGD">S$ SGD</option>
                <option value="JPY">¥ JPY</option>
              </select>
            </div>

            {/* Wishlist Button */}
            <button 
              onClick={() => handleNavClick('wishlist')}
              className="relative p-2 text-slate-300 hover:text-teal-400 transition-colors"
              title="Saved Wishlist"
            >
              <i className="fa-regular fa-heart text-xl"></i>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-500 text-slate-950 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            {currentUser && (
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-slate-300 hover:text-teal-400 transition-colors"
                  title="Notifications"
                >
                  <i className="fa-regular fa-bell text-xl"></i>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-amber-500 w-2.5 h-2.5 rounded-full ring-4 ring-slate-900 animate-ping"></span>
                  )}
                </button>

                {/* Notifications Drawer */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-slate-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
                      <span className="font-bold text-sm text-white">In-App Notifications</span>
                      <span className="text-xs text-teal-400 font-semibold">{unreadCount} New</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 py-4 text-center">No notifications yet.</p>
                      ) : (
                        notifications.map((n, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-900/60 rounded-xl text-xs space-y-1 border border-slate-700/50">
                            <div className="font-bold text-teal-300 flex items-center justify-between">
                              <span>{n.title}</span>
                              <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-300 text-[11px]">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth Buttons / Profile Dropdown */}
            {!currentUser ? (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-600/30 transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full border border-slate-700 transition-colors"
                >
                  <img 
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} 
                    alt={currentUser.name} 
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/50"
                  />
                  <span className="hidden sm:block text-xs font-bold text-slate-200 pr-2 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <i className="fa-solid fa-chevron-down text-slate-400 text-xs pr-1"></i>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-slate-200 text-xs font-medium">
                    <div className="px-4 py-2.5 border-b border-slate-700">
                      <p className="font-bold text-white text-sm">{currentUser.name}</p>
                      <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-teal-500/20 text-teal-300 text-[10px] font-extrabold uppercase rounded-md border border-teal-500/30">
                        {currentUser.role}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleNavClick('profile')}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-700 flex items-center space-x-2"
                    >
                      <i className="fa-solid fa-user-gear text-slate-400"></i>
                      <span>My Profile & Passport</span>
                    </button>

                    <button 
                      onClick={() => handleNavClick('my-bookings')}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-700 flex items-center space-x-2"
                    >
                      <i className="fa-solid fa-receipt text-slate-400"></i>
                      <span>My Bookings</span>
                    </button>

                    {(currentUser.role === 'owner' || currentUser.role === 'admin') && (
                      <button 
                        onClick={() => handleNavClick('owner-dashboard')}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-700 text-teal-300 font-bold flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-chart-line text-teal-400"></i>
                        <span>Owner Dashboard</span>
                      </button>
                    )}

                    {currentUser.role === 'admin' && (
                      <button 
                        onClick={() => handleNavClick('admin-dashboard')}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-700 text-amber-400 font-bold flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-shield-halved text-amber-400"></i>
                        <span>Admin Control Center</span>
                      </button>
                    )}

                    <div className="border-t border-slate-700 mt-1 pt-1">
                      <button 
                        onClick={() => { setProfileDropdownOpen(false); onLogout(); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-500/20 text-red-400 font-bold flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-right-from-bracket text-red-400"></i>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Three Dots (⋮) Button */}
            <button 
              onClick={() => setThreeDotsMenuOpen(!threeDotsMenuOpen)}
              className="lg:hidden p-2 text-teal-400 hover:text-white"
              title="Open Menu"
            >
              <i className="fa-solid fa-ellipsis-vertical text-xl"></i>
            </button>

          </div>
        </div>
      </div>

    </header>
  );
};
