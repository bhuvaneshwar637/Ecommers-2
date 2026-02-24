<script>
import ProductCard from './ProductCard.vue';

export default {
  name: "Sale",
  components: {
    ProductCard
  },
  data() {
    return {
      allProducts: [],
      filteredProducts: [],
      loading: true,
      priceRange: [0, 100000],
      selectedCategories: [],
      minPrice: 0,
      maxPrice: 100000,
      categories: [],
      sortBy: 'popular',
      expandedSections: {
        price: true,
        category: true,
        sort: true
      }
    };
  },

  mounted() {
    this.fetchAllProducts();
  },

  methods: {
    async fetchAllProducts() {
      this.loading = true;
      try {
        // Fetch from multiple sources
        const [fakeStore, dummyJson] = await Promise.all([
          fetch("https://fakestoreapi.com/products").then(r => r.json()),
          fetch("https://dummyjson.com/products").then(r => r.json()).then(d => d.products || [])
        ]);

        this.allProducts = [...fakeStore, ...dummyJson];
        
        // Extract unique categories
        this.categories = [...new Set(this.allProducts.map(p => p.category).filter(c => c))];
        
        this.applyFilters();
      } catch (error) {
        console.error("Error fetching products:", error);
        this.allProducts = [];
      } finally {
        this.loading = false;
      }
    },

    applyFilters() {
      let filtered = this.allProducts;

      // Filter by price range
      filtered = filtered.filter(product => {
        const price = product.price || 0;
        return price >= this.priceRange[0] && price <= this.priceRange[1];
      });

      // Filter by selected categories
      if (this.selectedCategories.length > 0) {
        filtered = filtered.filter(product => 
          this.selectedCategories.includes(product.category)
        );
      }

      // Sort products
      if (this.sortBy === 'price-low') {
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (this.sortBy === 'price-high') {
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
      }

      this.filteredProducts = filtered;
    },

    toggleCategory(category) {
      const index = this.selectedCategories.indexOf(category);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      } else {
        this.selectedCategories.push(category);
      }
      this.applyFilters();
    },

    onPriceChange() {
      this.applyFilters();
    },

    onSortChange() {
      this.applyFilters();
    },

    resetFilters() {
      this.priceRange = [0, 100000];
      this.selectedCategories = [];
      this.sortBy = 'popular';
      this.applyFilters();
    },

    toggleSection(section) {
      this.expandedSections[section] = !this.expandedSections[section];
    },

    getRangeTrackStyle() {
      const minPercent = (this.priceRange[0] / 100000) * 100;
      const maxPercent = (this.priceRange[1] / 100000) * 100;
      return {
        left: minPercent + '%',
        right: (100 - maxPercent) + '%'
      };
    }
  }
};
</script>

<template>
  <div class="sale-container">
    <div class="page-header">
      <h1>Sale is Live</h1>
      <p class="subtitle">Discover amazing deals on all products</p>
    </div>

    <div class="sale-content">
      <!-- Filters Sidebar -->
      <aside class="filters-sidebar">
        <div class="filter-section">
          <h3>Filters</h3>
          <button @click="resetFilters" class="reset-btn">Reset Filters</button>
        </div>

        <!-- Price Range Filter -->
        <div class="filter-section">
          <h4 @click="toggleSection('price')" class="filter-header">
            Price Range
            <span class="toggle-icon">{{ expandedSections.price ? '−' : '+' }}</span>
          </h4>
          <div v-if="expandedSections.price" class="price-range-container">
            <div class="range-inputs">
              <input 
                v-model.number="priceRange[0]" 
                type="range" 
                min="0" 
                max="100000" 
                step="100"
                @input="onPriceChange"
                class="range-input"
              />
              <input 
                v-model.number="priceRange[1]" 
                type="range" 
                min="0" 
                max="100000" 
                step="100"
                @input="onPriceChange"
                class="range-input"
              />
            </div>
            <div class="range-track">
              <div class="range-fill" :style="getRangeTrackStyle()"></div>
            </div>
            <div class="price-inputs">
              <div class="input-group">
                <label>Min:</label>
                <input 
                  v-model.number="priceRange[0]" 
                  type="number" 
                  @change="onPriceChange"
                  class="number-input"
                  min="0"
                  max="100000"
                />
              </div>
              <div class="input-group">
                <label>Max:</label>
                <input 
                  v-model.number="priceRange[1]" 
                  type="number" 
                  @change="onPriceChange"
                  class="number-input"
                  min="0"
                  max="100000"
                />
              </div>
            </div>
            <div class="price-display">
              ₹{{ priceRange[0].toLocaleString() }} - ₹{{ priceRange[1].toLocaleString() }}
            </div>
          </div>
        </div>

        <!-- Category Filter -->
        <div class="filter-section">
          <h4 @click="toggleSection('category')" class="filter-header">
            Category
            <span class="toggle-icon">{{ expandedSections.category ? '−' : '+' }}</span>
          </h4>
          <div v-if="expandedSections.category" class="category-filter">
            <label v-for="category in categories" :key="category" class="category-checkbox">
              <input 
                type="checkbox" 
                :checked="selectedCategories.includes(category)"
                @change="toggleCategory(category)"
              />
              <span>{{ category }}</span>
            </label>
          </div>
        </div>

        <!-- Sort Filter -->
        <div class="filter-section">
          <h4 @click="toggleSection('sort')" class="filter-header">
            Sort By
            <span class="toggle-icon">{{ expandedSections.sort ? '−' : '+' }}</span>
          </h4>
          <div v-if="expandedSections.sort">
          <select v-model="sortBy" @change="onSortChange" class="sort-select">
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          </div>
        </div>
      </aside>

      <!-- Products Grid -->
      <div class="products-section">
        <div class="results-info">
          <p>Showing <strong>{{ filteredProducts.length }}</strong> products</p>
        </div>

        <div v-if="loading" class="loading">
          <p>Loading products...</p>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="no-products">
          <p>No products found with the selected filters.</p>
          <button @click="resetFilters" class="reset-btn-secondary">Clear Filters</button>
        </div>

        <div v-else class="grid">
          <ProductCard
            v-for="item in filteredProducts"
            :key="item.id"
            :product="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sale-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f1eb 100%);
  overflow-x: hidden;
  box-sizing: border-box;
}

