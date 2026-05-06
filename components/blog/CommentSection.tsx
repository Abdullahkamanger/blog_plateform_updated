'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';

interface Comment {
  id: string | number;
  user: string;
  text: string;
  date: string;
}

interface CommentSectionProps {
  // You can pass a blogId or initial comments array if fetching from the server
  blogId?: string | number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, user: "Sarah J.", text: "This breakdown of the React Compiler is exactly what I needed. The visuals are top-notch!", date: "2 hours ago" },
    { id: 2, user: "Marcus Dev", text: "Great read! Do you think this will replace manual memoization entirely?", date: "5 hours ago" }
  ]);
  const [newComment, setNewComment] = useState("");

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now(),
      user: "You",
      text: newComment,
      date: "Just now"
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-8 text-slate-900 dark:text-white">
        <MessageCircle size={24} />
        <h3 className="text-2xl font-bold">Discussion ({comments.length})</h3>
      </div>

      {/* Input Field */}
      <form onSubmit={handlePost} className="mb-10 relative">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add to the discussion..."
          className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white resize-none h-32"
        />
        <button type="submit" className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-all active:scale-90">
          <Send size={20} />
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {comments.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-slate-700 shrink-0 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                {typeof c.user === 'string' ? c.user[0] : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">{c.user}</span>
                  <span className="text-xs text-slate-400">{c.date}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{c.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommentSection;