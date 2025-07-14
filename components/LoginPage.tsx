import React from 'react';
import { PROFILES } from '../constants';
import { ProfessionalProfile } from '../types';

interface LoginPageProps {
  onLogin: (user: ProfessionalProfile) => void;
  onNavigateToSignUp: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignUp }) => {

  const handleDemoLogin = (isComplete: boolean) => {
    const user = PROFILES.find(p => p.isProfileComplete === isComplete);
    if (user) {
      onLogin(user);
    } else {
      // Fallback if no matching user is found in constants
      alert(`No demo user with isComplete=${isComplete} found.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 to-slate-100 p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-rose-500 tracking-tight">
              Sign In
            </h1>
            <p className="text-slate-500 mt-2">For demo purposes, please select a user type to log in as.</p>
          </div>
          
          <div className="space-y-3">
             <button onClick={() => handleDemoLogin(true)} className="w-full flex items-center justify-center p-3 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                <span className="font-semibold text-slate-700">Log In as Complete Pro</span>
             </button>
             <button onClick={() => handleDemoLogin(false)} className="w-full flex items-center justify-center p-3 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                <span className="font-semibold text-slate-700">Log In as Incomplete Pro</span>
             </button>
          </div>
        </div>
        
        <div className="text-center mt-6 text-sm text-slate-600">
          Want to start from scratch?{' '}
          <button onClick={onNavigateToSignUp} className="font-semibold text-rose-500 hover:underline">
            Create a new account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;