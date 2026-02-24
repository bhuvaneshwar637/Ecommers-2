export const wishlistStore = {
  items: [],
  _subscribers: [],
  currentUser: null,

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      this.loadWishlist();
    } else {
      this.items = [];
      this._notify();
    }
  },

  _getWishlistKey() {
    if (this.currentUser && this.currentUser.email) {
      return `wishlist_${this.currentUser.email}`;
    }
    return 'wishlist_guest';
  },

  _notify() {
    this._subscribers.forEach(fn => {
      try { fn(this.items); } catch (e) { }
    });
  },

  subscribe(fn) {
    if (typeof fn === 'function') {
      this._subscribers.push(fn);
      return () => {
        this._subscribers = this._subscribers.filter(s => s !== fn);
      };
    }
    return () => {};
  },

  loadWishlist() {
    const key = this._getWishlistKey();
    const saved = localStorage.getItem(key);
    this.items = saved ? JSON.parse(saved) : [];
    this._notify();
    return this.items;
  },

  saveWishlist() {
    const key = this._getWishlistKey();
    localStorage.setItem(key, JSON.stringify(this.items));
    this._notify();
  },

  addItem(product) {
    const exists = this.items.find(item => item.id === product.id);
    if (!exists) {
      this.items.push({ ...product });
      this.saveWishlist();
    }
    return this.items;
  },

  removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveWishlist();
    return this.items;
  },

  isInWishlist(productId) {
    return this.items.some(item => item.id === productId);
  },

  getWishlist() {
    return this.items;
  },

  clearWishlist() {
    this.items = [];
    this.saveWishlist();
    return this.items;
  },

  getWishlistCount() {
    return this.items.length;
  }
};
