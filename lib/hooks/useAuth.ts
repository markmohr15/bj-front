import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../authService';

export const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      router.push('/');
    }
  }, [router]);

  return authService.isLoggedIn();
};