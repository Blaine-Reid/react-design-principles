// BOOLEAN HELL - CORRECT IMPLEMENTATIONS
// This file shows how to use single status values instead of multiple boolean flags

import React, { useState, useCallback } from 'react';

// ===== EASY - FIXED =====
// ✅ SOLUTION: Use a single status enum instead of multiple booleans
// WHY: Loading states are mutually exclusive - you can't be loading AND successful simultaneously
type DataStatus = 'idle' | 'loading' | 'success' | 'error';

function DataFetcher() {
  const [status, setStatus] = useState<DataStatus>('idle');
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setStatus('loading');
    
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'success' && <p>Data loaded successfully!</p>}
      {status === 'error' && <p>Error loading data</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}

// ===== MEDIUM - FIXED =====
// ✅ SOLUTION: Use discriminated unions for validation and submission states
// WHY: Field validation states and submission states are each mutually exclusive
type FieldValidation = 'pending' | 'valid' | 'invalid';
type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error' | 'retrying';

function PaymentForm() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Single state for each field's validation status
  const [cardValidation, setCardValidation] = useState<FieldValidation>('pending');
  const [expiryValidation, setExpiryValidation] = useState<FieldValidation>('pending');
  const [cvvValidation, setCvvValidation] = useState<FieldValidation>('pending');
  
  // Single state for submission process
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');

  const validateCardNumber = (number: string) => {
    const isValid = number.length === 16 && /^\d+$/.test(number);
    setCardValidation(isValid ? 'valid' : 'invalid');
  };

  const validateExpiry = (date: string) => {
    const isValid = /^\d{2}\/\d{2}$/.test(date);
    setExpiryValidation(isValid ? 'valid' : 'invalid');
  };

  const validateCvv = (cvv: string) => {
    const isValid = cvv.length === 3 && /^\d+$/.test(cvv);
    setCvvValidation(isValid ? 'valid' : 'invalid');
  };

  const handleSubmit = async () => {
    setSubmissionStatus('submitting');
    
    try {
      await processPayment({ cardNumber, expiryDate, cvv });
      setSubmissionStatus('success');
    } catch (error) {
      setSubmissionStatus('error');
    }
  };

  const handleRetry = () => {
    setSubmissionStatus('retrying');
    setTimeout(() => handleSubmit(), 1000);
  };

  // Derive complex conditions from simple states
  const allFieldsValid = cardValidation === 'valid' && 
                        expiryValidation === 'valid' && 
                        cvvValidation === 'valid';
  
  const canSubmit = allFieldsValid && 
                   submissionStatus !== 'submitting' && 
                   submissionStatus !== 'retrying';

  const getFieldClassName = (validation: FieldValidation) => {
    switch (validation) {
      case 'valid': return 'success';
      case 'invalid': return 'error';
      default: return '';
    }
  };

  const getButtonText = () => {
    switch (submissionStatus) {
      case 'submitting': return 'Processing...';
      case 'retrying': return 'Retrying...';
      default: return 'Pay Now';
    }
  };

  return (
    <div>
      <input
        value={cardNumber}
        onChange={(e) => {
          setCardNumber(e.target.value);
          validateCardNumber(e.target.value);
        }}
        className={getFieldClassName(cardValidation)}
        placeholder="Card Number"
      />
      
      <input
        value={expiryDate}
        onChange={(e) => {
          setExpiryDate(e.target.value);
          validateExpiry(e.target.value);
        }}
        className={getFieldClassName(expiryValidation)}
        placeholder="MM/YY"
      />
      
      <input
        value={cvv}
        onChange={(e) => {
          setCvv(e.target.value);
          validateCvv(e.target.value);
        }}
        className={getFieldClassName(cvvValidation)}
        placeholder="CVV"
      />
      
      <button onClick={handleSubmit} disabled={!canSubmit}>
        {getButtonText()}
      </button>
      
      {submissionStatus === 'success' && <p>Payment successful!</p>}
      {submissionStatus === 'error' && (
        <div>
          <p>Payment failed</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}
    </div>
  );
}

