import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AdminSidebarProvider } from './components/AdminSidebarContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminSidebarProvider>
      <App />
    </AdminSidebarProvider>
  </StrictMode>,
);

