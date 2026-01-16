import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCampusesOpen, setIsCampusesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isCampusActive = () => {
    return campusLinks.some(link => isActive(link.to));
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/admissions", label: "Admissions" },
    { to: "/academics", label: "Academics" },
    { to: "/blogs", label: "News & Articles" },
  ];

  const campusLinks = [
    { to: "/campuses/westlands", label: "Westlands Campus" },
    { to: "/campuses/redhill", label: "Redhill Campus" }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCampusesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle scroll effect
useEffect(() => {
    const handleRouteChange = () => {
        setIsMenuOpen(false);
        setIsCampusesOpen(false);
    };
    handleRouteChange();
}, [location.pathname]);

  return (
    <header className={`sticky top-0 z-50 bg-white shadow-sm transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
      {/* Top bar with contact info */}
      <div className="bg-gray-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between text-sm">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-1 md:mb-0">
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3" />
              <span>+254 719 786 001</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Mail className="w-3 h-3" />
              <span>info@brooksideschools.com</span>
            </div>
          </div>
          
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/assets/3.jpg"
              alt="Brookside Schools" 
              className="h-12 w-auto md:h-14"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150x50?text=Brookside+Schools";
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={`relative font-medium transition-colors hover:text-[#e92327] ${
                  isActive(link.to) 
                    ? 'text-[#e92327]' 
                    : 'text-gray-800'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#e92327]"></span>
                )}
              </Link>
            ))}

            {/* Campuses Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                className={`flex items-center gap-1 font-medium transition-colors hover:text-[#e92327] ${
                  isCampusActive() 
                    ? 'text-[#e92327]' 
                    : 'text-gray-800'
                }`}
                onClick={() => setIsCampusesOpen(!isCampusesOpen)}
              >
                <span>Campuses</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCampusesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[220px] z-50 transition-all duration-200 overflow-hidden ${
                isCampusesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`}>
                {campusLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-3 transition-colors hover:bg-gray-50 border-l-4 ${
                      isActive(link.to) 
                        ? 'border-[#e92327] bg-red-50 text-[#e92327]' 
                        : 'border-transparent text-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/contact"
              className="bg-[#e92327] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#d11c20] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              Enquire Now
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
        isMenuOpen 
          ? 'opacity-100 visible' 
          : 'opacity-0 invisible pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="h-full overflow-y-auto">
            {/* Menu Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <img 
                  src="/assets/3.jpg"
                  alt="Brookside Schools" 
                  className="h-10 w-auto"
                />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+254 700 123 456</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@brooksideschools.com</span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.to)
                      ? 'bg-red-50 text-[#e92327] font-semibold'
                      : 'hover:bg-gray-100 text-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Campuses Dropdown */}
              <div className="space-y-1">
                <button
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                    isCampusActive()
                      ? 'bg-red-50 text-[#e92327] font-semibold'
                      : 'hover:bg-gray-100 text-gray-800'
                  }`}
                  onClick={() => setIsCampusesOpen(!isCampusesOpen)}
                >
                  <span>Campuses</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    isCampusesOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                
                <div className={`pl-6 space-y-1 overflow-hidden transition-all ${
                  isCampusesOpen ? 'max-h-60' : 'max-h-0'
                }`}>
                  {campusLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`block py-2.5 px-4 rounded-lg transition-colors ${
                        isActive(link.to)
                          ? 'text-[#e92327] font-medium'
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsCampusesOpen(false);
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Additional mobile-only links */}
              
            

              {/* Enquire Button */}
              <Link
                to="/contact"
                className="block mt-6 mx-4 bg-[#e92327] text-white py-3.5 px-4 rounded-lg font-semibold text-center hover:bg-[#d11c20] transition-colors shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Enquire Now
              </Link>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600 text-center">
                © {new Date().getFullYear()} Brookside Schools. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;