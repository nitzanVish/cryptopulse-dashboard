import { Dashboard } from './components/layout/Dashboard';
import { ErrorBoundary } from './components/ui/error-boundary';

function App() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}

export default App;
