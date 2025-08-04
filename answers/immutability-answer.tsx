// IMMUTABILITY - CORRECT IMPLEMENTATIONS
// This file shows how to always create new objects/arrays instead of modifying existing ones

import React, { useState, useEffect } from 'react';

// ===== EASY - FIXED =====
// ✅ SOLUTION: Use immutable patterns for all state updates
// WHY: Prevents bugs, enables proper re-rendering, and makes state changes predictable
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build an app', completed: false }
  ]);

  const addTodo = (text: string) => {
    const newTodo = { id: Date.now(), text, completed: false };
    // ✅ Create new array instead of mutating
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    // ✅ Create new array with updated object
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed } // New object
          : todo // Keep existing object reference
      )
    );
  };

  const deleteTodo = (id: number) => {
    // ✅ Create new array without the deleted item
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    // ✅ Create new array with only incomplete todos
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  // Additional immutable operations
  const updateTodoText = (id: number, newText: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id
          ? { ...todo, text: newText } // Create new object with updated text
          : todo
      )
    );
  };

  const reorderTodos = (fromIndex: number, toIndex: number) => {
    setTodos(prevTodos => {
      // ✅ Create new array with reordered items
      const newTodos = [...prevTodos];
      const [movedTodo] = newTodos.splice(fromIndex, 1);
      newTodos.splice(toIndex, 0, movedTodo);
      return newTodos;
    });
  };

  return (
    <div>
      <input
        type="text"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
            addTodo(e.currentTarget.value.trim());
            e.currentTarget.value = '';
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
      <p>Total: {todos.length}, Completed: {todos.filter(t => t.completed).length}</p>
    </div>
  );
}

// ===== MEDIUM - FIXED =====
// ✅ SOLUTION: Handle nested object and array updates immutably
// WHY: Deep mutations are hard to track and can cause subtle bugs
interface CartItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

interface Discount {
  code: string;
  amount: number;
  appliedAt: Date;
}

interface CartState {
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    address: {
      street: string;
      city: string;
      zipCode: string;
    };
  };
  discounts: Discount[];
  metadata: {
    createdAt: Date;
    lastModified: Date;
    source: string;
    itemCount?: number;
  };
}

function ShoppingCart() {
  const [cart, setCart] = useState<CartState>({
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

  const addItem = (product: { id: string; name: string; price: number }) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(item => item.productId === product.id);
      
      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // ✅ Create new array with updated item
        newItems = prevCart.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item, // Keep existing properties
                quantity: item.quantity + 1,
                totalPrice: (item.quantity + 1) * item.unitPrice
              }
            : item // Keep existing item reference
        );
      } else {
        // ✅ Create new array with new item
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          quantity: 1,
          totalPrice: product.price
        };
        newItems = [...prevCart.items, newItem];
      }
      
      // ✅ Return new cart object with updated items and metadata
      return {
        ...prevCart,
        items: newItems,
        metadata: {
          ...prevCart.metadata,
          lastModified: new Date(),
          itemCount: newItems.length
        }
      };
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart => {
      let newItems: CartItem[];
      
      if (newQuantity <= 0) {
        // ✅ Create new array without the item
        newItems = prevCart.items.filter(item => item.productId !== productId);
      } else {
        // ✅ Create new array with updated item
        newItems = prevCart.items.map(item =>
          item.productId === productId
            ? {
                ...item,
                quantity: newQuantity,
                totalPrice: newQuantity * item.unitPrice
              }
            : item
        );
      }
      
      // ✅ Return new cart object
      return {
        ...prevCart,
        items: newItems,
        metadata: {
          ...prevCart.metadata,
          lastModified: new Date()
        }
      };
    });
  };

  const updateCustomerInfo = (field: string, value: string) => {
    setCart(prevCart => {
      if (field.includes('.')) {
        // ✅ Handle nested updates immutably
        const [parent, child] = field.split('.');
        return {
          ...prevCart,
          customer: {
            ...prevCart.customer,
            [parent]: {
              ...prevCart.customer[parent as keyof typeof prevCart.customer],
              [child]: value
            }
          },
          metadata: {
            ...prevCart.metadata,
            lastModified: new Date()
          }
        };
      } else {
        // ✅ Handle top-level customer updates
        return {
          ...prevCart,
          customer: {
            ...prevCart.customer,
            [field]: value
          },
          metadata: {
            ...prevCart.metadata,
            lastModified: new Date()
          }
        };
      }
    });
  };

  const applyDiscount = (discountCode: string, amount: number) => {
    setCart(prevCart => {
      const existingDiscountIndex = prevCart.discounts.findIndex(d => d.code === discountCode);
      
      let newDiscounts: Discount[];
      
      if (existingDiscountIndex >= 0) {
        // ✅ Update existing discount immutably
        newDiscounts = prevCart.discounts.map((discount, index) =>
          index === existingDiscountIndex
            ? { ...discount, amount }
            : discount
        );
      } else {
        // ✅ Add new discount immutably
        newDiscounts = [
          ...prevCart.discounts,
          {
            code: discountCode,
            amount: amount,
            appliedAt: new Date()
          }
        ];
      }
      
      return {
        ...prevCart,
        discounts: newDiscounts,
        metadata: {
          ...prevCart.metadata,
          lastModified: new Date()
        }
      };
    });
  };

  const removeDiscount = (discountCode: string) => {
    setCart(prevCart => ({
      ...prevCart,
      // ✅ Create new array without the discount
      discounts: prevCart.discounts.filter(d => d.code !== discountCode),
      metadata: {
        ...prevCart.metadata,
        lastModified: new Date()
      }
    }));
  };

  // Bulk operations using immutable patterns
  const clearCart = () => {
    setCart(prevCart => ({
      ...prevCart,
      items: [], // New empty array
      discounts: [], // New empty array
      metadata: {
        ...prevCart.metadata,
        lastModified: new Date()
      }
    }));
  };

  const duplicateItem = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.productId === productId);
      if (!existingItem) return prevCart;
      
      // ✅ Create new item with new ID but same properties
      const duplicatedItem: CartItem = {
        ...existingItem,
        productId: `${existingItem.productId}-copy-${Date.now()}`,
        totalPrice: existingItem.unitPrice // Reset to quantity 1
      };
      
      return {
        ...prevCart,
        items: [...prevCart.items, duplicatedItem],
        metadata: {
          ...prevCart.metadata,
          lastModified: new Date()
        }
      };
    });
  };

  // Calculate totals (these are derived values, so they're fine)
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
        <h3>Items ({cart.items.length})</h3>
        {cart.items.map(item => (
          <div key={item.productId}>
            <span>{item.name}</span>
            <span>${item.unitPrice}</span>
            <input
              type="number"
              min="0"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
            />
            <span>${item.totalPrice.toFixed(2)}</span>
            <button onClick={() => duplicateItem(item.productId)}>Duplicate</button>
          </div>
        ))}
        <button onClick={clearCart}>Clear Cart</button>
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
        <button onClick={() => applyDiscount('SAVE10', 10)}>Apply $10 Off</button>
      </div>

      {/* Totals */}
      <div>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Discounts: -${totalDiscount.toFixed(2)}</p>
        <p><strong>Total: ${total.toFixed(2)}</strong></p>
        <p><small>Last modified: {cart.metadata.lastModified.toLocaleTimeString()}</small></p>
      </div>
    </div>
  );
}

