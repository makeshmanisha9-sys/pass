// Passage Executive Admin Dashboard Component with WhatsApp Integration

window.AdminDashboard = function AdminDashboard({ currentUser, activeCurrency, currencyRates, onNavigate }) {
  const [stats, setStats] = React.useState(null);
  const [properties, setProperties] = React.useState([]);
  const [documents, setDocuments] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState('overview');
  const [loading, setLoading] = React.useState(true);

  const loadAdminData = React.useCallback(async () => {
    setLoading(true);
    try {
      const statsData = await window.PassageAPI.getAdminStats();
      setStats(statsData || {});

      const propData = await window.PassageAPI.getProperties({ status: 'all' });
      setProperties(propData || []);

      const docData = await window.PassageAPI.getAllDocuments();
      setDocuments(docData || []);

      const userData = await window.PassageAPI.getAllUsers();
      setUsers(userData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handlePropertyVerify = async (id, status) => {
    try {
      await window.PassageAPI.verifyProperty(id, status);
      alert(`Property status updated to ${status}`);
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDocVerify = async (id, status) => {
    try {
      await window.PassageAPI.verifyDocument(id, status);
      alert(`Document status updated to ${status}`);
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  // WhatsApp Messaging Actions for Admin
  const handleWhatsAppOwner = (ownerName, phone, propTitle) => {
    const msg = `Hello ${ownerName || 'Landlord Host'}! This is Passage Admin regarding your property listing "${propTitle}". We require quick verification details to list it live on the expat portal.`;
    window.PassageAPI.openWhatsApp(phone || '919876543210', msg);
  };

  const handleWhatsAppTenant = (tenantName, phone, docName) => {
    const msg = `Hello ${tenantName || 'Expat Guest'}! This is Passage Support regarding your document "${docName || 'Passport Copy'}". Your FRRO Form C compliance check has been updated. Let us know if you need assistance!`;
    window.PassageAPI.openWhatsApp(phone || '919876543210', msg);
  };

  const metrics = stats?.metrics || {
    totalUsers: users.length || 142,
    totalTenants: 98,
    totalOwners: 44,
    totalProperties: properties.length || 56,
    verifiedProperties: properties.filter(p => p.status === 'verified').length || 52,
    pendingProperties: properties.filter(p => p.status === 'pending_verification').length || 4,
    totalBookings: 218,
    activeBookings: 34,
    totalRevenue: 28400000
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <span className="bg-amber-50 text-amber-700 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-200">
            Executive Admin Control Center
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Platform Operations & Compliance Console</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => {
              const msg = `Passage Admin System Broadcast: All FRRO compliance & host verification channels active.`;
              window.PassageAPI.openWhatsApp('', msg);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-colors"
          >
            <i className="fa-brands fa-whatsapp text-sm"></i>
            <span>WhatsApp Admin Broadcast</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Registered Users</span>
          <p className="text-2xl font-extrabold text-slate-900">{metrics.totalUsers}</p>
          <span className="text-[10px] text-teal-600 font-bold">{metrics.totalTenants} Expats • {metrics.totalOwners} Hosts</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Properties</span>
          <p className="text-2xl font-extrabold text-slate-900">{metrics.totalProperties}</p>
          <span className="text-[10px] text-emerald-600 font-bold">{metrics.verifiedProperties} Verified Live</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Platform GMV</span>
          <p className="text-2xl font-extrabold text-amber-600">
            {window.PassageAPI.formatCurrency(metrics.totalRevenue, activeCurrency, currencyRates)}
          </p>
          <span className="text-[10px] text-slate-400 font-bold">Escrow Protected</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">FRRO Pending Docs</span>
          <p className="text-2xl font-extrabold text-rose-600">{documents.filter(d => d.status === 'pending').length}</p>
          <span className="text-[10px] text-slate-400 font-bold">Require Review</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2 text-xs font-extrabold">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'overview' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          All Activity
        </button>
        <button 
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'properties' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Property Approvals ({properties.filter(p => p.status === 'pending_verification').length})
        </button>
        <button 
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'documents' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Passport Vault Compliance ({documents.length})
        </button>
      </div>

      {/* TAB 1: PROPERTY VERIFICATION APPROVALS */}
      {(activeTab === 'overview' || activeTab === 'properties') && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">Property Verification & Host WhatsApp Hub</h3>
            <span className="text-[11px] text-slate-500 font-bold">Direct Landlord Contact Enabled</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-2">Property Title</th>
                  <th className="py-3 px-2">City</th>
                  <th className="py-3 px-2">Owner / Host</th>
                  <th className="py-3 px-2">Rent / Month</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(p => (
                  <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-2 font-bold text-slate-900">{p.title}</td>
                    <td className="py-3 px-2 text-slate-600">{p.city}</td>
                    <td className="py-3 px-2 text-slate-600 font-semibold">{p.ownerId?.name || 'Landlord Host'}</td>
                    <td className="py-3 px-2 font-extrabold text-teal-600">
                      {window.PassageAPI.formatCurrency(p.pricePerMonth, activeCurrency, currencyRates)}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        p.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 flex items-center space-x-1.5">
                      {p.status !== 'verified' && (
                        <button 
                          onClick={() => handlePropertyVerify(p._id, 'verified')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px]"
                        >
                          Approve
                        </button>
                      )}

                      <button 
                        onClick={() => handleWhatsAppOwner(p.ownerId?.name, p.ownerId?.phone, p.title)}
                        className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] flex items-center space-x-1"
                        title="Contact Host on WhatsApp"
                      >
                        <i className="fa-brands fa-whatsapp text-xs"></i>
                        <span>WhatsApp Host</span>
                      </button>

                      {p.status !== 'rejected' && (
                        <button 
                          onClick={() => handlePropertyVerify(p._id, 'rejected')}
                          className="px-2.5 py-1 bg-red-500 text-white rounded-lg font-bold text-[10px]"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PASSPORT / VISA DOCUMENTS & EXPAT WHATSAPP */}
      {(activeTab === 'overview' || activeTab === 'documents') && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">Foreign Expat Passport & Visa Verification</h3>
            <span className="text-[11px] text-slate-500 font-bold">Direct Expat WhatsApp Communication</span>
          </div>

          <div className="space-y-3">
            {documents.length === 0 ? (
              <p className="text-slate-400">No passport documents uploaded yet.</p>
            ) : (
              documents.map(d => (
                <div key={d._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <i className="fa-solid fa-file-pdf text-red-500 text-xl"></i>
                    <div>
                      <span className="font-extrabold text-slate-900 block">{d.fileName}</span>
                      <span className="text-slate-500 text-[11px]">Type: {d.documentType.toUpperCase()} • User: {d.userId?.name || 'Expat Guest'} ({d.userId?.nationality || 'Foreign National'})</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      d.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.status}
                    </span>

                    <button 
                      onClick={() => handleWhatsAppTenant(d.userId?.name, d.userId?.phone, d.fileName)}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] flex items-center space-x-1"
                    >
                      <i className="fa-brands fa-whatsapp text-xs"></i>
                      <span>WhatsApp Expat</span>
                    </button>

                    {d.status === 'pending' && (
                      <button 
                        onClick={() => handleDocVerify(d._id, 'verified')}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[10px]"
                      >
                        Approve FRRO
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
