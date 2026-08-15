// Passage Auth Pages & Modal Components (Login / Register / Forgot Password)

window.AuthPages = function AuthPages({ mode = 'login', onAuthSuccess, onSuccess, onNavigate }) {
  const [authMode, setAuthMode] = React.useState(mode);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('tenant');
  const [nationality, setNationality] = React.useState('Germany');
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const callback = onAuthSuccess || onSuccess || (() => {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMode === 'login') {
        const res = await window.PassageAPI.login(email, password);
        callback(res.user || res);
      } else if (authMode === 'register') {
        const res = await window.PassageAPI.register({
          name,
          email,
          password,
          role,
          nationality,
          phone
        });
        callback(res.user || res);
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

  return (
    <div className="min-h-[500px] flex items-center justify-center py-6 px-4">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-extrabold text-xl mx-auto shadow-lg shadow-teal-500/20">
            P
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {authMode === 'login' && 'Sign In to Passage'}
            {authMode === 'register' && 'Create Your Passage Account'}
            {authMode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-slate-500">
            {authMode === 'login' && 'Access your expat stays, FRRO forms & wishlist'}
            {authMode === 'register' && 'Join thousands of foreigners & verified hosts across India'}
            {authMode === 'forgot' && 'Enter your registered email address'}
          </p>
        </div>

        {/* Quick Demo Credentials Switcher */}
        {authMode === 'login' && (
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-[11px]">
            <span className="font-extrabold text-slate-700 block uppercase tracking-wider text-[10px]">1-Click Demo Credentials:</span>
            <div className="grid grid-cols-3 gap-1.5 font-bold">
              <button 
                type="button" 
                onClick={() => fillDemo('tenant@passage.com', 'tenant123')}
                className="bg-white hover:bg-teal-50 p-1.5 rounded-xl border border-slate-200 text-teal-700 truncate"
              >
                🇩🇪 Expat
              </button>
              <button 
                type="button" 
                onClick={() => fillDemo('owner@passage.com', 'owner123')}
                className="bg-white hover:bg-teal-50 p-1.5 rounded-xl border border-slate-200 text-teal-700 truncate"
              >
                🏡 Host
              </button>
              <button 
                type="button" 
                onClick={() => fillDemo('admin@passage.com', 'admin123')}
                className="bg-white hover:bg-teal-50 p-1.5 rounded-xl border border-slate-200 text-teal-700 truncate"
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {authMode === 'register' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Michael Weber"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. tenant@passage.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">Password</label>
              {authMode === 'login' && (
                <button 
                  type="button" 
                  onClick={() => setAuthMode('forgot')}
                  className="text-[11px] font-bold text-teal-600 hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium focus:outline-none focus:border-teal-500"
            />
          </div>

          {authMode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">I am a...</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none"
                  >
                    <option value="tenant">Foreign Expat Tenant</option>
                    <option value="owner">Landlord Host</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nationality</label>
                  <input 
                    type="text" 
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="Germany"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number (WhatsApp Direct)</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 151 23456789"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                />
              </div>
            </>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-teal-600/30 transition-all"
          >
            {loading ? 'Processing...' : (
              authMode === 'login' ? 'Sign In' : (authMode === 'register' ? 'Create Account' : 'Send Reset Link')
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          {authMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setAuthMode('register')} className="text-teal-600 font-bold hover:underline">
                Create one now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setAuthMode('login')} className="text-teal-600 font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

// Window AuthModal Overlay Wrapper
window.AuthModal = function AuthModal({ mode = 'login', onClose, onAuthSuccess, onSuccess }) {
  const handleSuccess = onAuthSuccess || onSuccess || (() => {});

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center shadow-lg"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>

        <window.AuthPages mode={mode} onAuthSuccess={handleSuccess} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};
