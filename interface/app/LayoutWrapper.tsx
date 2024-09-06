'use client'

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  //const [loggedInUser, setLoggedInUser] = useState({})
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && pathname !== '/auth') {
        router.push('/auth');
      } else if (session && pathname === '/auth') {
        router.push('/');
      } 
    
      setIsLoading(false);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async(event, session) => {
      if (event === 'SIGNED_OUT' && pathname !== '/auth') {
        router.push('/auth');
      } else if (event === 'SIGNED_IN' && pathname === '/auth') {
        console.log(JSON.stringify(await supabase.auth.getUser()))
        router.push('/fact-check');
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [router, pathname]);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-sm">
        <div className="fixed top-0 left-0 right-0 bg-gray-900 px-4 py-6 sm:px-6 lg:px-8 z-10">
          <nav className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-100">de<span className='text-teal-500'>fact</span></h1>
            <div>
                <Link href="/fact-check" className="text-gray-300 hover:text-gray-100 mx-2">New Factoid</Link>
                <Link href="/fact-check/my-reports" className="text-gray-300 hover:text-gray-100 mx-2">My Factoids</Link>
                <Link href="/auth/logout" className="text-gray-300 hover:text-gray-100 mx-2">Sign Out</Link>
            </div>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
