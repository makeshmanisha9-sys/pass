// Passage Saved Wishlist Page Component

window.WishlistPage = function WishlistPage({ wishlist, properties, activeCurrency, currencyRates, onToggleWishlist, onSelectProperty, onNavigate }) {
  const savedProperties = properties.filter(p => wishlist.includes(p._id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Saved Wishlist</h1>
          <p className="text-xs text-slate-500">{savedProperties.length} homes saved for your upcoming stay in India</p>
        </div>
        <button onClick={() => onNavigate('search')} className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl">
          Explore More Homes
        </button>
      </div>

      {savedProperties.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl">
            <i className="fa-regular fa-heart"></i>
          </div>
          <h3 className="text-base font-bold text-slate-900">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any property card while browsing to save homes here.
          </p>
          <button onClick={() => onNavigate('search')} className="px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl">
            Browse Verified Homes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map(p => (
            <window.PropertyCard 
              key={p._id}
              property={p}
              activeCurrency={activeCurrency}
              currencyRates={currencyRates}
              isWishlisted={true}
              onToggleWishlist={onToggleWishlist}
              onSelectProperty={onSelectProperty}
            />
          ))}
        </div>
      )}

    </div>
  );
};
