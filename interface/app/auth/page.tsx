'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Auth from '../../components/auth';
import { supabase } from '../../lib/supabaseClient';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  return <Auth />;
}
