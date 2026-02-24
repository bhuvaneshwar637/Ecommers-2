export const cartStore = {
  items: [],
  _subscribers: [],
  currentUser: null,

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      this.loadCart();
    } else {
      this.items = [];
      this._notify();
    }
  },

  _getCartKey() {
    if (this.currentUser && this.currentUser.email) {
      return `cart_${this.currentUser.email}`;
    }
    return 'cart_guest';
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

  loadCart() {
    const key = this._getCartKey();
    const saved = localStorage.getItem(key);
    this.items = saved ? JSON.parse(saved) : [];
    this._notify();
    return this.items;
  },

  saveCart() {
    const key = this._getCartKey();
    localStorage.setItem(key, JSON.stringify(this.items));
    this._notify();
  },

  addItem(product) {
    // Check for existing item by both ID and selectedSize
    const existingItem = this.items.find(item => 
      item.id === product.id && item.selectedSize === product.selectedSize
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.saveCart();
    return this.items;
  },

  removeItem(productId, selectedSize = null) {
    this.items = this.items.filter(item => {
      if (item.id !== productId) return true;
      // If selectedSize is provided, only remove items with that size
      if (selectedSize !== null) {
        return item.selectedSize !== selectedSize;
      }
      // Otherwise, remove all items with this productId
      return false;
    });
    this.saveCart();
    return this.items;
  },

  updateQuantity(productId, quantity, selectedSize = null) {
    const item = this.items.find(item => {
      if (item.id !== productId) return false;
      // If selectedSize is provided, match it too
      if (selectedSize !== null) {
        return item.selectedSize === selectedSize;
      }
      return true;
    });
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId, selectedSize);
      } else {
        item.quantity = quantity;
        this.saveCart();
      }
    }
    return this.items;
  },

  getCart() {
    return this.items;
  },

  clearCart() {
    this.items = [];
    this.saveCart();
    return this.items;
  },

  getCartCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }
};
