import React, { useState } from 'react';

interface ProfessionalOnboardingPageProps {
  onComplete: () => void;
  onBack: () => void;
}

const specialties = [
  "Nail Artistry",
  "Hair Colorist & Stylist",
  "Lash & Brow Expert",
  "Makeup Artist",
  "Braid Specialist",
  "Skincare & Facials",
  "Waxing Services",
  "Massage Therapy"
];

const CheckboxItem: React.FC<{ label: string; isChecked: boolean; onToggle: () => void; }> = ({ label, isChecked, onToggle }) => (
    <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${isChecked ? 'bg-rose-100 border-rose-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
        <input type="checkbox" checked={isChecked} onChange={onToggle} className="h-5 w-5 rounded text-rose-600 focus:ring-rose-500 border-slate-300" />
        <span className="ml-4 font-medium text-slate-700">{label}</span>
    </label>
);

const ProfessionalOnboardingPage: React.FC<ProfessionalOnboardingPageProps> = ({ onComplete, onBack }) => {
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

    const handleToggle = (specialty: string) => {
        setSelectedSpecialties(prev => 
            prev.includes(specialty) 
            ? prev.filter(s => s !== specialty)
            : [...prev, specialty]
        );
    };

    const canContinue = selectedSpecialties.length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 font-sans">
        <div className="absolute top-6 left-6">
            <button onClick={onBack} className="text-sm font-semibold text-slate-600 hover:text-rose-500 px-4 py-2 bg-white/50 rounded-lg flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                <span>Back</span>
            </button>
        </div>
        <div className="w-full max-w-2xl">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-rose-500 tracking-tight">Tell Us Your Craft</h1>
                <p className="text-lg text-slate-500 mt-2">Select all specialties that you offer. This helps clients find you!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialties.map(specialty => (
                    <CheckboxItem 
                        key={specialty} 
                        label={specialty} 
                        isChecked={selectedSpecialties.includes(specialty)}
                        onToggle={() => handleToggle(specialty)}
                    />
                ))}
            </div>

            <div className="mt-10 text-center">
                <button 
                    onClick={onComplete}
                    disabled={!canContinue}
                    className="w-full max-w-xs py-3 px-6 bg-rose-500 text-white font-bold rounded-xl shadow-lg hover:bg-rose-600 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    Continue
                </button>
            </div>
        </div>
    </div>
  );
};

export default ProfessionalOnboardingPage;