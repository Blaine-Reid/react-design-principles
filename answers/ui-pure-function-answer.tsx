// UI AS PURE FUNCTION OF STATE - CORRECT IMPLEMENTATIONS
// This file shows how to make UI rendering depend only on props and state

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// ===== EASY - FIXED =====
// ✅ SOLUTION: Store random value in state instead of generating it during render
// WHY: Math.random() creates different values on every render, making the UI non-deterministic
function RandomQuote({ quotes }) {
  // Generate random index once and store it in state
  const [selectedIndex, setSelectedIndex] = useState(() => 
    Math.floor(Math.random() * quotes.length)
  );

  const selectedQuote = quotes[selectedIndex];

  const selectNewQuote = () => {
    setSelectedIndex(Math.floor(Math.random() * quotes.length));
  };

  return (
    <div className="quote-display">
      <blockquote>"{selectedQuote.text}"</blockquote>
      <cite>- {selectedQuote.author}</cite>
      <button onClick={selectNewQuote}>
        New Quote
      </button>
    </div>
  );
}

// ===== MEDIUM - FIXED =====
// ✅ SOLUTION: Move time-based calculations to state and effects
// WHY: Using new Date() in render makes the component non-deterministic
function TimeBasedGreeting({ userName }) {
  // Store time-based values in state
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));

  // Update current time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Derive values from state (these are now pure calculations)
  const currentHour = currentTime.getHours();
  const isWeekend = currentTime.getDay() === 0 || currentTime.getDay() === 6;
  const formattedTime = currentTime.toLocaleTimeString();
  
  let greeting;
  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  // Deterministic background calculation based on date
  const daysSinceEpoch = Math.floor(currentTime.getTime() / (1000 * 60 * 60 * 24));
  const backgroundHue = (daysSinceEpoch * 137.5) % 360;

  return (
    <div 
      className="greeting"
      style={{ 
        backgroundColor: `hsl(${backgroundHue}, 70%, 90%)`,
        border: isWeekend ? '3px solid gold' : '1px solid gray'
      }}
    >
      <h1>{greeting}, {userName}!</h1>
      <p>Current time: {formattedTime}</p>
      {isWeekend && <p>🎉 Happy weekend!</p>}
      <small>Session ID: {sessionId}</small>
    </div>
  );
}

