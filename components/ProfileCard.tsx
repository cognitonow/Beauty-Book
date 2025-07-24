

import React, { useEffect } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { ProfessionalProfile } from '../types';

interface ProfileCardProps {
  profile: ProfessionalProfile;
  onView: () => void;
  dragX?: MotionValue<number>;
}

const NailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 2.5 2.5 2.5 5 2.5 7 2-1 5-2.5 5-2.5a8 8 0 01-1.843 11.314z" /></svg>;
const HairIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0 1.172 1.953 1.172 5.119 0 7.072z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01M4.879 4.879L6.343 6.343m12.728 12.728l-1.464-1.464M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;
const LashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const MakeupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4H7zm0 0a4 4 0 004-4V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a4 4 0 004 4zm0 0h.01" /></svg>;
const BraidIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const DefaultIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.879 4.879L6.343 6.343m12.728 12.728l-1.464-1.464M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>;

const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
        case 'Nail Artistry':
            return <NailIcon />;
        case 'Hair Colorist & Stylist':
            return <HairIcon />;
        case 'Lash & Brow Expert':
            return <LashIcon />;
        case 'Makeup Artist':
            return <MakeupIcon />;
        case 'Braid Specialist':
            return <BraidIcon />;
        default:
            return <DefaultIcon />;
    }
};

const DragIndicators: React.FC<{ dragX: MotionValue<number> }> = ({ dragX }) => {
    const nopeOpacity = useTransform(dragX, [-100, 0], [1, 0]);
    const likeOpacity = useTransform(dragX, [0, 100], [0, 1]);

    return (
        <>
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 z-10 text-green-500 font-extrabold text-4xl border-4 border-green-500 rounded-lg px-4 py-1 rotate-[-30deg] uppercase">LIKE</motion.div>
            <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 z-10 text-red-500 font-extrabold text-4xl border-4 border-red-500 rounded-lg px-4 py-1 rotate-[30deg] uppercase">NOPE</motion.div>
        </>
    );
};

declare global {
    interface Window {
        instgrm: any;
        tiktok: any;
    }
}

const getEmbedType = (url: string | undefined): 'tiktok' | 'instagram' | null => {
    if (!url) return null;
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com')) return 'instagram';
    return null;
}

const ProfileMedia: React.FC<{ profile: ProfessionalProfile }> = ({ profile }) => {
    const { profileEmbedUrl, profileImage, name } = profile;
    const embedType = getEmbedType(profileEmbedUrl);

    useEffect(() => {
        if (embedType === 'tiktok' && window.tiktok) {
            window.tiktok.embed.render();
        }
        if (embedType === 'instagram' && window.instgrm) {
            window.instgrm.Embeds.process();
        }
    }, [embedType, profileEmbedUrl]);

    if (embedType && profileEmbedUrl) {
        if (embedType === 'tiktok') {
            const videoIdMatch = profileEmbedUrl.match(/video\/(\d+)/);
            const videoId = videoIdMatch ? videoIdMatch[1] : `profile-${profile.id}`;
            return (
                <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
                    <blockquote
                        className="tiktok-embed"
                        cite={profileEmbedUrl}
                        data-video-id={videoId}
                        style={{
                            width: '100%',
                            height: '100%',
                            margin: 'auto',
                            transform: 'scale(1.1)', 
                        }}
                    >
                         <section></section>
                    </blockquote>
                </div>
            );
        }

        if (embedType === 'instagram') {
            return (
                <div className="w-full h-full bg-white flex items-center justify-center overflow-hidden">
                    <blockquote
                        className="instagram-media"
                        data-instgrm-permalink={profileEmbedUrl}
                        data-instgrm-version="14"
                        data-instgrm-captioned
                        style={{
                            width: 'calc(100% - 2px)',
                            border: 0,
                            margin: 0,
                            padding: 0,
                            boxShadow: 'none',
                            minWidth: 'auto',
                            background: 'white',
                        }}
                    ></blockquote>
                </div>
            );
        }
    }

    return (
        <img
            src={profileImage}
            alt={name}
            className="w-full h-full object-cover"
        />
    );
};


const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onView, dragX }) => {
  return (
    <div className="h-full w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col cursor-pointer active:scale-[0.99] transition-transform duration-200" onClick={onView}>
      <div className="relative h-3/5 w-full flex-shrink-0 bg-slate-200">
        {dragX && <DragIndicators dragX={dragX} />}
        
        <ProfileMedia profile={profile} />

        {profile.availability === 'Available Now' && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center space-x-1">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300"></span>
                </span>
                <span>Available Now</span>
            </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none">
          <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">{profile.name}</h2>
          <div className="flex items-center text-sm text-white/90 mt-1 drop-shadow-md">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
             </svg>
             <span>{profile.location}</span>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center space-x-2 text-rose-500 mb-2">
            {getSpecialtyIcon(profile.specialty)}
            <span className="font-bold text-sm uppercase tracking-wider">{profile.specialty}</span>
          </div>

          <p className="text-sm text-slate-600 flex-grow">
            {profile.bio.substring(0, 110)}…
          </p>
        </div>
    </div>
  );
};

export default ProfileCard;