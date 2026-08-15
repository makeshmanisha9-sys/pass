// Passage Expat AI Concierge Chatbot Module
const AiChatbot = {
  isOpen: false,
  init() {
    this.bindEvents();
  },
  bindEvents() {
    const trigger = document.getElementById('aiChatTrigger');
    const drawer = document.getElementById('aiChatDrawer');
    const closeBtn = document.getElementById('aiChatClose');
    const form = document.getElementById('aiChatForm');
    if (trigger && drawer) {
      trigger.addEventListener('click', () => this.toggle());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.toggle(false));
    }
    if (form) {
      form.addEventListener('submit', e => this.handleSubmit(e));
    }
    document.querySelectorAll('.chat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.dataset.text;
        document.getElementById('aiChatInput').value = text;
        this.sendMessage(text);
      });
    });
  },
  toggle(forceState) {
    const drawer = document.getElementById('aiChatDrawer');
    if (!drawer) return;
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    if (this.isOpen) {
      drawer.classList.add('open');
    } else {
      drawer.classList.remove('open');
    }
  },
  async handleSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('aiChatInput');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    await this.sendMessage(msg);
  },
  async sendMessage(msgText) {
    this.appendMessage(msgText, 'user');
    const msgContainer = document.getElementById('aiChatMessages');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-msg ai';
    typingIndicator.innerHTML = '<em>Passage AI is typing...</em>';
    msgContainer.appendChild(typingIndicator);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    try {
      const res = await App.apiRequest('/ai/chat', 'POST', {
        message: msgText
      });
      typingIndicator.remove();
      this.appendMessage(res.reply, 'ai');
      if (res.suggestedProperties && res.suggestedProperties.length > 0) {
        const propsHtml = `
          <div style="margin-top:8px; display:flex; flex-direction:column; gap:8px;">
            <b style="font-size:12px; color:var(--accent-gold);">Recommended Verified Homes:</b>
            ${res.suggestedProperties.map(p => `
              <div onclick="PropertyDetail.open('${p._id}')" 
                   style="background:var(--bg-primary); border:1px solid var(--border-glass); border-radius:10px; padding:8px; display:flex; gap:10px; cursor:pointer;">
                <img src="${p.coverImage}" style="width:50px; height:40px; object-fit:cover; border-radius:6px;" />
                <div style="font-size:11.5px;">
                  <b>${p.title}</b>
                  <div style="color:var(--text-muted);">${p.neighborhood}, ${p.city} • ${App.formatPrice(p.pricePerMonth)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        this.appendRawHtml(propsHtml, 'ai');
      }
    } catch (err) {
      typingIndicator.remove();
      this.appendMessage("I'm having trouble connecting right now. Please try again or submit an inquiry!", 'ai');
    }
  },
  appendMessage(text, sender) {
    const msgContainer = document.getElementById('aiChatMessages');
    if (!msgContainer) return;
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    div.textContent = text;
    msgContainer.appendChild(div);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  },
  appendRawHtml(htmlContent, sender) {
    const msgContainer = document.getElementById('aiChatMessages');
    if (!msgContainer) return;
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    div.innerHTML = htmlContent;
    msgContainer.appendChild(div);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }
};
document.addEventListener('DOMContentLoaded', () => {
  AiChatbot.init();
});