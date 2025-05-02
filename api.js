// API Base URL
const API_URL = 'http://localhost:3000/api';

// Class to handle API requests
class API {
  // Authentication
  static async register(userData) {
    return this.sendRequest(`${API_URL}/auth/register`, 'POST', userData);
  }

  static async login(credentials) {
    return this.sendRequest(`${API_URL}/auth/login`, 'POST', credentials);
  }

  static async getCurrentUser() {
    return this.sendRequest(`${API_URL}/auth/me`, 'GET');
  }

  // Tasks
  static async getTasks(queryParams = '') {
    const url = `${API_URL}/tasks${queryParams ? `?${queryParams}` : ''}`;
    return this.sendRequest(url, 'GET');
  }

  static async getTask(id) {
    return this.sendRequest(`${API_URL}/tasks/${id}`, 'GET');
  }

  static async createTask(taskData) {
    return this.sendRequest(`${API_URL}/tasks`, 'POST', taskData);
  }

  static async updateTask(id, taskData) {
    return this.sendRequest(`${API_URL}/tasks/${id}`, 'PUT', taskData);
  }

  static async deleteTask(id) {
    return this.sendRequest(`${API_URL}/tasks/${id}`, 'DELETE');
  }

  // Users (Admin only)
  static async getUsers() {
    return this.sendRequest(`${API_URL}/users`, 'GET');
  }

  static async getUser(id) {
    return this.sendRequest(`${API_URL}/users/${id}`, 'GET');
  }

  static async createUser(userData) {
    return this.sendRequest(`${API_URL}/users`, 'POST', userData);
  }

  static async updateUser(id, userData) {
    return this.sendRequest(`${API_URL}/users/${id}`, 'PUT', userData);
  }

  static async deleteUser(id) {
    return this.sendRequest(`${API_URL}/users/${id}`, 'DELETE');
  }

  // Helper method to send requests
  static async sendRequest(url, method, data = null) {
    try {
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const options = {
        method,
        headers,
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
}

// Export the API class
window.API = API;