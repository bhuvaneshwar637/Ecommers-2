<script>
import { cartStore } from '../store/cartStore.js';
import { wishlistStore } from '../store/wishlistStore.js';

export default {
  name: 'ProductCard',
  inject: {
    showToast: {
      default: () => () => {}
    }
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isFavorite: false,
      discount: 30,
      cartQty: 0,
      selectedSize: null,
      showSizeModal: false,
      availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    };
  },
  mounted() {
    cartStore.loadCart();
    this._unsub = cartStore.subscribe(() => {
      const item = cartStore.items.find(i => i.id === this.product.id);
      this.cartQty = item ? item.quantity : 0;
    });
    const item = cartStore.items.find(i => i.id === this.product.id);
    this.cartQty = item ? item.quantity : 0;

    wishlistStore.loadWishlist();
    this._wishlistUnsub = wishlistStore.subscribe(() => {
      this.isFavorite = wishlistStore.isInWishlist(this.product.id);
    });
    this.isFavorite = wishlistStore.isInWishlist(this.product.id);
  },
  beforeUnmount() {
    if (this._unsub) this._unsub();
    if (this._wishlistUnsub) this._wishlistUnsub();
  },
  computed: {
    originalPrice() {
      return (this.product.price / (1 - this.discount / 100)).toFixed(2);
    },
    salePrice() {
      return this.product.price;
    },
    productImage() {
      if (this.product.image) return this.product.image;
      if (this.product.thumbnail) return this.product.thumbnail;
      if (this.product.images && this.product.images.length) return this.product.images[0];
      return 'https://via.placeholder.com/300x200?text=No+Image';
    },
    requiresSize() {
      const category = (this.product.category || '').toLowerCase();
      // Size required for clothing and shoes
      const sizeCategories = ['clothing', 'apparel', 'cloth', 'shoe', 'shoes', 'mens-shoes', 'womens-shoes', 'mens-clothes', 'womens-clothes', 'dress', 'shirt', 'pants', 'jacket', 'coat', 'sweater'];
      return sizeCategories.some(cat => category.includes(cat));
    }
  },
  methods: {
    toggleFavorite() {
      if (this.isFavorite) {
        wishlistStore.removeItem(this.product.id);
        this.isFavorite = false;
        if (this.showToast && typeof this.showToast === 'function') {
          this.showToast('Removed from wishlist', 'success', 2000);
        }
      } else {
        wishlistStore.addItem(this.product);
        this.isFavorite = true;
        if (this.showToast && typeof this.showToast === 'function') {
          this.showToast('Added to wishlist', 'success', 2000);
        }
      }
    },
    viewProduct() {
      this.$emit('view-product', this.product);
    },
    goToProductDetails() {
      this.$router.push({
        name: 'ProductDetails',
        params: {
          id: this.product.id
        }
      });
    },
    addToCart() {
      // Show size modal only if product requires size
      if (this.requiresSize) {
        this.showSizeModal = true;
      } else {
        // Directly add to cart without size for electronics, food, etc.
        const cartItem = {
          ...this.product,
          selectedSize: null
        };
        cartStore.addItem(cartItem);
        const item = cartStore.items.find(i => i.id === this.product.id);
        this.cartQty = item ? item.quantity : 0;
        if (this.showToast && typeof this.showToast === 'function') {
          this.showToast('Added to cart', 'success', 2000);
        }
      }
    },
    confirmAddToCart() {
      if (this.requiresSize && !this.selectedSize) {
        if (this.showToast && typeof this.showToast === 'function') {
          this.showToast('Select size', 'error', 2000);
        }
        return;
      }
      const cartItem = {
        ...this.product,
        selectedSize: this.selectedSize || null
      };
      cartStore.addItem(cartItem);
      const item = cartStore.items.find(i => i.id === this.product.id && i.selectedSize === this.selectedSize);
      this.cartQty = item ? item.quantity : 0;
      if (this.showToast && typeof this.showToast === 'function') {
        const message = this.selectedSize ? `Added to cart (Size: ${this.selectedSize})` : 'Added to cart';
        this.showToast(message, 'success', 2000);
      }
      this.showSizeModal = false;
      this.selectedSize = null;
    },
    closeSizeModal() {
      this.showSizeModal = false;
      this.selectedSize = null;
    }
  }
};
</script>

<template>
  <div class="product-card">
    <div class="badge-label">NEW ARRIVAL</div>

    <!-- Discount Badge -->
    <div class="discount-badge">{{ discount }}% off</div>

    <button type="button" class="wishlist-btn" :class="{ active: isFavorite }" @click="toggleFavorite">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>

    <button type="button" class="view-btn" @click="goToProductDetails" title="View Details">
      <i class="fa-solid fa-eye"></i>
    </button>

    <div class="image-container">
      <img :src="productImage" :alt="product.title" class="product-image" />
    </div>

    <div class="product-details">
      <h3 class="product-title">{{ product.title.substring(0, 30) }}...</h3>

      <div class="price-section">
        <span class="current-price">₹{{ salePrice }}</span>
        <span class="original-price">₹{{ originalPrice }}</span>
      </div>

      <div class="cart-actions">
        <button type="button" class="cart-btn" @click="addToCart">
          <i class="fa-solid fa-cart-arrow-down"></i>
          <span v-if="cartQty > 0" class="card-count">{{ cartQty }}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Size Selection Modal -->
  <div v-if="showSizeModal" class="modal-overlay" @click="closeSizeModal">
    <div class="modal-content" @click.stop>
      <button type="button" class="modal-close" @click="closeSizeModal">✕</button>
      <h2>Select Size</h2>
      <p class="product-name">{{ product.title.substring(0, 50) }}...</p>
      <div class="size-options">
        <button 
          v-for="size in availableSizes" 
          :key="size"
          @click="selectedSize = size"
          type="button"
          class="size-btn"
          :class="{ 'active': selectedSize === size }"
        >
          {{ size }}
        </button>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn-cancel" @click="closeSizeModal">Cancel</button>
        <button type="button" class="btn-confirm" @click="confirmAddToCart">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: all 0.4s ease;
  width: 253px;
  height: 334px;
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e4df;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(184, 134, 11, 0.18);
  border-color: #b8860b;
}

