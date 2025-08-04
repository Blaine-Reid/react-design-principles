// MINIMIZE STATE SURFACE AREA TEST  
// Fix the code violations below - each example stores too much derived/redundant state
// GOAL: Store only the minimum data needed and derive everything else

import React, { useState, useEffect } from 'react';

// ===== EASY =====
// Problem: Storing derived values that can be calculated from other state
function UserDashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // All of these are derived and shouldn't be in state!
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');
  const [postCount, setPostCount] = useState(0);
  const [hasRecentPosts, setHasRecentPosts] = useState(false);
  const [averagePostLength, setAveragePostLength] = useState(0);
  const [isActiveUser, setIsActiveUser] = useState(false);

  useEffect(() => {
    if (user) {
      // Updating derived state with useEffect - unnecessary!
      setUserName(`${user.firstName} ${user.lastName}`);
      setUserInitials(`${user.firstName[0]}${user.lastName[0]}`);
      setIsActiveUser(user.lastLoginDate && new Date(user.lastLoginDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    }
  }, [user]);

  useEffect(() => {
    if (posts) {
      // More derived state updates!
      setPostCount(posts.length);
      setHasRecentPosts(posts.some(post => new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)));
      
      const totalLength = posts.reduce((sum, post) => sum + post.content.length, 0);
      setAveragePostLength(posts.length > 0 ? totalLength / posts.length : 0);
    }
  }, [posts]);

  const loadUserData = async (userId) => {
    try {
      const [userResponse, postsResponse] = await Promise.all([
        fetch(`/api/users/${userId}`),
        fetch(`/api/users/${userId}/posts`)
      ]);
      
      const userData = await userResponse.json();
      const postsData = await postsResponse.json();
      
      setUser(userData);
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load user data');
    }
  };

  return (
    <div className="user-dashboard">
      <div className="user-header">
        <div className="user-avatar">{userInitials}</div>
        <div className="user-info">
          <h1>{userName}</h1>
          <p>{isActiveUser ? 'Active User' : 'Inactive User'}</p>
        </div>
      </div>
      
      <div className="user-stats">
        <div className="stat">
          <span className="stat-label">Posts</span>
          <span className="stat-value">{postCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Avg Length</span>
          <span className="stat-value">{Math.round(averagePostLength)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Recent Activity</span>
          <span className="stat-value">{hasRecentPosts ? 'Yes' : 'No'}</span>
        </div>
      </div>
      
      <div className="user-posts">
        <h2>Recent Posts</h2>
        {posts.slice(0, 5).map(post => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== MEDIUM =====  
// Problem: Complex shopping cart with excessive state tracking
function ShoppingCartComplex() {
  // Core state
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  
  // All of these should be derived!
  const [itemCount, setItemCount] = useState(0);
  const [uniqueItemCount, setUniqueItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [averageItemPrice, setAverageItemPrice] = useState(0);
  const [mostExpensiveItem, setMostExpensiveItem] = useState(null);
  const [cheapestItem, setCheapestItem] = useState(null);
  const [hasElectronics, setHasElectronics] = useState(false);
  const [hasFragileItems, setHasFragileItems] = useState(false);
  const [requiresSpecialHandling, setRequiresSpecialHandling] = useState(false);
  
  // Discount and shipping calculations - also derived!
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [canUseExpressShipping, setCanUseExpressShipping] = useState(true);
  const [freeShippingEligible, setFreeShippingEligible] = useState(false);
  
  // Tax calculations - derived!
  const [taxableAmount, setTaxableAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  
  // Status flags - derived!
  const [isEmpty, setIsEmpty] = useState(true);
  const [isOverWeightLimit, setIsOverWeightLimit] = useState(false);
  const [hasInvalidItems, setHasInvalidItems] = useState(false);
  const [needsAgeVerification, setNeedsAgeVerification] = useState(false);

  // Massive useEffect to keep everything in sync
  useEffect(() => {
    if (items.length === 0) {
      // Reset everything when empty
      setItemCount(0);
      setUniqueItemCount(0);
      setSubtotal(0);
      setTotalWeight(0);
      setAverageItemPrice(0);
      setMostExpensiveItem(null);
      setCheapestItem(null);
      setHasElectronics(false);
      setHasFragileItems(false);
      setRequiresSpecialHandling(false);
      setTaxableAmount(0);
      setTaxAmount(0);
      setFinalTotal(0);
      setIsEmpty(true);
      setIsOverWeightLimit(false);
      setHasInvalidItems(false);
      setNeedsAgeVerification(false);
      return;
    }

    // Calculate basic item stats
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueItems = items.length;
    const newSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newTotalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    const avgPrice = newSubtotal / totalItems;
    
    setItemCount(totalItems);
    setUniqueItemCount(uniqueItems);
    setSubtotal(newSubtotal);
    setTotalWeight(newTotalWeight);
    setAverageItemPrice(avgPrice);
    setIsEmpty(false);
    
    // Find most/least expensive items
    const prices = items.map(item => item.price);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    setMostExpensiveItem(items.find(item => item.price === maxPrice));
    setCheapestItem(items.find(item => item.price === minPrice));
    
    // Check item categories and special requirements
    setHasElectronics(items.some(item => item.category === 'electronics'));
    setHasFragileItems(items.some(item => item.fragile));
    setRequiresSpecialHandling(items.some(item => item.specialHandling));
    setNeedsAgeVerification(items.some(item => item.ageRestricted));
    setHasInvalidItems(items.some(item => !item.available));
    setIsOverWeightLimit(newTotalWeight > 50);
    
    // Calculate tax
    const taxableItems = items.filter(item => item.taxable);
    const newTaxableAmount = taxableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTaxableAmount(newTaxableAmount);
    
  }, [items]);

  // Separate useEffect for coupon calculations
  useEffect(() => {
    let discount = 0;
    let percentage = 0;
    
    if (couponCode === 'SAVE10') {
      percentage = 10;
      discount = subtotal * 0.1;
    } else if (couponCode === 'SAVE20') {
      percentage = 20;
      discount = subtotal * 0.2;
    } else if (couponCode === 'FLAT50') {
      discount = Math.min(50, subtotal);
    }
    
    setDiscountAmount(discount);
    setDiscountPercentage(percentage);
  }, [couponCode, subtotal]);

  // Separate useEffect for shipping calculations  
  useEffect(() => {
    let cost = 0;
    let delivery = '';
    let canExpress = true;
    
    if (shippingMethod === 'standard') {
      cost = totalWeight > 10 ? 15 : 10;
      delivery = '5-7 business days';
    } else if (shippingMethod === 'express') {
      cost = totalWeight > 10 ? 25 : 20;
      delivery = '2-3 business days';
      canExpress = !hasFragileItems && totalWeight <= 30;
    } else if (shippingMethod === 'overnight') {
      cost = totalWeight > 10 ? 40 : 35;
      delivery = '1 business day';
      canExpress = !hasFragileItems && !requiresSpecialHandling && totalWeight <= 20;
    }
    
    setShippingCost(cost);
    setEstimatedDelivery(delivery);
    setCanUseExpressShipping(canExpress);
    setFreeShippingEligible(subtotal > 100);
    
  }, [shippingMethod, totalWeight, hasFragileItems, requiresSpecialHandling, subtotal]);

  // Separate useEffect for final calculations
  useEffect(() => {
    const tax = taxableAmount * 0.08;
    const shipping = freeShippingEligible ? 0 : shippingCost;
    const total = subtotal - discountAmount + tax + shipping;
    
    setTaxAmount(tax);
    setFinalTotal(total);
  }, [subtotal, discountAmount, taxableAmount, shippingCost, freeShippingEligible]);

  const addItem = (product) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      
      <div className="cart-summary">
        <p>Items: {itemCount} ({uniqueItemCount} unique)</p>
        <p>Weight: {totalWeight.toFixed(1)} lbs</p>
        <p>Average Price: ${averageItemPrice.toFixed(2)}</p>
        {mostExpensiveItem && <p>Most Expensive: {mostExpensiveItem.name}</p>}
        {cheapestItem && <p>Cheapest: {cheapestItem.name}</p>}
      </div>
      
      <div className="cart-flags">
        {hasElectronics && <span className="flag">Electronics</span>}
        {hasFragileItems && <span className="flag">Fragile</span>}
        {requiresSpecialHandling && <span className="flag">Special Handling</span>}
        {needsAgeVerification && <span className="flag">Age Verification Required</span>}
        {isOverWeightLimit && <span className="flag warning">Over Weight Limit</span>}
        {hasInvalidItems && <span className="flag error">Invalid Items</span>}
      </div>
      
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <span>{item.name}</span>
            <span>${item.price} × {item.quantity}</span>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>
      
      <div className="coupon-section">
        <input
          type="text"
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        {discountAmount > 0 && (
          <p>Discount: {discountPercentage}% (-${discountAmount.toFixed(2)})</p>
        )}
      </div>
      
      <div className="shipping-section">
        <select 
          value={shippingMethod} 
          onChange={(e) => setShippingMethod(e.target.value)}
        >
          <option value="standard">Standard - ${shippingCost}</option>
          <option value="express" disabled={!canUseExpressShipping}>Express - ${shippingCost}</option>
          <option value="overnight" disabled={!canUseExpressShipping}>Overnight - ${shippingCost}</option>
        </select>
        <p>Estimated Delivery: {estimatedDelivery}</p>
        {freeShippingEligible && <p>Free shipping eligible!</p>}
      </div>
      
      <div className="cart-totals">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        {discountAmount > 0 && <p>Discount: -${discountAmount.toFixed(2)}</p>}
        <p>Tax: ${taxAmount.toFixed(2)}</p>
        <p>Shipping: ${freeShippingEligible ? 0 : shippingCost}</p>
        <p><strong>Total: ${finalTotal.toFixed(2)}</strong></p>
      </div>
    </div>
  );
}

// ===== HARD =====
// Problem: Project management system with enormous state surface area
function ProjectManagementSystem() {
  // Core data
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Project statistics - all derived!
  const [totalProjects, setTotalProjects] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [overdueProjects, setOverdueProjects] = useState(0);
  const [projectsCompletionRate, setProjectsCompletionRate] = useState(0);
  const [averageProjectDuration, setAverageProjectDuration] = useState(0);
  const [projectsByStatus, setProjectsByStatus] = useState({});
  const [projectsByPriority, setProjectsByPriority] = useState({});
  
  // Task statistics - all derived!
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);
  const [tasksCompletionRate, setTasksCompletionRate] = useState(0);
  const [averageTaskDuration, setAverageTaskDuration] = useState(0);
  const [tasksByStatus, setTasksByStatus] = useState({});
  const [tasksByPriority, setTasksByPriority] = useState({});
  const [tasksByAssignee, setTasksByAssignee] = useState({});
  
  // User statistics - all derived!
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [userWorkloads, setUserWorkloads] = useState({});
  const [userCompletionRates, setUserCompletionRates] = useState({});
  const [topPerformers, setTopPerformers] = useState([]);
  const [usersWithOverdueTasks, setUsersWithOverdueTasks] = useState([]);
  
  // Current user specific data - all derived!
  const [currentUserTasks, setCurrentUserTasks] = useState([]);
  const [currentUserProjects, setCurrentUserProjects] = useState([]);
  const [currentUserCompletionRate, setCurrentUserCompletionRate] = useState(0);
  const [currentUserOverdueTasks, setCurrentUserOverdueTasks] = useState(0);
  const [currentUserUpcomingDeadlines, setCurrentUserUpcomingDeadlines] = useState([]);
  
  // Dashboard filters and views - some could be derived!
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dateRange, setDateRange] = useState('thisMonth');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Filtered and processed data - all derived!
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({});
  const [chartData, setChartData] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [criticalIssues, setCriticalIssues] = useState([]);

  // Massive useEffect to recalculate everything
  useEffect(() => {
    // Project statistics
    setTotalProjects(projects.length);
    setActiveProjects(projects.filter(p => p.status === 'active').length);
    setCompletedProjects(projects.filter(p => p.status === 'completed').length);
    setOverdueProjects(projects.filter(p => p.dueDate && new Date(p.dueDate) < new Date() && p.status !== 'completed').length);
    setProjectsCompletionRate(projects.length > 0 ? (completedProjects / projects.length) * 100 : 0);
    
    const projectDurations = projects
      .filter(p => p.completedAt && p.startDate)
      .map(p => (new Date(p.completedAt) - new Date(p.startDate)) / (1000 * 60 * 60 * 24));
    setAverageProjectDuration(projectDurations.length > 0 ? projectDurations.reduce((a, b) => a + b, 0) / projectDurations.length : 0);
    
    // Group projects by status and priority
    const byStatus = projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    setProjectsByStatus(byStatus);
    
    const byPriority = projects.reduce((acc, p) => {
      acc[p.priority] = (acc[p.priority] || 0) + 1;
      return acc;
    }, {});
    setProjectsByPriority(byPriority);
    
  }, [projects, completedProjects]); // Note: circular dependency!

  useEffect(() => {
    // Task statistics
    setTotalTasks(tasks.length);
    setCompletedTasks(tasks.filter(t => t.completed).length);
    setPendingTasks(tasks.filter(t => !t.completed && !t.overdue).length);
    setOverdueTasks(tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length);
    setTasksCompletionRate(tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0);
    
    const taskDurations = tasks
      .filter(t => t.completedAt && t.startDate)
      .map(t => (new Date(t.completedAt) - new Date(t.startDate)) / (1000 * 60 * 60 * 24));
    setAverageTaskDuration(taskDurations.length > 0 ? taskDurations.reduce((a, b) => a + b, 0) / taskDurations.length : 0);
    
    // Group tasks by various attributes
    const byStatus = tasks.reduce((acc, t) => {
      const status = t.completed ? 'completed' : t.overdue ? 'overdue' : 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    setTasksByStatus(byStatus);
    
    const byPriority = tasks.reduce((acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    }, {});
    setTasksByPriority(byPriority);
    
    const byAssignee = tasks.reduce((acc, t) => {
      acc[t.assignedTo] = (acc[t.assignedTo] || 0) + 1;
      return acc;
    }, {});
    setTasksByAssignee(byAssignee);
    
  }, [tasks, completedTasks]); // Note: circular dependency!

  useEffect(() => {
    // User statistics
    setTotalUsers(users.length);
    setActiveUsers(users.filter(u => u.lastActive && new Date(u.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length);
    
    // Calculate user workloads
    const workloads = users.reduce((acc, user) => {
      const userTasks = tasks.filter(t => t.assignedTo === user.id);
      acc[user.id] = {
        total: userTasks.length,
        completed: userTasks.filter(t => t.completed).length,
        pending: userTasks.filter(t => !t.completed).length,
        overdue: userTasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
      };
      return acc;
    }, {});
    setUserWorkloads(workloads);
    
    // Calculate completion rates
    const completionRates = Object.keys(workloads).reduce((acc, userId) => {
      const workload = workloads[userId];
      acc[userId] = workload.total > 0 ? (workload.completed / workload.total) * 100 : 0;
      return acc;
    }, {});
    setUserCompletionRates(completionRates);
    
    // Find top performers
    const performers = users
      .map(user => ({
        ...user,
        completionRate: completionRates[user.id] || 0,
        workload: workloads[user.id] || { total: 0 }
      }))
      .filter(user => user.workload.total > 0)
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 5);
    setTopPerformers(performers);
    
    // Find users with overdue tasks
    const usersWithOverdue = users.filter(user => {
      const workload = workloads[user.id];
      return workload && workload.overdue > 0;
    });
    setUsersWithOverdueTasks(usersWithOverdue);
    
  }, [users, tasks]); // This will cause infinite loops!

  // More useEffects for current user data, filters, etc...
  // This pattern leads to dozens of useEffects and circular dependencies!

  return (
    <div className="project-management-system">
      <h1>Project Management Dashboard</h1>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Projects</h3>
          <p>Total: {totalProjects}</p>
          <p>Active: {activeProjects}</p>
          <p>Completed: {completedProjects}</p>
          <p>Overdue: {overdueProjects}</p>
          <p>Completion Rate: {projectsCompletionRate.toFixed(1)}%</p>
        </div>
        
        <div className="metric-card">
          <h3>Tasks</h3>
          <p>Total: {totalTasks}</p>
          <p>Completed: {completedTasks}</p>
          <p>Pending: {pendingTasks}</p>
          <p>Overdue: {overdueTasks}</p>
          <p>Completion Rate: {tasksCompletionRate.toFixed(1)}%</p>
        </div>
        
        <div className="metric-card">
          <h3>Users</h3>
          <p>Total: {totalUsers}</p>
          <p>Active: {activeUsers}</p>
          <p>Top Performers: {topPerformers.length}</p>
          <p>With Overdue: {usersWithOverdueTasks.length}</p>
        </div>
      </div>
      
      {/* More complex UI that depends on all the derived state... */}
    </div>
  );
}