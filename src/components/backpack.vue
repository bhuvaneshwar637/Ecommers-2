<script>
import ProductCard from "./ProductCard.vue";

export default {
  name: "MenBackpacks",
  components: {
    ProductCard
  },

  data() {
    return {
      products: [],
      loading: true,
      fallbackUsed: false
    };
  },

  mounted() {
    this.fetchBackpacks();
  },

  methods: {
    async fetchBackpacks() {
      this.loading = true;
      try {
        const res = await fetch("https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json");
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const products = await res.json();

        const backpacks = (products || []).filter(p => {
          const name = (p.name || '').toString().toLowerCase();
          const keywords = Array.isArray(p.keywords) ? p.keywords.map(k => (k||'').toString().toLowerCase()) : [];
          return name.includes('backpack') || keywords.some(k => k.includes('backpack'));
        });

        console.log('backpack: found from kolzsticks API =', backpacks.length, backpacks.slice(0,6).map(b => b.name));

        this.products = backpacks;
        this.fallbackUsed = false;

      } catch (e) {
        console.error('backpack fetch error:', e);
        this.products = [];
      } finally {
        this.loading = false;
      }
    },

    viewProduct(product) {
      console.log(product);
    }
  },
  watch: {
    '$route'() {
      this.fetchBackpacks();
    }
  }
};
</script>

<template>
  <div class="page">

    <h1 class="title">Men Backpacks</h1>

    <p v-if="loading" class="loading">
      Loading products...
    </p>

    <p v-else-if="products.length === 0" class="loading">
      Out of Stock
    </p>

    <p v-else-if="fallbackUsed" class="loading">
      No exact matches found — showing sample items
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
  font-size: 20px;
  font-weight: bold;
  color: #b8860b;
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