.badge-label {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  color: #ffffff;
  padding: 8px;
  text-align: center;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.discount-badge {
  position: absolute;
  top: 45px;
  left: 12px;
  background: linear-gradient(135deg, #1a2a3a 0%, #2d3436 100%);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 12px;
  z-index: 10;
}

.wishlist-btn {
  position: absolute;
  top: 45px;
  right: 12px;
  background: #ffffff;
  border: 2px solid #e8e4df;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.wishlist-btn:hover {
  border-color: #b8860b;
}

.wishlist-btn.active {
  background: linear-gradient(135deg, #b8860b 0%, #d4a537 100%);
  border-color: #b8860b;
}

.wishlist-btn svg {
  width: 18px;
  height: 18px;
  color: #999;
  stroke-width: 2;
}

.wishlist-btn.active svg {
  color: white;
  fill: white;
}

.view-btn {
  position: absolute;
  top: 90px;
  right: 12px;
  background: #ffffff;
  border: 2px solid #e8e4df;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  font-size: 16px;
  color: #2d3436;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.view-btn:hover {
  background: linear-gradient(135deg, #b8860b 0%, #d4a537 100%);
  border-color: #b8860b;
  color: #ffffff;
  transform: scale(1.1);
}

.image-container {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #faf8f5;
  overflow: hidden;
  flex-shrink: 0;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  padding: 20px;
  transition: transform 0.3s ease;
}

.image-container:hover .product-image {
  transform: scale(1.05);
}

.product-details {
  padding: 12px;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  font-size: 12px;
  color: #2d3436;
  margin: 0 0 8px 0;
  font-weight: 500;
  line-height: 1.3;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.current-price {
  font-weight: 700;
  font-size: 14px;
  color: #b8860b;
}

.original-price {
  font-size: 11px;
  color: #999;
  text-decoration: line-through;
}

.cart-btn {
  position: absolute;
  bottom: 16px;
  right: 20px;
  background: linear-gradient(135deg, #1a2a3a 0%, #2d3436 100%);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #ffffff;
}

.cart-btn i {
  color: #ffffff;
  font-size: 18px;
}

.cart-btn:hover {
  background: linear-gradient(135deg, #b8860b 0%, #d4a537 100%);
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(184, 134, 11, 0.4);
}

.cart-actions {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.card-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4444;
  color: white;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .product-card {
    width: 200px;
    height: 280px;
  }

  .image-container {
    height: 160px;
  }

  .product-title {
    font-size: 12px;
  }

  .current-price {
    font-size: 14px;
  }

  .original-price {
    font-size: 12px;
  }

  .discount-badge {
    font-size: 10px;
    padding: 5px 10px;
  }

  .wishlist-btn,
  .view-btn {
    width: 32px;
    height: 32px;
  }

  .wishlist-btn svg {
    width: 16px;
    height: 16px;
  }

  .view-btn {
    font-size: 14px;
  }

  .cart-btn {
    width: 28px;
    height: 28px;
    bottom: 14px;
    right: 14px;
  }

  .cart-btn i {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .product-card {
    width: 160px;
    height: 240px;
  }

  .image-container {
    height: 120px;
  }

  .product-title {
    font-size: 11px;
  }

  .current-price {
    font-size: 12px;
  }

  .original-price {
    font-size: 10px;
  }

  .discount-badge {
    font-size: 9px;
    padding: 4px 8px;
    top: 40px;
    left: 8px;
  }

  .wishlist-btn,
  .view-btn {
    width: 28px;
    height: 28px;
  }

  .wishlist-btn svg {
    width: 14px;
    height: 14px;
  }

  .view-btn {
    font-size: 12px;
    top: 80px;
  }

  .cart-btn {
    width: 24px;
    height: 24px;
    bottom: 10px;
    right: 10px;
  }

  .cart-btn i {
    font-size: 12px;
  }

  .card-count {
    width: 16px;
    height: 16px;
    font-size: 10px;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #333;
}

.modal-content h2 {
  margin: 0 0 8px 0;
  color: #b8860b;
  font-size: 20px;
}

.product-name {
  color: #666;
  font-size: 14px;
  margin: 0 0 20px 0;
}

.size-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 25px;
}

.size-btn {
  padding: 12px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  color: #2d3436;
}

.size-btn:hover {
  border-color: #b8860b;
  color: #b8860b;
}

.size-btn.active {
  background: linear-gradient(135deg, #b8860b 0%, #d4a537 100%);
  color: white;
  border-color: #b8860b;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f0f0f0;
  color: #333;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-confirm {
  background: linear-gradient(135deg, #1a2a3a 0%, #2d3436 100%);
  color: white;
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #b8860b 0%, #d4a537 100%);
}
</style>


