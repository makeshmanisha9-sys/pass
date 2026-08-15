// Passage Property Card Component with Direct Navigation & WhatsApp Integration

window.PropertyCard = function PropertyCard({ property, activeCurrency = 'INR', currencyRates = {}, isWishlisted = false, onToggleWishlist, onSelectProperty }) {
  if (!property) return null;

  const formattedMonthPrice = window.PassageAPI.formatCurrency(property.pricePerMonth || 45000, activeCurrency, currencyRates);
  const formattedNightPrice = window.PassageAPI.formatCurrency(property.pricePerNight || Math.round((property.pricePerMonth || 45000) / 25), activeCurrency, currencyRates);

  const handleCardClick = (e) => {
    e.preventDefault();
    if (typeof onSelectProperty === 'function') {
      onSelectProperty(property._id || property, property);
    }
  };

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image & Overlay Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img 
          src={property.coverImage || (property.images && property.images[0]) || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'} 
          alt={property.title || 'Expat Residence'} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-slate-900/90 text-teal-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg backdrop-blur-md border border-teal-500/30 shadow-md flex items-center space-x-1">
            <i className="fa-solid fa-circle-check text-teal-400"></i>
            <span>FRRO Verified</span>
          </span>

          {property.instantBooking && (
            <span className="bg-emerald-600/90 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg backdrop-blur-md shadow-md">
              Instant Book
            </span>
          )}
        </div>

        {/* Action Buttons Top Right */}
        <div className="absolute top-3 right-3 z-10 flex items-center space-x-1.5">
          {/* WhatsApp Quick Share Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const msg = `Hi! Check out this verified expat property "${property.title || 'Residences'}" in ${property.city || 'India'} listed on Passage: http://localhost:5000`;
              window.PassageAPI.openWhatsApp('', msg);
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border bg-emerald-600/80 hover:bg-emerald-600 text-white border-white/30 shadow-md transition-all"
            title="Share listing on WhatsApp"
          >
            <i className="fa-brands fa-whatsapp text-sm"></i>
          </button>

          {/* Wishlist Heart Button */}
          {typeof onToggleWishlist === 'function' && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(property._id);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                isWishlisted 
                  ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30' 
                  : 'bg-slate-900/60 text-white border-white/30 hover:bg-slate-900/90'
              }`}
              title={isWishlisted ? "Remove from Saved" : "Save Property"}
            >
              <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart text-sm`}></i>
            </button>
          )}
        </div>

        {/* Bottom Property Type */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
          <span className="bg-slate-950/80 px-2.5 py-0.5 rounded-md text-[11px] font-bold border border-slate-700">
            {property.propertyType || 'Serviced Residence'}
          </span>

          <span className="flex items-center space-x-1 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-700 text-amber-400 font-extrabold text-[11px]">
            <i className="fa-solid fa-star text-amber-400 text-[10px]"></i>
            <span>{property.rating || 4.9}</span>
            <span className="text-slate-400 font-normal">({property.reviewCount || 12})</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-teal-700 font-bold mb-1">
            <i className="fa-solid fa-location-dot"></i>
            <span>{property.neighborhood || 'Prime Location'}, {property.city || 'India'}</span>
          </div>

          <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
            {property.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* Features / Amenities Icons */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-600 pt-2 border-t border-slate-100 font-semibold">
          <span className="flex items-center space-x-1">
            <i className="fa-solid fa-bed text-slate-400"></i>
            <span>{property.bedrooms || 1} Bed</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <i className="fa-solid fa-bath text-slate-400"></i>
            <span>{property.bathrooms || 1} Bath</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <i className="fa-solid fa-wifi text-slate-400"></i>
            <span>High Speed</span>
          </span>
        </div>

        {/* Pricing Display */}
        <div className="pt-2 flex items-baseline justify-between border-t border-slate-100">
          <div>
            <span className="text-base font-extrabold text-slate-900">{formattedMonthPrice}</span>
            <span className="text-[11px] text-slate-500 font-medium"> / month</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-teal-600">{formattedNightPrice}</span>
            <span className="text-[10px] text-slate-400"> / night</span>
          </div>
        </div>

      </div>
    </div>
  );
};
