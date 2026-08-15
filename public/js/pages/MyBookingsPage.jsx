// Passage My Bookings Component with Direct Landlord WhatsApp Contact

window.MyBookingsPage = function MyBookingsPage({ activeCurrency, currencyRates, onNavigate }) {
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedBookingForReview, setSelectedBookingForReview] = React.useState(null);
  
  // Review form state
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [submittingReview, setSubmittingReview] = React.useState(false);

  const user = window.PassageAPI.getStoredUser();

  React.useEffect(() => {
    window.PassageAPI.getMyBookings()
      .then(data => {
        setBookings(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBookingForReview || !comment.trim()) return;

    setSubmittingReview(true);
    try {
      await window.PassageAPI.createReview({
        propertyId: selectedBookingForReview.propertyId._id || selectedBookingForReview.propertyId,
        bookingId: selectedBookingForReview._id,
        tenantName: user ? user.name : 'Expat Tenant',
        tenantCountry: user ? user.nationality : 'Foreign Expats',
        tenantAvatar: user ? user.avatar : '',
        rating: Number(rating),
        cleanliness: Number(rating),
        location: Number(rating),
        communication: Number(rating),
        value: Number(rating),
        comment: comment.trim()
      });

      alert('Thank you! Your verified review has been submitted.');
      setSelectedBookingForReview(null);
      setComment('');
    } catch (err) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleWhatsAppHost = (booking) => {
    const prop = booking.propertyId || {};
    const ownerPhone = booking.ownerId?.phone || prop.ownerId?.phone || '919876543210';
    const tenantName = user ? user.name : 'Expat Guest';
    const message = `Hi! This is ${tenantName} regarding reservation #${booking.bookingNumber} for "${prop.title || 'Passage Residence'}". Status: ${booking.status.toUpperCase()}. Let me know if you need any check-in details or FRRO Form C passport copies!`;

    window.PassageAPI.openWhatsApp(ownerPhone, message);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Rental Reservations</h1>
          <p className="text-xs text-slate-500">Track active bookings, payment receipts, and landlord FRRO documents</p>
        </div>
        <button onClick={() => onNavigate('search')} className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl">
          Browse More Homes
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-teal-600"></i>
          <p className="text-xs font-bold text-slate-500">Fetching your reservation history...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl text-slate-400">
            <i className="fa-solid fa-receipt"></i>
          </div>
          <h3 className="text-base font-bold text-slate-900">No active or past bookings</h3>
          <p className="text-xs text-slate-500">You haven't reserved any Passage verified homes yet.</p>
          <button onClick={() => onNavigate('search')} className="px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl">
            Explore Furnished Homes
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => {
            const prop = b.propertyId || {};
            const priceFormatted = window.PassageAPI.formatCurrency(b.totalAmount, activeCurrency, currencyRates);

            return (
              <div key={b._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <img src={prop.coverImage || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=300&q=80'} alt={prop.title} className="w-20 h-20 rounded-2xl object-cover" />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-teal-50 text-teal-700 text-[10px] font-extrabold px-2 py-0.5 rounded border border-teal-200 uppercase">
                        {b.bookingNumber}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                        b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-900">{prop.title || 'Passage Residence'}</h3>
                    <p className="text-xs text-slate-500">{prop.address || prop.city}</p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex md:flex-col items-end justify-between w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-teal-600 block">{priceFormatted}</span>
                    <span className="text-[10px] text-slate-400 block font-semibold">Payment: {b.paymentStatus}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => onNavigate('booking-confirmation', { booking: b })}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold rounded-xl flex items-center space-x-1 shadow-sm"
                    >
                      <i className="fa-solid fa-ticket text-xs"></i>
                      <span>View Ticket</span>
                    </button>

                    <button 
                      onClick={() => handleWhatsAppHost(b)}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center space-x-1 shadow-sm"
                      title="Chat directly with Landlord Host on WhatsApp"
                    >
                      <i className="fa-brands fa-whatsapp text-sm"></i>
                      <span>WhatsApp Host</span>
                    </button>

                    <button 
                      onClick={() => setSelectedBookingForReview(b)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
                    >
                      Write Review
                    </button>

                    <button 
                      onClick={() => onNavigate('property-detail', { id: prop._id })}
                      className="px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold rounded-xl"
                    >
                      View Home
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {selectedBookingForReview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-xs text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">Leave a Verified Review</h3>
              <button onClick={() => setSelectedBookingForReview(null)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block font-bold mb-1">Overall Rating (1 to 5 Stars)</label>
                <select 
                  value={rating} 
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-bold"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5/5 - Outstanding Expat Stay)</option>
                  <option value="4">⭐⭐⭐⭐ (4/5 - Very Good)</option>
                  <option value="3">⭐⭐⭐ (3/5 - Average)</option>
                  <option value="2">⭐⭐ (2/5 - Poor)</option>
                  <option value="1">⭐ (1/5 - Terrible)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Your Review & Experience</label>
                <textarea 
                  rows="4"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Mention landlord FRRO help, internet reliability, neighborhood safety..."
                  className="w-full bg-slate-50 border rounded-xl p-3 text-xs"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={submittingReview}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold py-3 rounded-xl shadow-md"
              >
                {submittingReview ? 'Submitting...' : 'Submit Verified Review'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
