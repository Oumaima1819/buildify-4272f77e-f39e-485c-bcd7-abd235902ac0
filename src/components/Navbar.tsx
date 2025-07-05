
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-green-600">
            فلّوسك
          </Link>

          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-green-600">
              الرئيسية
            </Link>
            <Link to="/#features" className="text-gray-700 hover:text-green-600">
              المميزات
            </Link>
            <Link to="/#how-it-works" className="text-gray-700 hover:text-green-600">
              كيف يعمل
            </Link>
            <Link to="/#testimonials" className="text-gray-700 hover:text-green-600">
              آراء المستخدمين
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {user ? (
              <Link to="/dashboard">
                <Button>لوحة التحكم</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">تسجيل الدخول</Button>
                </Link>
                <Link to="/register">
                  <Button>إنشاء حساب</Button>
                </Link>
              </>
            )}
          </div>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 pt-10">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  الرئيسية
                </Link>
                <Link 
                  to="/#features" 
                  className="text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  المميزات
                </Link>
                <Link 
                  to="/#how-it-works" 
                  className="text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  كيف يعمل
                </Link>
                <Link 
                  to="/#testimonials" 
                  className="text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  آراء المستخدمين
                </Link>
                
                <div className="pt-4 mt-4 border-t flex flex-col space-y-2">
                  {user ? (
                    <Link 
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full">لوحة التحكم</Button>
                    </Link>
                  ) : (
                    <>
                      <Link 
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">تسجيل الدخول</Button>
                      </Link>
                      <Link 
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button className="w-full">إنشاء حساب</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;