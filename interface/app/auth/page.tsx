'use client'

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Auth from '../../components/auth';
import { supabase } from '../../lib/supabaseClient';
import { UserResponse } from '@supabase/supabase-js';

export default function AuthPage() {

  const router = useRouter();

  useEffect(() => {
  
    const checkAuth = async () => {
      const user: UserResponse = await supabase.auth.getUser();
      //const { data: { session } } = await supabase.auth.getSession();
      if (user.data?.user)
     {
        router.push('/');
      }
    };

    //checkAuth();
  }, [router]);

  return <Auth />;
}
