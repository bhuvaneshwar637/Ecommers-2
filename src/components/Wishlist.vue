<script>
import { wishlistStore } from '../store/wishlistStore.js';
import ProductCard from './ProductCard.vue';

export default {
  name: "Wishlist",
  components: {
    ProductCard
  },
  data() {
    return {
      items: [],
      currentUser: null
    };
  },

  mounted() {
    this.loadCurrentUser();
    wishlistStore.setCurrentUser(this.currentUser);
    wishlistStore.loadWishlist();
    this._wishlistUnsub = wishlistStore.subscribe(() => {
      this.items = wishlistStore.getWishlist();
    });
    this.items = wishlistStore.getWishlist();
    window.addEventListener('user-changed', this.onUserChanged);
  },

  beforeUnmount() {
    if (this._wishlistUnsub) this._wishlistUnsub();
    window.removeEventListener('user-changed', this.onUserChanged);
  },

  methods: {
    loadCurrentUser() {
      try {
        const raw = localStorage.getItem('currentUser');
        this.currentUser = raw ? JSON.parse(raw) : null;
      } catch (e) {
        this.currentUser = null;
      }
    },
    onUserChanged() {
      this.loadCurrentUser();
      wishlistStore.setCurrentUser(this.currentUser);
      wishlistStore.loadWishlist();
      this.items = wishlistStore.getWishlist();
    },
    removeItem(productId) {
      wishlistStore.removeItem(productId);
      this.items = wishlistStore.getWishlist();
    },
    clearWishlist() {
      if (confirm('Are you sure you want to clear your wishlist?')) {
        wishlistStore.clearWishlist();
        this.items = [];
      }
    },
    viewProduct(product) {
      this.$router.push({
        name: 'ProductDetails',
        params: {
          id: product.id,
          product: product
        }
      });
    }
  }
};
</script>

<template>
  <div class="page">
    <h1 class="title">My Wishlist</h1>

    <div v-if="!currentUser" class="empty-state">
      <i class="fa-regular fa-heart"></i>
      <p>Please login to view your wishlist</p>
      <router-link to="/user" class="btn-login">Go to Login</router-link>
    </div>

    <div v-else-if="items.length === 0" class="empty-state">
      <i class="fa-regular fa-heart"></i>
      <p>Your wishlist is empty</p>
      <router-link to="/" class="btn-continue">Continue Shopping</router-link>
    </div>

    <div v-else>
      <div class="wishlist-actions">
        <p class="item-count">{{ items.length }} item{{ items.length !== 1 ? 's' : '' }}</p>
        <button @click="clearWishlist" class="btn-clear">Clear Wishlist</button>
      </div>

      <div class="wishlist-grid">
        <ProductCard v-for="item in items" :key="item.id" :product="item" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  margin: 5px;
  border-radius: 5px;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f1eb 100%);
  padding: 40px 20px;
  color: #2d3436;
}

.title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  font-weight: bold;
  color: #b8860b;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  gap: 20px;
  text-align: center;
}

.empty-state i {
  font-size: 64px;
  opacity: 0.5;
  color: #b8860b;
}

.empty-state p {
  font-size: 18px;
  opacity: 0.9;
}

.btn-login,
.btn-continue {
  display: inline-block;
  background: linear-gradient(90deg, #1a2a3a 0%, #2d3436 100%);
  color: #ffffff;
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-login:hover,
.btn-continue:hover {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.wish-list-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding: 0 20px;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.item-count {
  font-size: 16px;
  font-weight: 600;
  color: #2d3436;
}

.btn-clear {
  background: linear-gradient(90deg, #1a2a3a 0%, #2d3436 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 30px;
}

.btn-clear:hover {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  transform: translateY(-2px);
}

.wish-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(253px, 1fr));
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.wish-list-item {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 20px;
  align-items: center;
  color: black;
  transition: transform 0.3s ease;
}

.wish-list-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.item-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 6px;
  height: 150px;
}

.item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  color: #b8860b;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #27ae60;
  margin: 0;
}

.item-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-remove,
.btn-view {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-remove {
  background: linear-gradient(90deg, #1a2a3a 0%, #2d3436 100%);
  color: white;
}

.btn-remove:hover {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  transform: translateY(-2px);
}

.btn-view {
  background: linear-gradient(90deg, #1a2a3a 0%, #2d3436 100%);
  color: white;
}

.btn-view:hover {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .page {
    padding: 20px;
  }

  .title {
    font-size: 22px;
    margin-bottom: 16px;
  }

  .empty-state i {
    font-size: 48px;
  }

  .empty-state p {
    font-size: 16px;
  }

  .btn-login,
  .btn-continue {
    padding: 10px 20px;
    font-size: 14px;
  }

  .wish-list-actions {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    padding: 0 12px;
  }

  .item-count {
    font-size: 14px;
  }

  .btn-clear {
    align-self: flex-end;
    padding: 8px 16px;
    font-size: 13px;
  }

  .wish-list-grid {
    gap: 16px;
    padding: 0 12px;
    max-width: 100%;
    margin: 0 auto;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .wish-list-item {
    grid-template-columns: 100px 1fr;
    gap: 12px;
    padding: 12px;
  }

  .item-image {
    height: 100px;
  }

  .item-info h3 {
    font-size: 14px;
  }

  .price {
    font-size: 16px;
  }

  .item-actions {
    flex-direction: row;
    gap: 8px;
  }

  .btn-remove,
  .btn-view {
    padding: 8px 12px;
    font-size: 12px;
    flex: 1;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 12px;
    margin: 2px;
  }

  .title {
    font-size: 18px;
    margin-bottom: 12px;
    text-align: center;
  }

  .empty-state {
    min-height: 400px;
    gap: 12px;
  }

  .empty-state i {
    font-size: 40px;
  }

  .empty-state p {
    font-size: 14px;
    margin: 0;
  }

  .btn-login,
  .btn-continue {
    padding: 8px 16px;
    font-size: 12px;
  }

  .wish-list-actions {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
    padding: 0;
  }

  .item-count {
    font-size: 12px;
    margin: 0;
  }

  .btn-clear {
    align-self: stretch;
    padding: 10px;
    font-size: 12px;
  }

  .wish-list-grid {
    gap: 10px;
    padding: 0 8px;
    max-width: 100%;
    margin: 0 auto;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  }

  .wish-list-item {
    grid-template-columns: 80px 1fr;
    gap: 10px;
    padding: 10px;
    border-radius: 6px;
  }

  .item-image {
    height: 80px;
  }

  .item-image img {
    border-radius: 4px;
  }

  .item-info {
    gap: 8px;
  }

  .item-info h3 {
    font-size: 12px;
    margin: 0;
    line-height: 1.3;
  }

  .price {
    font-size: 14px;
    margin: 0;
  }

  .item-actions {
    flex-direction: column;
    gap: 6px;
    margin-top: 6px;
  }

  .btn-remove,
  .btn-view {
    padding: 6px 10px;
    font-size: 11px;
    flex: 1;
    gap: 4px;
  }

  .btn-remove i,
  .btn-view i {
    font-size: 12px;
  }
}
</style>


