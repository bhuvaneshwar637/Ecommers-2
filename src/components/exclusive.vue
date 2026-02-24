<script>
import ProductCard from './ProductCard.vue';

export default {
  name: "HorizontalProducts",
  components: {
    ProductCard
  },
  data() {
    return {
      products: [],
      loading: true
    };
  },

  mounted() {
    this.fetchProducts();
  },

  methods: {
    async fetchProducts() {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();

        // Filter only clothing items
        this.products = data.filter(product => 
          product.category && product.category.toLowerCase().includes('clothing')
        );
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },
    viewProduct(product) {
      console.log('Viewing product:', product);
    }
  }
};
</script>

<template>
  <div class="container">

    <h2 class="title"><span style="color: azure;">Featured Products</span></h2>

    <!-- Loading -->
    <p v-if="loading" class="loading">
      Loading products...
    </p>

    <!-- Horizontal Scroll -->
    <div v-else class="product-row">
      <ProductCard
        v-for="item in products"
        :key="item.id"
        :product="item"
        @view-product="viewProduct"
      />
    </div>

  </div>
</template>

<style>
.container {
  padding: 30px 20px;
  background: linear-gradient(135deg, #1a2a3a 0%, #2d3436 100%);
  border-radius: 15px;
  color: #faf8f5;
  margin: 0;
  border: 2px solid #b8860b;
}

.title {
  font-size: 28px;
  margin-bottom: 25px;
  text-align: center;
  font-weight: bold;
  color: #d4a537;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.title span {
  color: #d4a537 !important;
}

.loading {
  text-align: center;
  font-size: 16px;
  color: #d4a537;
  padding: 20px;
}

.product-row {
  display: flex;
  gap: 25px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 20px 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.product-row::-webkit-scrollbar {
  display: none;
}

.product-row > * {
  flex: 0 0 280px;
  min-width: 280px;
}
</style>


