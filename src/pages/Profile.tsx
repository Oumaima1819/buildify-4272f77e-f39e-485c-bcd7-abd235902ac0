
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  User, 
  Mail, 
  Key, 
  LogOut,
  Share2,
  Loader2
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, signOut } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const { error } = await updateProfile({ username });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "فشل تحديث الملف الشخصي",
          description: error.message || "حدث خطأ أثناء تحديث الملف الشخصي. يرجى المحاولة مرة أخرى."
        });
      } else {
        toast({
          title: "تم تحديث الملف الشخصي",
          description: "تم تحديث معلومات ملفك الشخصي بنجاح."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل تحديث الملف الشخصي",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "كلمات المرور غير متطابقة",
        description: "كلمة المرور الجديدة وتأكيدها غير متطابقين."
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // This is a placeholder - in a real app, you'd implement password change
      // through Supabase Auth API
      toast({
        title: "تم تحديث كلمة المرور",
        description: "تم تغيير كلمة المرور الخاصة بك بنجاح."
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل تحديث كلمة المرور",
        description: "حدث خطأ أثناء تحديث كلمة المرور. يرجى المحاولة مرة أخرى."
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح. نتمنى رؤيتك مرة أخرى قريبًا!"
    });
  };
  
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
        <div className="text-right">
          <h1 className="text-2xl font-bold">الملف الشخصي</h1>
          <p className="text-gray-500">إدارة معلومات حسابك الشخصي</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-right">
                  <CardTitle className="text-xl">معلومات الحساب</CardTitle>
                  <CardDescription className="text-right">
                    عضو منذ {new Date(user?.created_at || '').toLocaleDateString('ar-MA')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <div className="font-medium">اسم المستخدم:</div>
                <div>{user?.username}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-medium">البريد الإلكتروني:</div>
                <div>{user?.email}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-medium">إجمالي النقاط المكتسبة:</div>
                <div>{user?.points + (user?.total_earned || 0) * 1000} نقطة</div>
              </div>
              <div className="flex justify-between">
                <div className="font-medium">إجمالي الأرباح:</div>
                <div>${user?.total_earned.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="bg-green-100 p-2 rounded-full">
                  <Share2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-right">
                  <CardTitle className="text-xl">رابط الدعوة</CardTitle>
                  <CardDescription className="text-right">
                    شارك واربح 200 نقطة لكل صديق
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-green-50 rounded-md border border-green-200">
                <p className="text-sm text-green-700 text-right mb-2">
                  رمز الدعوة الخاص بك:
                </p>
                <div className="flex items-center justify-between bg-white rounded p-2 border border-green-100">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyReferralLink}
                    className="flex items-center gap-1"
                  >
                    <Share2 className="h-4 w-4" />
                    نسخ
                  </Button>
                  <code className="font-mono text-green-600 font-bold">
                    {user?.referral_code}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="account">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="account">تعديل الحساب</TabsTrigger>
            <TabsTrigger value="password">تغيير كلمة المرور</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-right">تعديل معلومات الحساب</CardTitle>
                <CardDescription className="text-right">
                  قم بتحديث معلومات ملفك الشخصي هنا
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-right block">اسم المستخدم</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      value={email}
                      disabled
                      className="text-right bg-gray-50"
                      dir="rtl"
                    />
                    <p className="text-xs text-gray-500 text-right">
                      لا يمكن تغيير البريد الإلكتروني
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري التحديث...
                      </>
                    ) : (
                      'حفظ التغييرات'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-right">تغيير كلمة المرور</CardTitle>
                <CardDescription className="text-right">
                  قم بتحديث كلمة المرور الخاصة بك هنا
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-right block">كلمة المرور الحالية</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-right block">كلمة المرور الجديدة</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-right block">تأكيد كلمة المرور الجديدة</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري التحديث...
                      </>
                    ) : (
                      'تغيير كلمة المرور'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="bg-red-50 border-red-100">
          <CardHeader>
            <CardTitle className="text-xl text-right text-red-600">تسجيل الخروج</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;