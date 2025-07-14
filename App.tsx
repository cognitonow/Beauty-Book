import React, { useState } from 'react';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import ClientView from './components/ClientView';
import ProfessionalView from './components/ProfessionalView';
import RoleSelectionPage from './components/RoleSelectionPage';
import ProfessionalOnboardingPage from './components/ProfessionalOnboardingPage';

type View = 'home' | 'login' | 'roleSelection' | 'client' | 'professional' | 'professionalOnboarding';

export default function App() {
  const [view, setView] = useState<View>('home');

  const handleAuthSuccess = () => {
    setView('roleSelection');
  };

  const handleSelectRole = (role: 'client' | 'professional') => {
    if (role === 'client') {
      setView('client');
    } else {
      setView('professionalOnboarding');
    }
  };

  const handleNavigateHome = () => {
    setView('home');
  };

  const handleOnboardingComplete = () => {
    setView('professional');
  };

  const renderView = () => {
    switch (view) {
      case 'home':
        return <HomePage onNavigateToLogin={() => setView('login')} />;
      case 'login':
        return <LoginPage onAuthSuccess={handleAuthSuccess} />;
      case 'roleSelection':
        return <RoleSelectionPage onSelectRole={handleSelectRole} onBack={() => setView('login')} />;
      case 'professionalOnboarding':
        return <ProfessionalOnboardingPage onComplete={handleOnboardingComplete} onBack={() => setView('roleSelection')} />;
      case 'client':
        return <ClientView onSwitchRole={handleNavigateHome} />;
      case 'professional':
        return <ProfessionalView onSwitchRole={handleNavigateHome} />;
      default:
        return <HomePage onNavigateToLogin={() => setView('login')} />;
    }
  };

  return (
    <div className="bg-rose-50 antialiased">
        {renderView()}
    </div>
  );
}