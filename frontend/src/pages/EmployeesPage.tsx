import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import api, { handleApiError, setAuthToken } from '../utils/api';
import { Plus, X, Search, Edit2, Trash2 } from 'lucide-react';

export default function EmployeesPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [employees, setEmployees] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    employee_id: '', first_name: '', last_name: '', email: '', phone: '',
    dob: '', department: '', designation: '', joining_date: '', address: '', status: 'active'
  });

  const fetchEmployees = async (search = '') => {
    try {
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      const url = search ? `/employees/?search=${encodeURIComponent(search)}` : '/employees/';
      const res = await api.get(url);
      const data = res.data.data;
      const list = Array.isArray(data) ? data : (data?.results || []);
      setEmployees(list);
    } catch (err) {
      setErrorMsg(handleApiError(err));
    }
  };

  useEffect(() => {
    fetchEmployees(searchQuery);
  }, [searchQuery]);

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setFormData({
      employee_id: '', first_name: '', last_name: '', email: '', phone: '',
      dob: '', department: '', designation: '', joining_date: '', address: '', status: 'active'
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (emp: any) => {
    setEditingEmployee(emp);
    setFormData({
      employee_id: emp.employee_id,
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      phone: emp.phone,
      dob: emp.dob,
      department: emp.department,
      designation: emp.designation,
      joining_date: emp.joining_date,
      address: emp.address,
      status: emp.status
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      await api.delete(`/employees/${id}/`);
      fetchEmployees(searchQuery);
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
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}/`, formData);
      } else {
        await api.post('/employees/', formData);
      }
      setShowModal(false);
      fetchEmployees(searchQuery);
    } catch (err) {
      setErrorMsg(handleApiError(err));
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Employee Directory</span>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      <div className="controls-bar">
        <Search size={18} className="text-secondary" />
        <input
          type="text"
          placeholder="Search by ID, name, or email..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-secondary">No employees found.</td></tr>
            ) : (
              employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.employee_id}</td>
                  <td>
                    <div className="table-user-cell">
                      <div className="avatar-placeholder">{emp.first_name[0]}{emp.last_name[0]}</div>
                      <div>
                        <strong>{emp.first_name} {emp.last_name}</strong>
                        <span className="text-xs text-secondary d-block">{emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td><span className={`status-badge ${emp.status}`}>{emp.status}</span></td>
                  <td>
                    <div className="action-group" style={{ justifyContent: 'center' }}>
                      <button className="btn-icon text-success" onClick={() => handleOpenEdit(emp)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon text-danger" onClick={() => handleDelete(emp.id)}>
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
              <h3>{editingEmployee ? 'Edit Employee Details' : 'Add New Employee'}</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            
            {errorMsg && (
              <div className="alert alert-danger">
                <div>
                  <strong>Could not save employee:</strong>
                  <pre style={{ whiteSpace: 'pre-wrap', marginTop: '0.25rem', fontFamily: 'inherit', fontSize: '0.85rem' }}>{errorMsg}</pre>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee ID</label>
                  <input name="employee_id" value={formData.employee_id} onChange={handleChange} placeholder="EMP001" required disabled={!!editingEmployee} />
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="John" required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1234567890" required />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input name="department" value={formData.department} onChange={handleChange} placeholder="Engineering" required />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Software Engineer" required />
                </div>
                <div className="form-group">
                  <label>Joining Date</label>
                  <input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
                <div className="form-group grid-col-full">
                  <label>Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Full Address" rows={2} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
