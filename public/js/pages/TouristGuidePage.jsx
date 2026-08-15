// Passage Interactive Tourist Places & Expat City Guide Component

window.TouristGuidePage = function TouristGuidePage({ onNavigate }) {
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
      places: [
        { id: 'c1', name: 'Marina Beach & Promenade', category: 'Beaches & Nature', lat: 13.0500, lng: 80.2824, img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80', desc: 'World’s second longest natural urban beach, perfect for evening walks, street food, and heritage lighthouse views.' },
        { id: 'c2', name: 'Kapaleeshwarar Temple (Mylapore)', category: 'Heritage & Monuments', lat: 13.0334, lng: 80.2698, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', desc: '7th-century Dravidian temple complex dedicated to Lord Shiva with an ornate gopuram gateway tower.' },
        { id: 'c3', name: 'San Thome Cathedral Basilica', category: 'Heritage & Monuments', lat: 13.0333, lng: 80.2782, img: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=600&q=80', desc: 'Stately Neo-Gothic Roman Catholic cathedral constructed over the tomb of St. Thomas the Apostle.' },
        { id: 'c4', name: 'Fort St. George & Museum', category: 'Heritage & Monuments', lat: 13.0797, lng: 80.2875, img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80', desc: 'The first British fortress in India built in 1644, housing colonial artifacts and cannons.' },
        { id: 'c5', name: 'Amethyst Cafe & Garden', category: 'Cafes & Dining', lat: 13.0583, lng: 80.2588, img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', desc: 'Restored colonial mansion set in a lush tropical garden serving artisan coffee and continental brunch.' },
        { id: 'c6', name: 'Phoenix Marketcity Mall', category: 'Shopping & Bazaars', lat: 12.9918, lng: 80.2170, img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80', desc: 'Mega shopping complex with global fashion brands, IMAX cinemas, and gourmet food courts.' }
      ]
    },
    Bangalore: {
      tagline: 'Garden City, IT Innovation Capital & Craft Beer Hub',
      center: [12.9716, 77.5946],
      coverImg: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
      places: [
        { id: 'b1', name: 'Cubbon Park & Botanical Gardens', category: 'Beaches & Nature', lat: 12.9763, lng: 77.5929, img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80', desc: '300-acre lush green park in the city center surrounded by red-brick colonial government buildings.' },
        { id: 'b2', name: 'Bangalore Palace & Grounds', category: 'Heritage & Monuments', lat: 13.0006, lng: 77.5922, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', desc: 'Tudor-style royal palace featuring fortified towers, ornate wood carvings, and expansive gardens.' },
        { id: 'b3', name: 'UB City Luxury Promenade', category: 'Shopping & Bazaars', lat: 12.9719, lng: 77.5957, img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80', desc: 'India’s pioneer luxury mall hosting high-end fashion houses and rooftop craft lounge bars.' },
        { id: 'b4', name: 'Toit Craft Brewery (Indiranagar)', category: 'Cafes & Dining', lat: 12.9791, lng: 77.6405, img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', desc: 'Legendary microbrewery serving artisanal beers and woodfired gourmet pizzas.' }
      ]
    },
    Mumbai: {
      tagline: 'Financial Capital, Sea-Facing Boulevards & Bollywood',
      center: [18.9220, 72.8347],
      coverImg: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
      places: [
        { id: 'm1', name: 'Gateway of India & Taj Palace', category: 'Heritage & Monuments', lat: 18.9220, lng: 72.8347, img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80', desc: '26-meter basalt archway erected on the waterfront alongside the historic 1903 Taj Mahal Hotel.' },
        { id: 'm2', name: 'Marine Drive (Queen’s Necklace)', category: 'Beaches & Nature', lat: 18.9438, lng: 72.8232, img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80', desc: '3.6 km C-shaped boulevard offering sweeping sunset views across Back Bay.' },
        { id: 'm3', name: 'Bandra Fort & Promenade', category: 'Heritage & Monuments', lat: 19.0438, lng: 72.8193, img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80', desc: '1640 Castella de Aguada fort overlooking the Bandra-Worli Sea Link bridge.' },
        { id: 'm4', name: 'The Table Colaba', category: 'Cafes & Dining', lat: 18.9240, lng: 72.8310, img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80', desc: 'San Francisco farm-to-table fine dining cafe popular with international executives.' }
      ]
    },
    Delhi: {
      tagline: 'Diplomatic Capital, Mughal Monuments & Food Enclaves',
      center: [28.5900, 77.2200],
      coverImg: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
      places: [
        { id: 'd1', name: 'Lodhi Art District & Gardens', category: 'Beaches & Nature', lat: 28.5880, lng: 77.2215, img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80', desc: 'India’s first open-air public art district with 50+ murals, adjacent to 90-acre Mughal Lodhi Gardens.' },
        { id: 'd2', name: 'Qutub Minar Complex', category: 'Heritage & Monuments', lat: 28.5245, lng: 77.1855, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', desc: '73-meter fluted red sandstone victory tower erected in 1193.' },
        { id: 'd3', name: 'Khan Market Boutique Enclave', category: 'Shopping & Bazaars', lat: 28.6002, lng: 77.2270, img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80', desc: 'Ranked among Asia’s most prestigious high-street retail markets.' }
      ]
    },
    Goa: {
      tagline: 'Tropical Beaches, Portuguese Villas & Sunset Tavernas',
      center: [15.5800, 73.7400],
      coverImg: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
      places: [
        { id: 'g1', name: 'Ashwem Sunset Beach', category: 'Beaches & Nature', lat: 15.6582, lng: 73.7145, img: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=600&q=80', desc: 'Quiet, golden sand beach popular with foreign digital nomads and kite surfers.' },
        { id: 'g2', name: 'Fontainhas Latin Quarter', category: 'Heritage & Monuments', lat: 15.4989, lng: 73.8278, img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80', desc: 'UNESCO-recognized heritage quarter featuring yellow & blue Portuguese villas.' },
        { id: 'g3', name: 'Thalassa Greek Taverna', category: 'Cafes & Dining', lat: 15.6180, lng: 73.7430, img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', desc: 'Cliffside Mediterranean restaurant offering famous sunset views over the ocean.' }
      ]
    },
    Hyderabad: {
      tagline: 'Cyberabad Tech Corridor & Royal Nizam Heritage',
      center: [17.4000, 78.4000],
      coverImg: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
      places: [
        { id: 'h1', name: 'Golconda Fort & Tombs', category: 'Heritage & Monuments', lat: 17.3833, lng: 78.4011, img: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80', desc: 'Imposing 16th-century fortress renowned for acoustic engineering and diamond vaults.' },
        { id: 'h2', name: 'Hussain Sagar Buddha Statue', category: 'Beaches & Nature', lat: 17.4156, lng: 78.4750, img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80', desc: 'Picturesque lake centered by an 18-meter monolithic granite Buddha statue.' }
      ]
    },
    Kochi: {
      tagline: 'Kerala Backwaters, Chinese Fishing Nets & Fort Art',
      center: [9.9600, 76.2400],
      coverImg: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      places: [
        { id: 'k1', name: 'Chinese Fishing Nets Promenade', category: 'Heritage & Monuments', lat: 9.9680, lng: 76.2440, img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80', desc: '14th-century fixed land fishing installations introduced by Chinese traders.' },
        { id: 'k2', name: 'Mattancherry Palace & Spice Market', category: 'Shopping & Bazaars', lat: 9.9580, lng: 76.2590, img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80', desc: 'Ancient spice markets, antique shops, and 1568 Paradesi Synagogue.' }
      ]
    },
    Jaipur: {
      tagline: 'Pink City Royal Haveli Architecture & Gem Handicrafts',
      center: [26.9124, 75.7873],
      coverImg: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
      places: [
        { id: 'j1', name: 'Hawa Mahal (Palace of Winds)', category: 'Heritage & Monuments', lat: 26.9239, lng: 75.8267, img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80', desc: '5-story pink honeycomb facade built in 1799 with 953 screened lattice windows.' },
        { id: 'j2', name: 'Amer Fort & Maota Lake', category: 'Heritage & Monuments', lat: 26.9855, lng: 75.8513, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', desc: 'Majestic red sandstone and marble fort overlooking Maota Lake.' }
      ]
    }
  };

  const currentGuide = guideData[selectedCity] || guideData['Chennai'];

  const filteredPlaces = activeCategory === 'All' 
    ? currentGuide.places 
    : currentGuide.places.filter(p => p.category === activeCategory);

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

  const toggleItinerary = (place) => {
    if (itinerary.some(item => item.id === place.id)) {
      setItinerary(itinerary.filter(item => item.id !== place.id));
    } else {
      setItinerary([...itinerary, place]);
      setItineraryDrawerOpen(true);
    }
  };

  const isSavedInItinerary = (id) => itinerary.some(item => item.id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <span className="bg-teal-50 text-teal-700 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-teal-200 flex items-center space-x-1.5 w-fit">
            <i className="fa-solid fa-compass text-teal-600 animate-spin"></i>
            <span>Interactive Expat Sightseeing Engine</span>
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Interactive Tourist Places & Expat Guide</h1>
        </div>

        {/* City Selector Buttons */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          {Object.keys(guideData).map(city => (
            <button 
              key={city}
              onClick={() => {
                setSelectedCity(city);
                setActiveCategory('All');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${selectedCity === city ? 'bg-teal-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'}`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Hero Banner */}
      <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl bg-slate-900 flex items-end p-8 text-white">
        <img src={currentGuide.coverImg} alt={selectedCity} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        <div className="relative z-10 space-y-1 max-w-2xl">
          <span className="bg-teal-500 text-slate-950 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-md">
            Interactive Sightseeing Guide
          </span>
          <h2 className="text-3xl font-extrabold">{selectedCity} Landmarks & Attractions</h2>
          <p className="text-xs text-slate-300 font-medium">{currentGuide.tagline}</p>
        </div>

        {/* Floating Itinerary Counter */}
        <button 
          onClick={() => setItineraryDrawerOpen(true)}
          className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur-md border border-teal-500/40 text-teal-300 px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center space-x-2 shadow-xl hover:bg-slate-800"
        >
          <i className="fa-solid fa-route text-teal-400"></i>
          <span>My Trip Itinerary ({itinerary.length})</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {['All', 'Heritage & Monuments', 'Beaches & Nature', 'Cafes & Dining', 'Shopping & Bazaars'].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-teal-400 shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-semibold">
          Showing {filteredPlaces.length} interactive landmarks on map
        </span>
      </div>

      {/* Main Grid: Interactive Map + Interactive Attraction Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Interactive Leaflet Map Column */}
        <div className="lg:col-span-1 bg-white p-3 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
          <div className="px-3 py-2 border-b border-slate-100 mb-2 flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-900 flex items-center space-x-1.5">
              <i className="fa-solid fa-map-location-dot text-teal-600"></i>
              <span>{selectedCity} Sightseeing Map</span>
            </span>
            <span className="text-[10px] text-slate-400">Click pins for details</span>
          </div>

          <div ref={touristMapRef} className="w-full h-[520px] rounded-2xl border border-slate-200 z-10"></div>
        </div>

        {/* Interactive Attraction Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPlaces.map(place => {
              const saved = isSavedInItinerary(place.id);
              return (
                <div 
                  key={place.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                    <img 
                      src={place.img} 
                      alt={place.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-slate-950/90 text-teal-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg backdrop-blur-md border border-teal-500/30">
                        {place.category}
                      </span>
                    </div>

                    <button 
                      onClick={() => toggleItinerary(place)}
                      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                        saved 
                          ? 'bg-teal-600 text-white shadow-lg' 
                          : 'bg-slate-950/60 text-white hover:bg-slate-950'
                      }`}
                      title={saved ? "Remove from Trip Plan" : "Add to Trip Plan"}
                    >
                      <i className={`fa-solid ${saved ? 'fa-check' : 'fa-plus'} text-xs`}></i>
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                        {place.name}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 mt-1 leading-relaxed">
                        {place.desc}
                      </p>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button 
                        onClick={() => onNavigate('search', { city: selectedCity })}
                        className="text-xs font-extrabold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
                      >
                        <i className="fa-solid fa-house-chimney text-xs"></i>
                        <span>Find Homes Nearby</span>
                      </button>

                      <button 
                        onClick={() => toggleItinerary(place)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                          saved 
                            ? 'bg-teal-50 text-teal-700 border-teal-200' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {saved ? 'In Itinerary' : '+ Add to Trip'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Interactive Trip Itinerary Drawer */}
      {itineraryDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 text-white w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl animate-slideLeft">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-extrabold text-lg">
                    <i className="fa-solid fa-route"></i>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">My Sightseeing Itinerary</h3>
                    <p className="text-xs text-slate-400">{itinerary.length} saved landmarks in India</p>
                  </div>
                </div>

                <button onClick={() => setItineraryDrawerOpen(false)} className="text-slate-400 hover:text-white">
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              {/* Saved Landmarks List */}
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {itinerary.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center">No landmarks added yet. Click "+ Add to Trip" on any attraction card!</p>
                ) : (
                  itinerary.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-extrabold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-white block">{item.name}</span>
                          <span className="text-[10px] text-teal-400">{item.category}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => toggleItinerary(item)}
                        className="text-slate-400 hover:text-red-400 p-1"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button 
                onClick={() => {
                  setItineraryDrawerOpen(false);
                  onNavigate('search', { city: selectedCity });
                }}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-xl shadow-teal-600/30"
              >
                Find Furnished Homes Near My Itinerary
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
