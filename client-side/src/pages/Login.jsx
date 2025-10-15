import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      await login({ email, password });
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 px-4 animate-fade-in">
      <div className="max-w-md w-full animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-orange-700">Sign in to continue to Smart Pharmacy</p>
        </div>
        
        <div className="cream-card p-8">
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center gap-2 animate-slide-up">
              <span className="text-xl">✅</span>
              <span>{success}</span>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center gap-2 animate-slide-up">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-2 flex items-center gap-2">
                <span>📧</span> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-orange-300 rounded-lg text-gray-800 placeholder-orange-400 focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
              <p className="text-xs text-orange-600 mt-1">Enter your registered email address</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-2 flex items-center gap-2">
                <span>🔒</span> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-12 bg-white border border-orange-300 rounded-lg text-gray-800 placeholder-orange-400 focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500 hover:text-orange-700 transition-colors text-xl"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <p className="text-xs text-orange-600 mt-1">Must be at least 6 characters</p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>🔐</span> Sign In to Your Account
                </span>
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-orange-200">
            <p className="text-center text-orange-700 mb-4">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200 underline"
              >
                Create one now →
              </Link>
            </p>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-xs text-orange-800 mb-2 font-semibold">💡 Demo Accounts:</p>
              <div className="space-y-1 text-xs text-orange-700">
                <p>👤 Customer: customer@test.com / password</p>
                <p>🏥 Pharmacy: pharmacy@test.com / password</p>
                <p>⚙️ Admin: admin@test.com / password</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-orange-600 text-sm">
            🔒 Your data is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
