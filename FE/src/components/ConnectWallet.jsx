import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import Button from '../ui/Button';
import { toast } from '../ui/toastStore';

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(address || '');
              toast.success('Đã copy địa chỉ ví');
            } catch {
              toast.error('Không thể copy. Hãy copy thủ công.');
            }
          }}
          className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          title="Click để copy địa chỉ"
        >
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </button>
        <Button variant="danger" size="sm" onClick={() => disconnect()}>
          Ngắt kết nối
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => connect({ connector: injected() })}
      leftIcon={
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21.5 3.5 13.4 9.6l1.5-3.6 6.6-2.5ZM2.5 3.5l8 6.2-1.4-3.7-6.6-2.5ZM18.6 17.2l-1.9 2.9 4.1 1.1 1.2-3.9-3.4-.1ZM2.3 17.3l1.2 3.9 4.1-1.1-1.9-2.9-3.4.1ZM7.4 10.8l-1.1 1.7 4 0-.1-4.3-2.8 2.6ZM16.6 10.8l-2.9-2.7-.1 4.4 4 0-1-1.7ZM7.6 17.2l2.4-1.1-2.1-1.6-.3 2.7ZM14 16.1l2.4 1.1-.3-2.7-2.1 1.6ZM16.5 18.2l-2.7-1.2.2 1.6-.1.7 2.6-1.1ZM7.5 18.2l2.6 1.1-.1-.7.2-1.6-2.7 1.2ZM10.2 12.6l-2 0 1.4.7.6 0ZM13.8 12.6l.6 0 1.4-.7-2 0ZM9.8 15.1l2 .4 2-.4-.8-.6-2.4 0-.8.6Z"
          />
        </svg>
      }
    >
      Kết nối MetaMask
    </Button>
  );
}