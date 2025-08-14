import React, { useState } from 'react';
import UserAuth from '../components/UserAuth';
import UserDashboard from '../components/UserDashboard';
import LandRegistration from '../components/LandRegistration';
import LandTransfer from '../components/LandTransfer';
import SearchBar from '../components/SearchBar';

const UserDashboardPage = ({ setCurrentPage }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [user, setUser] = useState(null);
  const [lands, setLands] = useState([]);

  const handleLogin = (userData) => {
    setUser(userData);
    setLoggedIn(true);
    // Fetch user's lands from blockchain
    fetchUserLands(userData.username);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setLoggedIn(true);
  };

  const fetchUserLands = async (username) => {
    // Implement blockchain call to get user's lands
  };

  const handleLandRegistration = (landData) => {
    // Implement blockchain call to register land
    setLands([...lands, landData]);
    setShowRegistration(false);
  };

  const handleLandTransfer = (transferData) => {
    // Implement blockchain call to transfer land
    setShowTransfer(false);
  };

  return (
    <div className="user-dashboard">
      {!loggedIn ? (
        <UserAuth onLogin={handleLogin} onRegister={handleRegister} />
      ) : (
        <>
          <div className="profile-section">
            <h3>Welcome, {user.username}</h3>
            <button onClick={() => setCurrentPage('home')}>Logout</button>
          </div>
         
          <SearchBar />
         
          <div className="action-buttons">
            <button onClick={() => setShowRegistration(true)}>Register New Land</button>
            <button onClick={() => setShowTransfer(true)}>Transfer Land</button>
          </div>
         
          {showRegistration && (
            <LandRegistration
              onSubmit={handleLandRegistration}
              onCancel={() => setShowRegistration(false)}
            />
          )}
         
          {showTransfer && (
            <LandTransfer
              onSubmit={handleLandTransfer}
              onCancel={() => setShowTransfer(false)}
              lands={lands}
            />
          )}
         
          <div className="lands-list">
            <h4>Your Lands</h4>
            {lands.map(land => (
              <div key={land.id} className="land-card">
                <p>Land Name: {land.name}</p>
                <p>Area: {land.area} sqm</p>
                <p>Hash: {land.hash}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboardPage;