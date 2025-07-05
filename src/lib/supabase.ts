
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';

// Mock data for development
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    username: 'user1',
    points: 500,
    total_earned: 10.5,
    referral_code: 'ABC123',
    created_at: new Date().toISOString()
  }
];

const mockTasks = [
  { id: 1, category_id: 1, title: 'لعبة الكلمات المتقاطعة', description: 'أكمل لعبة الكلمات المتقاطعة لربح النقاط', points: 50, duration_seconds: 300, is_active: true },
  { id: 2, category_id: 1, title: 'لعبة الألغاز', description: 'حل اللغز بأسرع وقت ممكن', points: 75, duration_seconds: 180, is_active: true },
  { id: 3, category_id: 2, title: 'شاهد إعلان قصير', description: 'شاهد إعلان مدته 30 ثانية للحصول على نقاط', points: 15, duration_seconds: 30, is_active: true },
  { id: 4, category_id: 2, title: 'شاهد فيديو تعليمي', description: 'شاهد فيديو تعليمي قصير واربح نقاط', points: 25, duration_seconds: 120, is_active: true },
  { id: 5, category_id: 3, title: 'استطلاع رأي قصير', description: 'أجب عن 5 أسئلة سريعة', points: 30, duration_seconds: 120, is_active: true },
  { id: 6, category_id: 3, title: 'استبيان المنتجات', description: 'شاركنا رأيك في بعض المنتجات', points: 100, duration_seconds: 600, is_active: true },
  { id: 7, category_id: 4, title: 'تسجيل الدخول اليومي', description: 'سجل دخولك اليومي للحصول على مكافأة', points: 10, duration_seconds: 5, is_active: true },
  { id: 8, category_id: 4, title: 'دعوة صديق', description: 'ادعُ صديقًا للانضمام واحصل على نقاط إضافية', points: 200, duration_seconds: 60, is_active: true }
];

const mockCategories = [
  { id: 1, name: 'ألعاب', icon: 'gamepad', description: 'ألعاب ممتعة تربح منها نقاط' },
  { id: 2, name: 'فيديوهات', icon: 'video', description: 'شاهد فيديوهات قصيرة واربح نقاط' },
  { id: 3, name: 'استطلاعات', icon: 'clipboard-list', description: 'أجب عن أسئلة واستطلاعات لربح النقاط' },
  { id: 4, name: 'مهام يومية', icon: 'calendar-check', description: 'مهام يومية سهلة لربح نقاط إضافية' }
];

const mockRewards = [
  { id: 1, name: 'PayPal 5$', description: 'سحب 5 دولار على حسابك في PayPal', points_required: 5000, cash_value: 5.00, image_url: 'paypal.png', is_active: true },
  { id: 2, name: 'PayPal 10$', description: 'سحب 10 دولار على حسابك في PayPal', points_required: 9500, cash_value: 10.00, image_url: 'paypal.png', is_active: true },
  { id: 3, name: 'PayPal 20$', description: 'سحب 20 دولار على حسابك في PayPal', points_required: 18000, cash_value: 20.00, image_url: 'paypal.png', is_active: true },
  { id: 4, name: 'بطاقة جوجل بلاي 5$', description: 'بطاقة هدية لمتجر جوجل بلاي بقيمة 5 دولار', points_required: 5200, cash_value: 5.00, image_url: 'google-play.png', is_active: true },
  { id: 5, name: 'بطاقة آيتونز 5$', description: 'بطاقة هدية لمتجر آيتونز بقيمة 5 دولار', points_required: 5200, cash_value: 5.00, image_url: 'itunes.png', is_active: true }
];

// Create a mock Supabase client
class MockSupabaseClient {
  auth = {
    signUp: async ({ email, password }: { email: string; password: string }) => {
      // Simulate successful signup
      const newUser = {
        id: Math.random().toString(36).substring(2, 15),
        email,
        username: email.split('@')[0],
        points: 0,
        total_earned: 0,
        referral_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        created_at: new Date().toISOString()
      };
      
      mockUsers.push(newUser);
      
      return {
        data: { user: newUser, session: { access_token: 'mock_token' } },
        error: null
      };
    },
    
    signIn: async ({ email, password }: { email: string; password: string }) => {
      // Find user by email
      const user = mockUsers.find(u => u.email === email);
      
      if (user) {
        return {
          data: { user, session: { access_token: 'mock_token' } },
          error: null
        };
      }
      
      return {
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' }
      };
    },
    
    signOut: async () => {
      return { error: null };
    },
    
    getUser: async () => {
      // Return the first mock user for simplicity
      return { data: { user: mockUsers[0] }, error: null };
    },
    
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Immediately trigger the callback with a signed-in state
      callback('SIGNED_IN', { user: mockUsers[0] });
      
      // Return an unsubscribe function
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  };
  
  from = (table: string) => {
    return {
      select: () => {
        return {
          eq: (column: string, value: any) => {
            let data: any[] = [];
            
            if (table === 'tasks') {
              data = mockTasks;
              if (column) {
                data = data.filter(item => (item as any)[column] === value);
              }
            } else if (table === 'task_categories') {
              data = mockCategories;
              if (column) {
                data = data.filter(item => (item as any)[column] === value);
              }
            } else if (table === 'rewards') {
              data = mockRewards;
              if (column) {
                data = data.filter(item => (item as any)[column] === value);
              }
            } else if (table === 'users') {
              data = mockUsers;
              if (column) {
                data = data.filter(item => (item as any)[column] === value);
              }
            }
            
            return {
              data,
              error: null
            };
          },
          data: table === 'tasks' ? mockTasks :
                table === 'task_categories' ? mockCategories :
                table === 'rewards' ? mockRewards :
                table === 'users' ? mockUsers : [],
          error: null
        };
      },
      insert: (data: any) => {
        if (table === 'user_tasks') {
          // Simulate adding points to user
          const userId = data.user_id;
          const taskId = data.task_id;
          const task = mockTasks.find(t => t.id === taskId);
          
          if (task && userId) {
            const user = mockUsers.find(u => u.id === userId);
            if (user) {
              user.points += task.points;
            }
          }
        } else if (table === 'user_rewards') {
          // Simulate redeeming points
          const userId = data.user_id;
          const rewardId = data.reward_id;
          const reward = mockRewards.find(r => r.id === rewardId);
          
          if (reward && userId) {
            const user = mockUsers.find(u => u.id === userId);
            if (user) {
              user.points -= reward.points_required;
              user.total_earned += reward.cash_value;
            }
          }
        }
        
        return {
          data: { ...data, id: Math.random().toString(36).substring(2, 15) },
          error: null
        };
      },
      update: (data: any) => {
        return {
          eq: (column: string, value: any) => {
            if (table === 'users' && column === 'id') {
              const userIndex = mockUsers.findIndex(u => u.id === value);
              if (userIndex !== -1) {
                mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
              }
            }
            
            return {
              data: { ...data },
              error: null
            };
          }
        };
      }
    };
  };
}

// Use the mock client for development
const mockClient = new MockSupabaseClient() as unknown as SupabaseClient;

// For production, we would use the real Supabase client
const supabaseUrl = 'https://qfyfmjlmbvwpyhnjprnd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key';
const realClient = createClient(supabaseUrl, supabaseAnonKey);

// Export the mock client for now
export const supabase = mockClient;