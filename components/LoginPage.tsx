import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  onNavigateToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'form' | 'email_sent'>('form');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await onLogin(email, password);
    if (!result.success) {
      setError(result.error || 'Invalid email or password. Please try again.');
    }
    // On success, onAuthStateChanged in App.tsx will handle navigation
    setIsLoading(false);
  };

  const handleEmailLinkSignIn = () => {
    setError('');
    if (email && email.includes('@')) {
        // In a real app, this would call Firebase's sendSignInLinkToEmail
        // For this demo, we just show the confirmation UI
        setView('email_sent');
    } else {
        setError('Enter a valid email address to receive a link.');
    }
  };
  
  if (view === 'email_sent') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 to-slate-100 p-4 font-sans">
        <div className="w-full max-w-sm text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight mt-4">Check your email</h1>
                <p className="text-slate-500 mt-2">We've sent a secure sign-in link to <span className="font-semibold text-slate-700">{email}</span>.</p>
                <button onClick={() => setView('form')} className="mt-6 w-full text-sm font-semibold text-rose-500 hover:underline">
                    Back to Sign In
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 to-slate-100 p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-rose-500 tracking-tight">
              Sign In
            </h1>
            <p className="text-slate-500 mt-2">Welcome back! Sign in to your account.</p>
          </div>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
             {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">{error}</div>}
             <div>
                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition-shadow"
                    placeholder="you@example.com"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition-shadow"
                    placeholder="Your password"
                />
             </div>
             <button type="submit" disabled={isLoading} className="w-full bg-rose-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-rose-600 transition-colors shadow-md transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center">
                {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {isLoading ? 'Signing In...' : 'Sign In'}
             </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-slate-500">Or</span>
            </div>
          </div>
          
          <button onClick={handleEmailLinkSignIn} className="w-full flex items-center justify-center p-3 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold text-slate-700">Sign in with Email Link</span>
          </button>
        </div>
        
        <div className="text-center mt-6 text-sm text-slate-600">
          Don't have an account?{' '}
          <button onClick={onNavigateToSignUp} className="font-semibold text-rose-500 hover:underline">
            Create one
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;