import React, { useState, useEffect } from 'react';

const MetaMaskConnection = () => {
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [walletAddress, setWalletAddress] = useState('N/A');
    const [isConnected, setIsConnected] = useState(false);

    // Check if MetaMask is installed
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
        } else {
            alert('MetaMask is not installed. Please install it to use this feature.');
        }

        // Listen for account changes
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
                setConnectionStatus('Connected');
                setIsConnected(true);
            } else {
                setConnectionStatus('Disconnected');
                setWalletAddress('N/A');
                setIsConnected(false);
            }
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);

        // Cleanup listener on component unmount
        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        };
    }, []);

    // Function to connect wallet
    const connectWallet = async () => {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];

            // Update UI with connection status and wallet address
            setConnectionStatus('Connected');
            setIsConnected(true);
            setWalletAddress(walletAddress);
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            alert('Could not connect to MetaMask. Please try again.');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Connect MetaMask Wallet</h1>
            <button onClick={connectWallet}>Connect Wallet</button>
            <div className="status" style={{ marginTop: '20px', fontSize: '18px' }}>
                Status: <span style={{ fontWeight: 'bold', color: isConnected ? 'green' : 'red' }}>{connectionStatus}</span>
            </div>
            <div>
                Wallet Address: <span>{walletAddress}</span>
            </div>
        </div>
    );
};

export default MetaMaskConnection;
