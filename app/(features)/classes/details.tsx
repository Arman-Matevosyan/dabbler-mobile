import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ClassesRedirect() {
  const params = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      router.replace({
        pathname: `/classes/${params.id}`,
      } as any);
    } else {
      router.replace({
        pathname: '/classes',
      } as any);
    }
  }, [params, router]);

  return null;
}
