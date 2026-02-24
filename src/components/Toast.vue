<template>
  <transition name="toast-fade">
    <div v-if="show" class="toast-notification" :class="`toast-${type}`">
      <i :class="getIcon"></i>
      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',
  data() {
    return {
      show: false,
      message: '',
      type: 'success'
    };
  },
  computed: {
    getIcon() {
      if (this.type === 'success') return 'fa-solid fa-check-circle';
      if (this.type === 'error') return 'fa-solid fa-circle-exclamation';
      if (this.type === 'info') return 'fa-solid fa-info-circle';
      return 'fa-solid fa-circle';
    }
  },
  methods: {
    showToast(message, type = 'success', duration = 2000) {
      this.message = message;
      this.type = type;
      this.show = true;

      setTimeout(() => {
        this.show = false;
      }, duration);
    }
  }
};
</script>

<style scoped>
.toast-notification {
  position: fixed;
  top: 70px;
  right: 30px;
  padding: 12px 20px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  font-size: 14px;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

.toast-success {
  background-color: #4caf50;
  color: white;
}

.toast-error {
  background-color: #f44336;
  color: white;
}

.toast-info {
  background-color: #2196f3;
  color: white;
}

.toast-notification i {
  font-size: 16px;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

@media (max-width: 768px) {
  .toast-notification {
    top: 60px;
    right: 15px;
    left: 15px;
  }
}
</style>


