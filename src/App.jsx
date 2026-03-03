/**
 * APP.JSX — Root component
 * Sets up router, toaster, global hydration.
 */

import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AllRoutes from './routes/AllRoutes.jsx';
import { hydrateUser } from './services/authService.js';
import './index.css';

const App = () => {
  // Hydrate user from token on app load
  useEffect(() => {
    hydrateUser();
  }, []);

  return (
    <>
      <AllRoutes />
      <Toaster
        position="top-right"
        containerStyle={{ top: 72 }}
        toastOptions={{ duration: 4000 }}
      />
    </>

  );
};

export default App;

// @import "tailwindcss";