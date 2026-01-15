import { useState } from 'react';
import { MessageCircle, Mail, Phone, X, ChevronDown } from 'lucide-react';

const FloatingContactModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Brand colors
  const colors = {
    red: '#e92327',
    yellow: '#fff200',
    dark: '#1a1a1a',
    light: '#f8f9fa'
  };

  // Contact information
  const contacts = {
    whatsapp: {
      number: '+254748786001',
      message: 'Hello Brookside International School, I would like to get more information.',
      link: `https://wa.me/254748786001?text=${encodeURIComponent('Hello Brookside International School, I would like to get more information.')}`
    },
    phone: '+254719786001',
    email: 'admin@brooksideschools.com'
  };

  const handleCall = () => {
    window.location.href = `tel:${contacts.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${contacts.email}?subject=Inquiry from Brookside International School Website`;
  };

  const handleWhatsApp = () => {
    window.open(contacts.whatsapp.link, '_blank');
  };

  // If minimized, show just the trigger button
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="group flex items-center justify-center w-14 h-14 rounded-full shadow-2xl 
                   transition-all duration-300 hover:shadow-xl hover:scale-110"
          style={{ backgroundColor: colors.red }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs font-bold" style={{ color: colors.red }}>3</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main Modal */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300
                   ${isOpen ? 'w-80' : 'w-14 h-14'}`}
                   style={{
                    boxShadow: `0 10px 40px ${colors.red}20`
                  }}
      >
        {/* Header/Trigger */}
        <div 
          className={`flex items-center justify-between p-4 cursor-pointer transition-colors
                     ${isOpen ? '' : 'hover:opacity-90'}`}
          onClick={() => !isOpen && setIsOpen(true)}
          style={{ backgroundColor: colors.red }}
        >
          {isOpen ? (
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">Contact Us</span>
            </div>
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
            )}

          
          {isOpen && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {isOpen && (
          <div className="p-5">
            <div className="space-y-4">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="group w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 
                         hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center 
                              group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                  <p className="text-sm text-gray-600">{contacts.whatsapp.number}</p>
                  <p className="text-xs text-gray-500 mt-1">Quick response via chat</p>
                </div>
              </button>

              {/* Phone Call */}
              <button
                onClick={handleCall}
                className="group w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 
                         hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center 
                              group-hover:scale-110 transition-transform"
                     style={{ backgroundColor: colors.red }}>
                  <Phone className="w-6 h-6 text-white" />
                </div>
                
                  <div className="text-left ">
                    <h4 className="font-semibold text-gray-900">Call Us</h4>
                    <p className="text-sm text-gray-600">{contacts.phone}</p>
                    <p className="text-xs text-gray-500 mt-1">Mon-Fri, 8AM-5PM</p>
                  </div>
                
              </button>

              {/* Email */}
              <button
                onClick={handleEmail}
                className="group w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 
                         hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center 
                              group-hover:scale-110 transition-transform"
                     style={{ backgroundColor: colors.yellow }}>
                  <Mail className="w-6 h-6 text-gray-800" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">Email Us</h4>
                  <p className="text-sm text-gray-600 truncate">{contacts.email}</p>
                  <p className="text-xs text-gray-500 mt-1">24/7 response</p>
                </div>
              </button>
            </div>

            {/* Footer Note */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                We typically respond within 1 business hour
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default FloatingContactModal;