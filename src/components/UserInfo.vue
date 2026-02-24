<script>
export default {
    name: 'UserInfo',
    data() {
        return {
            mode: 'login', // or 'register'
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            message: null,
            messageType: 'success' // 'success' or 'error'
        };
    },
    methods: {
        loadUsers() {
            try {
                const raw = localStorage.getItem('users');
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                return [];
            }
        },
        saveUsers(users) {
            localStorage.setItem('users', JSON.stringify(users));
        },
        setCurrentUser(user) {
            localStorage.setItem('currentUser', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
        },
        clearForm() {
            this.name = '';
            this.email = '';
            this.password = '';
            this.confirmPassword = '';
        },
        async register() {
            this.message = null;
            if (!this.name.trim()) { 
                this.message = 'Name is required'; 
                this.messageType = 'error';
                return; 
            }
            if (!this.email.trim()) { 
                this.message = 'Email is required'; 
                this.messageType = 'error';
                return; 
            }
            if (!this.password || this.password.length < 6) { 
                this.message = 'Password must be at least 6 characters'; 
                this.messageType = 'error';
                return; 
            }
            if (this.password !== this.confirmPassword) { 
                this.message = 'Passwords do not match'; 
                this.messageType = 'error';
                return; 
            }

            const users = this.loadUsers();
            const exists = users.find(u => u.email.toLowerCase() === this.email.toLowerCase());
            if (exists) { 
                this.message = 'An account with this email already exists'; 
                this.messageType = 'error';
                return; 
            }

            const hashed = await this.hashPassword(this.password);

            const newUser = {
                id: Date.now(),
                name: this.name.trim(),
                email: this.email.trim().toLowerCase(),
                password: hashed
            };
            users.push(newUser);
            this.saveUsers(users);
            this.setCurrentUser(newUser);
            window.dispatchEvent(new Event('user-changed'));
            this.clearForm();
            this.mode = 'login';
            this.message = 'Registration successful — you are now logged in';
            this.messageType = 'success';
            this.$router && this.$router.push('/');
        },
        async login() {
            this.message = null;
            if (!this.email.trim()) { 
                this.message = 'Email is required'; 
                this.messageType = 'error';
                return; 
            }
            if (!this.password) { 
                this.message = 'Password is required'; 
                this.messageType = 'error';
                return; 
            }

            const users = this.loadUsers();
            const user = users.find(u => u.email.toLowerCase() === this.email.trim().toLowerCase());
            if (!user) { 
                this.message = 'No account found for this email'; 
                this.messageType = 'error';
                return; 
            }

            const hashed = await this.hashPassword(this.password);
            if (user.password !== hashed) { 
                this.message = 'Incorrect password'; 
                this.messageType = 'error';
                return; 
            }

            this.setCurrentUser(user);
            window.dispatchEvent(new Event('user-changed'));
            this.clearForm();
            this.message = 'Login successful';
            this.messageType = 'success';
            this.$router && this.$router.push('/');
        },
        logout() {
            localStorage.removeItem('currentUser');
            this.message = 'Logged out';
            this.messageType = 'success';
        },
        switchMode(m) {
            this.mode = m;
            this.message = null;
            this.messageType = 'success';
            this.clearForm();
        }
        ,
        async hashPassword(pass) {
            try {
                const enc = new TextEncoder();
                const data = enc.encode(pass);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            } catch (e) {
                return btoa(pass);
            }
        }
    }
};
</script>

<template>
    <div class="page">
        <div class="formwrapper">
            <div class="card">
                <h2 v-if="mode === 'login'">Login</h2>
                <h2 v-else>Create Account</h2>

                <div class="message" v-if="message" :class="messageType">{{ message }}</div>

                <form v-if="mode === 'login'" @submit="login">
                    <div class="mb3">
                        <label for="email" class="form-label">Email</label>
                        <input id="email" type="email" v-model="email" class="form-control" required />
                    </div>
                    <div class="mb3">
                        <label for="password" class="form-label">Password</label>
                        <input id="password" type="password" v-model="password" class="form-control" required />
                    </div>
                    <div class="actions">
                        <button type="submit" class="btn btn-primary">Login</button>
                        <button type="button" class="btn btn-link" @click="switchMode('register')">Create account</button>
                    </div>
                </form>

                <form v-else @submit.prevent="register">
                    <div class="mb3">
                        <label for="name" class="form-label">Full name</label>
                        <input id="name" type="text" v-model="name" class="form-control" required />
                    </div>
                    <div class="mb3">
                        <label for="emailReg" class="form-label">Email</label>
                        <input id="emailReg" type="email" v-model="email" class="form-control" required />
                    </div>
                    <div class="mb3">
                        <label for="passwordReg" class="form-label">Password</label>
                        <input id="passwordReg" type="password" v-model="password" class="form-control" required />
                    </div>
                    <div class="mb3">
                        <label for="confirm" class="form-label">Confirm Password</label>
                        <input id="confirm" type="password" v-model="confirmPassword" class="form-control" required />
                    </div>
                    <div class="actions">
                        <button type="submit" class="btn btn-primary">Register</button>
                        <button type="button" class="btn btn-link" @click="switchMode('login')">Back to login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  margin: 5px;
  border-radius: 5px;
  background: linear-gradient(135deg, #faf8f5 0%, #f5f1eb 100%);
  padding: 40px 20px;
  color: white;
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
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mb-3 {
  margin-bottom: 0;
}

.form-label {
  display: block;
  color: #1a2a3a;
  font-weight: 600;
  margin-bottom: 6px;
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
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #b8860b;
  box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.15);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(90deg, #1a2a3a 0%, #2d3436 100%);
  color: white;
  width: 100%;
}

.btn-primary:hover {
  background: linear-gradient(90deg, #b8860b 0%, #d4a537 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(184, 134, 11, 0.3);
}

.btn-link {
  background: none;
  border: 2px solid #b8860b;
  color: #b8860b;
  width: 100%;
  padding: 8px 20px;
}

.btn-link:hover {
  background: rgba(184, 134, 11, 0.05);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .page {
    padding: 30px 16px;
  }

  .card {
    padding: 28px;
    max-width: 100%;
  }

  .card h2 {
    font-size: 22px;
    margin-bottom: 20px;
  }

  .message {
    font-size: 13px;
    padding: 10px 14px;
  }

  .form-label {
    font-size: 13px;
    margin-bottom: 6px;
  }

  .form-control {
    font-size: 14px;
    padding: 10px;
  }

  .btn {
    padding: 10px 18px;
    font-size: 13px;
  }

  .actions {
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 16px 12px;
    min-height: 100vh;
  }

  .card {
    padding: 24px;
    max-width: 100%;
  }

  .card h2 {
    font-size: 20px;
  }
}
</style>

