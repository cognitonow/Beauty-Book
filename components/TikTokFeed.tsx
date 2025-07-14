import React, { useEffect } from 'react';

interface TikTokFeedProps {
    urls: string[];
}

// TikTok's script adds a global 'tiktok' object.
declare global {
    interface Window {
        tiktok: any;
    }
}

const TikTokFeed: React.FC<TikTokFeedProps> = ({ urls = [] }) => {
    useEffect(() => {
        // This function discovers and renders all TikTok embeds on the page.
        if (window.tiktok) {
            window.tiktok.embed.render();
        }
    }, [urls]);
    
    return (
        <div className="w-full">
            <div className="flex space-x-4 overflow-x-auto p-4 bg-slate-900 rounded-2xl scrollbar-hide">
                {urls && urls.length > 0 ? urls.map((url, index) => {
                    const videoIdMatch = url.match(/video\/(\d+)/);
                    const videoId = videoIdMatch ? videoIdMatch[1] : `${url}-${index}`;

                    return (
                        <div key={videoId} className="flex-shrink-0 w-full max-w-[325px] h-[580px] bg-black rounded-xl">
                            <blockquote
                                className="tiktok-embed"
                                cite={url}
                                data-video-id={videoId}
                                style={{ maxWidth: '100%', minWidth: '325px', height: '100%', margin: '0 auto' }}
                            >
                                <section>
                                    <a target="_blank" rel="noopener noreferrer" href={url}>
                                        Loading TikTok...
                                    </a>
                                </section>
                            </blockquote>
                        </div>
                    );
                }) : (
                     <div className="h-[200px] w-full flex flex-col items-center justify-center text-center text-white p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        <h3 className="font-bold">Portfolio is Empty</h3>
                        <p className="text-sm text-slate-300 mt-1">This professional hasn't added any videos yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TikTokFeed;