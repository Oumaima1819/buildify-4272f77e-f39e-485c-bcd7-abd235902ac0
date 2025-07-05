
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Task, UserTask } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get all tasks
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          category:task_categories(*)
        `)
        .eq('is_active', true)
        .order('category_id');

      if (error) throw error;
      return data as (Task & { category: { name: string; icon: string } })[];
    },
    enabled: !!user,
  });

  // Get user completed tasks
  const { data: completedTasks, isLoading: completedTasksLoading, error: completedTasksError } = useQuery({
    queryKey: ['completedTasks', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_tasks')
        .select(`
          *,
          task:tasks(*)
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data as UserTask[];
    },
    enabled: !!user,
  });

  // Complete a task
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      if (!user) throw new Error('User not authenticated');

      const task = tasks?.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      const { data, error } = await supabase
        .from('user_tasks')
        .insert([
          {
            user_id: user.id,
            task_id: taskId,
            points_earned: task.points
          }
        ])
        .select();

      if (error) throw error;
      return data[0] as UserTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completedTasks', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
    },
  });

  return {
    tasks,
    tasksLoading,
    tasksError,
    completedTasks,
    completedTasksLoading,
    completedTasksError,
    completeTask: completeTaskMutation.mutate,
    isCompletingTask: completeTaskMutation.isPending,
    completeTaskError: completeTaskMutation.error
  };
};