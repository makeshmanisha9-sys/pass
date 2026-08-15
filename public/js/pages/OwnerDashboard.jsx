// Passage Property Owner Dashboard Component with WhatsApp Integration

window.OwnerDashboard = function OwnerDashboard({ currentUser, activeCurrency, currencyRates, onNavigate }) {
  const [properties, setProperties] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingProperty, setEditingProperty] = React.useState(null);

  // Form State
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [city, setCity] = React.useState('Chennai');
  const [neighborhood, setNeighborhood] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [pricePerMonth, setPricePerMonth] = React.useState(45000);
  const [deposit, setDeposit] = React.useState(90000);
  const [bedrooms, setBedrooms] = React.useState(2);
  const [bathrooms, setBathrooms] = React.useState(2);
  const [maxGuests, setMaxGuests] = React.useState(4);
  const [propertyType, setPropertyType] = React.useState('Serviced Apartment');
  const [coverImage, setCoverImage] = React.useState('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80');
  const [frroSupported, setFrroSupported] = React.useState(true);

  const resetForm = () => {
    setEditingProperty(null);
    setTitle('');
    setDescription('');
    setCity('Chennai');
    setNeighborhood('');
    setAddress('');
    setPricePerMonth(45000);
    setDeposit(90000);
    setBedrooms(2);
    setBathrooms(2);
    setMaxGuests(4);
    setPropertyType('Serviced Apartment');
    setCoverImage('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80');
    setFrroSupported(true);
  };

  const loadOwnerData = React.useCallback(async () => {
    setLoading(true);
    try {
      const propData = await window.PassageAPI.getProperties({ status: 'all' });
      const myProps = propData.filter(p => p.ownerId?._id === currentUser?._id || p.ownerId === currentUser?._id);
      setProperties(myProps);

      const bookingData = await window.PassageAPI.getOwnerBookings();
      setBookings(bookingData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  React.useEffect(() => {
    loadOwnerData();
  }, [loadOwnerData]);

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !address.trim()) {
      alert('Please fill in title, description, and full address.');
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        city,
        neighborhood: neighborhood.trim() || city,
        address: address.trim(),
        location: { lat: 13.0245, lng: 80.2452 },
        pricePerNight: Math.round(Number(pricePerMonth) / 25),
        pricePerMonth: Number(pricePerMonth),
        deposit: Number(deposit),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        maxGuests: Number(maxGuests),
        propertyType,
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        images: [coverImage.trim() || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'],
        frroSupported,
        amenities: ['WiFi', 'Air Conditioning', 'Power Backup', 'FRRO Assistance', 'Furnished']
      };

      if (editingProperty) {
        await window.PassageAPI.updateProperty(editingProperty._id, payload);
        alert('Property updated successfully!');
      } else {
        await window.PassageAPI.createProperty(payload);
        alert('Property created successfully! It is now listed.');
      }

      setShowAddModal(false);
      resetForm();
      loadOwnerData();
    } catch (err) {
      alert(err.message || 'Error saving property');
    }
  };

  const handleDeleteProperty = async (id) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await window.PassageAPI.deleteProperty(id);
        alert('Listing deleted');
        loadOwnerData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      await window.PassageAPI.updateBookingStatus(id, status);
      alert(`Booking ${status}`);
      loadOwnerData();
    } catch (err) {
      alert(err.message);
    }
  };

  // WhatsApp Messaging Helpers
  const handleWhatsAppTenant = (booking) => {
    const tenantName = booking.tenantId?.name || 'Expat Guest';
    const propTitle = booking.propertyId?.title || 'Passage Residence';
    const bookingCode = booking.bookingNumber || 'PAS-BOOKING';
    const tenantPhone = booking.tenantId?.phone || '919876543210';

    const message = `Hello ${tenantName}! I am your host on Passage regarding reservation #${bookingCode} for "${propTitle}". Status: ${booking.status.toUpperCase()}. Welcome to India! Let me know if you have any check-in questions or need assistance with Form C / FRRO registration.`;

    window.PassageAPI.openWhatsApp(tenantPhone, message);
  };

  const handleShareListingWhatsApp = (property) => {
    const shareMessage = `🏡 Verified Expat Residence in ${property.city}: "${property.title}" (${property.bedrooms} BHK, FRRO Form C Supported). Check out the listing on Passage: http://localhost:5000`;
    window.PassageAPI.openWhatsApp('', shareMessage);
  };

  // KPI Calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const activeCount = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <span className="bg-teal-50 text-teal-700 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-teal-200">
            Property Owner Dashboard
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Landlord Management Console</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              const msg = `Hello Passage Landlord Support! I need assistance managing my properties or tenant FRRO verification.`;
              window.PassageAPI.openWhatsApp('919876543210', msg);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-colors"
          >
            <i className="fa-brands fa-whatsapp text-sm"></i>
            <span>Passage WhatsApp Support</span>
          </button>

          <button 
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-teal-600/30 flex items-center space-x-2 transition-colors"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add New Property</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Landlord Quick Action Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-700/50">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <i className="fa-brands fa-whatsapp text-emerald-400 text-xl"></i>
            <span className="font-extrabold text-sm text-emerald-300 uppercase tracking-wider">WhatsApp Host Suite Active</span>
          </div>
          <h3 className="font-extrabold text-lg text-white">Direct Expat Communication & Instant Booking Alerts</h3>
          <p className="text-xs text-emerald-100/80 max-w-xl">
            Communicate directly with foreign tenants via WhatsApp. Send pre-filled check-in instructions, FRRO Form C guidance, or share listings with 1-click.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => {
              const msg = `Check out my verified rental listings across India for expats on Passage: http://localhost:5000`;
              window.PassageAPI.openWhatsApp('', msg);
            }}
            className="bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow transition-colors flex items-center space-x-1.5"
          >
            <i className="fa-brands fa-whatsapp text-emerald-600 text-base"></i>
            <span>Broadcast All Listings</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Listings</span>
          <p className="text-2xl font-extrabold text-slate-900">{properties.length}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Active Bookings</span>
          <p className="text-2xl font-extrabold text-teal-600">{activeCount}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Monthly Revenue</span>
          <p className="text-2xl font-extrabold text-slate-900">
            {window.PassageAPI.formatCurrency(totalRevenue, activeCurrency, currencyRates)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Occupancy Rate</span>
          <p className="text-2xl font-extrabold text-emerald-600">84%</p>
        </div>
      </div>

      {/* Received Expat Booking Requests */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900">Received Booking Requests</h3>
          <span className="text-[11px] text-slate-500 font-bold">Direct WhatsApp Tenant Messaging Enabled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-2">Booking ID</th>
                <th className="py-3 px-2">Foreign Tenant</th>
                <th className="py-3 px-2">Property</th>
                <th className="py-3 px-2">Dates</th>
                <th className="py-3 px-2">Rent Paid</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-slate-400">No booking requests received yet.</td>
                </tr>
              ) : (
                bookings.map(b => (
                  <tr key={b._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-2 font-mono font-bold text-teal-600">{b.bookingNumber}</td>
                    <td className="py-3 px-2">
                      <span className="font-bold text-slate-900 block">{b.tenantId?.name || 'Expat'}</span>
                      <span className="text-[10px] text-slate-400">{b.tenantId?.nationality} • {b.tenantId?.passportNumber}</span>
                    </td>
                    <td className="py-3 px-2 font-semibold text-slate-800">{b.propertyId?.title || 'Residence'}</td>
                    <td className="py-3 px-2 text-slate-500">
                      {new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-900">
                      {window.PassageAPI.formatCurrency(b.totalAmount, activeCurrency, currencyRates)}
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 flex items-center space-x-1.5">
                      <button 
                        onClick={() => handleBookingStatus(b._id, 'confirmed')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[10px]"
                      >
                        Approve
                      </button>

                      <button 
                        onClick={() => handleWhatsAppTenant(b)}
                        className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] flex items-center space-x-1"
                        title="Chat with Tenant on WhatsApp"
                      >
                        <i className="fa-brands fa-whatsapp text-xs"></i>
                        <span>WhatsApp</span>
                      </button>

                      <button 
                        onClick={() => handleBookingStatus(b._id, 'cancelled')}
                        className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-[10px]"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property Listings Management */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">My Property Listings</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => (
            <div key={p._id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <img src={p.coverImage} alt={p.title} className="w-full h-36 object-cover rounded-xl" />
              <div>
                <span className="bg-teal-100 text-teal-800 font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                  {p.status}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-1 line-clamp-1">{p.title}</h4>
                <p className="text-slate-500">{p.neighborhood}, {p.city}</p>
                <p className="font-extrabold text-teal-600 mt-1">
                  {window.PassageAPI.formatCurrency(p.pricePerMonth, activeCurrency, currencyRates)} / month
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-200">
                <button 
                  onClick={() => {
                    setEditingProperty(p);
                    setTitle(p.title || '');
                    setDescription(p.description || '');
                    setCity(p.city || 'Chennai');
                    setNeighborhood(p.neighborhood || '');
                    setAddress(p.address || '');
                    setPricePerMonth(p.pricePerMonth || 45000);
                    setDeposit(p.deposit || 90000);
                    setBedrooms(p.bedrooms || 2);
                    setBathrooms(p.bathrooms || 2);
                    setMaxGuests(p.maxGuests || 4);
                    setPropertyType(p.propertyType || 'Serviced Apartment');
                    setCoverImage(p.coverImage || '');
                    setFrroSupported(p.frroSupported ?? true);
                    setShowAddModal(true);
                  }}
                  className="flex-1 py-1.5 bg-slate-800 text-white font-bold rounded-lg text-center"
                >
                  Edit
                </button>

                <button 
                  onClick={() => handleShareListingWhatsApp(p)}
                  className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-center flex items-center space-x-1"
                  title="Share listing on WhatsApp"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i>
                  <span>Share</span>
                </button>

                <button 
                  onClick={() => handleDeleteProperty(p._id)}
                  className="py-1.5 px-3 bg-red-500 text-white font-bold rounded-lg text-center"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full space-y-4 text-xs text-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">
                {editingProperty ? 'Edit Property Listing' : 'Add New Expat Residence'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Property Title</label>
                <input 
                  type="text" 
                  required 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Executive Loft near 100ft Road" 
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium" 
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea 
                  rows="3" 
                  required 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Mention FRRO help, optical fiber WiFi, generator backup..." 
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">City</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-bold">
                    <option value="Chennai">Chennai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Goa">Goa</option>
                    <option value="Kochi">Kochi</option>
                    <option value="Jaipur">Jaipur</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Neighborhood</label>
                  <input 
                    type="text" 
                    required 
                    value={neighborhood} 
                    onChange={(e) => setNeighborhood(e.target.value)} 
                    placeholder="e.g. Koramangala" 
                    className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Full Address</label>
                <input 
                  type="text" 
                  required 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="e.g. 12th Main, Koramangala, Bengaluru" 
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Monthly Rent (INR)</label>
                  <input type="number" required value={pricePerMonth} onChange={(e) => setPricePerMonth(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Security Deposit (INR)</label>
                  <input type="number" required value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Bedrooms</label>
                  <input type="number" min="1" max="10" required value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Bathrooms</label>
                  <input type="number" min="1" max="10" required value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Max Guests</label>
                  <input type="number" min="1" max="20" required value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium" />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Cover Image URL</label>
                <input type="text" required value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-mono" />
              </div>

              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold py-3 rounded-xl shadow-md transition-colors">
                {editingProperty ? 'Save Changes' : 'Submit Listing for Verification'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
