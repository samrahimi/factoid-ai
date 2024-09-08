'use client'

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import {Navigation} from '@/components/Navigation';
export default function LayoutWrapperCodeOnly({ children }: { children: React.ReactNode }) {
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

  //Use this to add auth logic without changing the layout
  return (
    <div className="flex flex-col min-h-[100dvh]">
    <Navigation />
    <main className="flex-1">
      {children}
    </main>
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 News Site. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy Policy
          </Link>
        </nav>
      </footer>

    </div>
  );
}
