import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App.jsx'
import AuthContext from './Component/AuthContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthContext>
    <App />
    </AuthContext>
  </StrictMode>,
)
