// IMMUTABILITY TEST
// Fix the code violations below - each example mutates data instead of creating new data
// GOAL: Always create new objects/arrays instead of modifying existing ones

import React, { useState, useEffect } from 'react';

// ===== EASY =====
// Problem: Directly mutating state arrays and objects
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build an app', completed: false }
  ]);

  const addTodo = (text) => {
    const newTodo = { id: Date.now(), text, completed: false };
    todos.push(newTodo); // Mutates original array!
    setTodos(todos);
  };

  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    todo.completed = !todo.completed; // Mutates original object!
    setTodos([...todos]); // Shallow copy doesn't help when objects are mutated
  };

  const deleteTodo = (id) => {
    const index = todos.findIndex(t => t.id === id);
    todos.splice(index, 1); // Mutates original array!
    setTodos(todos);
  };

  const clearCompleted = () => {
    for (let i = todos.length - 1; i >= 0; i--) {
      if (todos[i].completed) {
        todos.splice(i, 1); // Mutates original array!
      }
    }
    setTodos([...todos]);
  };

  return (
    <div>
      <input
        type="text"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && e.target.value.trim()) {
            addTodo(e.target.value.trim());
            e.target.value = '';
          }
        }}
        placeholder="Add a todo..."
      />
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      <button onClick={clearCompleted}>Clear Completed</button>
    </div>
  );
}

