# 🧠 React Design Principles – Study Guide

A comprehensive guide to essential React design principles for writing maintainable, scalable components. Each principle includes clear definitions, practical examples, and key takeaways.

---

## 📚 Table of Contents

1. [Core React Patterns](#-core-react-patterns)
2. [Standard React Principles](#-standard-react-principles) 
3. [Additional Design Principles](#-additional-design-principles)
4. [Quick Reference](#-quick-reference)

---

## 🎯 Core React Patterns

These 8 patterns represent modern React best practices that prioritize maintainability and developer experience.

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

### 2. Make State Derivable Whenever Possible

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

### 3. Avoid Boolean Hell

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

### 4. UI is a Pure Function of State

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

### 5. Co-locate Until It Hurts

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

### 6. Prefer Explicitness Over Generality

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

### 7. Composition > Configuration

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

### 8. Copy > Abstraction

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

## 📘 Standard React Principles

Foundational principles that are core to how React is designed to be used effectively.

### 1. Single Source of Truth

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

### 2. Lifting State Up

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

### 3. Controlled vs Uncontrolled Components

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

### 4. Declarative over Imperative

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

### 5. Keys in Lists

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

### 6. Effects are for Side Effects

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

## 🔧 Additional Design Principles

Essential software design principles that complement React patterns.

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

### 4. Progressive Enhancement

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

### 5. Minimize State Surface Area

**🔍 What it means:**  
Keep state as small and focused as possible. Derive values instead of storing them.

**✅ Good:**
```jsx
function ShoppingCart() {
  // Minimal state - only store what can't be derived
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  
  // All derived values
  const itemCount = items.length;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = couponCode === 'SAVE10' ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;
  const isEmpty = items.length === 0;
  const hasDiscount = discount > 0;
  
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
  
  return (
    <div>
      <h2>Shopping Cart ({itemCount} items)</h2>
      {isEmpty ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
          <div className="totals">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            {hasDiscount && <p>Discount: -${discount.toFixed(2)}</p>}
            <p>Tax: ${tax.toFixed(2)}</p>
            <p><strong>Total: ${total.toFixed(2)}</strong></p>
          </div>
        </>
      )}
    </div>
  );
}
```

**❌ Bad:**
```jsx
function ShoppingCart() {
  // Too much state - storing derived values
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [isEmpty, setIsEmpty] = useState(true);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  
  // Multiple useEffects to keep derived state in sync
  useEffect(() => {
    setItemCount(items.length);
    setIsEmpty(items.length === 0);
  }, [items]);
  
  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(newSubtotal);
  }, [items]);
  
  useEffect(() => {
    const newDiscount = couponCode === 'SAVE10' ? subtotal * 0.1 : 0;
    setDiscount(newDiscount);
    setHasDiscount(newDiscount > 0);
  }, [couponCode, subtotal]);
  
  useEffect(() => {
    const newTax = (subtotal - discount) * 0.08;
    setTax(newTax);
  }, [subtotal, discount]);
  
  useEffect(() => {
    setTotal(subtotal - discount + tax);
  }, [subtotal, discount, tax]);
  
  // Risk of state getting out of sync
}
```

**📌 Key Takeaways:**
- Only store data that cannot be calculated from other data
- Use derived values instead of useEffect for calculations
- Fewer state variables mean fewer bugs and easier debugging
- State should represent the minimum set of data needed

---

### 6. Don't Repeat Yourself (DRY) - But Do It Right

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

### 7. Separation of Concerns

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

### 8. Fail Fast Principle

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

### 9. Principle of Least Surprise

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

### 10. You Aren't Gonna Need It (YAGNI)

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

### 11. Open/Closed Principle (for Components)

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

## 🧠 Quick Reference

### Core React Patterns
| Principle | Core Idea |
|-----------|-----------|
| **Locality > Reuse** | Keep logic close until reuse demands it |
| **Derive State** | Store the source, not the symptoms |
| **Avoid Boolean Hell** | Use one status, not many flags |
| **UI = f(state)** | No randomness or side effects in render |
| **Co-locate Until It Hurts** | Don't extract early |
| **Explicitness > Generality** | Name things clearly, even if repeated |
| **Composition > Configuration** | Use JSX composition over prop config |
| **Copy > Abstraction** | Prefer clarity and locality over DRY |

### Standard React Principles
| Principle | Core Idea |
|-----------|-----------|
| **Single Source of Truth** | Keep shared state in one place |
| **Lifting State Up** | Move shared state to the closest parent |
| **Controlled > Uncontrolled** | Let React manage form state explicitly |
| **Declarative UI** | Describe UI based on state, not manual steps |
| **Use Keys in Lists** | Helps React know what changed |
| **Effects = Side Effects** | Don't use useEffect for render logic |

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