<template>
  <div>
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
            aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
            aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
            aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="../assets/carousel_banner_2.webp" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="../assets/video_banner3.webp" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="../assets/banner1.jpg" class="d-block w-100" alt="...">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      <div class="category">
        <div class="c-content">
          <div class="c1">
                 <h3 class="shoe-text"> Shoe</h3>
                 <div @click="navigateTo('/shoe')" style="cursor: pointer;"> <img src="https://assets.woodland.social/new_woodland/landing/top_category_1.webp" class="img-fluid" alt="Shoes"></div>
                
          </div>
          <div class="c2">
            <h3 class="shoe-text">git Apparel</h3>
            <div @click="navigateTo('/men')" style="cursor: pointer;"> <img src="https://assets.woodland.social/new_woodland/landing/top_category_2.webp" class="img-fluid" alt="Men's Apparel"> </div>
            
          </div>
          <div class="c3">
                <h3 class="shoe-text">Women Apparel</h3>
                <div @click="navigateTo('/women')" style="cursor: pointer;">  <img src="https://assets.woodland.social/new_woodland/landing/top_category_3.webp" class="img-fluid" alt="Women's Apparel"></div>
                
          </div>
          <div class="c4">
            <h3 class="shoe-text">Jacket</h3>
                    <div @click="navigateTo('/jacket')" style="cursor: pointer;"><img src="https://assets.woodland.social/new_woodland/landing/top_category_4.webp" class="img-fluid" alt="Jackets">  </div>
                   
          </div>
          <div class="c5">
            <h3 class="shoe-text">Backpack</h3>
            <div @click="navigateTo('/backpack')" style="cursor: pointer;"><img src="https://assets.woodland.social/new_woodland/landing/top_category_5.webp" class="img-fluid" alt="Backpacks">  </div>
            
          </div>
        </div>
      </div>
        <div class="exclusive">
          
            <Exclusive></Exclusive>
         
        </div>
      <div class="registration">
            <reg></reg>
        </div>
      <div class="container2">
         <img src="https://assets.woodland.social/new_woodland/landing/adventure.webp" alt="Banner" @click="navigateToSale" style="cursor: pointer;"> 
      </div>
  </div>
</template>

<script>
import Exclusive from "./exclusive.vue";
import reg from "./register.vue";

export default {
  name: "Home",
  components: {
    Exclusive,
    reg
  },
  methods: {
    navigateTo(path) {
      console.log('Navigating to:', path);
      this.$router.push(path).then(() => {
        console.log('Navigation completed');
      }).catch(err => {
        console.error('Navigation error:', err);
      });
    },
    navigateToSale() {
      console.log('Navigating to sale page');
      this.$router.push('/sale').then(() => {
        console.log('Navigation to sale completed');
      }).catch(err => {
        console.error('Navigation error:', err);
      });
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.registration{
    margin: 20px 5px;
    border-radius: 20px;
    padding: 20px 0;
}
#carouselExampleIndicators {
  width: 100%;  
  margin: 0;
  padding: 0;
  margin-bottom: 40px;
}
#carouselExampleIndicators img {
  width: 100%;
  height: 600px; 
  image-rendering: auto;
  display: block;
}
.category{
  width: 100%;
  padding: 30px 20px;
  margin-bottom: 40px;
  background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
  border-top: 1px solid rgba(201, 162, 39, 0.3);
  border-bottom: 1px solid rgba(201, 162, 39, 0.3);
}
.c-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.c1 {
  grid-row: 1 / span 2;
  grid-column: 1 / 2;
  position: relative;
}
.c2, .c3, .c4, .c5 {
  position: relative;
}
.c-content img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: all 0.4s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
  border: 1px solid rgba(201, 162, 39, 0.2);
}
.c-content img:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(201, 162, 39, 0.3);
  border-color: #c9a227;
}

