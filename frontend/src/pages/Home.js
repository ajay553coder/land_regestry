import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ setCurrentPage, setUserType }) => {
  const navigate = useNavigate();

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setCurrentPage(type === 'user' ? 'userLogin' : 'operatorLogin');
  };

  return (
    <div className="home-page">
      <div className="user-type-selection">
        <h2>Select Your Role</h2>
        <div className="options">
          <button onClick={() => handleUserTypeSelect('user')}>User</button>
          <button onClick={() => handleUserTypeSelect('operator')}>Operator</button>
        </div>
      </div>
    </div>
  );
};

export default Home;