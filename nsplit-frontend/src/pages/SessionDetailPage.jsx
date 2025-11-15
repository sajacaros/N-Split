import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';

const SessionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    loadData();

    // Auto-refresh every 5 seconds
    const interval = setInterval(loadData, 5000);
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [id]);

  const loadData = async () => {
    try {
      const [sessionRes, eventsRes] = await Promise.all([
        sessionAPI.get(id),
        sessionAPI.getEvents(id),
      ]);
      setSession(sessionRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      await sessionAPI.start(id);
      loadData();
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('Failed to start session.');
    }
  };

  const handlePause = async () => {
    try {
      await sessionAPI.pause(id);
      loadData();
    } catch (error) {
      console.error('Failed to pause session:', error);
      alert('Failed to pause session.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      await sessionAPI.delete(id);
      navigate('/sessions');
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert('Failed to delete session. Only sessions in "ready" status can be deleted.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Session not found</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      ready: 'bg-gray-200 text-gray-800',
      running: 'bg-green-200 text-green-800',
      paused: 'bg-yellow-200 text-yellow-800',
      completed: 'bg-blue-200 text-blue-800',
      holding: 'bg-green-200 text-green-800',
      sold: 'bg-gray-200 text-gray-800',
    };
    return colors[status] || 'bg-gray-200 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate('/sessions')}
            className="text-gray-600 hover:text-gray-800 mb-4"
          >
            ← Back to Sessions
          </button>
        </div>

        {/* Session Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{session.stock_name}</h1>
              <p className="text-gray-600">{session.stock_code}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
              {session.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <div className="text-sm text-gray-600">Current Step</div>
              <div className="text-xl font-semibold">{session.current_step} / {session.max_steps}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Amount Per Step</div>
              <div className="text-xl font-semibold">{session.amount_per_step.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Sell Trigger</div>
              <div className="text-xl font-semibold">+{session.sell_trigger_pct}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Buy Trigger</div>
              <div className="text-xl font-semibold">-{session.buy_trigger_pct}%</div>
            </div>
          </div>

          <div className="flex space-x-2">
            {session.status === 'ready' && (
              <>
                <button
                  onClick={handleStart}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Start
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Delete
                </button>
              </>
            )}
            {session.status === 'running' && (
              <button
                onClick={handlePause}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Pause
              </button>
            )}
            {session.status === 'paused' && (
              <button
                onClick={handleStart}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Resume
              </button>
            )}
          </div>
        </div>

        {/* Positions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Positions</h2>
          {session.positions && session.positions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Step</th>
                    <th className="text-left py-2">Buy Price</th>
                    <th className="text-left py-2">Quantity</th>
                    <th className="text-left py-2">Target Price</th>
                    <th className="text-left py-2">Sell Price</th>
                    <th className="text-left py-2">Profit</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {session.positions.map((position) => (
                    <tr key={position.id} className="border-b">
                      <td className="py-2">{position.step_number}</td>
                      <td className="py-2">{Number(position.buy_price).toLocaleString()}</td>
                      <td className="py-2">{position.quantity}</td>
                      <td className="py-2">{Number(position.sell_target_price).toLocaleString()}</td>
                      <td className="py-2">{position.sell_price ? Number(position.sell_price).toLocaleString() : '-'}</td>
                      <td className="py-2">
                        {position.realized_profit ? (
                          <span className={position.realized_profit > 0 ? 'text-green-600' : 'text-red-600'}>
                            {Number(position.realized_profit).toLocaleString()}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(position.status)}`}>
                          {position.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">No positions yet</div>
          )}
        </div>

        {/* Events Timeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Event Timeline</h2>
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 border-l-2 border-gray-300 pl-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{event.event_type}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(event.created_at).toLocaleString()}
                      </span>
                    </div>
                    {event.message && (
                      <p className="text-sm text-gray-600 mt-1">{event.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">No events yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDetailPage;
