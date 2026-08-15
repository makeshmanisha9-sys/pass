// Passage Booking & Payment Flow Pages

window.BookingPage = function BookingPage({
  bookingDraft,
  property,
  activeCurrency,
  currencyRates,
  onProceedToPayment,
  onNavigate
}) {
  const [specialRequests, setSpecialRequests] = React.useState('');
  const [frroRequired, setFrroRequired] = React.useState(true);
  if (!property || !bookingDraft) {
    return /*#__PURE__*/React.createElement("div", {
      className: "py-24 text-center space-y-4"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold text-slate-900"
    }, "No booking session found"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onNavigate('search'),
      className: "px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
    }, "Return to Properties"));
  }
  const handleContinue = e => {
    e.preventDefault();
    onProceedToPayment({
      ...bookingDraft,
      specialRequests,
      frroRequired
    });
  };
  const totalFormatted = window.PassageAPI.formatCurrency(bookingDraft.totalINR, activeCurrency, currencyRates);
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-4xl mx-auto px-4 py-10 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 text-xs text-slate-500"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search'),
    className: "hover:underline"
  }, "Search"), /*#__PURE__*/React.createElement("span", null, "/"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('property-detail', {
      id: property._id
    }),
    className: "hover:underline"
  }, property.title), /*#__PURE__*/React.createElement("span", null, "/"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-900"
  }, "Booking Review")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-b border-slate-100 pb-4"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl font-extrabold text-slate-900"
  }, "1. Confirm Your Rental Details"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Review your stay dates and special expat assistance requirements")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 font-bold block uppercase text-[10px]"
  }, "Check-In"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-900 text-sm"
  }, bookingDraft.checkIn)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 font-bold block uppercase text-[10px]"
  }, "Check-Out"), /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-900 text-sm"
  }, bookingDraft.checkOut))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-800 mb-1"
  }, "Special Arrival Requests"), /*#__PURE__*/React.createElement("textarea", {
    rows: "3",
    value: specialRequests,
    onChange: e => setSpecialRequests(e.target.value),
    placeholder: "E.g. Flight FRA #102 arriving at 2 AM, need key box code or airport cab arrangement.",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start space-x-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    id: "frro",
    checked: frroRequired,
    onChange: e => setFrroRequired(e.target.checked),
    className: "mt-1 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "frro",
    className: "cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-teal-900 block text-xs"
  }, "Request Free FRRO Registration (Form C) Paperwork"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-teal-700 block mt-0.5"
  }, "The landlord will prepare an official notarized lease draft required for online Indian immigration (FRRO) registration.")))), /*#__PURE__*/React.createElement("button", {
    onClick: handleContinue,
    className: "w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center space-x-2"
  }, /*#__PURE__*/React.createElement("span", null, "Proceed to Payment"), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-right"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex space-x-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: property.coverImage,
    alt: property.title,
    className: "w-20 h-20 rounded-xl object-cover"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase text-teal-600 bg-teal-50 px-2 py-0.5 rounded"
  }, property.city), /*#__PURE__*/React.createElement("h3", {
    className: "font-bold text-xs text-slate-900 line-clamp-2 mt-1"
  }, property.title))), /*#__PURE__*/React.createElement("div", {
    className: "pt-3 border-t border-slate-100 text-xs space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-slate-600"
  }, /*#__PURE__*/React.createElement("span", null, "Guests"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-slate-900"
  }, bookingDraft.guests, " Guest(s)")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-slate-600"
  }, /*#__PURE__*/React.createElement("span", null, "Escrow Security"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-teal-600"
  }, "Guaranteed")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between pt-2 border-t border-slate-200 font-extrabold text-sm text-slate-900"
  }, /*#__PURE__*/React.createElement("span", null, "Total Price"), /*#__PURE__*/React.createElement("span", {
    className: "text-teal-600"
  }, totalFormatted))))));
};