import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PurchasesPackage } from 'react-native-purchases';

import { queryKeys } from '@/constants/queryKeys';
import { paymentService } from '@/services/paymentService';
import { useAuthStore } from '@/store/useAuthStore';

export const useSubscriptionStatus = () => {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    enabled: Boolean(userId),
    queryFn: () => paymentService.getCustomerInfo(userId),
    queryKey: queryKeys.customerInfo(userId),
  });
};

export const useOfferingsQuery = () => {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    enabled: Boolean(userId),
    queryFn: () => paymentService.getOfferings(userId),
    queryKey: queryKeys.offerings,
  });
};

export const usePurchasePackageMutation = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: (selectedPackage: PurchasesPackage) =>
      paymentService.purchasePackage(selectedPackage, userId),
    onSuccess: (snapshot) => {
      queryClient.setQueryData(queryKeys.customerInfo(userId), snapshot);
    },
  });
};

export const useRestorePurchasesMutation = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: () => paymentService.restorePurchases(userId),
    onSuccess: (snapshot) => {
      queryClient.setQueryData(queryKeys.customerInfo(userId), snapshot);
    },
  });
};
