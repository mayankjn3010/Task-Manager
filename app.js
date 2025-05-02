// Main application file

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
  });
  
  // Initialize the application
  async function initializeApp() {
    // Initialize authentication
    const isAuthenticated = auth.init();
    
    // Initialize UI
    ui.initUI();
    
    // Handle login form submission
    document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleLogin();
    });
    
    // Handle register form submission
    document.getElementById('registerFormElement').addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleRegister();
    });
    
    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
    
    // Initialize main buttons
    document.getElementById('loginBtn').addEventListener('click', () => {
      ui.showSection('auth');
      ui.showLoginForm();
    });
    
    document.getElementById('registerBtn').addEventListener('click', () => {
      ui.showSection('auth');
      ui.showRegisterForm();
    });
    
    // If authenticated, load task manager and admin manager
    if (isAuthenticated) {
      await taskManager.init();
      
      if (auth.isAdmin()) {
        await adminManager.init();
      }
    }
  }
  
  // Handle login form submission
  async function handleLogin() {
    try {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      // Validate
      if (!email || !password) {
        ui.showToast('Please enter both email and password', 'error');
        return;
      }
      
      // Show loading
      document.getElementById('loginFormElement').querySelector('button').textContent = 'Logging in...';
      
      // Login
      await auth.login(email, password);
      
      // Update UI
      ui.showToast('Logged in successfully', 'success');
      ui.updateUserInfo();
      ui.showAuthenticatedUI();
      
      if (auth.isAdmin()) {
        ui.showAdminUI();
        await adminManager.init();
      }
      
      // Show dashboard and load tasks
      ui.showSection('dashboard');
      await taskManager.init();
      
    } catch (error) {
      ui.showToast(error.message, 'error');
    } finally {
      // Reset button
      document.getElementById('loginFormElement').querySelector('button').textContent = 'Login';
    }
  }
  
  // Handle register form submission
  async function handleRegister() {
    try {
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
      
      // Validate
      if (!name || !email || !password) {
        ui.showToast('Please fill in all fields', 'error');
        return;
      }
      
      if (password !== passwordConfirm) {
        ui.showToast('Passwords do not match', 'error');
        return;
      }
      
      // Show loading
      document.getElementById('registerFormElement').querySelector('button').textContent = 'Registering...';
      
      // Register
      await auth.register(name, email, password);
      
      // Update UI
      ui.showToast('Registered successfully', 'success');
      ui.updateUserInfo();
      ui.showAuthenticatedUI();
      
      // Show dashboard and load tasks
      ui.showSection('dashboard');
      await taskManager.init();
      
    } catch (error) {
      ui.showToast(error.message, 'error');
    } finally {
      // Reset button
      document.getElementById('registerFormElement').querySelector('button').textContent = 'Register';
    }
  }
  
  // Handle logout
  function handleLogout() {
    auth.logout();
    ui.showToast('Logged out successfully', 'info');
    ui.showUnauthenticatedUI();
  }