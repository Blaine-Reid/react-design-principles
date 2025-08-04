// UI AS PURE FUNCTION OF STATE TEST
// Fix the code violations below - each example has non-deterministic or side-effect-causing render logic
// GOAL: Make UI rendering depend only on props and state, no side effects or randomness

import React, { useState, useRef, useEffect } from 'react';

// ===== EASY =====
// Problem: Using Math.random() directly in render
function RandomQuote({ quotes }) {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];

  return (
    <div className="quote-display">
      <blockquote>"{selectedQuote.text}"</blockquote>
      <cite>- {selectedQuote.author}</cite>
      <button onClick={() => window.location.reload()}>
        New Quote
      </button>
    </div>
  );
}

// ===== MEDIUM =====
// Problem: Using Date.now() and other time-based values in render
function TimeBasedGreeting({ userName }) {
  const currentHour = new Date().getHours();
  const timestamp = Date.now();
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
  const formattedTime = new Date().toLocaleTimeString();
  
  let greeting;
  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  const daysSinceEpoch = Math.floor(timestamp / (1000 * 60 * 60 * 24));
  const backgroundHue = (daysSinceEpoch * 137.5) % 360; // Changes daily

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
      <small>Session ID: {Math.random().toString(36).substr(2, 9)}</small>
    </div>
  );
}

// ===== HARD =====
// Problem: Complex component with multiple sources of non-determinism and side effects
function DashboardWidget({ userId, widgetType }) {
  const componentId = `widget-${Math.random().toString(36).substr(2, 9)}`;
  const renderTime = new Date().toISOString();
  const renderCount = ++window.renderCounter || (window.renderCounter = 1);
  
  // Using external state that changes
  const screenWidth = window.innerWidth;
  const isOnline = navigator.onLine;
  const userAgent = navigator.userAgent;
  const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
  
  // Time-based calculations
  const now = new Date();
  const currentMonth = now.getMonth();
  const isEvenSecond = now.getSeconds() % 2 === 0;
  const timeBasedOpacity = Math.sin(now.getTime() / 10000) * 0.3 + 0.7;
  
  // Browser-dependent calculations
  const isMobile = /Mobi|Android/i.test(userAgent);
  const hasTouch = 'ontouchstart' in window;
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Side effects in render
  if (userId) {
    document.title = `Dashboard - User ${userId}`;
    localStorage.setItem('lastViewedWidget', widgetType);
    console.log(`Rendering widget ${widgetType} at ${renderTime}`);
  }
  
  // More randomness
  const shouldShowExtraInfo = Math.random() > 0.5;
  const randomMessage = [
    'Welcome back!',
    'Have a great day!',
    'You\'re doing awesome!',
    'Keep up the good work!'
  ][Math.floor(Math.random() * 4)];
  
  // External API calls in render (very bad!)
  if (widgetType === 'weather') {
    fetch('/api/weather')
      .then(response => response.json())
      .then(data => {
        // This will cause infinite re-renders
        document.getElementById(componentId)?.setAttribute('data-weather', data.temp);
      });
  }
  
  // DOM manipulation in render
  const existingElement = document.getElementById(componentId);
  if (existingElement) {
    existingElement.style.transform = `rotate(${Math.random() * 360}deg)`;
  }
  
  const themeBasedStyle = {
    backgroundColor: randomColor,
    opacity: timeBasedOpacity,
    transform: `scale(${pixelRatio})`,
    border: isOnline ? '2px solid green' : '2px solid red',
    borderRadius: isEvenSecond ? '10px' : '0px',
    fontSize: screenWidth > 768 ? '16px' : '14px',
    padding: isMobile ? '8px' : '16px',
    filter: currentMonth === 11 ? 'hue-rotate(120deg)' : 'none' // Christmas theme
  };

  return (
    <div 
      id={componentId}
      className={`dashboard-widget ${isMobile ? 'mobile' : 'desktop'}`}
      style={themeBasedStyle}
    >
      <h3>{widgetType.charAt(0).toUpperCase() + widgetType.slice(1)} Widget</h3>
      <p>Render #{renderCount} at {renderTime}</p>
      <p>Screen: {screenWidth}px wide</p>
      <p>Connection: {isOnline ? 'Online' : 'Offline'}</p>
      <p>Touch: {hasTouch ? 'Supported' : 'Not supported'}</p>
      
      {shouldShowExtraInfo && (
        <div className="extra-info">
          <p>{randomMessage}</p>
          <p>Random ID: {Math.random().toString(36)}</p>
        </div>
      )}
      
      <div className="widget-content">
        {widgetType === 'clock' && (
          <div>
            <h4>{now.toLocaleTimeString()}</h4>
            <p>{isEvenSecond ? '⏰' : '🕐'}</p>
          </div>
        )}
        
        {widgetType === 'stats' && (
          <div>
            <p>Random stat: {Math.floor(Math.random() * 1000)}</p>
            <p>Performance: {(Math.random() * 100).toFixed(1)}%</p>
          </div>
        )}
        
        {widgetType === 'notifications' && (
          <div>
            <p>You have {Math.floor(Math.random() * 10)} new notifications</p>
            {Math.random() > 0.7 && <p>🔔 New message!</p>}
          </div>
        )}
      </div>
      
      <footer style={{ color: `hsl(${Date.now() % 360}, 70%, 50%)` }}>
        Last updated: {new Date().toLocaleString()}
      </footer>
    </div>
  );
}

// Additional problematic patterns
function ProblematicPatterns() {
  // More examples of non-deterministic render logic
  
  // Problem: Accessing external mutable state
  const ExternalStateComponent = () => {
    const globalConfig = window.APP_CONFIG; // External mutable state
    const currentUrl = window.location.href; // Changes without React knowing
    
    return (
      <div>
        <p>Config: {JSON.stringify(globalConfig)}</p>
        <p>Current URL: {currentUrl}</p>
      </div>
    );
  };
  
  // Problem: Side effects in render
  const SideEffectComponent = ({ data }) => {
    // These are all side effects that shouldn't be in render!
    document.body.className = data.theme;
    window.history.pushState({}, '', `/page/${data.id}`);
    localStorage.setItem('lastData', JSON.stringify(data));
    
    // Network request in render - very bad!
    fetch('/api/track', {
      method: 'POST',
      body: JSON.stringify({ event: 'component_render', data })
    });
    
    return <div>Data: {JSON.stringify(data)}</div>;
  };
  
  // Problem: Creating objects/functions in render
  const ObjectCreationComponent = ({ items }) => {
    // New objects created on every render
    const processedItems = items.map(item => ({
      ...item,
      id: Math.random(), // Non-deterministic!
      timestamp: Date.now(), // Non-deterministic!
      processor: () => Math.random() // New function every render
    }));
    
    const config = {
      theme: Math.random() > 0.5 ? 'dark' : 'light',
      timestamp: new Date().toISOString(),
      sessionId: Math.random().toString(36)
    };
    
    return (
      <div data-config={JSON.stringify(config)}>
        {processedItems.map(item => (
          <div key={item.id} onClick={item.processor}>
            {item.name} - {item.timestamp}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <ExternalStateComponent />
      <SideEffectComponent data={{ theme: 'dark', id: 123 }} />
      <ObjectCreationComponent items={[{ name: 'Item 1' }, { name: 'Item 2' }]} />
    </div>
  );
}