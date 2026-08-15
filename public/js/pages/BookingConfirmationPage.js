// Passage Booking Confirmation Page Component

window.BookingConfirmationPage = function BookingConfirmationPage({
  booking,
  activeCurrency,
  currencyRates,
  onNavigate
}) {
  if (!booking) {
    return /*#__PURE__*/React.createElement("div", {
      className: "py-24 text-center space-y-4"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold text-slate-900"
    }, "No recent confirmation"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onNavigate('my-bookings'),
      className: "px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
    }, "View My Bookings"));
  }
  const prop = booking.propertyId || {};
  const formattedTotal = window.PassageAPI.formatCurrency(booking.totalAmount, activeCurrency, currencyRates);
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-3xl mx-auto px-4 py-12 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl text-center space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg shadow-teal-500/20"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-50 text-teal-700 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-widest border border-teal-200"
  }, "Payment Confirmed \u2022 Escrow Protected"), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2"
  }, "Your Stay in India is Reserved!"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 mt-1"
  }, "Booking Reference ID: ", /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold text-teal-600"
  }, booking.bookingNumber))), /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-50 p-6 rounded-2xl border border-slate-200/80 text-left space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4 pb-4 border-b border-slate-200"
  }, /*#__PURE__*/React.createElement("img", {
    src: prop.coverImage || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=300&q=80',
    alt: prop.title,
    className: "w-16 h-16 rounded-xl object-cover"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-slate-900 text-sm"
  }, prop.title), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500"
  }, prop.address || prop.city))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 font-bold block uppercase text-[10px]"
  }, "Dates"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-900"
  }, new Date(booking.checkIn).toLocaleDateString(), " \u2014 ", new Date(booking.checkOut).toLocaleDateString())), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 font-bold block uppercase text-[10px]"
  }, "Amount Paid"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-teal-600 text-sm"
  }, formattedTotal))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-white rounded-xl border border-slate-200 space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-900 block"
  }, "FRRO Registration Support"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 text-[11px]"
  }, "Landlord FRRO Form C agreement draft has been generated. You can download the lease copy or upload your passport to complete verification."))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-center gap-4 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('my-bookings'),
    className: "px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-teal-600/30"
  }, "Go to My Bookings"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('profile'),
    className: "px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-2xl border border-slate-700"
  }, "Upload Passport / Visa"))));
};