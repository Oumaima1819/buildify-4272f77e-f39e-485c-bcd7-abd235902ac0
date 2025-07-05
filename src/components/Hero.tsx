
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Smartphone, DollarSign, Award } from 'lucide-react';

const Hero = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-b from-green-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-right order-2 md:order-1 mt-8 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              <span className="text-green-600">فلّوسك</span> - اربح المال من هاتفك
            </h1>
            <p className="mt-4 text-xl text-gray-600 leading-relaxed">
              باغي تربح الفلوس وانت فدارك؟ 🤩
              مع تطبيق فلّوسك، تلفونك غادي يولي مصدر دخل يومي!
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-end">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-6 flex items-center gap-2">
                    لوحة التحكم
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button size="lg" className="text-lg px-8 py-6 flex items-center gap-2">
                    ابدأ الآن مجانًا
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
            <div className="mt-8 flex items-center justify-end gap-6">
              <div className="flex items-center">
                <span className="text-green-600 font-semibold">+10,000</span>
                <span className="text-gray-600 mr-2">مستخدم نشط</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 font-semibold">+$50,000</span>
                <span className="text-gray-600 mr-2">تم دفعها</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-green-500 rounded-full opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-48 h-48 md:w-64 md:h-64 bg-amber-500 rounded-full opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
              <div className="relative z-10 bg-white p-4 rounded-3xl shadow-xl border border-gray-100">
                <div className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl">
                  <Smartphone className="h-16 w-16 text-green-600 mb-4" />
                  <DollarSign className="h-12 w-12 text-amber-500 mb-2" />
                  <Award className="h-10 w-10 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;