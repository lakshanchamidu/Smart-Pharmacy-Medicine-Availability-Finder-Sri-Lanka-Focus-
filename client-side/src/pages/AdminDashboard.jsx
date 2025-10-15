import { useState, useEffect } from 'react';
import { pharmacyService, medicineService } from '../services/api';
import axios from 'axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, pharmacies: 0, medicines: 0, pendingPharmacies: 0 });
  const [pharmacies, setPharmacies] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    genericName: '',
    brand: '',
    dosageForm: '',
    strength: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [pharmaData, medData] = await Promise.all([
        pharmacyService.list(),
        medicineService.list()
      ]);

      setPharmacies(pharmaData);
      setMedicines(medData);

      const pendingCount = pharmaData.filter(p => !p.verified).length;
      
      setStats({
        users: 0,
        pharmacies: pharmaData.length,
        medicines: medData.length,
        pendingPharmacies: pendingCount
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPharmacy = async (pharmacyId, verify) => {
    try {
      await axios.patch(`/api/pharmacies/${pharmacyId}`, { verified: verify });
      loadDashboardData();
    } catch (error) {
      alert('Error updating pharmacy: ' + error.message);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      await medicineService.create(newMedicine);
      setNewMedicine({ name: '', genericName: '', brand: '', dosageForm: '', strength: '' });
      setShowAddMedicine(false);
      loadDashboardData();
    } catch (error) {
      alert('Error adding medicine: ' + error.message);
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    try {
      await axios.delete(`/api/medicines/${medicineId}`);
      loadDashboardData();
    } catch (error) {
      alert('Error deleting medicine: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="flex items-center gap-3 text-orange-600">
          <span className="animate-spin text-3xl">⏳</span>
          <span className="text-xl">Loading admin panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            ⚙️ Admin Dashboard
          </h1>
          <p className="text-orange-700 mt-2 text-lg">Manage system resources and users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="cream-card-hover p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 gradient-royal rounded-lg p-3 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-pink-600 truncate">Total Users</dt>
                  <dd className="text-4xl font-bold text-pink-700 drop-shadow-lg">{stats.users}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="cream-card-hover p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 gradient-forest rounded-lg p-3 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-orange-600 truncate">Pharmacies</dt>
                  <dd className="text-4xl font-bold text-orange-700 drop-shadow-lg">{stats.pharmacies}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="cream-card-hover p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 gradient-ocean rounded-lg p-3 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-orange-600 truncate">Medicines</dt>
                  <dd className="text-4xl font-bold text-orange-700 drop-shadow-lg">{stats.medicines}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="cream-card-hover p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 gradient-sunset rounded-lg p-3 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-orange-600 truncate">Pending Approvals</dt>
                  <dd className="text-4xl font-bold text-orange-700 drop-shadow-lg">{stats.pendingPharmacies}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="cream-card mb-6">
          <div className="border-b border-orange-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('pharmacies')}
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'pharmacies' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Pharmacy Management
              </button>
              <button
                onClick={() => setActiveTab('medicines')}
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'medicines' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Medicine Database
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">System Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Recent Activity</h3>
                    <p className="text-sm text-gray-600">System is running smoothly</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Platform Health</h3>
                    <p className="text-sm text-gray-600">All services operational</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pharmacies' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Pharmacy Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pharmacies.map((pharmacy) => (
                        <tr key={pharmacy._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{pharmacy.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{pharmacy.address}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pharmacy.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pharmacy.licenseNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {pharmacy.verified ? (
                              <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                                Verified
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {!pharmacy.verified && (
                              <button
                                onClick={() => handleVerifyPharmacy(pharmacy._id, true)}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                Verify
                              </button>
                            )}
                            {pharmacy.verified && (
                              <button
                                onClick={() => handleVerifyPharmacy(pharmacy._id, false)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'medicines' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Medicine Database</h2>
                  <button
                    onClick={() => setShowAddMedicine(!showAddMedicine)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    + Add Medicine
                  </button>
                </div>

                {showAddMedicine && (
                  <form onSubmit={handleAddMedicine} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                        <input
                          type="text"
                          value={newMedicine.name}
                          onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
                        <input
                          type="text"
                          value={newMedicine.genericName}
                          onChange={(e) => setNewMedicine({ ...newMedicine, genericName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                        <input
                          type="text"
                          value={newMedicine.brand}
                          onChange={(e) => setNewMedicine({ ...newMedicine, brand: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form</label>
                        <input
                          type="text"
                          value={newMedicine.dosageForm}
                          onChange={(e) => setNewMedicine({ ...newMedicine, dosageForm: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Tablet, Capsule, Syrup..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
                        <input
                          type="text"
                          value={newMedicine.strength}
                          onChange={(e) => setNewMedicine({ ...newMedicine, strength: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="500mg, 10ml..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Add Medicine
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddMedicine(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generic Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manufacturer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strength</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {medicines.map((medicine) => (
                        <tr key={medicine._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {medicine.genericName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {medicine.brand || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {medicine.dosageForm || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {medicine.strength || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteMedicine(medicine._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
