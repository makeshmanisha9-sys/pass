// Passage Property Search & Filter Module
const Search = {
  properties: [],
  wishlistIds: [],
  filters: {
    city: 'All',
    search: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'All',
    leaseTerm: '',
    sort: 'newest',
    amenities: []
  },
  async init() {
    this.bindEvents();
    if (App.user && App.user.role === 'tenant') {
      await this.fetchWishlist();
    }
    await this.fetchProperties();
  },
  bindEvents() {
    const citySelect = document.getElementById('filterCity');
    const searchInput = document.getElementById('filterSearch');
    const priceRange = document.getElementById('filterPrice');
    const bedSelect = document.getElementById('filterBedrooms');
    const sortSelect = document.getElementById('filterSort');
    if (citySelect) {
      citySelect.addEventListener('change', e => {
        this.filters.city = e.target.value;
        this.fetchProperties();
      });
    }
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', e => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.filters.search = e.target.value;
          this.fetchProperties();
        }, 300);
      });
    }
    if (priceRange) {
      priceRange.addEventListener('input', e => {
        this.filters.maxPrice = e.target.value;
        document.getElementById('priceDisplay').textContent = `Under ${App.formatPrice(e.target.value)}`;
        this.fetchProperties();
      });
    }
    if (bedSelect) {
      bedSelect.addEventListener('change', e => {
        this.filters.bedrooms = e.target.value;
        this.fetchProperties();
      });
    }
    if (sortSelect) {
      sortSelect.addEventListener('change', e => {
        this.filters.sort = e.target.value;
        this.fetchProperties();
      });
    }

    // Amenity chips toggle
    document.querySelectorAll('.amenity-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        const value = chip.dataset.amenity;
        if (chip.classList.contains('active')) {
          this.filters.amenities.push(value);
        } else {
          this.filters.amenities = this.filters.amenities.filter(a => a !== value);
        }
        this.fetchProperties();
      });
    });
  },
  async fetchWishlist() {
    try {
      const items = await App.apiRequest('/wishlist');
      this.wishlistIds = items.map(i => i._id || i);
    } catch (e) {
      this.wishlistIds = [];
    }
  },
  async fetchProperties() {
    try {
      const params = new URLSearchParams();
      if (this.filters.city && this.filters.city !== 'All') params.append('city', this.filters.city);
      if (this.filters.search) params.append('search', this.filters.search);
      if (this.filters.maxPrice) params.append('maxPrice', this.filters.maxPrice);
      if (this.filters.bedrooms && this.filters.bedrooms !== 'All') params.append('bedrooms', this.filters.bedrooms);
      if (this.filters.sort) params.append('sort', this.filters.sort);
      this.filters.amenities.forEach(a => params.append('amenity', a));
      this.properties = await App.apiRequest(`/properties?${params.toString()}`);
      this.renderListings();
    } catch (err) {
      console.error('Error fetching properties:', err);
    }
  },
  renderListings() {
    const grid = document.getElementById('listingsGrid');
    const countBadge = document.getElementById('listingsCount');
    if (!grid) return;
    if (countBadge) {
      countBadge.textContent = `${this.properties.length} Verified Homes Found`;
    }
    if (this.properties.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <p style="font-family: var(--font-display); font-size: 1.2rem; color: var(--text-muted);">
            No verified homes match your current filters.
          </p>
          <button class="btn btn-primary" style="margin-top:16px;" onclick="Search.resetFilters()">
            Reset Filters
          </button>
        </div>
      `;
      return;
    }
    grid.innerHTML = this.properties.map(p => {
      const isSaved = this.wishlistIds.includes(p._id);
      return `
        <article class="property-card" onclick="PropertyDetail.open('${p._id}')">
          <div class="card-img-wrap">
            <img src="${p.coverImage}" alt="${p.title}" loading="lazy" />
            <span class="badge-city">${p.city.toUpperCase()}</span>
            <button class="wishlist-btn ${isSaved ? 'active' : ''}" 
                    onclick="event.stopPropagation(); Search.toggleWishlist('${p._id}')" 
                    title="Save to Wishlist">
              ♥
            </button>
          </div>
          <div class="card-body">
            <h3 class="card-title">${p.title}</h3>
            <div class="card-location">📍 ${p.neighborhood}, ${p.city}</div>
            <div class="card-specs">
              <span>🛏 ${p.bedrooms} Bed</span> • 
              <span>🚿 ${p.bathrooms} Bath</span> • 
              <span>🛡 FRRO Ready</span>
            </div>
            <div class="card-price-row">
              <div class="card-price">
                ${App.formatPrice(p.pricePerMonth)}<span>/mo</span>
              </div>
              <span class="btn btn-ghost btn-sm">View Home →</span>
            </div>
          </div>
        </article>
      `;
    }).join('');
  },
  async toggleWishlist(propertyId) {
    if (!App.user) {
      App.showToast('Please sign in to save homes to your wishlist', 'info');
      App.openModal('authModal');
      return;
    }
    try {
      const res = await App.apiRequest(`/wishlist/toggle/${propertyId}`, 'POST');
      this.wishlistIds = res.wishlist.map(i => i._id || i);
      App.showToast(res.added ? 'Saved to Wishlist ♥' : 'Removed from Wishlist', 'info');
      this.renderListings();
    } catch (err) {
      App.showToast(err.message, 'error');
    }
  },
  resetFilters() {
    this.filters = {
      city: 'All',
      search: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: 'All',
      leaseTerm: '',
      sort: 'newest',
      amenities: []
    };
    document.querySelectorAll('.amenity-chip').forEach(c => c.classList.remove('active'));
    const citySel = document.getElementById('filterCity');
    if (citySel) citySel.value = 'All';
    this.fetchProperties();
  }
};