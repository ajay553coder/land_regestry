import React, { useState } from 'react';

const LandTransfer = ({ onSubmit, onCancel, lands }) => {
  const [formData, setFormData] = useState({
    landId: '',
    recipient: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Transfer Land Ownership</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Land:</label>
            <select
              name="landId"
              value={formData.landId}
              onChange={handleChange}
              required
            >
              <option value="">Select a land</option>
              {lands.map(land => (
                <option key={land.id} value={land.id}>
                  {land.name} (ID: {land.id})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Recipient Address:</label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              placeholder="Enter recipient's wallet address"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit">Request Transfer</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LandTransfer;