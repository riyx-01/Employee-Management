import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'

// Dummy values - usually these would come from env vars
const domain = import.meta.env.VITE_AUTH0_DOMAIN || "your-tenant.auth0.com"
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "your-client-id"
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || "your-audience"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)
