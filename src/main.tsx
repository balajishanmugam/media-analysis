import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import { setupMockAPI } from './services/mock.ts'

// MOCK API DISABLED - Connecting to real backend at http://localhost:8000
// TO ENABLE MOCK API: Uncomment the lines below
// import { setupMockAPI } from './services/mock.ts'
// if (import.meta.env.DEV) {
//   setupMockAPI();
// }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
