import React from 'react';
import ConnectWallet from './ConnectWallet';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-rose-50 via-white to-orange-50">
      <div className="sticky top-0 z-40 border-b border-rose-200/50 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="px-4 py-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-rose-400 to-amber-400 shadow-lg flex items-center justify-center text-white text-xl">
                  🌸
                </div>
                <div>
                  <h1 className="truncate text-lg font-black bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent sm:text-xl">
                    CharityChain
                  </h1>
                  <p className="hidden text-sm text-rose-400 sm:block">
                    Minh bạch on-chain · Yêu thương vô bờ
                  </p>
                </div>
              </div>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </div>
      <main className="w-full">{children}</main>
    </div>
  );
};

export default Layout;