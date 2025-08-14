import React, { useState, useEffect } from 'react';
import { useLandRegistry } from '../contracts/landRegistry';
import LandRegistration from './LandRegistration';
import LandTransfer from './LandTransfer';
import SearchBar from './SearchBar';

const UserDashboard = ({ username }) => {
  const [lands, setLands] = useState([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const { getLandsByOwner, registerLand, requestLandTransfer } = useLandRegistry();

  useEffect(() => {
    const fetchLands = async () => {
      const userLands = await getLandsByOwner(username);
      setLands(userLands);
    };
    fetchLands();
  }, [username]);

  const handleRegisterLand = async (landData) => {
    await registerLand(landData.name, landData.area, landData.location);
    setShowRegistration(false);
    // Refresh lands list
    const updatedLands = await getLandsByOwner(username);
    setLands(updatedLands);
  };

  const handleTransferLand = async (transferData) => {
    await requestLandTransfer(transferData.landId, transferData.recipient);
    setShowTransfer(false);
  };

  return (
    <div className="user-dashboard">
      <h2>Welcome, {username}</h2>
      <SearchBar onSearch={(query) => console.log('Search:', query)} />
     
      <div className="dashboard-actions">
        <button onClick={() => setShowRegistration(true)}>Register New Land</button>
        <button onClick={() => setShowTransfer(true)}>Transfer Land</button>
      </div>
     
      {showRegistration && (
        <LandRegistration
          onSubmit={handleRegisterLand}
          onCancel={() => setShowRegistration(false)}
        />
      )}
     
      {showTransfer && (
        <LandTransfer
          lands={lands}
          onSubmit={handleTransferLand}
          onCancel={() => setShowTransfer(false)}
        />
      )}
     
      <div className="lands-list">
        <h3>Your Lands</h3>
        {lands.length > 0 ? (
          lands.map(land => (
            <div key={land.id} className="land-card">
              <p><strong>Name:</strong> {land.name}</p>
              <p><strong>Area:</strong> {land.area} sqm</p>
              <p><strong>Location:</strong> {land.location}</p>
              <p><strong>Hash:</strong> {land.hash}</p>
              <p><strong>Status:</strong> {land.is_approved ? 'Approved' : 'Pending Approval'}</p>
            </div>
          ))
        ) : (
          <p>No lands registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;