// ===== HARD - FIXED =====
// ✅ SOLUTION: Use immutable patterns for complex state with relationships
// WHY: Prevents data inconsistencies and makes state updates predictable
interface Task {
  id: string;
  title: string;
  projectId: string;
  assignedTo: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  reassignedAt?: Date;
}

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Derived data interfaces (computed from base state)
interface ProjectWithStats extends Project {
  tasks: Task[];
  assignedUsers: User[];
  statistics: {
    totalTasks: number;
    completedTasks: number;
    progress: number;
  };
}

interface UserWithTasks extends User {
  assignedTasks: Task[];
  projects: Project[];
}

function ProjectManager() {
  // ✅ Store only the base data - no derived properties
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // ✅ Compute derived data on every render (this is efficient with React)
  const projectsWithStats: ProjectWithStats[] = projects.map(project => {
    const projectTasks = tasks.filter(task => task.projectId === project.id);
    const assignedUserIds = [...new Set(projectTasks.map(task => task.assignedTo))];
    const assignedUsers = users.filter(user => assignedUserIds.includes(user.id));
    
    const completedTasks = projectTasks.filter(task => task.completed).length;
    const totalTasks = projectTasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    return {
      ...project,
      tasks: projectTasks,
      assignedUsers,
      statistics: {
        totalTasks,
        completedTasks,
        progress
      }
    };
  });

  const usersWithTasks: UserWithTasks[] = users.map(user => {
    const assignedTasks = tasks.filter(task => task.assignedTo === user.id);
    const userProjects = projects.filter(project =>
      tasks.some(task => task.projectId === project.id && task.assignedTo === user.id)
    );
    
    return {
      ...user,
      assignedTasks,
      projects: userProjects
    };
  });

  // Load initial data immutably
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [projectsData, usersData, tasksData] = await Promise.all([
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/users').then(r => r.json()),
        fetch('/api/tasks').then(r => r.json())
      ]);

      // ✅ Set state immutably - no mutations!
      setProjects(projectsData);
      setUsers(usersData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const createProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      ...projectData,
      createdAt: new Date()
    };

    // ✅ Add new project immutably
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    // ✅ Update project immutably
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              ...updates,
              updatedAt: new Date()
            }
          : project
      )
    );
  };

  const deleteProject = (projectId: string) => {
    // ✅ Remove project and its tasks immutably
    setProjects(prevProjects => 
      prevProjects.filter(project => project.id !== projectId)
    );
    setTasks(prevTasks => 
      prevTasks.filter(task => task.projectId !== projectId)
    );
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...taskData,
      createdAt: new Date(),
      completed: false
    };

    // ✅ Add new task immutably - no need to update related entities!
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    // ✅ Update task immutably
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, ...updates }
          : task
      )
    );
  };

  const toggleTaskCompletion = (taskId: string) => {
    // ✅ Toggle completion immutably
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined
            }
          : task
      )
    );
  };

  const assignTaskToUser = (taskId: string, userId: string) => {
    // ✅ Reassign task immutably
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              assignedTo: userId,
              reassignedAt: new Date()
            }
          : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    // ✅ Remove task immutably
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Bulk operations
  const createUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...userData
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const bulkUpdateTasks = (taskIds: string[], updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        taskIds.includes(task.id)
          ? { ...task, ...updates }
          : task
      )
    );
  };

  const duplicateProject = (projectId: string) => {
    const originalProject = projects.find(p => p.id === projectId);
    if (!originalProject) return;

    const newProjectId = `project-${Date.now()}`;
    const newProject: Project = {
      ...originalProject,
      id: newProjectId,
      name: `${originalProject.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: undefined
    };

    // Duplicate project tasks too
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const newTasks: Task[] = projectTasks.map(task => ({
      ...task,
      id: `task-${Date.now()}-${Math.random()}`,
      projectId: newProjectId,
      createdAt: new Date(),
      completedAt: undefined,
      completed: false
    }));

    // ✅ Add duplicated project and tasks immutably
    setProjects(prevProjects => [...prevProjects, newProject]);
    setTasks(prevTasks => [...prevTasks, ...newTasks]);
  };

  return (
    <div>
      <h1>Project Manager</h1>
      
      <div className="actions">
        <button onClick={() => createProject({ name: 'New Project' })}>
          Create Project
        </button>
        <button onClick={() => createUser({ name: 'New User', email: 'user@example.com' })}>
          Create User
        </button>
      </div>
      
      <div className="projects">
        <h2>Projects ({projectsWithStats.length})</h2>
        {projectsWithStats.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p>Progress: {project.statistics.progress.toFixed(1)}%</p>
            <p>Tasks: {project.statistics.completedTasks}/{project.statistics.totalTasks}</p>
            <p>Assigned Users: {project.assignedUsers.length}</p>
            <button onClick={() => duplicateProject(project.id)}>
              Duplicate
            </button>
            <button onClick={() => deleteProject(project.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="tasks">
        <h2>All Tasks ({tasks.length})</h2>
        <button onClick={() => createTask({
          title: 'New Task',
          projectId: projectsWithStats[0]?.id || '',
          assignedTo: usersWithTasks[0]?.id || ''
        })}>
          Add Task
        </button>
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <span>{task.title}</span>
            <select
              value={task.assignedTo}
              onChange={(e) => assignTaskToUser(task.id, e.target.value)}
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="users">
        <h2>Users ({usersWithTasks.length})</h2>
        {usersWithTasks.map(user => (
          <div key={user.id} className="user-card">
            <h4>{user.name}</h4>
            <p>Tasks: {user.assignedTasks.length}</p>
            <p>Projects: {user.projects.length}</p>
            <p>Completed: {user.assignedTasks.filter(t => t.completed).length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 
KEY PRINCIPLES DEMONSTRATED:

1. **Immutable State Updates**: Always create new objects/arrays instead of mutating
   - Use spread operator (...) for objects and arrays
   - Use map, filter, and other non-mutating methods
   - Never use push, pop, splice, or direct property assignment on state

2. **Nested Immutability**: Handle deep updates properly
   - Spread each level of nesting
   - Use functional approaches for complex updates
   - Consider libraries like Immer for very deep structures

3. **Separation of Base and Derived Data**: 
   - Store only essential data in state
   - Compute derived values during render
   - Avoid storing the same data in multiple places

4. **Predictable State Flow**: 
   - State updates are pure functions
   - No side effects in update logic
   - Easy to reason about and debug

5. **Performance Benefits**:
   - React can optimize re-renders with immutable data
   - Shallow comparison works correctly
   - Time-travel debugging becomes possible

IMMUTABILITY CHECKLIST:
✅ Never mutate state directly
✅ Always return new objects/arrays from state updates
✅ Use spreading for shallow copies
✅ Use map/filter/reduce instead of mutating methods
✅ Handle nested updates correctly
✅ Keep derived data separate from base state
✅ Use TypeScript to catch mutation attempts
✅ Consider Immer for complex nested updates

COMMON MUTATION MISTAKES TO AVOID:
- array.push/pop/shift/unshift/splice
- object.property = value on state objects
- sort/reverse on state arrays
- Modifying nested objects without spreading
- Using same object reference after "updating"
- Storing computed values in state that change with other state
*/