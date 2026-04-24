/**
 * APP.JSX — Root component
 * Sets up router, toaster, global hydration, TanStack Query client.
 */

import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AllRoutes from './routes/AllRoutes.jsx';
import { hydrateUser } from './services/authService.js';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Full-screen spinner shown while we verify the session on mount.
// Prevents ProtectedRoute from reading stale localStorage state
// before hydrateUser has a chance to confirm or clear the session.
const AppLoader = () => (
  <div style={{
    position: 'fixed', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--color-background-primary)',
    zIndex: 9999,
  }}>
    <div style={{
      width: '32px', height: '32px',
      border: '3px solid var(--color-border-secondary)',
      borderTopColor: 'var(--color-text-info)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  </div>
);

const App = () => {
  console.log("App rendered");
  // hydrating = true  → block all route rendering until session is resolved
  // hydrating = false → session confirmed or cleared, safe to render routes
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    hydrateUser().finally(() => setHydrating(false));
  }, []);

  if (hydrating) return <AppLoader />;

  return (
    <QueryClientProvider client={queryClient}>
      <AllRoutes />
      <Toaster
        position="top-right"
        containerStyle={{ top: 72 }}
        toastOptions={{ duration: 4000 }}
      />
    </QueryClientProvider>
  );
};

export default App;