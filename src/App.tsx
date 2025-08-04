import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🧠 React Design Principles Study Guide</h1>
        <p>
          Welcome to the React Design Principles Study Guide!
        </p>
        
        <div className="study-instructions">
          <h2>How to Use This Study Guide</h2>
          <ol>
            <li>
              <strong>Study the Principle:</strong> Read the relevant section in <code>principles.md</code>
            </li>
            <li>
              <strong>Practice with Tests:</strong> Open a test file from the <code>tests/</code> directory and identify violations
            </li>
            <li>
              <strong>Check Your Solution:</strong> Compare your fixes with the answer files in <code>answers/</code>
            </li>
            <li>
              <strong>Test Your Understanding:</strong> Try to explain the principle to someone else
            </li>
          </ol>
        </div>

        <div className="principles-overview">
          <h2>📋 Principles Covered</h2>
          
          <div className="principle-category">
            <h3>Core React Patterns</h3>
            <ul>
              <li>Locality of Behavior</li>
              <li>Derivable State</li>
              <li>Boolean Hell</li>
              <li>UI as Pure Function</li>
              <li>Composition over Configuration</li>
              <li>Copy over Abstraction</li>
            </ul>
          </div>

          <div className="principle-category">
            <h3>Standard React Principles</h3>
            <ul>
              <li>Single Source of Truth</li>
              <li>Lifting State Up</li>
              <li>Controlled vs Uncontrolled</li>
              <li>Declarative over Imperative</li>
              <li>Keys in Lists</li>
              <li>Effects for Side Effects</li>
            </ul>
          </div>

          <div className="principle-category">
            <h3>Additional Design Principles</h3>
            <ul>
              <li>DRY (But Do It Right)</li>
              <li>Separation of Concerns</li>
              <li>Fail Fast</li>
              <li>Principle of Least Surprise</li>
              <li>YAGNI</li>
              <li>Open/Closed Principle</li>
            </ul>
          </div>
        </div>

        <div className="getting-started">
          <h2>🚀 Getting Started</h2>
          <p>
            Start by reading the <code>README.md</code> file for detailed instructions.
          </p>
          <p>
            Then explore the files in your IDE:
          </p>
          <ul>
            <li><code>tests/</code> - Code examples with violations to fix</li>
            <li><code>answers/</code> - Correct implementations with explanations</li>
            <li><code>principles.md</code> - Complete reference guide</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;