'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ThumbsDown, Bookmark, Share2, Clock, Calendar, User as UserIcon } from 'lucide-react';
import BlockRenderer from '../../../components/blog/BlockRenderer';

interface Blog {
  _id?: string;
  id?: string | number;
  author_name: string;
  cover_image: string;
  title: string;
  category?: string;
  created_at?: string;
  description?: string;
  likes_count?: number;
  dislikes_count?: number;
  saves_count?: number;
  content: any;
}

interface BlogPreviewModalProps {
  blog: Blog | null;
  isOpen: boolean;
  onClose: () => void;
}

const BlogPreviewModal: React.FC<BlogPreviewModalProps> = ({ blog, isOpen, onClose }) => {
  if (!blog) return null;

  // Normalize data for preview
  const title = blog.title || "Untitled Article";
  const authorName = blog.author_name || "Unknown Author";
  const category = blog.category || "General";
  const image = blog.cover_image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800';
  const date = blog.created_at 
    ? new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  const likes = blog.likes_count || 0;
  const dislikes = blog.dislikes_count || 0;
  const saves = blog.saves_count || 0;

  const calculateReadingTime = (content: any) => {
    let text = "";
    if (typeof content === 'string') {
      text = content;
    } else if (content?.blocks) {
      text = content.blocks.map((b: any) => b.data?.text || "").join(" ");
    }
    
    if (!text) return "1 min read";
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    return `${time} min read`;
  };

  const readingTime = calculateReadingTime(blog.content);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl max-h-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header / Top Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-3 px-2">
                <div className="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">Admin View</div>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{title}</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group">
                <X size={20} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white" />
              </button>
            </div>

            {/* Scrollable Blog Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Hero Image */}
              <div className="relative h-[300px] md:h-[450px] w-full">
                <img src={image} className="w-full h-full object-cover" alt="Cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-10 left-0 right-0 px-8 lg:px-16">
                   <span className="inline-block bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                    {category}
                  </span>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
                    {title}
                  </h1>
                </div>
              </div>

              {/* Body Content */}
              <div className="max-w-4xl mx-auto px-8 lg:px-16 py-12">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-slate-400 mb-12 pb-8 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Written By</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{authorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Published On</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reading Time</p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{readingTime}</p>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
                  {blog.content ? (
                    (() => {
                      try {
                        const contentObj = typeof blog.content === 'string' ? JSON.parse(blog.content) : blog.content;
                        if (contentObj && contentObj.blocks) {
                          return <BlockRenderer blocks={contentObj.blocks} />;
                        }
                      } catch (e) {
                        // Fallback
                      }
                      return <div dangerouslySetInnerHTML={{ __html: blog.content }} />;
                    })()
                  ) : (
                    <p>{blog.description}</p>
                  )}
                </div>

                {/* Bottom Action Bar (Preview Only) */}
                <div className="mt-16 flex items-center justify-center gap-8 py-6 px-10 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-800 w-fit mx-auto">
                   <div className="flex items-center gap-2">
                    <Heart size={20} className="text-red-500" fill="currentColor" />
                    <span className="font-black text-slate-900 dark:text-white">{likes}</span>
                  </div>
                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                  <div className="flex items-center gap-2">
                    <ThumbsDown size={20} className="text-slate-400" />
                    <span className="font-black text-slate-900 dark:text-white">{dislikes}</span>
                  </div>
                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                  <div className="flex items-center gap-2">
                    <Bookmark size={20} className="text-indigo-600" fill="currentColor" />
                    <span className="font-black text-slate-900 dark:text-white">{saves}</span>
                  </div>
                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                  <button className="text-slate-400 hover:text-green-500 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BlogPreviewModal;