import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-orange-200 shadow-lg shadow-rose-100/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl">💊</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
            Smart Pharmacy
          </span>
        </Link>
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-orange-700 hover:text-pink-600 font-medium transition-colors duration-200"
              >
                🏠 Dashboard
              </Link>
              
              {user.role === 'customer' && (
                <>
                  <Link 
                    to="/search" 
                    className="text-orange-700 hover:text-pink-600 transition-colors duration-200"
                  >
                    🔍 Search
                  </Link>
                  <Link 
                    to="/reservations" 
                    className="text-orange-700 hover:text-pink-600 transition-colors duration-200"
                  >
                    📋 Reservations
                  </Link>
                  <Link 
                    to="/prescriptions" 
                    className="text-orange-700 hover:text-pink-600 transition-colors duration-200"
                  >
                    📄 Prescriptions
                  </Link>
                </>
              )}
              
              {user.role === 'pharmacy' && (
                <>
                  <Link 
                    to="/pharmacy/dashboard" 
                    className="text-orange-700 hover:text-pink-600 transition-colors duration-200"
                  >
                    🏥 Manage Pharmacy
                  </Link>
                </>
              )}
              
              {user.role === 'admin' && (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    className="text-orange-700 hover:text-pink-600 transition-colors duration-200"
                  >
                    ⚙️ Admin Panel
                  </Link>
                </>
              )}
              
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-orange-200">
                <span className="text-sm text-rose-800 font-medium">
                  {user.name}
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg">
                  {user.role.toUpperCase()}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  🚪 Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-5 py-2 text-rose-600 hover:text-pink-600 font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-lg hover:from-orange-500 hover:to-red-500 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
