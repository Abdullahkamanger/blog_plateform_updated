'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  Send, 
  Edit3, 
  Archive, 
  Trash2,
  Plus,
  Eye,
  Filter
} from 'lucide-react';
import axios from 'axios';
import { useBlogs } from '../../context/BlogContext';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content?: string;
  cover_image?: string;
  category?: string;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED';
  parent_blog_id?: string;
  is_archived: boolean;
  created_at: string;
  last_saved_at: string;
  likes_count: number;
  dislikes_count: number;
  saves_count: number;
}

const AuthorDashboard = () => {
  const { token, user } = useBlogs() as any;
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'drafts' | 'pending' | 'published'>('drafts');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blogs/author');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'drafts') return post.status === 'DRAFT';
    if (activeTab === 'pending') return post.status === 'PENDING';
    if (activeTab === 'published') return post.status === 'PUBLISHED';
    return false;
  });

  const handlePublish = async (blogId: string) => {
    try {
      setActionLoading(blogId);
      await axios.post('/api/blogs/publish', { blogId });
      await fetchPosts();
      alert('Post submitted for approval!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to submit post');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = async (blogId: string) => {
    if (posts.find(p => p._id === blogId)?.status === 'PUBLISHED') {
      try {
        setActionLoading(blogId);
        const response = await axios.post(`/api/blogs/${blogId}/edit`);
        window.location.href = `/create?draftId=${response.data.draftId}`;
      } catch (error: any) {
        alert(error.response?.data?.error || 'Failed to create draft');
      } finally {
        setActionLoading(null);
      }
    } else {
      window.location.href = `/create?draftId=${blogId}`;
    }
  };

  const handleArchive = async (blogId: string) => {
    if (confirm('Are you sure you want to archive this post?')) {
      try {
        setActionLoading(blogId);
        await axios.post(`/api/blogs/${blogId}/archive`);
        await fetchPosts();
        alert('Post archived successfully!');
      } catch (error: any) {
        alert(error.response?.data?.error || 'Failed to archive post');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleRestore = async (blogId: string) => {
    try {
      setActionLoading(blogId);
      await axios.post(`/api/blogs/${blogId}/restore`);
      await fetchPosts();
      alert('Post restored successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to restore post');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'PUBLISHED': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT': return <FileText size={14} />;
      case 'PENDING': return <Clock size={14} />;
      case 'PUBLISHED': return <Eye size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const tabs = [
    { id: 'drafts', label: 'Drafts', count: posts.filter(p => p.status === 'DRAFT').length },
    { id: 'pending', label: 'Pending Approval', count: posts.filter(p => p.status === 'PENDING').length },
    { id: 'published', label: 'Published', count: posts.filter(p => p.status === 'PUBLISHED').length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Author Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your blog posts and drafts</p>
            </div>
            <button
              onClick={() => window.location.href = '/create'}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              New Post
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <FileText className="text-indigo-600 dark:text-indigo-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{posts.filter(p => p.status === 'DRAFT').length}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Drafts</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{posts.filter(p => p.status === 'PENDING').length}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Eye className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{posts.filter(p => p.status === 'PUBLISHED').length}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Published</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Filter className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{posts.length}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab.label}
                  <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin text-2xl">◌</div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No {activeTab} posts</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {activeTab === 'drafts' && 'Start writing your first draft'}
              {activeTab === 'pending' && 'No posts waiting for approval'}
              {activeTab === 'published' && 'Your published posts will appear here'}
            </p>
            {activeTab === 'drafts' && (
              <button
                onClick={() => window.location.href = '/create'}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Create New Post
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPosts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                        {getStatusIcon(post.status)}
                        {post.status}
                      </span>
                      {post.parent_blog_id && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          Edit Version
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        Last saved: {new Date(post.last_saved_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{post.title}</h3>
                    {post.cover_image && (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                      <span>❤️ {post.likes_count}</span>
                      <span>👎 {post.dislikes_count}</span>
                      <span>🔖 {post.saves_count}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-6">
                    {post.status === 'DRAFT' && (
                      <>
                        <button
                          onClick={() => handleEdit(post._id)}
                          disabled={actionLoading === post._id}
                          className="p-2 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handlePublish(post._id)}
                          disabled={actionLoading === post._id}
                          className="p-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400 transition-colors"
                          title="Submit for Approval"
                        >
                          <Send size={18} />
                        </button>
                      </>
                    )}
                    {post.status === 'PUBLISHED' && (
                      <>
                        <button
                          onClick={() => handleEdit(post._id)}
                          disabled={actionLoading === post._id}
                          className="p-2 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                          title="Create Edit Draft"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                          title="View Post"
                        >
                          <Eye size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleArchive(post._id)}
                      disabled={actionLoading === post._id}
                      className="p-2 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                      title="Archive"
                    >
                      <Archive size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AuthorDashboard;
