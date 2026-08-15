// Passage Footer Component

window.Footer = function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4 pr-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-extrabold text-lg">
                P
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Passage<span className="text-teal-400">.</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Passage is India's premier verified home rental platform built for foreign expats, digital nomads, and international relocation. Verified landlords, FRRO visa paperwork assistance, multi-currency escrow guarantee, and 24/7 relocation support.
            </p>
            <div className="flex items-center space-x-3 text-slate-400 text-sm pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-teal-400 hover:bg-slate-800 transition-colors"><i className="fa-brands fa-twitter"></i></a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-teal-400 hover:bg-slate-800 transition-colors"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-teal-400 hover:bg-slate-800 transition-colors"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-teal-400 hover:bg-slate-800 transition-colors"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>

          {/* Dest Highlights */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Top Cities</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('search', { city: 'Chennai' })} className="hover:text-teal-400 transition-colors">Chennai Expat Homes</button></li>
              <li><button onClick={() => onNavigate('search', { city: 'Bangalore' })} className="hover:text-teal-400 transition-colors">Bangalore Tech Hub</button></li>
              <li><button onClick={() => onNavigate('search', { city: 'Mumbai' })} className="hover:text-teal-400 transition-colors">Mumbai Sea Front</button></li>
              <li><button onClick={() => onNavigate('search', { city: 'Delhi' })} className="hover:text-teal-400 transition-colors">Delhi Diplomatic Enclave</button></li>
              <li><button onClick={() => onNavigate('search', { city: 'Goa' })} className="hover:text-teal-400 transition-colors">Goa Beach Villas</button></li>
              <li><button onClick={() => onNavigate('search', { city: 'Kochi' })} className="hover:text-teal-400 transition-colors">Kochi Heritage Residences</button></li>
            </ul>
          </div>

          {/* Expat Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Foreigner Services</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('about')} className="hover:text-teal-400 transition-colors">FRRO Registration Form C</button></li>
              <li><button onClick={() => onNavigate('faq')} className="hover:text-teal-400 transition-colors">Visa Lease Agreements</button></li>
              <li><button onClick={() => onNavigate('faq')} className="hover:text-teal-400 transition-colors">Multi-Currency Escrow</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-teal-400 transition-colors">24/7 Expat Concierge</button></li>
              <li><button onClick={() => onNavigate('owner-dashboard')} className="hover:text-teal-400 transition-colors">List Your Property</button></li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Company & Legal</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('about')} className="hover:text-teal-400 transition-colors">About Passage</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-teal-400 transition-colors">Contact Support</button></li>
              <li><button onClick={() => onNavigate('terms')} className="hover:text-teal-400 transition-colors">Terms of Service</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-teal-400 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('faq')} className="hover:text-teal-400 transition-colors">Cancellation & Refunds</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Passage Expat Living Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-slate-400">
              <i className="fa-solid fa-[#0D9488] fa-shield-halved text-teal-400"></i>
              <span>Escrow Security Guaranteed</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-slate-400">
              <i className="fa-solid fa-passport text-teal-400"></i>
              <span>FRRO Compliant Paperwork</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
