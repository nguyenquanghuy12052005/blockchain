import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import HomePage from './pages/HomePage';
import ToastViewport from './ui/Toast';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <HomePage />
        <ToastViewport />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;