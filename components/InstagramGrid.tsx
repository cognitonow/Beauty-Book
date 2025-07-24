import React, { useState } from 'react';
import { SocialPost } from '../types';
import AddPostModal from './AddPostModal';

interface InstagramGridProps {
    posts: SocialPost[];
    isEditable?: boolean;
    onUpdatePosts?: (posts: SocialPost[]) => void;
}

const InstagramGrid: React.FC<InstagramGridProps> = ({ posts, isEditable = false, onUpdatePosts }) => {
    const [isAddingPost, setIsAddingPost] = useState(false);

    const handleRemove = (postId: number) => {
        if (!onUpdatePosts) return;
        onUpdatePosts(posts.filter(p => p.id !== postId));
    };

    const handleAdd = (post: SocialPost) => {
        if (!onUpdatePosts) return;
        onUpdatePosts([...posts, post]);
        setIsAddingPost(false);
    };

    return (
        <div className="relative">
            {isEditable && (
                <div className="mb-4">
                    <button onClick={() => setIsAddingPost(true)} className="w-full bg-rose-500 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-rose-600 transition-colors">
                        + Add Post to Instagram Grid
                    </button>
                </div>
            )}
            {isAddingPost && onUpdatePosts && (
                 <div className="fixed inset-0 z-50">
                    <AddPostModal onAdd={handleAdd} onClose={() => setIsAddingPost(false)} existingPostIds={posts.map(p => p.id)} />
                 </div>
            )}
            {posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                    {posts.map(post => (
                        <div key={post.id} className="aspect-square bg-slate-200 relative group">
                            <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
                            {isEditable && (
                                <button
                                    onClick={() => handleRemove(post.id)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Remove post"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-slate-500 bg-slate-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-bold">Grid is Empty</h3>
                    {isEditable && <p className="text-sm text-slate-400 mt-1">Add posts to build your grid.</p>}
                </div>
            )}
        </div>
    );
};

export default InstagramGrid;
