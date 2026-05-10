'use client';

import { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, Eye } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import BlogPreviewModal from "./BlogPreviewModal";

interface PendingBlog {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
}

const BlogApprovalTable = () => {
  const [blogs, setBlogs] = useState<PendingBlog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [previewBlog, setPreviewBlog] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/admin/pending-blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      await axios.put(`/api/admin/toggle-publish/${id}`, { status: true });
      toast.success("Blog approved and published!");
      await loadPending();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve blog");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this blog? It will be moved to drafts.")) return;
    setActionId(id);
    try {
      await axios.put(`/api/admin/toggle-publish/${id}`, { status: false });
      toast.info("Blog rejected and moved to drafts");
      await loadPending();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject blog");
    } finally {
      setActionId(null);
    }
  };

  const handlePreview = async (id: string) => {
    try {
      const res = await axios.get(`/api/admin/blog-preview/${id}`);
      setPreviewBlog(res.data);
      setIsPreviewOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load preview");
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading pending articles...
      </div>
    );
  }

  if (blogs.length === 0) {
    return <div className="p-10 text-center text-slate-500 font-medium">No articles awaiting approval.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800/50">
        <p className="text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">Pending Article Approvals</p>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Title</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Author</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {blogs.map(blog => (
            <tr key={blog.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-800 dark:text-white max-w-xs truncate">{blog.title}</td>
              <td className="px-6 py-4 text-slate-500 text-sm">{blog.author}</td>
              <td className="px-6 py-4">
                <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded text-[10px] font-bold uppercase">
                  {blog.category || 'General'}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button 
                  onClick={() => handlePreview(blog.id)}
                  className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                  title="Preview"
                >
                  <Eye size={18} />
                </button>
                <button 
                  onClick={() => handleApprove(blog.id)}
                  disabled={!!actionId}
                  className="p-2 text-slate-400 hover:text-emerald-500 transition-colors disabled:opacity-50"
                  title="Approve"
                >
                  {actionId === blog.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                </button>
                <button 
                  onClick={() => handleReject(blog.id)}
                  disabled={!!actionId}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Reject"
                >
                  {actionId === blog.id ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <BlogPreviewModal 
        blog={previewBlog} 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </div>
  );
};

export default BlogApprovalTable;
