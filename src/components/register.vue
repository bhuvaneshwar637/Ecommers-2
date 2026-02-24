<script>
export default {
  name: "reg",

  data() {
    return {
      name: "",
      email: "",
      phone: "",
      message: ""
    };
  },

  methods: {
    handleRegister() {
      if (!this.name || !this.email || !this.phone) {
        this.message = "Please fill all fields";
        return;
      }

      this.message = "You are successfully registered for the upcoming sale! 🎉";

      this.name = "";
      this.email = "";
      this.phone = "";
    }
  }
};
</script>

<template>
  <div class="page">
    <div class="formwrapper">
      <div class="card">
        <h2>Register for Upcoming Sale</h2>

        <p v-if="message" class="message success">
          {{ message }}
        </p>

        <form @submit.prevent="handleRegister">
          <div class="mb3">
            <label for="name" class="form-label">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter Your Name"
              v-model="name"
              class="form-control"
              required
            />
          </div>

          <div class="mb3">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter Your Email"
              v-model="email"
              class="form-control"
              required
            />
          </div>

          <div class="mb3">
            <label for="phone" class="form-label">Phone</label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter Your Phone"
              v-model="phone"
              class="form-control"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary">
            Register Now
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: auto;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f1eb 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.formwrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.card {
  background: #ffffff;
  padding: 40px 50px;
  border-radius: 12px;
  box-shadow: 0 8px 35px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  color: #2d3436;
  border: 2px solid #b8860b;
}

.card h2 {
  color: #b8860b;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.message {
  margin-bottom: 16px;
  color: #ffffff;
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  text-align: center;
  font-weight: 600;
}

.message.error {
  background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
  color: white;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mb3 {
  margin-bottom: 0;
}

.mb3 label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #1a2a3a;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e8e4df;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #faf8f5;
  color: #2d3436;
}

.form-control::placeholder {
  color: #999;
}

.form-control:focus {
  outline: none;
  border-color: #b8860b;
  box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.15);
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.btn-primary {
  background: linear-gradient(90deg, #1a2a3a 0%, #2d3436 100%);
  color: #ffffff;
  width: 100%;
}

.btn-primary:hover {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(184, 134, 11, 0.3);
}

@media (max-width: 480px) {
  .card {
    max-width: 100%;
    padding: 24px;
  }

  .card h2 {
    font-size: 20px;
  }
}
</style>


