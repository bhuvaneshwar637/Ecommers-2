<script>
import ProductCard from './ProductCard.vue';

export default {
  name: "shoe",
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
    this.fetchShoes();
  },

  methods: {
    async fetchShoes() {
      this.loading = true;
      try {
        const res = await fetch("https://dummyjson.com/products/category/mens-shoes");

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        this.products = data.products || [];
      } catch (error) {
        console.error("Error:", error);
        this.products = [];
      } finally {
        this.loading = false;
      }
    },
    viewProduct(product) {
      console.log('Viewing product:', product);
    }
  },
  watch: {
    '$route'() {
      this.fetchShoes();
    }
  }
};
</script>

<template>
  <div class="page">

    <h1 class="title">Shoes Collection</h1>

    <p v-if="loading" class="loading">
      Loading products...
    </p>

    <p v-else-if="products.length === 0" class="loading">
      No shoes found
    </p>

    <div v-else class="grid">
      <ProductCard
        v-for="item in products"
        :key="item.id"
        :product="item"
        @view-product="viewProduct"
      />
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

.title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 20px;
  color: #b8860b;
}

.loading {
  text-align: center;
  font-size: 18px;
}

.grid {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 14px;
    max-width: 100%;
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
    max-width: 100%;
    padding: 0 12px;
  }
}
</style>


