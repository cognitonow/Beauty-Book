/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpWizard from './components/SignUpWizard';
import ClientView from './components/ClientView';
import ProfessionalView from './components/ProfessionalView';
import { ProfessionalProfile } from './types';
import { PROFILES } from './constants';

type View = 'home' | 'login' | 'signup' | 'client' | 'professional' | 'onboarding';

const App = () => {
    const [view, setView] = useState<View>('home');
    const [currentUser, setCurrentUser] = useState<ProfessionalProfile | null>(null);

    const handleLogin = (user: ProfessionalProfile) => {
        setCurrentUser(user);
        if (user.isProfileComplete === false) {
             setView('onboarding');
        } else {
             setView('professional'); // Or whatever the primary role is
        }
    };
    
    const handleSignUpComplete = (newProfile: ProfessionalProfile) => {
        // In a real app, you'd save this to a DB. Here we just update state.
        setCurrentUser(newProfile);
        // Find the newly created profile in our mock data and update it
        const profileIndex = PROFILES.findIndex(p => p.id === newProfile.id);
        if (profileIndex > -1) {
            PROFILES[profileIndex] = newProfile;
        } else {
            // Or add it if it's a completely new user
            PROFILES.push(newProfile);
        }
        setView('professional');
    };
    
    const handleProfileUpdate = (updatedProfile: ProfessionalProfile) => {
        setCurrentUser(updatedProfile);
        const profileIndex = PROFILES.findIndex(p => p.id === updatedProfile.id);
        if (profileIndex > -1) {
            PROFILES[profileIndex] = updatedProfile;
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView('home');
    }

    const handleSwitchRole = () => {
       const newView = view === 'client' ? 'professional' : 'client';
       setView(newView);
    };
    
    const handleNavigateToOnboarding = () => {
        setView('onboarding');
    };

    const handleViewLiveProfile = () => {
        setView('client');
    };

    const renderView = () => {
        switch (view) {
            case 'login':
                return <LoginPage onLogin={handleLogin} onNavigateToSignUp={() => setView('signup')} />;
            case 'signup':
                return <SignUpWizard isOnboardingOnly={false} onComplete={handleSignUpComplete} onNavigateToLogin={() => setView('login')} onViewLiveProfile={handleViewLiveProfile} />;
             case 'onboarding':
                return <SignUpWizard isOnboardingOnly={true} initialData={currentUser} onComplete={handleSignUpComplete} onNavigateToLogin={() => setView('login')} onViewLiveProfile={handleViewLiveProfile} />;
            case 'client':
                return <ClientView onSwitchRole={handleSwitchRole} />;
            case 'professional':
                if (currentUser) {
                    return <ProfessionalView profile={currentUser} onUpdateProfile={handleProfileUpdate} onSwitchRole={handleSwitchRole} onStartOnboarding={handleNavigateToOnboarding} />;
                }
                setView('login'); // Should not happen, but as a fallback
                return null;
            case 'home':
            default:
                return <HomePage onNavigateToLogin={() => setView('login')} onNavigateToSignUp={() => setView('signup')} />;
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