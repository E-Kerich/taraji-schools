import { useState } from 'react';
import api from '../../services/api';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    campus: 'westlands',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/contact', formData);
      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        campus: 'westlands',
        message: ''
      });
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const campuses = [
    {
      id: 'westlands',
      name: 'Westlands Campus',
      address: 'Brookside Drive, Westlands, Nairobi',
      phone: '+254 20 123 4567',
      email: 'westlands@brookside.ac.ke',
      hours: 'Mon-Fri: 7:30 AM - 5:00 PM\nSaturday: 8:00 AM - 1:00 PM',
      mapUrl: 'https://maps.google.com/?q=Brookside+Westlands+Nairobi'
    },
    {
      id: 'redhill',
      name: 'Redhill Campus',
      address: 'Redhill Road, Off Limuru Road, Nairobi',
      phone: '+254 20 765 4321',
      email: 'redhill@brookside.ac.ke',
      hours: 'Mon-Fri: 7:30 AM - 5:00 PM\nSaturday: 8:00 AM - 1:00 PM',
      mapUrl: 'https://maps.google.com/?q=Brookside+Redhill+Nairobi'
    }
  ];

  return (
    <section className="min-h-screen py-8 md:py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-8 rounded-full bg-red-600" />
            <span className="text-sm font-semibold uppercase tracking-wider text-red-600">
              Get In Touch
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Contact <span className="text-red-600">Brookside</span>
          </h1>
          <p className="text-lg text-gray-600">
            Have questions? We're here to help. Reach out to our campuses or send us a message.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Campuses</h2>
            
            <div className="space-y-8">
              {campuses.map((campus) => (
                <div key={campus.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <MapPin className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{campus.name}</h3>
                      <p className="text-gray-600 mt-1">{campus.address}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <a 
                        href={`tel:${campus.phone}`}
                        className="text-gray-700 hover:text-red-600 transition-colors"
                      >
                        {campus.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <a 
                        href={`mailto:${campus.email}`}
                        className="text-gray-700 hover:text-red-600 transition-colors"
                      >
                        {campus.email}
                      </a>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="text-gray-700 whitespace-pre-line">{campus.hours}</div>
                    </div>
                  </div>

                  <a
                    href={campus.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 text-red-600 font-medium hover:text-red-700 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    View on Map
                  </a>
                </div>
              ))}
            </div>

            {/* Emergency Contact */}
            
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Message sent successfully!</p>
                      <p className="text-sm text-green-700 mt-1">
                        Thank you for contacting us. We'll respond within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">Error sending message</p>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="+254 700 000 000"
                    />
                  </div>

                  <div>
                    <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-2">
                      Campus *
                    </label>
                    <select
                      id="campus"
                      name="campus"
                      value={formData.campus}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="westlands">Westlands Campus</option>
                      <option value="redhill">Redhill Campus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    * Required fields
                  </p>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-3 text-sm bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 text-sm" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Time</h3>
                <p className="text-gray-600">
                  We typically respond to all inquiries within 24-48 hours during business days.
                  For urgent matters, please call the campus directly.
                </p>
              </div>
            </div>
        </div>
         
         
        </div>
      </div>
    </section>
  );
};

export default ContactPage;