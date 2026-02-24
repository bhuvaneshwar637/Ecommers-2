
import { createRouter, createWebHistory } from 'vue-router';
import Exclusive from "../components/exclusive.vue";
import Mens from "../components/mens.vue";
import Home from "../components/Home.vue";
import women from "../components/women.vue";
import shoe from "../components/shoe.vue";
import backpack from "../components/backpack.vue";
import jacket  from '../components/jacket.vue';
import reg from '../components/register.vue';
import Cart from '../components/Cart.vue';
import UserInfo from '../components/UserInfo.vue';
import Wishlist from '../components/Wishlist.vue';
import ProductDetails from '../components/ProductDetails.vue';
import Sale from '../components/Sale.vue';




const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/exe",
    component: Exclusive
  },
  {
    path: '/men',
    component:Mens
  },
  {
    path: '/women',
    component: women
  },
  {
    path: '/shoe',
    component: shoe
  },
  {
    path:'/backpack',
    component:backpack
  },{
    path:'/jacket',
    component:jacket
  },
  {
   path:'/reg',
   component:reg
  },
  {
    path:'/cart',
    component:Cart
  },{
  path:'/UserInfo',
  component:UserInfo
  },
  {
    path:'/user',
    component:UserInfo
  },
  {
    path:'/wishlist',
    component:Wishlist
  },
  {
    path:'/product/:id',
    name: 'ProductDetails',
    component:ProductDetails
  },
  {
    path:'/sale',
    name: 'Sale',
    component: Sale
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }
});

// Add navigation guard for debugging
router.beforeEach((to, from, next) => {
  console.log('Navigating from:', from.path, 'to:', to.path);
  next();
});

export default router;