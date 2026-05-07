'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, List, Trash2, Eye, CheckCircle, XCircle, BarChart3, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import BlogPreviewModal from './BlogPreviewModal'; 

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-indigo-600">{payload[0].value} Blogs</p>
      </div>
    );
  }
  return null;
};

interface Blog {
  id: string | number;
  title: string;
  author: string;
  is_published: boolean;
  image?: string;
  category?: string;
  date?: string;
}

const BlogManagementHub: React.FC = () => {
  const [view, setView] = useState<'table' | 'grid' | 'chart'>('table'); 
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [previewBlog, setPreviewBlog] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isBlogsLoading, setIsBlogsLoading] = useState<boolean>(true);
  const [isChartLoading, setIsChartLoading] = useState<boolean>(true);
  const [publishingId, setPublishingId] = useState<string | number | null>(null);
  const [previewLoadingId, setPreviewLoadingId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  useEffect(() => {
    fetchBlogs();
    fetchChartData();
  }, []);

  const fetchBlogs = async () => {
    setIsBlogsLoading(true);
    try {
      const res = await axios.get('/api/admin/all-blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBlogsLoading(false);
    }
  };

  const fetchChartData = async () => {
    setIsChartLoading(true);
    try {
      const res = await axios.get('/api/admin/blog-stats-chart');
      setChartData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChartLoading(false);
    }
  };

  const handlePreview = async (id: string | number) => {
    setPreviewLoadingId(id);
    try {
      const res = await axios.get(`/api/admin/blog-preview/${id}`);
      setPreviewBlog(res.data);
      setIsPreviewOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setPreviewLoadingId(null);
    }
  };

  const togglePublish = async (id: string | number, currentStatus: boolean) => {
    setPublishingId(id);
    try {
      await axios.put(`/api/admin/toggle-publish/${id}`, { status: !currentStatus });
      await fetchBlogs();
    } catch (err) {
      console.error(err);
    } finally {
      setPublishingId(null);
    }
  };

  const deleteBlog = async (id: string | number) => {
    const confirmed = window.confirm("Are you sure? This blog will be permanently deleted.");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await axios.delete(`/api/admin/delete-blog/${id}`);
      await fetchBlogs();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      {/* --- TOP HEADER WITH TOGGLE BUTTONS --- */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold dark:text-white">Content Inventory</h2>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setView('table')}
            className={`p-2 rounded-lg transition-all ${view === 'table' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}
            title="Table View"
          >
            <List size={20} />
          </button>
          <button 
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}
            title="Grid View"
          >
            <LayoutGrid size={20} />
          </button>
          <button 
            onClick={() => setView('chart')}
            className={`p-2 rounded-lg transition-all ${view === 'chart' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}
            title="Stats Chart"
          >
            <BarChart3 size={20} />
          </button>
        </div>
      </div>

      {/* --- CONDITIONAL RENDERING --- */}
      {view === 'chart' && (
        <div className="h-[350px] w-full bg-slate-50 dark:bg-slate-800/20 p-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
          {isChartLoading ? (
            <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium">
              <div className="inline-flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading chart...
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
              <XAxis 
                dataKey="name" 
                tickFormatter={(str) => {
                  try {
                    const date = new Date(str);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  } catch (e) {
                    return str;
                  }
                }}
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 2 }} />
              <Area 
                type="monotone" 
                dataKey="blogs" 
                stroke="#6366f1" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorCount)" 
                animationDuration={1500}
              />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {view === 'grid' && (
        isBlogsLoading ? (
          <div className="py-16 text-center text-slate-500 font-medium">
            <div className="inline-flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading blogs...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div key={blog.id} className="group bg-slate-50 dark:bg-slate-800/50 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-video">
                <img 
                  src={blog.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${blog.is_published ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white shadow-lg'}`}>
                    {blog.is_published ? 'Live' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2 block">{blog.category || 'General'}</span>
                <h3 className="text-lg font-bold dark:text-white line-clamp-2 mb-4 group-hover:text-indigo-600 transition-colors">{blog.title}</h3>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                      {(blog.author || "Unknown Author").charAt(0)}
                    </div>
                    <span className="text-sm text-slate-500 truncate max-w-[80px]">{blog.author || "Unknown Author"}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => togglePublish(blog.id, blog.is_published)}
                      disabled={publishingId === blog.id}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white dark:bg-slate-800 rounded-xl shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {publishingId === blog.id ? <Loader2 size={18} className="animate-spin" /> : blog.is_published ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button
                      onClick={() => handlePreview(blog.id)}
                      disabled={previewLoadingId === blog.id}
                      className="p-2 text-slate-400 hover:text-blue-500 transition-colors bg-white dark:bg-slate-800 rounded-xl shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {previewLoadingId === blog.id ? <Loader2 size={18} className="animate-spin" /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => deleteBlog(blog.id)}
                      disabled={deletingId === blog.id}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 rounded-xl shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {deletingId === blog.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )
      )}

      {view === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="text-xs text-slate-400 uppercase font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Article</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {isBlogsLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-500 font-medium">
                    <div className="inline-flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading blogs...
                    </div>
                  </td>
                </tr>
              ) : blogs.map(blog => (
                <tr key={blog.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-4 max-w-xs truncate font-semibold dark:text-white">{blog.title}</td>
                  <td className="px-4 py-4 text-slate-500 text-sm">{blog.author}</td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${blog.is_published ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {blog.is_published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right space-x-2">
                    <button
                      onClick={() => togglePublish(blog.id, blog.is_published)}
                      disabled={publishingId === blog.id}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {publishingId === blog.id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : blog.is_published ? (
                        <XCircle size={18} title="Unpublish" />
                      ) : (
                        <CheckCircle size={18} title="Publish" />
                      )}
                    </button>
                    <button
                      onClick={() => handlePreview(blog.id)}
                      disabled={previewLoadingId === blog.id}
                      className="p-2 text-slate-400 hover:text-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {previewLoadingId === blog.id ? <Loader2 size={18} className="animate-spin" /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => deleteBlog(blog.id)}
                      disabled={deletingId === blog.id}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {deletingId === blog.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* The Modal Component */}
      <BlogPreviewModal 
        blog={previewBlog} 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </div>
  );
};

export default BlogManagementHub;