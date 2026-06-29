import { Redirect } from 'expo-router';
import { useAuthContext } from '@/context/AuthContext';
import { Home } from '@/components/Home';

export default function HomeScreen() {
  const { token } = useAuthContext();

  // Redirect component is safe to use on first render —
  // unlike router.replace() in useEffect, it doesn't try
  // to navigate before the root layout is mounted.
  if (!token) {
    return <Redirect href="/login" />;
  }

  return <Home token={token} />;
}