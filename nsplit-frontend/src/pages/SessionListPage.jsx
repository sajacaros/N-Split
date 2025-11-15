import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const SessionListPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [filter]);

  const loadSessions = async () => {
    try {
      const statusFilter = filter === 'all' ? undefined : filter;
      const response = await sessionAPI.list(statusFilter);
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ready: 'bg-gray-200 text-gray-800',
      running: 'bg-green-200 text-green-800',
      paused: 'bg-yellow-200 text-yellow-800',
      completed: 'bg-blue-200 text-blue-800',
    };
    return colors[status] || 'bg-gray-200 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">N-Split Trading</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sessions</h2>
          <button
            onClick={() => navigate('/sessions/new')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            New Session
          </button>
        </div>

        <div className="mb-4 flex space-x-2">
          {['all', 'ready', 'running', 'paused', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No sessions found. Create your first session to get started!
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => navigate(`/sessions/${session.id}`)}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{session.stock_name}</h3>
                    <p className="text-gray-600">{session.stock_code}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Max Steps:</span>
                    <span className="ml-2 font-medium">{session.max_steps}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Current Step:</span>
                    <span className="ml-2 font-medium">{session.current_step}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Sell Trigger:</span>
                    <span className="ml-2 font-medium">+{session.sell_trigger_pct}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Buy Trigger:</span>
                    <span className="ml-2 font-medium">-{session.buy_trigger_pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionListPage;
