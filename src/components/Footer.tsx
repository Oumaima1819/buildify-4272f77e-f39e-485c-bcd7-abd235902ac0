
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-right">
            <h3 className="text-2xl font-bold text-green-500">فلّوسك</h3>
            <p className="mt-4 text-gray-400">
              منصة رائدة لكسب المال عبر الإنترنت في المغرب والعالم العربي
            </p>
            <div className="mt-6 flex space-x-4 space-x-reverse justify-end">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="text-right">
            <h4 className="font-semibold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/#features" className="text-gray-400 hover:text-white">
                  المميزات
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-gray-400 hover:text-white">
                  كيف يعمل
                </Link>
              </li>
              <li>
                <Link to="/#testimonials" className="text-gray-400 hover:text-white">
                  آراء المستخدمين
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-right">
            <h4 className="font-semibold text-lg mb-4">الدعم</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  اتصل بنا
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  سياسة الخصوصية
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  شروط الاستخدام
                </a>
              </li>
            </ul>
          </div>
          
          <div className="text-right">
            <h4 className="font-semibold text-lg mb-4">تواصل معنا</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">
                البريد الإلكتروني: support@floussek.com
              </li>
              <li className="text-gray-400">
                الهاتف: +212 5XX-XXXXXX
              </li>
              <li className="text-gray-400">
                العنوان: الدار البيضاء، المغرب
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>© {new Date().getFullYear()} فلّوسك. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;