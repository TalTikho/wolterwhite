import { useEffect } from 'react';
import { useRouter, Href } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';
import { Home } from '@/components/Home';

export default function HomeScreen() {
  const { token } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace('/login' as Href);
    }
  }, [token]);

  if (!token) return null;

  return <Home token={token} />;
}