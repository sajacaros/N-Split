import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';

const SessionCreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    stock_code: '',
    stock_name: '',
    initial_buy_price: '',
    amount_per_step: '',
    max_steps: 5,
    sell_trigger_pct: 5,
    buy_trigger_pct: 3,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        initial_buy_price: formData.initial_buy_price ? parseFloat(formData.initial_buy_price) : null,
        amount_per_step: parseFloat(formData.amount_per_step),
        max_steps: parseInt(formData.max_steps),
        sell_trigger_pct: parseFloat(formData.sell_trigger_pct),
        buy_trigger_pct: parseFloat(formData.buy_trigger_pct),
      };

      const response = await sessionAPI.create(payload);
      navigate(`/sessions/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/sessions')}
              className="text-gray-600 hover:text-gray-800 mr-4"
            >
              ← Back
            </button>
            <h2 className="text-2xl font-bold">Create New Session</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Code *
              </label>
              <input
                type="text"
                name="stock_code"
                value={formData.stock_code}
                onChange={handleChange}
                required
                placeholder="e.g., 005930"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Name *
              </label>
              <input
                type="text"
                name="stock_name"
                value={formData.stock_name}
                onChange={handleChange}
                required
                placeholder="e.g., Samsung Electronics"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Buy Price (leave empty for current price)
              </label>
              <input
                type="number"
                name="initial_buy_price"
                value={formData.initial_buy_price}
                onChange={handleChange}
                step="0.01"
                placeholder="e.g., 70000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Per Step *
              </label>
              <input
                type="number"
                name="amount_per_step"
                value={formData.amount_per_step}
                onChange={handleChange}
                required
                step="0.01"
                placeholder="e.g., 1000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Steps (1-10) *
              </label>
              <input
                type="number"
                name="max_steps"
                value={formData.max_steps}
                onChange={handleChange}
                required
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sell Trigger % (1-20) *
              </label>
              <input
                type="number"
                name="sell_trigger_pct"
                value={formData.sell_trigger_pct}
                onChange={handleChange}
                required
                min="1"
                max="20"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buy Trigger % (1-20) *
              </label>
              <input
                type="number"
                name="buy_trigger_pct"
                value={formData.buy_trigger_pct}
                onChange={handleChange}
                required
                min="1"
                max="20"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/sessions')}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Session'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionCreatePage;
