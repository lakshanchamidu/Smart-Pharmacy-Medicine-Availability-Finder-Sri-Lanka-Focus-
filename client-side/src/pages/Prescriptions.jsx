import { useState, useEffect } from 'react';
import { prescriptionService } from '../services/api';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [pharmacyId, setPharmacyId] = useState('');
  const [note, setNote] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const { data } = await prescriptionService.mine();
      setPrescriptions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!pharmacyId || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('pharmacyId', pharmacyId);
    formData.append('note', note);
    files.forEach((f) => formData.append('files', f));
    try {
      await prescriptionService.create(formData);
      setShowUpload(false);
      setPharmacyId('');
      setNote('');
      setFiles([]);
      fetchPrescriptions();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await prescriptionService.confirm(id);
      alert('Reservation created from prescription!');
      fetchPrescriptions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center"><div className="text-orange-600 text-xl">⏳ Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">💊 My Prescriptions</h1>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {showUpload ? '❌ Cancel' : '📤 Upload New'}
          </button>
        </div>

        {showUpload && (
          <form onSubmit={handleUpload} className="mb-8 cream-card-hover p-6">
            <h2 className="text-2xl font-semibold text-orange-700 mb-4">📋 Upload Prescription</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-2">🏥 Pharmacy ID</label>
                <input
                  type="text"
                  value={pharmacyId}
                  onChange={(e) => setPharmacyId(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-orange-300 rounded-lg text-gray-800 placeholder-orange-400 focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter pharmacy ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-2">📝 Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-orange-300 rounded-lg text-gray-800 placeholder-orange-400 focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
                  rows="3"
                  placeholder="Add any special instructions..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-2">📎 Files (1-3, jpg/png/pdf)</label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => setFiles([...e.target.files])}
                  className="w-full px-4 py-2 bg-white border border-orange-300 rounded-lg text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200 transition-all duration-200"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {uploading ? '⏳ Uploading...' : '📤 Upload Prescription'}
              </button>
            </div>
          </form>
        )}

        {prescriptions.length === 0 ? (
          <div className="text-center text-orange-600 py-8 text-lg">😔 No prescriptions yet</div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((p) => (
              <div key={p._id} className="cream-card-hover p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-orange-600 mb-2">🆔 Prescription ID: {p._id}</p>
                    <p className="font-semibold text-orange-800">Status: <span className="uppercase text-pink-600">{p.status}</span></p>
                    <p className="text-sm text-orange-700 mt-1">📎 Files: {p.files.length}</p>
                    {p.note && <p className="text-sm text-orange-700">📝 Note: {p.note}</p>}
                    {p.quote && (
                      <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
                        <p className="font-semibold text-green-800">💰 Quote: Rs. {p.quote.total}</p>
                        <p className="text-xs text-green-700 mt-1">⏰ Expires: {new Date(p.quote.reservationExpiresAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    {p.status === 'approved_with_quote' && (
                      <button
                        onClick={() => handleConfirm(p._id)}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        ✅ Confirm & Reserve
                      </button>
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
