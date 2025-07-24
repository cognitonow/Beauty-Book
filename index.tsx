/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpWizard from './components/SignUpWizard';
import ClientView from './components/ClientView';
import ProfessionalView from './components/ProfessionalView';
import { ProfessionalProfile, Client, Booking, Service, Message, Notification } from './types';
import { PROFILES, MOCK_CLIENT } from './constants';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';


type View = 'home' | 'login' | 'signup' | 'client' | 'professional' | 'onboarding';

const App = () => {
    const [view, setView] = useState<View>('home');
    const [loggedInProfessional, setLoggedInProfessional] = useState<ProfessionalProfile | null>(null);
    const [currentUser, setCurrentUser] = useState<ProfessionalProfile | Client | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
            if (user) {
                const professionalDocRef = doc(db, 'professionals', user.uid);
                const professionalDocSnap = await getDoc(professionalDocRef);

                if (professionalDocSnap.exists()) {
                    const professionalProfile = professionalDocSnap.data() as ProfessionalProfile;
                    handleLogin(professionalProfile);
                } else {
                    // This can happen if user created auth but didn't finish profile.
                    // The wizard handles creation, but if they abandoned, we guide them back.
                    const tempProfile: ProfessionalProfile = {
                        id: user.uid,
                        email: user.email || '',
                        name: user.displayName || 'New Professional',
                        isProfileComplete: false,
                        specialty: 'Nail Artistry',
                        bio: '',
                        location: '',
                        profileImage: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=800',
                        availability: 'Unavailable',
                        reviews: [],
                        services: [],
                    };
                    setLoggedInProfessional(tempProfile);
                    setCurrentUser(tempProfile);
                    setView('onboarding');
                }
            } else {
                handleLogout(false);
            }
            setIsLoadingAuth(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = (user: ProfessionalProfile) => {
        setLoggedInProfessional(user);
        setCurrentUser(user);
        if (user.isProfileComplete === false) {
             setView('onboarding');
        } else {
             setView('professional');
        }
    };

    const handleLoginByCredentials = async (email: string, password: string): Promise<{success: boolean, error?: string}> => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error: any) {
             let message = "An unexpected error occurred. Please try again.";
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                 message = "Invalid email or password. Please try again.";
            } else if (error.code === 'auth/too-many-requests') {
                message = "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.";
            }
            return { success: false, error: message };
        }
    };
    
    const handleSignUpComplete = async (newProfile: ProfessionalProfile) => {
        try {
            await setDoc(doc(db, "professionals", newProfile.id), newProfile, { merge: true });
            // onAuthStateChanged will handle login, but we can set state here to be faster
            setLoggedInProfessional(newProfile);
            setCurrentUser(newProfile);
            setView('professional');
        } catch (error) {
            console.error("Error saving profile:", error);
            // Optionally, show an error message to the user
        }
    };
    
    const handleProfileUpdate = async (updatedProfile: ProfessionalProfile) => {
        try {
            await setDoc(doc(db, "professionals", updatedProfile.id), updatedProfile, { merge: true });
            setCurrentUser(updatedProfile);
            setLoggedInProfessional(updatedProfile);
            // Keep mock data in sync if needed, though this will be phased out
            const profileIndex = PROFILES.findIndex(p => p.id === updatedProfile.id);
            if (profileIndex > -1) {
                PROFILES[profileIndex] = updatedProfile;
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleLogout = (shouldSignOut = true) => {
        if (shouldSignOut) {
            signOut(auth);
        }
        setCurrentUser(null);
        setLoggedInProfessional(null);
        setView('home');
    }

    const handleSwitchRole = () => {
       if (currentUser && 'specialty' in currentUser) { // Is a Professional
            setCurrentUser(MOCK_CLIENT);
            setView('client');
       } else { // Is a Client
            if(loggedInProfessional) {
                setCurrentUser(loggedInProfessional);
                setView('professional');
            } else {
                setView('login'); // Fallback
            }
       }
    };
    
    const handleNavigateToOnboarding = () => {
        setView('onboarding');
    };

    const handleViewLiveProfile = () => {
        setCurrentUser(MOCK_CLIENT);
        setView('client');
    };

    // --- Booking & Notification Handlers ---

    const handleCreateBooking = (professional: ProfessionalProfile, service: Service, messageText: string, requestedDateTime?: string) => {
        if (!currentUser || 'specialty' in currentUser) {
            alert("You must be viewing as a client to book.");
            return;
        }
        
        const client = currentUser as Client;

        const initialMessage: Message = {
            id: `msg_${Date.now()}`,
            senderId: client.id,
            senderName: client.name,
            text: messageText,
            timestamp: new Date().toISOString()
        };
        
        const newBooking: Booking = {
            id: `booking_${Date.now()}`,
            clientId: client.id,
            clientName: client.name,
            clientImage: client.profileImage,
            professionalId: professional.id,
            professionalName: professional.name,
            professionalImage: professional.profileImage,
            service,
            status: 'pending',
            messages: [initialMessage],
            createdAt: new Date().toISOString(),
            requestedDateTime,
        };

        const newNotification: Notification = {
            id: `notif_${Date.now()}`,
            userId: professional.id,
            type: 'booking_request',
            message: `${client.name} requested to book "${service.name}".`,
            bookingId: newBooking.id,
            isRead: false,
            timestamp: new Date().toISOString()
        };

        setBookings(prev => [...prev, newBooking]);
        setNotifications(prev => [...prev, newNotification]);
        alert(`Booking request sent to ${professional.name}!`);
    };

    const handleUpdateBookingStatus = (bookingId: string, status: 'approved' | 'declined') => {
        let updatedBooking: Booking | null = null;
        setBookings(bookings.map(b => {
            if (b.id === bookingId) {
                updatedBooking = { ...b, status };
                return updatedBooking;
            }
            return b;
        }));

        if (updatedBooking) {
             const newNotification: Notification = {
                id: `notif_${Date.now()}`,
                userId: updatedBooking.clientId,
                type: status === 'approved' ? 'booking_approved' : 'booking_declined',
                message: `Your booking with ${updatedBooking.professionalName} for "${updatedBooking.service.name}" was ${status}.`,
                bookingId: updatedBooking.id,
                isRead: false,
                timestamp: new Date().toISOString()
            };
            setNotifications(prev => [...prev, newNotification]);
        }
    };
    
    const handleSendMessage = (bookingId: string, text: string) => {
        if (!currentUser) return;

        let updatedBooking: Booking | null = null;
        const newMessage: Message = {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            text,
            timestamp: new Date().toISOString()
        };
        
        setBookings(bookings.map(b => {
            if (b.id === bookingId) {
                updatedBooking = { ...b, messages: [...b.messages, newMessage] };
                return updatedBooking;
            }
            return b;
        }));
        
        if (updatedBooking) {
            const recipientId = currentUser.id === updatedBooking.clientId ? updatedBooking.professionalId : updatedBooking.clientId;
            const newNotification: Notification = {
                id: `notif_${Date.now()}`,
                userId: recipientId,
                type: 'new_message',
                message: `You have a new message from ${currentUser.name} regarding your booking.`,
                bookingId: updatedBooking.id,
                isRead: false,
                timestamp: new Date().toISOString()
            };
            setNotifications(prev => [...prev, newNotification]);
        }
    };
    
    const handleMarkNotificationsAsRead = (notificationIds: string[]) => {
        setNotifications(notifications.map(n => 
            notificationIds.includes(n.id) ? { ...n, isRead: true } : n
        ));
    };


    const renderView = () => {
        if (isLoadingAuth) {
             return (
                <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading...</span>
                </div>
            );
        }

        switch (view) {
            case 'login':
                return <LoginPage onLogin={handleLoginByCredentials} onNavigateToSignUp={() => setView('signup')} />;
            case 'signup':
                return <SignUpWizard isOnboardingOnly={false} onComplete={handleSignUpComplete} onNavigateToLogin={() => setView('login')} onViewLiveProfile={handleViewLiveProfile} />;
             case 'onboarding':
                return <SignUpWizard isOnboardingOnly={true} initialData={loggedInProfessional} onComplete={handleSignUpComplete} onNavigateToLogin={() => setView('login')} onViewLiveProfile={handleViewLiveProfile} />;
            case 'client':
                 if (currentUser) {
                    return <ClientView 
                        currentUser={currentUser as Client}
                        onSwitchRole={handleSwitchRole} 
                        bookings={bookings.filter(b => b.clientId === currentUser.id)}
                        notifications={notifications.filter(n => n.userId === currentUser.id)}
                        onBook={handleCreateBooking}
                        onSendMessage={handleSendMessage}
                        onMarkRead={handleMarkNotificationsAsRead}
                        onLogout={handleLogout}
                    />;
                 }
                 // if no current user, but trying to access client view, redirect to home.
                 setView('home');
                 return null;
            case 'professional':
                if (currentUser && 'specialty' in currentUser) {
                    return <ProfessionalView 
                        profile={currentUser} 
                        onUpdateProfile={handleProfileUpdate} 
                        onSwitchRole={handleSwitchRole} 
                        onStartOnboarding={handleNavigateToOnboarding}
                        onLogout={handleLogout}
                        bookings={bookings.filter(b => b.professionalId === currentUser.id)}
                        notifications={notifications.filter(n => n.userId === currentUser.id)}
                        onUpdateBookingStatus={handleUpdateBookingStatus}
                        onSendMessage={handleSendMessage}
                        onMarkRead={handleMarkNotificationsAsRead}
                    />;
                }
                // Fallback to login if professional data is not available
                setView('login');
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


// New error logging code
const container = document.getElementById('root');
if (container) {
    try {
        const root = createRoot(container);
        root.render(<App />);
    } catch (error) {
        console.error("Failed to start the application:", error);
        // Display a user-friendly error message on the screen
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; font-family: sans-serif;">
                <h1>Application Error</h1>
                <p>Something went wrong and the application could not start. Please check the console for more details.</p>
                <p><b>Error:</b> ${error.message}</p>
            </div>
        `;
    }
}