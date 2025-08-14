import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserAuth from '../components/UserAuth';
import { useLandRegistry } from '../contracts/landRegistry';

const UserLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { loginUser } = useLandRegistry();

  const handleLogin = async (username, password) => {
    try {
      await loginUser(username, password);
      navigate('/user-dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <h1>User Login</h1>
      {error && <div className="error-message">{error}</div>}
      <UserAuth onLogin={handleLogin} />
    </div>
  );
};

export default UserLogin;
