
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginStreak } from '@/hooks/useLoginStreak';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Gift, 
  Users, 
  Clock, 
  CheckCircle2,
  Share2
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { loginStreak, checkIn, canCheckInToday, loginBonuses } = useLoginStreak();
  const { completedTasks } = useTasks();
  const { toast } = useToast();

  useEffect(() => {
    if (canCheckInToday) {
      checkIn();
      toast({
        title: "تم تسجيل حضورك اليومي!",
        description: "لقد حصلت على نقاط إضافية. استمر في تسجيل الدخول يوميًا للحصول على المزيد من النقاط!",
      });
    }
  }, []);

  const handleCopyReferralLink = () => {
    if (!user?.referral_code) return;
    
    const referralLink = `${window.location.origin}/register?ref=${user.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    
    toast({
      title: "تم نسخ رابط الدعوة",
      description: "شارك هذا الرابط مع أصدقائك ليحصلوا على نقاط إضافية عند التسجيل!",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-right">مرحبًا، {user?.username}!</CardTitle>
              <CardDescription className="text-right">إليك ملخص حسابك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Trophy className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">رصيدك الحالي</p>
                      <p className="text-2xl font-bold text-green-600">{user?.points} نقطة</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <TrendingUp className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">إجمالي الأرباح</p>
                      <p className="text-2xl font-bold text-amber-600">${user?.total_earned.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-right">سلسلة الحضور اليومي</CardTitle>
              <CardDescription className="text-right">سجّل دخولك يوميًا للحصول على المزيد من النقاط</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">سلسلة الحضور الحالية</p>
                    <p className="text-2xl font-bold text-blue-600">{loginStreak?.current_streak || 0} يوم</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 7 }).map((_, index) => {
                    const dayNumber = index + 1;
                    const isActive = (loginStreak?.current_streak || 0) >= dayNumber;
                    const bonus = loginBonuses?.find(b => b.day_number === dayNumber);
                    
                    return (
                      <div 
                        key={dayNumber}
                        className={`p-2 rounded-md text-center ${
                          isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <div className="text-xs">{dayNumber}</div>
                        <div className="text-xs font-bold">{bonus?.points || 0}</div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="text-center text-sm text-gray-500">
                  أكبر سلسلة حضور: {loginStreak?.max_streak || 0} يوم
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="quick-actions" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="quick-actions">إجراءات سريعة</TabsTrigger>
            <TabsTrigger value="recent-activities">أنشطة حديثة</TabsTrigger>
            <TabsTrigger value="referrals">دعوة الأصدقاء</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick-actions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/tasks">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center space-x-4 space-x-reverse">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-medium">المهام المتاحة</h3>
                      <p className="text-sm text-gray-500">أكمل المهام واربح النقاط</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/rewards">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center space-x-4 space-x-reverse">
                    <div className="bg-pink-100 p-3 rounded-full">
                      <Gift className="h-6 w-6 text-pink-600" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-medium">المكافآت</h3>
                      <p className="text-sm text-gray-500">استبدل نقاطك بمكافآت نقدية</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/profile">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center space-x-4 space-x-reverse">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-medium">الملف الشخصي</h3>
                      <p className="text-sm text-gray-500">إدارة حسابك الشخصي</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="recent-activities" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-right">آخر الأنشطة</CardTitle>
              </CardHeader>
              <CardContent>
                {completedTasks && completedTasks.length > 0 ? (
                  <div className="space-y-4">
                    {completedTasks.slice(0, 5).map((userTask) => (
                      <div key={userTask.id} className="flex justify-between items-center border-b pb-2">
                        <div className="text-sm text-gray-500">
                          {new Date(userTask.completed_at).toLocaleDateString('ar-MA')}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{userTask.task?.title}</p>
                          <p className="text-sm text-green-600">+{userTask.points_earned} نقطة</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">لم تكمل أي مهام بعد</p>
                    <Link to="/tasks">
                      <Button variant="link" className="mt-2">
                        ابدأ بإكمال المهام الآن
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="referrals" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-right">دعوة الأصدقاء</CardTitle>
                <CardDescription className="text-right">
                  ادعُ أصدقاءك واحصل على 200 نقطة لكل صديق ينضم باستخدام رابط الدعوة الخاص بك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCopyReferralLink}
                        className="flex items-center gap-1"
                      >
                        <Share2 className="h-4 w-4" />
                        نسخ الرابط
                      </Button>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">رمز الدعوة الخاص بك</p>
                        <p className="text-lg font-bold text-green-600 font-mono">{user?.referral_code}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-600">
                    <p>كيفية دعوة الأصدقاء:</p>
                    <ol className="list-decimal list-inside space-y-1 mt-2 mr-4">
                      <li>انسخ رابط الدعوة الخاص بك</li>
                      <li>شاركه مع أصدقائك عبر الواتساب، الفيسبوك، أو أي وسيلة أخرى</li>
                      <li>عندما يسجل صديقك باستخدام رابطك، ستحصل على 200 نقطة</li>
                      <li>سيحصل صديقك أيضًا على نقاط إضافية عند التسجيل</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;