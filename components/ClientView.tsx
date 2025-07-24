import React, { useState, useMemo, useEffect } from 'react';
import { motion, useMotionValue, useAnimation, AnimatePresence } from 'framer-motion';
import { ProfessionalProfile, Client, Booking, Notification, Service } from '../types';
import { specialties, DUBLIN_LOCATIONS } from '../constants';
import ProfileCard from './ProfileCard';
import ProfileDetailView from './ProfileDetailView';
import BookingChatView from './BookingChatView';
import NotificationsPanel from './NotificationsPanel';
import { Bell, Briefcase, LogOut } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


const allSpecialties = ["All", ...specialties];
const allLocations = ["All", ...DUBLIN_LOCATIONS];

const Header = ({ onSwitchRole, onToggleFilters, isFiltersOpen, onToggleBookings, unreadCount, onToggleNotifications, onLogout }) => (
    <header className="py-3 px-4 text-center bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-20 flex justify-between items-center">
    <div>
        <h1 className="text-2xl font-bold text-rose-500 tracking-tight">ProfileMatch</h1>
        <p className="text-sm text-slate-700 text-left">Client View</p>
    </div>
    <div className="flex items-center space-x-2">
      <button onClick={onToggleBookings} className="text-sm font-semibold text-slate-600 hover:text-rose-500 px-4 py-2 bg-slate-100 rounded-lg flex items-center gap-2" title="My Bookings">
        <Briefcase size={16}/> My Bookings
      </button>
      <button onClick={onToggleNotifications} className="relative p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
        <Bell size={20} />
        {unreadCount > 0 && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>}
      </button>
      <button onClick={onSwitchRole} className="text-sm font-semibold text-slate-600 hover:text-rose-500 px-4 py-2 bg-slate-100 rounded-lg" title="Switch Role">
        Switch to Pro
      </button>
       <button onClick={onLogout} className="text-sm font-semibold text-slate-600 hover:text-rose-500 px-4 py-2 bg-slate-100 rounded-lg flex items-center gap-2" title="Logout">
        <LogOut size={16}/> Logout
      </button>
      <button onClick={onToggleFilters} className={`text-sm font-semibold rounded-full px-4 py-2 transition-colors ${isFiltersOpen ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
         Filter
      </button>
    </div>
  </header>
);

const FilterPanel = ({ filters, setFilters, onClose }) => (
    <motion.div 
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute top-[68px] left-0 right-0 bg-white p-4 shadow-lg z-10 border-b border-slate-200"
    >
        <div className="max-w-md mx-auto space-y-4">
            <div>
                <label htmlFor="specialty-filter" className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                <select 
                    id="specialty-filter"
                    value={filters.specialty}
                    onChange={(e) => setFilters(f => ({...f, specialty: e.target.value}))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                >
                    {allSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="location-filter" className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <select
                    id="location-filter"
                    value={filters.location}
                    onChange={(e) => setFilters(f => ({...f, location: e.target.value}))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                >
                    {allLocations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
            </div>
        </div>
    </motion.div>
);

const ActionButtons = ({ onPrevious, onNext, onView, canGoPrevious, canGoNext }) => (
    <div className="flex justify-center items-center space-x-6 py-4 px-4 bg-transparent z-10">
      <button 
        onClick={onPrevious} 
        disabled={!canGoPrevious}
        className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-lg text-slate-600 font-semibold hover:bg-slate-100 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
        aria-label="Previous Profile"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={onView} 
        className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-110" 
        aria-label="View Profile Details"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
      <button 
        onClick={onNext} 
        disabled={!canGoNext}
        className="w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-lg text-slate-600 font-semibold hover:bg-slate-100 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
        aria-label="Next Profile"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );

const ProfileList = ({ profiles, currentIndex, onSelectProfile }) => (
    <div className="h-full flex flex-col">
        <h3 className="text-base font-bold text-slate-900 mb-2 px-2 flex-shrink-0">All Professionals</h3>
        <div className="overflow-y-auto flex-grow bg-white/50 rounded-xl p-2 space-y-2 shadow-inner">
            {profiles.length > 0 ? profiles.map((profile, index) => (
                <button
                    key={profile.id}
                    onClick={() => onSelectProfile(index)}
                    className={`w-full flex items-center space-x-3 p-2 rounded-xl text-left transition-all duration-200 relative ${
                        currentIndex === index
                        ? 'bg-white shadow'
                        : 'hover:bg-white/80'
                    }`}
                    aria-current={currentIndex === index}
                >
                    <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full transition-colors ${currentIndex === index ? 'bg-rose-500': 'bg-transparent'}`}></div>

                    <img src={profile.profileImage} alt={profile.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0 ml-2" />
                    <div className="flex-grow min-w-0">
                        <p className={`font-semibold truncate ${currentIndex === index ? 'text-rose-600' : 'text-slate-900'}`}>
                            {profile.name}
                        </p>
                        <p className="text-sm text-slate-700 truncate">{profile.specialty}</p>
                    </div>
                </button>
            )) : (
                 <div className="text-center py-10 text-slate-700 h-full flex items-center justify-center">
                    <p>No professionals match your filters.</p>
                </div>
            )}
        </div>
    </div>
);

