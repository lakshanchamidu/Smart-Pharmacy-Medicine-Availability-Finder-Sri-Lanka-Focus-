import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { reservationService, prescriptionService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ reservations: 0, prescriptions: 0, pending: 0 });
  const [recentReservations, setRecentReservations] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [reservations, prescriptions] = await Promise.all([
        reservationService.mine(),
        prescriptionService.mine()
      ]);

      setRecentReservations(reservations.slice(0, 5));
      setRecentPrescriptions(prescriptions.slice(0, 5));

      setStats({
        reservations: reservations.length,
        prescriptions: prescriptions.length,
        pending: reservations.filter(r => r.status === 'pending').length
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
      confirmed: 'bg-green-900/30 text-green-400 border-green-700',
      cancelled: 'bg-red-900/30 text-red-400 border-red-700',
      completed: 'bg-blue-900/30 text-blue-400 border-blue-700',
      submitted: 'bg-blue-900/30 text-blue-400 border-blue-700',
      under_review: 'bg-purple-900/30 text-purple-400 border-purple-700',
      approved_with_quote: 'bg-green-900/30 text-green-400 border-green-700',
      rejected: 'bg-red-900/30 text-red-400 border-red-700'
    };
    return colors[status] || 'bg-gray-900/30 text-gray-400 border-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="flex items-center gap-3 text-orange-600">
          <span className="animate-spin text-3xl">⏳</span>
          <span className="text-xl">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-orange-700 mt-2 text-lg">Manage your medicine reservations and prescriptions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="cream-card-hover p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 gradient-rose-cream rounded-lg p-3 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-orange-600 truncate">Total Reservations</dt>
                  <dd className="text-4xl font-bold text-orange-700 drop-shadow-lg">{stats.reservations}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="cream-card-hover p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 gradient-pink-peach rounded-lg p-3 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-pink-600 truncate">Prescriptions</dt>
                  <dd className="text-4xl font-bold text-pink-700 drop-shadow-lg">{stats.prescriptions}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="cream-card-hover p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 gradient-royal rounded-lg p-3 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-orange-600 truncate">Pending Orders</dt>
                  <dd className="text-4xl font-bold text-orange-700 drop-shadow-lg">{stats.pending}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <button
            onClick={() => navigate('/search')}
            className="gradient-royal py-5 text-xl font-bold shadow-2xl hover:scale-105 hover:shadow-rose-500/50 transition-all duration-300 rounded-xl text-white"
          >
            🔍 Search for Medicines Near You
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="cream-card">
            <div className="px-6 py-4 border-b border-orange-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-orange-800">📋 Recent Reservations</h2>
              <button
                onClick={() => navigate('/reservations')}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors duration-200"
              >
                View All →
              </button>
            </div>
            <div className="divide-y divide-rose-100">
              {recentReservations.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-orange-700 text-lg mb-4">No reservations yet 📦</p>
                  <p className="text-rose-500">Start by searching for medicines!</p>
                </div>
              ) : (
                recentReservations.map((reservation) => (
                  <div key={reservation._id} className="px-6 py-4 hover:bg-orange-50 transition-colors duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-rose-900 text-lg">
                          {reservation.items?.length || 0} item(s)
                        </p>
                        <p className="text-sm text-orange-600">
                          {new Date(reservation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </div>
                    <p className="text-sm text-pink-600 font-medium">
                      Total: Rs. {reservation.totalAmount?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="cream-card">
            <div className="px-6 py-4 border-b border-orange-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-orange-800">📄 Recent Prescriptions</h2>
              <button
                onClick={() => navigate('/prescriptions')}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors duration-200"
              >
                View All →
              </button>
            </div>
            <div className="divide-y divide-rose-100">
              {recentPrescriptions.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-orange-700 text-lg mb-4">No prescriptions yet 📄</p>
                  <p className="text-rose-500">Upload your prescription to get started</p>
                </div>
              ) : (
                recentPrescriptions.map((prescription) => (
                  <div key={prescription._id} className="px-6 py-4 hover:bg-orange-50 transition-colors duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-rose-900 text-lg">
                          {prescription.files?.length || 0} file(s)
                        </p>
                        <p className="text-sm text-orange-600">
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(prescription.status)}`}>
                        {prescription.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {prescription.note && (
                      <p className="text-sm text-orange-600 truncate">{prescription.note}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
