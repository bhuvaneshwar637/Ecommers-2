<script>
import { cartStore } from './store/cartStore.js';
import { wishlistStore } from './store/wishlistStore.js';
import Toast from './components/Toast.vue';

export default {
  components: {
    Toast
  },
  data() {
    return {
      searchQuery: '',
      showSuggestions: false,
      isBurgerMenuOpen: false,
      suggestions: [
        { name: 'Mens Ware', path: '/men' },
        { name: 'Womens Ware', path: '/women' },
        { name: 'Backpack', path: '/backpack' },
        { name: 'Shoe', path: '/shoe' },
        { name: 'Jacket', path: '/jacket' }
      ],
      filteredSuggestions: [],
      cartCount: 0,
      wishlistCount: 0,
      currentUser: null
    }
  },
  computed: {
    cartBadge() {
      return this.cartCount;
    }
  },
  methods: {
    filterSuggestions() {
      if (this.searchQuery.trim() === '') {
        this.filteredSuggestions = [];
        this.showSuggestions = false;
      } else {
        this.filteredSuggestions = this.suggestions.filter(item =>
          item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        this.showSuggestions = this.filteredSuggestions.length > 0;
      }
    },
    selectSuggestion(path) {
      this.$router.push(path);
      this.searchQuery = '';
      this.showSuggestions = false;
      this.filteredSuggestions = [];
    },
    closeSuggestions() {
      this.showSuggestions = false;
    },
    toggleBurgerMenu() {
      this.isBurgerMenuOpen = !this.isBurgerMenuOpen;
    },
    closeBurgerMenu() {
      this.isBurgerMenuOpen = false;
    },
    handleOutsideClick(event) {
      const navbar = this.$el?.querySelector('.navbar');
      if (
        this.isBurgerMenuOpen &&
        navbar &&
        !navbar.contains(event.target)
      ) {
        this.closeBurgerMenu();
      }
    },
    goToCart() {
      this.$router.push('/cart');
      this.closeBurgerMenu();
    },
    goToWishlist() {
      this.$router.push('/wishlist');
      this.closeBurgerMenu();
    },
    showToast(message, type = 'success', duration = 2000) {
      this.$refs.toast.showToast(message, type, duration);
    },
    loadCurrentUser() {
      try {
        const raw = localStorage.getItem('currentUser');
        this.currentUser = raw ? JSON.parse(raw) : null;
        cartStore.setCurrentUser(this.currentUser);
      } catch (e) {
        this.currentUser = null;
        cartStore.setCurrentUser(null);
      }
    },
    logout() {
      localStorage.removeItem('currentUser');
      this.currentUser = null;
      cartStore.setCurrentUser(null);
      wishlistStore.setCurrentUser(null);
      window.dispatchEvent(new Event('user-changed'));
      this.$router && this.$router.push('/');
    },
    closeDropdown() {
      // Close Bootstrap dropdown after navigation
      this.$nextTick(() => {
        const dropdown = document.querySelector('.dropdown-menu.show');
        if (dropdown) {
          dropdown.classList.remove('show');
          const toggle = document.querySelector('.dropdown-toggle');
          if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    },
    navigateToCategory(path) {
      console.log('Navigating to category:', path);
      this.closeDropdown();
      this.closeBurgerMenu();
      this.$router.push(path).then(() => {
        console.log('Category navigation completed');
      }).catch(err => {
        console.error('Category navigation error:', err);
      });
    },
    navigateToSale() {
      this.closeBurgerMenu();
      this.$router.push('/sale');
    },
    refreshCart() {
      cartStore.loadCart();
    },
    onUserChanged() {
      this.loadCurrentUser();
      cartStore.setCurrentUser(this.currentUser);
      cartStore.loadCart();
      this.cartCount = cartStore.getCartCount();
      wishlistStore.setCurrentUser(this.currentUser);
      wishlistStore.loadWishlist();
      this.wishlistCount = wishlistStore.getWishlistCount();
    }
  },
  watch: {
    '$route'() {
      this.refreshCart();
    }
  },
  provide() {
    return {
      showToast: this.showToast
    };
  },
  mounted() {
    this.loadCurrentUser();
    cartStore.setCurrentUser(this.currentUser);
    cartStore.loadCart();
    this._cartUnsub = cartStore.subscribe(() => {
      this.cartCount = cartStore.getCartCount();
    });
    wishlistStore.setCurrentUser(this.currentUser);
    wishlistStore.loadWishlist();
    this._wishlistUnsub = wishlistStore.subscribe(() => {
      this.wishlistCount = wishlistStore.getWishlistCount();
    });
    // initialize visible count
    this.cartCount = cartStore.getCartCount();
    this.wishlistCount = wishlistStore.getWishlistCount();
    window.addEventListener('user-changed', this.onUserChanged);
    // Add outside click handler for burger menu
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    // Remove outside click handler
    document.removeEventListener('click', this.handleOutsideClick);
  }
}
</script>

<template>

  <nav class="navbar navbar-expand-lg bg-bodytertiary" style="padding: 0; margin: 0;">
    <div class="container-fluid" style="padding: 0; margin: 0;">
      <a class="navbar-brand" href="#"><img class="logo"
          src="../src/assets/woodland-logo-woodland-icon-free-free-vector.jpg" alt="logo" /></a>
      <router-link to="/" class="nav-link navbar-home-link d-lg-none" @click="closeBurgerMenu()">Home</router-link>
      <button class="navbar-toggler" type="button" @click="toggleBurgerMenu()"
        :aria-expanded="isBurgerMenuOpen" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" :class="{ show: isBurgerMenuOpen }" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg0">
          <li class="nav-item">
            <router-link to="/" class="nav-link" @click="closeBurgerMenu()">Home</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click="closeBurgerMenu()">Email</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Category
            </a>
            <ul class="dropdown-menu" style="background-color:rgb(12, 84, 35);">
              <li><a class="dropdown-item" style="color: black; cursor: pointer;" @click="navigateToCategory('/shoe'); closeBurgerMenu()">
                  shoe
                </a></li>
              <li>
                <a class="dropdown-item" style="color: black; cursor: pointer;" @click="navigateToCategory('/men'); closeBurgerMenu()">Men-ware</a>
              </li>
              <li>
                <a class="dropdown-item" style="color: black; cursor: pointer;" @click="navigateToCategory('/women'); closeBurgerMenu()">womens ware</a>
              </li>
              <li>
                <a class="dropdown-item" style="color: black; cursor: pointer;" @click="navigateToCategory('/jacket'); closeBurgerMenu()">Jackets</a>
              </li>
              <li>
                <a class="dropdown-item" style="color: black; cursor: pointer;" @click="navigateToCategory('/backpack'); closeBurgerMenu()">Backpacks</a>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link sale-link" href="#" role="button" @click.prevent="navigateToSale(); closeBurgerMenu()" style="cursor: pointer;">Sale is Live</a>
          </li>
        </ul>
        <form class="d-flex search-form" role="search" @submit.prevent style="position: relative; gap: 4px;">
          <input 
            class="form-control me-1" 
            type="search" 
            placeholder="Search" 
            aria-label="Search"
            v-model="searchQuery"
            @input="filterSuggestions"
            @focus="searchQuery && showSuggestions ? null : closeSuggestions()"
            style="font-size: 13px; padding: 4px 8px; height: 32px; width: 140px;"
          />
          <button class="btn btn-outline-success" style="background-color: aliceblue; font-size: 12px; padding: 4px 8px; height: 32px;" type="submit" @click="closeBurgerMenu()"><span
              style="color:green;font-weight:4000;">search</span></button>
          
          <!-- Suggestions Dropdown -->
          <div v-if="showSuggestions || (searchQuery && filteredSuggestions.length === 0)" class="suggestions-dropdown">
            <div 
              v-if="filteredSuggestions.length > 0"
              v-for="suggestion in filteredSuggestions" 
              :key="suggestion.path"
              class="suggestion-item"
              @click="selectSuggestion(suggestion.path); closeBurgerMenu()"
            >
              {{ suggestion.name }}
            </div>
            <div v-else-if="searchQuery" class="suggestion-item noresult">
              Result not found
            </div>
          </div>
        </form>
        <div style="display:flex ; flex-direction: row; padding: 5px; gap: 6px; align-items:center; margin-left: auto;" class="cart">
          <button @click="goToWishlist" class="wishlist-icon-btn" style="border: none; background: none; cursor: pointer; position: relative;">
            <i style="color: white; font-size: 18px;" class="fa-regular fa-heart"></i>
            <span v-if="wishlistCount > 0" class="wishlist-badge">{{ wishlistCount }}</span>
          </button>
          <button @click="goToCart" class="cart-icon-btn" style="border: none; background: none; cursor: pointer; position: relative;">
            <i style="color: white; font-size: 18px;" class="fa-solid fa-cart-shopping"></i>
            <span v-if="cartBadge > 0" class="cart-badge">{{ cartBadge }}</span>
          </button>
          <div v-if="currentUser" class="user-area" style="color:white; display:flex; gap:6px; align-items:center;">
            <span class="user-name" style="font-size: 13px;">Hi, {{ currentUser.name.split(' ')[0] }}</span>
            <button type="button" @click="logout(); closeBurgerMenu()" class="btn-logout" style="background:none;border:1px solid rgba(255,255,255,0.2);color:white;padding:4px 6px;border-radius:6px;font-size:12px;">Logout</button>
          </div>
          <router-link v-else to="/user" class="login-link" style="color:white; font-size:18px;" @click="closeBurgerMenu()"><i class="fa-regular fa-user"></i></router-link>
        </div>
      </div>
    </div>
  </nav>

  <Toast ref="toast" />
  <router-view :key="$route.path" />
  <footer class="footer">
    <div class="footer-container">

      <div class="footer-content">
        <div class="footer-top d-flex flex-column flex-md-row justify-content-between align-items-center">

          <div class="social-links d-flex">

            <a href="https://instagram.com" target="_blank" title="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </a>

            <a href="https://facebook.com" target="_blank" title="Facebook">
              <i class="fa-brands fa-facebook"></i>
            </a>

            <a href="https://youtube.com" target="_blank" title="YouTube">
              <i class="fa-brands fa-youtube"></i>
            </a>

            <a href="https://twitter.com" target="_blank" title="Twitter">
              <i class="fa-brands fa-twitter"></i>
            </a>

            <a href="https://linkedin.com" target="_blank" title="LinkedIn">
              <i class="fa-brands fa-linkedin"></i>
            </a>

            <div class="app-links d-flex">

              <a href="https://play.google.com" target="_blank" title="Google Play">
                <i class="fa-brands fa-google-play"></i>
              </a>

              <a href="https://apps.apple.com" target="_blank" title="App Store">
                <i class="fa-brands fa-app-store"></i>
              </a>

            </div>

          </div>

        </div>

        <div class="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center">

          <div class="footer-menu d-flex flex-wrap justify-content-center">
            <a href="#">About Us</a>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Refund</a>
            <a href="#">Shipping</a>
            <a href="#">Outlet</a>
            <a href="#">Blogs</a>
            <a href="#">Contact</a>
            <a href="#">Career</a>
          </div>
          <div class="copyright">
            © 2026 bhuvaneshwar Private Limited
          </div>

        </div>

      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
  color: #f5f5f0;
  padding: 40px 20px;
  width: 100%;
  border-top: 1px solid #c9a227;
}

.footer-container {
  max-width: 1200px;
  margin: auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.footer-top {
  gap: 20px;
}

.social-links,
.app-links {
  gap: 5px;
}

.social-links a,
.app-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: white;
  text-decoration: none;
  transition: transform 0.3s ease, color 0.3s ease, background-color 0.3s ease;
  border-radius: 50%;
}

.social-links a i,
.app-links a i {
  font-size: 20px;
}

.social-links a:hover,
.app-links a:hover {
  transform: scale(1.15);
  color: #c9a227;
  background-color: rgba(201, 162, 39, 0.2);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: 20px;
  gap: 15px;
}

.footer-menu {
  gap: 15px;
}

.footer-menu a {
  color: white;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-menu a:hover {
  color: #c9a227;
}

.copyright {
  font-size: 13px;
  opacity: 0.8;
}

@media (max-width: 768px) {

  .footer-top,
  .footer-bottom {
    text-align: center;
  }

  .social-links,
  .app-links,
  .footer-menu {
    justify-content: center;
  }
}

.container2 {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container2 img {
  margin: 5px;
  width: 98%;
  height: 500px;
  image-rendering: auto;
  border-radius: 10px;

}

.container2 img:hover {
  transform: scale(1.01);
}

.navbar {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0 !important;
  z-index: 1000;
}

.navbar .navbar-nav {
  padding: 0 !important;
  margin: 0 !important;
  order: 2;
  flex: 1;
}

.navbar .nav-link {
  padding: 0 12px !important;
  margin: 0 !important;
}

.navbar-collapse {
  padding: 0 !important;
  margin: 0 !important;
  display: none;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.navbar-collapse.show {
  display: flex;
}

.search-form {
  flex: 0 1 auto;
  order: 3;
}

.cart {
  flex: 0 0 auto;
  order: 4;
  margin-left: auto;
}

.dropdown-menu {
  background-color: #1a1a1a !important;
  border: 1px solid #c9a227 !important;
}

.dropdown-item {
  color: #f5f5f0 !important;
}

.dropdown-item:hover,
.dropdown-item:focus {
  background: linear-gradient(90deg, rgba(201, 162, 39, 0.3) 0%, transparent 100%) !important;
  color: #c9a227 !important;
  transform: translateX(5px);
  transition: all 0.3s ease;
}

#carouselExampleIndicators {
  width: 100%;
  margin: 0;
  padding: 0;

}

.container-fluid {
  background: linear-gradient(90deg, #0d0d0d 0%, #1a1a1a 50%, #0d0d0d 100%);
  border-bottom: 1px solid #c9a227;
}

.navbar a {
  color: white !important;
}

.sale-link {
  color: #d4a537 !important;
  font-weight: 600 !important;
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    color: #d4a537 !important;
    text-shadow: 0 0 5px rgba(212, 165, 55, 0.5);
  }
  50% {
    color: #ffeb3b !important;
    text-shadow: 0 0 10px rgba(255, 235, 59, 0.8);
  }
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath stroke='white' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E") !important;
}

.dropdown-menu a {
  color: black;
}

.logo {
  height: 40px;
  width: 40px;
}

.navbar-home-link {
  color: white !important;
  font-weight: 600;
  margin-left: 10px;
  padding: 8px 12px !important;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.navbar-home-link:hover {
  background-color: rgba(201, 162, 39, 0.2);
  color: #c9a227 !important;
}

.container-fluid {
  color: rgb(239, 239, 239);
}

#carouselExampleIndicators img {
  width: 100%;
  height: 600px;
  image-rendering: auto;
  /* You can change height */
  /* No stretch */
  display: block;
}

.category {
  width: 100%;
  padding: 20px;
}

.c-content {
  display: grid;

  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 200px);

  gap: 15px;
}

/* Make c1 span 2 rows */
.c1 {
  grid-row: 1 / span 2;
  grid-column: 1 / 2;
  position: relative;
}

.c2,
.c3,
.c4,
.c5 {
  position: relative;
}

.c-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.shoe-text {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  z-index: 10;
}

.c-content img {
  transition: transform 0.3s ease;
}

.c-content img:hover {
  transform: scale(1.05);
}

.cart-icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wishlist-icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-badge,
.wishlist-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
  color: #0d0d0d;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.cart-icon-btn:hover,
.wishlist-icon-btn:hover {
  opacity: 0.8;
}

@media (max-width: 1024px) {
  #carouselExampleIndicators img {
    height: 450px;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 !important;
    margin: 0 !important;
  }

  .container-fluid {
    padding: 0 !important;
    margin: 0 !important;
  }

  .logo {
    height: 32px;
    width: 32px;
  }

  .navbar-home-link {
    font-size: 13px !important;
    margin-left: 6px !important;
    padding: 6px 10px !important;
  }

  .navbar a {
    font-size: 14px;
    padding: 8px 4px !important;
  }

  .search-form {
    width: auto;
    margin: 8px 0 !important;
    gap: 4px !important;
    order: 3;
    flex: 0 1 auto;
  }

  .search-form input {
    width: 100px !important;
    font-size: 11px !important;
    padding: 3px 6px !important;
    height: 28px !important;
  }

  #carouselExampleIndicators img {
    height: 300px;
  }

  .search-form button {
    font-size: 10px !important;
    padding: 3px 6px !important;
    height: 28px !important;
  }

  .cart {
    order: 4;
    flex: 0 0 auto;
    margin-left: auto;
  
    gap: 4px !important;
    padding: 3px !important;
  }

  .cart i {
    font-size: 16px !important;
  }

  .user-area {
    gap: 4px !important;
  }

  .user-name {
    font-size: 11px !important;
  }

  .btn-logout {
    font-size: 10px !important;
    padding: 3px 5px !important;
  }

  .dropdown-menu {
    font-size: 13px;
  }

  .c-content {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 150px);
    gap: 10px;
  }

  .c1 {
    grid-row: 1 / span 2;
    grid-column: 1 / 2;
  }

  .shoe-text {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0 !important;
    margin: 0 !important;
  }

  .container-fluid {
    padding: 0 !important;
    margin: 0 !important;
  }

  .logo {
    height: 28px;
    width: 28px;
  }

  .navbar-home-link {
    font-size: 12px !important;
    margin-left: 4px !important;
    padding: 4px 8px !important;
  }

  .navbar a {
    font-size: 12px;
  }

  .dropdown-toggle::after {
    display: none;
  }

  .search-form {
    width: 100%;
    flex-direction: column;
    gap: 4px !important;
    order: 3;
    margin-bottom: 8px;
  }

  .search-form input {
    width: 100% !important;
    font-size: 10px !important;
    padding: 3px 4px !important;
    height: 26px !important;
  }

  .search-form button {
    font-size: 9px !important;
    padding: 3px 4px !important;
    height: 26px !important;
    width: 50px;
  }

  .cart {
    gap: 6px !important;
    padding: 4px !important;
    order: 4;
    margin-left: auto;
    width: 100%;
    justify-content: flex-end;
  }

  .cart i {
    font-size: 14px !important;
  }

  .user-area {
    display: none;
  }

  .c-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 8px;
  }

  .c1 {
    grid-row: auto;
    grid-column: auto;
  }

  .c1, .c2, .c3, .c4, .c5 {
    height: 120px;
  }

  .shoe-text {
    font-size: 14px;
  }

  #carouselExampleIndicators img {
    height: 200px;
  }
}
</style>


