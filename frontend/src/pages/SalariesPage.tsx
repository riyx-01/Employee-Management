import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api, { handleApiError, setAuthToken } from '../utils/api';
import { Plus, X, Edit2, Trash2, CreditCard, ShieldCheck } from 'lucide-react';

export default function SalariesPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [salaries, setSalaries] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSalary, setEditingSalary] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Payment States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payingSalary, setPayingSalary] = useState<any | null>(null);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• ••••',
    name: 'CARDHOLDER NAME',
    expiry: 'MM/YY',
    cvc: '•••'
  });

  const [formData, setFormData] = useState({
    employee: '', basic: '0', hra: '0', bonus: '0', deduction: '0', effective_from: ''
  });

  const fetchData = async () => {
    try {
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      const [salRes, empRes] = await Promise.all([
        api.get('/salaries/'),
        api.get('/employees/')
      ]);
      const salData = salRes.data.data;
      const empData = empRes.data.data;
      setSalaries(Array.isArray(salData) ? salData : (salData?.results || []));
      setEmployees(Array.isArray(empData) ? empData : (empData?.results || []));
    } catch (err) {
      setErrorMsg(handleApiError(err));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const calculateGross = () => {
    const basic = parseFloat(formData.basic) || 0;
    const hra = parseFloat(formData.hra) || 0;
    const bonus = parseFloat(formData.bonus) || 0;
    const deduction = parseFloat(formData.deduction) || 0;
    return (basic + hra + bonus - deduction).toFixed(2);
  };

  const handleOpenAdd = () => {
    setEditingSalary(null);
    setFormData({ employee: '', basic: '0', hra: '0', bonus: '0', deduction: '0', effective_from: '' });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (sal: any) => {
    setEditingSalary(sal);
    setFormData({
      employee: String(sal.employee),
      basic: String(sal.basic),
      hra: String(sal.hra),
      bonus: String(sal.bonus),
      deduction: String(sal.deduction),
      effective_from: sal.effective_from
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this salary record?")) return;
    try {
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      await api.delete(`/salaries/${id}/`);
      fetchData();
    } catch (err) {
      setErrorMsg(handleApiError(err));
    }
  };

  const handlePayClick = (sal: any) => {
    setPayingSalary(sal);
    setCardData({
      number: '•••• •••• •••• ••••',
      name: 'CARDHOLDER NAME',
      expiry: 'MM/YY',
      cvc: '•••'
    });
    setPaymentStep('form');
    setShowPaymentModal(true);
  };

  const executePayment = async (e: any) => {
    e.preventDefault();
    setPaymentStep('processing');
    try {
      // Simulate Stripe Network Delay (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      await api.patch(`/salaries/${payingSalary.id}/`, { status: 'paid' });
      
      setPaymentStep('success');
      fetchData();
    } catch (err) {
      setErrorMsg(handleApiError(err));
      setPaymentStep('form');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      if (editingSalary) {
        await api.put(`/salaries/${editingSalary.id}/`, formData);
      } else {
        await api.post('/salaries/', formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setErrorMsg(handleApiError(err));
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Salary List</span>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          Add Salary
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Basic</th>
              <th>HRA</th>
              <th>Bonus</th>
              <th>Deduction</th>
              <th>Gross Salary</th>
              <th>Effective Date</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.length === 0 ? (
              <tr><td colSpan={9} className="text-center text-secondary">No salary records found.</td></tr>
            ) : (
              salaries.map(sal => (
                <tr key={sal.id}>
                  <td>{sal.employee_name} ({sal.employee_id})</td>
                  <td>${sal.basic}</td>
                  <td>${sal.hra}</td>
                  <td>${sal.bonus}</td>
                  <td>${sal.deduction}</td>
                  <td><strong>${sal.gross_salary}</strong></td>
                  <td>{sal.effective_from}</td>
                  <td><span className={`status-badge ${sal.status}`}>{sal.status}</span></td>
                  <td>
                    <div className="action-group" style={{ justifyContent: 'center' }}>
                      {sal.status === 'unpaid' && (
                        <button className="btn btn-success text-xs btn-with-icon" onClick={() => handlePayClick(sal)}>
                          <CreditCard size={12} />
                          Pay
                        </button>
                      )}
                      <button className="btn-icon text-success" onClick={() => handleOpenEdit(sal)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(sal.id)}>
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

      {/* Main Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingSalary ? 'Edit Salary Details' : 'Add Salary Record'}</h3>
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
                  <select name="employee" value={formData.employee} onChange={handleChange} required disabled={!!editingSalary}>
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} ({emp.employee_id})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Effective Date</label>
                  <input type="date" name="effective_from" value={formData.effective_from} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Basic Pay ($)</label>
                  <input type="number" step="0.01" name="basic" value={formData.basic} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>HRA ($)</label>
                  <input type="number" step="0.01" name="hra" value={formData.hra} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Bonus ($)</label>
                  <input type="number" step="0.01" name="bonus" value={formData.bonus} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Deduction ($)</label>
                  <input type="number" step="0.01" name="deduction" value={formData.deduction} onChange={handleChange} />
                </div>
                <div className="form-group grid-col-full" style={{ background: '#f8fafc', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Estimated Gross Salary</label>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.25rem' }}>
                    ${calculateGross()}
                  </div>
                  <span className="text-xs text-secondary">Formula: Basic + HRA + Bonus - Deduction (calculated live)</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Salary Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stripe Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} className="text-success" />
                Stripe Payout Checkout
              </h3>
              <button className="btn-icon" onClick={() => setShowPaymentModal(false)} disabled={paymentStep === 'processing'}>
                <X size={20} />
              </button>
            </div>

            {paymentStep === 'form' && (
              <form onSubmit={executePayment}>
                {/* Visual Card Preview */}
                <div className="card-preview">
                  <div className="card-preview-chip"></div>
                  <div className="card-preview-number">{cardData.number}</div>
                  <div className="card-preview-details">
                    <div>
                      <div className="card-preview-label">Card Holder</div>
                      <div className="card-preview-value">{cardData.name}</div>
                    </div>
                    <div>
                      <div className="card-preview-label">Expires</div>
                      <div className="card-preview-value">{cardData.expiry}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label>Corporate Funding Source (Card Number)</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4111 2222 3333 4444"
                      required
                      onChange={(e) => {
                        // format to space separated
                        let val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setCardData({ ...cardData, number: val || '•••• •••• •••• ••••' });
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        required
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value || 'MM/YY' })}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>CVC</label>
                      <input
                        type="password"
                        maxLength={3}
                        placeholder="123"
                        required
                        onChange={(e) => setCardData({ ...cardData, cvc: e.target.value || '•••' })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Funding Account Owner</label>
                    <input
                      type="text"
                      placeholder="EMS CORPORATE INC."
                      required
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() || 'CARDHOLDER NAME' })}
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="text-xs text-secondary d-block">Payout Amount</span>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>${payingSalary?.gross_salary}</strong>
                  </div>
                  <button type="submit" className="btn btn-success">
                    Confirm & Transfer Payout
                  </button>
                </div>
              </form>
            )}

            {paymentStep === 'processing' && (
              <div className="text-center" style={{ padding: '2rem 0' }}>
                <div className="spinner"></div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Authorizing Transaction</h4>
                <p className="text-secondary text-xs">Securing Stripe connection & processing gross payout of ${payingSalary?.gross_salary}...</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="text-center" style={{ padding: '2rem 0' }}>
                <div className="success-checkmark">
                  <ShieldCheck size={40} />
                </div>
                <h4 style={{ fontWeight: 600, color: 'var(--success)', marginBottom: '0.5rem' }}>Payout Completed</h4>
                <p className="text-secondary text-xs mb-3">The salary of ${payingSalary?.gross_salary} has been successfully paid via Stripe.</p>
                <div style={{ background: '#f8fafc', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                  Ref: ch_{Math.random().toString(36).substr(2, 9)}
                </div>
                <button className="btn btn-primary mt-2" style={{ width: '100%' }} onClick={() => setShowPaymentModal(false)}>
                  Back to Directory
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
