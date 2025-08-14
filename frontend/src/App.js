import React, { useState } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import ConnectWallet from './components/ConnectWallet';
import Home from './pages/Home';
import UserDashboardPage from './pages/UserDashboardPage';
import OperatorDashboardPage from './pages/OperatorDashboardPage';
import './App.css';

const wallets = [new PetraWallet()];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userType, setUserType] = useState(null);
  const [connected, setConnected] = useState(false);

  const renderPage = () => {
    switch(currentPage) {
      case 'userDashboard':
        return <UserDashboardPage setCurrentPage={setCurrentPage} />;
      case 'operatorDashboard':
        return <OperatorDashboardPage setCurrentPage={setCurrentPage} />;
      default:
        return <Home setCurrentPage={setCurrentPage} setUserType={setUserType} />;
    }
  };

  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <div className="App">
        {!connected && <ConnectWallet setConnected={setConnected} />}
        {connected && (
          <>
            <header>
              <h1>Smart Land Registration</h1>
            </header>
            {renderPage()}
          </>
        )}
      </div>
    </AptosWalletAdapterProvider>
  );
}

export default App;