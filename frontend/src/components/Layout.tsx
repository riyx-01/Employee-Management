import { useAuth0 } from '@auth0/auth0-react';
import { Users, DollarSign, CreditCard, LayoutDashboard } from 'lucide-react';

interface LayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export default function Layout({ activeTab, setActiveTab, children }: LayoutProps) {
  const { logout, user } = useAuth0();

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', name: 'Employees', icon: Users },
    { id: 'salaries', name: 'Salaries', icon: DollarSign },
    { id: 'advances', name: 'Advances', icon: CreditCard },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">E</div>
          <span className="logo-text">EMS Platform</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            {navItems.find((i) => i.id === activeTab)?.name || 'Dashboard'}
          </div>
          <div className="user-profile">
            <img src={user?.picture} alt={user?.name} className="avatar" />
            <div className="user-info">
              <span className="name">{user?.name}</span>
              <span className="email">{user?.email}</span>
            </div>
            <button
              className="btn-logout-topbar"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
