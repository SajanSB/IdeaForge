import React, { useState } from 'react';
import { 
  IconCheck, 
  IconInfoCircle, 
  IconX, 
  IconLoader2, 
  IconMessages, 
  IconBriefcase, 
  IconCalculator, 
  IconCreditCard, 
  IconBulb 
} from '@tabler/icons-react';

// COMP-03: StepIndicator (UIUX-04 section 2)
export function StepIndicator({ currentStep }) {
  const steps = [
    { label: 'Idea', icon: IconBulb },
    { label: 'Q&A', icon: IconMessages },
    { label: 'Review', icon: IconBriefcase },
    { label: 'Cost', icon: IconCalculator },
    { label: 'Pay', icon: IconCreditCard }
  ];

  return (
    <div className="w-full flex items-center justify-between mb-8 select-none" role="list" aria-label="Funnel steps">
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        
        return (
          <React.Fragment key={idx}>
            {/* Step Node */}
            <div className="flex flex-col items-center relative flex-1" role="listitem">
              <div 
                className={`w-8 h-8 rounded-full border-[0.5px] flex items-center justify-center font-sans font-medium text-xs transition-all duration-200 ${
                  isDone 
                    ? 'bg-[#EAF3DE] border-[#97C459] text-[#27500A]' 
                    : isActive 
                      ? 'bg-amber-tint border-amber-primary text-amber-primary' 
                      : 'bg-white border-gray-300 text-gray-400'
                }`}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Step ${stepNum} of 5: ${step.label}. ${isDone ? 'Completed' : isActive ? 'Active' : 'Pending'}`}
              >
                {isDone ? <IconCheck className="w-4.5 h-4.5 text-[#27500A]" /> : stepNum}
              </div>
              <span className="text-[10px] mt-1.5 text-gray-500 font-sans tracking-wide">
                {step.label}
              </span>
            </div>
            
            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div 
                className={`h-[1px] flex-grow mx-2 ${
                  stepNum < currentStep ? 'bg-[#97C459]' : 'bg-gray-200'
                }`} 
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// COMP-07: CostBreakdownCard (UIUX-04 section 2)
export function CostBreakdownCard({ 
  model = "Claude Sonnet 4.6",
  apiCostInr,
  platformFeeInr,
  gstInr,
  totalInr,
  rawTokens = 284000
}) {
  return (
    <div className="bg-white border-[0.5px] border-gray-200 rounded-xl p-5 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center border-b-[0.5px] border-gray-200 pb-3 mb-3">
        <span className="text-xs font-mono font-medium text-amber-primary">{model}</span>
        <span className="text-xs text-gray-500 font-mono">Est. tokens: {Math.round(rawTokens / 1000)}K</span>
      </div>
      <table className="w-full text-sm font-sans" aria-label="Generation cost breakdown">
        <tbody>
          <tr className="border-b-[0.5px] border-gray-100 h-9">
            <td className="text-gray-500 font-normal">Anthropic API cost</td>
            <td className="text-right font-mono text-gray-700">₹{apiCostInr.toFixed(2)}</td>
          </tr>
          <tr className="border-b-[0.5px] border-gray-100 h-9">
            <td className="text-gray-500 font-normal">Platform fee</td>
            <td className="text-right font-mono text-gray-700">₹{platformFeeInr.toFixed(2)}</td>
          </tr>
          <tr className="border-b-[0.5px] border-gray-100 h-9">
            <td className="text-gray-500 font-normal">GST (18%)</td>
            <td className="text-right font-mono text-gray-700">₹{gstInr.toFixed(2)}</td>
          </tr>
          <tr className="h-12">
            <th scope="row" className="text-left font-medium text-gray-900 text-[14px] flex items-center gap-1 mt-2.5">
              <span>Total</span>
              <div className="relative group cursor-pointer inline-flex items-center">
                <IconInfoCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                <span className="invisible group-hover:visible absolute left-5 -top-1 w-44 bg-gray-900 text-white text-[10px] p-2 rounded leading-normal z-50">
                  Includes a 1.4× safety token buffer to prevent transaction cuts.
                </span>
              </div>
            </th>
            <td className="text-right font-semibold text-amber-primary text-xl font-sans">
              ₹{totalInr.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// COMP-08: AuthGateModal (UIUX-04 section 2)
export function AuthGateModal({ isOpen, onSuccess, onDismiss }) {
  const [activeTab, setActiveTab] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email.trim() || !password.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (activeTab === 'signup') {
      if (password.length < 8) {
        setErrorMsg('Password must be at least 8 characters.');
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setErrorMsg('Must contain at least one uppercase letter.');
        return;
      }
      if (!/\d/.test(password)) {
        setErrorMsg('Must contain at least one number.');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(email);
    }, 800);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess('sajan@ideaforge.ai');
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-[0.5px] border-gray-200 rounded-xl max-w-sm w-full p-6 relative shadow-lg">
        <button 
          onClick={onDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close dialog"
        >
          <IconX className="w-5 h-5" />
        </button>

        <h2 className="text-[18px] font-medium text-gray-900 mb-1 leading-snug">
          Save your documents & get your receipt
        </h2>
        <p className="text-xs text-gray-500 mb-5 leading-normal">
          One account — access your generated SDLC suites from any device.
        </p>

        {/* Tab Header */}
        <div className="flex border-b-[0.5px] border-gray-200 mb-4 font-sans text-sm">
          <button
            onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
            className={`flex-1 pb-2 text-center font-medium ${
              activeTab === 'signup' 
                ? 'border-b-2 border-amber-primary text-amber-primary' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setActiveTab('signin'); setErrorMsg(''); }}
            className={`flex-1 pb-2 text-center font-medium ${
              activeTab === 'signin' 
                ? 'border-b-2 border-amber-primary text-amber-primary' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans">
          {errorMsg && (
            <div className="p-3 bg-red-50 border-[0.5px] border-red-200 text-[#791F1F] text-xs rounded-lg leading-relaxed animate-status-pulse" role="alert">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-[0.06em] text-gray-500">Email Address</label>
            <input
              type="email"
              placeholder="e.g. priya@saas.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border-[0.5px] border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-amber-primary focus:ring-2 focus:ring-amber-primary/15"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium uppercase tracking-[0.06em] text-gray-500">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border-[0.5px] border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-amber-primary focus:ring-2 focus:ring-amber-primary/15"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-amber-primary hover:bg-amber-primary/95 text-[#FFF8ED] text-xs font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <IconLoader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <span>Continue to payment →</span>
            )}
          </button>
        </form>

        <div className="flex items-center my-4 font-sans text-xs text-gray-400">
          <div className="flex-1 h-[0.5px] bg-gray-200" />
          <span className="mx-3">or</span>
          <div className="flex-1 h-[0.5px] bg-gray-200" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full border-[0.5px] border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.147 4.114-3.555 0-6.44-2.885-6.44-6.44s2.885-6.44 6.44-6.44c1.626 0 3.111.603 4.254 1.587l3.012-3.013C19.124 2.22 15.86 1 12.24 1 6.037 1 1 6.037 1 12.24s5.037 11.24 11.24 11.24c6.16 0 11.137-4.978 11.137-11.24 0-.74-.067-1.455-.197-2.155H12.24z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
