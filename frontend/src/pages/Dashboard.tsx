import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api, { handleApiError, setAuthToken } from '../utils/api';
import { Users, DollarSign, CreditCard, Clock, Activity } from 'lucide-react';

export default function Dashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [metrics, setMetrics] = useState({
    activeEmployees: 0,
    totalMonthlyPayroll: 0,
    pendingAdvancesCount: 0,
    totalAdvancesApproved: 0,
  });
  const [recentAdvances, setRecentAdvances] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getAccessTokenSilently();
        setAuthToken(token);
        const [emp, sal, adv] = await Promise.all([
          api.get('/employees/'),
          api.get('/salaries/'),
          api.get('/advances/')
        ]);

        const employeesList = emp.data.data?.results || emp.data.data || [];
        const salariesList = sal.data.data?.results || sal.data.data || [];
        const advancesList = adv.data.data?.results || adv.data.data || [];

        // 1. Calculate Active Employees
        const active = employeesList.filter((e: any) => e.status === 'active').length;

        // 2. Calculate Total Monthly Payroll
        const payroll = salariesList.reduce((acc: number, curr: any) => {
          return acc + parseFloat(curr.gross_salary || 0);
        }, 0);

        // 3. Pending Advances
        const pendingAdv = advancesList.filter((a: any) => a.status === 'pending').length;
        const approvedAdvTotal = advancesList
          .filter((a: any) => a.status === 'approved' || a.status === 'paid')
          .reduce((acc: number, curr: any) => acc + parseFloat(curr.amount || 0), 0);

        setMetrics({
          activeEmployees: active,
          totalMonthlyPayroll: payroll,
          pendingAdvancesCount: pendingAdv,
          totalAdvancesApproved: approvedAdvTotal,
        });

        // Get up to 5 recent advances
        setRecentAdvances(advancesList.slice(0, 5));

      } catch (err) {
        console.error(handleApiError(err));
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon bg-primary-light">
            <Users size={24} className="text-primary" />
          </div>
          <div className="stat-info">
            <h3>Active Employees</h3>
            <p className="stat-value">{metrics.activeEmployees}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-success-light">
            <DollarSign size={24} className="text-success" />
          </div>
          <div className="stat-info">
            <h3>Monthly Payroll</h3>
            <p className="stat-value">${metrics.totalMonthlyPayroll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-warning-light">
            <Clock size={24} className="text-warning" />
          </div>
          <div className="stat-info">
            <h3>Pending Advances</h3>
            <p className="stat-value">{metrics.pendingAdvancesCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-info-light">
            <CreditCard size={24} className="text-info" />
          </div>
          <div className="stat-info">
            <h3>Total Paid Advances</h3>
            <p className="stat-value">${metrics.totalAdvancesApproved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} className="text-primary" />
            Recent Advance Requests Activity
          </span>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Amount Requested</th>
                <th>Date Requested</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAdvances.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-secondary">No recent activities.</td></tr>
              ) : (
                recentAdvances.map(adv => (
                  <tr key={adv.id}>
                    <td>{adv.employee_name} ({adv.employee_id})</td>
                    <td><strong>${adv.amount}</strong></td>
                    <td>{adv.requested_date}</td>
                    <td>{adv.reason}</td>
                    <td><span className={`status-badge ${adv.status}`}>{adv.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
