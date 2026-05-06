'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'sonner';
import { OutputData } from '@editorjs/editorjs';
import { Loader2 } from 'lucide-react';

const Editor = dynamic(() => import('@/components/editor/Editor'), { ssr: false });

interface ProfileData {
  name: string;
  email: string;
  role: string;
  bio?: string | null;
  social_links?: {
    twitter?: string | null;
    github?: string | null;
    linkedin?: string | null;
    website?: string | null;
  };
}

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bioData, setBioData] = useState<OutputData>({ blocks: [] });
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    github: '',
    linkedin: '',
    website: '',
  });
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/user/profile');
        const profileData = res.data;
        setProfile(profileData);
        setSocialLinks({
          twitter: profileData.social_links?.twitter || '',
          github: profileData.social_links?.github || '',
          linkedin: profileData.social_links?.linkedin || '',
          website: profileData.social_links?.website || '',
        });

        if (profileData.bio) {
          try {
            const parsed = JSON.parse(profileData.bio);
            if (parsed?.blocks) {
              setBioData(parsed);
            }
          } catch {
            setBioData({
              blocks: [{ type: 'paragraph', data: { text: profileData.bio } }],
            });
          }
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/api/user/profile', {
        bio: bioData?.blocks?.length ? JSON.stringify(bioData) : null,
        social_links: socialLinks,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500 dark:text-slate-400">
        <Loader2 className="animate-spin mr-2" size={20} />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Author Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Keep your public author profile up to date.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
            {profile?.name} ({profile?.email})
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Biography</p>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50/70 dark:bg-slate-900/40 min-h-[200px]">
            <Editor data={bioData} onChange={setBioData} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="url"
            placeholder="Twitter URL"
            value={socialLinks.twitter}
            onChange={(e) => setSocialLinks((prev) => ({ ...prev, twitter: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
          />
          <input
            type="url"
            placeholder="GitHub URL"
            value={socialLinks.github}
            onChange={(e) => setSocialLinks((prev) => ({ ...prev, github: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
          />
          <input
            type="url"
            placeholder="LinkedIn URL"
            value={socialLinks.linkedin}
            onChange={(e) => setSocialLinks((prev) => ({ ...prev, linkedin: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
          />
          <input
            type="url"
            placeholder="Website URL"
            value={socialLinks.website}
            onChange={(e) => setSocialLinks((prev) => ({ ...prev, website: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Saving...
            </>
          ) : (
            'Save Profile'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
