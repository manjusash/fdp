import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

function Dashboard({ token, adminName, onLogout }) {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student_name: '', moodle_id: '', course_name: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get('/api/students', API(token));
      setStudents(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) onLogout();
    } finally {
      setLoadingStudents(false);
    }
  }, [token, onLogout]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student_name.trim() || !form.moodle_id.trim() || !form.course_name.trim()) {
      setFormError('All fields are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await axios.post('/api/students', form, API(token));
      setFormSuccess('✅ Student registered successfully!');
      setForm({ student_name: '', moodle_id: '', course_name: '' });
      fetchStudents();
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to register student.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/students/${id}`, API(token));
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert('Failed to delete student.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.student_name.toLowerCase().includes(search.toLowerCase()) ||
      s.moodle_id.toLowerCase().includes(search.toLowerCase()) ||
      s.course_name.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dt) =>
    new Date(dt).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="dashboard">
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-logo">🎓</span>
          <div>
            <div className="nav-title">FDP Admin Portal</div>
            <div className="nav-sub">Student Registration System</div>
          </div>
        </div>
        <div className="nav-right">
          <div className="nav-admin">
            <span className="admin-avatar">{adminName[0]?.toUpperCase()}</span>
            <span>{adminName}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>Sign Out</button>
        </div>
      </nav>

      <div className="dashboard-body">
        {/* ── Stats Row ── */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-num">{students.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">
              {[...new Set(students.map((s) => s.course_name))].length}
            </div>
            <div className="stat-label">Courses</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">
              {students.filter((s) => {
                const d = new Date(s.registered_at);
                const now = new Date();
                return d.toDateString() === now.toDateString();
              }).length}
            </div>
            <div className="stat-label">Registered Today</div>
          </div>
        </div>

        <div className="content-grid">
          {/* ── Registration Form ── */}
          <div className="card form-card">
            <div className="card-header">
              <h2>Register Student</h2>
              <p>Fill in the details and click Submit</p>
            </div>

            <form onSubmit={handleSubmit} className="reg-form">
              <div className="field-group">
                <label>Student Name <span className="req">*</span></label>
                <input
                  name="student_name"
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={form.student_name}
                  onChange={handleChange}
                />
              </div>

              <div className="field-group">
                <label>Moodle ID <span className="req">*</span></label>
                <input
                  name="moodle_id"
                  type="text"
                  placeholder="e.g. MID2024001"
                  value={form.moodle_id}
                  onChange={handleChange}
                />
              </div>

              <div className="field-group">
                <label>Course Name <span className="req">*</span></label>
                <input
                  name="course_name"
                  type="text"
                  placeholder="e.g. Advanced React Development"
                  value={form.course_name}
                  onChange={handleChange}
                />
              </div>

              {formError && (
                <div className="msg error-msg">⚠️ {formError}</div>
              )}
              {formSuccess && (
                <div className="msg success-msg">{formSuccess}</div>
              )}

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? <><span className="btn-spinner" /> Saving...</> : '＋ Register Student'}
              </button>
            </form>
          </div>

          {/* ── Students Table ── */}
          <div className="card table-card">
            <div className="card-header table-header">
              <div>
                <h2>Registered Students</h2>
                <p>{students.length} records in database</p>
              </div>
              <input
                className="search-input"
                type="text"
                placeholder="🔍 Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loadingStudents ? (
              <div className="table-loading">
                <span className="btn-spinner dark" />
                <span>Loading from database...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                {search ? '🔍 No students match your search.' : '📋 No students registered yet.'}
              </div>
            ) : (
              <div className="table-wrap">
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Moodle ID</th>
                      <th>Course Name</th>
                      <th>Registered On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, i) => (
                      <tr key={s.id}>
                        <td className="td-num">{i + 1}</td>
                        <td>
                          <div className="student-name">
                            <span className="name-avatar">{s.student_name[0]}</span>
                            {s.student_name}
                          </div>
                        </td>
                        <td><span className="moodle-badge">{s.moodle_id}</span></td>
                        <td>{s.course_name}</td>
                        <td className="td-date">{formatDate(s.registered_at)}</td>
                        <td>
                          <button
                            className="del-btn"
                            onClick={() => handleDelete(s.id, s.student_name)}
                            disabled={deletingId === s.id}
                          >
                            {deletingId === s.id ? '...' : '🗑️'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
