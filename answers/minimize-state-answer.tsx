// MINIMIZE STATE SURFACE AREA - CORRECT IMPLEMENTATIONS
// This file shows how to store only the minimum data needed and derive everything else

import React, { useState, useEffect, useMemo } from 'react';

// ===== EASY - FIXED =====
// ✅ SOLUTION: Store only essential data, derive everything else
// WHY: Reduces bugs, eliminates sync issues, and makes state predictable
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  badges: string[];
  createdAt: string;
  lastLoginDate?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
}

function UserDashboard() {
  // ✅ Store ONLY the essential data that can't be derived
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Derive ALL display values from base state
  const derivedData = useMemo(() => {
    if (!user) {
      return {
        userName: 'Loading...',
        userInitials: '??',
        isActiveUser: false,
        postCount: 0,
        hasRecentPosts: false,
        averagePostLength: 0,
        memberSince: 'Unknown'
      };
    }

    // Derive user information
    const userName = `${user.firstName} ${user.lastName}`.trim();
    const userInitials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;
    
    // Derive user activity status
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const isActiveUser = user.lastLoginDate 
      ? new Date(user.lastLoginDate) > thirtyDaysAgo 
      : false;
    
    // Derive member since date
    let memberSince = 'Unknown';
    try {
      const date = new Date(user.createdAt);
      if (!isNaN(date.getTime())) {
        memberSince = date.toLocaleDateString();
      }
    } catch (error) {
      console.warn('Invalid createdAt date:', user.createdAt);
    }

    // Derive post statistics
    const postCount = posts.length;
    
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const hasRecentPosts = posts.some(post => 
      new Date(post.createdAt) > sevenDaysAgo
    );
    
    const totalLength = posts.reduce((sum, post) => sum + post.content.length, 0);
    const averagePostLength = postCount > 0 ? totalLength / postCount : 0;

    return {
      userName,
      userInitials,
      isActiveUser,
      postCount,
      hasRecentPosts,
      averagePostLength,
      memberSince
    };
  }, [user, posts]); // Only recalculate when base data changes

  const loadUserData = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const [userResponse, postsResponse] = await Promise.all([
        fetch(`/api/users/${userId}`),
        fetch(`/api/users/${userId}/posts`)
      ]);
      
      if (!userResponse.ok) {
        throw new Error('Failed to load user data');
      }
      
      if (!postsResponse.ok) {
        throw new Error('Failed to load posts');
      }

      const userData = await userResponse.json();
      const postsData = await postsResponse.json();
      
      // ✅ Set only the base data - no derived values!
      setUser(userData);
      setPosts(postsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  // Additional derived computations for display
  const recentPosts = useMemo(() => 
    posts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  , [posts]);

  const postsByMonth = useMemo(() => {
    return posts.reduce((acc, post) => {
      const month = new Date(post.createdAt).toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [posts]);

  if (isLoading) {
    return <div className="loading">Loading user dashboard...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => loadUserData('current-user')}>Retry</button>
      </div>
    );
  }

  if (!user) {
    return <div className="no-user">No user data available.</div>;
  }

  return (
    <div className="user-dashboard">
      <div className="user-header">
        <div className="user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={`${derivedData.userName}'s avatar`} />
          ) : (
            <div className="avatar-placeholder">
              {derivedData.userInitials}
            </div>
          )}
        </div>
        <div className="user-info">
          <h1>{derivedData.userName}</h1>
          <p className={`status ${derivedData.isActiveUser ? 'active' : 'inactive'}`}>
            {derivedData.isActiveUser ? 'Active User' : 'Inactive User'}
          </p>
          <p>Member since: {derivedData.memberSince}</p>
          {user.email && <p>Email: {user.email}</p>}
          {user.phone && <p>Phone: {user.phone}</p>}
        </div>
      </div>
      
      <div className="user-stats">
        <div className="stat">
          <span className="stat-label">Posts</span>
          <span className="stat-value">{derivedData.postCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Avg Length</span>
          <span className="stat-value">{Math.round(derivedData.averagePostLength)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Recent Activity</span>
          <span className="stat-value">{derivedData.hasRecentPosts ? 'Yes' : 'No'}</span>
        </div>
      </div>

      {user.badges.length > 0 && (
        <div className="badges">
          <h3>Badges:</h3>
          {user.badges.map((badge, index) => (
            <span key={`${badge}-${index}`} className="badge">
              {badge}
            </span>
          ))}
        </div>
      )}
      
      <div className="user-posts">
        <h2>Recent Posts ({recentPosts.length})</h2>
        {recentPosts.map(post => (
          <article key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </article>
        ))}
      </div>

      <div className="posts-by-month">
        <h3>Posts by Month</h3>
        {Object.entries(postsByMonth).map(([month, count]) => (
          <div key={month}>
            <span>{month}: {count} posts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== MEDIUM - FIXED =====
// ✅ SOLUTION: Store only core data, compute everything else on-demand
// WHY: Eliminates complex useEffect chains and circular dependencies
interface CartItem {
  id: string;
  name: string;
  price: number;
  weight: number;
  quantity: number;
  category: string;
  fragile: boolean;
  specialHandling: boolean;
  ageRestricted: boolean;
  available: boolean;
  taxable: boolean;
}

function ShoppingCart() {
  // ✅ Store ONLY the essential state
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>('standard');

  // ✅ Derive ALL calculations in a single useMemo
  const cartCalculations = useMemo(() => {
    // Basic item statistics
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueItemCount = items.length;
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    const averageItemPrice = itemCount > 0 ? subtotal / itemCount : 0;
    
    // Item analysis
    const prices = items.map(item => item.price);
    const mostExpensiveItem = items.find(item => item.price === Math.max(...prices)) || null;
    const cheapestItem = items.find(item => item.price === Math.min(...prices)) || null;
    
    // Item flags
    const hasElectronics = items.some(item => item.category === 'electronics');
    const hasFragileItems = items.some(item => item.fragile);
    const requiresSpecialHandling = items.some(item => item.specialHandling);
    const needsAgeVerification = items.some(item => item.ageRestricted);
    const hasInvalidItems = items.some(item => !item.available);
    const isOverWeightLimit = totalWeight > 50;
    
    // Discount calculations
    let discountAmount = 0;
    let discountPercentage = 0;
    
    if (couponCode === 'SAVE10') {
      discountPercentage = 10;
      discountAmount = subtotal * 0.1;
    } else if (couponCode === 'SAVE20') {
      discountPercentage = 20;
      discountAmount = subtotal * 0.2;
    } else if (couponCode === 'FLAT50') {
      discountAmount = Math.min(50, subtotal);
    }
    
    // Shipping calculations
    let shippingCost = 0;
    let estimatedDelivery = '';
    let canUseExpressShipping = true;
    
    if (shippingMethod === 'standard') {
      shippingCost = totalWeight > 10 ? 15 : 10;
      estimatedDelivery = '5-7 business days';
    } else if (shippingMethod === 'express') {
      shippingCost = totalWeight > 10 ? 25 : 20;
      estimatedDelivery = '2-3 business days';
      canUseExpressShipping = !hasFragileItems && totalWeight <= 30;
    } else if (shippingMethod === 'overnight') {
      shippingCost = totalWeight > 10 ? 40 : 35;
      estimatedDelivery = '1 business day';
      canUseExpressShipping = !hasFragileItems && !requiresSpecialHandling && totalWeight <= 20;
    }
    
    const freeShippingEligible = subtotal > 100;
    const finalShippingCost = freeShippingEligible ? 0 : shippingCost;
    
    // Tax calculations
    const taxableAmount = items
      .filter(item => item.taxable)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = taxableAmount * 0.08;
    
    // Final total
    const finalTotal = subtotal - discountAmount + taxAmount + finalShippingCost;
    
    // Status flags
    const isEmpty = items.length === 0;
    
    return {
      // Basic stats
      itemCount,
      uniqueItemCount,
      subtotal,
      totalWeight,
      averageItemPrice,
      mostExpensiveItem,
      cheapestItem,
      
      // Item flags
      hasElectronics,
      hasFragileItems,
      requiresSpecialHandling,
      needsAgeVerification,
      hasInvalidItems,
      isOverWeightLimit,
      
      // Discounts
      discountAmount,
      discountPercentage,
      
      // Shipping
      shippingCost: finalShippingCost,
      originalShippingCost: shippingCost,
      estimatedDelivery,
      canUseExpressShipping,
      freeShippingEligible,
      
      // Taxes and totals
      taxableAmount,
      taxAmount,
      finalTotal,
      
      // Status
      isEmpty
    };
  }, [items, couponCode, shippingMethod]);

  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Helper to get available shipping methods based on cart contents
  const availableShippingMethods = useMemo(() => {
    const methods = [
      { value: 'standard' as const, label: 'Standard', available: true }
    ];
    
    if (cartCalculations.canUseExpressShipping) {
      methods.push(
        { value: 'express' as const, label: 'Express', available: true },
        { value: 'overnight' as const, label: 'Overnight', available: true }
      );
    } else {
      methods.push(
        { value: 'express' as const, label: 'Express (unavailable)', available: false },
        { value: 'overnight' as const, label: 'Overnight (unavailable)', available: false }
      );
    }
    
    return methods;
  }, [cartCalculations.canUseExpressShipping]);

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      
      {cartCalculations.isEmpty ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => addItem({
            id: 'sample-1',
            name: 'Sample Product',
            price: 29.99,
            weight: 1.5,
            category: 'electronics',
            fragile: false,
            specialHandling: false,
            ageRestricted: false,
            available: true,
            taxable: true
          })}>
            Add Sample Product
          </button>
        </div>
      ) : (
        <>
          <div className="cart-summary">
            <p>Items: {cartCalculations.itemCount} ({cartCalculations.uniqueItemCount} unique)</p>
            <p>Weight: {cartCalculations.totalWeight.toFixed(1)} lbs</p>
            <p>Average Price: ${cartCalculations.averageItemPrice.toFixed(2)}</p>
            {cartCalculations.mostExpensiveItem && (
              <p>Most Expensive: {cartCalculations.mostExpensiveItem.name}</p>
            )}
            {cartCalculations.cheapestItem && (
              <p>Cheapest: {cartCalculations.cheapestItem.name}</p>
            )}
          </div>
          
          <div className="cart-flags">
            {cartCalculations.hasElectronics && <span className="flag">Electronics</span>}
            {cartCalculations.hasFragileItems && <span className="flag">Fragile</span>}
            {cartCalculations.requiresSpecialHandling && <span className="flag">Special Handling</span>}
            {cartCalculations.needsAgeVerification && <span className="flag">Age Verification Required</span>}
            {cartCalculations.isOverWeightLimit && <span className="flag warning">Over Weight Limit</span>}
            {cartCalculations.hasInvalidItems && <span className="flag error">Invalid Items</span>}
          </div>
          
          <div className="cart-items">
            <h3>Items</h3>
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <span className="item-name">{item.name}</span>
                <span className="item-price">${item.price}</span>
                <input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                  className="quantity-input"
                />
                <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            ))}
            <button onClick={clearCart} className="clear-cart">Clear Cart</button>
          </div>
          
          <div className="coupon-section">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            {cartCalculations.discountAmount > 0 && (
              <p className="discount-applied">
                Discount: {cartCalculations.discountPercentage > 0 ? `${cartCalculations.discountPercentage}%` : 'Fixed'} 
                (-${cartCalculations.discountAmount.toFixed(2)})
              </p>
            )}
          </div>
          
          <div className="shipping-section">
            <label htmlFor="shipping-method">Shipping Method:</label>
            <select 
              id="shipping-method"
              value={shippingMethod} 
              onChange={(e) => setShippingMethod(e.target.value as typeof shippingMethod)}
            >
              {availableShippingMethods.map(method => (
                <option 
                  key={method.value} 
                  value={method.value} 
                  disabled={!method.available}
                >
                  {method.label} - ${cartCalculations.originalShippingCost}
                </option>
              ))}
            </select>
            <p>Estimated Delivery: {cartCalculations.estimatedDelivery}</p>
            {cartCalculations.freeShippingEligible && (
              <p className="free-shipping">Free shipping applied!</p>
            )}
          </div>
          
          <div className="cart-totals">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>${cartCalculations.subtotal.toFixed(2)}</span>
            </div>
            {cartCalculations.discountAmount > 0 && (
              <div className="total-line discount">
                <span>Discount:</span>
                <span>-${cartCalculations.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="total-line">
              <span>Tax:</span>
              <span>${cartCalculations.taxAmount.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Shipping:</span>
              <span>${cartCalculations.shippingCost.toFixed(2)}</span>
            </div>
            <div className="total-line final">
              <span><strong>Total:</strong></span>
              <span><strong>${cartCalculations.finalTotal.toFixed(2)}</strong></span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ===== HARD - FIXED =====
// ✅ SOLUTION: Store only base entities, compute all relationships and statistics
// WHY: Eliminates data duplication and ensures consistency
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  startDate: string;
  completedAt?: string;
  ownerId: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'developer' | 'designer';
  lastActive?: string;
  avatar?: string;
}

function ProjectManagementSystem() {
  // ✅ Store ONLY the base entities - no derived data
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('user-1');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Derive ALL statistics and relationships in one place
  const analytics = useMemo(() => {
    // Project statistics
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const overdueProjects = projects.filter(p => 
      p.dueDate && 
      new Date(p.dueDate) < new Date() && 
      p.status !== 'completed'
    ).length;
    const projectsCompletionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
    
    // Task statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const overdueTasks = tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < new Date() && 
      t.status !== 'completed'
    ).length;
    const tasksCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // User statistics
    const totalUsers = users.length;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = users.filter(u => 
      u.lastActive && new Date(u.lastActive) > sevenDaysAgo
    ).length;
    
    // Projects with computed data
    const projectsWithData = projects.map(project => {
      const projectTasks = tasks.filter(t => t.projectId === project.id);
      const assignedUserIds = [...new Set(projectTasks.map(t => t.assignedTo))];
      const assignedUsers = users.filter(u => assignedUserIds.includes(u.id));
      
      const completedProjectTasks = projectTasks.filter(t => t.status === 'completed').length;
      const totalProjectTasks = projectTasks.length;
      const progress = totalProjectTasks > 0 ? (completedProjectTasks / totalProjectTasks) * 100 : 0;
      
      const isOverdue = project.dueDate && 
        new Date(project.dueDate) < new Date() && 
        project.status !== 'completed';
      
      const estimatedHours = projectTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
      const actualHours = projectTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
      
      return {
        ...project,
        tasks: projectTasks,
        assignedUsers,
        statistics: {
          totalTasks: totalProjectTasks,
          completedTasks: completedProjectTasks,
          progress,
          estimatedHours,
          actualHours,
          isOverdue
        }
      };
    });
    
    // Users with computed data
    const usersWithData = users.map(user => {
      const userTasks = tasks.filter(t => t.assignedTo === user.id);
      const userProjects = projects.filter(p => 
        tasks.some(t => t.projectId === p.id && t.assignedTo === user.id)
      );
      
      const completedUserTasks = userTasks.filter(t => t.status === 'completed').length;
      const overdueUserTasks = userTasks.filter(t => 
        t.dueDate && 
        new Date(t.dueDate) < new Date() && 
        t.status !== 'completed'
      ).length;
      
      const completionRate = userTasks.length > 0 ? (completedUserTasks / userTasks.length) * 100 : 0;
      const workload = userTasks.filter(t => t.status !== 'completed').length;
      
      return {
        ...user,
        assignedTasks: userTasks,
        projects: userProjects,
        statistics: {
          totalTasks: userTasks.length,
          completedTasks: completedUserTasks,
          overdueTasks: overdueUserTasks,
          completionRate,
          workload
        }
      };
    });
    
    // Current user data
    const currentUser = usersWithData.find(u => u.id === currentUserId);
    
    // Recent activity (last 7 days)
    const recentTasks = tasks
      .filter(t => {
        const taskDate = new Date(t.createdAt);
        return taskDate > sevenDaysAgo;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
    
    // Upcoming deadlines (next 7 days)
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = tasks
      .filter(t => 
        t.dueDate && 
        new Date(t.dueDate) <= nextWeek && 
        new Date(t.dueDate) >= new Date() &&
        t.status !== 'completed'
      )
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
    
    return {
      // Overall statistics
      projectsStats: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
        overdue: overdueProjects,
        completionRate: projectsCompletionRate
      },
      tasksStats: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        overdue: overdueTasks,
        completionRate: tasksCompletionRate
      },
      usersStats: {
        total: totalUsers,
        active: activeUsers
      },
      
      // Enhanced data
      projectsWithData,
      usersWithData,
      currentUser,
      
      // Activity data
      recentTasks,
      upcomingDeadlines
    };
  }, [projects, tasks, users, currentUserId]);

  // Filtered data based on selected project
  const filteredData = useMemo(() => {
    if (!selectedProjectId) {
      return {
        tasks: tasks,
        users: analytics.usersWithData
      };
    }
    
    const projectTasks = tasks.filter(t => t.projectId === selectedProjectId);
    const assignedUserIds = [...new Set(projectTasks.map(t => t.assignedTo))];
    const projectUsers = analytics.usersWithData.filter(u => assignedUserIds.includes(u.id));
    
    return {
      tasks: projectTasks,
      users: projectUsers
    };
  }, [selectedProjectId, tasks, analytics.usersWithData]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const [projectsRes, tasksRes, usersRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/tasks'),
          fetch('/api/users')
        ]);
        
        const [projectsData, tasksData, usersData] = await Promise.all([
          projectsRes.json(),
          tasksRes.json(),
          usersRes.json()
        ]);
        
        // ✅ Set only the base data
        setProjects(projectsData);
        setTasks(tasksData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Actions that modify base state
  const createProject = (projectData: Omit<Project, 'id' | 'startDate'>) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      startDate: new Date().toISOString(),
      ...projectData
    };
    
    setProjects(prev => [...prev, newProject]);
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...taskData
    };
    
    setTasks(prev => [...prev, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? {
            ...task,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined
          }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  if (isLoading) {
    return <div className="loading">Loading project management system...</div>;
  }

  return (
    <div className="project-management-system">
      <header className="header">
        <h1>Project Management Dashboard</h1>
        <div className="user-switcher">
          <select 
            value={currentUserId} 
            onChange={(e) => setCurrentUserId(e.target.value)}
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
      </header>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Projects</h3>
          <div className="metric-value">{analytics.projectsStats.total}</div>
          <div className="metric-details">
            <div>Active: {analytics.projectsStats.active}</div>
            <div>Completed: {analytics.projectsStats.completed}</div>
            <div>Overdue: {analytics.projectsStats.overdue}</div>
            <div>Completion Rate: {analytics.projectsStats.completionRate.toFixed(1)}%</div>
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Tasks</h3>
          <div className="metric-value">{analytics.tasksStats.total}</div>
          <div className="metric-details">
            <div>Completed: {analytics.tasksStats.completed}</div>
            <div>In Progress: {analytics.tasksStats.inProgress}</div>
            <div>Pending: {analytics.tasksStats.pending}</div>
            <div>Overdue: {analytics.tasksStats.overdue}</div>
            <div>Completion Rate: {analytics.tasksStats.completionRate.toFixed(1)}%</div>
          </div>
        </div>
        
        <div className="metric-card">
          <h3>Team</h3>
          <div className="metric-value">{analytics.usersStats.total}</div>
          <div className="metric-details">
            <div>Active: {analytics.usersStats.active}</div>
            <div>Top Performer: {
              analytics.usersWithData
                .sort((a, b) => b.statistics.completionRate - a.statistics.completionRate)[0]?.name || 'N/A'
            }</div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <aside className="sidebar">
          <div className="project-filter">
            <h3>Filter by Project</h3>
            <select 
              value={selectedProjectId || ''} 
              onChange={(e) => setSelectedProjectId(e.target.value || null)}
            >
              <option value="">All Projects</option>
              {analytics.projectsWithData.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.statistics.progress.toFixed(0)}%)
                </option>
              ))}
            </select>
          </div>

          <div className="current-user-summary">
            <h3>Your Summary</h3>
            {analytics.currentUser && (
              <div>
                <div>Tasks: {analytics.currentUser.statistics.totalTasks}</div>
                <div>Completed: {analytics.currentUser.statistics.completedTasks}</div>
                <div>Overdue: {analytics.currentUser.statistics.overdueTasks}</div>
                <div>Rate: {analytics.currentUser.statistics.completionRate.toFixed(1)}%</div>
                <div>Workload: {analytics.currentUser.statistics.workload}</div>
              </div>
            )}
          </div>

          <div className="upcoming-deadlines">
            <h3>Upcoming Deadlines</h3>
            {analytics.upcomingDeadlines.slice(0, 5).map(task => (
              <div key={task.id} className="deadline-item">
                <div className="task-title">{task.title}</div>
                <div className="task-due">
                  Due: {new Date(task.dueDate!).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="content">
          <section className="projects-section">
            <h2>Projects {selectedProjectId ? '(Filtered)' : ''}</h2>
            <div className="projects-grid">
              {analytics.projectsWithData
                .filter(p => !selectedProjectId || p.id === selectedProjectId)
                .map(project => (
                <div key={project.id} className="project-card">
                  <h4>{project.name}</h4>
                  <div className="project-stats">
                    <div>Progress: {project.statistics.progress.toFixed(1)}%</div>
                    <div>Tasks: {project.statistics.completedTasks}/{project.statistics.totalTasks}</div>
                    <div>Team: {project.assignedUsers.length}</div>
                    <div>Status: {project.status}</div>
                    {project.statistics.isOverdue && (
                      <div className="overdue">OVERDUE</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="tasks-section">
            <h2>Tasks ({filteredData.tasks.length})</h2>
            <div className="tasks-list">
              {filteredData.tasks.slice(0, 20).map(task => {
                const assignedUser = users.find(u => u.id === task.assignedTo);
                const project = projects.find(p => p.id === task.projectId);
                
                return (
                  <div key={task.id} className="task-item">
                    <div className="task-header">
                      <h5>{task.title}</h5>
                      <span className={`status ${task.status}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="task-details">
                      <div>Project: {project?.name}</div>
                      <div>Assigned: {assignedUser?.name}</div>
                      {task.dueDate && (
                        <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                      )}
                    </div>
                    <div className="task-actions">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* 
KEY PRINCIPLES DEMONSTRATED:

1. **Single Source of Truth**: Store only base data that can't be derived
   - User, posts, cart items, projects, tasks, users
   - No duplicated or computed values in state
   - All relationships computed from base data

2. **Computed Values with useMemo**: Derive everything else efficiently
   - User display names, statistics, flags
   - Cart totals, shipping costs, discounts
   - Project progress, team assignments, deadlines
   - Only recalculates when dependencies change

3. **No Circular Dependencies**: Eliminate complex useEffect chains
   - No state depending on other state
   - No need to keep derived values in sync
   - Predictable update flow

4. **Performance Optimization**: Strategic use of useMemo
   - Expensive calculations are cached
   - Only recompute when base data changes
   - React can optimize re-renders efficiently

5. **Maintainability**: Easy to reason about and debug
   - Clear separation between data and computation
   - No hidden state mutations
   - Easy to add new derived values

MINIMIZE STATE CHECKLIST:
✅ Store only data that cannot be computed from other data
✅ Use useMemo for expensive derived calculations
✅ Eliminate all redundant state variables
✅ Remove circular dependencies between state
✅ Compute relationships on-demand instead of storing them
✅ Use single source of truth for each piece of data
✅ Avoid storing the same data in multiple formats
✅ Let React handle optimization with proper dependencies

BENEFITS OF MINIMIZED STATE:
- Eliminates bugs from out-of-sync derived data
- Reduces complexity of state management
- Improves performance through better caching
- Makes code easier to understand and maintain
- Reduces memory usage
- Simplifies testing (fewer state combinations)
- Makes refactoring safer and easier

COMMON STATE BLOAT PATTERNS TO AVOID:
- Storing computed totals alongside base numbers
- Keeping filtered/sorted arrays in state
- Duplicating data in different formats
- Storing UI flags that can be derived from data
- Maintaining counts that can be calculated
- Keeping relationships in multiple places
- Storing formatted versions of raw data
*/