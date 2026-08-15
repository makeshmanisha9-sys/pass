// Passage Saved Wishlist Page Component

window.WishlistPage = function WishlistPage({
  wishlist,
  properties,
  activeCurrency,
  currencyRates,
  onToggleWishlist,
  onSelectProperty,
  onNavigate
}) {
  const savedProperties = properties.filter(p => wishlist.includes(p._id));
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-b border-slate-200 pb-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "Saved Wishlist"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, savedProperties.length, " homes saved for your upcoming stay in India")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
  }, "Explore More Homes")), savedProperties.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-16 rounded-3xl border border-slate-200 text-center space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-2xl"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-regular fa-heart"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-bold text-slate-900"
  }, "Your wishlist is empty"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 max-w-sm mx-auto"
  }, "Click the heart icon on any property card while browsing to save homes here."), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl"
  }, "Browse Verified Homes")) : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  }, savedProperties.map(p => /*#__PURE__*/React.createElement(window.PropertyCard, {
    key: p._id,
    property: p,
    activeCurrency: activeCurrency,
    currencyRates: currencyRates,
    isWishlisted: true,
    onToggleWishlist: onToggleWishlist,
    onSelectProperty: onSelectProperty
  }))));
};