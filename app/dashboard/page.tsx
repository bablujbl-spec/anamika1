'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/'); // Not logged in → back to login
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  return (
    <div style={{ padding: '2rem' }}>
      {user ? <h1>স্বাগতম, {user.email}</h1> : <p>Loading...</p>}
    </div>
  );
}
