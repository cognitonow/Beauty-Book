/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RoleSelectionPage from './components/RoleSelectionPage';
import ProfessionalOnboardingPage from './components/ProfessionalOnboardingPage';
import ClientView from './components/ClientView';
import ProfessionalView from './components/ProfessionalView';

type View = 'home' | 'login' | 'roleSelection' | 'onboarding' | 'client' | 'professional';
type Role = 'client' | 'professional';

const App = () => {
    const [view, setView] = useState<View>('home');
    const [role, setRole] = useState<Role | null>(null);

    const handleLoginSuccess = () => {
        // In a real app, we'd get the user role from the auth response.
        // For this demo, we'll ask them.
        setView('roleSelection');
    };

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
        if (selectedRole === 'professional') {
            setView('onboarding');
        } else {
            setView('client');
        }
    };
    
    const handleSwitchRole = () => {
        const newRole = role === 'client' ? 'professional' : 'client';
        setRole(newRole);
        setView(newRole);
    };

    const renderView = () => {
        switch (view) {
            case 'login':
                return <LoginPage onAuthSuccess={handleLoginSuccess} />;
            case 'roleSelection':
                return <RoleSelectionPage 
                            onSelectRole={handleRoleSelect} 
                            onBack={() => setView('login')} 
                        />;
            case 'onboarding':
                return <ProfessionalOnboardingPage 
                            onComplete={() => setView('professional')}
                            onBack={() => setView('roleSelection')}
                       />;
            case 'client':
                return <ClientView onSwitchRole={handleSwitchRole} />;
            case 'professional':
                return <ProfessionalView onSwitchRole={handleSwitchRole} />;
            case 'home':
            default:
                return <HomePage onNavigateToLogin={() => setView('login')} />;
        }
    }

    return (
        <ErrorBoundary>
            {renderView()}
        </ErrorBoundary>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
