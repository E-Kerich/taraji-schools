import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-xl tracking-tight">
            Brookside Schools
          </h3>
          <p className="text-sm leading-relaxed">
            A Cambridge curriculum institution nurturing excellence from early
            years through primary education.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-block bg-[#e92327] text-white px-6 py-2 rounded font-medium hover:bg-[#d11c20] transition-colors"
            >
              Enquire Now
            </Link>
          </div>
        </div>

        {/* Campuses Section */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-lg border-l-4 border-[#fff200] pl-3">
            Campuses
          </h4>
          <ul className="space-y-3">
            <li>
              <Link 
                to="/campuses/westlands" 
                className="hover:text-[#fff200] transition-colors block"
              >
                Westlands Campus
              </Link>
            </li>
            <li>
              <Link 
                to="/campuses/redhill" 
                className="hover:text-[#fff200] transition-colors block"
              >
                Redhill Campus
              </Link>
            </li>
            <li className="pt-2">
              <Link 
                to="/campuses" 
                className="text-sm text-gray-400 hover:text-[#fff200] transition-colors"
              >
                View All Campuses →
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-lg border-l-4 border-[#fff200] pl-3">
            Quick Links
          </h4>
          <ul className="space-y-3">
            <li>
              <Link 
                to="/about" 
                className="hover:text-[#fff200] transition-colors block"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                to="/admissions" 
                className="hover:text-[#fff200] transition-colors block"
              >
                Admissions
              </Link>
            </li>
            <li>
              <Link 
                to="/academics" 
                className="hover:text-[#fff200] transition-colors block"
              >
                Academics
              </Link>
            </li>
            <li>
              <Link 
                to="/news" 
                className="hover:text-[#fff200] transition-colors block"
              >
                News & Events
              </Link>
            </li>
            <li>
              <Link 
                to="/careers" 
                className="hover:text-[#fff200] transition-colors block"
              >
                Careers
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-lg border-l-4 border-[#fff200] pl-3">
            Contact
          </h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-white mb-1">Email</p>
              <a 
                href="mailto:info@brooksideschools.com" 
                className="text-sm hover:text-[#fff200] transition-colors"
              >
                info@brooksideschools.com
              </a>
            </div>
            
            <div>
              <p className="text-sm font-medium text-white mb-1">Phone</p>
              <a 
                href="tel:+254719786001" 
                className="text-sm hover:text-[#fff200] transition-colors"
              >
                +254 719 786 001
              </a>
            </div>
            
            <div>
              <p className="text-sm font-medium text-white mb-1">Address</p>
              <p className="text-sm">
                Brookside Drive<br />
                Nairobi, Kenya
              </p>
            </div>
            
            <div className="pt-2">
              <Link 
                to="/contact" 
                className="inline-flex items-center text-sm text-gray-400 hover:text-[#fff200] transition-colors"
              >
                <span>Visit Contact Page</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            © {currentYear} Brookside Schools. All rights reserved.
          </div>
          
          <div className="flex space-x-6">
            <Link 
              to="/privacy" 
              className="text-sm text-gray-400 hover:text-[#fff200] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="text-sm text-gray-400 hover:text-[#fff200] transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              to="/sitemap" 
              className="text-sm text-gray-400 hover:text-[#fff200] transition-colors"
            >
              Sitemap
            </Link>
          </div>
          
          <div className="text-sm text-gray-400">
            Part of the Brookside Education Group
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;