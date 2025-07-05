
export interface User {
  id: string;
  email: string;
  username: string;
  points: number;
  total_earned: number;
  referral_code: string;
  referred_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCategory {
  id: number;
  name: string;
  icon: string;
  description: string;
  created_at: string;
}

export interface Task {
  id: number;
  category_id: number;
  title: string;
  description: string;
  points: number;
  duration_seconds: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: TaskCategory;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: number;
  points_earned: number;
  completed_at: string;
  task?: Task;
}

export interface Reward {
  id: number;
  name: string;
  description: string;
  points_required: number;
  cash_value: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: number;
  points_spent: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_method: string;
  payment_details?: Record<string, any>;
  created_at: string;
  updated_at: string;
  reward?: Reward;
}

export interface DailyLoginBonus {
  id: number;
  day_number: number;
  points: number;
  created_at: string;
}

export interface UserLoginStreak {
  id: string;
  user_id: string;
  current_streak: number;
  max_streak: number;
  last_login_date: string;
  created_at: string;
  updated_at: string;
}