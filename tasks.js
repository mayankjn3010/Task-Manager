// Task Manager class
class TaskManager {
    constructor() {
      this.currentPage = 1;
      this.totalPages = 1;
      this.filters = {
        status: '',
        priority: '',
        dueDate: '',
        search: ''
      };
      
      // Task form elements
      this.taskForm = document.getElementById('taskForm');
      this.taskId = document.getElementById('taskId');
      this.taskTitle = document.getElementById('taskTitle');
      this.taskDescription = document.getElementById('taskDescription');
      this.taskStatus = document.getElementById('taskStatus');
      this.taskPriority = document.getElementById('taskPriority');
      this.taskDueDate = document.getElementById('taskDueDate');
      this.taskTags = document.getElementById('taskTags');
      
      // Task list element
      this.tasksList = document.getElementById('tasksList');
      
      // Filter elements
      this.searchInput = document.getElementById('searchInput');
      this.filterStatus = document.getElementById('filterStatus');
      this.filterPriority = document.getElementById('filterPriority');
      this.filterDueDate = document.getElementById('filterDueDate');
      
      // Pagination elements
      this.prevPageBtn = document.getElementById('prevPage');
      this.nextPageBtn = document.getElementById('nextPage');
      this.pageInfo = document.getElementById('pageInfo');
      
      // Bind event listeners
      this.bindEventListeners();
    }
  
    // Bind event listeners
    bindEventListeners() {
      // Add task button
      document.getElementById('addTaskBtn').addEventListener('click', () => {
        this.openAddTaskModal();
      });
      
      // Task form submission
      this.taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleTaskFormSubmit();
      });
      
      // Search input
      this.searchInput.addEventListener('input', () => {
        this.filters.search = this.searchInput.value;
        this.loadTasks(1);
      });
      
      // Filter select inputs
      this.filterStatus.addEventListener('change', () => {
        this.filters.status = this.filterStatus.value;
        this.loadTasks(1);
      });
      
      this.filterPriority.addEventListener('change', () => {
        this.filters.priority = this.filterPriority.value;
        this.loadTasks(1);
      });
      
      // Due date filter
      this.filterDueDate.addEventListener('change', () => {
        this.filters.dueDate = this.filterDueDate.value;
        this.loadTasks(1);
      });
      
      // Pagination buttons
      this.prevPageBtn.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.loadTasks(this.currentPage - 1);
        }
      });
      
      this.nextPageBtn.addEventListener('click', () => {
        if (this.currentPage < this.totalPages) {
          this.loadTasks(this.currentPage + 1);
        }
      });
      
      // Set min date for due date input to today
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      this.taskDueDate.min = `${formattedDate}T00:00`;
    }
  
    // Initialize task manager
    async init() {
      await this.loadTasks();
      await this.loadTaskStats();
    }
  
    // Load tasks with filters and pagination
    async loadTasks(page = 1) {
      try {
        this.currentPage = page;
        
        // Build query parameters
        const queryParams = new URLSearchParams({
          page: this.currentPage,
          limit: 10
        });
        
        // Add filters if they exist
        if (this.filters.status) queryParams.append('status', this.filters.status);
        if (this.filters.priority) queryParams.append('priority', this.filters.priority);
        if (this.filters.dueDate) queryParams.append('dueDate', this.filters.dueDate);
        if (this.filters.search) queryParams.append('search', this.filters.search);
        
        const response = await API.getTasks(queryParams.toString());
        const { data: tasks, pagination } = response;
        
        // Update pagination state
        this.totalPages = Math.ceil(pagination.total / pagination.limit);
        this.updatePaginationUI();
        
        // Render tasks
        this.renderTasks(tasks);
        
      } catch (error) {
        ui.showToast(error.message, 'error');
      }
    }
  
    // Update pagination UI
    updatePaginationUI() {
      // Update page info
      this.pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
      
      // Update button states
      this.prevPageBtn.disabled = this.currentPage === 1;
      this.nextPageBtn.disabled = this.currentPage === this.totalPages;
    }
  
    // Load task statistics
    async loadTaskStats() {
      try {
        const result = await API.getTasks(1, 10000);
        const tasks = result.data;
        
        // Count tasks by status
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
        
        // Update DOM
        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('inProgressTasks').textContent = inProgressTasks;
        
      } catch (error) {
        console.error('Failed to load task stats:', error);
      }
    }
  
    // Render tasks to DOM
    renderTasks(tasks) {
      this.tasksList.innerHTML = '';
      
      tasks.forEach(task => {
        const taskCard = ui.createTaskCard(task);
        this.tasksList.appendChild(taskCard);
        
        // Add event listeners to task card buttons
        taskCard.querySelector('.btn-edit').addEventListener('click', () => {
          this.openEditTaskModal(task);
        });
        
        taskCard.querySelector('.btn-delete').addEventListener('click', () => {
          this.confirmDeleteTask(task._id);
        });
      });
    }
  
    // Open add task modal
    openAddTaskModal() {
      // Reset form
      this.taskForm.reset();
      this.taskId.value = '';
      
      // Set default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.taskDueDate.value = tomorrow.toISOString().slice(0, 16);
      
      ui.openModal('taskModal', 'Add New Task');
    }
  
    // Open edit task modal
    openEditTaskModal(task) {
      // Fill form with task data
      this.taskId.value = task._id;
      this.taskTitle.value = task.title;
      this.taskDescription.value = task.description;
      this.taskStatus.value = task.status;
      this.taskPriority.value = task.priority;
      
      // Format due date for input
      const dueDate = new Date(task.dueDate);
      this.taskDueDate.value = dueDate.toISOString().slice(0, 16);
      
      // Join tags with comma
      this.taskTags.value = task.tags.join(', ');
      
      ui.openModal('taskModal', 'Edit Task');
    }
  
    // Confirm delete task
    confirmDeleteTask(taskId) {
      ui.showConfirmation('Are you sure you want to delete this task?', () => {
        this.deleteTask(taskId);
      });
    }
  
    // Handle task form submit
    async handleTaskFormSubmit() {
      try {
        // Prepare task data
        const taskId = this.taskId.value;
        const taskData = {
          title: this.taskTitle.value,
          description: this.taskDescription.value,
          status: this.taskStatus.value,
          priority: this.taskPriority.value,
          dueDate: new Date(this.taskDueDate.value).toISOString(),
          tags: this.taskTags.value.split(',').map(tag => tag.trim()).filter(tag => tag),
        };
        
        // Create or update task
        let result;
        if (taskId) {
          result = await API.updateTask(taskId, taskData);
          ui.showToast('Task updated successfully', 'success');
        } else {
          result = await API.createTask(taskData);
          ui.showToast('Task created successfully', 'success');
        }
        
        // Close modal and reload tasks
        ui.closeModal('taskModal');
        await this.loadTasks(this.currentPage);
        await this.loadTaskStats();
        
      } catch (error) {
        ui.showToast(error.message, 'error');
      }
    }
  
    // Delete task
    async deleteTask(taskId) {
      try {
        await API.deleteTask(taskId);
        ui.showToast('Task deleted successfully', 'success');
        
        await this.loadTasks(this.currentPage);
        await this.loadTaskStats();
        
      } catch (error) {
        ui.showToast(error.message, 'error');
      }
    }
  }
  
  // Export and create global instance
  window.taskManager = new TaskManager();