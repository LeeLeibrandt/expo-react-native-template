import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { appService } from '@/services/appService';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

export const useFeatureFlags = () => {
  const accessToken = useAuthStore((state) => state.session?.access_token);
  const setFeatureFlags = useAppStore((state) => state.setFeatureFlags);

  const query = useQuery({
    queryFn: () => appService.getFeatureFlags(accessToken),
    queryKey: queryKeys.featureFlags,
  });

  useEffect(() => {
    if (query.data) {
      setFeatureFlags(query.data);
    }
  }, [query.data, setFeatureFlags]);

  return query;
};
