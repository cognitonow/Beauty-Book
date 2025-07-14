
import React, { useState, useEffect } from 'react';
import { ProfessionalProfile, Service, Review } from '../types';

interface ProfileDetailViewProps {
  profile: ProfessionalProfile;
  onClose: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="py-6 border-b border-slate-200">
    <h3 className="text-xl font-bold text-slate-800 mb-4 px-6">{title}</h3>
    {children}
  </section>
);

const ServiceItem: React.FC<{ service: Service }> = ({ service }) => (
  <div className="flex justify-between items-center py-3 px-6 hover:bg-slate-50">
    <div>
      <p className="font-semibold">{service.name}</p>
      <p className="text-sm text-slate-500">{service.duration} min</p>
    </div>
    <p className="font-semibold text-rose-500">${service.price}</p>
  </div>
);

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => (
  <div className="px-6">
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

const ProfileDetailView: React.FC<ProfileDetailViewProps> = ({ profile, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to finish
  };

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
              <p className="text-slate-600 px-6 text-sm">{profile.bio}</p>
            </Section>
            
            <Section title="Services">
              {profile.services.map(service => <ServiceItem key={service.name} service={service} />)}
            </Section>

            <Section title="Portfolio">
              <div className="px-6 grid grid-cols-3 gap-1">
                {profile.socialFeed.map(post => (
                  <div key={post.id} className="aspect-square bg-slate-200">
                    <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Reviews">
                <div className="space-y-4">
                  {profile.reviews.map(review => <ReviewItem key={review.author} review={review} />)}
                </div>
            </Section>
          </div>
          
          {/* Footer/Action */}
          <div className="p-6 border-t border-slate-200 mt-auto flex-shrink-0">
            <button className="w-full py-3 bg-rose-500 text-white font-bold rounded-xl shadow-lg hover:bg-rose-600 transition-colors">
              Request Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailView;
