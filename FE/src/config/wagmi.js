import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

const ganache = {
  id: 1337,
  name: 'Ganache',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:7545'] },
  },
};

export const config = createConfig({
  chains: [ganache, sepolia, mainnet],
  transports: {
    [ganache.id]: http('http://127.0.0.1:7545'),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});