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

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && pathname !== '/auth') {
        router.push('/auth');
      } else if (event === 'SIGNED_IN' && pathname === '/auth') {
        router.push('/');
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
            <h1 className="text-2xl font-bold text-gray-100">FACTOID.AI</h1>
            <div>
                <Link href="/beta" className="text-gray-300 hover:text-gray-100 mx-2">Home</Link>
              <Link href="/beta/my-reports" className="text-gray-300 hover:text-gray-100 mx-2">My Reports</Link>
            </div>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
