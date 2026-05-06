'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import BlogCard from './BlogCard';

// Define the Blog interface to match your data structure
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

interface BlogGridProps {
  blogs: Blog[];
  searchQuery?: string;
}

const BlogGrid: React.FC<BlogGridProps> = ({ blogs, searchQuery = "" }) => {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 } // Cards pop in one after another
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      whileInView="show" 
      viewport={{ once: true }} 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {blogs.map((blog) => (
        <motion.div variants={item} key={blog.id}>
          <BlogCard blog={blog} searchQuery={searchQuery} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BlogGrid;