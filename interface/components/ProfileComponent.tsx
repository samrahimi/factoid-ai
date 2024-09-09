import React, { useState, useEffect } from 'react';
import { getCurrentUser, getUserProfile, updateUserProfile, uploadAvatar } from '@/lib/user';
import { Profile } from '@/lib/user';
import { useRouter } from 'next/navigation';
import { Router } from 'lucide-react';

const ProfileComponent = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()
  const fetchProfile = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        const userProfile = await getUserProfile(user.id);
        setProfile(userProfile);
        return userProfile
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (profile) {
      try {
        await updateUserProfile(profile);
        setError(null);
        router.push('/fact-check');

      } catch (err) {
        setError('Failed to update profile');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name == "username") {
        value = value.replace(/\s/g, '');
    }
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const updatedProfile= await uploadAvatar(file);
        setProfile(updatedProfile);
        //const updatedProfile= await fetchProfile();
        //setProfile(updatedProfile);
      } catch (err) {
        setError('Failed to upload avatar');
      }
    }
  };

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div className="text-white">No profile found</div>;

return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl mb-6 text-center">My Public Profile</h2>
            <p className="text-center text-sm text-gray-300 my-6">The information below will be associated with any Factoids that you create. Pseudonyms are allowed</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block mb-1">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={profile.username || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                        required
                        pattern="^\S+$"
                    />
                </div>
                <div>
                    <label htmlFor="full_name" className="block mb-1">Full Name</label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={profile.full_name || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                    />
                </div>
                <div>
                    <label htmlFor="website" className="block mb-1">Website</label>
                    <input
                        type="url"
                        id="website"
                        name="website"
                        value={profile.website || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                    />
                </div>
                <div>
                    <label htmlFor="avatar" className="block mb-1">Avatar</label>
                    <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        onChange={handleFileUpload}
                        className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                        accept="image/*"
                    />
                </div>
                {profile.avatar_url && (
                    <div className="mt-4">
                        <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full" />
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Save Profile
                </button>

                <p className="mt-6 text-center">
                <a href="/fact-check" className="text-blue-400 hover:underline">I'll Do This Later</a>

                </p>

            </form>
        </div>
    </div>
);
};

export default ProfileComponent;