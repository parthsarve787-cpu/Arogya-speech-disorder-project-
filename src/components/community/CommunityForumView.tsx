import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Plus, 
  Sparkles, 
  Pin, 
  Send 
} from 'lucide-react';
import { fetchCommunityPosts, createCommunityPost, likeCommunityPost } from '../../services/api';
import { CommunityPost } from '../../../server/db';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const CommunityForumView: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPosting, setIsPosting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('tips');

  useEffect(() => {
    fetchCommunityPosts().then(setPosts).catch(() => {});
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const res = await createCommunityPost({
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      title: newTitle,
      content: newContent,
      category: newCategory,
    });

    if (res.success && res.post) {
      setPosts((prev) => [res.post, ...prev]);
      // Persist to Cloud Firestore
      setDoc(doc(db, 'communityPosts', res.post.id), res.post).catch(() => {});
      setNewTitle('');
      setNewContent('');
      setIsPosting(false);
    }
  };

  const handleLike = async (id: string) => {
    await likeCommunityPost(id);
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likesCount: p.likesCount + 1 } : p))
    );
  };

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fadeIn">
      
      {/* Header in English */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 mb-1">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Parent & SLP Peer Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Community Hub & Clinical Q&A
          </h1>
        </div>

        <button
          onClick={() => setIsPosting(!isPosting)}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center space-x-1.5 transition-all shadow-sm hover:scale-102 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Share Story or Question</span>
        </button>
      </div>

      {/* Category Pills in English */}
      <div className="flex space-x-2 overflow-x-auto text-xs pb-1">
        {[
          { id: 'all', label: 'All Discussions' },
          { id: 'tips', label: '💡 Home Practice Tips' },
          { id: 'success_story', label: '🎉 Success Stories' },
          { id: 'games', label: '🎲 Articulation Games' },
          { id: 'slp_qa', label: '🩺 Therapist Q&A' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all ${
              selectedCategory === c.id
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Create Post Form */}
      {isPosting && (
        <form onSubmit={handleCreatePost} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-lg">
          <h3 className="text-sm font-black text-slate-900">Write a Community Post</h3>
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Post title (e.g. Fun games for practicing /k/ at home)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <textarea
            required
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Share your experience, encouragement, or question in detail..."
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <div className="flex items-center justify-between pt-1">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2"
            >
              <option value="tips">Home Practice Tips</option>
              <option value="success_story">Success Story</option>
              <option value="games">Articulation Games</option>
              <option value="slp_qa">Therapist Q&A</option>
            </select>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsPosting(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Post</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{post.authorAvatar}</span>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-slate-900">{post.authorName}</span>
                    {post.authorRole === 'therapist' && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                        Verified RCI-SLP
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {post.isPinned && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center space-x-1">
                  <Pin className="w-3 h-3" />
                  <span>Pinned</span>
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900">{post.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{post.content}</p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span className="capitalize text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
                #{post.category.replace('_', ' ')}
              </span>

              <div className="flex items-center space-x-4 font-semibold">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-1.5 hover:text-rose-600 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-rose-500/20 text-rose-500" />
                  <span>{post.likesCount}</span>
                </button>
                <div className="flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>{post.commentsCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
