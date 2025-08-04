// DERIVABLE STATE TEST
// Fix the code violations below - each example stores state that could be derived
// GOAL: Store only the source of truth, derive everything else

import React, { useState, useEffect } from 'react';

type ShoppingCartItem = {
  id: number;
  price: number;
};

// ===== EASY =====
// Problem: Storing derived values in state
function ShoppingCart({ items }: {   items: ShoppingCartItem[] }) {
  const [cartItems, setCartItems] = useState(items);
  const [itemCount, setItemCount] = useState(items.length);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setItemCount(cartItems.length);
    setTotalPrice(cartItems.reduce((sum, item) => sum + item.price, 0));
  }, [cartItems]);

  const addItem = (newItem: ShoppingCartItem) => {
    setCartItems([...cartItems, newItem]);
  };

  return (
    <div>
      <h2>Cart ({itemCount} items)</h2>
      <p>Total: ${totalPrice}</p>
      <button onClick={() => addItem({ id: Date.now(), price: 10 })}>
        Add Item
      </button>
    </div>
  );
}

type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  displayName?: string;
  badges?: string[];
  subscriptionLevel?: string;
  createdAt?: string;
};

// ===== MEDIUM =====
// Problem: Complex derived state with multiple useEffects
function UserProfile({ user }: { user: User }) {
  const [userData, setUserData] = useState(user);
  const [displayName, setDisplayName] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [accountAge, setAccountAge] = useState(0);
  const [membershipTier, setMembershipTier] = useState('basic');
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);

  useEffect(() => {
    setDisplayName(userData.firstName + ' ' + userData.lastName);
  }, [userData.firstName, userData.lastName]);

  useEffect(() => {
    setIsVerified(userData.badges && userData.badges.includes('verified'));
  }, [userData.badges]);

  useEffect(() => {
    const diffTime = Math.abs(new Date() - new Date(userData.createdAt));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setAccountAge(diffDays);
  }, [userData.createdAt]);

  useEffect(() => {
    if (userData.subscriptionLevel === 'premium') {
      setMembershipTier('premium');
    } else if (userData.subscriptionLevel === 'pro') {
      setMembershipTier('pro');
    } else {
      setMembershipTier('basic');
    }
  }, [userData.subscriptionLevel]);

  useEffect(() => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address'];
    const completed = required.every(field => userData[field] && userData[field].trim());
    setHasCompletedProfile(completed);
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

// ===== HARD =====
// Problem: Derived state with complex interdependencies
function ProjectDashboard({ projects, users, tasks }) {
  const [projectData, setProjectData] = useState(projects);
  const [userData, setUserData] = useState(users);
  const [taskData, setTaskData] = useState(tasks);
  
  // All of these should be derived!
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [overDueProjects, setOverDueProjects] = useState([]);
  const [projectStats, setProjectStats] = useState({});
  const [userWorkload, setUserWorkload] = useState({});
  const [totalProgress, setTotalProgress] = useState(0);
  const [criticalTasks, setCriticalTasks] = useState([]);
  const [teamEfficiency, setTeamEfficiency] = useState(0);

  useEffect(() => {
    const active = projectData.filter(p => p.status === 'active');
    const completed = projectData.filter(p => p.status === 'completed');
    const overdue = projectData.filter(p => 
      p.dueDate && new Date(p.dueDate) < new Date() && p.status !== 'completed'
    );
    
    setActiveProjects(active);
    setCompletedProjects(completed);
    setOverDueProjects(overdue);
  }, [projectData]);

  useEffect(() => {
    const stats = projectData.reduce((acc, project) => {
      acc[project.id] = {
        taskCount: taskData.filter(t => t.projectId === project.id).length,
        completedTasks: taskData.filter(t => t.projectId === project.id && t.completed).length,
        assignedUsers: [...new Set(taskData.filter(t => t.projectId === project.id).map(t => t.assignedTo))]
      };
      return acc;
    }, {});
    setProjectStats(stats);
  }, [projectData, taskData]);

  useEffect(() => {
    const workload = userData.reduce((acc, user) => {
      acc[user.id] = {
        activeTasks: taskData.filter(t => t.assignedTo === user.id && !t.completed).length,
        completedTasks: taskData.filter(t => t.assignedTo === user.id && t.completed).length,
        activeProjects: [...new Set(taskData.filter(t => t.assignedTo === user.id).map(t => t.projectId))]
      };
      return acc;
    }, {});
    setUserWorkload(workload);
  }, [userData, taskData]);

  useEffect(() => {
    const totalTasks = taskData.length;
    const completedTasks = taskData.filter(t => t.completed).length;
    setTotalProgress(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0);
  }, [taskData]);

  useEffect(() => {
    const critical = taskData.filter(task => 
      task.priority === 'high' && 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000)
    );
    setCriticalTasks(critical);
  }, [taskData]);

  useEffect(() => {
    const completedThisWeek = taskData.filter(task => {
      const completedDate = new Date(task.completedAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return task.completed && completedDate >= weekAgo;
    }).length;
    
    const totalAssigned = taskData.filter(task => !task.completed).length;
    setTeamEfficiency(totalAssigned > 0 ? (completedThisWeek / totalAssigned) * 100 : 0);
  }, [taskData]);

  return (
    <div>
      <h1>Project Dashboard</h1>
      <div className="stats">
        <div>Active: {activeProjects.length}</div>
        <div>Completed: {completedProjects.length}</div>
        <div>Overdue: {overDueProjects.length}</div>
        <div>Progress: {totalProgress.toFixed(1)}%</div>
        <div>Critical Tasks: {criticalTasks.length}</div>
        <div>Team Efficiency: {teamEfficiency.toFixed(1)}%</div>
      </div>
    </div>
  );
}