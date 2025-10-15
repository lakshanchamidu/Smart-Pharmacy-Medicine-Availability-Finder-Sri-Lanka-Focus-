import { useState, useEffect } from 'react';
import { searchService, pharmacyService } from '../services/api';
import { Link } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [pharmacies, setPharmacies] = useState({});
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 6.9271, lng: 79.8612 })
      );
    } else {
      setLocation({ lat: 6.9271, lng: 79.8612 });
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || !location) return;
    setLoading(true);
    try {
      const { data } = await searchService.availability({
        q: query,
        lat: location.lat,
        lng: location.lng,
        radius: 5
      });
      setResults(data);
      const uniquePharmacyIds = [...new Set(data.map((r) => r.pharmacyId))];
      const pharms = {};
      await Promise.all(
        uniquePharmacyIds.map(async (id) => {
          const { data: p } = await pharmacyService.get(id);
          pharms[id] = p;
        })
      );
      setPharmacies(pharms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-6">🔍 Search Medicines</h1>
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a medicine (e.g., Paracetamol)"
            className="flex-1 px-4 py-3 bg-white border border-rose-300 rounded-lg text-gray-800 placeholder-orange-400 focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200"
          />
          <button
            type="submit"
            disabled={loading || !location}
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? '⏳ Searching...' : '🔍 Search'}
          </button>
        </form>

        {!location && (
          <div className="p-4 bg-orange-100 border border-orange-300 text-orange-800 rounded-lg mb-4 flex items-center gap-2">
            <span className="text-xl">📍</span>
            <span>Getting your location...</span>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-orange-700">✨ Available at {Object.keys(pharmacies).length} pharmacies</h2>
            {results.map((result, idx) => {
              const pharmacy = pharmacies[result.pharmacyId];
              return (
                <div key={idx} className="cream-card-hover p-6 transition-all duration-200">
                  <h3 className="text-xl font-bold text-orange-600">🏥 {pharmacy?.name || 'Loading...'}</h3>
                  <p className="text-sm text-orange-700 mt-1">📍 {pharmacy?.address}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-pink-600">Rs. {result.price}</span>
                      <span className="ml-4 text-sm text-orange-600">📦 Stock: {result.stock}</span>
                    </div>
                    <Link
                      to={`/reserve/${result.pharmacyId}/${result.medicineId}`}
                      className="px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      🛒 Reserve Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {results.length === 0 && !loading && query && (
          <div className="text-center text-orange-600 py-8 text-lg">😔 No results found</div>
        )}
      </div>
    </div>
  );
}
