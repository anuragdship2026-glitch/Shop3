import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mail,
  Phone,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lock,
  Sparkles
} from 'lucide-react';
import { IndigoLogo } from './IndigoLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customer: any, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'IDENTIFIER' | 'OTP'>('IDENTIFIER');
  const [identifier, setIdentifier] = useState('');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resend OTP
  useEffect(() => {
    let timer: any;
    if (step === 'OTP' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  // Focus first OTP box when transitioning to OTP step
  useEffect(() => {
    if (step === 'OTP') {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const handleSendOtp = async (selectedMethod: 'email' | 'phone') => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const cleanId = identifier.trim();

    if (selectedMethod === 'phone') {
      setErrorMessage('SMS OTP coming soon. Please use Email OTP.');
      return;
    }

    if (!cleanId) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!cleanId.includes('@')) {
      setErrorMessage('Please enter a valid email address. (SMS OTP coming soon)');
      return;
    }

    setMethod(selectedMethod);
    setIsLoading(true);

    // Enforce 3 second max loading rule
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, method: selectedMethod })
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok && data.success) {
        setStep('OTP');
        setCountdown(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        setSuccessMessage(data.message || 'OTP sent successfully!');
      } else {
        setErrorMessage(data.message || 'Oops! Something went wrong. Please try again.');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      setErrorMessage('Oops! Something went wrong. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only accept single numeric digit
    const cleaned = value.replace(/\D/g, '');
    const newOtp = [...otp];

    if (cleaned.length > 0) {
      // If user pasted multi-digit OTP
      if (cleaned.length > 1) {
        const digits = cleaned.slice(0, 6).split('');
        for (let i = 0; i < 6; i++) {
          newOtp[i] = digits[i] || '';
        }
        setOtp(newOtp);
        const nextIdx = Math.min(digits.length, 5);
        otpInputsRef.current[nextIdx]?.focus();
        return;
      }

      newOtp[index] = cleaned[cleaned.length - 1];
      setOtp(newOtp);

      // Auto advance to next box
      if (index < 5) {
        otpInputsRef.current[index + 1]?.focus();
      }
    } else {
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const fullOtp = otp.join('').trim();
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), otp: fullOtp })
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok && data.success && data.token) {
        localStorage.setItem('indigo_session', data.token);
        if (data.customer) {
          localStorage.setItem('indigo_customer', JSON.stringify(data.customer));
        }
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          onSuccess(data.customer, data.token);
          onClose();
        }, 600);
      } else {
        setErrorMessage(data.message || 'Invalid or expired OTP. Please try again.');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      setErrorMessage('Oops! Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-[#ffffff] sm:rounded-3xl w-full max-w-md h-full sm:h-auto min-h-[500px] sm:min-h-0 p-6 sm:p-8 shadow-2xl relative border border-[#4b0082]/15 flex flex-col justify-between">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close login dialog"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header Brand */}
          <div className="text-center space-y-2 pt-2">
            <div className="flex justify-center mb-2">
              <IndigoLogo className="h-10" />
            </div>
            <span className="bg-[#4b0082] text-[#c9a84c] text-[10px] font-black uppercase px-3 py-0.5 rounded-full tracking-widest">
              VIP Customer Portal
            </span>
            <h2 className="font-serif-brand text-2xl font-black text-[#4b0082]">
              {step === 'IDENTIFIER' ? 'Welcome to Indigo & Co.' : 'Enter Verification Code'}
            </h2>
            <p className="text-xs text-gray-600 font-medium max-w-xs mx-auto">
              {step === 'IDENTIFIER'
                ? 'Sign in with OTP to access past orders, real-time tracking, and express checkout.'
                : `We sent a 6-digit code to ${identifier}. Valid for 10 minutes.`}
            </p>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-start gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* STEP 1: IDENTIFIER INPUT */}
          {step === 'IDENTIFIER' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Enter your Email or Phone number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. ananya@example.com or 9876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (identifier.includes('@')) handleSendOtp('email');
                        else handleSendOtp('phone');
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl text-xs font-medium text-[#2c2c2c] focus:outline-none focus:border-[#4b0082] focus:bg-white transition"
                    autoFocus
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {identifier.includes('@') ? (
                      <Mail className="w-4 h-4 text-[#4b0082]" />
                    ) : (
                      <Phone className="w-4 h-4 text-[#4b0082]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Dual Action Buttons: Send OTP to Email vs Send OTP to SMS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendOtp('email')}
                  className="py-3 px-4 bg-[#4b0082] hover:bg-[#3a0066] text-white text-xs font-bold rounded-2xl shadow transition flex items-center justify-center gap-2 border border-[#c9a84c]/30 disabled:opacity-50"
                >
                  <Mail className="w-4 h-4 text-[#c9a84c]" />
                  <span>{isLoading && method === 'email' ? 'Sending Code...' : 'Send OTP to Email'}</span>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendOtp('phone')}
                  className="py-3 px-4 bg-white hover:bg-gray-50 text-[#4b0082] text-xs font-bold rounded-2xl border-2 border-[#4b0082] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isLoading && method === 'phone' ? 'Sending Code...' : 'Send OTP to SMS'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Passwordless 100% secure login via Supabase Auth</span>
              </div>
            </div>
          )}

          {/* STEP 2: 6-DIGIT OTP INPUT */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-center text-xs font-bold text-gray-700 mb-3">
                  Enter 6-Digit One-Time Password
                </label>

                <div className="flex justify-center gap-2 sm:gap-2.5">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputsRef.current[index] = el;
                      }}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-black font-mono bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-[#4b0082] focus:bg-white focus:outline-none transition shadow-sm"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className="w-full py-3.5 bg-[#4b0082] hover:bg-[#3a0066] text-white text-xs font-extrabold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 border border-[#c9a84c] disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Verifying Code...</span>
                ) : (
                  <>
                    <span>Verify & Access Account</span>
                    <ArrowRight className="w-4 h-4 text-[#c9a84c]" />
                  </>
                )}
              </button>

              {/* Resend OTP Counter */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('IDENTIFIER')}
                  className="text-gray-500 hover:text-[#4b0082] font-semibold"
                >
                  ← Change {method === 'email' ? 'Email' : 'Number'}
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={() => handleSendOtp(method)}
                    className="text-[#4b0082] font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                ) : (
                  <span className="text-gray-400 font-medium">
                    Resend code in <strong className="text-gray-700">{countdown}s</strong>
                  </span>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="pt-6 border-t border-gray-100 text-center text-[11px] text-gray-400">
          🔒 Encrypted with 256-bit AES luxury security standards.
        </div>
      </div>
    </div>
  );
};
