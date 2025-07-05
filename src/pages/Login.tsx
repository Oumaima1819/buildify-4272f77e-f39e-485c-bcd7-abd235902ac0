
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ في تسجيل الدخول",
          description: error.message || "حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني وكلمة المرور."
        });
      } else {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحبًا بك مجددًا في فلّوسك!"
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
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
          <CardDescription className="text-lg">تسجيل الدخول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="text-green-600 hover:underline">
              إنشاء حساب جديد
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

export default Login;