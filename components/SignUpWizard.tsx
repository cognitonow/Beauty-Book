import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ProfessionalProfile, Service } from '../types';
import { DUBLIN_LOCATIONS, PREDEFINED_SERVICES, PROFILES, SERVICE_CATEGORIES } from '../constants';
import { Check, User, MapPin, Briefcase, Link as LinkIcon, Eye, Camera, Search, X, Building, Hand, Star, Heart, FileCode, ChevronDown, Monitor, MoreHorizontal, Copy, Pin, Sparkles } from 'lucide-react';
import ProfileCard from './ProfileCard';
import ProfileDetailView from './ProfileDetailView';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


// --- WIZARD STEPS & CONFIG ---
const WIZARD_STEPS_CONFIG = [
  { step: 1, title: 'Create Account', icon: User },
  { step: 2, title: 'Confirmation', isInterstitial: true },
  { step: 3, title: 'Location & Intro', icon: MapPin },
  { step: 4, title: 'Services', icon: Briefcase },
  { step: 5, title: 'Portfolio', icon: LinkIcon },
  { step: 6, title: 'Preview', icon: Eye },
  { step: 7, title: 'Complete', isInterstitial: true },
];

const StepHeader = ({ title, subtitle }) => (
    <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
        <p className="text-slate-500 mt-1">{subtitle}</p>
    </div>
);

// --- ICON COMPONENTS ---
const InstagramIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);
const TikTokIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.98-1.59-2.02-2.15-4.52-1.9-7.12.21-2.2.95-4.26 2.2-6.02 1.34-1.88 3.31-3.21 5.39-3.79.47-.13.95-.23 1.44-.31.03-1.1.02-2.21.02-3.31z"></path>
    </svg>
);


// --- SUB-COMPONENTS ---
const WizardSidebar = ({ currentStep, steps }: { currentStep: number, steps: any[] }) => {
    const lastVisibleStepNumber = steps[steps.length - 1].step;
    let completion = 0;
    if (currentStep > lastVisibleStepNumber) {
        completion = 100;
    } else {
        const totalSteps = steps.length;
        const currentStepIndex = steps.findIndex(s => s.step === currentStep);
        if (currentStepIndex >= 0) {
             completion = Math.round(((currentStepIndex) / (totalSteps - 1)) * 100);
        }
    }


    return (
        <div className="w-full md:w-1/3 lg:w-1/4 bg-slate-800 text-white p-6 md:p-8 flex flex-col rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
            <h2 className="text-2xl font-bold tracking-tight">Create Profile</h2>
            <p className="text-slate-400 mt-1">Join our community of professionals.</p>

            <nav className="my-10 flex-grow">
                <ul className="space-y-4">
                    {steps.map(({ step, title, icon: Icon }) => {
                        const isCompleted = currentStep > step;
                        const isActive = currentStep === step;
                        return (
                            <li key={step} className="flex items-center space-x-4">
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                                    isActive ? 'bg-rose-500' : isCompleted ? 'bg-green-500' : 'bg-slate-700'
                                }`}>
                                    {isCompleted ? <Check /> : <Icon size={20} />}
                                </div>
                                <span className={`font-semibold transition-colors ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                    {title}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div>
                <p className="text-sm font-medium">Profile Completion</p>
                <div className="flex items-center space-x-3 mt-2">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className="bg-rose-500 h-2 rounded-full transition-all duration-300" style={{ width: `${completion}%` }}></div>
                    </div>
                    <span className="text-sm font-semibold">{completion}%</span>
                </div>
            </div>
        </div>
    );
};

const SearchableDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const filteredOptions = options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        const close = () => setIsOpen(false);
        if (isOpen) {
            window.addEventListener('click', close);
        }
        return () => window.removeEventListener('click', close);
    }, [isOpen]);

    return (
        <div className="relative" onClick={e => e.stopPropagation()}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full p-2.5 border border-slate-300 rounded-lg text-left flex justify-between items-center bg-white hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-rose-300 focus:border-rose-500">
                <span className={selected ? 'text-slate-800' : 'text-slate-400'}>{selected || placeholder}</span>
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-md shadow-lg z-10">
                    <div className="p-2 relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search locations..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-8 border border-slate-200 rounded-md focus:ring-rose-500 focus:border-rose-500"
                        />
                    </div>
                    <ul className="max-h-48 overflow-y-auto p-1">
                        {filteredOptions.map(opt => (
                            <li key={opt} onClick={() => { onSelect(opt); setIsOpen(false); }} className="p-2 text-sm text-slate-800 hover:bg-rose-50 rounded cursor-pointer">{opt}</li>
))}
                    </ul>
                </div>
            )}
        </div>
    );
};


