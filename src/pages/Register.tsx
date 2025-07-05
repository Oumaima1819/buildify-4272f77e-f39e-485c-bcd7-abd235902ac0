
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Register = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref') || '';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "كلمات المرور غير متطابقة",
        description: "يرجى التأكد من تطابق كلمتي المرور."
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, username, referralCode);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ في إنشاء الحساب",
          description: error.message || "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى."
        });
      } else {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "مرحبًا بك في فلّوسك! يمكنك الآن البدء في كسب النقاط."
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في إنشاء الحساب",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-green-600">فلّوسك</CardTitle>
          <CardDescription className="text-lg">إنشاء حساب جديد</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-right block">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                placeholder="أدخل اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-right block">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="أعد إدخال كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="text-right"
                dir="rtl"
              />
            </div>
            {referralCode && (
              <div className="p-3 bg-green-50 rounded-md border border-green-200">
                <p className="text-sm text-green-700 text-right">
                  تم دعوتك بواسطة صديق! ستحصل على نقاط إضافية عند التسجيل.
                </p>
                <p className="text-xs text-green-600 text-right mt-1">
                  رمز الدعوة: {referralCode}
                </p>
              </div>
            )}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-green-600 hover:underline">
              تسجيل الدخول
            </Link>
          </div>
          <div className="text-center text-sm">
            <Link to="/" className="text-gray-500 hover:underline">
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;