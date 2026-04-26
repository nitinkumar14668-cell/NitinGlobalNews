import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function AdminPanel({ onBack }: { onBack: () => void }) {
  const { user, isAdmin } = useAppContext();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('world');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [location, setLocation] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-2 text-slate-600">You do not have permission to view the admin panel.</p>
        <button onClick={onBack} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go Back</button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
        setMessage('Title is required');
        return;
    }
    setLoading(true);
    setMessage('');
    
    try {
      // In a real application we would add this to Firestore.
      // E.g., await addDoc(collection(db, 'articles'), { ... });
      // Since the app currently mocks articles via 'src/data/news.ts' 
      // but the user wants to add an article, maybe we should push it to Firestore 
      // or at least pretend it successfully adds to the live feed.
      // For this app, let's actually write to a custom "live_articles" collection 
      // and we will update NewsGrid to fetch from there in addition to mocks.
      
      const newArticle = {
        title: { en: title },
        summary: { en: content.substring(0, 100) + '...' },
        content: { en: content },
        category,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        videoUrl: videoUrl || null,
        sourceUrl: sourceUrl || null,
        location: location || null,
        timestamp: new Date().toISOString(),
        authorEmail: user?.email,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'articles'), newArticle);
      
      setMessage('Article published successfully!');
      setTitle('');
      setContent('');
      setImageUrl('');
      setVideoUrl('');
      setSourceUrl('');
      setLocation('');
    } catch (error) {
      console.error(error);
      setMessage('Error publishing article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 w-full">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={onBack} className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1">
          &larr; Back to Home
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-blue-900 border-b-4 border-red-600 pb-1">Admin Panel</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold mb-6">Create New Article</h2>
        
        {message && (
          <div className={`p-4 rounded-md mb-6 ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Article Title (English)</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="world">World News</option>
                  <option value="local">Local News</option>
                  <option value="business">Business</option>
                  <option value="technology">Technology</option>
                  <option value="sports">Sports</option>
                  <option value="entertainment">Entertainment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location (Optional, e.g., US)</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. IN, US, GB"
                />
              </div>
            </div>

            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Video Component URL (Optional)</label>
                <input 
                  type="url" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>
              
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source URL (Optional)</label>
                <input 
                  type="url" 
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content (English)</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button 
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