// ===== HARD - FIXED =====
// ✅ SOLUTION: Use a comprehensive state machine for complex multi-step workflow
// WHY: Steps, validation, and navigation are all interdependent - one state models the entire flow

type WizardStep = 1 | 2 | 3 | 4;
type StepValidation = 'pending' | 'valid' | 'invalid';
type WizardStatus = 'active' | 'navigating' | 'submitting' | 'completed' | 'failed';

interface WizardState {
  currentStep: WizardStep;
  stepValidation: Record<WizardStep, StepValidation>;
  completedSteps: Set<WizardStep>;
  status: WizardStatus;
}

function MultiStepWizard() {
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    stepValidation: { 1: 'pending', 2: 'pending', 3: 'pending', 4: 'pending' },
    completedSteps: new Set(),
    status: 'active'
  });

  // Derived values from single state
  const { currentStep, stepValidation, completedSteps, status } = wizardState;
  const canGoNext = stepValidation[currentStep] === 'valid' && status === 'active';
  const canGoPrev = currentStep > 1 && status === 'active';
  const isCurrentStepComplete = completedSteps.has(currentStep);

  const updateWizardState = (updates: Partial<WizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }));
  };

  const navigateToStep = useCallback((targetStep: WizardStep) => {
    updateWizardState({ status: 'navigating' });
    
    setTimeout(() => {
      updateWizardState({
        currentStep: targetStep,
        completedSteps: new Set([...completedSteps, currentStep]),
        status: 'active'
      });
    }, 500);
  }, [currentStep, completedSteps]);

  const goNext = () => {
    if (currentStep < 4) {
      navigateToStep((currentStep + 1) as WizardStep);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      updateWizardState({ 
        currentStep: (currentStep - 1) as WizardStep,
        status: 'active'
      });
    }
  };

  const submitWizard = async () => {
    updateWizardState({ status: 'submitting' });
    
    try {
      await saveWizardData();
      updateWizardState({ 
        status: 'completed',
        completedSteps: new Set([1, 2, 3, 4])
      });
    } catch (error) {
      updateWizardState({ status: 'failed' });
    }
  };

  const validateStep = (step: WizardStep, isValid: boolean) => {
    updateWizardState({
      stepValidation: {
        ...stepValidation,
        [step]: isValid ? 'valid' : 'invalid'
      }
    });
  };

  const getStepClassName = (step: WizardStep) => {
    const classes = ['step'];
    
    if (step === currentStep) classes.push('active');
    if (completedSteps.has(step)) classes.push('complete');
    if (stepValidation[step] === 'invalid') classes.push('error');
    
    return classes.join(' ');
  };

  const getNavigationButtonText = () => {
    if (status === 'navigating') return 'Loading...';
    if (status === 'submitting') return 'Submitting...';
    if (currentStep === 4) return 'Submit';
    return 'Next';
  };

  return (
    <div>
      <div className="wizard-steps">
        {[1, 2, 3, 4].map(step => (
          <div key={step} className={getStepClassName(step as WizardStep)}>
            Step {step}
          </div>
        ))}
      </div>

      <div className="wizard-content">
        {currentStep === 1 && <div>Step 1 Content</div>}
        {currentStep === 2 && <div>Step 2 Content</div>}
        {currentStep === 3 && <div>Step 3 Content</div>}
        {currentStep === 4 && <div>Step 4 Content</div>}
      </div>

      <div className="wizard-navigation">
        {canGoPrev && (
          <button onClick={goBack} disabled={status !== 'active'}>
            Previous
          </button>
        )}
        
        {currentStep < 4 && (
          <button onClick={goNext} disabled={!canGoNext}>
            {getNavigationButtonText()}
          </button>
        )}
        
        {currentStep === 4 && (
          <button 
            onClick={submitWizard} 
            disabled={stepValidation[4] !== 'valid' || status === 'submitting'}
          >
            {status === 'submitting' ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>

      {status === 'completed' && <p>✅ Wizard completed successfully!</p>}
      {status === 'failed' && (
        <div>
          <p>❌ Submission failed. Please try again.</p>
          <button onClick={submitWizard}>Retry</button>
        </div>
      )}
    </div>
  );
}

// ===== BONUS: Advanced Pattern - State Machine with useReducer =====
// 🔥 For very complex state logic, consider useReducer with a proper state machine

type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

type AsyncAction<T> = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; data: T }
  | { type: 'FETCH_ERROR'; error: string }
  | { type: 'RESET' };

function asyncReducer<T>(state: AsyncState<T>, action: AsyncAction<T>): AsyncState<T> {
  switch (action.type) {
    case 'FETCH_START':
      return { status: 'loading' };
    case 'FETCH_SUCCESS':
      return { status: 'success', data: action.data };
    case 'FETCH_ERROR':
      return { status: 'error', error: action.error };
    case 'RESET':
      return { status: 'idle' };
    default:
      return state;
  }
}

function AdvancedAsyncComponent() {
  const [state, dispatch] = React.useReducer(asyncReducer, { status: 'idle' });

  const fetchData = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await fetch('/api/data').then(r => r.json());
      dispatch({ type: 'FETCH_SUCCESS', data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', error: error.message });
    }
  };

  return (
    <div>
      {state.status === 'idle' && <button onClick={fetchData}>Load Data</button>}
      {state.status === 'loading' && <p>Loading...</p>}
      {state.status === 'success' && (
        <div>
          <pre>{JSON.stringify(state.data, null, 2)}</pre>
          <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
        </div>
      )}
      {state.status === 'error' && (
        <div>
          <p>Error: {state.error}</p>
          <button onClick={fetchData}>Retry</button>
          <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
        </div>
      )}
    </div>
  );
}

// Mock functions for examples
async function processPayment(data: any) {
  return new Promise((resolve, reject) => {
    setTimeout(() => Math.random() > 0.5 ? resolve(data) : reject('Payment failed'), 1000);
  });
}

async function saveWizardData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => Math.random() > 0.3 ? resolve({}) : reject('Save failed'), 1000);
  });
}

