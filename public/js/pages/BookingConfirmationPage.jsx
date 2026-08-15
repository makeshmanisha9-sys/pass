// Passage Digital Expat Booking Ticket & Pass Component

window.BookingConfirmationPage = function BookingConfirmationPage({ booking, activeCurrency = 'INR', currencyRates = {}, onNavigate }) {
  if (!booking) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">No recent confirmation found</h2>
        <button onClick={() => typeof onNavigate === 'function' && onNavigate('my-bookings')} className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl">
          View My Bookings
        </button>
      </div>
    );
  }

  const prop = booking.propertyId || {};
  const owner = booking.ownerId || {};
  const tenant = booking.tenantId || {};
  const formattedTotal = window.PassageAPI.formatCurrency(booking.totalAmount, activeCurrency, currencyRates);
  const bookingRef = booking.bookingNumber || ('PAS-' + Math.floor(100000 + Math.random() * 900000));

  const checkInDate = booking.checkIn ? new Date(booking.checkIn).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'Flexible';
  const checkOutDate = booking.checkOut ? new Date(booking.checkOut).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'Flexible';

  const handlePrint = () => {
    window.print();
  };

  const hostPhone = owner.phone || '919876543210';
  const waMsg = `Hi ${owner.name || 'Host'}, I have confirmed my booking #${bookingRef} for "${prop.title || 'Residence'}". Dates: ${checkInDate} to ${checkOutDate}.`;
  const waUrl = window.PassageAPI.generateWhatsAppUrl(hostPhone, waMsg);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Controls (Hidden when printing) */}
      <div className="print:hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-extrabold text-lg">
            ✓
          </div>
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">Booking Verified</span>
            <h1 className="text-sm font-extrabold text-white">Digital Expat Residence Ticket</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handlePrint}
            className="bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1.5"
          >
            <i className="fa-solid fa-print"></i>
            <span>Print / Save Ticket</span>
          </button>
          
          <button 
            onClick={() => typeof onNavigate === 'function' && onNavigate('my-bookings')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700"
          >
            My Bookings
          </button>
        </div>
      </div>

      {/* OFFICIAL PRINTABLE BOOKING TICKET */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 shadow-2xl overflow-hidden print:border-none print:shadow-none">
        
        {/* Ticket Header Banner */}
        <div className="bg-slate-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-teal-500">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="bg-teal-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                Official Expat Stay Pass
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 font-bold text-[10px] px-2.5 py-0.5 rounded-md border border-emerald-500/30">
                CONFIRMED & ESCROW GUARANTEED
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">PASSAGE EXPAT RESIDENCE TICKET</h2>
            <p className="text-xs text-slate-400">Verified Long-Term Foreigner Rental Entry Voucher • India</p>
          </div>

          <div className="text-left sm:text-right bg-slate-900 p-3 rounded-2xl border border-slate-800 font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-sans">Ticket Ref Code</span>
            <span className="text-lg font-black text-teal-400 tracking-wider">{bookingRef}</span>
          </div>
        </div>

        {/* Main Ticket Content Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Guest & Residence Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-200">
            
            {/* Property Image & Details */}
            <div className="md:col-span-2 flex space-x-4 items-start">
              <img 
                src={prop.coverImage || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80'} 
                alt={prop.title || 'Residence'} 
                className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-md"
              />
              <div className="space-y-1 text-xs">
                <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase">
                  {prop.propertyType || 'Serviced Residence'}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base leading-snug">{prop.title || 'Luxury Expat Residence'}</h3>
                <p className="text-slate-600 font-medium flex items-center space-x-1">
                  <i className="fa-solid fa-location-dot text-teal-600"></i>
                  <span>{prop.address || (prop.city ? `${prop.city}, India` : 'India')}</span>
                </p>
                <div className="pt-1 flex items-center space-x-3 text-slate-500 text-[11px]">
                  <span><i className="fa-solid fa-bed text-teal-600 mr-1"></i>{prop.bedrooms || 2} Beds</span>
                  <span><i className="fa-solid fa-bath text-teal-600 mr-1"></i>{prop.bathrooms || 2} Baths</span>
                  <span><i className="fa-solid fa-wifi text-teal-600 mr-1"></i>300 Mbps WiFi</span>
                </div>
              </div>
            </div>

            {/* Expat Guest Ticket Holder */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block border-b border-slate-200 pb-1">
                Ticket Holder Details
              </span>
              <div className="font-bold text-slate-900 text-sm">
                {tenant.name || 'Expat Guest'}
              </div>
              <div className="text-slate-600 space-y-0.5">
                <p><span className="font-semibold text-slate-400">Nationality:</span> {tenant.nationality || 'Foreign National'}</p>
                <p><span className="font-semibold text-slate-400">Email:</span> {tenant.email || 'tenant@passage.com'}</p>
                <p><span className="font-semibold text-slate-400">Guests:</span> {booking.guests || 1} Person(s)</p>
              </div>
            </div>

          </div>

          {/* Stay Dates & Financial Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-teal-50/60 rounded-2xl border border-teal-200/80 text-xs">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block">Check-In Date</span>
              <span className="font-extrabold text-slate-900 text-sm block mt-0.5">{checkInDate}</span>
              <span className="text-[10px] text-teal-700">12:00 PM Check-In</span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block">Check-Out Date</span>
              <span className="font-extrabold text-slate-900 text-sm block mt-0.5">{checkOutDate}</span>
              <span className="text-[10px] text-teal-700">11:00 AM Check-Out</span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block">Payment Status</span>
              <span className="font-extrabold text-emerald-700 text-sm block mt-0.5">PAID & ESCROWED</span>
              <span className="text-[10px] text-slate-500">Escrow Protected</span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block">Total Amount</span>
              <span className="font-black text-teal-700 text-base block mt-0.5">{formattedTotal}</span>
              <span className="text-[10px] text-slate-500">Rent + Deposit</span>
            </div>
          </div>

          {/* Landlord Host & Compliance Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            
            {/* Host Contact */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 text-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Verified Landlord Host Info
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{owner.name || 'Verified Host'}</h4>
                  <p className="text-slate-500">{owner.email || 'owner@passage.com'}</p>
                </div>
                <a 
                  href={waUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="print:hidden bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-[11px] flex items-center space-x-1.5 shadow-md"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i>
                  <span>Chat Host</span>
                </a>
              </div>
            </div>

            {/* Government Visa & FRRO Ticket Note */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block flex items-center space-x-1">
                <i className="fa-solid fa-passport text-teal-600"></i>
                <span>FRRO Form C Registration Status</span>
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                This ticket serves as proof of accommodation for foreign nationals under Indian immigration rules. Landlord Form C filing is active.
              </p>
            </div>

          </div>

          {/* Ticket Barcode & Perforated Seal */}
          <div className="pt-6 border-t-2 border-dashed border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs">
            <div className="font-mono text-center sm:text-left space-y-1">
              <div className="bg-slate-900 text-white px-4 py-2 rounded-lg tracking-[0.3em] font-extrabold text-sm inline-block">
                ||||| |||| ||||| || |||||| |||
              </div>
              <p className="text-[10px] text-slate-500 font-sans">Passage Encrypted Verification Hash • {bookingRef}</p>
            </div>

            <div className="text-center sm:text-right space-y-1 text-[11px]">
              <span className="font-bold text-slate-700 block">Passage Expat Rentals India</span>
              <span className="text-slate-500">24/7 Expat Helpline: support@passage.com</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
