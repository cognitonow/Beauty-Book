import React from 'react';
import { PROFILES } from '../constants';
import { ProfessionalProfile, Service, Review } from '../types';

const professional = PROFILES[1]; // Using Marco Reyes as the logged-in professional for demo

const Header = ({ onSwitchRole }: { onSwitchRole: () => void }) => (
    <header className="py-4 px-6 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-20 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-rose-500 tracking-tight">Pro Dashboard</h1>
        <p className="text-sm text-slate-500">Welcome back, {professional.name}!</p>
      </div>
      <button onClick={onSwitchRole} className="text-sm font-semibold text-slate-600 hover:text-rose-500 px-4 py-2 bg-slate-100 rounded-lg" title="Switch Role">
         Switch Role
      </button>
    </header>
  );

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-start space-x-4">
        <div className="bg-rose-100 text-rose-500 p-3 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-slate-500 text-sm">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
      {children}
    </section>
  );

interface ProfessionalViewProps {
    onSwitchRole: () => void;
}

const ProfessionalView: React.FC<ProfessionalViewProps> = ({ onSwitchRole }) => {
    const totalReviews = professional.reviews.length;
    const averageRating = (professional.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            <Header onSwitchRole={onSwitchRole} />
            <main className="flex-grow p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Upcoming Bookings" value="5" icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    } />
                    <StatCard label="Average Rating" value={averageRating} icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.524 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.524 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.524-4.674a1 1 0 00-.363-1.118L2.98 9.11c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.524-4.674z" /></svg>
                    }/>
                    <StatCard label="Total Reviews" value={totalReviews} icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h4l4 4z" /></svg>
                    }/>
                </div>

                {/* Profile Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Section title="My Services">
                        <div className="space-y-2">
                        {professional.services.map(s => (
                            <div key={s.name} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span>{s.name}</span>
                                <span className="font-semibold text-rose-500">${s.price}</span>
                            </div>
                        ))}
                        </div>
                    </Section>
                    <Section title="Recent Reviews">
                    <div className="space-y-4">
                        {professional.reviews.map(r => (
                            <div key={r.author}>
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold">{r.author}</p>
                                    <div className="flex">
                                        {[...Array(r.rating)].map((_, i) => <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 italic mt-1">"{r.comment}"</p>
                            </div>
                        ))}
                        </div>
                    </Section>
                </div>
            </main>
        </div>
    );
}

export default ProfessionalView;