// --- WIZARD COMPONENT ---
interface SignUpWizardProps {
  onComplete: (profile: ProfessionalProfile) => void;
  onNavigateToLogin: () => void;
  onViewLiveProfile: () => void;
  isOnboardingOnly?: boolean;
  initialData?: ProfessionalProfile | null;
}

const defaultNewProfile: ProfessionalProfile = {
    id: '',
    name: '',
    email: '',
    specialty: 'Nail Artistry',
    bio: '',
    location: '',
    profileImage: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=800', 
    availability: 'Available Now',
    reviews: [],
    services: [],
    predefinedServices: [],
    tiktokUrls: [],
    instagramEmbedUrls: [],
    profileEmbedUrl: '',
    instagramFeed: [],
    socials: {},
    travelPolicy: { locations: [] },
    isProfileComplete: false,
};

const SignUpWizard: React.FC<SignUpWizardProps> = ({ onComplete, onNavigateToLogin, onViewLiveProfile, isOnboardingOnly = false, initialData = null }) => {
    
    const flowSteps = useMemo(() => 
        isOnboardingOnly 
            ? WIZARD_STEPS_CONFIG.filter(s => s.step > 2) 
            : WIZARD_STEPS_CONFIG, 
    [isOnboardingOnly]);
    
    const [stepIndex, setStepIndex] = useState(0);
    const currentStep = flowSteps[stepIndex];
    const sidebarSteps = useMemo(() => flowSteps.filter(s => !s.isInterstitial), [flowSteps]);

    const [profileData, setProfileData] = useState<Partial<ProfessionalProfile>>({
        ...defaultNewProfile,
        travelPolicy: { locations: [] }, predefinedServices: [], services: [], tiktokUrls: [], instagramEmbedUrls: [], bio: ''
    });
    const [accountData, setAccountData] = useState({ id: `user_${Date.now()}`, name: '', email: '', password: '', confirmPassword: ''});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [embedCode, setEmbedCode] = useState('');
    const [instructionTab, setInstructionTab] = useState<'instagram' | 'tiktok'>('instagram');
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isGeneratingBio, setIsGeneratingBio] = useState(false);


    useEffect(() => {
        if(isOnboardingOnly && initialData) {
            setAccountData(prev => ({ ...prev, id: initialData.id, name: initialData.name, email: initialData.email }));
            setProfileData({ ...defaultNewProfile, ...initialData });
        }
    }, [isOnboardingOnly, initialData]);

    // --- Navigation & Validation ---
    const nextStep = () => {
        if(stepIndex < flowSteps.length - 1) {
            setStepIndex(i => i + 1);
        }
    };
    const prevStep = () => {
         if(stepIndex > 0) {
            setStepIndex(i => i - 1);
        }
    };
    const jumpToStep = (targetStep: number) => {
        const index = flowSteps.findIndex(s => s.step === targetStep);
        if (index !== -1) setStepIndex(index);
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!accountData.name.trim()) newErrors.name = 'Full name is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email)) newErrors.email = 'Invalid email address.';
        if (PROFILES.some(p => p.email.toLowerCase() === accountData.email.toLowerCase())) newErrors.email = 'An account with this email already exists.';
        if (accountData.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
        if (accountData.password !== accountData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleCreateAccount = async () => {
        if (!validateStep1()) return;
        
        setIsSubmitting(true);
        setErrors({});

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, accountData.email, accountData.password);
            const user = userCredential.user;

            // Create a shell profile document in Firestore immediately
            const shellProfile: ProfessionalProfile = {
                 ...defaultNewProfile,
                 id: user.uid,
                 email: user.email || '',
                 name: accountData.name,
                 isProfileComplete: false,
                 specialty: 'Nail Artistry' // Default value
            };

            await setDoc(doc(db, "professionals", user.uid), shellProfile);

            setAccountData(prev => ({ ...prev, id: user.uid }));
            setProfileData(prev => ({ ...prev, id: user.uid, email: user.email, name: accountData.name }));
            nextStep();

        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                setErrors({ email: 'This email address is already in use by another account.' });
            } else {
                setErrors({ confirmPassword: `An error occurred: ${error.message}` });
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleFinalSubmit = () => {
        const finalServices = [
            ...PREDEFINED_SERVICES.filter(s => profileData.predefinedServices?.includes(s.name)),
            ...(profileData.services || [])
        ].filter(s => s.name && s.price > 0);

        const finalProfile: ProfessionalProfile = {
            ...defaultNewProfile, 
            ...initialData,
            ...profileData,
            id: accountData.id,
            name: accountData.name,
            email: accountData.email,
            services: finalServices,
            isProfileComplete: true,
        };
        onComplete(finalProfile);
    }
    
    const handleDoThisLater = () => {
        // The shell profile is already created in handleCreateAccount
        // We just need to trigger the onComplete with the partial data
        const partialProfile: ProfessionalProfile = {
             ...defaultNewProfile,
             id: accountData.id,
             name: accountData.name,
             email: accountData.email,
             isProfileComplete: false,
             reviews: PROFILES[2].reviews, // Add sample reviews for incomplete profile
        };
        onComplete(partialProfile);
    };

    // --- Data Handlers ---
    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAccountData(prev => ({...prev, [name]: value}));
        if(errors[name]) setErrors(prev => ({...prev, [name]: ''}));
    };
    
    const handleProfileChange = (field: keyof ProfessionalProfile, value: any) => {
        setProfileData(prev => ({...prev, [field]: value}));
    };
    
    const handleGenerateBio = async () => {
        if (!process.env.API_KEY) {
            alert("API_KEY environment variable is not set. Cannot generate bio.");
            return;
        }
        setIsGeneratingBio(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Generate a short, friendly, and professional bio (around 80-100 words) for a beauty professional. Their name is ${accountData.name} and their specialty is ${profileData.specialty}. The bio should be written in the first person (e.g., 'I am passionate about...'). Emphasize expertise, client satisfaction, and a welcoming attitude.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            handleProfileChange('bio', response.text);
        } catch (error) {
            console.error("Error generating bio:", error);
            alert("Sorry, there was an error generating the bio. Please try again.");
        } finally {
            setIsGeneratingBio(false);
        }
    };
    
    const inputStyles = "w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition-shadow";

    // --- Step Content Renderers ---
    const renderStepContent = () => {
        switch (currentStep.step) {
            case 1: // Account Creation
                return (
                    <div className="w-full max-w-lg mx-auto">
                        <StepHeader title="Create your account" subtitle="Let's start with the basics." />
                        <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
                          <div className="space-y-4">
                              <div><label className="block text-sm font-medium text-slate-700">Full Name</label><input name="name" value={accountData.name} onChange={handleAccountChange} className={`mt-1 ${inputStyles}`} placeholder="e.g., Jane Doe"/>{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}</div>
                              <div><label className="block text-sm font-medium text-slate-700">Email Address</label><input name="email" type="email" value={accountData.email} onChange={handleAccountChange} className={`mt-1 ${inputStyles}`} placeholder="you@example.com"/>{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}</div>
                              <div><label className="block text-sm font-medium text-slate-700">Password</label><input name="password" type="password" value={accountData.password} onChange={handleAccountChange} className={`mt-1 ${inputStyles}`} placeholder="8+ characters"/>{errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}</div>
                              <div><label className="block text-sm font-medium text-slate-700">Confirm Password</label><input name="confirmPassword" type="password" value={accountData.confirmPassword} onChange={handleAccountChange} className={`mt-1 ${inputStyles}`} placeholder="Re-type your password" />{errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}</div>
                          </div>
                        </div>
                    </div>
                );
            case 2: // Confirmation Screen
                 return (
                    <div className="text-center w-full max-w-md mx-auto">
                        <Check className="w-20 h-20 text-green-500 mx-auto bg-green-100 rounded-full p-4" />
                        <h2 className="text-3xl font-bold text-slate-800 mt-4">Account Created!</h2>
                        <p className="text-slate-500 mt-1">What would you like to do next?</p>
                        <div className="mt-8 space-y-3">
                            <button onClick={nextStep} className="w-full bg-rose-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-rose-600 transition-colors shadow-md hover:shadow-lg transform hover:scale-105">Start Profile Wizard</button>
                            <button onClick={handleDoThisLater} className="w-full text-slate-600 font-semibold py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors">I'll Do This Later</button>
                        </div>
                    </div>
                 );
            case 3: // Location & Introduction
                const handleTravelLocationToggle = (location: string) => {
                    const current = profileData.travelPolicy?.locations ?? [];
                    const newLocations = current.includes(location) ? current.filter(l => l !== location) : [...current, location];
                    handleProfileChange('travelPolicy', { locations: newLocations });
                };
                 return (
                    <div className="w-full max-w-4xl mx-auto">
                        <StepHeader title="Location & Introduction" subtitle="Help clients find and get to know you." />
                        <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                 <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">Bio / Introduction</label>
                                    <textarea id="bio" value={profileData.bio || ''} onChange={(e) => handleProfileChange('bio', e.target.value)} rows={5} className={inputStyles} placeholder="Tell clients a little about yourself, your passion, and your work..."></textarea>
                                     <button 
                                        onClick={handleGenerateBio} 
                                        disabled={isGeneratingBio}
                                        className="mt-2 w-full flex items-center justify-center gap-2 text-sm font-semibold text-rose-500 p-2 border-2 border-dashed rounded-lg hover:bg-rose-50 hover:border-rose-400 transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-wait">
                                         {isGeneratingBio ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                                                Generating...
                                            </>
                                         ) : (
                                            <><Sparkles size={16}/> Generate with AI</>
                                         )}
                                     </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Status</label>
                                    <div className="flex items-center justify-between bg-slate-100 p-2 rounded-lg">
                                        <span className={`font-semibold transition-colors ${profileData.availability === 'Available Now' ? 'text-green-600' : 'text-slate-500'}`}>
                                            {profileData.availability === 'Available Now' ? 'Available for Bookings' : 'Currently Unavailable'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleProfileChange('availability', profileData.availability === 'Available Now' ? 'Unavailable' : 'Available Now')}
                                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${profileData.availability === 'Available Now' ? 'bg-green-500' : 'bg-slate-300'}`}
                                            aria-pressed={profileData.availability === 'Available Now'}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${profileData.availability === 'Available Now' ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                             {/* Right Column */}
                             <div className="space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1"><Building size={16} /> Your Base Location</label>
                                    <SearchableDropdown options={DUBLIN_LOCATIONS} selected={profileData.location} onSelect={(loc) => handleProfileChange('location', loc)} placeholder="Select a neighborhood" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1"><Hand size={16} /> Travel Policy</label>
                                    <p className="text-xs text-slate-500 mb-2">Select the locations you are willing to travel to for clients.</p>
                                    <div className="grid grid-cols-2 gap-2 p-2 border rounded-lg max-h-48 overflow-y-auto bg-slate-50/50">
                                        {DUBLIN_LOCATIONS.map(loc => {
                                            const isSelected = (profileData.travelPolicy?.locations ?? []).includes(loc);
                                            return (
                                            <label key={loc} className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-all duration-200 ${isSelected ? 'bg-rose-200 text-slate-800 shadow' : 'bg-white hover:bg-rose-50 text-slate-700'}`}>
                                                <input type="checkbox" checked={isSelected} onChange={() => handleTravelLocationToggle(loc)} className="hidden"/>
                                                {isSelected && <Check size={16} className="flex-shrink-0"/>}
                                                <span className="text-sm font-semibold">{loc}</span>
                                            </label>
                                        )})}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Services & Pricing
                const handlePredefinedServiceToggle = (serviceName: string) => {
                    const current = profileData.predefinedServices || [];
                    const newServices = current.includes(serviceName) ? current.filter(s => s !== serviceName) : [...current, serviceName];
                    handleProfileChange('predefinedServices', newServices);
                };
                const handleAddCustomService = () => handleProfileChange('services', [...(profileData.services || []), { name: '', price: 0, category: 'Other' }]);
                const handleCustomServiceChange = (i: number, f: keyof Service, v: string|number) => {
                    const newServices = [...(profileData.services || [])];
                    (newServices[i] as any)[f] = v;
                    handleProfileChange('services', newServices);
                };
                const handleRemoveCustomService = (i: number) => handleProfileChange('services', (profileData.services || []).filter((_, idx) => i !== idx));

                return (
                    <div className="w-full max-w-3xl mx-auto">
                         <StepHeader title="Services & Pricing" subtitle="Define the services you offer to clients." />
                        <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 space-y-8">
                            <div>
                               <h3 className="font-bold text-slate-800 text-lg mb-3 flex items-center gap-2"><Star size={20} className="text-rose-500" />Select Your Main Services</h3>
                               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                   {PREDEFINED_SERVICES.map(service => {
                                       const isSelected = profileData.predefinedServices?.includes(service.name);
                                       return (
                                        <button key={service.name} onClick={() => handlePredefinedServiceToggle(service.name)} className={`relative p-3 text-left border-2 rounded-lg transition-all transform hover:-translate-y-1 ${isSelected ? 'border-rose-500 bg-rose-50' : 'bg-white hover:border-slate-400'}`}>
                                           {isSelected && <div className="absolute top-2 right-2 bg-rose-500 text-white rounded-full h-5 w-5 flex items-center justify-center"><Check size={12}/></div>}
                                           <div className="font-bold text-sm text-slate-800">{service.name}</div><div className="text-xs text-slate-500">{service.category}</div><div className="text-sm font-semibold text-rose-600 mt-2">€{service.price}</div>
                                       </button>
                                   )})}
                               </div>
                            </div>
                            <div>
                               <h3 className="font-bold text-slate-800 text-lg mb-3 flex items-center gap-2"><Heart size={20} className="text-rose-500" />Add Custom Services</h3>
                               <div className="space-y-3">
                                    {(profileData.services || []).map((s, i) => (
                                        <div key={i} className="flex items-end gap-3 bg-slate-50 p-4 rounded-lg border">
                                            <div className="flex-grow"><label className="text-xs font-medium text-slate-600">Service Name</label><input type="text" value={s.name} onChange={(e) => handleCustomServiceChange(i, 'name', e.target.value)} className={inputStyles} placeholder="e.g., Olaplex Treatment"/></div>
                                            <div className="flex-grow"><label className="text-xs font-medium text-slate-600">Category</label>
                                                <select value={s.category} onChange={(e) => handleCustomServiceChange(i, 'category', e.target.value)} className={inputStyles}>
                                                     {SERVICE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                </select>
                                            </div>
                                            <div><label className="text-xs font-medium text-slate-600">Price (€)</label><input type="number" value={s.price || ''} onChange={(e) => handleCustomServiceChange(i, 'price', Number(e.target.value))} className={`${inputStyles} w-28`} placeholder="0"/></div>
                                            <button onClick={() => handleRemoveCustomService(i)} className="h-10 w-10 flex-shrink-0 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-colors"><X size={18}/></button>
                                        </div>
                                    ))}
                               </div>
                               <button onClick={handleAddCustomService} className="mt-4 w-full text-sm font-semibold text-rose-500 p-2 border-2 border-dashed rounded-lg hover:bg-rose-50 hover:border-rose-400 transition-colors">+ Add another service</button>
                            </div>
                        </div>
                    </div>
                );
            case 5: // Portfolio
                const handleAddEmbed = () => {
                    const isTikTok = embedCode.includes('tiktok-embed');
                    const isInstagram = embedCode.includes('instagram-media');
                    let url = '';

                    if (isTikTok) {
                        const match = embedCode.match(/cite="([^"]+)"/);
                        if (match) url = match[1];
                    } else if (isInstagram) {
                        const match = embedCode.match(/data-instgrm-permalink="([^"]+)"/);
                        if (match) url = match[1];
                    }

                    if (url) {
                        if (isTikTok) {
                            const currentUrls = profileData.tiktokUrls || [];
                            if (!currentUrls.includes(url)) {
                                handleProfileChange('tiktokUrls', [...currentUrls, url]);
                            }
                        } else if (isInstagram) {
                            const currentUrls = profileData.instagramEmbedUrls || [];
                            if (!currentUrls.includes(url)) {
                                handleProfileChange('instagramEmbedUrls', [...currentUrls, url]);
                            }
                        }
                        setEmbedCode('');
                    } else {
                        alert('Could not find a valid TikTok or Instagram URL in the embed code. Please check the code and try again.');
                    }
                };

                const handleRemoveEmbed = (type: 'tiktok' | 'instagram', urlToRemove: string) => {
                    const newProfileData = { ...profileData };
                    if (type === 'tiktok') {
                        newProfileData.tiktokUrls = (profileData.tiktokUrls || []).filter(u => u !== urlToRemove);
                    } else {
                        newProfileData.instagramEmbedUrls = (profileData.instagramEmbedUrls || []).filter(u => u !== urlToRemove);
                    }
                     if(newProfileData.profileEmbedUrl === urlToRemove) {
                        newProfileData.profileEmbedUrl = undefined;
                    }
                    setProfileData(newProfileData);
                };

                const handlePinEmbed = (url: string) => {
                    const currentPin = profileData.profileEmbedUrl;
                    handleProfileChange('profileEmbedUrl', currentPin === url ? undefined : url);
                };
                
                const InstructionStep = ({ icon: Icon, title, description }) => (
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-rose-100 text-rose-500 rounded-lg flex items-center justify-center">
                            <Icon size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-800">{title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                        </div>
                    </div>
                );

                return (
                    <div className="w-full max-w-4xl mx-auto">
                        <StepHeader title="Build Your Portfolio" subtitle="Embed posts from Instagram & TikTok to showcase your work."/>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column: Instructions */}
                            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-4">
                                <h3 className="text-lg font-bold text-slate-800">How to get embed codes</h3>
                                
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button 
                                        onClick={() => setInstructionTab('instagram')}
                                        className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${instructionTab === 'instagram' ? 'bg-white text-rose-500 shadow' : 'text-slate-600'}`}>
                                        <InstagramIcon className="inline-block mr-2 w-4 h-4"/> Instagram
                                    </button>
                                    <button 
                                        onClick={() => setInstructionTab('tiktok')}
                                        className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${instructionTab === 'tiktok' ? 'bg-white text-rose-500 shadow' : 'text-slate-600'}`}>
                                         <TikTokIcon className="inline-block mr-2 w-4 h-4"/> TikTok
                                    </button>
                                </div>

                                <div className="space-y-4 pt-2">
                                    {instructionTab === 'instagram' && (
                                        <>
                                            <InstructionStep 
                                                icon={Monitor} 
                                                title="Go to Post on Desktop" 
                                                description="The embed option is only available on a computer browser." 
                                            />
                                            <InstructionStep 
                                                icon={MoreHorizontal} 
                                                title="Click the '...' Menu" 
                                                description="Find the three dots at the top-right of the post you want to share."
                                            />
                                            <InstructionStep 
                                                icon={FileCode} 
                                                title="Select 'Embed'" 
                                                description="This will open a pop-up with the embeddable code."
                                            />
                                            <InstructionStep 
                                                icon={Copy} 
                                                title="Copy & Paste Code" 
                                                description="Click 'Copy Embed Code' and paste it into the box on the right."
                                            />
                                        </>
                                    )}
                                    {instructionTab === 'tiktok' && (
                                        <>
                                            <InstructionStep 
                                                icon={Monitor} 
                                                title="Go to Video on Desktop" 
                                                description="Find the video you want to share using your computer's browser." 
                                            />
                                            <InstructionStep 
                                                icon={FileCode} 
                                                title="Click the </> Embed Button" 
                                                description="On the right side of the video, you'll see an 'Embed' button."
                                            />
                                            <InstructionStep 
                                                icon={Copy} 
                                                title="Copy & Paste Code" 
                                                description="Click the 'Copy code' button and paste it into the box here."
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Input & Lists */}
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><FileCode size={16}/> Paste Embed Code Here</label>
                                    <textarea
                                        value={embedCode}
                                        onChange={(e) => setEmbedCode(e.target.value)}
                                        rows={4}
                                        className={`${inputStyles} font-mono text-sm`}
                                        placeholder="<blockquote class=...>...</blockquote>"
                                    />
                                    <button onClick={handleAddEmbed} disabled={!embedCode.trim()} className="mt-2 w-full bg-rose-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-rose-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
                                        Add to Portfolio
                                    </button>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><TikTokIcon /> Added TikToks</h4>
                                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                                            {(profileData.tiktokUrls || []).length > 0 ? profileData.tiktokUrls?.map(url => (
                                                <div key={url} className="bg-slate-100 p-2 rounded-md flex items-center justify-between gap-2">
                                                    <p className="text-xs text-slate-600 truncate flex-grow">{url.split('?')[0]}</p>
                                                    <button onClick={() => handlePinEmbed(url)} title="Set as profile picture" className={`p-1 rounded-full transition-colors ${profileData.profileEmbedUrl === url ? 'bg-rose-200 text-rose-600' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}><Pin size={14}/></button>
                                                    <button onClick={() => handleRemoveEmbed('tiktok', url)} className="w-6 h-6 flex-shrink-0 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center"><X size={14}/></button>
                                                </div>
                                            )) : <p className="text-sm text-slate-400 text-center py-2">No TikToks added yet.</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><InstagramIcon /> Added Instagram Posts</h4>
                                        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                                            {(profileData.instagramEmbedUrls || []).length > 0 ? profileData.instagramEmbedUrls?.map(url => (
                                                <div key={url} className="bg-slate-100 p-2 rounded-md flex items-center justify-between gap-2">
                                                    <p className="text-xs text-slate-600 truncate flex-grow">{url.split('?')[0]}</p>
                                                    <button onClick={() => handlePinEmbed(url)} title="Set as profile picture" className={`p-1 rounded-full transition-colors ${profileData.profileEmbedUrl === url ? 'bg-rose-200 text-rose-600' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}><Pin size={14}/></button>
                                                    <button onClick={() => handleRemoveEmbed('instagram', url)} className="w-6 h-6 flex-shrink-0 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center"><X size={14}/></button>
                                                </div>
                                            )) : <p className="text-sm text-slate-400 text-center py-2">No Instagram posts added yet.</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 6: // Preview
                const allServices = [...PREDEFINED_SERVICES.filter(s => profileData.predefinedServices?.includes(s.name)), ...(profileData.services || [])].filter(s => s.name && s.price > 0);
                const previewProfile: ProfessionalProfile = {
                    ...defaultNewProfile,
                    ...initialData,
                    ...profileData,
                    id: accountData.id,
                    name: accountData.name,
                    email: accountData.email,
                    services: allServices,
                    isProfileComplete: true, // For preview purposes
                    reviews: PROFILES[0].reviews.length > 0 ? PROFILES[0].reviews : [{ author: 'Sample', rating: 5, comment: 'Looks great!' }],
                    bio: profileData.bio || "This is a sample bio. Go back and add your own!",
                    profileImage: profileData.profileImage || defaultNewProfile.profileImage,
                    location: profileData.location || "Dublin, Ireland",
                    specialty: profileData.specialty || "Nail Artistry"
                };

                 return (
                    <div className="w-full max-w-5xl mx-auto">
                        <StepHeader title="Preview Your Profile" subtitle="This is how clients will see you. Go back and edit anything you need." />
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            
                            {/* Left Column: Summary & Edits */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-4 h-fit">
                                <h3 className="font-bold text-lg text-slate-800">Quick Summary</h3>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-slate-700">Location & Intro</h4>
                                        <button onClick={() => jumpToStep(3)} className="text-sm font-semibold text-rose-500 hover:underline">Edit</button>
                                    </div>
                                    <p className="text-sm text-slate-500">{profileData.location || 'Not set'}</p>
                                </div>
                                 <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-slate-700">Services</h4>
                                        <button onClick={() => jumpToStep(4)} className="text-sm font-semibold text-rose-500 hover:underline">Edit</button>
                                    </div>
                                    <p className="text-sm text-slate-500">{allServices.length} services added.</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-slate-700">Portfolio</h4>
                                        <button onClick={() => jumpToStep(5)} className="text-sm font-semibold text-rose-500 hover:underline">Edit</button>
                                    </div>
                                    <p className="text-sm text-slate-500">{(profileData.tiktokUrls?.length || 0) + (profileData.instagramEmbedUrls?.length || 0)} posts added.</p>
                                </div>
                            </div>

                            {/* Right Column: Previews */}
                            <div className="lg:col-span-3 space-y-6">
                                 <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                                    <h3 className="font-bold text-lg text-slate-800 mb-2 text-center">Card Preview</h3>
                                    <p className="text-center text-sm text-slate-500 mb-4">This is how your profile appears in search results.</p>
                                    <div className="w-[300px] h-[430px] mx-auto">
                                       <ProfileCard profile={previewProfile} onView={() => setIsPreviewModalOpen(true)} />
                                    </div>
                                 </div>
                                 <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 text-center">
                                    <h3 className="font-bold text-lg text-slate-800">Full Profile Preview</h3>
                                     <p className="text-sm text-slate-500 mt-1 mb-4">See all the details clients will view.</p>
                                     <button onClick={() => setIsPreviewModalOpen(true)} className="w-full bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-800 transition-colors">
                                        View Full Profile Details
                                     </button>
                                 </div>
                            </div>
                        </div>
                        
                        {/* Modal */}
                        {isPreviewModalOpen && (
                            <ProfileDetailView 
                                profile={previewProfile} 
                                onClose={() => setIsPreviewModalOpen(false)} 
                                isPreview={true} 
                            />
                        )}
                    </div>
                );
            case 7: // Complete
                return (
                    <div className="text-center w-full max-w-md mx-auto">
                        <Check className="w-20 h-20 text-green-500 mx-auto bg-green-100 rounded-full p-4" />
                        <h2 className="text-3xl font-bold text-slate-800 mt-4">Profile Complete!</h2>
                        <p className="text-slate-500 mt-1">You're all set. Welcome to the community.</p>
                        <div className="mt-8 space-y-3">
                            <button onClick={handleFinalSubmit} className="w-full bg-rose-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-rose-600 transition-colors shadow-md hover:shadow-lg transform hover:scale-105">Go to My Dashboard</button>
                            <button onClick={onViewLiveProfile} className="w-full bg-white text-slate-700 border border-slate-300 font-bold py-3 px-6 rounded-lg hover:bg-slate-50 transition-colors">View My Live Profile</button>
                            <button className="w-full text-slate-600 font-semibold py-3 px-6 rounded-lg hover:bg-slate-200/70 transition-colors">Share My Profile</button>
                        </div>
                    </div>
                 );
            default: return null;
        }
    };

    const isNavVisible = !currentStep.isInterstitial;
    const canGoPrev = stepIndex > 0;
    const handleNextClick = currentStep.step === 1 ? handleCreateAccount : nextStep;

    // --- MAIN RENDER ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-slate-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-6xl flex flex-col md:flex-row shadow-2xl rounded-2xl min-h-[700px] bg-white">
                <WizardSidebar currentStep={currentStep.step} steps={sidebarSteps} />
                
                <div className="w-full md:w-2/3 lg:w-3/4 p-6 md:p-12 flex flex-col">
                   <div className="flex-grow flex flex-col justify-center">
                        {renderStepContent()}
                   </div>
                   
                   {isNavVisible && (
                        <div className="mt-12 flex justify-between items-center w-full max-w-5xl mx-auto flex-shrink-0">
                           {canGoPrev ? <button onClick={prevStep} className="font-semibold text-slate-600 hover:text-slate-900 py-2 px-4 rounded-lg hover:bg-slate-200/70 transition-colors">Previous</button> : <div/>}
                           {currentStep.step !== 6 ? (
                               <button 
                                    onClick={handleNextClick} 
                                    disabled={(currentStep.step === 3 && !profileData.location) || isSubmitting}
                                    className="bg-rose-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-rose-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center min-w-[150px]">
                                    {isSubmitting ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                        currentStep.step === 1 ? 'Create Account' : currentStep.step === 5 ? 'Finish & View Preview' : 'Next'
                                    )}
                               </button>
                           ) : (
                                <button onClick={nextStep} className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg transform hover:scale-105">Complete Profile</button>
                           )}
                       </div>
                   )}
                </div>
            </div>
        </div>
    );
};

export default SignUpWizard;