// Admin Manager class
class AdminManager {
    constructor() {
      // User form elements
      this.userForm = document.getElementById('userForm');
      this.userId = document.getElementById('userId');
      this.userName = document.getElementById('userName');
      this.userEmail = document.getElementById('userEmail');
      this.userPassword = document.getElementById('userPassword');
      this.userRole = document.getElementById('userRole');
      
      // User list element
      this.usersList = document.getElementById('usersList');
      
      // Admin tasks list
      this.adminTasksList = document.getElementById('adminTasksList');
      
      // Admin filter elements
      this.adminFilterStatus = document.getElementById('adminFilterStatus');
      this.adminFilterUser = document.getElementById('adminFilterUser');
      
      // Bind event listeners
      this.bindEventListeners();
    }
  
    // Bind event listeners
    bindEventListeners() {
      // Add user button
      document.getElementById('addUserBtn').addEventListener('click', () => {
        this.openAddUserModal();
      });
      
      // User form submission
      this.userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleUserFormSubmit();
      });
      
      // Admin filters
      this.adminFilterStatus.addEventListener('change', () => {
        this.loadAdminTasks();
      });
      
      this.adminFilterUser.addEventListener('change', () => {
        this.loadAdminTasks();
      });
    }
  
    // Initialize admin manager
    async init() {
      if (auth.isAdmin()) {
        await this.loadUsers();
        await this.loadAdminTasks();
        await this.loadUserOptions();
      }
    }
  
    // Load users from API
    async loadUsers() {
      try {
        this.usersList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Loading users...</p></div>';
        
        const result = await API.getUsers();
        
        if (result.data.length === 0) {
          ui.createEmptyState(this.usersList, 'No users found.', 'fa-users', 'Add User');
          return;
        }
        
        this.renderUsers(result.data);
        
      } catch (error) {
        ui.showToast(error.message, 'error');
        this.usersList.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Error</h3><p>Failed to load users.</p></div>';
      }
    }
  
    // Load user options for filter
    async loadUserOptions() {
      try {
        const result = await API.getUsers();
        const users = result.data;
        
        // Clear old options
        this.adminFilterUser.innerHTML = '<option value="">All Users</option>';
        
        // Add user options
        users.forEach(user => {
          const option = document.createElement('option');
          option.value = user._id;
          option.textContent = user.name;
          this.adminFilterUser.appendChild(option);
        });
        
      } catch (error) {
        console.error('Failed to load user options:', error);
      }
    }
  
    // Load tasks for admin view
    async loadAdminTasks() {
      try {
        this.adminTasksList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Loading all tasks...</p></div>';
        
        // Prepare filters
        const filters = {
          status: this.adminFilterStatus.value,
        };
        
        // Add user filter if selected
        if (this.adminFilterUser.value) {
          filters.user = this.adminFilterUser.value;
        }
        
        const result = await API.getTasks(1, 100, filters);
        
        if (result.data.length === 0) {
          ui.createEmptyState(this.adminTasksList, 'No tasks found matching the filters.', 'fa-tasks');
          return;
        }
        
        this.renderAdminTasks(result.data);
        
      } catch (error) {
        ui.showToast(error.message, 'error');
        this.adminTasksList.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Error</h3><p>Failed to load tasks.</p></div>';
      }
    }
  
    // Render users to DOM
    renderUsers(users) {
      // Create table
      const table = document.createElement('table');
      table.className = 'users-table';
      
      // Create table header
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      `;
      table.appendChild(thead);
      
      // Create table body
      const tbody = document.createElement('tbody');
      
      users.forEach(user => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td><span class="badge badge-${user.role}">${user.role}</span></td>
          <td class="user-actions">
            <button class="btn btn-outline btn-edit" data-id="${user._id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger btn-delete" data-id="${user._id}">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        `;
        
        tbody.appendChild(tr);
        
        // Add event listeners to buttons
        tr.querySelector('.btn-edit').addEventListener('click', () => {
          this.openEditUserModal(user);
        });
        
        tr.querySelector('.btn-delete').addEventListener('click', () => {
          this.confirmDeleteUser(user._id);
        });
      });
      
      table.appendChild(tbody);
      
      // Add table to DOM
      this.usersList.innerHTML = '';
      this.usersList.appendChild(table);
    }
  
    // Render admin tasks to DOM
    renderAdminTasks(tasks) {
      this.adminTasksList.innerHTML = '';
      
      tasks.forEach(task => {
        const taskCard = ui.createTaskCard(task);
        this.adminTasksList.appendChild(taskCard);
        
        // Add event listeners to task card buttons
        taskCard.querySelector('.btn-edit').addEventListener('click', () => {
          taskManager.openEditTaskModal(task);
        });
        
        taskCard.querySelector('.btn-delete').addEventListener('click', () => {
          taskManager.confirmDeleteTask(task._id);
        });
      });
    }
  
    // Open add user modal
    openAddUserModal() {
      // Reset form
      this.userForm.reset();
      this.userId.value = '';
      
      ui.openModal('userModal', 'Add New User');
    }
  
    // Open edit user modal
    openEditUserModal(user) {
      // Fill form with user data
      this.userId.value = user._id;
      this.userName.value = user.name;
      this.userEmail.value = user.email;
      this.userPassword.value = '';
      this.userRole.value = user.role;
      
      ui.openModal('userModal', 'Edit User');
    }
  
    // Confirm delete user
    confirmDeleteUser(userId) {
      ui.showConfirmation('Are you sure you want to delete this user?', () => {
        this.deleteUser(userId);
      });
    }
  
    // Handle user form submit
    async handleUserFormSubmit() {
      try {
        // Prepare user data
        const userId = this.userId.value;
        const userData = {
          name: this.userName.value,
          email: this.userEmail.value,
          role: this.userRole.value,
        };
        
        // Add password if provided
        if (this.userPassword.value) {
          userData.password = this.userPassword.value;
        }
        
        // Create or update user
        let result;
        if (userId) {
          result = await API.updateUser(userId, userData);
          ui.showToast('User updated successfully', 'success');
        } else {
          if (!userData.password) {
            ui.showToast('Password is required for new users', 'error');
            return;
          }
          result = await API.createUser(userData);
          ui.showToast('User created successfully', 'success');
        }
        
        // Close modal and reload users
        ui.closeModal('userModal');
        await this.loadUsers();
        await this.loadUserOptions();
        
      } catch (error) {
        ui.showToast(error.message, 'error');
      }
    }
  
    // Delete user
    async deleteUser(userId) {
      try {
        // Don't delete yourself!
        if (userId === auth.getUser().id) {
          ui.showToast('You cannot delete your own account', 'error');
          return;
        }
        
        await API.deleteUser(userId);
        ui.showToast('User deleted successfully', 'success');
        
        await this.loadUsers();
        await this.loadUserOptions();
        
      } catch (error) {
        ui.showToast(error.message, 'error');
      }
    }
  }
  
  // Export and create global instance
  window.adminManager = new AdminManager();