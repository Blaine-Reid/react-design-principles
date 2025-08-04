// BOOLEAN HELL TEST
// Fix the code violations below - each example uses multiple booleans for mutually exclusive states
// GOAL: Use single status values or discriminated unions instead of multiple boolean flags

import { useState } from 'react';

// ===== EASY =====
// Problem: Multiple booleans for loading states
function DataFetcher() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isSuccess && <p>Data loaded successfully!</p>}
      {isError && <p>Error loading data</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}

// ===== MEDIUM =====
// Problem: Complex form validation with multiple boolean states
function PaymentForm() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Boolean hell for validation states
  const [isCardNumberValid, setIsCardNumberValid] = useState(false);
  const [isCardNumberInvalid, setIsCardNumberInvalid] = useState(false);
  const [isExpiryValid, setIsExpiryValid] = useState(false);
  const [isExpiryInvalid, setIsExpiryInvalid] = useState(false);
  const [isCvvValid, setIsCvvValid] = useState(false);
  const [isCvvInvalid, setIsCvvInvalid] = useState(false);
  
  // Boolean hell for submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const validateCardNumber = (number: string) => {
    const isValid = number.length === 16 && /^\d+$/.test(number);
    setIsCardNumberValid(isValid);
    setIsCardNumberInvalid(!isValid);
  };

  const validateExpiry = (date: string) => {
    const isValid = /^\d{2}\/\d{2}$/.test(date);
    setIsExpiryValid(isValid);
    setIsExpiryInvalid(!isValid);
  };

  const validateCvv = (cvv: string) => {
    const isValid = cvv.length === 3 && /^\d+$/.test(cvv);
    setIsCvvValid(isValid);
    setIsCvvInvalid(!isValid);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsSubmitSuccess(false);
    setIsSubmitError(false);
    setIsRetrying(false);
    
    try {
      await processPayment({ cardNumber, expiryDate, cvv });
      setIsSubmitting(false);
      setIsSubmitSuccess(true);
    } catch (error) {
      setIsSubmitting(false);
      setIsSubmitError(true);
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setIsSubmitError(false);
    setTimeout(() => {
      setIsRetrying(false);
      handleSubmit();
    }, 1000);
  };

  return (
    <div>
      <input
        value={cardNumber}
        onChange={(e) => {
          setCardNumber(e.target.value);
          validateCardNumber(e.target.value);
        }}
        className={isCardNumberInvalid ? 'error' : isCardNumberValid ? 'success' : ''}
        placeholder="Card Number"
      />
      
      <input
        value={expiryDate}
        onChange={(e) => {
          setExpiryDate(e.target.value);
          validateExpiry(e.target.value);
        }}
        className={isExpiryInvalid ? 'error' : isExpiryValid ? 'success' : ''}
        placeholder="MM/YY"
      />
      
      <input
        value={cvv}
        onChange={(e) => {
          setCvv(e.target.value);
          validateCvv(e.target.value);
        }}
        className={isCvvInvalid ? 'error' : isCvvValid ? 'success' : ''}
        placeholder="CVV"
      />
      
      <button 
        onClick={handleSubmit}
        disabled={isSubmitting || isRetrying || !isCardNumberValid || !isExpiryValid || !isCvvValid}
      >
        {isSubmitting ? 'Processing...' : isRetrying ? 'Retrying...' : 'Pay Now'}
      </button>
      
      {isSubmitSuccess && <p>Payment successful!</p>}
      {isSubmitError && (
        <div>
          <p>Payment failed</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}
    </div>
  );
}

// ===== HARD =====
// Problem: Complex multi-step wizard with boolean chaos
function MultiStepWizard() {
  // Step management booleans
  const [isStep1Active, setIsStep1Active] = useState(true);
  const [isStep2Active, setIsStep2Active] = useState(false);
  const [isStep3Active, setIsStep3Active] = useState(false);
  const [isStep4Active, setIsStep4Active] = useState(false);
  
  // Step completion booleans
  const [isStep1Complete, setIsStep1Complete] = useState(false);
  const [isStep2Complete, setIsStep2Complete] = useState(false);
  const [isStep3Complete, setIsStep3Complete] = useState(false);
  const [isStep4Complete, setIsStep4Complete] = useState(false);
  
  // Step validation booleans
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep1Invalid, setIsStep1Invalid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);
  const [isStep2Invalid, setIsStep2Invalid] = useState(false);
  const [isStep3Valid, setIsStep3Valid] = useState(false);
  const [isStep3Invalid, setIsStep3Invalid] = useState(false);
  
  // Navigation state booleans
  const [canGoNext, setCanGoNext] = useState(false);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSkipAllowed, setIsSkipAllowed] = useState(false);
  
  // Submission booleans
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [canResubmit, setCanResubmit] = useState(false);

  const goToStep2 = () => {
    setIsNavigating(true);
    setTimeout(() => {
      setIsStep1Active(false);
      setIsStep2Active(true);
      setIsStep1Complete(true);
      setCanGoPrev(true);
      setIsNavigating(false);
    }, 500);
  };

  const goToStep3 = () => {
    setIsNavigating(true);
    setTimeout(() => {
      setIsStep2Active(false);
      setIsStep3Active(true);
      setIsStep2Complete(true);
      setIsNavigating(false);
    }, 500);
  };

  const goToStep4 = () => {
    setIsNavigating(true);
    setTimeout(() => {
      setIsStep3Active(false);
      setIsStep4Active(true);
      setIsStep3Complete(true);
      setCanGoNext(false);
      setIsNavigating(false);
    }, 500);
  };

  const goBack = () => {
    setIsNavigating(true);
    setTimeout(() => {
      if (isStep2Active) {
        setIsStep2Active(false);
        setIsStep1Active(true);
        setCanGoPrev(false);
      } else if (isStep3Active) {
        setIsStep3Active(false);
        setIsStep2Active(true);
      } else if (isStep4Active) {
        setIsStep4Active(false);
        setIsStep3Active(true);
        setCanGoNext(true);
      }
      setIsNavigating(false);
    }, 500);
  };

  const submitWizard = async () => {
    setIsSubmitting(true);
    setIsSubmitError(false);
    setCanResubmit(false);
    
    try {
      await saveWizardData();
      setIsSubmitting(false);
      setIsSubmitSuccess(true);
      setIsStep4Complete(true);
    } catch (error) {
      setIsSubmitting(false);
      setIsSubmitError(true);
      setCanResubmit(true);
    }
  };

  return (
    <div>
      <div className="wizard-steps">
        <div className={`step ${isStep1Active ? 'active' : ''} ${isStep1Complete ? 'complete' : ''}`}>
          Step 1
        </div>
        <div className={`step ${isStep2Active ? 'active' : ''} ${isStep2Complete ? 'complete' : ''}`}>
          Step 2
        </div>
        <div className={`step ${isStep3Active ? 'active' : ''} ${isStep3Complete ? 'complete' : ''}`}>
          Step 3
        </div>
        <div className={`step ${isStep4Active ? 'active' : ''} ${isStep4Complete ? 'complete' : ''}`}>
          Step 4
        </div>
      </div>

      <div className="wizard-content">
        {isStep1Active && <div>Step 1 Content</div>}
        {isStep2Active && <div>Step 2 Content</div>}
        {isStep3Active && <div>Step 3 Content</div>}
        {isStep4Active && <div>Step 4 Content</div>}
      </div>

      <div className="wizard-navigation">
        {canGoPrev && (
          <button onClick={goBack} disabled={isNavigating}>
            Previous
          </button>
        )}
        
        {canGoNext && isStep1Active && (
          <button onClick={goToStep2} disabled={!isStep1Valid || isNavigating}>
            Next
          </button>
        )}
        
        {canGoNext && isStep2Active && (
          <button onClick={goToStep3} disabled={!isStep2Valid || isNavigating}>
            Next
          </button>
        )}
        
        {canGoNext && isStep3Active && (
          <button onClick={goToStep4} disabled={!isStep3Valid || isNavigating}>
            Next
          </button>
        )}
        
        {isStep4Active && (
          <button 
            onClick={submitWizard} 
            disabled={isSubmitting || (!canResubmit && isSubmitError)}
          >
            {isSubmitting ? 'Submitting...' : canResubmit ? 'Retry Submit' : 'Submit'}
          </button>
        )}
      </div>

      {isSubmitSuccess && <p>Wizard completed successfully!</p>}
      {isSubmitError && <p>Submission failed. Please try again.</p>}
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