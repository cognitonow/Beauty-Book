import React, { useState, useEffect } from 'react';
import { PROFILES, DUBLIN_LOCATIONS, SERVICE_CATEGORIES } from '../constants';
import { ProfessionalProfile, Service, Review, Booking, Notification } from '../types';
import { FileCode, X, Pin, Bell, Calendar, MessageSquare, Check, XCircle, ChevronLeft, LogOut } from 'lucide-react';
import TikTokFeed from './TikTokFeed';
import BookingChatView from './BookingChatView';
import NotificationsPanel from './NotificationsPanel';


// Instagram's script adds a global 'instgrm' object.
declare global {
    interface Window {
        instgrm: any;
    }
}

// Icon components
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

// InstagramFeed component
const InstagramFeed: React.FC<{ urls: string[] }> = ({ urls = [] }) => {
    useEffect(() => {
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    }, [urls]);

    if (!urls || urls.length === 0) {
        return (
            <div className="h-[200px] w-full flex flex-col items-center justify-center text-center text-slate-500 bg-slate-100 rounded-lg p-4">
                 <InstagramIcon className="w-12 h-12 text-slate-400 mb-4" />
                <h3 className="font-bold">Portfolio is Empty</h3>
                <p className="text-sm text-slate-400 mt-1">This professional hasn't added any Instagram posts yet.</p>
            </div>
        );
    }
    
    return (
        <div className="flex space-x-4 overflow-x-auto p-2 -m-2 scrollbar-hide">
            {urls.map(url => (
                <div key={url} className="flex-shrink-0 w-[325px]">
                    <blockquote
                        className="instagram-media"
                        data-instgrm-permalink={url}
                        data-instgrm-version="14"
                        style={{ maxWidth: '325px', width: '100%', border: '1px solid #dbdbdb', borderRadius: '3px' }}
                    ></blockquote>
                </div>
            ))}
        </div>
    );
};


const Header: React.FC<{
    onSwitchRole: () => void;
    onToggleEditMode: () => void;
    onLogout: () => void;
    unreadCount: number;
    onToggleNotifications: () => void;
}> = ({ onSwitchRole, onToggleEditMode, onLogout, unreadCount, onToggleNotifications }) => (
    <header className="py-4 px-6 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-20 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-rose-500 tracking-tight">ProfileMatch</h1>
        <p className="text-sm text-slate-500">Professional Dashboard</p>
      </div>
      <div className="flex items-center space-x-3">
        <button onClick={onSwitchRole} className="text-sm font-semibold text-slate-600 hover:text-rose-500 px-4 py-2 bg-slate-100 rounded-lg" title="Switch Role">
            Switch to Client
        </button>
        <button onClick={onToggleNotifications} className="relative p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
            <Bell size={20} />
            {unreadCount > 0 && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>}
        </button>
        <button onClick={onToggleEditMode} className="text-sm font-semibold text-white px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg shadow-sm hover:shadow-md">Edit Profile</button>
        <button onClick={onLogout} className="text-sm font-semibold text-slate-600 hover:text-rose-500 p-2 bg-slate-100 rounded-full" title="Logout">
            <LogOut size={20}/>
        </button>
      </div>
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

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
    <section className={`bg-white p-6 rounded-xl shadow-sm ${className}`}>
      <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
      {children}
    </section>
);

const IncompleteProfileBanner: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-r-lg mb-6" role="alert">
      <div className="flex">
        <div className="py-1"><svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 11v4h2v-4H9zm0-4v2h2V7H9z"/></svg></div>
        <div>
          <p className="font-bold">Your profile is almost there!</p>
          <p className="text-sm">Complete your profile to become visible to clients and start getting bookings.</p>
          <button onClick={onStart} className="mt-2 text-sm font-semibold text-white px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg shadow-sm hover:shadow-md">
            Complete Profile Now
          </button>
        </div>
      </div>
    </div>
);


