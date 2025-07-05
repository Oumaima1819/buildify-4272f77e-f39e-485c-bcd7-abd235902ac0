
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Gift, 
  User, 
  LogOut, 
  Menu,
  Home
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    {
      name: 'لوحة التحكم',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: 'المهام',
      path: '/tasks',
      icon: <CheckSquare className="h-5 w-5" />
    },
    {
      name: 'المكافآت',
      path: '/rewards',
      icon: <Gift className="h-5 w-5" />
    },
    {
      name: 'الملف الشخصي',
      path: '/profile',
      icon: <User className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 pt-10">
                <div className="flex flex-col space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 space-x-reverse p-3 rounded-md ${
                        isActive(item.path)
                          ? 'bg-green-50 text-green-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 space-x-reverse p-3 rounded-md hover:bg-gray-100"
                  >
                    <Home className="h-5 w-5" />
                    <span>الصفحة الرئيسية</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center space-x-2 space-x-reverse p-3 rounded-md text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <Link to="/dashboard" className="text-2xl font-bold text-green-600">
            فلّوسك
          </Link>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="hidden md:flex items-center space-x-1 space-x-reverse">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-green-600">{user?.points} نقطة</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar - desktop only */}
        <aside className="hidden md:block w-64 bg-white border-r h-[calc(100vh-64px)] sticky top-16">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 space-x-reverse p-3 rounded-md ${
                  isActive(item.path)
                    ? 'bg-green-50 text-green-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t">
              <Link
                to="/"
                className="flex items-center space-x-2 space-x-reverse p-3 rounded-md hover:bg-gray-100"
              >
                <Home className="h-5 w-5" />
                <span>الصفحة الرئيسية</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 space-x-reverse p-3 rounded-md text-red-600 hover:bg-red-50 w-full text-right"
              >
                <LogOut className="h-5 w-5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;