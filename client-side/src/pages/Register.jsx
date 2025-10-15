import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    role: 'customer',
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.name || formData.name.length < 3) {
      setError('Name must be at least 3 characters long');
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.phone && !/^[0-9+\s-()]+$/.test(formData.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await register(formData);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 px-4 py-8 animate-fade-in">
      <div className="max-w-md w-full animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent mb-2">
            Create Account
          </h2>
          <p className="text-rose-700">Join Smart Pharmacy today</p>
        </div>
        
        <div className="cream-card p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center gap-2 animate-fade-in">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center gap-2 animate-fade-in">
              <span className="text-xl">✅</span>
              <span>{success}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-2">
                👤 I am a
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-rose-300 rounded-lg text-gray-800 placeholder-rose-400 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 cursor-pointer"
                required
              >
                <option value="customer">🛒 Customer - Search and reserve medicines</option>
                <option value="pharmacy">🏥 Pharmacy Owner - Manage inventory and prescriptions</option>
              </select>
              <p className="mt-1 text-xs text-rose-600">Select your account type</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-2">
                📝 Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-rose-300 rounded-lg text-gray-800 placeholder-rose-400 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200"
                placeholder="John Doe"
                autoComplete="name"
                required
              />
              <p className="mt-1 text-xs text-rose-600">Enter your full name as it appears on documents</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-2">
                ✉️ Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-rose-300 rounded-lg text-gray-800 placeholder-rose-400 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200"
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
              <p className="mt-1 text-xs text-rose-600">We'll use this for your account login</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-2">
                📱 Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-rose-300 rounded-lg text-gray-800 placeholder-rose-400 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200"
                placeholder="+94 77 123 4567"
                autoComplete="tel"
              />
              <p className="mt-1 text-xs text-rose-600">Sri Lankan format: +94 XX XXX XXXX (for pharmacy verification)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-rose-800 mb-2">
                🔒 Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-12 bg-white border border-rose-300 rounded-lg text-gray-800 placeholder-rose-400 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500 hover:text-rose-600 text-xl"
                  tabIndex={-1}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
              <p className="mt-1 text-xs text-rose-600">Must be at least 6 characters long</p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Creating Account...
                </span>
              ) : (
                '✨ Create Your Account'
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-rose-200">
            <p className="text-rose-700 text-center">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200"
              >
                Sign in here →
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center text-xs text-rose-600 flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>Your personal information is secure and encrypted</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-rose-700 text-sm">
            By creating an account, you agree to our{' '}
            <span className="text-pink-600 font-medium hover:text-pink-700 cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-pink-600 font-medium hover:text-pink-700 cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
