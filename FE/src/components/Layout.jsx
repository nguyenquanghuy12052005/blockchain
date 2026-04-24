import React from 'react';
import ConnectWallet from './ConnectWallet';
import Card from '../ui/Card';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 border-b border-white/20 bg-white/60 backdrop-blur">
        <div className="app-container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 shadow-lg" />
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-black text-slate-900 sm:text-xl">
                    Quỹ Từ Thiện
                  </h1>
                  <p className="hidden text-sm text-slate-500 sm:block">
                    Minh bạch on-chain, lưu lịch sử off-chain
                  </p>
                </div>
              </div>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </div>

      <main className="app-container py-8">
        <Card className="p-0">
          <div className="p-5 sm:p-7">{children}</div>
        </Card>
      </main>
    </div>
  );
};

export default Layout;