// ===== HARD - FIXED =====
// ✅ SOLUTION: Move all non-deterministic values to state and side effects to useEffect
// WHY: Render should be a pure function of props and state
function DashboardWidget({ userId, widgetType }) {
  // Store all non-deterministic values in state
  const [componentId] = useState(() => `widget-${Math.random().toString(36).substr(2, 9)}`);
  const [renderTime] = useState(() => new Date().toISOString());
  const [renderCount, setRenderCount] = useState(1);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [screenDimensions, setScreenDimensions] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [randomColor] = useState(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);
  const [shouldShowExtraInfo] = useState(() => Math.random() > 0.5);
  const [randomMessage] = useState(() => {
    const messages = [
      'Welcome back!',
      'Have a great day!',
      'You\'re doing awesome!',
      'Keep up the good work!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  });

  // Constants that don't change during the component's lifetime
  const userAgent = useMemo(() => navigator.userAgent, []);
  const isMobile = useMemo(() => /Mobi|Android/i.test(userAgent), [userAgent]);
  const hasTouch = useMemo(() => 'ontouchstart' in window, []);
  const pixelRatio = useMemo(() => window.devicePixelRatio || 1, []);

  // Update time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setRenderCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Side effects in useEffect, not in render
  useEffect(() => {
    if (userId) {
      document.title = `Dashboard - User ${userId}`;
      localStorage.setItem('lastViewedWidget', widgetType);
      console.log(`Rendering widget ${widgetType} at ${renderTime}`);
    }
  }, [userId, widgetType, renderTime]);

  // API calls in useEffect
  useEffect(() => {
    if (widgetType === 'weather') {
      const element = document.getElementById(componentId);
      if (element) {
        fetch('/api/weather')
          .then(response => response.json())
          .then(data => {
            element.setAttribute('data-weather', data.temp);
          })
          .catch(error => console.error('Weather fetch failed:', error));
      }
    }
  }, [widgetType, componentId]);

  // All derived values are now pure calculations from state
  const currentMonth = currentTime.getMonth();
  const isEvenSecond = currentTime.getSeconds() % 2 === 0;
  const timeBasedOpacity = Math.sin(currentTime.getTime() / 10000) * 0.3 + 0.7;

  const themeBasedStyle = useMemo(() => ({
    backgroundColor: randomColor,
    opacity: timeBasedOpacity,
    transform: `scale(${pixelRatio})`,
    border: isOnline ? '2px solid green' : '2px solid red',
    borderRadius: isEvenSecond ? '10px' : '0px',
    fontSize: screenDimensions.width > 768 ? '16px' : '14px',
    padding: isMobile ? '8px' : '16px',
    filter: currentMonth === 11 ? 'hue-rotate(120deg)' : 'none'
  }), [randomColor, timeBasedOpacity, pixelRatio, isOnline, isEvenSecond, 
       screenDimensions.width, isMobile, currentMonth]);

  return (
    <div 
      id={componentId}
      className={`dashboard-widget ${isMobile ? 'mobile' : 'desktop'}`}
      style={themeBasedStyle}
    >
      <h3>{widgetType.charAt(0).toUpperCase() + widgetType.slice(1)} Widget</h3>
      <p>Render #{renderCount} at {renderTime}</p>
      <p>Screen: {screenDimensions.width}px × {screenDimensions.height}px</p>
      <p>Connection: {isOnline ? 'Online' : 'Offline'}</p>
      <p>Touch: {hasTouch ? 'Supported' : 'Not supported'}</p>
      
      {shouldShowExtraInfo && (
        <div className="extra-info">
          <p>{randomMessage}</p>
          <p>Component ID: {componentId}</p>
        </div>
      )}
      
      <div className="widget-content">
        {widgetType === 'clock' && (
          <div>
            <h4>{currentTime.toLocaleTimeString()}</h4>
            <p>{isEvenSecond ? '⏰' : '🕐'}</p>
          </div>
        )}
        
        {widgetType === 'stats' && (
          <div>
            <p>Render count: {renderCount}</p>
            <p>Uptime: {Math.floor((Date.now() - new Date(renderTime).getTime()) / 1000)}s</p>
          </div>
        )}
        
        {widgetType === 'notifications' && (
          <div>
            <p>Check your notifications regularly</p>
            {currentTime.getMinutes() % 5 === 0 && <p>🔔 Time for a break!</p>}
          </div>
        )}
      </div>
      
      <footer style={{ color: `hsl(${(currentTime.getTime() / 1000) % 360}, 70%, 50%)` }}>
        Last updated: {currentTime.toLocaleString()}
      </footer>
    </div>
  );
}

// ===== BONUS: Correct Patterns for Common Scenarios =====

// ✅ Stable object creation with useMemo
function StableObjectComponent({ items }) {
  // Objects created once and memoized
  const processedItems = useMemo(() => 
    items.map((item, index) => ({
      ...item,
      id: `${item.name}-${index}`, // Deterministic ID
      displayName: item.name.toUpperCase()
    }))
  , [items]);

  const config = useMemo(() => ({
    theme: 'light', // Fixed theme, not random
    version: '1.0.0',
    features: ['feature1', 'feature2']
  }), []);

  return (
    <div data-config={JSON.stringify(config)}>
      {processedItems.map(item => (
        <div key={item.id}>
          {item.displayName}
        </div>
      ))}
    </div>
  );
}

// ✅ Proper external state management
function ExternalStateComponent() {
  const [config, setConfig] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(window.location.href);

  // Get external state once on mount
  useEffect(() => {
    setConfig(window.APP_CONFIG);
  }, []);

  // Listen for URL changes properly
  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrl(window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div>
      <p>Config: {config ? JSON.stringify(config) : 'Loading...'}</p>
      <p>Current URL: {currentUrl}</p>
    </div>
  );
}

// ✅ Proper side effect management
function SideEffectComponent({ data }) {
  // All side effects in useEffect
  useEffect(() => {
    document.body.className = data.theme;
    
    return () => {
      document.body.className = ''; // Cleanup
    };
  }, [data.theme]);

  useEffect(() => {
    window.history.pushState({}, '', `/page/${data.id}`);
  }, [data.id]);

  useEffect(() => {
    localStorage.setItem('lastData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    // Track component renders (analytics)
    fetch('/api/track', {
      method: 'POST',
      body: JSON.stringify({ event: 'component_render', data })
    }).catch(error => console.error('Tracking failed:', error));
  }, [data]);

  return <div>Data: {JSON.stringify(data)}</div>;
}

// ✅ ID generation pattern
function ComponentWithStableId({ name }) {
  // Generate stable ID once
  const [id] = useState(() => `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  
  return <div id={id}>Component: {name}</div>;
}

// ✅ Current time pattern
function CurrentTimeComponent() {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>Current time: {currentTime.toLocaleTimeString()}</p>
      <p>Formatted: {currentTime.toLocaleDateString()}</p>
    </div>
  );
}

/* 
KEY PRINCIPLES DEMONSTRATED:

1. **useState(() => value) for Initial Randomness**:
   - ✅ Good: useState(() => Math.random())
   - ❌ Bad: const random = Math.random() (in render)

2. **useEffect for Side Effects**:
   - DOM manipulation
   - localStorage/sessionStorage
   - API calls
   - Event listeners
   - Document title changes

3. **useMemo for Expensive Pure Calculations**:
   - Object creation that should be stable
   - Complex computations based on props/state
   - Derived data that's expensive to calculate

4. **State for External Mutable Values**:
   - Current time → useState + setInterval
   - Window dimensions → useState + resize listener
   - Online status → useState + online/offline listeners

5. **Benefits of Pure Render Functions**:
   - Predictable output for same inputs
   - Easier testing and debugging
   - Better performance optimization
   - No unexpected side effects
   - Consistent behavior across renders

COMMON PATTERNS:

1. **Time-based UI**: Store current time in state, update with useEffect + setInterval
2. **Random values**: Generate once with useState(() => Math.random())
3. **External APIs**: Fetch in useEffect, store result in state
4. **Window properties**: Store in state, update with event listeners
5. **Stable IDs**: Generate once with useState(() => generateId())

ANTI-PATTERNS TO AVOID:
- ❌ Math.random() in render
- ❌ new Date() in render
- ❌ window.* properties in render
- ❌ API calls in render
- ❌ DOM manipulation in render
- ❌ localStorage access in render
- ❌ console.log in render (for production)

TESTING BENEFITS:
- Pure render functions are easy to unit test
- Predictable output makes snapshot testing reliable  
- No side effects means no mocking required for render tests
- State-based time/random values can be controlled in tests
*/