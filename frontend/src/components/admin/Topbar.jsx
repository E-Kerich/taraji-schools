import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Search, Bell, Menu, X, User, ChevronDown } from 'lucide-react';

const Topbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const notifications = [
    { id: 1, text: 'New inquiry received', time: '5 min ago', read: false },
    { id: 2, text: 'Payment completed', time: '1 hour ago', read: true },
    { id: 3, text: 'Blog published', time: '2 hours ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Menu Button & Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Mobile Title (only on small screens) */}
        <div className="lg:hidden">
          <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
        </div>
      </div>

      {/* Center: Search - Adapts based on screen size */}
      <div className={`${searchExpanded ? 'absolute left-4 right-4' : 'hidden md:flex'} flex-1 max-w-xl mx-4`}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg 
                     focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
            onBlur={() => setSearchExpanded(false)}
          />
          {searchExpanded && (
            <button
              onClick={() => setSearchExpanded(false)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 lg:hidden"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Icons & User */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setSearchExpanded(!searchExpanded)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
        >
          {searchExpanded ? (
            <X className="w-5 h-5" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>

        {/* Notifications (hidden on smallest screens) */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs 
                             rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <p className="text-sm text-gray-900">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="text-sm text-red-600 hover:text-red-700 w-full text-center py-2">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            
            {/* User info - hidden on mobile, visible on tablet+ */}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                {user?.name || user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-[120px]">
                {user?.role || 'Admin'}
              </p>
            </div>
            
            {/* Chevron - hidden on mobile */}
            <ChevronDown className={`hidden sm:block w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Administrator'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              
              <div className="py-1">
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Bell className="w-4 h-4" />
                  Notifications
                </button>
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click Outside Handler */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default Topbar;