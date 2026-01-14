import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
} catch (err) {
  console.error("Application crashed:", err);
  rootElement.innerHTML = `<div style="padding:20px; color:red; text-align:center">
    <h2>Application Error</h2>
    <p>Failed to load the application. Check console for details.</p>
  </div>`;
}