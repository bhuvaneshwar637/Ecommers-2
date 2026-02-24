<script>
import { cartStore } from '../store/cartStore.js';
import { wishlistStore } from '../store/wishlistStore.js';

export default {
  name: 'ProductDetails',
  inject: {
    showToast: {
      default: () => () => {}
    }
  },
  data() {
    return {
      product: null,
      loading: true,
      quantity: 1,
      selectedSize: null,
      isFavorite: false,
      discount: 30,
      availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    };
  },
  computed: {
    originalPrice() {
      if (!this.product) return 0;
      return (this.product.price / (1 - this.discount / 100)).toFixed(2);
    },
    productImage() {
      if (!this.product) return '';
      if (this.product.image) return this.product.image;
      if (this.product.thumbnail) return this.product.thumbnail;
      if (this.product.images && this.product.images.length) return this.product.images[0];
      return 'https://via.placeholder.com/500x400?text=No+Image';
    },
    requiresSize() {
      if (!this.product) return true;
      const category = (this.product.category || '').toLowerCase();
      // Size required for clothing and shoes
      const sizeCategories = ['clothing', 'apparel', 'cloth', 'shoe', 'shoes', 'mens-shoes', 'womens-shoes', 'mens-clothes', 'womens-clothes', 'dress', 'shirt', 'pants', 'jacket', 'coat', 'sweater'];
      return sizeCategories.some(cat => category.includes(cat));
    }
  },
  mounted() {
    this.loadProduct();
  },
  methods: {
    async loadProduct() {
      const productId = this.$route.params.id;
      

      if (this.$route.params.product) {
        this.product = this.$route.params.product;
        this.loading = false;
        this.checkWishlist();
        return;
      }

     
      try {
        let data = null;
        
        // Try FakeStore API
        try {
          const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
          if (res.ok) {
            data = await res.json();
          }
        } catch (e) {}

  
        if (!data) {
          try {
            const res = await fetch(`https://dummyjson.com/products/${productId}`);
            if (res.ok) {
              data = await res.json();
            }
          } catch (e) {}
        }

        if (data) {
          this.product = data;
        } else {
     
          this.product = {
            id: productId,
            title: 'Product',
            price: 0,
            description: 'Product details not available',
            image: 'https://via.placeho-lder.com/500x400?text=Product+Not+Found'
          };
        }
      } catch (error) {
        console.error('Error loading product:', error);
        this.product = {
          id: productId,
          title: 'Product',
          price: 0,
          description: 'Error loading product details',
          image: 'https://via.placeho-lder.com/500x400?text=Error'
        };
      } finally {
        this.loading = false;
        this.checkWishlist();
      }
    },
    checkWishlist() {
      if (this.product) {
        this.isFavorite = wishlistStore.isInWishlist(this.product.id);
      }
    },
    toggleFavorite() {
      if (!this.product) return;
      if (this.isFavorite) {
        wishlistStore.removeItem(this.product);
        this.showToast('Removed from wishlist', 'success', 2000);
      } else {
        wishlistStore.addItem(this.product);
        this.showToast('Added to wishlist', 'success', 2000);
      }
      this.isFavorite = !this.isFavorite;
    },
    addToCart() {
      if (!this.product) return;
      
      // Check if size is required for this product
      if (this.requiresSize && !this.selectedSize) {
        this.showToast('Select size', 'error', 2000);
        return;
      }
      
      const cartItem = {
        ...this.product,
        selectedSize: this.selectedSize || null
      };
      
      for (let i = 0; i < this.quantity; i++) {
        cartStore.addItem(cartItem);
      }
      
      const message = this.selectedSize 
        ? `Added ${this.quantity} item(s) to cart (Size: ${this.selectedSize})` 
        : `Added ${this.quantity} item(s) to cart`;
      
      this.showToast(message, 'success', 2000);
      this.quantity = 1;
      this.selectedSize = null;
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    increaseQuantity() {
      this.quantity++;
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<template>
  <div class="page">
    <button @click="goBack" class="back-btn" type="button">
      <i class="fa-solid fa-arrowleft"></i> Back
    </button>

    <div v-if="loading" class="loading">
      <p>Loading product details...</p>
    </div>

    <div v-else-if="product" class="product-details-container">
      <div class="product-image-section">
        <img :src="productImage" :alt="product.title" class="product-image" />
        <div class="discount-badge">{{ discount }}% OFF</div>
        <button type="button" class="favorite-btn" :class="{ active: isFavorite }" @click="toggleFavorite">
          <i :class="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
        </button>
      </div>

      <div class="product-info-section">
        <h1 class="product-title">{{ product.title }}</h1>

        <div class="rating-section" v-if="product.rating">
          <div class="stars">
            <i class="fa-solid fa-star"></i>
            <span class="rating">{{ product.rating.rate }}</span>
            <span class="reviews">({{ product.rating.count }} reviews)</span>
          </div>
        </div>

        <div class="price-section">
          <div class="price-row">
            <span class="current-price">₹{{ product.price }}</span>
            <span class="original-price">₹{{ originalPrice }}</span>
            <span class="discount-label">{{ discount }}% OFF</span>
          </div>
        </div>

        <div class="description-section">
          <h3>Description</h3>
          <p>{{ product.description }}</p>
        </div>

        <div v-if="product.category" class="category-section">
          <p><strong>Category:</strong> {{ product.category }}</p>
        </div>

        <div v-if="product.stock !== undefined" class="stock-section">
          <p :class="{ 'in-stock': product.stock > 0, 'out-of-stock': product.stock === 0 }">
            <strong>Stock:</strong> {{ product.stock > 0 ? `${product.stock} items available` : 'Out of Stock' }}
          </p>
        </div>

        <div v-if="requiresSize" class="size-selector">
          <h3>Size</h3>
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
          <p v-if="selectedSize" class="size-selected">Selected: <strong>{{ selectedSize }}</strong></p>
        </div>

        <div class="quantity-selector">
          <h3>Quantity</h3>
          <div class="quantity-controls">
            <button @click="decreaseQuantity" type="button" class="qty-btn">-</button>
            <input v-model.number="quantity" type="number" min="1" class="qty-input" />
            <button @click="increaseQuantity" type="button" class="qty-btn">+</button>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="addToCart" type="button" class="btn-add-to-cart">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>

    <div v-else class="error">
      <p>Product not found</p>
      <button @click="goBack" type="button" class="btn-back">Go Back</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  margin: 5px;
  border-radius: 5px;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f1eb 100%);
  padding: 20px;
  color: #2d3436;
}

.back-btn {
  background: linear-gradient(90deg, #1a2a3a 0%, #2d3436 100%);
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.back-btn:hover {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  transform: translateX(-4px);
}

.loading,
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  gap: 20px;
  text-align: center;
}

.loading p,
.error p {
  font-size: 18px;
}

.btn-back {
  background: linear-gradient(90deg, #1a2a3a 0%, #2d3436 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.product-details-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 12px;
  color: black;
}

.product-image-section {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  min-height: 500px;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.discount-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: linear-gradient(90deg,#b8860b 0%,#d4a537 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
}

.favorite-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.favorite-btn:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

.favorite-btn.active {
  color: #b8860b;
}

.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-title {
  font-size: 28px;
  font-weight: bold;
  color: #b8860b;
  margin: 0;
  line-height: 1.4;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f39c12;
}

.stars i {
  font-size: 16px;
}

.rating {
  font-weight: 600;
  color: black;
}

.reviews {
  color: #888;
  font-size: 14px;
}

.price-section {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #f9f9f9;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 28px;
  font-weight: bold;
  color: #27ae60;
}

.original-price {
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
}

.discount-label {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
}

.description-section {
  border-top: 2px solid #e0e0e0;
  padding-top: 16px;
}

.description-section h3 {
  font-size: 18px;
  color: #b8860b;
  margin: 0 0 12px 0;
}

.description-section p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.category-section,
.stock-section {
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.category-section p,
.stock-section p {
  margin: 0;
  color: #333;
}

.in-stock {
  color: #27ae60;
}

.out-of-stock {
  color: #e74c3c;
}

.quantity-selector {
  border: 2px solid #e0e0e0;
  padding: 16px;
  border-radius: 8px;
  background: #f9f9f9;
}

.quantity-selector h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #b8860b;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  background: linear-gradient(90deg, #1a2a3a 0%, #2d3436 100%);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  transform: scale(1.05);
}

.qty-input {
  width: 60px;
  height: 40px;
  border: 2px solid #b8860b;
  border-radius: 6px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}

.qty-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.1);
}

.size-selector {
  border: 2px solid #e0e0e0;
  padding: 16px;
  border-radius: 8px;
  background: #f9f9f9;
}

.size-selector h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #b8860b;
}

.size-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.size-btn {
  padding: 10px 16px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
}

.size-btn:hover {
  border-color: #b8860b;
  color: #b8860b;
}

.size-btn.active {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  color: white;
  border-color: #b8860b;
}

.size-selected {
  font-size: 14px;
  color: #2d3436;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn-add-to-cart {
  flex: 1;
  background: linear-gradient(90deg, #1a2a3a 0%, #2d3436 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-add-to-cart:hover {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);
}

@media (max-width: 1024px) {
  .product-details-container {
    grid-template-columns: 1fr;
    gap: 25px;
    padding: 30px;
  }

  .product-title {
    font-size: 26px;
  }

  .current-price {
    font-size: 26px;
  }
}

@media (max-width: 768px) {
  .page {
    padding: 15px;
  }

  .back-btn {
    font-size: 13px;
    padding: 8px 12px;
    margin-bottom: 15px;
  }

  .product-details-container {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
    border-radius: 10px;
  }

  .product-image-section {
    min-height: 350px;
    padding: 15px;
  }

  .product-title {
    font-size: 20px;
  }

  .current-price {
    font-size: 22px;
  }

  .original-price {
    font-size: 16px;
  }

  .discount-label {
    font-size: 13px;
    padding: 5px 10px;
  }

  .description-section p {
    font-size: 14px;
  }

  .qty-input {
    width: 50px;
    font-size: 14px;
  }

  .qty-btn {
    width: 38px;
    height: 38px;
    font-size: 16px;
  }

  .btn-add-to-cart {
    padding: 14px 20px;
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 10px;
    margin: 2px;
  }

  .back-btn {
    font-size: 11px;
    padding: 6px 10px;
    margin-bottom: 12px;
    gap: 4px;
  }

  .product-details-container {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
    border-radius: 8px;
  }

  .product-image-section {
    min-height: 250px;
    padding: 12px;
    border-radius: 6px;
  }

  .discount-badge {
    font-size: 11px;
    padding: 6px 12px;
    top: 12px;
    left: 12px;
  }

  .favorite-btn {
    width: 38px;
    height: 38px;
    font-size: 18px;
    top: 12px;
    right: 12px;
  }

  .product-info-section {
    gap: 16px;
  }

  .product-title {
    font-size: 18px;
    margin: 0 0 8px 0;
  }

  .rating-section {
    gap: 4px;
  }

  .stars i {
    font-size: 14px;
  }

  .rating {
    font-size: 13px;
  }

  .reviews {
    font-size: 11px;
  }

  .price-section {
    padding: 12px;
    border-radius: 6px;
  }

  .price-row {
    gap: 8px;
    flex-wrap: wrap;
  }

  .current-price {
    font-size: 18px;
  }

  .original-price {
    font-size: 14px;
  }

  .discount-label {
    font-size: 12px;
    padding: 4px 8px;
  }

  .description-section {
    border-top: 1px solid #e0e0e0;
    padding-top: 12px;
    border: none;
    margin-top: 8px;
  }

  .description-section h3 {
    font-size: 15px;
    margin: 0 0 8px 0;
  }

  .description-section p {
    font-size: 13px;
    line-height: 1.5;
  }

  .category-section,
  .stock-section {
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
    font-size: 13px;
  }

  .quantity-selector {
    padding: 12px;
    border-radius: 6px;
  }

  .quantity-selector h3 {
    font-size: 14px;
    margin: 0 0 8px 0;
  }

  .quantity-controls {
    gap: 6px;
  }

  .qty-btn {
    width: 36px;
    height: 36px;
    font-size: 14px;
    border-radius: 5px;
  }

  .qty-input {
    width: 45px;
    height: 36px;
    font-size: 13px;
    border-radius: 5px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;
  }

  .btn-add-to-cart {
    padding: 12px 16px;
    font-size: 14px;
    gap: 6px;
    border-radius: 6px;
  }
}
</style>


