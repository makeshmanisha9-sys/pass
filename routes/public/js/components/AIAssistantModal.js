// Passage AI Assistant Chat Modal Component

window.AIAssistantModal = function AIAssistantModal({
  isOpen,
  onClose,
  activeCurrency,
  currencyRates,
  onSelectProperty
}) {
  const [messages, setMessages] = React.useState([{
    sender: 'ai',
    text: "Namaste! 👋 I'm your Passage Expat AI Relocation Concierge. Ask me anything about finding homes near IT parks, calculating rent quotes, FRRO visa Form C paperwork, or 4K live video walkthroughs!"
  }]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const chatEndRef = React.useRef(null);
  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);
  if (!isOpen) return null;
  const handleSend = async e => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;
    const userText = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, {
      sender: 'user',
      text: userText
    }]);
    setLoading(true);
    try {
      const response = await window.PassageAPI.aiChat(userText);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: response.reply,
        suggestedProperties: response.suggestedProperties || []
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "I encountered a brief connection issue. However, you can search our 50+ verified homes across Chennai, Bangalore, Mumbai, Delhi, Hyderabad, Goa, Kochi, and Jaipur directly!"
      }]);
    } finally {
      setLoading(false);
    }
  };
  const samplePrompts = ["Find budget-friendly apartments near Chennai IT parks", "How does FRRO Form C visa paperwork work for expats?", "Show sea-facing luxury homes in Mumbai under $1200", "Explain Passage Escrow deposit protection"];
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl h-[620px] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-fadeIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-extrabold shadow-lg shadow-teal-500/20"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-wand-magic-sparkles text-lg"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-extrabold text-white flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("span", null, "Passage AI Relocation Assistant"), /*#__PURE__*/React.createElement("span", {
    className: "bg-teal-500/20 text-teal-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-teal-500/30"
  }, "Gemini Powered")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400"
  }, "Ask about homes, FRRO visa paperwork, & neighborhood guides"))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark text-sm"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 overflow-y-auto p-6 space-y-4 text-xs leading-relaxed"
  }, messages.map((m, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: `flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `max-w-[85%] rounded-2xl p-4 space-y-3 ${m.sender === 'user' ? 'bg-teal-600 text-white rounded-br-none shadow-md' : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-md'}`
  }, /*#__PURE__*/React.createElement("p", {
    className: "whitespace-pre-line text-xs font-medium leading-relaxed"
  }, m.text), m.suggestedProperties && m.suggestedProperties.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "pt-2 border-t border-slate-700/60 space-y-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-teal-300 text-[11px]"
  }, "Recommended Matches:"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-2"
  }, m.suggestedProperties.map(p => /*#__PURE__*/React.createElement("div", {
    key: p._id,
    onClick: () => {
      onClose();
      onSelectProperty(p._id);
    },
    className: "bg-slate-900/90 p-2 rounded-xl border border-slate-700 hover:border-teal-400 cursor-pointer transition-all flex items-center space-x-2 group"
  }, /*#__PURE__*/React.createElement("img", {
    src: p.coverImage,
    alt: p.title,
    className: "w-12 h-12 rounded-lg object-cover"
  }), /*#__PURE__*/React.createElement("div", {
    className: "overflow-hidden"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-[11px] text-white truncate group-hover:text-teal-300"
  }, p.title), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-400"
  }, p.neighborhood, ", ", p.city), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold text-teal-400"
  }, window.PassageAPI.formatCurrency(p.pricePerMonth, activeCurrency, currencyRates), "/mo"))))))))), loading && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-slate-800 border border-slate-700 text-slate-400 rounded-2xl px-4 py-3 text-xs flex items-center space-x-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-notch fa-spin text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "Analyzing Passage database & FRRO rules..."))), /*#__PURE__*/React.createElement("div", {
    ref: chatEndRef
  })), /*#__PURE__*/React.createElement("div", {
    className: "px-6 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto no-scrollbar text-[11px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 font-bold whitespace-nowrap"
  }, "Try asking:"), samplePrompts.map((p, idx) => /*#__PURE__*/React.createElement("button", {
    key: idx,
    onClick: () => {
      setInputMessage(p);
    },
    className: "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded-full border border-slate-700 whitespace-nowrap transition-colors"
  }, p))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSend,
    className: "p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: inputMessage,
    onChange: e => setInputMessage(e.target.value),
    placeholder: "Type your question (e.g. 'Find budget homes in Bangalore')...",
    className: "flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: !inputMessage.trim() || loading,
    className: "bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-teal-600/30 text-xs transition-all flex items-center space-x-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "Ask"), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paper-plane text-xs"
  })))));
};