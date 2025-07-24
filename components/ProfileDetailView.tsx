import React, { useState, useEffect } from 'react';
import { ProfessionalProfile, Service, Review } from '../types';
import TikTokFeed from './TikTokFeed';
import { BookingModal } from './BookingModal';

interface ProfileDetailViewProps {
  profile: ProfessionalProfile;
  onClose: () => void;
  isPreview?: boolean;
  onBook?: (professional: ProfessionalProfile, service: Service, message: string, requestedDateTime?: string) => void;
}

// Instagram's script adds a global 'instgrm' object.
declare global {
    interface Window {
        instgrm: any;
    }
}

const InstagramFeed: React.FC<{ urls: string[] }> = ({ urls = [] }) => {
    useEffect(() => {
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    }, [urls]);

    if (!urls || urls.length === 0) {
        return (
            <div className="h-[200px] w-full flex flex-col items-center justify-center text-center text-slate-500 bg-slate-100 rounded-lg p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <h3 className="font-bold">Portfolio is Empty</h3>
                <p className="text-sm text-slate-400 mt-1">This professional hasn't added any posts yet.</p>
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

const DetailCard: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 ${className}`}>
    <h3 className="text-xl font-bold text-slate-900 mb-5">{title}</h3>
    {children}
  </div>
);


const ServiceItem: React.FC<{ service: Service }> = ({ service }) => (
  <div className="flex justify-between items-center py-4">
    <div>
      <p className="font-medium text-slate-800">{service.name}</p>
      {service.duration && <p className="text-sm text-slate-500">{service.duration} min</p>}
    </div>
    <p className="font-semibold text-rose-500 text-base">€{service.price}</p>
  </div>
);

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => (
  <div className="py-4">
    <div className="flex items-center mb-2">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-slate-300'}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="ml-3 font-semibold text-sm text-slate-800">{review.author}</p>
    </div>
    <p className="text-slate-600 text-sm leading-relaxed">"{review.comment}"</p>
  </div>
);

type PortfolioTab = 'tiktok' | 'instagram';

const ProfileDetailView: React.FC<ProfileDetailViewProps> = ({ profile, onClose, isPreview = false, onBook }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<PortfolioTab>('tiktok');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to finish
  };
  
  const handleBookingRequest = (service: Service, message: string, requestedDateTime?: string) => {
    if (onBook) {
        onBook(profile, service, message, requestedDateTime);
    }
    setIsBooking(false);
    handleClose();
  };

  const hasInstagramEmbeds = profile.instagramEmbedUrls && profile.instagramEmbedUrls.length > 0;
  const hasTiktokFeed = profile.tiktokUrls && profile.tiktokUrls.length > 0;
  
  useEffect(() => {
    if (hasTiktokFeed) {
        setActiveTab('tiktok');
    } else if (hasInstagramEmbeds) {
        setActiveTab('instagram');
    }
  }, [profile.id, hasTiktokFeed, hasInstagramEmbeds]);
  
  const servicesByCategory = profile.services.reduce((acc, service) => {
    const category = service.category || 'Other';
    if (!acc[category]) {
        acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <>
    <div className="fixed inset-0 z-30 font-sans" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isVisible ? 'bg-opacity-60' : 'bg-opacity-0'}`}
        onClick={handleClose}
      ></div>

      {/* Modal Centering Container */}
      <div className="fixed inset-0 z-40 flex items-center justify-center p-0 sm:p-4">
        {/* Modal Panel */}
        <div className={`flex flex-col w-full h-full sm:max-w-6xl sm:max-h-[95vh] bg-slate-50 sm:rounded-2xl shadow-xl transform transition-all duration-300 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Sticky Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0 bg-white/80 backdrop-blur-sm sm:rounded-t-2xl">
            <div className="w-8"></div> {/* Spacer */}
            <h2 id="modal-title" className="text-lg font-bold text-center truncate text-slate-800">{profile.name} - {profile.specialty}</h2>
            <button onClick={handleClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Scrollable Content */}
          <div className="overflow-y-auto">
            {/* Profile Header */}
            <header className="p-6 md:p-8 bg-white border-b border-slate-200">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img src={profile.profileImage} alt={profile.name} className="w-28 h-28 rounded-full object-cover flex-shrink-0 shadow-lg" />
                    <div className="flex-grow w-full text-center sm:text-left">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">{profile.name}</h2>
                        <p className="text-xl font-semibold text-rose-500 mt-1">{profile.specialty}</p>
                        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-slate-600">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">{profile.location}</span>
                            </div>
                            <div className={`flex items-center gap-2 font-medium ${profile.availability === 'Available Now' ? 'text-green-600' : 'text-slate-500'}`}>
                                <span className="relative flex h-3 w-3">
                                    {profile.availability === 'Available Now' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                                    <span className={`relative inline-flex rounded-full h-3 w-3 ${profile.availability === 'Available Now' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                </span>
                                <span className="text-sm">{profile.availability}</span>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="mt-6 pt-6 border-t border-slate-200/80">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">About {profile.name.split(' ')[0]}</h3>
                    <p className="text-slate-600 whitespace-pre-line leading-relaxed">{profile.bio}</p>
                </div>
            </header>

            {/* Main Grid */}
            <main className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-8">
                    {(hasTiktokFeed || hasInstagramEmbeds) && (
                        <DetailCard title="Portfolio">
                            <div className="flex w-full max-w-sm bg-slate-100 rounded-lg p-1 mb-4">
                                {hasTiktokFeed && (
                                    <button onClick={() => setActiveTab('tiktok')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'tiktok' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}>TikTok</button>
                                )}
                                {hasInstagramEmbeds && (
                                    <button onClick={() => setActiveTab('instagram')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'instagram' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}>Instagram</button>
                                )}
                            </div>
                            {activeTab === 'tiktok' && <TikTokFeed urls={profile.tiktokUrls || []} />}
                            {activeTab === 'instagram' && <InstagramFeed urls={profile.instagramEmbedUrls || []} />}
                        </DetailCard>
                    )}
                    
                    <DetailCard title="Reviews">
                        <div className="divide-y divide-slate-100">
                            {profile.reviews.length > 0 ? profile.reviews.map(review => <ReviewItem key={review.author} review={review} />) : <p className="text-slate-500 text-sm text-center py-4">No reviews yet.</p>}
                        </div>
                    </DetailCard>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-1 space-y-8">
                    <DetailCard title="Services & Pricing">
                        <div className="space-y-4">
                            {Object.entries(servicesByCategory).map(([category, services]) => (
                                <div key={category}>
                                    <h4 className="font-semibold text-md text-slate-700 mb-1">{category}</h4>
                                    <div className="divide-y divide-slate-100">
                                        {services.map(service => <ServiceItem key={service.name} service={service} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DetailCard>

                    {profile.travelPolicy && profile.travelPolicy.locations.length > 0 && (
                        <DetailCard title="Travel Policy">
                            <p className="text-slate-600 text-sm mb-3">This professional travels to the following areas:</p>
                            <div className="flex flex-wrap gap-2">
                                {profile.travelPolicy.locations.map(loc => (
                                    <span key={loc} className="bg-rose-100 text-rose-700 text-xs font-medium px-2.5 py-1 rounded-full">{loc}</span>
                                ))}
                            </div>
                        </DetailCard>
                    )}
                </div>
            </main>
          </div>
          
          {/* Footer/Action */}
          {!isPreview && (
            <div className="p-4 md:p-6 border-t border-slate-200 mt-auto flex-shrink-0 bg-white/95 backdrop-blur-sm sm:rounded-b-2xl">
                <button 
                    onClick={() => setIsBooking(true)}
                    disabled={profile.availability !== 'Available Now'}
                    className="w-full py-4 bg-rose-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-rose-300 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed">
                {profile.availability === 'Available Now' ? 'Request Booking' : 'Unavailable'}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
    {isBooking && <BookingModal profile={profile} onBook={handleBookingRequest} onClose={() => setIsBooking(false)} />}
    </>
  );
};

export default ProfileDetailView;