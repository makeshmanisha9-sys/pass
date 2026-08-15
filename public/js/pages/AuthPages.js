// Passage Auth Pages & Modal Components (Login / Register / Forgot Password)

window.AuthPages = function AuthPages({
  mode = 'login',
  onAuthSuccess,
  onNavigate
}) {
  const [authMode, setAuthMode] = React.useState(mode);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('tenant');
  const [nationality, setNationality] = React.useState('Germany');
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (authMode === 'login') {
        const res = await window.PassageAPI.login(email, password);
        onAuthSuccess(res.user);
      } else if (authMode === 'register') {
        const res = await window.PassageAPI.register({
          name,
          email,
          password,
          role,
          nationality,
          phone
        });
        onAuthSuccess(res.user);
      } else if (authMode === 'forgot') {
        alert(`Reset instructions sent to ${email}`);
        setAuthMode('login');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-[600px] flex items-center justify-center py-12 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-extrabold text-xl mx-auto shadow-lg shadow-teal-500/20"
  }, "P"), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-extrabold text-slate-900"
  }, authMode === 'login' && 'Sign In to Passage', authMode === 'register' && 'Create Your Passage Account', authMode === 'forgot' && 'Reset Your Password'), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, authMode === 'login' && 'Access your expat stays, FRRO forms & wishlist', authMode === 'register' && 'Join thousands of foreigners & verified hosts across India', authMode === 'forgot' && 'Enter your registered email address')), authMode === 'login' && /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-[11px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-slate-700 block uppercase tracking-wider text-[10px]"
  }, "1-Click Demo Credentials:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-1.5 font-bold"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => fillDemo('tenant@passage.com', 'tenant123'),
    className: "bg-white hover:bg-teal-50 p-1.5 rounded-xl border border-slate-200 text-teal-700 truncate"
  }, "\uD83C\uDDE9\uD83C\uDDEA Expat"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => fillDemo('owner@passage.com', 'owner123'),
    className: "bg-white hover:bg-teal-50 p-1.5 rounded-xl border border-slate-200 text-teal-700 truncate"
  }, "\uD83C\uDFE1 Host"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => fillDemo('admin@passage.com', 'admin123'),
    className: "bg-white hover:bg-amber-50 p-1.5 rounded-xl border border-slate-200 text-amber-700 truncate"
  }, "\uD83D\uDEE1\uFE0F Admin"))), error && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200 text-center"
  }, error), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-4 text-xs"
  }, authMode === 'register' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Full Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Lena Hoffman",
    className: "w-full bg-slate-50 border rounded-xl p-3 focus:outline-none focus:border-teal-500 font-medium"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "I am registering as"), /*#__PURE__*/React.createElement("select", {
    value: role,
    onChange: e => setRole(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-3 font-bold focus:outline-none"
  }, /*#__PURE__*/React.createElement("option", {
    value: "tenant"
  }, "Foreign Expat / Tenant"), /*#__PURE__*/React.createElement("option", {
    value: "owner"
  }, "Property Owner / Landlord"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Nationality"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: nationality,
    onChange: e => setNationality(e.target.value),
    className: "w-full bg-slate-50 border rounded-xl p-3 font-medium"
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Email Address"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    required: true,
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "tenant@passage.com",
    className: "w-full bg-slate-50 border rounded-xl p-3 focus:outline-none focus:border-teal-500 font-medium"
  })), authMode !== 'forgot' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "font-bold text-slate-700"
  }, "Password"), authMode === 'login' && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setAuthMode('forgot'),
    className: "text-[11px] text-teal-600 font-bold hover:underline"
  }, "Forgot password?")), /*#__PURE__*/React.createElement("input", {
    type: "password",
    required: true,
    value: password,
    onChange: e => setPassword(e.target.value),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    className: "w-full bg-slate-50 border rounded-xl p-3 focus:outline-none focus:border-teal-500 font-mono"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: loading,
    className: "w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-teal-600/30 transition-all"
  }, loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : authMode === 'register' ? 'Create Account' : 'Send Reset Link')), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium"
  }, authMode === 'login' ? /*#__PURE__*/React.createElement("p", null, "Don't have an account?", ' ', /*#__PURE__*/React.createElement("button", {
    onClick: () => setAuthMode('register'),
    className: "text-teal-600 font-bold hover:underline"
  }, "Create one now")) : /*#__PURE__*/React.createElement("p", null, "Already have an account?", ' ', /*#__PURE__*/React.createElement("button", {
    onClick: () => setAuthMode('login'),
    className: "text-teal-600 font-bold hover:underline"
  }, "Sign In")))));
};

// Window AuthModal Overlay Wrapper
window.AuthModal = function AuthModal({
  mode = 'login',
  onClose,
  onAuthSuccess
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-full max-w-md"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center shadow-lg"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark text-sm"
  })), /*#__PURE__*/React.createElement(window.AuthPages, {
    mode: mode,
    onAuthSuccess: onAuthSuccess
  })));
};