const PortfolioViewer: React.FC<{ profile: ProfessionalProfile }> = ({ profile }) => {
    const hasInstagramEmbeds = profile.instagramEmbedUrls && profile.instagramEmbedUrls.length > 0;
    const hasTiktokFeed = profile.tiktokUrls && profile.tiktokUrls.length > 0;
    
    const getInitialTab = () => {
        if (hasTiktokFeed) return 'tiktok';
        if (hasInstagramEmbeds) return 'instagram';
        return 'tiktok'; // Default
    };
    
    const [activeTab, setActiveTab] = useState<'tiktok' | 'instagram'>(getInitialTab());
    
    useEffect(() => {
        setActiveTab(getInitialTab());
    }, [profile.id, hasTiktokFeed, hasInstagramEmbeds]);
    
    if (!hasTiktokFeed && !hasInstagramEmbeds) {
        return <p className="italic text-slate-400 text-center py-8">No portfolio items added yet. Click 'Edit Profile' to add some.</p>;
    }
    
    return (
        <div>
            <div className="flex w-full max-w-xs bg-slate-100 rounded-lg p-1 mb-4">
              {hasTiktokFeed && (
                  <button onClick={() => setActiveTab('tiktok')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activeTab === 'tiktok' ? 'bg-white text-rose-500 shadow' : 'text-slate-600'}`}>
                      <TikTokIcon className="w-4 h-4" /> TikTok
                  </button>
              )}
               {hasInstagramEmbeds && (
                  <button onClick={() => setActiveTab('instagram')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 ${activeTab === 'instagram' ? 'bg-white text-rose-500 shadow' : 'text-slate-600'}`}>
                      <InstagramIcon className="w-4 h-4" /> Instagram
                  </button>
               )}
            </div>
            
            <div>
              {activeTab === 'tiktok' && <TikTokFeed urls={profile.tiktokUrls || []} />}
              {activeTab === 'instagram' && <InstagramFeed urls={profile.instagramEmbedUrls || []} />}
            </div>
        </div>
    );
};

