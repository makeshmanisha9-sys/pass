// Passage Home Page Component

window.HomePage = function HomePage({ properties, activeCurrency, currencyRates, wishlist, onToggleWishlist, onSelectProperty, onNavigate, onOpenAI }) {
  const [searchCity, setSearchCity] = React.useState('All');
  const [searchCheckIn, setSearchCheckIn] = React.useState('');
  const [searchCheckOut, setSearchCheckOut] = React.useState('');
  const [searchGuests, setSearchGuests] = React.useState('1');

  const popularCities = [
    { name: 'Chennai', tag: 'Coastal Metro & IT Corridor', count: '12+ Homes', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80' },
    { name: 'Bangalore', tag: 'Garden City & Startup Capital', count: '15+ Homes', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Mumbai', tag: 'Financial Hub & Sea Promenade', count: '10+ Homes', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Delhi', tag: 'Capital Enclave & Heritage', count: '11+ Homes', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80' },
    { name: 'Goa', tag: 'Tropical Beaches & Heritage Villas', count: '14+ Homes', img: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hyderabad', tag: 'Cyberabad & Royal Heritage', count: '9+ Homes', img: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80' },
    { name: 'Kochi', tag: 'Kerala Backwaters & Art Fort', count: '8+ Homes', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80' },
    { name: 'Jaipur', tag: 'Pink City Royal Haveli Stays', count: '7+ Homes', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleSearchSubmit = (e) => {
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

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white min-h-[580px] flex items-center justify-center overflow-hidden">
        
        {/* Background Image & Gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-35 scale-105 transform animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
          
          <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/30 px-4 py-1.5 rounded-full text-teal-300 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md">
            <i className="fa-solid fa-passport text-teal-400"></i>
            <span>#1 Expat Tenancy Platform for India</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Find Your Perfect Stay in <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">India</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Comfortable, verified and foreigner-friendly homes across India with FRRO visa paperwork assistance, multi-currency escrow guarantee, and local concierges.
          </p>

          {/* Floating Search Bar */}
          <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl border border-slate-200/80 text-slate-800 text-left">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
              
              {/* Destination */}
              <div className="p-2 sm:border-r border-slate-200">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Destination
                </label>
                <select 
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Cities in India</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Goa">Goa</option>
                  <option value="Kochi">Kochi</option>
                  <option value="Jaipur">Jaipur</option>
                </select>
              </div>

              {/* Check-In */}
              <div className="p-2 sm:border-r border-slate-200">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Check-in
                </label>
                <input 
                  type="date"
                  value={searchCheckIn}
                  onChange={(e) => setSearchCheckIn(e.target.value)}
                  className="w-full bg-transparent font-semibold text-xs text-slate-800 focus:outline-none"
                />
              </div>

              {/* Check-Out */}
              <div className="p-2 lg:border-r border-slate-200">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Check-out
                </label>
                <input 
                  type="date"
                  value={searchCheckOut}
                  onChange={(e) => setSearchCheckOut(e.target.value)}
                  className="w-full bg-transparent font-semibold text-xs text-slate-800 focus:outline-none"
                />
              </div>

              {/* Guests */}
              <div className="p-2">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Guests
                </label>
                <select 
                  value={searchGuests}
                  onChange={(e) => setSearchGuests(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>

              {/* Search CTA */}
              <div className="lg:col-span-1">
                <button 
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-xl shadow-teal-600/40 transition-all flex items-center justify-center space-x-2"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <span>Search</span>
                </button>
              </div>

            </form>
          </div>

          {/* Quick Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-semibold">
            <span className="flex items-center space-x-2"><i className="fa-solid fa-circle-check text-teal-400"></i><span>100% Verified Landlords</span></span>
            <span className="flex items-center space-x-2"><i className="fa-solid fa-file-contract text-teal-400"></i><span>FRRO Form C Assistance</span></span>
            <span className="flex items-center space-x-2"><i className="fa-solid fa-vault text-teal-400"></i><span>Multi-Currency Escrow Deposit</span></span>
          </div>

        </div>
      </section>

      {/* Popular Destinations Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-teal-600 font-bold text-xs uppercase tracking-widest">Explore Top Metros</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Popular Destinations for Foreigners</h2>
          </div>
          <button 
            onClick={() => onNavigate('search')} 
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1 mt-2 sm:mt-0"
          >
            <span>View All Destinations</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularCities.map((c, idx) => (
            <div 
              key={idx}
              onClick={() => onNavigate('search', { city: c.name })}
              className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="bg-teal-500/90 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                  {c.count}
                </span>
                <h3 className="text-lg font-extrabold mt-1">{c.name}</h3>
                <p className="text-[11px] text-slate-300 truncate">{c.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Expat Residences */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-teal-600 font-bold text-xs uppercase tracking-widest">Handpicked Listings</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Properties</h2>
          </div>
          <button 
            onClick={() => onNavigate('search')}
            className="btn text-xs font-bold text-slate-700 hover:text-teal-600 flex items-center space-x-1"
          >
            <span>Browse All</span>
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredList.map(p => (
            <window.PropertyCard 
              key={p._id}
              property={p}
              activeCurrency={activeCurrency}
              currencyRates={currencyRates}
              isWishlisted={wishlist.includes(p._id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProperty={onSelectProperty}
            />
          ))}
        </div>
      </section>

      {/* Expat Relocation Banner CTA (Vibrant Bold Colors) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-teal-600/30 border-2 border-emerald-400/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-5 max-w-xl">
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md inline-block">
              <i className="fa-solid fa-compass text-slate-950 mr-1.5"></i>
              Need Personal Guidance?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              Relocating to India for Work or Travel?
            </h2>
            <p className="text-sm sm:text-base font-bold text-amber-100 leading-relaxed drop-shadow">
              Our AI Relocation Concierge and local human expat team will match you with pre-inspected homes, verify landlord paperwork, and arrange 4K video tours.
            </p>
            <div className="flex flex-wrap gap-4 pt-3">
              <button 
                onClick={onOpenAI}
                className="bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black px-7 py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/40 border-2 border-yellow-200 transform hover:scale-105 transition-all flex items-center space-x-2.5"
              >
                <i className="fa-solid fa-wand-magic-sparkles text-slate-950 text-base"></i>
                <span>Ask AI Travel Assistant</span>
              </button>

              <button 
                onClick={() => onNavigate('search')}
                className="bg-white hover:bg-slate-100 text-teal-950 font-black px-7 py-3.5 rounded-2xl text-sm border-2 border-white shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
              >
                <i className="fa-solid fa-magnifying-glass text-teal-700"></i>
                <span>Find Your Stay</span>
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 bg-slate-950/80 backdrop-blur-md p-6 rounded-2xl border-2 border-emerald-400/30 space-y-3 text-xs shadow-2xl">
            <div className="font-extrabold text-amber-300 text-sm border-b border-emerald-500/30 pb-2.5 flex items-center space-x-2">
              <i className="fa-solid fa-shield-halved text-emerald-400"></i>
              <span>Why Foreigners Choose Passage</span>
            </div>
            <div className="space-y-2.5 font-bold text-white">
              <div className="flex items-start space-x-2">
                <i className="fa-solid fa-circle-check text-emerald-400 mt-0.5 text-sm"></i>
                <span>Standardized 2-Month Deposit (Not 10)</span>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fa-solid fa-circle-check text-emerald-400 mt-0.5 text-sm"></i>
                <span>FRRO Visa Compliant Lease Agreements</span>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fa-solid fa-circle-check text-emerald-400 mt-0.5 text-sm"></i>
                <span>Pay via Credit Card / Razorpay / Stripe</span>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fa-solid fa-circle-check text-emerald-400 mt-0.5 text-sm"></i>
                <span>300 Mbps Fiber WiFi Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Stays Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-teal-600 font-bold text-xs uppercase tracking-widest">Premium Living</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Luxury Penthouses & Sea View Villas</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {luxuryList.map(p => (
            <window.PropertyCard 
              key={p._id}
              property={p}
              activeCurrency={activeCurrency}
              currencyRates={currencyRates}
              isWishlisted={wishlist.includes(p._id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProperty={onSelectProperty}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
