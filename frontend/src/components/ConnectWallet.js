import React from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const ConnectWallet = ({ setConnected }) => {
  const { connect, account } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
      if (account) {
        setConnected(true);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div className="connect-wallet">
      <button onClick={handleConnect}>Connect to Wallet</button>
    </div>
  );
};

export default ConnectWallet;