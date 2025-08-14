import React, { useState } from 'react';
import { useLandRegistry } from '../contracts/landRegistry';

const UserAuth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    landName: '',
    area: '',
    location: ''
  });
  const { registerUser, loginUser } = useLandRegistry();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await loginUser(formData.username, formData.password);
        onLoginSuccess(formData.username);
      } else {
        await registerUser(formData.username, formData.password);
        onLoginSuccess(formData.username);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'User Login' : 'User Registration'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {!isLogin && (
          <>
            <div className="form-group">
              <label>Land Name:</label>
              <input
                type="text"
                name="landName"
                value={formData.landName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Area (sqm):</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
        {isLogin ? 'Need to register? Click here' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default UserAuth;