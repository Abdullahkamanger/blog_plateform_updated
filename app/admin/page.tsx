'use client';

import { useState, useEffect } from 'react';
import { Users, FileText, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import AuthorApprovalTable from './components/AuthorApprovalTable';
import BlogApprovalTable from './components/BlogApprovalTable';
import UserManagementTable from './components/UserManagementTable';
import BlogManagementHub from './components/BlogManagementHub';

interface Stats {
  users: number;
  pendingAuthors: number;
  pendingBlogs: number;
  blogs: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ users: 0, pendingAuthors: 0, pendingBlogs: 0, blogs: 0 });
  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'blogs'>('approvals');

  // Fetch quick stats for the dashboard header
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* --- 1. HEADER STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Pending Authors" 
            value={stats.pendingAuthors} 
            icon={<ShieldAlert className="text-amber-500" />} 
          />
          <StatCard 
            title="Pending Blogs" 
            value={stats.pendingBlogs} 
            icon={<FileText className="text-orange-500" />} 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <StatCard 
            title="Total Users" 
            value={stats.users} 
            icon={<Users className="text-blue-500" />} 
          />
          <StatCard 
            title="Total Blogs" 
            value={stats.blogs} 
            icon={<FileText className="text-indigo-500" />} 
          />
        </div>

        {/* --- 2. TABS NAVIGATION --- */}
        <div className="flex gap-4 mb-8 bg-white dark:bg-slate-900 p-2 rounded-2xl w-fit shadow-sm border border-slate-100 dark:border-slate-800">
          <TabBtn 
            active={activeTab === 'approvals'} 
            onClick={() => setActiveTab('approvals')} 
            label="Approvals" 
          />
          <TabBtn 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')} 
            label="User Control" 
          />
          <TabBtn 
            active={activeTab === 'blogs'} 
            onClick={() => setActiveTab('blogs')} 
            label="Blog Management" 
          />
        </div>

        {/* --- 3. DYNAMIC CONTENT --- */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          {activeTab === 'approvals' && (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <AuthorApprovalTable />
              <BlogApprovalTable />
            </div>
          )}
          {activeTab === 'users' && <UserManagementTable />}
          {activeTab === 'blogs' && <BlogManagementHub />}
        </div>
      </div>
    </div>
  );
};

// UI Components
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-1 duration-300">
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-black mt-1 dark:text-white">{value}</h3>
    </div>
    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl shadow-inner">{icon}</div>
  </div>
);

interface TabBtnProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const TabBtn: React.FC<TabBtnProps> = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
      active 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`}
  >
    {label}
  </button>
);

export default AdminDashboard;