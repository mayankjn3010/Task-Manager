// UI Class to handle UI-related functionality
class UI {
    constructor() {
      // Sections
      this.authSection = document.getElementById('authSection');
      this.dashboardSection = document.getElementById('dashboardSection');
      this.profileSection = document.getElementById('profileSection');
      this.adminSection = document.getElementById('adminSection');
      
      // Auth forms
      this.loginForm = document.getElementById('loginForm');
      this.registerForm = document.getElementById('registerForm');
      
      // Nav elements
      this.navLinks = document.getElementById('navLinks');
      this.userInfo = document.getElementById('userInfo');
      this.authButtons = document.getElementById('authButtons');
      this.adminLink = document.getElementById('adminLink');
      
      // Mobile menu
      this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
      
      // Bind event listeners
      this.bindEventListeners();
    }
  
    // Bind event listeners
    bindEventListeners() {
      // Auth form switching
      document.getElementById('showRegisterBtn').addEventListener('click', (e) => {
        e.preventDefault();
        this.showRegisterForm();
      });
      
      document.getElementById('showLoginBtn').addEventListener('click', (e) => {
        e.preventDefault();
        this.showLoginForm();
      });
      
      // Mobile menu toggle
      this.mobileMenuBtn.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
      
      // Navigation
      document.getElementById('dashboardLink').addEventListener('click', (e) => {
        e.preventDefault();
        this.showSection('dashboard');
      });
      
      document.getElementById('profileLink').addEventListener('click', (e) => {
        e.preventDefault();
        this.showSection('profile');
      });
      
      document.getElementById('adminLink').addEventListener('click', (e) => {
        e.preventDefault();
        this.showSection('admin');
      });
      
      // Tab navigation in admin section
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.switchTab(btn.dataset.tab);
        });
      });
      
      // Modal close buttons
      document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.closeAllModals();
        });
      });
      
      // Cancel buttons in modals
      document.getElementById('cancelTaskBtn').addEventListener('click', () => {
        this.closeModal('taskModal');
      });
      
      document.getElementById('cancelUserBtn').addEventListener('click', () => {
        this.closeModal('userModal');
      });
      
      document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        this.closeModal('confirmModal');
      });
    }
  
    // Initialize UI based on auth state
    initUI() {
      if (auth.isAuthenticated()) {
        this.updateUserInfo();
        this.showAuthenticatedUI();
        
        if (auth.isAdmin()) {
          this.showAdminUI();
        }
        
        this.showSection('dashboard');
      } else {
        this.showUnauthenticatedUI();
        this.showLoginForm();
      }
    }
  
    // Show register form
    showRegisterForm() {
      this.loginForm.classList.add('hidden');
      this.registerForm.classList.remove('hidden');
    }
  
    // Show login form
    showLoginForm() {
      this.registerForm.classList.add('hidden');
      this.loginForm.classList.remove('hidden');
    }
  
    // Toggle mobile menu
    toggleMobileMenu() {
      this.navLinks.classList.toggle('hidden');
    }
  
    // Show section (dashboard, profile, admin)
    showSection(section) {
      // Hide all sections
      this.dashboardSection.classList.add('hidden');
      this.profileSection.classList.add('hidden');
      this.adminSection.classList.add('hidden');
      this.authSection.classList.add('hidden');
      
      // Show selected section
      switch (section) {
        case 'dashboard':
          this.dashboardSection.classList.remove('hidden');
          this.setActiveNavLink('dashboardLink');
          break;
        case 'profile':
          this.profileSection.classList.remove('hidden');
          this.setActiveNavLink('profileLink');
          break;
        case 'admin':
          this.adminSection.classList.remove('hidden');
          this.setActiveNavLink('adminLink');
          break;
        case 'auth':
          this.authSection.classList.remove('hidden');
          break;
      }
      
      // Hide mobile menu after section change
      this.navLinks.classList.add('hidden');
    }
  
    // Set active nav link
    setActiveNavLink(linkId) {
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
      });
      
      document.getElementById(linkId).classList.add('active');
    }
  
    // Switch tab in admin section
    switchTab(tab) {
      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
      });
      
      // Show selected tab content
      document.getElementById(`${tab}Tab`).classList.remove('hidden');
      
      // Update active tab button
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
          btn.classList.add('active');
        }
      });
    }
  
    // Show authenticated UI
    showAuthenticatedUI() {
      this.authButtons.classList.add('hidden');
      this.navLinks.classList.remove('hidden');
      this.userInfo.classList.remove('hidden');
    }
  
    // Show unauthenticated UI
    showUnauthenticatedUI() {
      this.authButtons.classList.remove('hidden');
      this.navLinks.classList.add('hidden');
      this.userInfo.classList.add('hidden');
      this.adminLink.classList.add('hidden');
      this.showSection('auth');
    }
  
    // Show admin UI
    showAdminUI() {
      this.adminLink.classList.remove('hidden');
    }
  
    // Update user info in header
    updateUserInfo() {
      const user = auth.getUser();
      if (user) {
        document.getElementById('userName').textContent = user.name;
        
        const userRole = document.getElementById('userRole');
        userRole.textContent = user.role;
        userRole.className = `badge badge-${user.role}`;
        
        // Update profile section
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        
        const profileRole = document.getElementById('profileRole');
        profileRole.textContent = user.role;
        profileRole.className = `badge badge-${user.role}`;
      }
    }
  
    // Show modal
    openModal(modalId, title = null) {
      const modal = document.getElementById(modalId);
      modal.classList.add('active');
      
      if (title && modalId === 'taskModal') {
        document.getElementById('taskModalTitle').textContent = title;
      }
      
      if (title && modalId === 'userModal') {
        document.getElementById('userModalTitle').textContent = title;
      }
    }
  
    // Hide modal
    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      modal.classList.remove('active');
    }
  
    // Close all modals
    closeAllModals() {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
      });
    }
  
    // Show confirmation modal
    showConfirmation(message, callback) {
      document.getElementById('confirmMessage').textContent = message;
      
      // Remove old event listener
      const confirmBtn = document.getElementById('confirmDeleteBtn');
      const newConfirmBtn = confirmBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
      
      // Add new event listener
      newConfirmBtn.addEventListener('click', () => {
        callback();
        this.closeModal('confirmModal');
      });
      
      this.openModal('confirmModal');
    }
  
    // Show toast notification
    showToast(message, type = 'info') {
      const toastContainer = document.getElementById('toastContainer');
      
      // Create toast element
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      
      // Create toast content
      toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
      `;
      
      // Add to container
      toastContainer.appendChild(toast);
      
      // Add close event
      toast.querySelector('.toast-close').addEventListener('click', () => {
        this.removeToast(toast);
      });
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        this.removeToast(toast);
      }, 5000);
    }
  
    // Remove toast notification
    removeToast(toast) {
      if (toast.classList.contains('removing')) return;
      
      toast.classList.add('removing');
      
      // Remove after animation
      setTimeout(() => {
        toast.remove();
      }, 300);
    }
  
    // Format date
    formatDate(date) {
      return new Date(date).toLocaleString();
    }
  
    // Create task card
    createTaskCard(task) {
      const card = document.createElement('div');
      card.className = 'task-card';
      card.dataset.id = task._id;
      
      // Format tags
      const tagsHtml = task.tags.map(tag => `
        <span class="task-tag">${tag}</span>
      `).join('');
      
      // Format due date
      const dueDate = this.formatDate(task.dueDate);
      
      // Set HTML content
      card.innerHTML = `
        <div class="task-header">
          <div>
            <h3 class="task-title">${task.title}</h3>
            <div class="task-badges">
              <span class="badge badge-${task.priority}">${task.priority}</span>
              <span class="badge badge-${task.status}">${task.status}</span>
            </div>
          </div>
        </div>
        <div class="task-content">
          <p class="task-description">${task.description}</p>
          <div class="task-meta">
            <div class="task-meta-item">
              <i class="far fa-calendar-alt"></i>
              <span>Due: ${dueDate}</span>
            </div>
            ${task.user && task.user.name ? `
              <div class="task-meta-item">
                <i class="far fa-user"></i>
                <span>Assigned to: ${task.user.name}</span>
              </div>
            ` : ''}
          </div>
          ${task.tags.length > 0 ? `
            <div class="task-tags">
              ${tagsHtml}
            </div>
          ` : ''}
        </div>
        <div class="task-footer">
          <button class="btn btn-outline btn-edit" data-id="${task._id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-delete" data-id="${task._id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      return card;
    }
  
    // Create pagination
    createPagination(pagination, currentPage) {
      const paginationEl = document.getElementById('pagination');
      paginationEl.innerHTML = '';
      
      if (!pagination) return;
      
      // Previous button
      const prevBtn = document.createElement('button');
      prevBtn.className = `pagination-item ${!pagination.prev ? 'disabled' : ''}`;
      prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
      
      if (pagination.prev) {
        prevBtn.addEventListener('click', () => {
          taskManager.loadTasks(pagination.prev.page);
        });
      }
      
      paginationEl.appendChild(prevBtn);
      
      // Current page
      const currentPageBtn = document.createElement('button');
      currentPageBtn.className = 'pagination-item active';
      currentPageBtn.textContent = currentPage;
      paginationEl.appendChild(currentPageBtn);
      
      // Next button
      const nextBtn = document.createElement('button');
      nextBtn.className = `pagination-item ${!pagination.next ? 'disabled' : ''}`;
      nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
      
      if (pagination.next) {
        nextBtn.addEventListener('click', () => {
          taskManager.loadTasks(pagination.next.page);
        });
      }
      
      paginationEl.appendChild(nextBtn);
    }
  
    // Create empty state
    createEmptyState(container, message, icon = 'fa-tasks', action = null) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      
      emptyState.innerHTML = `
        <i class="fas ${icon}"></i>
        <h3>No items found</h3>
        <p>${message}</p>
        ${action ? `<button class="btn btn-primary">${action}</button>` : ''}
      `;
      
      if (action) {
        emptyState.querySelector('button').addEventListener('click', () => {
          if (action === 'Add Task') {
            taskManager.openAddTaskModal();
          } else if (action === 'Add User') {
            adminManager.openAddUserModal();
          }
        });
      }
      
      container.innerHTML = '';
      container.appendChild(emptyState);
    }
  }
  
  // Export and create global instance
  window.ui = new UI();