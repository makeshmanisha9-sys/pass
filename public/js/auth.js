// Passage Auth Module
const Auth = {
  async init() {
    this.bindEvents();
    if (App.token) {
      await this.fetchCurrentUser();
    } else {
      this.renderNavState();
    }
  },

  bindEvents() {
    const loginBtn = document.getElementById('loginNavBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => App.openModal('authModal'));
    }

    const authForm = document.getElementById('authForm');
    if (authForm) {
      authForm.addEventListener('submit', (e) => this.handleAuthSubmit(e));
    }

    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const roleGroup = document.getElementById('roleGroup');
    const nameGroup = document.getElementById('nameGroup');
    const nationalityGroup = document.getElementById('nationalityGroup');

    if (tabLogin && tabRegister) {
      tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        roleGroup.style.display = 'none';
        nameGroup.style.display = 'none';
        nationalityGroup.style.display = 'none';
        document.getElementById('authSubmitBtn').textContent = 'Sign In →';
        document.getElementById('authMode').value = 'login';
      });

      tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        roleGroup.style.display = 'flex';
        nameGroup.style.display = 'flex';
        nationalityGroup.style.display = 'flex';
        document.getElementById('authSubmitBtn').textContent = 'Create Account →';
        document.getElementById('authMode').value = 'register';
      });
    }
  },

  async fetchCurrentUser() {
    try {
      App.user = await App.apiRequest('/auth/me');
      this.renderNavState();
    } catch (e) {
      console.warn('Failed to fetch user me:', e.message);
      this.logout();
    }
  },

  async handleAuthSubmit(e) {
    e.preventDefault();
    const mode = document.getElementById('authMode').value;
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    try {
      let data;
      if (mode === 'login') {
        data = await App.apiRequest('/auth/login', 'POST', { email, password });
      } else {
        const name = document.getElementById('authName').value;
        const role = document.getElementById('authRole').value;
        const nationality = document.getElementById('authNationality').value;
        data = await App.apiRequest('/auth/register', 'POST', { name, email, password, role, nationality });
      }

      App.token = data.token;
      App.user = data;
      localStorage.setItem('passage_token', data.token);

      App.closeModal('authModal');
      App.showToast(`Welcome back, ${data.name}!`, 'success');
      this.renderNavState();
      Search.fetchWishlist();
      
      // Auto open dashboard if applicable
      if (data.role === 'admin' || data.role === 'owner') {
        Dashboards.openDashboard();
      }
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },

  renderNavState() {
    const navActions = document.getElementById('navActions');
    if (!navActions) return;

    if (App.user) {
      navActions.innerHTML = `
        <button class="currency-selector" onclick="Dashboards.openDashboard()">
          👤 ${App.user.name} <span class="status-badge status-confirmed" style="margin-left:4px">${App.user.role.toUpperCase()}</span>
        </button>
        <button class="btn btn-primary btn-sm" onclick="Dashboards.openDashboard()">
          Dashboard
        </button>
        <button class="btn btn-ghost btn-sm" onclick="Auth.logout()">
          Sign Out
        </button>
      `;
    } else {
      navActions.innerHTML = `
        <select class="currency-selector" id="currencySelector">
          <option value="INR">₹ INR</option>
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
          <option value="GBP">£ GBP</option>
          <option value="JPY">¥ JPY</option>
          <option value="AUD">A$ AUD</option>
          <option value="CAD">C$ CAD</option>
        </select>
        <button class="btn btn-ghost btn-sm" id="loginNavBtn" onclick="App.openModal('authModal')">
          Sign In
        </button>
        <button class="btn btn-primary btn-sm" onclick="App.openModal('authModal'); document.getElementById('tabRegister').click();">
          Get Started
        </button>
      `;
      App.setupNavigation();
    }
  },

  logout() {
    App.token = null;
    App.user = null;
    localStorage.removeItem('passage_token');
    this.renderNavState();
    App.showToast('Logged out successfully');
  }
};
