import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Building, 
  MessageSquare, 
  Phone, 
  CreditCard, 
  Mail, 
  Bell,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: Home },
    { path: '/admin/blogs', label: 'Blogs', icon: FileText },
    { path: '/admin/campus-updates', label: 'Updates', icon: Building },
    { path: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
    { path: '/admin/contacts', label: 'Contacts', icon: Phone },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard },
    { path: '/admin/emails', label: 'Emails', icon: Mail }
  ];

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-red-50 text-red-600'
        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
    }`;

  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-600">
                <span className="text-white font-semibold">B</span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Admin</h1>
                <p className="text-xs text-gray-500">Brookside</p>
              </div>
            </div>
          )}
          
          {isCollapsed && !isMobile && (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-600 mx-auto">
              <span className="text-white font-semibold">B</span>
            </div>
          )}
          
          {!isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}
          
          {isMobile && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={linkClass}
            title={isCollapsed && !isMobile ? item.label : ''}
            onClick={handleNavClick}
          >
            <item.icon className="w-4 h-4" />
            {(!isCollapsed || isMobile) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-red-600 text-white rounded-lg shadow-lg transition-transform hover:scale-105"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside 
          className={`min-h-screen bg-white border-r border-gray-100 transition-all duration-300 ${
            isCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Mobile Sidebar */}
          <aside className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl md:hidden transform transition-transform duration-300">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;