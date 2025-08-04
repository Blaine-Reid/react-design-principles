# 🧠 React Design Principles Study Guide

A comprehensive study guide for mastering React design principles through hands-on practice. Each principle includes both problematic code examples (tests) and correct implementations (answers) with detailed explanations.

## 📁 Structure

```
design-principles/
├── README.md              # This file - study guide overview
├── principles.md           # Complete principles reference
├── tests/                  # Problematic code examples to fix
│   ├── locality-of-behavior-test.tsx
│   ├── derivable-state-test.tsx
│   ├── boolean-hell-test.tsx
│   ├── composition-over-configuration-test.tsx
│   ├── copy-over-abstraction-test.tsx
│   └── ui-pure-function-test.tsx
└── answers/               # Correct implementations with explanations
    ├── locality-of-behavior-answer.tsx
    ├── derivable-state-answer.tsx
    ├── boolean-hell-answer.tsx
    ├── composition-over-configuration-answer.tsx
    ├── copy-over-abstraction-answer.tsx
    └── ui-pure-function-answer.tsx
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Setup
```bash
# Clone or download this repository
cd design-principles

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start the development server (optional - for viewing the web interface)
npm run dev

# Type check the code
npm run type-check

# Run linting
npm run lint
```

### Development Commands
- `npm run dev` - Start Vite development server with web interface
- `npm run build` - Build for production
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## 🎯 How to Use This Study Guide

### 1. **Study the Principle** 
Read the relevant section in `principles.md` to understand the concept.

### 2. **Practice with Tests**
Open a test file and try to identify and fix the violations:
- **Easy**: Simple, obvious violations
- **Medium**: More complex scenarios with multiple issues
- **Hard**: Real-world complexity with interconnected problems

### 3. **Check Your Solution**
Compare your fixes with the answer files, which include:
- ✅ Correct implementations
- 📝 Detailed explanations of why the original code was problematic
- 🔥 Advanced patterns and best practices
- 🚫 Anti-patterns to avoid

### 4. **Test Your Understanding**
Try to explain the principle to someone else or write your own examples.

## 📋 Principles Covered

### Core React Patterns
1. **Locality of Behavior** - Keep related logic close to where it's used
2. **Derivable State** - Store only the source of truth, derive everything else
3. **Boolean Hell** - Use single status values instead of multiple boolean flags
4. **UI as Pure Function** - Make render output depend only on props and state
5. **Composition over Configuration** - Use JSX composition instead of prop configuration
6. **Copy over Abstraction** - Prefer copying JSX until abstraction provides real benefit

### Standard React Principles
6. **Single Source of Truth** - Shared state lives in one place
7. **Lifting State Up** - Move shared state to nearest common ancestor
8. **Controlled vs Uncontrolled** - Prefer controlled components
9. **Declarative over Imperative** - Describe what, not how
10. **Keys in Lists** - Use stable, unique keys for dynamic lists
11. **Effects for Side Effects** - Use useEffect only for external synchronization

### Additional Design Principles
12. **DRY (But Do It Right)** - Eliminate real duplication, not just similar-looking code
13. **Separation of Concerns** - Keep UI, business logic, and data access separate
14. **Fail Fast** - Detect and report errors early
15. **Principle of Least Surprise** - Follow conventions and expected behavior
16. **YAGNI** - Don't build functionality until you need it
17. **Open/Closed Principle** - Extend through composition, not modification

## 🏆 Difficulty Levels

### 🟢 **Easy**
- Single, clear violation
- Straightforward fix
- Good for beginners

### 🟡 **Medium** 
- Multiple related issues
- Requires understanding the broader pattern
- Real-world complexity

### 🔴 **Hard**
- Complex, interconnected problems
- Multiple principles violated
- Enterprise-level scenarios

## 💡 Study Tips

1. **Don't just copy the answers** - Understand the reasoning behind each fix
2. **Practice explaining** - Can you explain why the original code was problematic?
3. **Look for patterns** - Many violations stem from similar root causes
4. **Consider the context** - Rules aren't absolute; understand when to bend them
5. **Start simple** - Master easy examples before tackling complex ones

## 🧪 Testing Your Knowledge

After studying, try these challenges:

1. **Code Review**: Look at your own React code - can you spot these violations?
2. **Refactoring**: Take a complex component and apply these principles
3. **Teaching**: Explain these principles to a colleague
4. **Writing**: Create your own examples of good vs bad code

## 📚 Additional Resources

- [React Official Docs](https://react.dev/)
- [React Patterns](https://reactpatterns.com/)
- [Kent C. Dodds Blog](https://kentcdodds.com/blog)
- [Dan Abramov's Blog](https://overreacted.io/)

## 🎓 Mastery Checklist

- [ ] Can identify all principle violations in test files
- [ ] Can explain the reasoning behind each fix
- [ ] Can apply principles to your own code
- [ ] Can teach principles to others
- [ ] Can create your own examples

---

**Remember**: These principles are guidelines, not absolute rules. The goal is to write maintainable, readable, and reliable React code. Sometimes breaking a principle is the right choice - just make sure you understand why!