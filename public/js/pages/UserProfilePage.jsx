// Passage User Profile & Passport Upload Component

window.UserProfilePage = function UserProfilePage({ currentUser, onNavigate, onAuthSuccess }) {
  const [user, setUser] = React.useState(currentUser || {});
  const [name, setName] = React.useState(currentUser?.name || '');
  const [nationality, setNationality] = React.useState(currentUser?.nationality || 'Germany');
  const [passportNumber, setPassportNumber] = React.useState(currentUser?.passportNumber || '');
  const [phone, setPhone] = React.useState(currentUser?.phone || '');
  const [saving, setSaving] = React.useState(false);

  // Document Upload State
  const [documents, setDocuments] = React.useState([]);
  const [docType, setDocType] = React.useState('passport');
  const [fileName, setFileName] = React.useState('');
  const [fileUrl, setFileUrl] = React.useState('');
  const [uploading, setUploading] = React.useState(false);

  // Synchronize component state whenever currentUser updates
  React.useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.name || '');
      setNationality(currentUser.nationality || 'Germany');
      setPassportNumber(currentUser.passportNumber || '');
      setPhone(currentUser.phone || '');

      window.PassageAPI.getMyDocuments()
        .then(data => setDocuments(data || []))
        .catch(err => console.log('Doc fetch err:', err));
    }
  }, [currentUser]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await window.PassageAPI.updateProfile({
        name,
        nationality,
        passportNumber,
        phone
      });
      alert('Profile updated successfully!');
      const updatedUser = res.user || res;
      setUser(updatedUser);
      if (typeof onAuthSuccess === 'function') {
        onAuthSuccess(updatedUser);
      }
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDocUpload = async (e) => {
    e.preventDefault();
    if (!fileName.trim() || !fileUrl.trim()) {
      alert('Please enter document title and file URL reference.');
      return;
    }

    setUploading(true);
    try {
      const newDoc = await window.PassageAPI.uploadDocument({
        documentType: docType,
        fileName: fileName.trim(),
        fileUrl: fileUrl.trim()
      });
      setDocuments([newDoc, ...documents]);
      setFileName('');
      setFileUrl('');
      alert('Document uploaded! Passage verification team will review within 24 hours.');
    } catch (err) {
      alert(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Expat Profile & Passport Documents</h1>
        <p className="text-xs text-slate-500">Manage personal details, nationality, and FRRO visa verification paperwork</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card & Form */}
        <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-center">
          <img 
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} 
            alt={user.name || 'User'} 
            className="w-24 h-24 rounded-3xl object-cover mx-auto ring-4 ring-teal-500/30"
          />
          <div>
            <h2 className="font-extrabold text-base text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-teal-50 text-teal-700 font-extrabold text-[10px] uppercase rounded-full border border-teal-200">
              {user.role} Account • {user.nationality}
            </span>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-3 text-left pt-3 border-t text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nationality</label>
              <input 
                type="text" 
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Passport Number</label>
              <input 
                type="text" 
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
                placeholder="DE98273641"
                className="w-full bg-slate-50 border rounded-xl p-2.5 font-mono uppercase focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium focus:outline-none focus:border-teal-500"
              />
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-extrabold py-2.5 rounded-xl shadow text-xs transition-colors"
            >
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Passport / Visa Document Vault */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
              <i className="fa-solid fa-passport text-teal-600"></i>
              <span>Upload Passport / Visa for FRRO Verification</span>
            </h3>
            <p className="text-xs text-slate-500">
              Indian immigration rules require foreigners to submit passport & visa copies to landlords for Form C submission within 14 days of arrival.
            </p>

            <form onSubmit={handleDocUpload} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Document Type</label>
                  <select 
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full bg-slate-50 border rounded-xl p-2.5 font-semibold"
                  >
                    <option value="passport">Passport Copy</option>
                    <option value="visa">Employment / Tourist Visa</option>
                    <option value="frro">FRRO Registration Form C</option>
                    <option value="lease_agreement">Notarized Lease Copy</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Document Label / File Title</label>
                  <input 
                    type="text" 
                    required
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g. passport_germany_page1.pdf"
                    className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Document File Reference URL</label>
                <input 
                  type="text" 
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://passage-uploads.s3.amazonaws.com/passport_copy.pdf"
                  className="w-full bg-slate-50 border rounded-xl p-2.5 font-mono"
                />
              </div>

              <button 
                type="submit"
                disabled={uploading}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-teal-600/30 text-xs transition-colors"
              >
                {uploading ? 'Encrypting & Saving...' : 'Securely Upload Document'}
              </button>
            </form>
          </div>

          {/* Document Vault Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">Your Document Vault</h3>
            
            <div className="space-y-2">
              {documents.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No passport documents uploaded yet.</p>
              ) : (
                documents.map(d => (
                  <div key={d._id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-file-pdf text-red-500 text-lg"></i>
                      <div>
                        <span className="font-extrabold text-slate-900 block">{d.fileName}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{d.documentType} • {new Date(d.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      d.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
