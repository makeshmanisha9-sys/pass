// Passage Static Pages (About, Contact, FAQ, Terms, Privacy)

window.AboutPage = function AboutPage({
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-4xl mx-auto px-4 py-12 space-y-8 text-slate-800 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 text-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-50 text-teal-700 font-extrabold text-[11px] uppercase px-3 py-1 rounded-full border border-teal-200"
  }, "About Passage"), /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-extrabold text-slate-900"
  }, "Making India Accessible to Expat Homes"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 max-w-xl mx-auto leading-relaxed"
  }, "Passage was founded to simplify home discovery, lease contracts, and Section 14 FRRO visa paperwork for foreign nationals relocating to India.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-passport"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-sm text-slate-900"
  }, "FRRO Paperwork"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 leading-relaxed"
  }, "Landlord-tenant lease agreements tailored for Indian online Form C registration.")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-vault"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-sm text-slate-900"
  }, "Escrow Guarantee"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 leading-relaxed"
  }, "Security deposits held in multi-currency escrow accounts with fair 2-month limits.")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-video"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-sm text-slate-900"
  }, "4K Live Tours"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500 leading-relaxed"
  }, "Inspect water pressure, WiFi speeds, and neighborhood noise prior to flying in."))));
};
window.ContactPage = function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-2xl mx-auto px-4 py-12 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center space-y-2"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "Get in Touch with Expat Support"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500"
  }, "24/7 Concierge for Foreign Tenants & Landlords in India")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-xs space-y-4"
  }, submitted ? /*#__PURE__*/React.createElement("div", {
    className: "p-6 bg-teal-50 text-teal-800 text-center rounded-2xl space-y-2 font-bold"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check text-2xl text-teal-600 block"
  }), /*#__PURE__*/React.createElement("span", null, "Message Received! An expat concierge will reach out within 2 hours.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSubmitted(true);
    },
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Your Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    placeholder: "Lena Hoffman",
    className: "w-full bg-slate-50 border rounded-xl p-3"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Email"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    required: true,
    placeholder: "lena@passage.com",
    className: "w-full bg-slate-50 border rounded-xl p-3"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-slate-700 mb-1"
  }, "Subject / Query"), /*#__PURE__*/React.createElement("textarea", {
    rows: "4",
    required: true,
    placeholder: "FRRO Form C question or property inquiry...",
    className: "w-full bg-slate-50 border rounded-xl p-3"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full bg-teal-600 text-white font-extrabold py-3.5 rounded-xl shadow-md"
  }, "Send Message to Support"))));
};
window.FAQPage = function FAQPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-3xl mx-auto px-4 py-12 space-y-6 text-xs text-slate-800"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center space-y-2"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "Frequently Asked Questions"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-500"
  }, "Everything foreigners need to know about renting homes in India")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-2xl border border-slate-200 space-y-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-slate-900 text-sm"
  }, "Can foreign nationals legally lease property in India?"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-600 leading-relaxed"
  }, "Yes! Foreign nationals holding valid Employment, Business, Tourist, or Student visas can legally lease residential properties in India for short or long durations.")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-2xl border border-slate-200 space-y-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-slate-900 text-sm"
  }, "What is FRRO Form C and why is it required?"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-600 leading-relaxed"
  }, "Under Section 14 of the Foreigners Act, property owners hosting foreign nationals must report their stay to the Bureau of Immigration via Form C within 14 days of arrival. Passage handles this automatically.")), /*#__PURE__*/React.createElement("div", {
    className: "bg-white p-6 rounded-2xl border border-slate-200 space-y-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-extrabold text-slate-900 text-sm"
  }, "How does security deposit escrow protection work?"), /*#__PURE__*/React.createElement("p", {
    className: "text-slate-600 leading-relaxed"
  }, "Instead of standard local demands of 10 months rent up-front, Passage caps deposits at 2 months and holds funds in multi-currency escrow until lease start."))));
};
window.TermsPage = function TermsPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-3xl mx-auto px-4 py-12 space-y-4 text-xs text-slate-700 leading-relaxed"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "Terms & Conditions"), /*#__PURE__*/React.createElement("p", null, "Last updated: August 2026. Passage operates in compliance with Indian Tenancy Laws and Bureau of Immigration guidelines."), /*#__PURE__*/React.createElement("p", null, "1. ", /*#__PURE__*/React.createElement("strong", null, "Verification"), ": All property owners must provide proof of title or leasing authorization."), /*#__PURE__*/React.createElement("p", null, "2. ", /*#__PURE__*/React.createElement("strong", null, "Security Escrow"), ": Tenant security deposits are protected under Passage Escrow services until tenancy conclusion."));
};
window.PrivacyPage = function PrivacyPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-3xl mx-auto px-4 py-12 space-y-4 text-xs text-slate-700 leading-relaxed"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-extrabold text-slate-900"
  }, "Privacy Policy"), /*#__PURE__*/React.createElement("p", null, "Passage protects expat personal information and passport documents using AES-256 encryption. Documents are strictly used for FRRO Form C reporting and landlord identity verification."));
};