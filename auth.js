// Auth class to handle authentication
class Auth {
    constructor() {
      this.token = localStorage.getItem('token');
      this.user = JSON.parse(localStorage.getItem('user')) || null;
    }
  
    // Initialize authentication state
    init() {
      if (this.token && this.user) {
        this.refreshUserData();
        return true;
      }
      return false;
    }
  
    // Register a new user
    async register(name, email, password) {
      try {
        const result = await API.register({ name, email, password });
        this.setSession(result.token, result.user);
        return result;
      } catch (error) {
        throw error;
      }
    }
  
    // Login user
    async login(email, password) {
      try {
        const result = await API.login({ email, password });
        this.setSession(result.token, result.user);
        return result;
      } catch (error) {
        throw error;
      }
    }
  
    // Refresh user data from server
    async refreshUserData() {
      try {
        const result = await API.getCurrentUser();
        this.user = result.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        return this.user;
      } catch (error) {
        // If there's an error (like token expired), logout
        this.logout();
        throw error;
      }
    }
  
    // Set session data
    setSession(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  
    // Logout user
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  
    // Check if user is authenticated
    isAuthenticated() {
      return !!this.token;
    }
  
    // Check if user has admin role
    isAdmin() {
      return this.user && this.user.role === 'admin';
    }
  
    // Get user data
    getUser() {
      return this.user;
    }
  
    // Get token
    getToken() {
      return this.token;
    }
  }
  
  // Export and create global instance
  window.auth = new Auth();