.shoe-text {
  position: absolute;
  top: 15px;
  left: 15px;
  color: #c9a227;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.9);
  z-index: 10;
  pointer-events: none;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.exclusive {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  padding: 30px 0;
}
.container2{
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 5px;
  padding: 20px 0;
}
.container2 img{
  margin: 5px;
  width: 98%;
  height: 400px;
  image-rendering:auto;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.5);
  border: 1px solid rgba(201, 162, 39, 0.2);
}
.container2 img:hover{
   transform: scale(1.02);
   box-shadow: 0 12px 30px rgba(201, 162, 39, 0.3);
   border-color: #c9a227;
}
@media (max-width: 968px) {
  .c-content {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    gap: 15px;
  }

  .c1 {
    grid-row: auto;
    grid-column: span 2;
  }
}

@media (max-width: 640px) {
  .c-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .c1 {
    grid-column: auto;
  }

  .shoe-text {
    font-size: 16px;
    top: 10px;
    left: 10px;
  }
}
@media (max-width: 320px) {

  .c-content {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .c1, .c2, .c3, .c4, .c5 {
    grid-column: auto !important;
    grid-row: auto !important;
  }

  .c-content img {
    height: 180px;
  }

  .shoe-text {
    font-size: 14px;
    top: 8px;
    left: 8px;
  }

  .category {
    padding: 20px 10px;
  }
}

@media (max-width: 426px) {
  /* Carousel adjustments */
  #carouselExampleIndicators {
    margin-bottom: 20px;
  }

  #carouselExampleIndicators img {
    height: 280px;
  }

  .carousel-control-prev,
  .carousel-control-next {
    width: 30px;
  }

  .carousel-indicators {
    bottom: 10px;
  }

  .carousel-indicators [data-bs-target] {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  /* Category section - single column mobile */
  .category {
    padding: 15px 10px;
    margin-bottom: 20px;
    background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
  }

  .c-content {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 10px;
    max-width: 100%;
    margin: 0 auto;
  }

  .c1, .c2, .c3, .c4, .c5 {
    grid-column: auto !important;
    grid-row: auto !important;
    position: relative;
  }

  .c-content img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    border: 1px solid rgba(201, 162, 39, 0.2);
  }

  .c-content img:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(201, 162, 39, 0.2);
  }

  .shoe-text {
    position: absolute;
    top: 10px;
    left: 10px;
    color: #c9a227;
    font-size: 14px;
    font-weight: bold;
    text-shadow: 1px 1px 4px rgba(0,0,0,0.9);
    z-index: 10;
    pointer-events: none;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  /* Exclusive section */
  .exclusive {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
    padding: 15px 0;
  }

  /* Container 2 (banner image) */
  .container2 {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 5px;
    padding: 10px 0;
  }

  .container2 img {
    margin: 0;
    width: 98%;
    height: 280px;
    image-rendering: auto;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    border: 1px solid rgba(201, 162, 39, 0.2);
  }

  .container2 img:hover {
    transform: scale(1.01);
    box-shadow: 0 6px 16px rgba(201, 162, 39, 0.2);
  }

  /* Registration section */
  .registration {
    margin: 15px 5px;
    border-radius: 10px;
    padding: 15px 0;
  }

  /* Prevent horizontal scroll */
  body {
    overflow-x: hidden;
  }
}

@media (max-width: 375px) {
  /* Extra small devices */
  #carouselExampleIndicators img {
    height: 240px;
  }

  .c-content img {
    height: 180px;
  }

  .shoe-text {
    font-size: 12px;
    top: 8px;
    left: 8px;
  }

  .container2 img {
    height: 240px;
  }
}

@media (max-width: 320px) {
  /* Ultra small devices */
  #carouselExampleIndicators img {
    height: 200px;
  }

  .category {
    padding: 10px 8px;
    margin-bottom: 15px;
  }

  .c-content {
    gap: 8px;
  }

  .c-content img {
    height: 160px;
  }

  .shoe-text {
    font-size: 11px;
    top: 6px;
    left: 6px;
  }

  .container2 {
    margin: 15px 2px;
    padding: 5px 0;
  }

  .container2 img {
    width: 99%;
    height: 200px;
    border-radius: 8px;
  }

  .registration {
    margin: 10px 2px;
    padding: 10px 0;
  }
}


</style>