const PortfolioEditor: React.FC<{
    tiktokUrls: string[];
    instagramUrls: string[];
    profileEmbedUrl?: string;
    onUpdate: (type: 'tiktok' | 'instagram', newUrls: string[]) => void;
    onPin: (url: string) => void;
}> = ({ tiktokUrls, instagramUrls, profileEmbedUrl, onUpdate, onPin }) => {
    const [embedCode, setEmbedCode] = useState('');
    const inputStyles = "w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition-shadow";

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
                if (!tiktokUrls.includes(url)) {
                    onUpdate('tiktok', [...tiktokUrls, url]);
                }
            } else if (isInstagram) {
                if (!instagramUrls.includes(url)) {
                    onUpdate('instagram', [...instagramUrls, url]);
                }
            }
            setEmbedCode('');
        } else {
            alert('Could not find a valid TikTok or Instagram URL in the embed code.');
        }
    };

    const handleRemoveEmbed = (type: 'tiktok' | 'instagram', urlToRemove: string) => {
        if (type === 'tiktok') {
            onUpdate('tiktok', tiktokUrls.filter(u => u !== urlToRemove));
        } else {
            onUpdate('instagram', instagramUrls.filter(u => u !== urlToRemove));
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><FileCode size={16}/> Paste Embed Code Here</label>
                <textarea
                    value={embedCode}
                    onChange={(e) => setEmbedCode(e.target.value)}
                    rows={3}
                    className={`${inputStyles} font-mono text-sm`}
                    placeholder="<blockquote class=...>...</blockquote>"
                />
                <button onClick={handleAddEmbed} disabled={!embedCode.trim()} className="mt-2 w-full bg-rose-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-rose-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
                    Add to Portfolio
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><TikTokIcon /> Added TikToks</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 rounded-lg bg-slate-50 p-2 border">
                        {tiktokUrls.length > 0 ? tiktokUrls.map(url => (
                            <div key={url} className="bg-white p-2 rounded-md flex items-center justify-between gap-2 shadow-sm">
                                <p className="text-xs text-slate-600 truncate flex-grow">{url.split('?')[0]}</p>
                                <button onClick={() => onPin(url)} title="Pin to profile" className={`p-1 rounded-full transition-colors ${profileEmbedUrl === url ? 'bg-rose-200 text-rose-600' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}><Pin size={14}/></button>
                                <button onClick={() => handleRemoveEmbed('tiktok', url)} className="w-6 h-6 flex-shrink-0 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center"><X size={14}/></button>
                            </div>
                        )) : <p className="text-sm text-slate-400 text-center py-4">No TikToks added.</p>}
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2"><InstagramIcon /> Added Instagram Posts</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 rounded-lg bg-slate-50 p-2 border">
                        {instagramUrls.length > 0 ? instagramUrls.map(url => (
                            <div key={url} className="bg-white p-2 rounded-md flex items-center justify-between gap-2 shadow-sm">
                                <p className="text-xs text-slate-600 truncate flex-grow">{url.split('?')[0]}</p>
                                 <button onClick={() => onPin(url)} title="Pin to profile" className={`p-1 rounded-full transition-colors ${profileEmbedUrl === url ? 'bg-rose-200 text-rose-600' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}><Pin size={14}/></button>
                                <button onClick={() => handleRemoveEmbed('instagram', url)} className="w-6 h-6 flex-shrink-0 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center"><X size={14}/></button>
                            </div>
                        )) : <p className="text-sm text-slate-400 text-center py-4">No Instagram posts added.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ProfessionalViewProps {
    profile: ProfessionalProfile;
    onUpdateProfile: (updatedProfile: ProfessionalProfile) => void;
    onSwitchRole: () => void;
    onStartOnboarding: () => void;
    onLogout: () => void;
    bookings: Booking[];
    notifications: Notification[];
    onUpdateBookingStatus: (bookingId: string, status: 'approved' | 'declined') => void;
    onSendMessage: (bookingId: string, text: string) => void;
    onMarkRead: (notificationIds: string[]) => void;
}

const ProfessionalView: React.FC<ProfessionalViewProps> = ({ profile, onUpdateProfile, onSwitchRole, onStartOnboarding, onLogout, bookings, notifications, onUpdateBookingStatus, onSendMessage, onMarkRead }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<ProfessionalProfile | null>(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
    const [showNotifications, setShowNotifications] = useState(false);

    const totalReviews = profile.reviews.length;
    const averageRating = totalReviews > 0 ? (profile.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : '0';
    const upcomingBookingsCount = bookings.filter(b => b.status === 'approved').length;
    const pendingRequests = bookings.filter(b => b.status === 'pending');

    const handleEditClick = () => {
        setEditData(JSON.parse(JSON.stringify(profile)));
        setIsEditing(true);
        setActiveTab('dashboard');
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditData(null);
    };

    const handleSaveClick = () => {
        if (editData) {
            onUpdateProfile(editData);
        }
        setIsEditing(false);
        setEditData(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!editData) return;
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };
    
    const handleAvailabilityToggle = () => {
        if (!editData) return;
        setEditData({ ...editData, availability: editData.availability === 'Available Now' ? 'Unavailable' : 'Available Now' });
    };

    const handlePortfolioUpdate = (type: 'tiktok' | 'instagram', urls: string[]) => {
        if (!editData) return;
        const key = type === 'tiktok' ? 'tiktokUrls' : 'instagramEmbedUrls';
        const updatedData = { ...editData, [key]: urls };

        if (editData.profileEmbedUrl && !urls.includes(editData.profileEmbedUrl)) {
            updatedData.profileEmbedUrl = undefined;
        }
        setEditData(updatedData);
    };

    const handlePortfolioPin = (url: string) => {
        if (!editData) return;
        const newPin = editData.profileEmbedUrl === url ? undefined : url;
        setEditData(prev => ({ ...prev, profileEmbedUrl: newPin }));
    };

    const handleServiceChange = (index: number, field: keyof Service, value: string) => {
        if (!editData) return;
        const newServices = [...editData.services];
        if (field === 'price' || field === 'duration') {
            (newServices[index] as any)[field] = Number(value);
        } else {
            (newServices[index] as any)[field] = value;
        }
        setEditData({ ...editData, services: newServices });
    };

    const handleAddService = () => {
        if (!editData) return;
        const newServices = [...editData.services, { name: '', price: 0, duration: 0, category: 'Other' }];
        setEditData({ ...editData, services: newServices });
    };

    const handleRemoveService = (index: number) => {
        if (!editData) return;
        const newServices = editData.services.filter((_, i) => i !== index);
        setEditData({ ...editData, services: newServices });
    };
    
    const servicesByCategory = profile.services.reduce((acc, service) => {
        const category = service.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(service);
        return acc;
    }, {} as Record<string, Service[]>);

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
        setActiveTab('bookings');
        setShowNotifications(false);
      }
    };
    
    const inputStyles = "w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition-shadow";

    const renderContent = () => {
        if (activeTab === 'bookings') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Requests ({pendingRequests.length})</h3>
                        <div className="space-y-2">
                           {pendingRequests.map(b => (
                               <button key={b.id} onClick={() => setActiveBooking(b)} className={`w-full text-left p-3 rounded-lg border-2 ${activeBooking?.id === b.id ? 'border-rose-500 bg-rose-50' : 'border-transparent bg-white hover:bg-slate-50 shadow-sm'}`}>
                                   <div className="flex items-center gap-3">
                                       <img src={b.clientImage} alt={b.clientName} className="w-10 h-10 rounded-full" />
                                       <div>
                                           <p className="font-bold text-slate-900">{b.clientName}</p>
                                           <p className="text-sm text-slate-500">{b.service.name}</p>
                                       </div>
                                   </div>
                               </button>
                           ))}
                           {pendingRequests.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No pending requests.</p>}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        {activeBooking ? (
                            <BookingChatView 
                                booking={activeBooking}
                                currentUser={profile}
                                onSendMessage={onSendMessage}
                                onUpdateStatus={onUpdateBookingStatus}
                                onClose={() => setActiveBooking(null)}
                            />
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm h-full flex flex-col items-center justify-center text-center p-6">
                                <MessageSquare size={48} className="text-slate-300 mb-4"/>
                                <h3 className="text-xl font-bold text-slate-700">Select a request</h3>
                                <p className="text-slate-500">Choose a booking request from the left to view details and chat with the client.</p>
                            </div>
                        )}
                    </div>
                </div>
            )
        }
        
        // Dashboard View
        return (
            <div className="space-y-6">
                 {isEditing ? (
                    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between">
                         <h3 className="text-xl font-bold text-slate-800">Editing Profile...</h3>
                        <div className="flex items-center space-x-3">
                            <button onClick={handleCancelClick} className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleSaveClick} className="text-sm font-semibold text-white px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg shadow-sm hover:shadow-md transition-all">Save Changes</button>
                        </div>
                    </div>
                 ) : null}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard label="Upcoming Bookings" value={upcomingBookingsCount} icon={<Calendar size={24}/>} />
                    <StatCard label="Average Rating" value={averageRating} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.524 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.524 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.524-4.674a1 1 0 00-.363-1.118L2.98 9.11c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.524-4.674z" /></svg>} />
                    <StatCard label="Total Reviews" value={totalReviews} icon={<MessageSquare size={24} />} />
                </div>
                 {/* Profile Details */}
                <Section title="Profile Details">
                    {isEditing && editData ? (
                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input type="text" name="name" value={editData.name} onChange={handleInputChange} className={inputStyles} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                <select 
                                    name="location"
                                    value={editData.location} 
                                    onChange={handleInputChange} 
                                    className={inputStyles}
                                >
                                    {DUBLIN_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
                                <div className="flex items-center justify-between bg-slate-100 p-2 rounded-lg">
                                    <span className={`font-semibold transition-colors ${editData.availability === 'Available Now' ? 'text-green-600' : 'text-slate-500'}`}>
                                        {editData.availability === 'Available Now' ? 'Available for Bookings' : 'Currently Unavailable'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleAvailabilityToggle}
                                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${editData.availability === 'Available Now' ? 'bg-green-500' : 'bg-slate-300'}`}
                                        aria-pressed={editData.availability === 'Available Now'}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${editData.availability === 'Available Now' ? 'translate-x-5' : 'translate-x-0'}`}
                                        />
                                    </button>
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                <textarea name="bio" value={editData.bio} onChange={handleInputChange} rows={4} className={inputStyles} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-slate-600 mb-4">{profile.bio || <span className="italic text-slate-400">No bio provided.</span>}</p>
                            <div className="flex items-center space-x-6 text-sm">
                                <div className="flex items-center text-slate-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{profile.location || <span className="italic text-slate-400">No location set.</span>}</span>
                                </div>
                                <div className={`flex items-center space-x-1.5 font-medium ${profile.availability === 'Available Now' ? 'text-green-600' : 'text-slate-500'}`}>
                                    <span className="relative flex h-2.5 w-2.5">
                                        {profile.availability === 'Available Now' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${profile.availability === 'Available Now' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                    </span>
                                    <span>{profile.availability}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </Section>
                 
                <Section title="My Portfolio">
                    {isEditing ? (
                        <PortfolioEditor
                            tiktokUrls={editData.tiktokUrls || []}
                            instagramUrls={editData.instagramEmbedUrls || []}
                            profileEmbedUrl={editData.profileEmbedUrl}
                            onUpdate={handlePortfolioUpdate}
                            onPin={handlePortfolioPin}
                        />
                    ) : (
                        <PortfolioViewer profile={profile} />
                    )}
                </Section>
                
                <Section title="My Services">
                    <div className="space-y-4">
                    {isEditing && editData ? (
                        <>
                            {editData.services.map((s, i) => (
                                <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                                     <button onClick={() => handleRemoveService(i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 z-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                                            <input type="text" placeholder="e.g., Gel Manicure" value={s.name} onChange={(e) => handleServiceChange(i, 'name', e.target.value)} className={inputStyles} />
                                        </div>
                                         <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                            <select value={s.category} onChange={(e) => handleServiceChange(i, 'category', e.target.value)} className={inputStyles}>
                                                <option value="" disabled>Select a category</option>
                                                {SERVICE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Price (€)</label>
                                            <input type="number" placeholder="e.g., 55" value={s.price || ''} onChange={(e) => handleServiceChange(i, 'price', e.target.value)} className={inputStyles} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Duration (min)</label>
                                            <input type="number" placeholder="e.g., 60" value={s.duration || ''} onChange={(e) => handleServiceChange(i, 'duration', e.target.value)} className={inputStyles} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={handleAddService} className="w-full mt-2 text-sm font-semibold text-rose-500 hover:text-rose-700 p-3 border-2 border-dashed border-slate-300 hover:border-rose-400 rounded-lg transition-colors">
                                + Add Service
                            </button>
                        </>
                    ) : (
                         Object.keys(servicesByCategory).length > 0 ? (
                            <div className="space-y-4">
                            {Object.entries(servicesByCategory).map(([category, services]) => (
                                <div key={category}>
                                    <h4 className="font-semibold text-md text-slate-700 mb-2">{category}</h4>
                                    <div className="space-y-2">
                                        {services.map(s => (
                                            <div key={s.name} className="flex justify-between items-center p-3 bg-slate-100 rounded-lg">
                                                <div>
                                                    <span className="font-medium text-slate-800">{s.name}</span>
                                                    <span className="text-sm text-slate-500 ml-2">({s.duration} min)</span>
                                                </div>
                                                <span className="font-semibold text-rose-600">€{s.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            </div>
                        ) : <p className="italic text-slate-400 text-center py-4">No services listed yet.</p>
                    )}
                    </div>
                </Section>
                 <div className="grid grid-cols-1">
                    <Section title="Recent Reviews">
                        <div className="space-y-4">
                        {profile.reviews.slice(0, 3).map(r => (
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
            </div>
        )
    };


    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-50 to-slate-50 font-sans relative">
            <Header
                onSwitchRole={onSwitchRole}
                onLogout={onLogout}
                onToggleEditMode={isEditing ? handleCancelClick : handleEditClick}
                unreadCount={unreadNotifications.length}
                onToggleNotifications={handleToggleNotifications}
            />
             {showNotifications && (
                <NotificationsPanel 
                    notifications={notifications}
                    onSelect={handleNotificationClick}
                    onClose={() => setShowNotifications(false)}
                />
            )}
            <main className="flex-grow p-6">
                {!profile.isProfileComplete && !isEditing && <IncompleteProfileBanner onStart={onStartOnboarding} />}
                
                {/* TABS */}
                {!isEditing && (
                    <div className="mb-6 border-b border-slate-200">
                        <nav className="flex -mb-px space-x-6">
                            <button onClick={() => setActiveTab('dashboard')} className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'dashboard' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                                Dashboard
                            </button>
                            <button onClick={() => { setActiveTab('bookings'); setActiveBooking(null); }} className={`py-3 px-1 border-b-2 font-semibold text-sm relative ${activeTab === 'bookings' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                                Bookings
                                {pendingRequests.length > 0 && <span className="ml-2 absolute top-2 -right-4 inline-flex items-center justify-center h-5 w-5 rounded-full bg-rose-500 text-white text-xs">{pendingRequests.length}</span>}
                            </button>
                        </nav>
                    </div>
                )}
                {renderContent()}
            </main>
        </div>
    );
}

export default ProfessionalView;