// ===== MEDIUM =====
// Problem: Mutating nested objects and arrays in complex state
function ShoppingCart() {
  const [cart, setCart] = useState({
    items: [],
    customer: {
      name: '',
      email: '',
      address: {
        street: '',
        city: '',
        zipCode: ''
      }
    },
    discounts: [],
    metadata: {
      createdAt: new Date(),
      lastModified: new Date(),
      source: 'web'
    }
  });

  const addItem = (product) => {
    const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Mutating nested object in array!
      cart.items[existingItemIndex].quantity += 1;
      cart.items[existingItemIndex].totalPrice = cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].unitPrice;
    } else {
      // Mutating array directly!
      cart.items.push({
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        quantity: 1,
        totalPrice: product.price
      });
    }
    
    // Mutating metadata!
    cart.metadata.lastModified = new Date();
    cart.metadata.itemCount = cart.items.length;
    
    setCart(cart); // Same reference, React might not re-render!
  };

  const updateQuantity = (productId, newQuantity) => {
    const item = cart.items.find(item => item.productId === productId);
    
    if (newQuantity <= 0) {
      // Mutating array!
      const index = cart.items.indexOf(item);
      cart.items.splice(index, 1);
    } else {
      // Mutating object properties!
      item.quantity = newQuantity;
      item.totalPrice = item.quantity * item.unitPrice;
    }
    
    // Mutating metadata!
    cart.metadata.lastModified = new Date();
    setCart(cart);
  };

  const updateCustomerInfo = (field, value) => {
    if (field.includes('.')) {
      // Handling nested updates with mutation
      const [parent, child] = field.split('.');
      cart.customer[parent][child] = value; // Mutating nested object!
    } else {
      cart.customer[field] = value; // Mutating object!
    }
    
    cart.metadata.lastModified = new Date(); // Mutating metadata!
    setCart(cart);
  };

  const applyDiscount = (discountCode, amount) => {
    const existingDiscount = cart.discounts.find(d => d.code === discountCode);
    
    if (existingDiscount) {
      existingDiscount.amount = amount; // Mutating existing discount!
    } else {
      cart.discounts.push({ // Mutating discounts array!
        code: discountCode,
        amount: amount,
        appliedAt: new Date()
      });
    }
    
    cart.metadata.lastModified = new Date(); // Mutating metadata!
    setCart(cart);
  };

  const removeDiscount = (discountCode) => {
    const index = cart.discounts.findIndex(d => d.code === discountCode);
    if (index >= 0) {
      cart.discounts.splice(index, 1); // Mutating array!
    }
    
    cart.metadata.lastModified = new Date(); // Mutating metadata!
    setCart(cart);
  };

  // Calculate totals (this part is actually fine)
  const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalDiscount = cart.discounts.reduce((sum, discount) => sum + discount.amount, 0);
  const total = subtotal - totalDiscount;

  return (
    <div>
      <h2>Shopping Cart</h2>
      
      {/* Customer Info */}
      <div>
        <h3>Customer Information</h3>
        <input
          type="text"
          placeholder="Name"
          value={cart.customer.name}
          onChange={(e) => updateCustomerInfo('name', e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={cart.customer.email}
          onChange={(e) => updateCustomerInfo('email', e.target.value)}
        />
        <input
          type="text"
          placeholder="Street"
          value={cart.customer.address.street}
          onChange={(e) => updateCustomerInfo('address.street', e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          value={cart.customer.address.city}
          onChange={(e) => updateCustomerInfo('address.city', e.target.value)}
        />
        <input
          type="text"
          placeholder="ZIP Code"
          value={cart.customer.address.zipCode}
          onChange={(e) => updateCustomerInfo('address.zipCode', e.target.value)}
        />
      </div>

      {/* Cart Items */}
      <div>
        <h3>Items</h3>
        {cart.items.map(item => (
          <div key={item.productId}>
            <span>{item.name}</span>
            <span>${item.unitPrice}</span>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
            />
            <span>${item.totalPrice.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Discounts */}
      <div>
        <h3>Discounts</h3>
        {cart.discounts.map(discount => (
          <div key={discount.code}>
            <span>{discount.code}: -${discount.amount}</span>
            <button onClick={() => removeDiscount(discount.code)}>Remove</button>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Discounts: -${totalDiscount.toFixed(2)}</p>
        <p><strong>Total: ${total.toFixed(2)}</strong></p>
      </div>
    </div>
  );
}

// ===== HARD =====
// Problem: Complex state management with deep mutations and side effects
function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const [projectsData, usersData, tasksData] = await Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/users').then(r => r.json()),
      fetch('/api/tasks').then(r => r.json())
    ]);

    // Mutating state directly instead of using setters!
    projects.push(...projectsData); // Mutating projects array!
    users.push(...usersData); // Mutating users array!
    tasks.push(...tasksData); // Mutating tasks array!

    // Process relationships with mutations
    projects.forEach(project => {
      project.tasks = tasks.filter(task => task.projectId === project.id); // Adding new property!
      project.assignedUsers = []; // Adding new property!
      project.statistics = { // Adding new property!
        totalTasks: 0,
        completedTasks: 0,
        progress: 0
      };
    });

    users.forEach(user => {
      user.assignedTasks = tasks.filter(task => task.assignedTo === user.id); // Adding new property!
      user.projects = []; // Adding new property!
    });

    // Update statistics with mutations
    updateAllStatistics();
    
    // Force re-render (bad practice!)
    setProjects([...projects]);
    setUsers([...users]);
    setTasks([...tasks]);
  };

  const updateAllStatistics = () => {
    projects.forEach(project => {
      project.statistics.totalTasks = project.tasks.length; // Mutating!
      project.statistics.completedTasks = project.tasks.filter(t => t.completed).length; // Mutating!
      project.statistics.progress = project.statistics.totalTasks > 0 
        ? (project.statistics.completedTasks / project.statistics.totalTasks) * 100 
        : 0; // Mutating!

      // Update assigned users list
      const assignedUserIds = [...new Set(project.tasks.map(task => task.assignedTo))];
      project.assignedUsers = users.filter(user => assignedUserIds.includes(user.id)); // Mutating!
    });

    users.forEach(user => {
      user.assignedTasks = tasks.filter(task => task.assignedTo === user.id); // Mutating!
      user.projects = projects.filter(project => 
        project.assignedUsers.some(assignedUser => assignedUser.id === user.id)
      ); // Mutating!
    });
  };

  const createProject = (projectData) => {
    const newProject = {
      id: Date.now(),
      ...projectData,
      createdAt: new Date(),
      tasks: [],
      assignedUsers: [],
      statistics: {
        totalTasks: 0,
        completedTasks: 0,
        progress: 0
      }
    };

    projects.push(newProject); // Mutating array!
    setProjects(projects); // Same reference!
  };

  const updateProject = (projectId, updates) => {
    const project = projects.find(p => p.id === projectId);
    
    // Mutating existing project object!
    Object.keys(updates).forEach(key => {
      project[key] = updates[key]; // Mutating properties!
    });
    
    project.updatedAt = new Date(); // Mutating!
    
    updateAllStatistics(); // This also mutates!
    setProjects(projects); // Same reference!
  };

  const createTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdAt: new Date(),
      completed: false
    };

    tasks.push(newTask); // Mutating tasks array!
    
    // Update project's tasks array
    const project = projects.find(p => p.id === taskData.projectId);
    project.tasks.push(newTask); // Mutating project's tasks!
    
    // Update assigned user's tasks
    const user = users.find(u => u.id === taskData.assignedTo);
    user.assignedTasks.push(newTask); // Mutating user's tasks!
    
    updateAllStatistics(); // More mutations!
    
    // Update all state
    setTasks(tasks);
    setProjects(projects);
    setUsers(users);
  };

  const toggleTaskCompletion = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    task.completed = !task.completed; // Mutating task!
    task.completedAt = task.completed ? new Date() : null; // Mutating task!

    // Update in project's tasks array
    const project = projects.find(p => p.id === task.projectId);
    const projectTask = project.tasks.find(t => t.id === taskId);
    projectTask.completed = task.completed; // Mutating project task!
    projectTask.completedAt = task.completedAt; // Mutating project task!

    // Update in user's tasks array
    const user = users.find(u => u.id === task.assignedTo);
    const userTask = user.assignedTasks.find(t => t.id === taskId);
    userTask.completed = task.completed; // Mutating user task!
    userTask.completedAt = task.completedAt; // Mutating user task!

    updateAllStatistics(); // More mutations!
    
    // Update all state
    setTasks(tasks);
    setProjects(projects);
    setUsers(users);
  };

  const assignTaskToUser = (taskId, userId) => {
    const task = tasks.find(t => t.id === taskId);
    const oldUserId = task.assignedTo;
    
    // Remove from old user
    if (oldUserId) {
      const oldUser = users.find(u => u.id === oldUserId);
      const taskIndex = oldUser.assignedTasks.findIndex(t => t.id === taskId);
      oldUser.assignedTasks.splice(taskIndex, 1); // Mutating old user's tasks!
    }
    
    // Update task
    task.assignedTo = userId; // Mutating task!
    task.reassignedAt = new Date(); // Mutating task!
    
    // Add to new user
    const newUser = users.find(u => u.id === userId);
    newUser.assignedTasks.push(task); // Mutating new user's tasks!
    
    // Update project task reference
    const project = projects.find(p => p.id === task.projectId);
    const projectTask = project.tasks.find(t => t.id === taskId);
    projectTask.assignedTo = userId; // Mutating project task!
    projectTask.reassignedAt = task.reassignedAt; // Mutating project task!
    
    updateAllStatistics(); // More mutations!
    
    // Update all state
    setTasks(tasks);
    setProjects(projects);
    setUsers(users);
  };

  const deleteTask = (taskId) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    const task = tasks[taskIndex];
    
    // Remove from main tasks array
    tasks.splice(taskIndex, 1); // Mutating main array!
    
    // Remove from project
    const project = projects.find(p => p.id === task.projectId);
    const projectTaskIndex = project.tasks.findIndex(t => t.id === taskId);
    project.tasks.splice(projectTaskIndex, 1); // Mutating project tasks!
    
    // Remove from user
    const user = users.find(u => u.id === task.assignedTo);
    const userTaskIndex = user.assignedTasks.findIndex(t => t.id === taskId);
    user.assignedTasks.splice(userTaskIndex, 1); // Mutating user tasks!
    
    updateAllStatistics(); // More mutations!
    
    // Update all state
    setTasks(tasks);
    setProjects(projects);
    setUsers(users);
  };

  return (
    <div>
      <h1>Project Manager</h1>
      
      <div className="projects">
        <h2>Projects</h2>
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p>Progress: {project.statistics.progress.toFixed(1)}%</p>
            <p>Tasks: {project.statistics.completedTasks}/{project.statistics.totalTasks}</p>
            <p>Assigned Users: {project.assignedUsers.length}</p>
          </div>
        ))}
      </div>

      <div className="tasks">
        <h2>All Tasks</h2>
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <span>{task.title}</span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}