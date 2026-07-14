import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api, { handleApiError, setAuthToken } from '../utils/api';
import { Plus, X, Check, Ban, Trash2 } from 'lucide-react';

export default function AdvancesPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [advances, setAdvances] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [formData, setFormData] = useState({
    employee: '', amount: '', reason: '', requested_date: ''
  });

  const fetchData = async (statusVal = '') => {
    try {
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      
      const advancesUrl = statusVal ? `/advances/?search=${statusVal}` : '/advances/';
      const [advRes, empRes] = await Promise.all([
        api.get(advancesUrl),
        api.get('/employees/')
      ]);
      
      const advData = advRes.data.data;
      const empData = empRes.data.data;
      
      setAdvances(Array.isArray(advData) ? advData : (advData?.results || []));
      setEmployees(Array.isArray(empData) ? empData : (empData?.results || []));
    } catch (err) {
      setErrorMsg(handleApiError(err));
    }
  };

  useEffect(() => {
    fetchData(statusFilter);
  }, [statusFilter]);

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOpenAdd = () => {
    setFormData({ employee: '', amount: '', reason: '', requested_date: '' });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      await api.patch(`/advances/${id}/`, { status: newStatus });
      fetchData(statusFilter);
    } catch (err) {
      setErrorMsg(handleApiError(err));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this advance request?")) return;
    try {
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      await api.delete(`/advances/${id}/`);
      fetchData(statusFilter);
    } catch (err) {
      setErrorMsg(handleApiError(err));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      await api.post('/advances/', formData);
      setShowModal(false);
      fetchData(statusFilter);
    } catch (err) {
      setErrorMsg(handleApiError(err));
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Advance Salary Requests</span>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          Request Advance
        </button>
      </div>

      <div className="controls-bar">
        <label className="text-secondary" style={{ fontSize: '0.85rem' }}>Filter by Status:</label>
        <select
          className="search-input"
          style={{ maxWidth: '200px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="paid">Paid</option>
        </select>
        
        {errorMsg && (
          <div className="alert alert-danger" style={{ flex: 1, margin: 0, padding: '0.5rem 1rem' }}>
            <strong>Action Failed:</strong> {errorMsg}
          </div>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Amount</th>
              <th>Requested Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th className="text-center">Approval Actions</th>
            </tr>
          </thead>
          <tbody>
            {advances.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-secondary">No advance requests found.</td></tr>
            ) : (
              advances.map(adv => (
                <tr key={adv.id}>
                  <td>{adv.employee_name} ({adv.employee_id})</td>
                  <td><strong>${adv.amount}</strong></td>
                  <td>{adv.requested_date}</td>
                  <td>{adv.reason}</td>
                  <td><span className={`status-badge ${adv.status}`}>{adv.status}</span></td>
                  <td>
                    <div className="action-group" style={{ justifyContent: 'center' }}>
                      {adv.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-icon text-success"
                            style={{ padding: '0.2rem' }}
                            onClick={() => handleStatusChange(adv.id, 'approved')}
                            title="Approve Request"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            className="btn btn-icon text-danger"
                            style={{ padding: '0.2rem' }}
                            onClick={() => handleStatusChange(adv.id, 'rejected')}
                            title="Reject Request"
                          >
                            <Ban size={18} />
                          </button>
                        </>
                      )}
                      {adv.status === 'approved' && (
                        <button
                          className="btn btn-secondary text-xs"
                          style={{ padding: '0.25rem 0.5rem' }}
                          onClick={() => handleStatusChange(adv.id, 'paid')}
                        >
                          Mark Paid
                        </button>
                      )}
                      <button className="btn-icon text-secondary" onClick={() => handleDelete(adv.id)} title="Delete Record">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Request Salary Advance</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            {errorMsg && (
              <div className="alert alert-danger">
                <div>
                  <strong>Validation Failed:</strong>
                  <pre style={{ whiteSpace: 'pre-wrap', marginTop: '0.25rem', fontFamily: 'inherit', fontSize: '0.85rem' }}>{errorMsg}</pre>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee</label>
                  <select name="employee" value={formData.employee} onChange={handleChange} required>
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} ({emp.employee_id})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Advance Amount ($)</label>
                  <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Requested Date</label>
                  <input type="date" name="requested_date" value={formData.requested_date} onChange={handleChange} required />
                </div>
                <div className="form-group grid-col-full">
                  <label>Reason for Advance</label>
                  <textarea name="reason" value={formData.reason} onChange={handleChange} placeholder="Emergency expense details..." rows={2} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
