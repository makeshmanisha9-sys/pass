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