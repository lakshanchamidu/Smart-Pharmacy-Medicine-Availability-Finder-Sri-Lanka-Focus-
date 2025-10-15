import { useState, useEffect } from 'react';
import { pharmacyService, inventoryService, prescriptionService, medicineService } from '../services/api';

export default function PharmacyDashboard() {
  const [pharmacy, setPharmacy] = useState(null);
  const [stats, setStats] = useState({ inventory: 0, prescriptions: 0, lowStock: 0 });
  const [inventory, setInventory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [newInventory, setNewInventory] = useState({ medicineId: '', stock: '', price: '' });
  const [quoteData, setQuoteData] = useState({ amount: '', note: '' });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const myPharmacies = await pharmacyService.mine();
      if (myPharmacies.length > 0) {
        const pharma = myPharmacies[0];
        setPharmacy(pharma);
        
        const [invData, presData, medData] = await Promise.all([
          inventoryService.getByPharmacy(pharma._id),
          prescriptionService.forPharmacy(pharma._id),
          medicineService.list()
        ]);

        setInventory(invData);
        setPrescriptions(presData);
        setMedicines(medData);

        const lowStockCount = invData.filter(item => item.stock < 10).length;
        setStats({
          inventory: invData.length,
          prescriptions: presData.filter(p => p.status === 'under_review').length,
          lowStock: lowStockCount
        });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      await inventoryService.upsert(pharmacy._id, {
        medicineId: newInventory.medicineId,
        stockDelta: parseInt(newInventory.stock),
        price: parseFloat(newInventory.price)
      });
      setNewInventory({ medicineId: '', stock: '', price: '' });
      setShowAddInventory(false);
      loadDashboardData();
    } catch (error) {
      alert('Error adding inventory: ' + error.message);
    }
  };

  const handleUpdateStock = async (medicineId, stockDelta) => {
    try {
      await inventoryService.upsert(pharmacy._id, { medicineId, stockDelta });
      loadDashboardData();
    } catch (error) {
      alert('Error updating stock: ' + error.message);
    }
  };

  const handlePrescriptionDecision = async (prescriptionId, approve) => {
    try {
      if (approve) {
        await prescriptionService.decision(prescriptionId, {
          approve: true,
          quote: {
            amount: parseFloat(quoteData.amount),
            note: quoteData.note
          }
        });
      } else {
        await prescriptionService.decision(prescriptionId, {
          approve: false,
          rejectionReason: quoteData.note || 'Not available'
        });
      }
      setSelectedPrescription(null);
      setQuoteData({ amount: '', note: '' });
      loadDashboardData();
    } catch (error) {
      alert('Error processing prescription: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex items-center gap-3 text-blue-400">
          <span className="animate-spin text-3xl">⏳</span>
          <span className="text-xl">Loading your pharmacy...</span>
        </div>
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="card-dark p-12">
            <span className="text-6xl mb-4 block">🏥</span>
            <h1 className="text-3xl font-bold text-white mb-4">No Pharmacy Found</h1>
            <p className="text-gray-400 mb-6">Please create your pharmacy profile first to get started.</p>
            <button className="btn-primary">
              Create Pharmacy Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
            🏥 {pharmacy.name}
          </h1>
          <p className="text-teal-200 mt-2 text-lg">📍 {pharmacy.address}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card glass-hover p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 gradient-ocean rounded-lg p-3 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-cyan-200 truncate">Inventory Items</dt>
                  <dd className="text-4xl font-bold text-white drop-shadow-lg">{stats.inventory}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="glass-card glass-hover p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 gradient-forest rounded-lg p-3 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-emerald-200 truncate">Pending Prescriptions</dt>
                  <dd className="text-4xl font-bold text-white drop-shadow-lg">{stats.prescriptions}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="glass-card glass-hover p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 gradient-fire rounded-lg p-3 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-rose-200 truncate">Low Stock Alert</dt>
                  <dd className="text-4xl font-bold text-white drop-shadow-lg">{stats.lowStock}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card mb-6">
          <div className="border-b border-white/20">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${activeTab === 'overview' ? 'border-b-2 border-cyan-400 text-cyan-300' : 'text-teal-200 hover:text-white'}`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${activeTab === 'inventory' ? 'border-b-2 border-cyan-400 text-cyan-300' : 'text-teal-200 hover:text-white'}`}
              >
                📦 Inventory Management
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${activeTab === 'prescriptions' ? 'border-b-2 border-rose-500 text-orange-700' : 'text-rose-500 hover:text-orange-700'}`}
              >
                📄 Prescriptions
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-orange-800 mb-6">Pharmacy Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                      <span>📞</span> Contact Information
                    </h3>
                    <p className="text-sm text-gray-300 mb-2">Phone: <span className="text-blue-400">{pharmacy.phone}</span></p>
                    <p className="text-sm text-gray-300">License: <span className="text-blue-400">{pharmacy.licenseNumber}</span></p>
                  </div>
                  <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <span>🕐</span> Operating Hours
                    </h3>
                    <p className="text-sm text-gray-300">
                      {pharmacy.operatingHours?.open || '8:00 AM'} - {pharmacy.operatingHours?.close || '10:00 PM'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Inventory Management</h2>
                  <button
                    onClick={() => setShowAddInventory(!showAddInventory)}
                    className="btn-primary"
                  >
                    ➕ Add Item
                  </button>
                </div>

                {showAddInventory && (
                  <form onSubmit={handleAddInventory} className="bg-gray-700/50 p-6 rounded-lg mb-6 border border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Medicine</label>
                        <select
                          value={newInventory.medicineId}
                          onChange={(e) => setNewInventory({ ...newInventory, medicineId: e.target.value })}
                          className="input-dark"
                          required
                        >
                          <option value="">Select Medicine</option>
                          {medicines.map(med => (
                            <option key={med._id} value={med._id}>{med.name} ({med.genericName})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Stock Quantity</label>
                        <input
                          type="number"
                          value={newInventory.stock}
                          onChange={(e) => setNewInventory({ ...newInventory, stock: e.target.value })}
                          className="input-dark"
                          placeholder="100"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Price (Rs.)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newInventory.price}
                          onChange={(e) => setNewInventory({ ...newInventory, price: e.target.value })}
                          className="input-dark"
                          placeholder="250.00"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button type="submit" className="btn-success">
                        ✅ Add to Inventory
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddInventory(false)}
                        className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 transition-colors duration-200"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto bg-gray-700/30 rounded-lg border border-gray-600">
                  <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Medicine</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Reserved</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {inventory.map((item) => (
                        <tr key={item._id} className={`${item.stock < 10 ? 'bg-red-900/20' : 'hover:bg-gray-700/50'} transition-colors duration-200`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              {item.medicineId?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-400">
                              {item.medicineId?.genericName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-semibold ${item.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                              {item.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400 font-medium">
                            {item.reserved}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 font-medium">
                            Rs. {item.price?.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                            <button
                              onClick={() => handleUpdateStock(item.medicineId._id, 10)}
                              className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => handleUpdateStock(item.medicineId._id, -10)}
                              className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
                            >
                              -10
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Pharmacy Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                    <p className="text-sm text-gray-600">Phone: {pharmacy.phone}</p>
                    <p className="text-sm text-gray-600">License: {pharmacy.licenseNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Operating Hours</h3>
                    <p className="text-sm text-gray-600">
                      {pharmacy.operatingHours?.open || '8:00 AM'} - {pharmacy.operatingHours?.close || '10:00 PM'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Inventory Management</h2>
                  <button
                    onClick={() => setShowAddInventory(!showAddInventory)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    + Add Item
                  </button>
                </div>

                {showAddInventory && (
                  <form onSubmit={handleAddInventory} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine</label>
                        <select
                          value={newInventory.medicineId}
                          onChange={(e) => setNewInventory({ ...newInventory, medicineId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Medicine</option>
                          {medicines.map(med => (
                            <option key={med._id} value={med._id}>{med.name} ({med.genericName})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                        <input
                          type="number"
                          value={newInventory.stock}
                          onChange={(e) => setNewInventory({ ...newInventory, stock: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newInventory.price}
                          onChange={(e) => setNewInventory({ ...newInventory, price: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddInventory(false)}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reserved</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inventory.map((item) => (
                        <tr key={item._id} className={item.stock < 10 ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.medicineId?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.medicineId?.genericName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.reserved}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Rs. {item.price?.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleUpdateStock(item.medicineId._id, 10)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => handleUpdateStock(item.medicineId._id, -10)}
                              className="text-red-600 hover:text-red-900"
                            >
                              -10
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Prescription Requests</h2>
                <div className="space-y-4">
                  {prescriptions.filter(p => p.status === 'under_review').map((prescription) => (
                    <div key={prescription._id} className="card-dark p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold text-white text-lg">
                            👤 Customer: {prescription.userId?.name}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            📅 Submitted: {new Date(prescription.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-900/30 text-purple-400 border border-purple-700">
                          {prescription.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {prescription.note && (
                        <p className="text-sm text-gray-300 mb-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                          💬 Note: {prescription.note}
                        </p>
                      )}

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-300 mb-2">📎 Attached Files:</p>
                        <div className="flex gap-3">
                          {prescription.files?.map((file, idx) => (
                            <a
                              key={idx}
                              href={`http://localhost:5000${file.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 inline-flex items-center gap-2"
                            >
                              <span>📄</span> View File {idx + 1}
                            </a>
                          ))}
                        </div>
                      </div>

                      {selectedPrescription === prescription._id ? (
                        <div className="bg-gray-700/50 p-5 rounded-lg border border-gray-600">
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">💰 Quote Amount (Rs.)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={quoteData.amount}
                              onChange={(e) => setQuoteData({ ...quoteData, amount: e.target.value })}
                              className="input-dark"
                              placeholder="1500.00"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">📝 Note</label>
                            <textarea
                              value={quoteData.note}
                              onChange={(e) => setQuoteData({ ...quoteData, note: e.target.value })}
                              className="input-dark"
                              rows="3"
                              placeholder="Add any special instructions..."
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handlePrescriptionDecision(prescription._id, true)}
                              className="btn-success"
                            >
                              ✅ Approve with Quote
                            </button>
                            <button
                              onClick={() => handlePrescriptionDecision(prescription._id, false)}
                              className="btn-danger"
                            >
                              ❌ Reject
                            </button>
                            <button
                              onClick={() => setSelectedPrescription(null)}
                              className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 transition-colors duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedPrescription(prescription._id)}
                          className="btn-primary"
                        >
                          🔍 Review Prescription
                        </button>
                      )}
                    </div>
                  ))}

                  {prescriptions.filter(p => p.status === 'under_review').length === 0 && (
                    <div className="text-center py-12">
                      <span className="text-6xl mb-4 block">📭</span>
                      <p className="text-gray-400 text-lg">No pending prescriptions</p>
                      <p className="text-gray-500 mt-2">All caught up!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
