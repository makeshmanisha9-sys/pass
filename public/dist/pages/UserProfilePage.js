// Passage User Profile & Passport Upload Component

window.UserProfilePage = function UserProfilePage({
  currentUser,
  onNavigate,
  onAuthSuccess
}) {
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
      window.PassageAPI.getMyDocuments().then(data => setDocuments(data || [])).catch(err => console.log('Doc fetch err:', err));
    }
  }, [currentUser]);
  const handleProfileSave = async e => {
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
  const handleDocUpload = async e => {
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
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-4xl mx-auto px-4 py-10 space-y-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-b border-slate-200 pb-4"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "Expat Profile & Passport Documents"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Manage personal details, nationality, and FRRO visa verification paperwork")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    alt: user.name || 'User',
    className: "w-24 h-24 rounded-3xl object-cover mx-auto ring-4 ring-teal-500/30"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "font-extrabold text-base text-slate-900"
  }, user.name), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, user.email), /*#__PURE__*/React.createElement("span", {
    className: "inline-block mt-2 px-3 py-1 bg-teal-50 text-teal-700 font-extrabold text-[10px] uppercase rounded-full border border-teal-200"
  }, user.role, " Account \u2022 ", user.nationality)), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleProfileSave,
    className: "space-y-3 text-left pt-3 border-t text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Full Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: name,
    onChange: e => setName(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Nationality"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: nationality,
    onChange: e => setNationality(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Passport Number"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: passportNumber,
    onChange: e => setPassportNumber(e.target.value),
    placeholder: "DE98273641",
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-mono uppercase focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Contact Phone"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: phone,
    onChange: e => setPhone(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium focus:outline-none focus:border-teal-500"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: saving,
    className: "w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-extrabold py-2.5 rounded-xl shadow text-xs transition-colors"
  }, saving ? 'Saving Changes...' : 'Save Profile Changes'))), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-base text-slate-900 flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-passport text-teal-600"
  }), /*#__PURE__*/React.createElement("span", null, "Upload Passport / Visa for FRRO Verification")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "Indian immigration rules require foreigners to submit passport & visa copies to landlords for Form C submission within 14 days of arrival."), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleDocUpload,
    className: "space-y-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Document Type"), /*#__PURE__*/React.createElement("select", {
    value: docType,
    onChange: e => setDocType(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-semibold"
  }, /*#__PURE__*/React.createElement("option", {
    value: "passport"
  }, "Passport Copy"), /*#__PURE__*/React.createElement("option", {
    value: "visa"
  }, "Employment / Tourist Visa"), /*#__PURE__*/React.createElement("option", {
    value: "frro"
  }, "FRRO Registration Form C"), /*#__PURE__*/React.createElement("option", {
    value: "lease_agreement"
  }, "Notarized Lease Copy"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Document Label / File Title"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: fileName,
    onChange: e => setFileName(e.target.value),
    placeholder: "e.g. passport_germany_page1.pdf",
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-medium"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold mb-1"
  }, "Document File Reference URL"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: fileUrl,
    onChange: e => setFileUrl(e.target.value),
    placeholder: "https://passage-uploads.s3.amazonaws.com/passport_copy.pdf",
    className: "w-full bg-slate-50 border rounded-xl p-2.5 font-mono"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: uploading,
    className: "w-full bg-teal-600 hover:bg-teal-500 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-teal-600/30 text-xs transition-colors"
  }, uploading ? 'Encrypting & Saving...' : 'Securely Upload Document'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-sm text-slate-900"
  }, "Your Document Vault"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, documents.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 py-4 text-center"
  }, "No passport documents uploaded yet.") : documents.map(d => /*#__PURE__*/React.createElement("div", {
    key: d._id,
    className: "p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-pdf text-red-500 text-lg"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-900 block"
  }, d.fileName), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-slate-400 uppercase font-bold"
  }, d.documentType, " \u2022 ", new Date(d.uploadedAt).toLocaleDateString()))), /*#__PURE__*/React.createElement("span", {
    className: `px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${d.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`
  }, d.status))))))));
};