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
    className: "p-2 sm:border-r border-slate-200"
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
    className: "p-2 sm:border-r border-slate-200"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1"
  }, "Check-in"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: searchCheckIn,
    onChange: e => setSearchCheckIn(e.target.value),
    className: "w-full bg-transparent font-semibold text-xs text-slate-800 focus:outline-none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-2 lg:border-r border-slate-200"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1"
  }, "Check-out"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: searchCheckOut,
    onChange: e => setSearchCheckOut(e.target.value),
    className: "w-full bg-transparent font-semibold text-xs text-slate-800 focus:outline-none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-2"
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
    className: "navy-gradient text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 max-w-xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/30 uppercase tracking-widest"
  }, "Need Personal Guidance?"), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl sm:text-3xl font-extrabold"
  }, "Relocating to India for Work or Travel?"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-slate-300 leading-relaxed"
  }, "Our AI Relocation Concierge and local human expat team will match you with pre-inspected homes, verify landlord paperwork, and arrange 4K video tours."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-3 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onOpenAI,
    className: "bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-6 py-3 rounded-2xl text-xs shadow-lg transition-all flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-wand-magic-sparkles"
  }), /*#__PURE__*/React.createElement("span", null, "Ask AI Travel Assistant")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-2xl text-xs border border-slate-700 transition-all"
  }, "Find Your Stay"))), /*#__PURE__*/React.createElement("div", {
    className: "w-full md:w-80 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-teal-400 text-sm border-b border-slate-800 pb-2"
  }, "Why Foreigners Choose Passage"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 text-slate-300"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check text-teal-400 mt-0.5"
  }), /*#__PURE__*/React.createElement("span", null, "Standardized 2-Month Deposit (Not 10)")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check text-teal-400 mt-0.5"
  }), /*#__PURE__*/React.createElement("span", null, "FRRO Visa Compliant Lease Agreements")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check text-teal-400 mt-0.5"
  }), /*#__PURE__*/React.createElement("span", null, "Pay via Credit Card / Razorpay / Stripe")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check text-teal-400 mt-0.5"
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