import React, { useState } from 'react';

interface LoginPageProps {
  onAuthSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess }) => {
  const [step, setStep] = useState<'initial' | 'email' | 'password' | 'register'>('initial');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Simulate checking if email exists
  const handleEmailContinue = () => {
    if (email === 'marco@reyes.com') { // Pre-existing user
      setStep('password');
    } else {
      setStep('register');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'password':
      case 'register':
        return (
          <div>
            <div className="flex items-center mb-6">
               <button onClick={() => setStep('initial')} className="text-slate-500 hover:text-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
               </button>
               <p className="font-semibold text-center flex-1">{email}</p>
            </div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              {step === 'register' ? 'Create a Password' : 'Enter your password'}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500"
              >
                {showPassword ?
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" /></svg>
                }
              </button>
            </div>
             <button onClick={onAuthSuccess} className="w-full mt-4 p-3 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600 transition-colors">
              Continue
            </button>
          </div>
        );
      case 'initial':
      default:
        return (
          <>
            <form onSubmit={(e) => { e.preventDefault(); handleEmailContinue(); }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                required
              />
              <button type="submit" className="w-full mt-3 p-3 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600 transition-colors">
                Continue with Email
              </button>
            </form>

            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-sm">or</span>
              <div className="flex-grow border-t border-slate-300"></div>
            </div>

            <button onClick={onAuthSuccess} className="w-full flex items-center justify-center p-3 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                <span className="font-semibold text-slate-700">Email me a sign-in link</span>
            </button>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 p-4 font-sans">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-rose-500 tracking-tight">
            {step === 'initial' ? 'Sign In or Register' : 'Welcome'}
          </h1>
        </div>
        {renderStep()}
      </div>
      <div className="text-center mt-6 text-xs text-slate-500 max-w-sm">
        By continuing, you agree to ProfileMatch's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default LoginPage;