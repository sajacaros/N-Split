import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/sessions');
      return;
    }

    const code = searchParams.get('code');
    if (code) {
      handleCallback(code);
    }
  }, [searchParams, isAuthenticated]);

  const handleCallback = async (code) => {
    try {
      const response = await authAPI.googleCallback(code);
      login(response.data.access_token);
      navigate('/sessions');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await authAPI.getGoogleLoginUrl();
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Failed to get login URL:', error);
      alert('Failed to initiate login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold mb-6 text-center">N-Split Trading</h1>
        <p className="text-gray-600 mb-8 text-center">
          Automated N-step split trading strategy
        </p>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
