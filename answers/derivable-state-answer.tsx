// DERIVABLE STATE - CORRECT IMPLEMENTATIONS
// This file shows how to store only the source of truth and derive everything else

import React, { useState, useMemo } from 'react';

// ===== EASY - FIXED =====
// ✅ SOLUTION: Store only the source data, derive computed values
// WHY: itemCount and totalPrice are completely determined by cartItems
function ShoppingCart({ items }) {
  const [cartItems, setCartItems] = useState(items);

  // Derived values - no useState needed!
  const itemCount = cartItems.length;
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const addItem = (newItem) => {
    setCartItems([...cartItems, newItem]);
  };

  return (
    <div>
      <h2>Cart ({itemCount} items)</h2>
      <p>Total: ${totalPrice.toFixed(2)}</p>
      <button onClick={() => addItem({ id: Date.now(), price: 10 })}>
        Add Item
      </button>
    </div>
  );
}

// ===== MEDIUM - FIXED =====
// ✅ SOLUTION: Store only user data, derive all display values during render
// WHY: All the computed values depend entirely on userData properties
function UserProfile({ user }) {
  const [userData, setUserData] = useState(user);

  // All derived values computed during render - no useEffect needed!
  const displayName = `${userData.firstName} ${userData.lastName}`;
  const isVerified = userData.badges && userData.badges.includes('verified');
  
  // Calculate account age
  const accountAge = useMemo(() => {
    const diffTime = Math.abs(new Date() - new Date(userData.createdAt));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [userData.createdAt]);

  // Determine membership tier
  const membershipTier = useMemo(() => {
    if (userData.subscriptionLevel === 'premium') return 'premium';
    if (userData.subscriptionLevel === 'pro') return 'pro';
    return 'basic';
  }, [userData.subscriptionLevel]);

  // Check profile completion
  const hasCompletedProfile = useMemo(() => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address'];
    return required.every(field => userData[field] && userData[field].trim());
  }, [userData]);

  return (
    <div>
      <h1>{displayName}</h1>
      {isVerified && <span>✓ Verified</span>}
      <p>Member for {accountAge} days</p>
      <p>Tier: {membershipTier}</p>
      {!hasCompletedProfile && <p>Please complete your profile</p>}
    </div>
  );
}

