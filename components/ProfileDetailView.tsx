import React, { useState, useEffect } from 'react';
import { ProfessionalProfile, Service, Review } from '../types';
import TikTokFeed from './TikTokFeed';
import InstagramGrid from './InstagramGrid';

interface ProfileDetailViewProps {
  profile: ProfessionalProfile;
  onClose: () => void;
  isPreview?: boolean;
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


const Section: React.FC<{ title: string; children: React.ReactNode, noPadding?: boolean }> = ({ title, children, noPadding = false }) => (
  <section className="py-6 border-b border-slate-200">
    <h3 className="text-xl font-bold text-slate-800 mb-4 px-6">{title}</h3>
    <div className={noPadding ? '' : 'px-6'}>
        {children}
    </div>
  </section>
);

const ServiceItem: React.FC<{ service: Service }> = ({ service }) => (
  <div className="flex justify-between items-center py-3 hover:bg-slate-50 -mx-6 px-6">
    <div>
      <p className="font-semibold">{service.name}</p>
      <p className="text-sm text-slate-500">{service.duration} min</p>
    </div>
    <p className="font-semibold text-rose-500">€{service.price}</p>
  </div>
);

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => (
  <div>
    <div className="flex items-center mb-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-slate-300'}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="ml-2 font-bold text-sm">{review.author}</p>
    </div>
    <p className="text-slate-600 text-sm">"{review.comment}"</p>
  </div>
);

type PortfolioTab = 'tiktok' | 'instagram';

const ProfileDetailView: React.FC<ProfileDetailViewProps> = ({ profile, onClose, isPreview = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<PortfolioTab>('tiktok');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to finish
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
    <div className="fixed inset-0 z-30" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isVisible ? 'bg-opacity-50' : 'bg-opacity-0'}`}
        onClick={handleClose}
      ></div>

      {/* Modal Panel */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex">
        <div className={`flex flex-col w-full max-h-[90vh] bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
            <div className="w-8"></div> {/* Spacer */}
            <h2 id="modal-title" className="text-lg font-bold text-center">{profile.name}</h2>
            <button onClick={handleClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto">
            <Section title="About">
              <p className="text-slate-600 text-sm">{profile.bio}</p>
            </Section>

            {profile.travelPolicy && profile.travelPolicy.locations.length > 0 && (
                <Section title="Travel Policy">
                    <p className="text-slate-600 text-sm mb-3">This professional is willing to travel to the following areas:</p>
                    <div className="flex flex-wrap gap-2">
                        {profile.travelPolicy.locations.map(loc => (
                            <span key={loc} className="bg-rose-100 text-rose-700 text-xs font-medium px-2.5 py-1 rounded-full">{loc}</span>
                        ))}
                    </div>
                </Section>
            )}
            
            <Section title="Services">
              {Object.entries(servicesByCategory).map(([category, services]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <h4 className="font-bold text-md text-slate-700 mb-1">{category}</h4>
                  <div className="border-t border-slate-200">
                    {services.map(service => <ServiceItem key={service.name} service={service} />)}
                  </div>
                </div>
              ))}
            </Section>

            {(hasTiktokFeed || hasInstagramEmbeds) && (
              <Section title="Portfolio" noPadding>
                <div className="px-6 mb-4">
                  <div className="flex w-full bg-slate-100 rounded-lg p-1">
                      {hasTiktokFeed && (
                          <button 
                              onClick={() => setActiveTab('tiktok')}
                              className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'tiktok' ? 'bg-white text-rose-500 shadow' : 'text-slate-600'}`}
                          >
                              TikTok Feed
                          </button>
                      )}
                       {hasInstagramEmbeds && (
                          <button 
                              onClick={() => setActiveTab('instagram')}
                              className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'instagram' ? 'bg-white text-rose-500 shadow' : 'text-slate-600'}`}
                          >
                              Instagram Feed
                          </button>
                       )}
                  </div>
                </div>
                
                 <div className="px-4 md:px-6">
                  {activeTab === 'tiktok' && <TikTokFeed urls={profile.tiktokUrls || []} />}
                  {activeTab === 'instagram' && <InstagramFeed urls={profile.instagramEmbedUrls || []} />}
                </div>
              </Section>
            )}

            <Section title="Reviews">
                <div className="space-y-4">
                  {profile.reviews.map(review => <ReviewItem key={review.author} review={review} />)}
                </div>
            </Section>
          </div>
          
          {/* Footer/Action */}
          {!isPreview && (
            <div className="p-6 border-t border-slate-200 mt-auto flex-shrink-0">
                <button className="w-full py-3 bg-rose-500 text-white font-bold rounded-xl shadow-lg hover:bg-rose-600 transition-colors">
                Request Booking
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailView;