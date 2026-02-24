<script>
import { cartStore } from '../store/cartStore.js';
import axios from 'axios';

export default {
  name: 'Cart',
  data() {
    return {
      items: [],
      discount: 30,
      currentUser: null,
      loading: false
    };
  },
  computed: {
    totalPrice() {
      return this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    },
    totalItems() {
      return this.items.reduce((total, item) => total + item.quantity, 0);
    },
    discountAmount() {
      return (this.totalPrice * this.discount) / 100;
    },
    finalPrice() {
      return this.totalPrice - this.discountAmount;
    }
  },
  methods: {
    loadCart() {
      this.items = cartStore.getCart();
    },
    loadCurrentUser() {
      try {
        const raw = localStorage.getItem('currentUser');
        this.currentUser = raw ? JSON.parse(raw) : null;
      } catch (e) {
        this.currentUser = null;
      }
    },
    removeItem(productId, selectedSize = null) {
      cartStore.removeItem(productId, selectedSize);
      this.loadCart();
      this.$forceUpdate();
    },
    updateQuantity(productId, quantity, selectedSize = null) {
      // Prevent negative values
      const validQuantity = Math.max(0, Math.floor(quantity));
      
      // Remove item if quantity is 0 or less
      if (validQuantity < 1) {
        this.removeItem(productId, selectedSize);
        return;
      }
      
      cartStore.updateQuantity(productId, validQuantity, selectedSize);
      this.loadCart();
      this.$forceUpdate();
    },
    clearCart() {
      if (confirm('Are you sure you want to clear the cart?')) {
        cartStore.clearCart();
        this.loadCart();
      }
    },
    checkout() {
      // Validate user login
      if (!this.currentUser) {
        alert('Please login first to proceed to checkout');
        this.$router.push('/user');
        return;
      }

      // Validate cart is not empty
      if (this.items.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
      }

      // Create order object
      const orderData = {
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        userEmail: this.currentUser.email,
        items: this.items.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image || item.thumbnail
        })),
        subtotal: this.totalPrice,
        discount: this.discount,
        discountAmount: this.discountAmount,
        total: this.finalPrice,
        createdAt: new Date().toISOString()
      };

      // Set loading state
      this.loading = true;

      // Send order to backend
      axios.post('http://localhost:5000/api/orders', orderData)
        .then((response) => {
          console.log('Order created successfully:', response.data);
          alert(`Thank you for your purchase! Order ID: ${response.data.orderId || 'Pending'}`);
          
          // Clear cart after successful order
          cartStore.clearCart();
          this.loadCart();
          
          // Redirect to home
          this.$router.push('/');
        })
        .catch((error) => {
          console.error('Error creating order:', error);
          alert('Failed to process order. Please try again.');
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  mounted() {
    this.loadCart();
    this.loadCurrentUser();
    this._unsub = cartStore.subscribe(items => {
      this.items = items;
    });
    window.addEventListener('user-changed', this.loadCurrentUser);
  }
  ,
  beforeUnmount() {
    if (this._unsub) this._unsub();
    window.removeEventListener('user-changed', this.loadCurrentUser);
  }
};
</script>

<template>
  <div class="cart-container">
    <h1>Shopping Cart</h1>

    <div v-if="items.length === 0" class="empty-cart">
      <p>Your cart is currently empty.</p>
      <router-link to="/" class="btn-continue">Continue Shopping</router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id + '-' + (item.selectedSize || 'nosize')" class="cart-item-row">
              <td class="product-info">
                <img v-if="item.image || item.thumbnail" :src="item.image || item.thumbnail" :alt="item.title" class="product-img">
                <div>
                  <p class="product-title">{{ item.title.substring(0, 50) }}...</p>
                </div>
              </td>
              <td class="price">₹{{ item.price }}</td>
              <td class="size-display">
                <strong>{{ item.selectedSize || 'N/A' }}</strong>
              </td>
              <td class="quantity">
                <button type="button" @click="updateQuantity(item.id, item.quantity - 1, item.selectedSize)" class="qty-btn">-</button>
                <input type="number" v-model.number="item.quantity" @change="updateQuantity(item.id, item.quantity, item.selectedSize)" class="qty-input">
                <button type="button" @click="updateQuantity(item.id, item.quantity + 1, item.selectedSize)" class="qty-btn">+</button>
              </td>
              <td class="total">₹{{ (item.price * item.quantity).toFixed(2) }}</td>
              <td class="action">
                <button type="button" @click="removeItem(item.id, item.selectedSize)" class="remove-btn">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal ({{ totalItems }} items):</span>
          <span>₹{{ totalPrice.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>Discount ({{ discount }}%):</span>
          <span>-₹{{ discountAmount.toFixed(2) }}</span>
        </div>
        <div class="summary-row total-row">
          <span>Total:</span>
          <span>₹{{ finalPrice.toFixed(2) }}</span>
        </div>
        <button type="button" @click="checkout" class="checkout-btn" :disabled="!currentUser || loading">
          {{ loading ? 'Processing...' : (currentUser ? 'Proceed to Checkout' : 'Login to Checkout') }}
        </button>
        <button type="button" @click="clearCart" class="clear-cart-btn">Clear Cart</button>
        <router-link to="/" class="btn-continue">Continue Shopping</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f1eb 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cart-container h1 {
  color: #b8860b;
  margin-bottom: 30px;
  text-align: center;
}

.empty-cart {
  text-align: center;
  padding: 40px;
  color: #666;
}

.btn-continue {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 30px;
  background: linear-gradient(90deg, #1a2a3a 0%, #2d3436 100%);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.btn-continue:hover {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  transform: scale(1.05);
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
}

.cart-items {
  overflow-x: auto;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.items-table thead {
  background-color: #b8860b;
  color: white;
}

.items-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
}

.items-table td {
  padding: 15px 12px;
  border-bottom: 1px solid #eee;
}

.cart-item-row:hover {
  background-color: #f9f9f9;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  background: #f0f0f0;
  padding: 5px;
  border-radius: 4px;
}

.product-title {
  font-weight: 500;
  margin: 0;
  font-size: 14px;
}

.price {
  color: #b8860b;
  font-weight: 600;
}

.size-display {
  text-align: center;
  font-weight: 600;
  color: #2d3436;
  padding: 10px;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 5px;
}

.qty-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 3px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.qty-btn:hover {
  background-color: #b8860b;
  color: white;
  border-color: #b8860b;
}

.qty-input {
  width: 50px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 0 5px;
}

.total {
  font-weight: 700;
  color: #b8860b;
}

.remove-btn {
  padding: 8px 15px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background-color: #ff3333;
  transform: scale(1.05);
}

.cart-summary {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.cart-summary h3 {
  margin: 0 0 20px 0;
  color: #b8860b;
  font-size: 18px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}

.summary-row:last-of-type {
  border-bottom: none;
}

.total-row {
  padding: 15px 0;
  font-weight: 700;
  font-size: 16px;
  color: #b8860b;
  border-top: 2px solid #b8860b;
  border-bottom: 2px solid #b8860b;
  margin-bottom: 20px;
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, #1a2a3a 0%, #2d3436 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  transform: scale(1.02);
}

.checkout-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.checkout-btn:disabled:hover {
  background-color: #cccccc;
  transform: none;
}

.checkout-btn.disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.checkout-btn.disabled:hover {
  background-color: #cccccc;
  transform: none;
}

.clear-cart-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(90deg, #1a2a3a 0%, #2d3436 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.clear-cart-btn:hover {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
}

.btn-continue {
  width: 100%;
  text-align: center;
  padding: 10px;
}

@media (max-width: 768px) {
  .cart-container {
    margin: 10px;
    padding: 12px;
  }

  .cart-container h1 {
    font-size: 20px;
    margin-bottom: 16px;
  }

  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
    margin-top: 20px;
  }

  .items-table {
    font-size: 12px;
  }

  .items-table th,
  .items-table td {
    padding: 8px 4px;
  }

  .product-img {
    width: 50px;
    height: 50px;
  }

  .qty-input {
    width: 40px;
    font-size: 12px;
    padding: 4px;
  }

  .delete-btn,
  .qty-btn,
  .checkout-btn,
  .clear-cart-btn {
    padding: 8px 12px;
    font-size: 12px;
  }

  .btn-continue {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .cart-container {
    margin: 5px;
    padding: 8px;
  }

  .cart-container h1 {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .items-table {
    font-size: 11px;
  }

  .items-table th,
  .items-table td {
    padding: 6px 3px;
  }

  .product-img {
    width: 40px;
    height: 40px;
  }

  .product-title {
    font-size: 10px;
  }

  .qty-input {
    width: 35px;
    font-size: 11px;
    padding: 3px;
  }

  .delete-btn,
  .qty-btn {
    padding: 6px 8px;
    font-size: 11px;
  }

  .checkout-btn,
  .clear-cart-btn,
  .btn-continue {
    padding: 10px;
    font-size: 12px;
  }

  .summary-row {
    font-size: 13px;
  }

  .total-row {
    font-size: 16px;
  }
}
</style>