/* 
KEY PRINCIPLES DEMONSTRATED:

1. **Use Enums/Unions for Mutually Exclusive States**:
   - ❌ Bad: isLoading, isSuccess, isError (can be inconsistent)
   - ✅ Good: status: 'idle' | 'loading' | 'success' | 'error'

2. **Model the Real-World State Machine**:
   - Think about what states are actually possible
   - Prevent impossible combinations at the type level
   - Make state transitions explicit and controlled

3. **Derive Complex Conditions from Simple States**:
   - Store simple enums, derive boolean flags when needed
   - Example: `const canSubmit = status === 'idle' && allFieldsValid`

4. **Use Discriminated Unions for Complex State**:
   - Each state can carry its own data
   - TypeScript ensures you handle all cases
   - Impossible states become unrepresentable

5. **Benefits of This Approach**:
   - Impossible states are unrepresentable
   - State transitions are explicit and controlled
   - Easier to reason about and test
   - Self-documenting code

WHEN TO USE EACH PATTERN:
- **Simple enum**: For basic mutually exclusive states (loading, success, error)
- **Discriminated union**: When different states need different data
- **State machine with useReducer**: For complex state logic with many transitions
- **Boolean flags**: Only when states are truly independent (like feature toggles)

ANTI-PATTERNS TO AVOID:
- ❌ Multiple booleans for mutually exclusive states
- ❌ Having to manually sync related boolean flags
- ❌ Checking multiple conditions to determine the "real" state
- ❌ Possible impossible states (isLoading && isSuccess)
*/