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
    className: "grid grid-cols-1 lg:grid-cols-4 gap-8 items-start"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "lg:col-span-1 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-xs text-slate-700"
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
    value: "Penthouse"
  }, "Penthouse"), /*#__PURE__*/React.createElement("option", {
    value: "Executive Loft"
  }, "Executive Loft"), /*#__PURE__*/React.createElement("option", {
    value: "Sea-Facing Villa"
  }, "Sea-Facing Villa"), /*#__PURE__*/React.createElement("option", {
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