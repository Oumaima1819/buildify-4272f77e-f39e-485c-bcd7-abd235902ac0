
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, DollarSign, Clock } from 'lucide-react';

const CTA = () => {
  const { user } = useAuth();

  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 text-right mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              ما تبقاش تضيع الوقت! <br />
              ابدأ في ربح المال الآن
            </h2>
            <p className="mt-4 text-xl text-green-100">
              حمّل فلّوسك دابا، وخلّي وقتك على الهاتف يرجع ليك بفائدة 💰
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-end">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-6 flex items-center gap-2">
                    لوحة التحكم
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-6 flex items-center gap-2">
                    ابدأ الآن مجانًا
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="flex items-center">
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center justify-center">
                  <DollarSign className="h-16 w-16 text-amber-300" />
                  <Clock className="h-12 w-12 text-white ml-4" />
                </div>
                <p className="mt-4 text-center text-white font-medium">
                  الوقت = المال
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;