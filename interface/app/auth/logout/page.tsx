"use client"
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const LogoutPage = () => {
    useEffect(() => {
        const logout = async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error logging out:', error.message);
            } else {
                console.log('User logged out successfully');
            }
        };

        logout();
    }, []);

    return <div>Logged out successfully!</div>;
};

export default LogoutPage;