// ===== HARD - FIXED =====
// ✅ SOLUTION: Store only source data, derive all computed values with useMemo for performance
// WHY: All statistics can be calculated from the three source arrays
function ProjectDashboard({ projects, users, tasks }) {
  const [projectData, setProjectData] = useState(projects);
  const [userData, setUserData] = useState(users);
  const [taskData, setTaskData] = useState(tasks);

  // Derive project status counts
  const projectStats = useMemo(() => {
    const active = projectData.filter(p => p.status === 'active');
    const completed = projectData.filter(p => p.status === 'completed');
    const overdue = projectData.filter(p => 
      p.dueDate && new Date(p.dueDate) < new Date() && p.status !== 'completed'
    );
    
    return { active, completed, overdue };
  }, [projectData]);

  // Derive detailed project statistics
  const detailedProjectStats = useMemo(() => {
    return projectData.reduce((acc, project) => {
      const projectTasks = taskData.filter(t => t.projectId === project.id);
      acc[project.id] = {
        taskCount: projectTasks.length,
        completedTasks: projectTasks.filter(t => t.completed).length,
        assignedUsers: [...new Set(projectTasks.map(t => t.assignedTo))]
      };
      return acc;
    }, {});
  }, [projectData, taskData]);

  // Derive user workload information
  const userWorkload = useMemo(() => {
    return userData.reduce((acc, user) => {
      const userTasks = taskData.filter(t => t.assignedTo === user.id);
      acc[user.id] = {
        activeTasks: userTasks.filter(t => !t.completed).length,
        completedTasks: userTasks.filter(t => t.completed).length,
        activeProjects: [...new Set(userTasks.map(t => t.projectId))]
      };
      return acc;
    }, {});
  }, [userData, taskData]);

  // Derive overall progress
  const totalProgress = useMemo(() => {
    const totalTasks = taskData.length;
    const completedTasks = taskData.filter(t => t.completed).length;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  }, [taskData]);

  // Derive critical tasks (high priority, due soon)
  const criticalTasks = useMemo(() => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return taskData.filter(task => 
      task.priority === 'high' && 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) <= tomorrow
    );
  }, [taskData]);

  // Derive team efficiency (tasks completed this week)
  const teamEfficiency = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const completedThisWeek = taskData.filter(task => {
      return task.completed && 
             task.completedAt && 
             new Date(task.completedAt) >= weekAgo;
    }).length;
    
    const activeTasks = taskData.filter(task => !task.completed).length;
    return activeTasks > 0 ? (completedThisWeek / activeTasks) * 100 : 0;
  }, [taskData]);

  return (
    <div>
      <h1>Project Dashboard</h1>
      <div className="stats">
        <div>Active: {projectStats.active.length}</div>
        <div>Completed: {projectStats.completed.length}</div>
        <div>Overdue: {projectStats.overdue.length}</div>
        <div>Progress: {totalProgress.toFixed(1)}%</div>
        <div>Critical Tasks: {criticalTasks.length}</div>
        <div>Team Efficiency: {teamEfficiency.toFixed(1)}%</div>
      </div>

      {/* Show critical tasks if any */}
      {criticalTasks.length > 0 && (
        <div className="critical-tasks-alert">
          <h3>⚠️ Critical Tasks Due Soon:</h3>
          <ul>
            {criticalTasks.map(task => (
              <li key={task.id}>
                {task.name} - Due: {new Date(task.dueDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ===== BONUS: Advanced Pattern - Derived State with Memoization =====
// 🔥 For expensive calculations, use useMemo to prevent unnecessary recalculations
function AdvancedAnalyticsDashboard({ rawData }) {
  const [data, setData] = useState(rawData);
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Expensive calculation - only recompute when data or timeRange changes
  const filteredData = useMemo(() => {
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return data.filter(item => new Date(item.timestamp) >= cutoff);
  }, [data, timeRange]);

  // Another expensive calculation - depends on filteredData and selectedMetric
  const aggregatedMetrics = useMemo(() => {
    if (filteredData.length === 0) return { total: 0, average: 0, trend: 0 };

    const values = filteredData.map(item => item[selectedMetric] || 0);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    
    // Calculate trend (simple linear regression slope)
    const n = values.length;
    const sumX = (n * (n - 1)) / 2; // Sum of indices
    const sumY = total;
    const sumXY = values.reduce((sum, val, index) => sum + val * index, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squared indices
    
    const trend = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) : 0;

    return { total, average, trend };
  }, [filteredData, selectedMetric]);

  // Simple derived values (no memoization needed for cheap calculations)
  const dataPointCount = filteredData.length;
  const hasData = dataPointCount > 0;
  const isPositiveTrend = aggregatedMetrics.trend > 0;

  return (
    <div>
      <div className="controls">
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
        </select>
        
        <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
          <option value="revenue">Revenue</option>
          <option value="users">Users</option>
          <option value="conversions">Conversions</option>
        </select>
      </div>

      {hasData ? (
        <div className="metrics">
          <div>Data Points: {dataPointCount}</div>
          <div>Total: {aggregatedMetrics.total.toLocaleString()}</div>
          <div>Average: {aggregatedMetrics.average.toFixed(2)}</div>
          <div className={isPositiveTrend ? 'positive' : 'negative'}>
            Trend: {isPositiveTrend ? '📈' : '📉'} {aggregatedMetrics.trend.toFixed(4)}
          </div>
        </div>
      ) : (
        <div>No data available for the selected time range</div>
      )}
    </div>
  );
}

/* 
KEY PRINCIPLES DEMONSTRATED:

1. **Single Source of Truth**: Store only the fundamental data that can't be derived.
   - ✅ Store: cartItems, userData, projectData, taskData
   - ❌ Don't store: itemCount, totalPrice, displayName, isVerified

2. **Derive During Render**: Most derived values can be calculated during render.
   - Simple calculations like itemCount and totalPrice happen automatically
   - No useEffect needed for synchronization

3. **Use useMemo for Expensive Calculations**: When derivation is computationally expensive.
   - Complex filtering, sorting, or mathematical operations
   - Prevents unnecessary recalculations on every render

4. **Eliminate useEffect for Derived State**: 
   - ❌ Bad: useEffect(() => { setDerived(calculate(source)) }, [source])
   - ✅ Good: const derived = calculate(source)

5. **Benefits of This Approach**:
   - Fewer bugs (no sync issues between related state)
   - Better performance (no unnecessary re-renders)
   - Simpler mental model (one source of truth)
   - Easier testing (derived values are pure functions)

WHEN TO USE EACH PATTERN:
- **Direct calculation**: For simple, fast operations (length, basic math)
- **useMemo**: For expensive operations that don't change often
- **useState**: Only for data that can't be derived from other state/props
*/