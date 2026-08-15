// Passage Search Results & Advanced Filtering Component

window.SearchPage = function SearchPage({ initialFilters = {}, activeCurrency, currencyRates, wishlist, onToggleWishlist, onSelectProperty }) {
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

  const toggleAmenity = (amenityName) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Search Header Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Furnished Expat Homes in India
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {properties.length} verified listings with FRRO registration support
          </p>
        </div>

        {/* Search Bar & View Toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Neighborhood, keywords..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 pl-9 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-400 text-xs"></i>
          </div>

          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
          </select>

          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              <i className="fa-solid fa-grid-2 mr-1"></i> Grid
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              <i className="fa-solid fa-map-location-dot mr-1"></i> Map
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full bg-slate-900 text-teal-400 hover:bg-slate-800 font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-between transition-all"
        >
          <span className="flex items-center space-x-2">
            <i className="fa-solid fa-sliders"></i>
            <span>{showMobileFilters ? 'Hide Search Filters' : 'Filter Homes (City, Budget, Type)'}</span>
          </span>
          <i className={`fa-solid ${showMobileFilters ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </button>
      </div>

      {/* Main Layout: Sidebar Filters + Property Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Filters Sidebar */}
        <aside className={`lg:col-span-1 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 text-xs text-slate-700 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
              <i className="fa-solid fa-sliders text-teal-600"></i>
              <span>Filters</span>
            </h3>
            <button onClick={resetFilters} className="text-teal-600 hover:underline font-bold text-[11px]">
              Reset All
            </button>
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">City</label>
            <select 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold focus:outline-none focus:border-teal-500"
            >
              <option value="All">All Indian Cities</option>
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

          {/* Price Range */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Monthly Budget (INR)</label>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="number" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min ₹"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:border-teal-500"
              />
              <input 
                type="number" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max ₹"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Property Type</label>
            <select 
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Property Types</option>
              <option value="Villa">Villa (All Villas)</option>
              <option value="Sea-Facing Villa">Sea-Facing Villa</option>
              <option value="Lake View Villa">Lake View Villa</option>
              <option value="Bungalow">Bungalow & Haveli</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Executive Loft">Executive Loft</option>
              <option value="Heritage Home">Heritage Home</option>
              <option value="Studio">Studio</option>
              <option value="Serviced Apartment">Serviced Apartment</option>
              <option value="Garden Flat">Garden Flat</option>
              <option value="Luxury Duplex">Luxury Duplex</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Bedrooms</label>
            <div className="flex gap-1.5">
              {['All', '1', '2', '3', '4'].map((b) => (
                <button 
                  key={b}
                  onClick={() => setBedrooms(b)}
                  className={`flex-1 py-1.5 rounded-xl font-bold border transition-colors ${
                    bedrooms === b 
                      ? 'bg-teal-600 text-white border-teal-600' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {b === '4' ? '4+' : b}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities Checkboxes */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Key Amenities</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {[
                'WiFi', 'Air Conditioning', 'Power Backup', 'FRRO Assistance', 
                'Furnished', 'Gym', 'Balcony', 'Swimming Pool', 'Security', 'Parking'
              ].map(a => (
                <label key={a} className="flex items-center space-x-2 cursor-pointer hover:text-teal-700">
                  <input 
                    type="checkbox"
                    checked={selectedAmenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-bold text-slate-800">Instant Booking Only</span>
              <input 
                type="checkbox"
                checked={instantBooking}
                onChange={(e) => setInstantBooking(e.target.checked)}
                className="rounded border-slate-300 text-teal-600"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-bold text-slate-800">Short-Term Allowed</span>
              <input 
                type="checkbox"
                checked={shortTerm}
                onChange={(e) => setShortTerm(e.target.checked)}
                className="rounded border-slate-300 text-teal-600"
              />
            </label>
          </div>

        </aside>

        {/* Results Container */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <i className="fa-solid fa-circle-notch fa-spin text-3xl text-teal-600"></i>
              <p className="text-xs font-bold text-slate-500">Searching Passage verified properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                <i className="fa-solid fa-house-crack"></i>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">No properties matched your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try expanding your price range or selecting another city from our 50+ listings across India.
              </p>
              <button 
                onClick={resetFilters}
                className="px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'map' ? (
            <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-sm">
              <div ref={mapRef} className="w-full h-[600px] rounded-2xl z-10"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(p => (
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
          )}
        </main>

      </div>
    </div>
  );
};
