# 🧠 React Principles Study Guide

A curated list of design principles to help write better, cleaner, more maintainable React code.

---

## 📖 Table of Contents

## ⚛️ [Core React Principles](#-core-react-principles)
1. [UI is a Pure Function of State](#1-ui-is-a-pure-function-of-state)
2. [Single Source of Truth](#2-single-source-of-truth)
3. [Lifting State Up](#3-lifting-state-up)
4. [Controlled vs Uncontrolled Components](#4-controlled-vs-uncontrolled-components)
5. [Declarative over Imperative](#5-declarative-over-imperative)
6. [Keys in Lists](#6-keys-in-lists)
7. [Effects are for Side Effects](#7-effects-are-for-side-effects)

---

## 🎯 [React Design Patterns & Practices](#react-design-patterns--practices)
1. [Locality of Behavior > Reusability](#1-locality-of-behavior--reusability)
2. [Co-locate Until It Hurts](#2-co-locate-until-it-hurts)
3. [Composition > Configuration](#3-composition--configuration)
4. [Copy > Abstraction](#4-copy--abstraction)
5. [Avoid Boolean Hell](#5-avoid-boolean-hell)
6. [Make State Derivable Whenever Possible](#6-make-state-derivable-whenever-possible)
7. [Prefer Explicitness Over Generality](#7-prefer-explicitness-over-generality)
8. [Minimize Context Usage](#8-minimize-context-usage)
9. [Use Reducers for Complex State](#9-use-reducers-for-complex-state)
10. [Hooks Encapsulate Behavior, Not Just State](#10-hooks-encapsulate-behavior-not-just-state)
11. [Render Props > HOCs (for logic sharing)](#11-render-props--hocs-for-logic-sharing)

---

## 🔧 [General Software Design Principles](#-general-software-design-principles-1)
1. [Defensive Programming](#1-defensive-programming)
2. [Immutability / Pure Functions](#2-immutability--pure-functions)
3. [Interface Segregation (for Props)](#3-interface-segregation-for-props)
4. [Separation of Concerns](#4-separation-of-concerns)
5. [DRY - But Do It Right](#5-dry---but-do-it-right)
6. [Open/Closed Principle](#6-open-closed-principle)
7. [Fail Fast Principle](#7-fail-fast-principle)
8. [Principle of Least Surprise](#8-principle-of-least-surprise)
9. [You Aren’t Gonna Need It (YAGNI)](#9-you-arent-gonna-need-it-yagni)
10. [Optimize for Change, Not Reuse](#10-optimize-for-change-not-reuse)
11. [The Pit of Success](#11-the-pit-of-success)

---

## 🧪 [Testing Principles](#-testing-principles)
1. [Test Behavior, Not Implementation](#1-test-behavior-not-implementation)
2. [Component Contracts > Coverage](#2-component-contracts--coverage)
3. [Don't Test Styles or Implementation Details](#3-dont-test-styles-or-implementation-details)
4. [Test Error States and Edge Cases](#4-test-error-states-and-edge-cases)
5. [Use Realistic Test Data](#5-use-realistic-test-data)
6. [Mock External Dependencies, Not Internal Logic](#6-mock-external-dependencies-not-internal-logic)


---

## 🌊 [UX/UI Design Principles]()
1. [State Drives UI, But Transitions Drive UX](#1-state-drives-ui-but-transitions-drive-ux)
2. [Skeletons Over Spinners](#2-skeletons-over-spinners)
3. [Progressive Enhancement](#3-progressive-enhancement)
4. [Portals for Escaping DOM Hierarchy](#4-portals-for-escaping-dom-hierarchy)

---

## 🧠 [Mental Models](#-mental-models)
1. [Smart/Dumb Component Split Isn't Sacred](#smartdumb-component-split-isnt-sacred)
2. [Prefer Composition Over Inheritance (React-style)](#prefer-composition-over-inheritance-react-style)

---

## 📖 Design Principles Overview

This guide provides a comprehensive overview of design principles that enhance React development. It covers both core React patterns and general software design principles, offering practical examples and key takeaways for each principle.

These principles are designed to improve code maintainability, readability, and developer experience. They are not strict rules but guidelines that can help you make better design decisions in your React applications.

---

## 📘 Core React Principles

These 8 patterns represent modern React best practices that prioritize maintainability and developer experience.

---

### 1. UI is a Pure Function of State

**🔍 What it means:**  
Your component's render output should depend only on props and state — no side effects or non-determinism.

**✅ Good:**
```jsx
function RandomQuote({ quotes }) {
  const [selectedIndex] = useState(() => Math.floor(Math.random() * quotes.length));
  return <p>{quotes[selectedIndex].text}</p>;
}
```

**❌ Bad:**
```jsx
function RandomQuote({ quotes }) {
  const randomIndex = Math.floor(Math.random() * quotes.length); // Changes every render!
  return <p>{quotes[randomIndex].text}</p>;
}
```

**📌 Key Takeaways:**
- Use `useState(() => ...)` to create stable values
- Avoid randomness, time, or external values in render logic
- Side effects belong in `useEffect`, not render

---

### 2. Single Source of Truth

**🔍 What it means:**  
State should live in one place — the closest common ancestor of all components that use it.

**✅ Good:**
```jsx
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Counter count={count} setCount={setCount} />
      <Display count={count} />
    </div>
  );
}
```

**❌ Bad:**
```jsx
// Duplicated state in siblings
<ComponentA /> // has its own count
<ComponentB /> // has its own count - can get out of sync!
```

**📌 Key Takeaways:**
- Prevents out-of-sync bugs
- Enables predictable updates and debugging
- Makes data flow easier to trace

---

### 3. Lifting State Up

**🔍 What it means:**  
When multiple components need access to the same state, move that state to their nearest shared parent.

**✅ Good:**
```jsx
function Parent() {
  const [value, setValue] = useState('');
  return (
    <div>
      <Input value={value} onChange={setValue} />
      <Preview value={value} />
    </div>
  );
}
```

**❌ Bad:**
```jsx
// State trapped in one component
<Input /> // manages its own value
<Preview /> // no way to access the input value
```

**📌 Key Takeaways:**
- Keeps data flow unidirectional
- Makes behavior easier to trace and debug
- Enables component communication through shared state

---

### 4. Controlled vs Uncontrolled Components

**🔍 What it means:**  
A controlled component's state is managed by React via props, while an uncontrolled component uses refs or the DOM.

**✅ Good (Controlled):**
```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  return (
    <input 
      value={email} 
      onChange={e => setEmail(e.target.value)} 
    />
  );
}
```

**❌ Bad (Uncontrolled):**
```jsx
function LoginForm() {
  return <input defaultValue="hello" />; // React doesn't control the value
}
```

**📌 Key Takeaways:**
- Prefer controlled components for forms
- Gives you full control over validation and state
- Use uncontrolled only for performance or library constraints

---

### 5. Declarative over Imperative

**🔍 What it means:**  
Describe what the UI should look like based on state — not how to manually update it.

**✅ Good (Declarative):**
```jsx
function Modal({ isOpen }) {
  return (
    <div>
      {isOpen && <div className="modal">Modal Content</div>}
    </div>
  );
}
```

**❌ Bad (Imperative):**
```jsx
function Modal({ isOpen }) {
  const modalRef = useRef();
  
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.show();
    } else {
      modalRef.current?.hide();
    }
  }, [isOpen]);
  
  return <div ref={modalRef} className="modal">Modal Content</div>;
}
```

**📌 Key Takeaways:**
- React re-renders based on state changes
- Let the render function describe the UI
- Avoid manual DOM manipulation

---

### 6. Keys in Lists

**🔍 What it means:**  
Always use stable, unique keys when rendering dynamic lists.

**✅ Good:**
```jsx
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}
```

**❌ Bad:**
```jsx
{users.map((user, index) => (
  <UserCard key={index} user={user} /> // Index is not stable!
))}
```

**📌 Key Takeaways:**
- Helps React track elements across renders efficiently
- Prevents bugs in animations and input states
- Use stable, unique identifiers, not array indices

---

### 7. Effects are for Side Effects

**🔍 What it means:**  
Use `useEffect` only for logic that has to happen outside rendering — like subscriptions, data fetching, and DOM manipulation.

**✅ Good:**
```jsx
useEffect(() => {
  const subscription = api.subscribe(data);
  return () => subscription.unsubscribe();
}, []);
```

**❌ Bad:**
```jsx
const [count, setCount] = useState(0);
const [doubleCount, setDoubleCount] = useState(0);

useEffect(() => {
  setDoubleCount(count * 2); // This should be derived!
}, [count]);
```

**📌 Key Takeaways:**
- Avoid using effects to set derived state
- Effects are for synchronization with the outside world
- Most "effects" can be replaced with derived state or event handlers

---

## React Design Patterns & Practices

### 1. Locality of Behavior > Reusability

**🔍 What it means:**  
Keep related logic, state, and styles as close as possible to where they're used, even if it means some duplication.

**✅ Good:**
```jsx
// Inside UserCard.tsx
function UserCard({ user }) {
  const isVerified = user.badges.includes('verified');
  return <div>{isVerified && <VerifiedBadge />}</div>;
}
```

**❌ Bad:**
```jsx
// Extracted too early
import { isVerified } from '@/utils/user';

function UserCard({ user }) {
  return <div>{isVerified(user) && <VerifiedBadge />}</div>;
}
```

**📌 Key Takeaways:**
- Only extract shared code when it's used in multiple places
- Optimize for readability and maintainability, not preemptive DRY
- Co-location makes code easier to understand and modify

---

### 2. Co-locate Until It Hurts

**🔍 What it means:**  
Keep helpers, styles, and state logic with the component that uses them — don't extract too early.

**✅ Good:**
```jsx
// Inside ProductCard.tsx
function ProductCard({ product }) {
  const isOnSale = product.discount > 0; // Simple logic stays here
  const salePrice = product.price * (1 - product.discount);
  
  return (
    <div>
      <h3>{product.name}</h3>
      {isOnSale && <span>Sale: ${salePrice}</span>}
    </div>
  );
}
```

**❌ Bad:**
```jsx
// utils/products.ts - only used in one place!
export const isOnSale = (product) => product.discount > 0;
export const calculateSalePrice = (product) => product.price * (1 - product.discount);
```

**📌 Key Takeaways:**
- Don't abstract for its own sake
- Extract only when reuse, testing, or complexity demand it
- Premature abstraction is harder to understand than duplication

---

### 3. Composition > Configuration

**🔍 What it means:**  
Favor using JSX composition (children and slots) instead of passing props to configure behavior.

**✅ Good:**
```jsx
<Card>
  <CardHeader>
    <h2>User Profile</h2>
    <Button>Edit</Button>
  </CardHeader>
  <CardBody>
    <UserInfo user={user} />
  </CardBody>
</Card>
```

**❌ Bad:**
```jsx
<Card 
  title="User Profile"
  headerActions={[{ label: "Edit", onClick: handleEdit }]}
  content={<UserInfo user={user} />}
/>
```

**📌 Key Takeaways:**
- Composition is more flexible and readable
- Works better when children need layout, styles, or interactivity
- Easier to extend without modifying the parent component

---

### 4. Copy > Abstraction

**🔍 What it means:**  
Prefer copying JSX over abstracting into reusable components until the abstraction provides real benefit.

**✅ Good:**
```jsx
// Three similar but distinct components
function EmailVerification({ email, onVerify }) {
  return (
    <div className="verification-item">
      <span>📧</span>
      <span>{email}</span>
      <button onClick={onVerify}>Send Email</button>
    </div>
  );
}

function PhoneVerification({ phone, onVerify }) {
  return (
    <div className="verification-item">
      <span>📱</span>
      <span>{phone}</span>
      <button onClick={onVerify}>Send SMS</button>
    </div>
  );
}
```

**❌ Bad:**
```jsx
// Over-abstracted generic component
function VerificationItem({ type, value, onVerify }) {
  const icon = type === 'email' ? '📧' : '📱';
  const buttonText = type === 'email' ? 'Send Email' : 'Send SMS';
  
  return (
    <div className="verification-item">
      <span>{icon}</span>
      <span>{value}</span>
      <button onClick={onVerify}>{buttonText}</button>
    </div>
  );
}
```

**📌 Key Takeaways:**
- Abstractions introduce indirection and friction
- Copy-paste is fine until the pattern stabilizes
- Extract only when duplication causes real pain

---

### 5. Avoid Boolean Hell

**🔍 What it means:**  
Avoid juggling multiple booleans for related UI states. Prefer single status values or enums.

**✅ Good:**
```jsx
type Status = 'idle' | 'loading' | 'success' | 'error';
const [status, setStatus] = useState<Status>('idle');

return (
  <div>
    {status === 'loading' && <Spinner />}
    {status === 'success' && <SuccessMessage />}
    {status === 'error' && <ErrorMessage />}
  </div>
);
```

**❌ Bad:**
```jsx
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);

// Risk of impossible states: isLoading && isSuccess
```

**📌 Key Takeaways:**
- Use strings or discriminated unions for mutually exclusive states
- Prevents impossible or contradictory combinations
- Makes state transitions explicit and predictable

---

### 6. Make State Derivable Whenever Possible

**🔍 What it means:**  
Don't store values in state that can be calculated from props or other state.

**✅ Good:**
```jsx
const [cartItems, setCartItems] = useState<Item[]>([]);
const cartCount = cartItems.length; // Derived!
const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
```

**❌ Bad:**
```jsx
const [cartItems, setCartItems] = useState<Item[]>([]);
const [cartCount, setCartCount] = useState(0);
const [totalPrice, setTotalPrice] = useState(0);

useEffect(() => {
  setCartCount(cartItems.length);
  setTotalPrice(cartItems.reduce((sum, item) => sum + item.price, 0));
}, [cartItems]);
```

**📌 Key Takeaways:**
- Store the source of truth, derive everything else
- Fewer state variables = fewer bugs
- Eliminates synchronization issues between related state

---

### 7. Prefer Explicitness Over Generality

**🔍 What it means:**  
Make your components and props specific and intention-revealing — avoid over-generic abstractions.

**✅ Good:**
```jsx
<HeroSection />
<FeaturesSection />
<CTASection />
```

**❌ Bad:**
```jsx
<Section type="hero" />
<Section type="features" />
<Section type="cta" />
```

**📌 Key Takeaways:**
- If it's doing a specific job, name it that way
- Avoid config-driven "god components" unless there's real value
- Explicit components are easier to understand and modify

---

### 8. Minimize Context Usage

**🔍 What it means:**  
Use React Context sparingly for truly global state. Prefer prop drilling or state lifting for most component communication.

**✅ Good:**
```jsx
// Use context for truly global state
const ThemeContext = createContext();
const UserContext = createContext();

// Prop drilling for local state is often better
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  
  return (
    <div>
      <UserHeader user={user} />
      <UserContent user={user} onUpdate={setUser} />
    </div>
  );
}
```

**❌ Bad:**
```jsx
// Over-using context for local state
const UserContext = createContext();
const PostContext = createContext();
const CommentContext = createContext();
const LikeContext = createContext();

// Every piece of state gets its own context
```

**📌 Key Takeaways:**
- Context creates implicit dependencies that are hard to track
- Use for theme, authentication, language settings
- Prefer explicit prop passing for most component communication
- Context makes components harder to test and reuse

---

### 9. Use Reducers for Complex State

**🔍 What it means:**  
When state updates become complex or interdependent, useReducer can provide better organization than multiple useState calls.

**✅ Good:**
```jsx
function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  
  const addItem = (product) => dispatch({ type: 'ADD_ITEM', product });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id });
  const applyCoupon = (code) => dispatch({ type: 'APPLY_COUPON', code });
  
  return (
    <div>
      {state.items.map(item => (
        <CartItem key={item.id} item={item} onRemove={() => removeItem(item.id)} />
      ))}
      <Total amount={state.total} />
    </div>
  );
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      const newItems = [...state.items, action.product];
      return { ...state, items: newItems, total: calculateTotal(newItems) };
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.id);
      return { ...state, items: filteredItems, total: calculateTotal(filteredItems) };
    default:
      return state;
  }
}
```

**❌ Bad:**
```jsx
function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  
  // Complex interdependent updates scattered throughout
  const addItem = (product) => {
    const newItems = [...items, product];
    setItems(newItems);
    const newTotal = calculateSubtotal(newItems);
    setTotal(newTotal);
    setTax(newTotal * 0.08);
    // Easy to forget to update related state
  };
}
```

**📌 Key Takeaways:**
- Use for state with multiple sub-values that depend on each other
- Centralizes state update logic in one place
- Makes complex state transitions more predictable
- Better than multiple useState when updates are interdependent

---

### 10. Hooks Encapsulate Behavior, Not Just State

**🔍 What it means:**  
Custom hooks should package complete behaviors with their associated state, effects, and logic - not just stateful values.

**✅ Good:**
```jsx
// Complete behavior encapsulation
function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);
  
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  return { data, loading, error, refetch };
}
```

**❌ Bad:**
```jsx
// Just wrapping useState
function useCounter() {
  return useState(0);
}

function useToggle() {
  return useState(false);
}
```

**📌 Key Takeaways:**
- Custom hooks should solve complete problems
- Include related effects, computations, and event handlers
- Provide a clean API that hides implementation details
- Abstract entire behaviors, not just state management

---

### 11. Render Props > HOCs (for logic sharing)

**🔍 What it means:**  
When sharing stateful logic between components, prefer render props pattern over Higher-Order Components for better flexibility and composition.

**✅ Good:**
```jsx
// Render props pattern
function DataProvider({ endpoint, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [endpoint]);
  
  return children({ data, loading });
}

// Usage is explicit and flexible
<DataProvider endpoint="/api/users">
  {({ data, loading }) => (
    loading ? <Spinner /> : <UserList users={data} />
  )}
</DataProvider>
```

**❌ Bad:**
```jsx
// HOC pattern (less flexible)
function withData(WrappedComponent, endpoint) {
  return function DataHOC(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      fetch(endpoint)
        .then(res => res.json())
        .then(setData)
        .finally(() => setLoading(false));
    }, []);
    
    return <WrappedComponent {...props} data={data} loading={loading} />;
  };
}

// Usage is implicit and inflexible
const UserListWithData = withData(UserList, '/api/users');
```

**📌 Key Takeaways:**
- Render props make data flow explicit
- Better composition and flexibility than HOCs
- Easier to understand where props come from
- Modern React prefers hooks over both patterns

---

## 🧠 General Software Design Principles

These principles apply to software design in general, but are particularly relevant for React applications.

### 1. Defensive Programming

**🔍 What it means:**  
Code should handle unexpected inputs and edge cases gracefully, preventing crashes and providing meaningful feedback.

**✅ Good:**
```jsx
function UserList({ users = [] }) {
  // Guard against invalid data
  if (!Array.isArray(users)) {
    console.warn('UserList: users prop should be an array, received:', typeof users);
    return <div className="error">Invalid user data provided</div>;
  }
  
  // Handle empty state
  if (users.length === 0) {
    return <div className="empty-state">No users found</div>;
  }
  
  return (
    <ul>
      {users.map(user => (
        <li key={user?.id || `fallback-${Math.random()}`}>
          {user?.name || 'Unknown User'}
          {user?.email && <span> ({user.email})</span>}
        </li>
      ))}
    </ul>
  );
}
```

**❌ Bad:**
```jsx
function UserList({ users }) {
  // No validation - will crash if users is not array
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}> {/* Crashes if user.id is undefined */}
          {user.name} ({user.email}) {/* Crashes if properties missing */}
        </li>
      ))}
    </ul>
  );
}
```

**📌 Key Takeaways:**
- Always validate props and data structures
- Provide meaningful fallbacks and error messages
- Handle loading states, empty states, and error states
- Use TypeScript to catch errors at compile time

---

### 2. Immutability / Pure Functions

**🔍 What it means:**  
Avoid mutating data directly. Instead, create new objects/arrays with the desired changes.

**✅ Good:**
```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    const newTodo = { id: Date.now(), text, completed: false };
    setTodos(prevTodos => [...prevTodos, newTodo]); // New array
  };
  
  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id 
          ? { ...todo, completed: !todo.completed } // New object
          : todo
      )
    );
  };
  
  const removeTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id)); // New array
  };
}
```

**❌ Bad:**
```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    const newTodo = { id: Date.now(), text, completed: false };
    todos.push(newTodo); // Mutates original array!
    setTodos(todos);
  };
  
  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    todo.completed = !todo.completed; // Mutates original object!
    setTodos([...todos]);
  };
}
```

**📌 Key Takeaways:**
- Use spread operator (`...`) for arrays and objects
- Use array methods like `map`, `filter`, `concat` instead of `push`, `splice`
- Immutability enables React's optimization and prevents bugs
- Consider using libraries like Immer for complex nested updates

---

### 3. Interface Segregation (for Props)

**🔍 What it means:**  
Components shouldn't depend on props they don't use. Keep prop interfaces focused and minimal.

**✅ Good:**
```jsx
// Focused interfaces
interface UserDisplayProps {
  name: string;
  email: string;
  avatar?: string;
}

interface UserActionsProps {
  userId: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

// Components only receive what they need
function UserDisplay({ name, email, avatar }: UserDisplayProps) {
  return (
    <div className="user-display">
      {avatar && <img src={avatar} alt={name} />}
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}

function UserActions({ userId, onEdit, onDelete }: UserActionsProps) {
  return (
    <div className="user-actions">
      <button onClick={() => onEdit(userId)}>Edit</button>
      <button onClick={() => onDelete(userId)}>Delete</button>
    </div>
  );
}
```

**❌ Bad:**
```jsx
// Fat interface with unused props
interface UserCardProps {
  user: User;              // Contains 20+ properties
  products: Product[];     // Not used in this component
  settings: Settings;      // Not used
  permissions: Permission[]; // Not used
  theme: Theme;           // Not used
  onSave: () => void;     // Not used
  onCancel: () => void;   // Not used
  onEdit: (id: string) => void;    // Only these two are used
  onDelete: (id: string) => void;  // Only these two are used
}

function UserCard(props: UserCardProps) {
  // Component only uses user.name, user.email, onEdit, and onDelete
  // But receives 10+ unused props
  return (
    <div>
      <h3>{props.user.name}</h3>
      <p>{props.user.email}</p>
      <button onClick={() => props.onEdit(props.user.id)}>Edit</button>
      <button onClick={() => props.onDelete(props.user.id)}>Delete</button>
    </div>
  );
}
```

**📌 Key Takeaways:**
- Create focused prop interfaces for specific use cases
- Avoid passing entire objects when only few properties are needed
- Use composition to combine focused components
- Easier testing and better performance with fewer props

---

### 4. Separation of Concerns

**🔍 What it means:**  
Keep different responsibilities in different places - UI logic, business logic, and data access should be separate.

**✅ Good:**
```jsx
// Component handles UI only
function UserProfile({ userId }) {
  const user = useUser(userId); // Custom hook handles data
  return <div>{user?.name}</div>;
}

// Hook handles data fetching
function useUser(id) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);
  return user;
}
```

**❌ Bad:**
```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Mixing API calls with UI component
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  return <div>{user?.name}</div>;
}
```

**📌 Key Takeaways:**
- Components focus on rendering
- Custom hooks handle business logic and data fetching
- Utility functions handle pure calculations

---

### 5. DRY - But Do It Right

**🔍 What it means:**  
Eliminate duplication, but only when it actually reduces complexity and improves maintainability.

**✅ Good:**
```jsx
// Shared logic used in 3+ components
const useApi = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  // Complex API logic here
  return { data, loading, refetch };
};
```

**❌ Bad:**
```jsx
// Extracting one-off logic just because it "looks similar"
const formatUserName = (first, last) => `${first} ${last}`;
```

**📌 Key Takeaways:**
- Extract when you have genuine duplication (3+ uses)
- Don't extract just because code "looks similar"
- Sometimes duplication is better than the wrong abstraction

---

### 6. Open Closed Principle

**🔍 What it means:**  
Components should be open for extension but closed for modification. Use composition and props to extend behavior.

**✅ Good:**
```jsx
function Dialog({ children, actions }) {
  return (
    <div className="dialog">
      <div className="dialog-content">{children}</div>
      <div className="dialog-actions">{actions}</div>
    </div>
  );
}

// Extended through composition
<Dialog actions={<Button>OK</Button>}>
  <p>Are you sure you want to delete this item?</p>
</Dialog>
```

**❌ Bad:**
```jsx
function Dialog({ message, showOk, showCancel, onOk, onCancel }) {
  // Modifying component for every new use case
  return (
    <div className="dialog">
      <p>{message}</p>
      <div>
        {showOk && <button onClick={onOk}>OK</button>}
        {showCancel && <button onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}
```

**📌 Key Takeaways:**
- Design for extension through props and composition
- Avoid modifying existing components for new requirements
- Use render props or children for maximum flexibility

---

### 7. Fail Fast Principle

**🔍 What it means:**  
Detect and report errors as early as possible, preferably at development time.

**✅ Good:**
```jsx
function Button({ variant, children }) {
  if (!['primary', 'secondary', 'danger'].includes(variant)) {
    throw new Error(`Invalid variant: ${variant}. Must be primary, secondary, or danger.`);
  }
  return <button className={`btn btn-${variant}`}>{children}</button>;
}
```

**❌ Bad:**
```jsx
function Button({ variant, children }) {
  // Silently falls back, bug might go unnoticed
  const className = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return <button className={className}>{children}</button>;
}
```

**📌 Key Takeaways:**
- Use TypeScript for compile-time error catching
- Validate props and throw meaningful errors
- Use development-only warnings for common mistakes

---

### 8. Principle of Least Surprise

**🔍 What it means:**  
Components should behave the way users expect them to, following common patterns and conventions.

**✅ Good:**
```jsx
<Button onClick={handleClick} disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

**❌ Bad:**
```jsx
<Button pressHandler={handleClick} isNotActive={isLoading}>
  Submit
</Button>
```

**📌 Key Takeaways:**
- Use standard prop names (`onClick`, not `pressHandler`)
- Follow established React patterns and conventions
- Make behavior predictable and consistent

---

### 9. You Aren’t Gonna Need It (YAGNI)

**🔍 What it means:**  
Don't build functionality until you actually need it. Avoid over-engineering for hypothetical future requirements.

**✅ Good:**
```jsx
// Simple solution for current needs
function UserCard({ user }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

**❌ Bad:**
```jsx
// Over-engineered for imaginary future needs
function UserCard({ 
  user, 
  showAvatar = false,
  avatarSize = 'medium',
  titleLevel = 3,
  customRenderer,
  theme = 'default',
  layout = 'vertical'
}) {
  // Complex logic for unused features
}
```

**📌 Key Takeaways:**
- Solve today's problems, not tomorrow's maybes
- Add complexity when you have real requirements
- Refactor when you actually need the flexibility

---

### Optimize for Change, Not Reuse

### The Pit of Success

---

## 🧪 Testing Principles

Essential principles for testing React applications effectively.

### 1. Test Behavior, Not Implementation

**🔍 What it means:**  
Focus on testing what the component does for users, not how it does it internally.

**✅ Good:**
```jsx
test('shows error message when login fails', async () => {
  render(<LoginForm />);
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'user@example.com' }
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'wrongpassword' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
```

**❌ Bad:**
```jsx
test('calls setError when handleSubmit receives 401', () => {
  const mockSetError = jest.fn();
  useState.mockReturnValue(['', mockSetError]);
  
  const wrapper = shallow(<LoginForm />);
  wrapper.instance().handleSubmit({ /* mock event */ });
  
  expect(mockSetError).toHaveBeenCalledWith('Invalid credentials');
});
```

**📌 Key Takeaways:**
- Test user interactions and visible outcomes
- Avoid testing internal state or method calls
- Use React Testing Library over Enzyme for behavior-focused testing
- Tests should break when behavior changes, not implementation

---

### 2. Component Contracts > Coverage

**🔍 What it means:**  
Focus on testing the "contract" of your component (props in, behavior out) rather than achieving 100% line coverage.

**✅ Good:**
```jsx
describe('UserCard', () => {
  test('displays user information correctly', () => {
    const user = { name: 'John Doe', email: 'john@example.com', verified: true };
    render(<UserCard user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('✓ Verified')).toBeInTheDocument();
  });
  
  test('shows unverified state when user is not verified', () => {
    const user = { name: 'Jane Doe', email: 'jane@example.com', verified: false };
    render(<UserCard user={user} />);
    
    expect(screen.queryByText('✓ Verified')).not.toBeInTheDocument();
  });
  
  test('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    const user = { id: '123', name: 'John Doe', email: 'john@example.com' };
    
    render(<UserCard user={user} onEdit={mockOnEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(mockOnEdit).toHaveBeenCalledWith('123');
  });
});
```

**❌ Bad:**
```jsx
test('reaches 100% line coverage', () => {
  // Testing every single line regardless of value
  const wrapper = mount(<UserCard user={mockUser} />);
  wrapper.find('.user-name').simulate('click'); // Just to hit this line
  wrapper.find('.hidden-dev-method').simulate('click'); // Internal method
  expect(wrapper.state('internalFlag')).toBe(true); // Testing internal state
});
```

**📌 Key Takeaways:**
- Test all props and their effects on output
- Test all user interactions and their outcomes
- Test edge cases and error states
- Don't chase coverage metrics—chase confidence in your component's behavior

---

### 3. Don't Test Styles or Implementation Details

**🔍 What it means:**  
Avoid testing CSS styles, specific DOM structure, or internal implementation details. Focus on user-facing behavior instead.

**✅ Good:**
```jsx
test('shows success message when form is submitted successfully', async () => {
  render(<ContactForm />);
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText(/message/i), {
    target: { value: 'Hello world' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /send/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
  });
});
```

**❌ Bad:**
```jsx
test('applies correct CSS classes', () => {
  render(<Button variant="primary" />);
  const button = screen.getByRole('button');
  
  expect(button).toHaveClass('btn', 'btn-primary', 'btn-medium');
  expect(button).toHaveStyle('background-color: blue');
});

test('has correct DOM structure', () => {
  render(<UserCard user={mockUser} />);
  
  expect(container.querySelector('.user-card > .user-header > h3')).toBeInTheDocument();
  expect(container.querySelectorAll('.user-info > p')).toHaveLength(2);
});
```

**📌 Key Takeaways:**
- Styles are tested by visual regression or manual testing
- Test what users see and interact with, not how it's structured
- DOM structure is implementation detail, not user-facing behavior
- CSS classes are internal details users don't care about

---

### 4. Test Error States and Edge Cases

**🔍 What it means:**  
Ensure your components handle error conditions, loading states, empty data, and edge cases gracefully.

**✅ Good:**
```jsx
describe('UserList', () => {
  test('shows loading state while fetching users', () => {
    render(<UserList loading={true} users={[]} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  test('shows empty state when no users exist', () => {
    render(<UserList loading={false} users={[]} />);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });
  
  test('shows error message when fetch fails', () => {
    render(<UserList error="Failed to fetch users" />);
    expect(screen.getByText(/failed to fetch users/i)).toBeInTheDocument();
  });
  
  test('handles invalid user data gracefully', () => {
    const invalidUsers = [{ id: 1 }, { id: 2, name: null, email: undefined }];
    render(<UserList users={invalidUsers} />);
    
    expect(screen.getByText(/unknown user/i)).toBeInTheDocument();
  });
});
```

**❌ Bad:**
```jsx
test('renders users correctly', () => {
  const users = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ];
  
  render(<UserList users={users} />);
  
  expect(screen.getByText('John')).toBeInTheDocument();
  expect(screen.getByText('Jane')).toBeInTheDocument();
  // Only tests the happy path
});
```

**📌 Key Takeaways:**
- Test loading, error, and empty states
- Test with malformed or missing data
- Ensure graceful degradation
- Edge cases often reveal the most bugs

---

### 5. Use Realistic Test Data

**🔍 What it means:**  
Use test data that resembles real-world data rather than overly simplified mocks. Include edge cases in your test data.

**✅ Good:**
```jsx
const mockUsers = [
  {
    id: 'user-123',
    name: 'José María García-González',
    email: 'jose.maria.garcia@empresa-tecnologica.com',
    avatar: null,
    roles: ['admin', 'editor'],
    lastLogin: '2023-12-15T10:30:00Z',
    isActive: true
  },
  {
    id: 'user-456',
    name: '王小明',
    email: 'wang.xiaoming@example.cn',
    avatar: 'https://example.com/avatar.jpg',
    roles: [],
    lastLogin: null,
    isActive: false
  }
];

test('displays international names correctly', () => {
  render(<UserList users={mockUsers} />);
  expect(screen.getByText('José María García-González')).toBeInTheDocument();
  expect(screen.getByText('王小明')).toBeInTheDocument();
});
```

**❌ Bad:**
```jsx
const mockUsers = [
  { id: 1, name: 'User 1', email: 'user1@test.com' },
  { id: 2, name: 'User 2', email: 'user2@test.com' }
];

// Overly simplified data that doesn't reflect real-world complexity
```

**📌 Key Takeaways:**
- Include special characters, long strings, null values
- Test with realistic data volumes
- Use actual API response shapes
- Include edge cases like empty arrays, null values

---

### 6. Mock External Dependencies, Not Internal Logic

**🔍 What it means:**  
Mock external services, APIs, and third-party libraries, but avoid mocking your own application logic.

**✅ Good:**
```jsx
// Mock external API calls
jest.mock('../api/userService', () => ({
  fetchUsers: jest.fn(() => Promise.resolve(mockUsers)),
  createUser: jest.fn(() => Promise.resolve({ id: 'new-user' }))
}));

test('creates user when form is submitted', async () => {
  render(<UserForm />);
  
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'New User' }
  });
  fireEvent.click(screen.getByRole('button', { name: /save/i }));
  
  await waitFor(() => {
    expect(userService.createUser).toHaveBeenCalledWith({
      name: 'New User'
    });
  });
});
```

**❌ Bad:**
```jsx
// Mocking internal component logic
jest.mock('../components/UserForm', () => ({
  validateForm: jest.fn(() => true),
  formatUserData: jest.fn(data => data)
}));

// This tests the mock, not the actual component behavior
```

**📌 Key Takeaways:**
- Mock fetch, axios, third-party libraries
- Don't mock your own functions and components
- Mock at the boundaries of your system
- Prefer integration tests over heavily mocked unit tests

---

## 🌊 UX/UI Design Principles

These principles focus on user experience and interface design in React applications.

### 1. State Drives UI, But Transitions Drive UX

**🔍 What it means:**  
While state determines what's shown, thoughtful transitions and animations create a smooth, understandable user experience.

**✅ Good:**
```jsx
function SearchResults({ query, isLoading, results }) {
  return (
    <div className="search-results">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-state"
          >
            <Spinner />
            <p>Searching for "{query}"...</p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="results-list"
          >
            {results.map(result => (
              <ResultItem key={result.id} result={result} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

**❌ Bad:**
```jsx
function SearchResults({ query, isLoading, results }) {
  // Jarring instant state changes
  if (isLoading) return <Spinner />;
  return <div>{results.map(result => <ResultItem key={result.id} result={result} />)}</div>;
}
```

**📌 Key Takeaways:**
- Use meaningful transitions between states
- Give users visual feedback about what's happening
- Avoid sudden, jarring state changes
- Consider loading states, empty states, and error states

---

### 2. Skeletons Over Spinners

**🔍 What it means:**  
Show the structure of content while it loads instead of generic spinners to reduce perceived loading time.

**✅ Good:**
```jsx
function UserProfile({ userId }) {
  const { user, isLoading } = useUser(userId);
  
  if (isLoading) {
    return (
      <div className="user-profile">
        <div className="skeleton-avatar" />
        <div className="skeleton-text skeleton-name" />
        <div className="skeleton-text skeleton-email" />
        <div className="skeleton-text skeleton-bio" />
        <div className="skeleton-button" />
      </div>
    );
  }
  
  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.bio}</p>
      <button>Edit Profile</button>
    </div>
  );
}
```

**❌ Bad:**
```jsx
function UserProfile({ userId }) {
  const { user, isLoading } = useUser(userId);
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spinner />
        <p>Loading user profile...</p>
      </div>
    );
  }
  
  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.bio}</p>
      <button>Edit Profile</button>
    </div>
  );
}
```

**📌 Key Takeaways:**
- Skeleton screens feel faster than spinners
- Show the layout users will see once content loads
- Use progressive loading for complex UIs
- Match skeleton dimensions to actual content

---

### 3. Progressive Enhancement

**🔍 What it means:**  
Build features that work at a basic level and enhance with advanced functionality. Ensure core functionality works without JavaScript.

**✅ Good:**
```jsx
// Works without JavaScript, enhanced with React
function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target);
      await fetch('/api/contact', {
        method: 'POST',
        body: formData
      });
      setMessage('Message sent successfully!');
    } catch (error) {
      setMessage('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form 
      action="/api/contact" 
      method="POST" 
      onSubmit={handleSubmit}
    >
      <input 
        name="email" 
        type="email" 
        required 
        placeholder="Your email"
      />
      <textarea 
        name="message" 
        required 
        placeholder="Your message"
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
      {message && <p className="message">{message}</p>}
    </form>
  );
}
```

**❌ Bad:**
```jsx
// Completely breaks without JavaScript
function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = () => {
    // Only works with JavaScript
    fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ email, message })
    });
  };
  
  return (
    <div> {/* Not a real form! */}
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <textarea 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
      <div onClick={handleSubmit}>Send</div> {/* Not a button! */}
    </div>
  );
}
```

**📌 Key Takeaways:**
- Use proper HTML elements (`form`, `button`, `input`)
- Provide `action` and `method` attributes on forms
- Enhance with JavaScript, don't depend on it
- Better accessibility and SEO out of the box

---

### 4. Portals for Escaping DOM Hierarchy

**🔍 What it means:**  
Use React Portals to render modals, tooltips, and overlays outside the normal component tree when needed for styling or z-index issues.

**✅ Good:**
```jsx
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') // Renders at document root
  );
}

// In your component tree
function App() {
  return (
    <div className="app">
      <Header />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <ContentArea />
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <h2>Modal Content</h2>
        </Modal>
      </main>
    </div>
  );
}
```

**❌ Bad:**
```jsx
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  
  // Renders within normal component hierarchy
  // Can be clipped by parent containers or have z-index issues
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}
```

**📌 Key Takeaways:**
- Use portals for overlays that need to escape parent containers
- Portals help avoid z-index and overflow issues
- Modal content still receives props and context from its logical parent
- Remember to create the portal root element in your HTML

---

## 🧠 Mental Models

Important mental frameworks for thinking about React development.

### Smart/Dumb Component Split Isn't Sacred

**🔍 What it means:**  
Don't force artificial separations between "smart" (container) and "dumb" (presentational) components. Modern React with hooks makes this pattern less necessary.

**✅ Good:**
```jsx
// Modern approach: components handle their own data needs
function UserProfile({ userId }) {
  const { user, updateUser } = useUser(userId);
  const [isEditing, setIsEditing] = useState(false);
  
  if (isEditing) {
    return <UserForm user={user} onSave={updateUser} onCancel={() => setIsEditing(false)} />;
  }
  
  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </div>
  );
}
```

**❌ Bad:**
```jsx
// Overly rigid separation
function UserProfileContainer({ userId }) {
  const { user, updateUser } = useUser(userId);
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <UserProfilePresentation 
      user={user}
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={updateUser}
      onCancel={() => setIsEditing(false)}
    />
  );
}

// Unnecessary separation that just passes props through
function UserProfilePresentation({ user, isEditing, onEdit, onSave, onCancel }) {
  if (isEditing) {
    return <UserForm user={user} onSave={onSave} onCancel={onCancel} />;
  }
  
  return (
    <div className="user-profile">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}
```

**📌 Key Takeaways:**
- Separate when it provides real value, not for dogma
- Custom hooks extract logic better than container components
- Co-location often beats artificial separation
- Let components be responsible for their own concerns

---

### Prefer Composition Over Inheritance (React-style)

**🔍 What it means:**  
Use React's composition patterns (children, render props, compound components) instead of class inheritance or complex prop drilling.

**✅ Good:**
```jsx
// Composition with compound components
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
}

function CardActions({ children }) {
  return <div className="card-actions">{children}</div>;
}

// Flexible usage
<Card>
  <CardHeader>
    <h2>User Profile</h2>
  </CardHeader>
  <CardBody>
    <UserInfo user={user} />
  </CardBody>
  <CardActions>
    <Button variant="primary">Edit</Button>
    <Button variant="secondary">Delete</Button>
  </CardActions>
</Card>
```

**❌ Bad:**
```jsx
// Inheritance-like pattern
class BaseCard extends Component {
  render() {
    return (
      <div className="card">
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderActions()}
      </div>
    );
  }
  
  renderHeader() { throw new Error('Must implement renderHeader'); }
  renderBody() { throw new Error('Must implement renderBody'); }
  renderActions() { throw new Error('Must implement renderActions'); }
}

class UserCard extends BaseCard {
  renderHeader() { return <h2>User Profile</h2>; }
  renderBody() { return <UserInfo user={this.props.user} />; }
  renderActions() { return <Button>Edit</Button>; }
}
```

**📌 Key Takeaways:**
- React composition is more flexible than inheritance
- Use children, slots, and compound components
- Composition makes components more reusable and testable
- Avoid deep inheritance hierarchies

---

## 📖 Design Principles Overview

These design principles are intended to guide React developers in creating maintainable, readable, and efficient applications. They encompass both core React patterns and general software design principles, providing a framework for making informed decisions throughout the development process.

## 🧠 Quick Reference


### Decision Framework

**When to Extract Logic:**
1. Is it used in 3+ places? ✅ → Extract
2. Does it help with testing or isolation? ✅ → Extract  
3. Does it clarify intent, not obscure it? ✅ → Extract

**If yes to 2 or more:** extract. **Otherwise:** co-locate.

**When to Copy vs Abstract:**
- **Copy:** Similar-looking but different-purpose components
- **Copy:** One-off forms or layouts  
- **Copy:** When abstraction adds more complexity than it removes
- **Abstract:** Genuine reuse across 3+ components
- **Abstract:** Complex logic that benefits from isolation

---

*Remember: These principles are guidelines, not absolute rules. The goal is to write maintainable, readable, and reliable React code. Sometimes breaking a principle is the right choice - just make sure you understand why!*