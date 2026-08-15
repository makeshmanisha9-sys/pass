// Passage Booking & Payment Flow Pages

window.BookingPage = function BookingPage({ bookingDraft, property, activeCurrency, currencyRates, onProceedToPayment, onNavigate }) {
  const [specialRequests, setSpecialRequests] = React.useState('');
  const [frroRequired, setFrroRequired] = React.useState(true);

  if (!property || !bookingDraft) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">No booking session found</h2>
        <button onClick={() => onNavigate('search')} className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl">
          Return to Properties
        </button>
      </div>
    );
  }

  const handleContinue = (e) => {
    e.preventDefault();
    onProceedToPayment({
      ...bookingDraft,
      specialRequests,
      frroRequired
    });
  };

  const totalFormatted = window.PassageAPI.formatCurrency(bookingDraft.totalINR, activeCurrency, currencyRates);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('search')} className="hover:underline">Search</button>
        <span>/</span>
        <button onClick={() => onNavigate('property-detail', { id: property._id })} className="hover:underline">{property.title}</button>
        <span>/</span>
        <span className="font-bold text-slate-900">Booking Review</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Booking Details Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-xl font-extrabold text-slate-900">1. Confirm Your Rental Details</h1>
            <p className="text-xs text-slate-500">Review your stay dates and special expat assistance requirements</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Check-In</span>
              <span className="font-extrabold text-slate-900 text-sm">{bookingDraft.checkIn}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Check-Out</span>
              <span className="font-extrabold text-slate-900 text-sm">{bookingDraft.checkOut}</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Special Arrival Requests</label>
              <textarea 
                rows="3"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="E.g. Flight FRA #102 arriving at 2 AM, need key box code or airport cab arrangement."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-teal-500"
              ></textarea>
            </div>

            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-start space-x-3">
              <input 
                type="checkbox"
                id="frro"
                checked={frroRequired}
                onChange={(e) => setFrroRequired(e.target.checked)}
                className="mt-1 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="frro" className="cursor-pointer">
                <span className="font-bold text-teal-900 block text-xs">Request Free FRRO Registration (Form C) Paperwork</span>
                <span className="text-[11px] text-teal-700 block mt-0.5">
                  The landlord will prepare an official notarized lease draft required for online Indian immigration (FRRO) registration.
                </span>
              </label>
            </div>
          </div>

          <button 
            onClick={handleContinue}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-xl shadow-teal-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <span>Proceed to Payment</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        {/* Summary Card */}
        <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
          <div className="flex space-x-3">
            <img src={property.coverImage} alt={property.title} className="w-20 h-20 rounded-xl object-cover" />
            <div>
              <span className="text-[10px] font-bold uppercase text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{property.city}</span>
              <h3 className="font-bold text-xs text-slate-900 line-clamp-2 mt-1">{property.title}</h3>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Guests</span>
              <span className="font-bold text-slate-900">{bookingDraft.guests} Guest(s)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Escrow Security</span>
              <span className="font-bold text-teal-600">Guaranteed</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-extrabold text-sm text-slate-900">
              <span>Total Price</span>
              <span className="text-teal-600">{totalFormatted}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
