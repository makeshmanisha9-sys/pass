// Passage Payment Integration Page Component

window.PaymentPage = function PaymentPage({
  bookingDraft,
  property,
  activeCurrency,
  currencyRates,
  onPaymentSuccess,
  onNavigate
}) {
  const [provider, setProvider] = React.useState('razorpay'); // 'razorpay' or 'stripe'
  const [cardName, setCardName] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvc, setCardCvc] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  if (!property || !bookingDraft) {
    return /*#__PURE__*/React.createElement("div", {
      className: "py-24 text-center space-y-4"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "text-lg font-bold text-slate-900"
    }, "Session expired"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onNavigate('search'),
      className: "px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl"
    }, "Return to Properties"));
  }
  const handlePay = async e => {
    e.preventDefault();
    setProcessing(true);
    setErrorMsg('');
    try {
      // Create booking via API
      const bookingData = {
        propertyId: property._id,
        checkIn: bookingDraft.checkIn,
        checkOut: bookingDraft.checkOut,
        totalAmount: bookingDraft.totalINR,
        guests: bookingDraft.guests,
        specialRequests: bookingDraft.specialRequests
      };
      const result = await window.PassageAPI.createBooking(bookingData);

      // Simulate payment verification delay
      setTimeout(() => {
        setProcessing(false);
        onPaymentSuccess(result);
      }, 1500);
    } catch (err) {
      setProcessing(false);
      setErrorMsg(err.message || 'Payment processing failed. Please check your card details.');
    }
  };
  const totalFormatted = window.PassageAPI.formatCurrency(bookingDraft.totalINR, activeCurrency, currencyRates);
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-3xl mx-auto px-4 py-10 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-b border-slate-100 pb-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl font-extrabold text-slate-900"
  }, "2. Secure Payment Gateway"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Encrypted multi-currency payment via Razorpay / Stripe Architecture")), /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-50 text-teal-700 font-extrabold text-xs px-3 py-1 rounded-full border border-teal-200"
  }, totalFormatted)), errorMsg && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200"
  }, errorMsg), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-extrabold uppercase tracking-wider text-slate-700"
  }, "Select Gateway Provider"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setProvider('razorpay'),
    className: `p-3 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${provider === 'razorpay' ? 'border-teal-600 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500/20' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bolt text-teal-600"
  }), /*#__PURE__*/React.createElement("span", null, "Razorpay (Cards / UPI / NetBanking)")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setProvider('stripe'),
    className: `p-3 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${provider === 'stripe' ? 'border-teal-600 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500/20' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-stripe text-indigo-600 text-base"
  }), /*#__PURE__*/React.createElement("span", null, "Stripe Global Checkout")))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handlePay,
    className: "space-y-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Cardholder Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: cardName,
    onChange: e => setCardName(e.target.value),
    placeholder: "Full name as on passport / credit card",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-teal-500 font-medium"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Card Number"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    maxLength: "19",
    value: cardNumber,
    onChange: e => setCardNumber(e.target.value),
    placeholder: "4532 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 8912",
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-10 focus:outline-none focus:border-teal-500 font-mono"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-credit-card absolute right-3 top-3 text-slate-400 text-sm"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Expiry Date"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    placeholder: "MM / YY",
    maxLength: "5",
    value: cardExpiry,
    onChange: e => setCardExpiry(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-teal-500 font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "CVC / CVV"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    required: true,
    maxLength: "4",
    placeholder: "\u2022\u2022\u2022",
    value: cardCvc,
    onChange: e => setCardCvc(e.target.value),
    className: "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-teal-500 font-mono"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-halved text-teal-600 text-sm"
  }), /*#__PURE__*/React.createElement("span", null, "256-Bit SSL Encrypted. Payment held in Passage Escrow until lease start.")), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: processing,
    className: "w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold text-sm py-4 rounded-2xl shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center space-x-2"
  }, processing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-notch fa-spin"
  }), /*#__PURE__*/React.createElement("span", null, "Verifying Payment with Bank...")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-lock"
  }), /*#__PURE__*/React.createElement("span", null, "Pay ", totalFormatted, " & Complete Reservation"))))));
};