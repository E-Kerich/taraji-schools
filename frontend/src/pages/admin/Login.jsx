import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await login(data);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center py-10">
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your admin account</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl p-8 space-y-6 shadow-xl border border-gray-100"
        >
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              placeholder="you@company.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e92327] focus:border-transparent transition-all duration-200"
            />
            {errors.email && (
              <p className="text-sm text-[#e92327] mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <button type="button" className="text-sm text-[#e92327] hover:text-red-700 transition-colors font-medium">
                Forgot password?
              </button>
            </div>
            <input 
              {...register('password', { required: 'Password is required' })}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e92327] focus:border-transparent transition-all duration-200"
            />
            {errors.password && (
              <p className="text-sm text-[#e92327] mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#e92327] focus:ring-[#e92327] border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
              Remember this device
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#000000] text-white font-semibold rounded-xl hover:bg-gray-900 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl group"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>

          

          
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <button className="text-[#000000] hover:text-gray-800 font-semibold transition-colors flex items-center justify-center mx-auto gap-1">
              Request access
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </p>
          <p className="text-gray-400 text-xs mt-4">
            Protected by reCAPTCHA. <span className="text-[#e92327]">Privacy</span> · <span className="text-[#000000]">Terms</span>
          </p>
        </div>

        {/* Decorative Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#fff200]/10 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#e92327]/10 to-transparent rounded-full blur-3xl -z-10"></div>
      </div>
    </div>
  );
};

export default Login;