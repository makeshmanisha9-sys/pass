// Passage Footer Component

window.Footer = function Footer({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-5 gap-8 mb-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 space-y-4 pr-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-extrabold text-lg"
  }, "P"), /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-extrabold text-white tracking-tight"
  }, "Passage", /*#__PURE__*/React.createElement("span", {
    className: "text-teal-400"
  }, "."))), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-400 text-xs leading-relaxed max-w-sm"
  }, "Passage is India's premier verified home rental platform built for foreign expats, digital nomads, and international relocation. Verified landlords, FRRO visa paperwork assistance, multi-currency escrow guarantee, and 24/7 relocation support."), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3 text-slate-400 text-sm pt-2"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-teal-400 hover:bg-slate-800 transition-colors"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-twitter"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-teal-400 hover:bg-slate-800 transition-colors"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-linkedin-in"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-teal-400 hover:bg-slate-800 transition-colors"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-instagram"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:text-teal-400 hover:bg-slate-800 transition-colors"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-200 text-sm uppercase tracking-wider"
  }, "Top Cities"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search', {
      city: 'Chennai'
    }),
    className: "hover:text-teal-400 transition-colors"
  }, "Chennai Expat Homes")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search', {
      city: 'Bangalore'
    }),
    className: "hover:text-teal-400 transition-colors"
  }, "Bangalore Tech Hub")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search', {
      city: 'Mumbai'
    }),
    className: "hover:text-teal-400 transition-colors"
  }, "Mumbai Sea Front")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search', {
      city: 'Delhi'
    }),
    className: "hover:text-teal-400 transition-colors"
  }, "Delhi Diplomatic Enclave")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search', {
      city: 'Goa'
    }),
    className: "hover:text-teal-400 transition-colors"
  }, "Goa Beach Villas")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('search', {
      city: 'Kochi'
    }),
    className: "hover:text-teal-400 transition-colors"
  }, "Kochi Heritage Residences")))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-200 text-sm uppercase tracking-wider"
  }, "Foreigner Services"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('about'),
    className: "hover:text-teal-400 transition-colors"
  }, "FRRO Registration Form C")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('faq'),
    className: "hover:text-teal-400 transition-colors"
  }, "Visa Lease Agreements")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('faq'),
    className: "hover:text-teal-400 transition-colors"
  }, "Multi-Currency Escrow")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('contact'),
    className: "hover:text-teal-400 transition-colors"
  }, "24/7 Expat Concierge")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('owner-dashboard'),
    className: "hover:text-teal-400 transition-colors"
  }, "List Your Property")))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-slate-200 text-sm uppercase tracking-wider"
  }, "Company & Legal"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('about'),
    className: "hover:text-teal-400 transition-colors"
  }, "About Passage")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('contact'),
    className: "hover:text-teal-400 transition-colors"
  }, "Contact Support")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('terms'),
    className: "hover:text-teal-400 transition-colors"
  }, "Terms of Service")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('privacy'),
    className: "hover:text-teal-400 transition-colors"
  }, "Privacy Policy")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('faq'),
    className: "hover:text-teal-400 transition-colors"
  }, "Cancellation & Refunds"))))), /*#__PURE__*/React.createElement("div", {
    className: "pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500"
  }, /*#__PURE__*/React.createElement("p", null, "\xA9 ", new Date().getFullYear(), " Passage Expat Living Technologies Pvt Ltd. All rights reserved."), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-1 text-slate-400"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-[#0D9488] fa-shield-halved text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "Escrow Security Guaranteed")), /*#__PURE__*/React.createElement("span", null, "\u2022"), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center space-x-1 text-slate-400"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-passport text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "FRRO Compliant Paperwork"))))));
};