# e-Comers 2

A simple e-commerce web application built with **Vue 3** and **Vite**. This project demonstrates a product catalog, shopping cart, user registration, wishlist, and responsive product pages. It uses Vue 3 `<script setup>` SFCs, Pinia stores for state management, and Vue Router for navigation.

## 🚀 Features

- Product listing and detail pages
- Add/remove items to cart and wishlist
- User registration and profile pages
- Sale and exclusive product views
- Responsive design with CSS and image assets
- State management using Pinia stores (`cartStore.js`, `wishlistStore.js`)
- Routing defined in `src/routers/index.js`

## 🛠️ Project Structure

```
├── public/                Static assets
├── src/
│   ├── assets/            Images and media
│   ├── components/        Vue components for UI
│   ├── routers/           Vue Router configuration
│   ├── store/             Pinia stores for application state
│   ├── App.vue            Root component
│   ├── main.js            Entry point
│   └── style.css          Global styles
├── index.html             App shell
├── package.json           Dependencies and scripts
└── vite.config.js         Vite configuration
```

## 📦 Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Development server**

```bash
npm run dev
```

Open http://localhost:3000 in your browser to see the app.

3. **Build for production**

```bash
npm run build
```

4. **Preview the production build**

```bash
npm run preview
```

## 📝 Scripts

- `dev` - run the development server
- `build` - create a production build
- `preview` - preview the build locally

## 💡 Notes

- The store files (`cartStore.js`, `wishlistStore.js`) use Pinia for reactivity.
- Components are organized under `src/components`; each corresponds to a view or UI piece.
- You can customize routes in `src/routers/index.js`.

## 📚 Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)

---

Developed by the e-Comers team. Feel free to fork and adapt!
