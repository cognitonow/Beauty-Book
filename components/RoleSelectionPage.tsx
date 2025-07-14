import React from 'react';

interface RoleSelectionPageProps {
  onSelectRole: (role: 'client' | 'professional') => void;
  onBack: () => void;
}

const RoleButton: React.FC<{
  onClick: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ onClick, title, description, icon }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out border-2 border-transparent hover:border-rose-300"
  >
    <div className="flex items-center space-x-4">
      <div className="text-rose-500 bg-rose-100 p-3 rounded-full">{icon}</div>
      <div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-slate-500">{description}</p>
      </div>
    </div>
  </button>
);

const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ onSelectRole, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 p-4 font-sans">
        <div className="absolute top-6 left-6">
            <button onClick={onBack} className="text-sm font-semibold text-slate-600 hover:text-rose-500 px-4 py-2 bg-white/50 rounded-lg flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                <span>Back</span>
            </button>
        </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-rose-500 tracking-tight">One Last Step!</h1>
        <p className="text-lg text-slate-500 mt-2">To personalize your experience, tell us who you are.</p>
      </div>
      <div className="w-full max-w-md space-y-6">
        <RoleButton
          onClick={() => onSelectRole('client')}
          title="I'm a Client"
          description="Discover and book beauty services"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
        <RoleButton
          onClick={() => onSelectRole('professional')}
          title="I'm a Professional"
          description="Manage your profile and bookings"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

export default RoleSelectionPage;