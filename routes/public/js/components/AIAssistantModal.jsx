// Passage AI Assistant Chat Modal Component

window.AIAssistantModal = function AIAssistantModal({ isOpen = true, onClose, activeCurrency = 'INR', currencyRates = {}, onSelectProperty, onNavigate }) {
  const [messages, setMessages] = React.useState([
    {
      sender: 'ai',
      text: "Namaste! 👋 I'm your Passage Expat AI Relocation Concierge. Ask me anything about finding homes near IT parks, calculating rent quotes, FRRO visa Form C paperwork, or top tourist places in India!"
    }
  ]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const chatEndRef = React.useRef(null);

  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  if (isOpen === false) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await window.PassageAPI.aiChat(userText);
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: response.reply || "Here are recommendations based on your query.", 
          suggestedProperties: response.suggestedProperties || [] 
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: "I am ready! Ask me about homes in Chennai, Bangalore, Mumbai, Delhi, Goa, Hyderabad, Kochi, or Jaipur, or FRRO visa paperwork." 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Find budget-friendly apartments near Chennai IT parks",
    "How does FRRO Form C visa paperwork work for expats?",
    "Show sea-facing luxury homes in Mumbai under $1200",
    "Show tourist places in Goa"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border-2 border-teal-500/40 rounded-3xl w-full max-w-2xl h-[620px] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-fadeIn">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-extrabold shadow-lg shadow-teal-500/20">
              <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <span>Passage AI Relocation Assistant</span>
                <span className="bg-teal-500/20 text-teal-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-teal-500/30">Live Online</span>
              </h3>
              <p className="text-xs text-slate-400">Ask about homes, FRRO visa paperwork, & neighborhood tourist guides</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs leading-relaxed">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 space-y-3 ${
                m.sender === 'user' 
                  ? 'bg-teal-600 text-white rounded-br-none shadow-md font-semibold' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-md'
              }`}>
                <p className="whitespace-pre-line text-xs font-medium leading-relaxed">{m.text}</p>

                {/* Suggested Property Cards */}
                {m.suggestedProperties && m.suggestedProperties.length > 0 && (
                  <div className="pt-2 border-t border-slate-700/60 space-y-2">
                    <p className="font-bold text-teal-300 text-[11px]">Recommended Matches:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {m.suggestedProperties.map(p => (
                        <div 
                          key={p._id}
                          onClick={() => {
                            if (typeof onClose === 'function') onClose();
                            if (typeof onSelectProperty === 'function') onSelectProperty(p._id, p);
                          }}
                          className="bg-slate-900/90 p-2 rounded-xl border border-slate-700 hover:border-teal-400 cursor-pointer transition-all flex items-center space-x-2 group"
                        >
                          <img src={p.coverImage} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="overflow-hidden">
                            <h4 className="font-bold text-[11px] text-white truncate group-hover:text-teal-300">{p.title}</h4>
                            <p className="text-[10px] text-slate-400">{p.neighborhood}, {p.city}</p>
                            <span className="text-[10px] font-extrabold text-teal-400">
                              {window.PassageAPI.formatCurrency(p.pricePerMonth, activeCurrency, currencyRates)}/mo
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl px-4 py-3 text-xs flex items-center space-x-2">
                <i className="fa-solid fa-circle-notch fa-spin text-teal-400"></i>
                <span>Analyzing Passage database & FRRO rules...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar text-[11px]">
          <span className="text-slate-400 font-bold whitespace-nowrap">Try asking:</span>
          {samplePrompts.map((p, idx) => (
            <button 
              key={idx}
              onClick={() => {
                setInputMessage(p);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 whitespace-nowrap transition-colors font-semibold"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-3">
          <input 
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your question (e.g. 'Find budget homes in Bangalore')..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <button 
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-teal-600/30 text-xs transition-all flex items-center space-x-1.5"
          >
            <span>Ask AI</span>
            <i className="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </form>

      </div>
    </div>
  );
};
