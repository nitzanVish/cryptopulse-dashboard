import { Dashboard } from './components/layout/Dashboard';
import { ErrorBoundary } from './components/ui/error-boundary';
import { TooltipProvider } from './components/ui/tooltip';

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Dashboard />
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
