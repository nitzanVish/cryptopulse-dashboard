import { CryptoTable } from '@/components/crypto/CryptoTable';
import { useWebSocket } from '@/hooks/useWebSocket';
import { TEXT } from '@/constants/text';

export function Dashboard() {
  useWebSocket();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{TEXT.dashboard.title}</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            {TEXT.dashboard.subtitle}
          </p>
        </header>

        <main>
          <CryptoTable />
        </main>
      </div>
    </div>
  );
}
