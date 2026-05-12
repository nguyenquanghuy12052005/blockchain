export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
/** Nếu thiếu .env, axios sẽ gọi nhầm lên Vite → POST /api/donate 404 dù MetaMask đã thành công */
export const BACKEND_URL =import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';  
export const BACKEND_URL_IMAGE =import.meta.env.VITE_BACKEND_URL_IMAGE || 'http://localhost:5000';  
