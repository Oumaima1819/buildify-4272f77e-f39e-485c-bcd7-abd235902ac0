
import { 
  Smartphone, 
  DollarSign, 
  Gift, 
  Clock, 
  Shield, 
  Users,
  Video,
  GamepadIcon,
  BrainCircuit
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <GamepadIcon className="h-10 w-10 text-green-600" />,
      title: 'ألعاب ممتعة',
      description: 'العب ألعاب خفيفة وممتعة واربح النقاط بكل سهولة'
    },
    {
      icon: <Video className="h-10 w-10 text-green-600" />,
      title: 'مشاهدة الفيديوهات',
      description: 'شاهد فيديوهات قصيرة وممتعة واحصل على نقاط مقابل كل فيديو'
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-green-600" />,
      title: 'تحديات خفيفة',
      description: 'أكمل تحديات وأنشطة سهلة لجمع المزيد من النقاط'
    },
    {
      icon: <Users className="h-10 w-10 text-green-600" />,
      title: 'دعوة الأصدقاء',
      description: 'ادعُ أصدقاءك واحصل على مكافآت إضافية عند انضمامهم'
    },
    {
      icon: <DollarSign className="h-10 w-10 text-green-600" />,
      title: 'سحب سريع',
      description: 'اسحب أرباحك بسرعة وسهولة عبر PayPal أو بطاقات التعبئة'
    },
    {
      icon: <Shield className="h-10 w-10 text-green-600" />,
      title: 'آمن وموثوق',
      description: 'منصة آمنة بالكامل وموثوقة من قبل آلاف المستخدمين'
    }
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            شنو كيميز <span className="text-green-600">فلّوسك</span>؟
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            نقدم لك طرق متعددة وسهلة لكسب المال من هاتفك، في أي وقت وأي مكان
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-end text-right">
                <div className="mb-4 p-3 bg-green-50 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-green-50 to-amber-50 p-8 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-right mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-900">
                كيف يعمل فلّوسك؟
              </h3>
              <p className="mt-2 text-gray-600">
                عملية بسيطة وسهلة للغاية:
              </p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center justify-end">
                  <span className="mr-2">سجل حساب جديد مجاني</span>
                  <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center font-bold">1</span>
                </li>
                <li className="flex items-center justify-end">
                  <span className="mr-2">أكمل المهام والألعاب لجمع النقاط</span>
                  <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center font-bold">2</span>
                </li>
                <li className="flex items-center justify-end">
                  <span className="mr-2">استبدل نقاطك بمكافآت نقدية حقيقية</span>
                  <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center font-bold">3</span>
                </li>
                <li className="flex items-center justify-end">
                  <span className="mr-2">استلم أموالك عبر PayPal أو بطاقات التعبئة</span>
                  <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center font-bold">4</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 bg-green-500 rounded-full opacity-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-center">
                    <Smartphone className="h-16 w-16 text-green-600" />
                    <DollarSign className="h-16 w-16 text-amber-500 ml-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;