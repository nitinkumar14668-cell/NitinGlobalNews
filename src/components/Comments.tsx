import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAppContext } from '../contexts/AppContext';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { Loader2, Send } from 'lucide-react';

interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userImage: string;
  text: string;
  createdAt: Timestamp | null;
}

export function Comments({ articleId }: { articleId: string }) {
  const { user, login } = useAppContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef, 
      where('articleId', '==', articleId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(fetchedComments);
      setLoading(false);
    }, (error) => {
      setLoading(false);
      handleFirestoreError(error, OperationType.LIST, 'comments');
    });

    return () => unsubscribe();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        articleId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userImage: user.photoURL || '',
        text: newComment.trim(),
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'comments');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t border-slate-100 pt-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Comments ({comments.length})</h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
          <img 
            src={user.photoURL || ''} 
            alt={user.displayName || ''} 
            className="w-10 h-10 rounded-full border border-slate-200"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[80px] resize-y"
              disabled={submitting}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Post Comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-lg bg-slate-50 p-6 text-center border border-slate-200">
          <p className="text-slate-600 mb-4 font-medium">Join the conversation</p>
          <button
            onClick={login}
            className="rounded bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Sign in to comment
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              {comment.userImage ? (
                <img 
                  src={comment.userImage} 
                  alt={comment.userName} 
                  className="w-10 h-10 rounded-full border border-slate-200 flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-800 text-sm">{comment.userName}</span>
                  <span className="text-xs text-slate-500">
                    {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </span>
                </div>
                <p className="text-slate-700 text-sm whitespace-pre-wrap">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
           <p className="text-slate-500 text-sm italic text-center py-4">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
}
