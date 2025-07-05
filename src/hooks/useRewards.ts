
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Reward, UserReward } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useRewards = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get all rewards
  const { data: rewards, isLoading: rewardsLoading, error: rewardsError } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true)
        .order('points_required');

      if (error) throw error;
      return data as Reward[];
    },
    enabled: !!user,
  });

  // Get user redeemed rewards
  const { data: redeemedRewards, isLoading: redeemedRewardsLoading, error: redeemedRewardsError } = useQuery({
    queryKey: ['redeemedRewards', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_rewards')
        .select(`
          *,
          reward:rewards(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserReward[];
    },
    enabled: !!user,
  });

  // Redeem a reward
  const redeemRewardMutation = useMutation({
    mutationFn: async ({ rewardId, paymentMethod, paymentDetails }: { 
      rewardId: number, 
      paymentMethod: string, 
      paymentDetails?: Record<string, any> 
    }) => {
      if (!user) throw new Error('User not authenticated');

      const reward = rewards?.find(r => r.id === rewardId);
      if (!reward) throw new Error('Reward not found');

      if (user.points < reward.points_required) {
        throw new Error('Not enough points');
      }

      const { data, error } = await supabase
        .from('user_rewards')
        .insert([
          {
            user_id: user.id,
            reward_id: rewardId,
            points_spent: reward.points_required,
            payment_method: paymentMethod,
            payment_details: paymentDetails || {}
          }
        ])
        .select();

      if (error) throw error;
      return data[0] as UserReward;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redeemedRewards', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
    },
  });

  return {
    rewards,
    rewardsLoading,
    rewardsError,
    redeemedRewards,
    redeemedRewardsLoading,
    redeemedRewardsError,
    redeemReward: redeemRewardMutation.mutate,
    isRedeeming: redeemRewardMutation.isPending,
    redeemError: redeemRewardMutation.error
  };
};