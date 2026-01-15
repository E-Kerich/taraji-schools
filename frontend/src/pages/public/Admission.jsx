import { useEffect } from 'react';
import InquiryForm from '../../components/common/InquiryForm';
import { CheckCircle, ArrowRight } from 'lucide-react';

const Admissions = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
  // Brand colors
  const colors = {
    red: '#e92327',
    dark: '#1a1a1a'
  };

  return (
    <section className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="text-center">
          <div className="inline-block mb-6">
            <div className="w-1 h-12 mx-auto rounded-full" style={{ backgroundColor: colors.red }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Admissions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Begin your child's journey to exceptional British international education.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Content */}
          <div className="space-y-12">
            {/* Simple Steps */}
            <div className="space-y-8">
              <h2 className="text-2xl font-light text-gray-900">
                Simple Process
              </h2>
              
              <div className="space-y-6">
                {[
                  { step: "01", title: "Inquiry", desc: "Submit your interest online" },
                  { step: "02", title: "Tour", desc: "Visit our campus" },
                  { step: "03", title: "Assessment", desc: "Age-appropriate placement" },
                  { step: "04", title: "Enrollment", desc: "Join our community" }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-6 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center 
                                   transition-colors duration-300 group-hover:opacity-90"
                           style={{ backgroundColor: colors.red }}>
                        <span className="text-white text-sm font-medium">{item.step}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-normal text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-normal text-gray-900 mb-6">
                Required Documents
              </h3>
              <div className="space-y-3">
                {[
                  "Birth Certificate",
                  "Previous School Records",
                  "Passport-sized Photos",
                  "Medical Records"
                ].map((doc, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4" style={{ color: colors.red }} />
                    <span className="text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-normal text-gray-900 mb-6">
                Contact Admissions
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Phone</p>
                  <a 
                    href="tel:+254719786001"
                    className="text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    +254 719 786 001
                  </a>
                </div>
                <div>

                  <p className="text-gray-600 text-sm mb-1">Email</p>
                  <a 
                    href="mailto:admissions@brooksideschools.com"
                    className="text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    admissions@brooksideschools.com
                  </a>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="relative">
            <div className="sticky top-8">
              {/* Form Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Submit Inquiry
                </h2>
                <p className="text-gray-600">
                  Complete the form below to begin the admissions process. 
                  Our team will contact you within 24 hours.
                </p>
              </div>

              {/* Form Container */}
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <InquiryForm />
              </div>

              {/* Note */}
              <div className="mt-6 flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <ArrowRight className="w-4 h-4" style={{ color: colors.red }} />
                </div>
                <p className="text-sm text-gray-600">
                  Applications are accepted year-round. Early submission is recommended 
                  for preferred placement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admissions;