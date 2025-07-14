import React from 'react';
import { SocialPost } from '../types';
import { EXTRA_SOCIAL_POSTS } from '../constants';

interface AddPostModalProps {
    onAdd: (post: SocialPost) => void;
    onClose: () => void;
    existingPostIds: number[];
}

const AddPostModal: React.FC<AddPostModalProps> = ({ onAdd, onClose, existingPostIds }) => {
    const availablePosts = EXTRA_SOCIAL_POSTS.filter(p => !existingPostIds.includes(p.id));

    return (
         <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-4 w-full max-w-md max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                    <h3 className="font-bold text-slate-800">Add to Your Portfolio</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {availablePosts.length > 0 ? (
                    <div className="overflow-y-auto space-y-2 flex-grow">
                        {availablePosts.map(post => (
                            <button key={post.id} onClick={() => onAdd(post)} className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 text-left">
                               <img src={post.imageUrl} alt={post.caption} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                               <p className="text-sm text-slate-700 flex-grow min-w-0">{post.caption}</p>
                            </button>
                        ))}
                    </div>
                ) : (
                     <p className="text-slate-500 text-center py-8">No more sample posts to add!</p>
                )}
            </div>
        </div>
    );
};

export default AddPostModal;