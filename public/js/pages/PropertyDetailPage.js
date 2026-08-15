// Passage Property Detail Page Component with Instant Pre-loader & WhatsApp Integration

window.PropertyDetailPage = function PropertyDetailPage({
  propertyId,
  properties = [],
  activeCurrency = 'INR',
  currencyRates = {},
  wishlist = [],
  onToggleWishlist,
  onStartBooking,
  onNavigate
}) {
  // Find in-memory property instantly from pre-loaded properties array
  const existingProp = Array.isArray(properties) ? properties.find(p => p && (p._id === propertyId || String(p._id) === String(propertyId))) : null;
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
    if (!propertyId) {
      setLoading(false);
      return;
    }

    // Always fetch latest details from API, but keep in-memory property active
    window.PassageAPI.getPropertyById(propertyId).then(data => {
      if (data && data._id) {
        setProperty(data);
      }
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching property detail:', err);
      setLoading(false);
    });
    window.PassageAPI.getPropertyReviews(propertyId).then(revs => setReviews(Array.isArray(revs) ? revs : [])).catch(err => console.error(err));
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
  if (!property) {
    return /*#__PURE__*/React.createElement("div", {
      className: "max-w-md mx-auto py-24 text-center space-y-4"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold text-slate-900"
    }, "Property not found"), /*#__PURE__*/React.createElement("button", {
      onClick: () => typeof onNavigate === 'function' && onNavigate('search'),
      className: "px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
    }, "Back to Search"));
  }
  const isWishlisted = Array.isArray(wishlist) && property ? wishlist.includes(property._id) : false;

  // Price Calculation Logic
  let nightCount = 1;
  if (checkIn && checkOut) {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    if (diff > 0) nightCount = diff;
  }
  const isMonthlyLease = nightCount >= 30;
  const baseRentInINR = isMonthlyLease ? Math.round((property.pricePerMonth || 45000) / 30 * nightCount) : (property.pricePerNight || Math.round((property.pricePerMonth || 45000) / 25)) * nightCount;
  const depositInINR = property.deposit || (property.pricePerMonth || 45000) * 2;
  const serviceFeeInINR = Math.round(baseRentInINR * 0.05);
  const grandTotalINR = baseRentInINR + serviceFeeInINR + (isMonthlyLease ? depositInINR : 0);
  const formattedTotal = window.PassageAPI.formatCurrency(grandTotalINR, activeCurrency, currencyRates);
  const formattedRent = window.PassageAPI.formatCurrency(baseRentInINR, activeCurrency, currencyRates);
  const formattedDeposit = window.PassageAPI.formatCurrency(depositInINR, activeCurrency, currencyRates);
  const imagesList = property.images && property.images.length > 0 ? property.images : [property.coverImage || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'];
  const ownerPhone = property.ownerId && typeof property.ownerId === 'object' && property.ownerId.phone ? property.ownerId.phone : '919876543210';
  const ownerName = property.ownerId && typeof property.ownerId === 'object' && property.ownerId.name ? property.ownerId.name : 'Verified Host';
  const ownerAvatar = property.ownerId && typeof property.ownerId === 'object' && property.ownerId.avatar ? property.ownerId.avatar : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';
  const handleWhatsAppHost = () => {
    const message = `Hello! I am an expat interested in booking your property "${property.title || 'Passage Residence'}" in ${property.city || 'India'} listed on Passage. Is it available for my stay?`;
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
  }, property.propertyType || 'Serviced Apartment')), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl sm:text-3xl font-extrabold text-slate-900"
  }, property.title), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-1 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-dot text-teal-600"
  }), /*#__PURE__*/React.createElement("span", null, property.address || property.city))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleWhatsAppHost,
    className: "px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-2 transition-all"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp text-sm"
  }), /*#__PURE__*/React.createElement("span", null, "WhatsApp Host")), typeof onToggleWishlist === 'function' && /*#__PURE__*/React.createElement("button", {
    onClick: () => onToggleWishlist(property._id),
    className: `px-4 py-2 rounded-xl text-xs font-bold border flex items-center space-x-2 transition-colors ${isWishlisted ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-${isWishlisted ? 'solid' : 'regular'} fa-heart`
  }), /*#__PURE__*/React.createElement("span", null, isWishlisted ? 'Saved' : 'Save')))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-3 rounded-3xl overflow-hidden shadow-lg aspect-[16/9] md:aspect-[21/9]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 relative group bg-slate-900"
  }, /*#__PURE__*/React.createElement("img", {
    src: imagesList[activeImage] || property.coverImage || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    alt: property.title,
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
  }, property.bedrooms || 1, " BHK")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400 block"
  }, "Bathrooms"), /*#__PURE__*/React.createElement("span", {
    className: "text-base font-extrabold text-slate-900"
  }, property.bathrooms || 1, " Baths")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400 block"
  }, "Max Guests"), /*#__PURE__*/React.createElement("span", {
    className: "text-base font-extrabold text-slate-900"
  }, property.maxGuests || 2, " Guests")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase text-slate-400 block"
  }, "Rating"), /*#__PURE__*/React.createElement("span", {
    className: "text-base font-extrabold text-amber-500"
  }, "\u2605 ", property.rating || '4.8'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-base text-slate-900"
  }, "About this Expat Residence"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-600 leading-relaxed font-medium"
  }, property.description)), /*#__PURE__*/React.createElement("div", {
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
  }, (property.amenities || ['WiFi', 'Air Conditioning', 'Power Backup', 'FRRO Assistance', 'Furnished']).map((amenity, idx) => /*#__PURE__*/React.createElement("div", {
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
  }, window.PassageAPI.formatCurrency(property.pricePerMonth || 45000, activeCurrency, currencyRates)), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-slate-500 font-semibold"
  }, " / month")), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-teal-600"
  }, window.PassageAPI.formatCurrency(property.pricePerNight || Math.round((property.pricePerMonth || 45000) / 25), activeCurrency, currencyRates), " / night")), /*#__PURE__*/React.createElement("div", {
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
    length: property.maxGuests || 4
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
    onClick: () => typeof onStartBooking === 'function' && onStartBooking(property._id, {
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