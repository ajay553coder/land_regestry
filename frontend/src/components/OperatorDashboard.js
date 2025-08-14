import React, { useState, useEffect } from 'react';
import { useLandRegistry } from '../contracts/landRegistry';
import SearchBar from './SearchBar';

const OperatorDashboard = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [completedApprovals, setCompletedApprovals] = useState([]);
  const { getPendingApprovals, approveTransferByOperator } = useLandRegistry();

  useEffect(() => {
    const fetchApprovals = async () => {
      const approvals = await getPendingApprovals();
      setPendingApprovals(approvals);
    };
    fetchApprovals();
  }, []);

  const handleApprove = async (landId) => {
    await approveTransferByOperator(landId);
    setPendingApprovals(pendingApprovals.filter(land => land.id !== landId));
    setCompletedApprovals([...completedApprovals, pendingApprovals.find(land => land.id === landId)]);
  };

  return (
    <div className="operator-dashboard">
      <h2>Operator Dashboard</h2>
      <SearchBar onSearch={(query) => console.log('Search:', query)} />
     
      <div className="approval-sections">
        <div className="pending-approvals">
          <h3>Pending Approvals</h3>
          {pendingApprovals.map(land => (
            <div key={land.id} className="land-card">
              <p>Land: {land.name}</p>
              <p>From: {land.transfer_request.from}</p>
              <p>To: {land.transfer_request.to}</p>
              <button onClick={() => handleApprove(land.id)}>Approve</button>
            </div>
          ))}
        </div>
       
        <div className="completed-approvals">
          <h3>Completed Approvals</h3>
          {completedApprovals.map(land => (
            <div key={land.id} className="land-card">
              <p>Land: {land.name}</p>
              <p>New Owner: {land.owner}</p>
              <p>Status: Approved</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;