.page-header {
  background: linear-gradient(135deg, #1a2a3a 0%, #2d3436 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
  border-bottom: 3px solid #b8860b;
}

.page-header h1 {
  font-size: 36px;
  margin: 0;
  color: #d4a537;
}

.subtitle {
  font-size: 16px;
  margin: 10px 0 0 0;
  opacity: 0.9;
}

.sale-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 30px 20px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.filters-sidebar {
  background: white;
  border-radius: 8px;
  padding: 8px;
  height: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 100px;
}

.filter-section {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.filter-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.filter-section h3 {
  margin: 0 0 6px 0;
  color: #b8860b;
  font-size: 15px;
}

.filter-section h4 {
  margin: 0 0 6px 0;
  color: #2d3436;
  font-size: 12px;
  font-weight: 600;
}

.filter-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  transition: color 0.2s ease;
  margin: 0 0 6px 0;
  color: #2d3436;
  font-size: 12px;
  font-weight: 600;
}

.filter-header:hover {
  color: #b8860b;
}

.toggle-icon {
  font-size: 16px;
  font-weight: 700;
  color: #b8860b;
}

.reset-btn {
  width: 100%;
  padding: 6px;
  background: linear-gradient(135deg, #b8860b 0%, #d4a537 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);
}

.price-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.price-input {
  flex: 1;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 11px;
}

.price-range-container {
  width: 100%;
}

.range-inputs {
  position: relative;
  display: flex;
  margin-bottom: 12px;
}

.range-input {
  position: absolute;
  width: 100%;
  height: 6px;
  top: 9px;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
  z-index: 5;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #b8860b 0%, #d4a537 100%);
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 8px rgba(184, 134, 11, 0.4);
}

.range-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #b8860b 0%, #d4a537 100%);
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.range-input::-moz-range-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 8px rgba(184, 134, 11, 0.4);
}

.range-track {
  position: relative;
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  margin-bottom: 12px;
}

.range-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  border-radius: 3px;
  pointer-events: none;
}

.price-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 10px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.input-group label {
  font-size: 11px;
  color: #666;
  font-weight: 600;
}

.number-input {
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 11px;
}

.number-input:focus {
  outline: none;
  border-color: #b8860b;
  box-shadow: 0 0 3px rgba(184, 134, 11, 0.3);
}

.price-display {
  font-size: 13px;
  color: #b8860b;
  font-weight: 600;
  text-align: center;
}

.category-filter {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.category-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 12px;
}

.category-checkbox input {
  cursor: pointer;
  width: 14px;
  height: 14px;
}

.category-checkbox span {
  color: #2d3436;
}

.sort-select {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.products-section {
  flex: 1;
}

.results-info {
  margin-bottom: 20px;
  font-size: 14px;
  color: #2d3436;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #b8860b;
}

.no-products {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-products p {
  font-size: 16px;
  color: #666;
  margin: 0 0 20px 0;
}

.reset-btn-secondary {
  padding: 10px 24px;
  background: linear-gradient(135deg, #1a2a3a 0%, #2d3436 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.reset-btn-secondary:hover {
  background: linear-gradient(135deg, #b8860b 0%, #d4a537 100%);
  transform: translateY(-2px);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  box-sizing: border-box;
  overflow-x: hidden;
  width: 100%;
}

@media (max-width: 1024px) {
  .sale-content {
    grid-template-columns: 240px 1fr;
    gap: 20px;
  }

  .filters-sidebar {
    top: 80px;
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 28px;
  }

  .sale-content {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 20px 12px;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  .filters-sidebar {
    position: static;
    margin-bottom: 16px;
    box-sizing: border-box;
  }

  .grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 14px;
    max-width: 100%;
    margin: 0 auto;
    overflow-x: hidden;
    box-sizing: border-box;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 24px 16px;
    margin: 0;
  }

  .page-header h1 {
    font-size: 22px;
  }

  .subtitle {
    font-size: 14px;
  }

  .sale-content {
    padding: 16px 8px;
    gap: 12px;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  .filters-sidebar {
    padding: 12px;
  }

  .grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    max-width: 100%;
    margin: 0 auto;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  .results-info {
    font-size: 12px;
  }
}
</style>
