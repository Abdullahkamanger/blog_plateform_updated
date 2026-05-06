'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, PenTool, BookOpen, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { OutputData } from '@editorjs/editorjs';

import { registerUser } from '@/lib/authActions';

const Editor = dynamic(() => import('@/components/editor/Editor'), { ssr: false });

interface FormData {
  name: string;
  email: string;
  password?: string;
  role: 'READER' | 'AUTHOR';
  bio?: string;
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'READER',
    bio: '',
  });
  const [bioData, setBioData] = useState<OutputData>({ blocks: [] });
  const [loading, setLoading] = useState<boolean>(false);
  
  const router = useRouter();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use Server Action instead of axios
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password || '');
      data.append('role', formData.role);
      if (formData.role === 'AUTHOR' && bioData?.blocks?.length) {
        data.append('bio', JSON.stringify(bioData));
      }

      const result = await registerUser(null, data);
      
      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
        return;
      }

      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (err: any) {
      toast.error('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Create Account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Join our community of thinkers
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Role Selection Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'READER' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                formData.role === 'READER'
                  ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <BookOpen size={18} /> Reader
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'AUTHOR' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                formData.role === 'AUTHOR'
                  ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <PenTool size={18} /> Author
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Full Name"
                autoComplete="name"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-white"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-white"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 dark:text-white"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          {formData.role === 'AUTHOR' ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50/70 dark:bg-slate-900/40">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                Short Biography
              </p>
              <div className="min-h-[180px]">
                <Editor data={bioData} onChange={setBioData} />
              </div>
            </div>
          ) : null}

          <button 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Signing up...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 dark:text-slate-400 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-bold">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;