const BookingsView = ({ bookings, onSelectBooking, onClose }) => (
  <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">My Bookings</h2>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {bookings.length > 0 ? bookings.map(booking => (
          <button key={booking.id} onClick={() => onSelectBooking(booking)} className="w-full text-left p-4 rounded-lg hover:bg-slate-100 border border-slate-200 flex items-center gap-4">
            <img src={booking.professionalImage} alt={booking.professionalName} className="w-12 h-12 rounded-full object-cover"/>
            <div className="flex-grow">
              <p className="font-bold text-slate-800">{booking.professionalName}</p>
              <p className="text-sm text-slate-600">"{booking.service.name}"</p>
            </div>
            <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
            }`}>{booking.status}</span>
          </button>
        )) : <p className="text-center text-slate-500 py-8">You have no bookings.</p>}
      </div>
    </div>
  </div>
);


interface ClientViewProps {
  currentUser: Client;
  onSwitchRole: () => void;
  onLogout: () => void;
  bookings: Booking[];
  notifications: Notification[];
  onBook: (professional: ProfessionalProfile, service: Service, message: string, requestedDateTime?: string) => void;
  onSendMessage: (bookingId: string, text: string) => void;
  onMarkRead: (notificationIds: string[]) => void;
}

const ClientView: React.FC<ClientViewProps> = ({ currentUser, onSwitchRole, onLogout, bookings, notifications, onBook, onSendMessage, onMarkRead }) => {
  const [allProfiles, setAllProfiles] = useState<ProfessionalProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ specialty: 'All', location: 'All' });
  const [showFilters, setShowFilters] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
        setIsLoading(true);
        try {
            const profilesCol = collection(db, 'professionals');
            const q = query(profilesCol, where("isProfileComplete", "==", true), where("availability", "==", "Available Now"));
            const querySnapshot = await getDocs(q);
            const profiles = querySnapshot.docs.map(doc => doc.data() as ProfessionalProfile);
            setAllProfiles(profiles);
        } catch (error) {
            console.error("Error fetching profiles:", error);
        }
        setIsLoading(false);
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = useMemo(() => {
    return allProfiles.filter(p => {
      const specialtyMatch = filters.specialty === 'All' || p.specialty === filters.specialty;
      const locationMatch = filters.location === 'All' || p.location === filters.location;
      return specialtyMatch && locationMatch;
    });
  }, [allProfiles, filters]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailedProfile, setDetailedProfile] = useState<ProfessionalProfile | null>(null);
  
  useEffect(() => {
    setCurrentIndex(0);
  }, [filteredProfiles]);

  const currentProfile = filteredProfiles[currentIndex];
  const controls = useAnimation();
  const x = useMotionValue(0);

  useEffect(() => {
    controls.set({ x: 0, opacity: 1 });
    x.set(0);
  }, [currentIndex, controls, x]);

  const goToNextCard = async () => {
    if (currentIndex >= filteredProfiles.length - 1) return;
    await controls.start({ x: -400, opacity: 0, transition: { duration: 0.3 } });
    setCurrentIndex(currentIndex + 1);
  };
  
  const goToPreviousCard = async () => {
    if (currentIndex <= 0) return;
    await controls.start({ x: 400, opacity: 0, transition: { duration: 0.3 } });
    setCurrentIndex(currentIndex - 1);
  };

  const handleViewProfile = () => currentProfile && setDetailedProfile(currentProfile);
  const handleCloseProfile = () => setDetailedProfile(null);
  
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < filteredProfiles.length - 1;

  const handleSelectBooking = (booking: Booking) => {
    setActiveBooking(booking);
    setShowBookings(false);
  };
  
  const unreadNotifications = notifications.filter(n => !n.isRead);

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadNotifications.length > 0) {
      onMarkRead(unreadNotifications.map(n => n.id));
    }
  };
  
  const handleNotificationClick = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setActiveBooking(booking);
      setShowNotifications(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen font-sans antialiased text-slate-800 bg-gradient-to-b from-rose-50 to-slate-50">
      <Header 
        onSwitchRole={onSwitchRole}
        onLogout={onLogout}
        onToggleFilters={() => setShowFilters(!showFilters)} 
        isFiltersOpen={showFilters} 
        onToggleBookings={() => setShowBookings(!showBookings)}
        unreadCount={unreadNotifications.length}
        onToggleNotifications={handleToggleNotifications}
      />
      <AnimatePresence>
        {showFilters && <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />}
        {showBookings && <BookingsView bookings={bookings} onSelectBooking={handleSelectBooking} onClose={() => setShowBookings(false)}/>}
        {showNotifications && (
          <NotificationsPanel
            notifications={notifications}
            onSelect={handleNotificationClick}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </AnimatePresence>

      <main className="flex-grow flex flex-col p-4 overflow-hidden">
        {activeBooking ? (
            <BookingChatView 
              booking={activeBooking}
              currentUser={currentUser}
              onSendMessage={onSendMessage}
              onClose={() => setActiveBooking(null)}
            />
        ) : (
          <>
            {/* Top Section: Card & Actions */}
            <div className="w-full max-w-sm mx-auto flex-shrink-0">
                {/* Card Container */}
                <div className="aspect-[10/13] w-full relative mb-1">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isLoading ? (
                        <div className="text-center p-8 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-slate-700">Finding Professionals...</h3>
                            <p className="text-slate-600 mt-2">Hold on tight!</p>
                        </div>
                    ) : currentProfile ? (
                      <>
                        <motion.div
                          className="absolute inset-0"
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          onDragEnd={(event, { offset, velocity }) => {
                            const swipeThreshold = 100;
                            if (offset.x < -swipeThreshold || velocity.x < -500) {
                              goToNextCard();
                            } else if (offset.x > swipeThreshold || velocity.x > 500) {
                              goToPreviousCard();
                            }
                          }}
                          animate={controls}
                          style={{ x }}
                        >
                          <ProfileCard profile={currentProfile} onView={handleViewProfile} dragX={x} />
                        </motion.div>
                      </>
                    ) : (
                      <div className="text-center p-8 bg-white rounded-lg shadow-md">
                        <h3 className="text-xl font-bold text-slate-700">All Done for Now!</h3>
                        <p className="text-slate-600 mt-2">No profiles match your current filters. Try adjusting your search!</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex-shrink-0 w-full">
                {filteredProfiles.length > 0 && <ActionButtons 
                    onPrevious={goToPreviousCard}
                    onNext={goToNextCard}
                    onView={handleViewProfile}
                    canGoPrevious={canGoPrevious}
                    canGoNext={canGoNext}
                />}
                </div>
            </div>

            {/* Bottom Section: Profile List (Scrollable) */}
            <div className="w-full max-w-sm mx-auto flex-grow mt-2 overflow-hidden">
                <ProfileList 
                    profiles={filteredProfiles}
                    currentIndex={currentIndex}
                    onSelectProfile={setCurrentIndex}
                />
            </div>
          </>
        )}
      </main>

      {detailedProfile && <ProfileDetailView profile={detailedProfile} onClose={handleCloseProfile} onBook={onBook} />}
    </div>
  );
}

export default ClientView;