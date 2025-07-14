import React, { useState, useMemo, useEffect } from 'react';
import { motion, useMotionValue, useAnimation, AnimatePresence } from 'framer-motion';
import { ProfessionalProfile } from '../types';
import { PROFILES } from '../constants';
import ProfileCard from './ProfileCard';
import ProfileDetailView from './ProfileDetailView';

const specialties = ["All", "Nail Artistry", "Hair Colorist & Stylist", "Lash & Brow Expert", "Makeup Artist", "Braid Specialist"];

const Header = ({ onSwitchRole, onToggleFilters, isFiltersOpen }: { onSwitchRole: () => void; onToggleFilters: () => void; isFiltersOpen: boolean; }) => (
  <header className="py-4 px-4 text-center bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-20 flex justify-between items-center">
    <button onClick={onSwitchRole} className="text-sm text-slate-500 hover:text-rose-500 w-20 text-left" title="Switch Role">
       Switch Role
    </button>
    <div>
      <h1 className="text-2xl font-bold text-rose-500 tracking-tight">ProfileMatch</h1>
    </div>
    <button onClick={onToggleFilters} className={`w-20 text-sm font-semibold rounded-lg px-4 py-2 transition-colors ${isFiltersOpen ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
       Filter
    </button>
  </header>
);

const FilterPanel = ({ filters, setFilters, onClose }) => (
    <motion.div 
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute top-[72px] left-0 right-0 bg-white p-4 shadow-lg z-10 border-b border-slate-200"
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
                    {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="distance-filter" className="block text-sm font-medium text-slate-700 mb-1">Distance: <span className="font-bold">{filters.distance} km</span></label>
                <input
                    type="range"
                    id="distance-filter"
                    min="1"
                    max="50"
                    value={filters.distance}
                    onChange={(e) => setFilters(f => ({...f, distance: parseInt(e.target.value)}))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
            </div>
        </div>
    </motion.div>
);

const ActionButtons = ({ onPass, onSave, onView }) => (
  <div className="flex justify-center items-center space-x-6 py-6 px-4 bg-transparent z-10">
    <button onClick={onPass} className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors" aria-label="Pass">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
    <button onClick={onView} className="w-20 h-20 rounded-full bg-rose-500 shadow-xl flex items-center justify-center text-white hover:bg-rose-600 transition-transform transform hover:scale-105" aria-label="View Details">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    </button>
    <button onClick={onSave} className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-green-400 hover:bg-green-50 transition-colors" aria-label="Save">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
    </button>
  </div>
);

const ClientView = ({ onSwitchRole }) => {
  const allProfiles = useMemo(() => PROFILES.filter(p => p.availability === 'Available Now'), []);
  const [filters, setFilters] = useState({ specialty: 'All', distance: 50 });
  const [showFilters, setShowFilters] = useState(false);

  const filteredProfiles = useMemo(() => {
    return allProfiles.filter(p => {
      const specialtyMatch = filters.specialty === 'All' || p.specialty === filters.specialty;
      const distanceMatch = p.distance <= filters.distance;
      return specialtyMatch && distanceMatch;
    });
  }, [allProfiles, filters]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailedProfile, setDetailedProfile] = useState(null);
  
  useEffect(() => {
    setCurrentIndex(0);
  }, [filters]);

  const currentProfile = filteredProfiles[currentIndex];
  const controls = useAnimation();
  const x = useMotionValue(0);

  const handleNext = async (direction) => {
    const swipePower = direction === 'right' ? 400 : -400;
    await controls.start({ x: swipePower, opacity: 0, transition: { duration: 0.3 } });
    if (currentIndex < filteredProfiles.length) {
      setCurrentIndex(currentIndex + 1);
      x.set(0); // Reset motion value
      controls.set({ x: 0, opacity: 1 }); // Reset animation controls for the next card
    }
  };

  const handlePass = () => handleNext('left');
  const handleSave = () => handleNext('right');
  const handleViewProfile = () => currentProfile && setDetailedProfile(currentProfile);
  const handleCloseProfile = () => setDetailedProfile(null);
  
  return (
    <div className="flex flex-col h-screen max-h-screen font-sans antialiased text-slate-800">
      <Header onSwitchRole={onSwitchRole} onToggleFilters={() => setShowFilters(!showFilters)} isFiltersOpen={showFilters} />
      <AnimatePresence>
        {showFilters && <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />}
      </AnimatePresence>

      <main className="flex-grow flex flex-col items-center justify-center p-4 overflow-hidden relative">
        <div className="w-full max-w-sm flex-grow flex flex-col justify-center relative">
          {currentProfile ? (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, { offset, velocity }) => {
                const swipeThreshold = 50;
                if (offset.x > swipeThreshold || velocity.x > 500) {
                  handleSave();
                } else if (offset.x < -swipeThreshold || velocity.x < -500) {
                  handlePass();
                }
              }}
              animate={controls}
              style={{ x }}
            >
              <ProfileCard profile={currentProfile} onView={handleViewProfile} dragX={x} />
            </motion.div>
          ) : (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-slate-700">All Done for Now!</h3>
              <p className="text-slate-500 mt-2">No profiles match your current filters. Try adjusting your search!</p>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 w-full max-w-sm">
         {currentProfile && <ActionButtons onPass={handlePass} onSave={handleSave} onView={handleViewProfile} />}
        </div>
      </main>

      {detailedProfile && <ProfileDetailView profile={detailedProfile} onClose={handleCloseProfile} />}
    </div>
  );
}

export default ClientView;