import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function DetailsRedirect() {
  const params = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      router.replace({
        pathname: `/venues/${params.id}`,
      } as any);
    } else {
      router.replace({
        pathname: '/venues',
      } as any);
    }
  }, [params, router]);

  return null;
}
