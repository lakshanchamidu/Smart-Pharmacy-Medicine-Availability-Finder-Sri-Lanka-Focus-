import { useState, useEffect } from 'react';
import { reservationService } from '../services/api';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data } = await reservationService.mine();
      setReservations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await reservationService.cancel(id);
      fetchReservations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const handleConfirm = async (id) => {
    try {
      await reservationService.confirm(id);
      fetchReservations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm');
    }
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center"><div className="text-orange-600 text-xl">⏳ Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-6">📋 My Reservations</h1>
        {reservations.length === 0 ? (
          <div className="text-center text-orange-600 py-8 text-lg">😔 No reservations yet</div>
        ) : (
          <div className="space-y-4">
            {reservations.map((r) => (
              <div key={r._id} className="cream-card-hover p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-orange-600 mb-2">🆔 Reservation ID: {r._id}</p>
                    <p className="font-semibold text-orange-800">Status: <span className={`uppercase ${r.status === 'pending' ? 'text-orange-600' : r.status === 'confirmed' ? 'text-green-600' : 'text-red-600'}`}>{r.status}</span></p>
                    <p className="text-sm text-orange-700 mt-1">📦 Items: {r.items.length}</p>
                    <p className="text-sm text-orange-700">⏰ Expires: {new Date(r.expiresAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    {r.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleConfirm(r._id)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          ✅ Confirm
                        </button>
                        <button
                          onClick={() => handleCancel(r._id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                        >
                          ❌ Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
