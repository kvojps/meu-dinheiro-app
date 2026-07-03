import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ThemeModeProvider } from './theme/ThemeModeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeModeProvider>
        <App />
      </ThemeModeProvider>
    </HashRouter>
  </React.StrictMode>
);
