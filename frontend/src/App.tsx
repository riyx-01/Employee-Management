import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmployeesPage from './pages/EmployeesPage';
import SalariesPage from './pages/SalariesPage';
import AdvancesPage from './pages/AdvancesPage';

export default function App() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return <div className="loading">Loading platform...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <h1>EMS Portal</h1>
          <p>Enterprise Employee Management & Payroll</p>
          <button className="btn btn-primary btn-block" onClick={() => loginWithRedirect()}>
            Log In via Auth0
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'employees' && <EmployeesPage />}
      {activeTab === 'salaries' && <SalariesPage />}
      {activeTab === 'advances' && <AdvancesPage />}
    </Layout>
  );
}
