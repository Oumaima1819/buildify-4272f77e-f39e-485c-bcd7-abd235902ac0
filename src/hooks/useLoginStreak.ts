
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DailyLoginBonus, UserLoginStreak } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { format, isAfter, isBefore, addDays, parseISO } from 'date-fns';

export const useLoginStreak = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get login bonuses
  const { data: loginBonuses, isLoading: loginBonusesLoading, error: loginBonusesError } = useQuery({
    queryKey: ['loginBonuses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_login_bonuses')
        .select('*')
        .order('day_number');

      if (error) throw error;
      return data as DailyLoginBonus[];
    },
    enabled: !!user,
  });

  // Get user login streak
  const { data: loginStreak, isLoading: loginStreakLoading, error: loginStreakError } = useQuery({
    queryKey: ['loginStreak', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_login_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
        throw error;
      }

      return data as UserLoginStreak | null;
    },
    enabled: !!user,
  });

  // Check in for daily login bonus
  const checkInMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // If user has a streak already
      if (loginStreak) {
        const lastLoginDate = parseISO(loginStreak.last_login_date);
        const yesterday = addDays(new Date(), -1);
        yesterday.setHours(0, 0, 0, 0);
        
        // If last login was today, do nothing
        if (format(lastLoginDate, 'yyyy-MM-dd') === today) {
          return loginStreak;
        }
        
        // If last login was yesterday, increment streak
        if (isAfter(lastLoginDate, yesterday)) {
          const newStreak = loginStreak.current_streak + 1;
          const maxStreak = Math.max(newStreak, loginStreak.max_streak);
          
          const { data, error } = await supabase
            .from('user_login_streaks')
            .update({
              current_streak: newStreak,
              max_streak: maxStreak,
              last_login_date: today,
              updated_at: new Date().toISOString()
            })
            .eq('id', loginStreak.id)
            .select();
            
          if (error) throw error;
          
          // Award points based on streak day
          const streakDay = Math.min(newStreak, 7);
          const bonus = loginBonuses?.find(b => b.day_number === streakDay);
          
          if (bonus) {
            await supabase
              .from('user_tasks')
              .insert([
                {
                  user_id: user.id,
                  task_id: 7, // Assuming 7 is the ID for daily login task
                  points_earned: bonus.points
                }
              ]);
          }
          
          return data[0] as UserLoginStreak;
        }
        
        // If last login was before yesterday, reset streak
        const { data, error } = await supabase
          .from('user_login_streaks')
          .update({
            current_streak: 1,
            last_login_date: today,
            updated_at: new Date().toISOString()
          })
          .eq('id', loginStreak.id)
          .select();
          
        if (error) throw error;
        
        // Award points for day 1
        const bonus = loginBonuses?.find(b => b.day_number === 1);
        
        if (bonus) {
          await supabase
            .from('user_tasks')
            .insert([
              {
                user_id: user.id,
                task_id: 7, // Assuming 7 is the ID for daily login task
                points_earned: bonus.points
              }
            ]);
        }
        
        return data[0] as UserLoginStreak;
      } else {
        // Create new streak for first-time login
        const { data, error } = await supabase
          .from('user_login_streaks')
          .insert([
            {
              user_id: user.id,
              current_streak: 1,
              max_streak: 1,
              last_login_date: today
            }
          ])
          .select();
          
        if (error) throw error;
        
        // Award points for day 1
        const bonus = loginBonuses?.find(b => b.day_number === 1);
        
        if (bonus) {
          await supabase
            .from('user_tasks')
            .insert([
              {
                user_id: user.id,
                task_id: 7, // Assuming 7 is the ID for daily login task
                points_earned: bonus.points
              }
            ]);
        }
        
        return data[0] as UserLoginStreak;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loginStreak', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
    },
  });

  return {
    loginBonuses,
    loginBonusesLoading,
    loginBonusesError,
    loginStreak,
    loginStreakLoading,
    loginStreakError,
    checkIn: checkInMutation.mutate,
    isCheckingIn: checkInMutation.isPending,
    checkInError: checkInMutation.error,
    canCheckInToday: loginStreak 
      ? format(parseISO(loginStreak.last_login_date), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
      : true
  };
};