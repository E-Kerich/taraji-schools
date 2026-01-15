import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2, Send, User, Mail, Calendar, BookOpen, MapPin } from 'lucide-react';

const InquiryForm = ({ selectedCampus = 'both' }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Brand colors
  const colors = {
    red: '#e92327',
    yellow: '#fff200',
    dark: '#1a1a1a',
    light: '#f8f9fa'
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    // If selectedCampus is passed from parent, use it
    if (selectedCampus !== 'both' && !formData.campus) {
      formData.campus = selectedCampus;
    }

    try {
      await api.post('/inquiries', formData);
      setSuccess('Your inquiry has been submitted successfully! Our admissions team will contact you within 24 hours.');
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Success Message */}
      {success && (
        <div className="p-4 rounded-xl border-2 border-green-500 bg-green-50">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">{success}</p>
              <p className="text-sm text-green-600 mt-1">
                A confirmation email has been sent to your provided email address.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl border-2 border-red-500 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">{error}</p>
              <p className="text-sm text-red-600 mt-1">
                You can also contact admissions directly at +254 719 786 001
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Parent Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Parent / Guardian Name *
          </label>
          <input
            {...register('parentName', { 
              required: 'Parent name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            })}
            placeholder="Enter full name"
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300
                      ${errors.parentName 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-red-500 focus:ring-red-100'}
                      focus:outline-none focus:ring-2`}
          />
          {errors.parentName && (
            <p className="mt-1 text-sm text-red-600">{errors.parentName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address *
          </label>
          <input
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            placeholder="your.email@example.com"
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300
                      ${errors.email 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-red-500 focus:ring-red-100'}
                      focus:outline-none focus:ring-2`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9+\-\s()]*$/,
                  message: 'Invalid phone number'
                }
              })}
              placeholder="+254 7XX XXX XXX"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300
                        ${errors.phone 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-red-500 focus:ring-red-100'}
                        focus:outline-none focus:ring-2`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Child's Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Child's Age *
            </label>
            <input
              {...register('childAge', { 
                required: 'Child age is required',
                min: { value: 2, message: 'Minimum age is 2 years' },
                max: { value: 18, message: 'Maximum age is 18 years' }
              })}
              type="number"
              min="2"
              max="18"
              placeholder="Age in years"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300
                        ${errors.childAge 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-red-500 focus:ring-red-100'}
                        focus:outline-none focus:ring-2`}
            />
            {errors.childAge && (
              <p className="mt-1 text-sm text-red-600">{errors.childAge.message}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Year Applying For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Year Applying For *
            </label>
            <select
              {...register('yearApplying', { required: 'Please select a year' })}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300
                        ${errors.yearApplying 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-red-500 focus:ring-red-100'}
                        focus:outline-none focus:ring-2 bg-white`}
            >
              <option value="">Select Year</option>
              <option value="Montessori (0-6 years)">Montessori (0-6 years)</option>
              <option value="Year 1">Year 1 (5-6 years)</option>
              <option value="Year 2">Year 2 (6-7 years)</option>
              <option value="Year 3">Year 3 (7-8 years)</option>
              <option value="Year 4">Year 4 (8-9 years)</option>
              <option value="Year 5">Year 5 (9-10 years)</option>
              <option value="Year 6">Year 6 (10-11 years)</option>
              <option value="Year 7">Year 7 (11-12 years)</option>
              <option value="Year 8">Year 8 (12-13 years)</option>
              <option value="Year 9">Year 9 (13-14 years)</option>
              <option value="Year 10">Year 10 (14-15 years)</option>
              <option value="Year 11">Year 11 (15-16 years)</option>
              <option value="Year 12">Year 12 (16-17 years)</option>
              <option value="Year 13">Year 13 (17-18 years)</option>
            </select>
            {errors.yearApplying && (
              <p className="mt-1 text-sm text-red-600">{errors.yearApplying.message}</p>
            )}
          </div>

          {/* Campus Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Preferred Campus *
            </label>
            <select
              {...register('campus', { required: 'Please select a campus' })}
              defaultValue={selectedCampus !== 'both' ? selectedCampus : ''}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300
                        ${errors.campus 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-red-500 focus:ring-red-100'}
                        focus:outline-none focus:ring-2 bg-white`}
            >
              <option value="">Select Campus</option>
              <option value="westlands">Westlands Campus</option>
              <option value="redhill">Redhill Campus</option>
              <option value="both">Both Campuses</option>
            </select>
            {errors.campus && (
              <p className="mt-1 text-sm text-red-600">{errors.campus.message}</p>
            )}
          </div>
        </div>

        {/* Additional Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Information (Optional)
          </label>
          <textarea
            {...register('message')}
            rows="3"
            placeholder="Any specific questions, concerns, or information you'd like to share..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 
                     focus:ring-2 focus:ring-red-100 transition-all duration-300 focus:outline-none"
          />
        </div>

        {/* How did you hear about us */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How did you hear about Brookside?
          </label>
          <select
            {...register('source')}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 
                     focus:ring-2 focus:ring-red-100 transition-all duration-300 focus:outline-none bg-white"
          >
            <option value="">Select an option</option>
            <option value="word_of_mouth">Word of Mouth</option>
            <option value="social_media">Social Media</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="event">School Event</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="group w-full px-6 py-4 rounded-xl font-semibold transition-all duration-300 
                 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed
                 disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-3"
        style={{ 
          backgroundColor: colors.red,
          color: 'white'
        }}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Submitting Inquiry...</span>
          </>
        ) : (
          <>
            <span>Submit Inquiry</span>
            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      {/* Privacy Note */}
      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree to our Privacy Policy. 
        We will never share your information with third parties.
      </p>
    </form>
  );
};

export default InquiryForm;