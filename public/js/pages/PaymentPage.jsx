// Passage Payment Integration Page Component with 1-Click Test Card Fill

window.PaymentPage = function PaymentPage({ bookingDraft, property, activeCurrency = 'INR', currencyRates = {}, onPaymentSuccess, onNavigate }) {
  const [provider, setProvider] = React.useState('razorpay'); // 'razorpay' or 'stripe'
  const [cardName, setCardName] = React.useState('Dr. Michael Weber');
  const [cardNumber, setCardNumber] = React.useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = React.useState('12/28');
  const [cardCvc, setCardCvc] = React.useState('888');
  const [processing, setProcessing] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  if (!property || !bookingDraft) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Session expired or no property selected</h2>
        <button onClick={() => typeof onNavigate === 'function' && onNavigate('search')} className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl">
          Return to Properties
        </button>
      </div>
    );
  }

  const fillTestCard = () => {
    setCardName('Dr. Michael Weber');
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('888');
  };

  const handlePay = async (e) => {
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
        specialRequests: bookingDraft.specialRequests || 'Expat long term reservation'
      };

      const result = await window.PassageAPI.createBooking(bookingData);

      // Simulate instant payment verification
      setTimeout(() => {
        setProcessing(false);
        if (typeof onPaymentSuccess === 'function') {
          onPaymentSuccess(result);
        } else if (typeof onNavigate === 'function') {
          onNavigate('booking-confirmation');
        }
      }, 1000);

    } catch (err) {
      setProcessing(false);
      setErrorMsg(err.message || 'Payment processing failed. Please check your card details.');
    }
  };

  const totalFormatted = window.PassageAPI.formatCurrency(bookingDraft.totalINR, activeCurrency, currencyRates);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">2. Secure Payment Gateway</h1>
            <p className="text-xs text-slate-500">Encrypted multi-currency payment via Razorpay / Stripe Architecture</p>
          </div>
          <span className="bg-teal-50 text-teal-700 font-extrabold text-xs px-3 py-1 rounded-full border border-teal-200">
            {totalFormatted}
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Payment Gateway Provider Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">Select Gateway Provider</label>
            <button 
              type="button" 
              onClick={fillTestCard} 
              className="text-[11px] font-bold text-teal-600 hover:underline"
            >
              ⚡ Fill Test Card (4242)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => setProvider('razorpay')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                provider === 'razorpay' ? 'border-teal-600 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500/20' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className="fa-solid fa-bolt text-teal-600"></i>
              <span>Razorpay (Cards / UPI / NetBanking)</span>
            </button>

            <button 
              type="button"
              onClick={() => setProvider('stripe')}
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                provider === 'stripe' ? 'border-teal-600 bg-teal-50/50 text-teal-900 ring-2 ring-teal-500/20' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className="fa-brands fa-stripe text-indigo-600 text-base"></i>
              <span>Stripe Global Checkout</span>
            </button>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePay} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Cardholder Name</label>
            <input 
              type="text" 
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Dr. Michael Weber"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Card Number</label>
            <div className="relative">
              <input 
                type="text" 
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500 tracking-widest"
              />
              <div className="absolute right-3 top-3 flex space-x-1 text-slate-400 text-base">
                <i className="fa-brands fa-cc-visa"></i>
                <i className="fa-brands fa-cc-mastercard"></i>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Expiry Date (MM/YY)</label>
              <input 
                type="text" 
                required
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="12/28"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500 text-center"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">CVV / CVC</label>
              <input 
                type="password" 
                required
                maxLength="4"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                placeholder="888"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500 text-center"
              />
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-emerald-800">
            <span className="font-extrabold text-[11px] block uppercase tracking-wider">Passage Escrow Protection Active</span>
            <p className="text-[11px] leading-relaxed">
              Your payment will be held securely in Passage Escrow and only released to the host after check-in & FRRO Form C document submission.
            </p>
          </div>

          <button 
            type="submit"
            disabled={processing}
            className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold text-sm py-4 rounded-2xl shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center space-x-2"
          >
            {processing ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Verifying Payment with Escrow Bank...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-shield-halved"></i>
                <span>Pay {totalFormatted} & Authorize Escrow</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
