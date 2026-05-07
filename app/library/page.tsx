'use client';

import { motion } from 'framer-motion';
import { useBlogs } from '../../context/BlogContext';
import BlogGrid from '../../components/blog/BlogGrid';
import { parseEditorJSContent } from '../../lib/content-parser';

interface Blog {
  id: string | number;
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
  content?: string;
  likes: number;
  dislikes: number;
  saves: number;
}

const Library = () => {
  const { blogs, likedIds, savedIds } = useBlogs() as {
    blogs: any[];
    likedIds: (string | number)[];
    savedIds: (string | number)[];
  };

  // Filter our "Database" for blogs the user interacted with and map to BlogGrid structure
  const savedBlogs = blogs
    .filter((b) => savedIds.includes(b._id || b.id))
    .map((blog) => ({
      id: blog._id || blog.id,
      title: blog.title,
      description: blog.description || parseEditorJSContent(blog.content),
      category: blog.category || 'General',
      date: new Date(blog.created_at).toLocaleDateString(),
      image: blog.cover_image || '/placeholder-image.jpg',
      content: blog.content,
      likes: blog.likes_count || 0,
      dislikes: blog.dislikes_count || 0,
      saves: blog.saves_count || 0,
    }));

  const likedBlogs = blogs
    .filter((b) => likedIds.includes(b._id || b.id))
    .map((blog) => ({
      id: blog._id || blog.id,
      title: blog.title,
      description: blog.description || parseEditorJSContent(blog.content),
      category: blog.category || 'General',
      date: new Date(blog.created_at).toLocaleDateString(),
      image: blog.cover_image || '/placeholder-image.jpg',
      content: blog.content,
      likes: blog.likes_count || 0,
      dislikes: blog.dislikes_count || 0,
      saves: blog.saves_count || 0,
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-16 text-slate-800 dark:text-slate-100"
    >
      <header>
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white">
          My Library
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Your curated collection of insights.
        </p>
      </header>

      {/* Saved Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Reading List
          </h2>
          <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-bold">
            {savedBlogs.length}
          </span>
        </div>

        {savedBlogs.length > 0 ? (
          <BlogGrid blogs={savedBlogs} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
            <p className="text-slate-400 dark:text-slate-500">
              No articles saved yet. Start exploring!
            </p>
          </div>
        )}
      </section>

      {/* Liked Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Liked Articles
          </h2>
          <span className="bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm font-bold">
            {likedBlogs.length}
          </span>
        </div>

        {likedBlogs.length > 0 ? (
          <BlogGrid blogs={likedBlogs} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
            <p className="text-slate-400 dark:text-slate-500">
              You haven't liked any articles yet.
            </p>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default Library;