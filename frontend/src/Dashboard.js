import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const BASE_URL = 'http://localhost:5000';
const S = {
  page: {
    minHeight: '100vh',
    background: '#f0f4f8',
    fontFamily: "'Inter', sans-serif",
  },
  nav: {
    background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
  },
  navBrand: {
    color: '#fff',
    fontWeight: '700',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  navDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#e94560',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  navUser: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '13px',
  },
  logoutBtn: {
    background: 'rgba(233,69,96,0.2)',
    border: '1px solid rgba(233,69,96,0.4)',
    color: '#e94560',
    padding: '8px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
    border: '1px solid #e8ecf0',
  },
  cardTitle: {
    color: '#1a1a2e',
    fontSize: '17px',
    fontWeight: '700',
    margin: '0 0 6px',
  },
  cardSub: {
    color: '#8896a5',
    fontSize: '13px',
    margin: '0 0 24px',
  },
  label: {
    display: 'block',
    color: '#3d4f60',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '7px',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #dde3eb',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1a1a2e',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '16px',
    background: '#fafbfc',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #e94560, #c62a47)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
    letterSpacing: '0.3px',
  },
  alert: (type) => ({
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '16px',
    background: type === 'success' ? '#ecfdf5' : '#fef2f2',
    border: `1px solid ${type === 'success' ? '#a7f3d0' : '#fecaca'}`,
    color: type === 'success' ? '#065f46' : '#dc2626',
  }),
  tableWrap: {
    overflowX: 'auto',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  countBadge: {
    background: '#e94560',
    color: '#fff',
    borderRadius: '20px',
    padding: '3px 10px',
    fontSize: '12px',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    background: '#f7f9fb',
    color: '#5a6a7a',
    fontWeight: '600',
    fontSize: '12px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '2px solid #e8ecf0',
  },
  td: {
    padding: '14px 16px',
    borderBottom: '1px solid #f0f4f8',
    color: '#2d3748',
    verticalAlign: 'middle',
  },
  deleteBtn: {
    background: 'none',
    border: '1px solid #fecaca',
    color: '#e94560',
    padding: '5px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  },
  empty: {
    textAlign: 'center',
    padding: '48px',
    color: '#8896a5',
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  moodleId: {
    display: 'inline-block',
    background: '#eff6ff',
    color: '#2563eb',
    padding: '3px 10px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
  },
  courseTag: {
    display: 'inline-block',
    background: '#f5f3ff',
    color: '#7c3aed',
    padding: '3px 10px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: (color) => ({
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e8ecf0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    borderLeft: `4px solid ${color}`,
  }),
  statNum: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  statLabel: {
    fontSize: '12px',
    color: '#8896a5',
    marginTop: '4px',
    fontWeight: '500',
  },
};

const API = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export default function Dashboard({ token, adminName, onLogout }) {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student_name: '', moodle_id: '', course_name: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/students`, API(token));
      setStudents(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) onLogout();
    } finally {
      setFetching(false);
    }
  }, [token, onLogout]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/students`, form, API(token));
      showAlert('success', `Student "${form.student_name}" added successfully!`);
      setForm({ student_name: '', moodle_id: '', course_name: '' });
      fetchStudents();
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to add student.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await axios.delete(`${BASE_URL}/api/students/${id}`, API(token));
      showAlert('success', 'Student removed.');
      fetchStudents();
    } catch {
      showAlert('error', 'Failed to delete.');
    }
  };

  const uniqueCourses = [...new Set(students.map(s => s.course_name))].length;

  return (
    <div style={S.page}>
      {/* Navbar */}
      <nav style={S.nav}>
        <div style={S.navBrand}>
          <div style={S.navDot}></div>
          FDP Admin Portal
        </div>
        <div style={S.navRight}>
          <span style={S.navUser}>👤 {adminName}</span>
          <button style={S.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div style={S.main}>
        {/* Stats */}
        <div style={S.statsRow}>
          <div style={S.statCard('#e94560')}>
            <div style={S.statNum}>{students.length}</div>
            <div style={S.statLabel}>Total Students</div>
          </div>
          <div style={S.statCard('#7c3aed')}>
            <div style={S.statNum}>{uniqueCourses}</div>
            <div style={S.statLabel}>Courses</div>
          </div>
          <div style={S.statCard('#059669')}>
            <div style={S.statNum}>{students.length > 0 ? students[0].course_name.split(' ')[0] : '—'}</div>
            <div style={S.statLabel}>Latest Course</div>
          </div>
        </div>

        <div style={S.grid}>
          {/* Form */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>Add Student</h2>
            <p style={S.cardSub}>Fill in the details below to register a student</p>

            {alert && <div style={S.alert(alert.type)}>{alert.msg}</div>}

            <form onSubmit={handleSubmit}>
              <label style={S.label}>Student Name</label>
              <input
                style={S.input}
                placeholder="e.g. Rahul Sharma"
                value={form.student_name}
                onChange={e => setForm({ ...form, student_name: e.target.value })}
                required
              />

              <label style={S.label}>Moodle ID</label>
              <input
                style={S.input}
                placeholder="e.g. MO2024001"
                value={form.moodle_id}
                onChange={e => setForm({ ...form, moodle_id: e.target.value })}
                required
              />

              <label style={S.label}>Course Name</label>
              <input
                style={S.input}
                placeholder="e.g. Machine Learning Fundamentals"
                value={form.course_name}
                onChange={e => setForm({ ...form, course_name: e.target.value })}
                required
              />

              <button
                type="submit"
                style={{ ...S.submitBtn, opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? 'Saving...' : '+ Add Student'}
              </button>
            </form>
          </div>

          {/* Table */}
          <div style={S.card}>
            <div style={S.tableHeader}>
              <div>
                <h2 style={{ ...S.cardTitle, margin: 0 }}>Registered Students</h2>
                <p style={{ ...S.cardSub, margin: '4px 0 0' }}>All data stored in MySQL</p>
              </div>
              <span style={S.countBadge}>{students.length} records</span>
            </div>

            {fetching ? (
              <div style={S.empty}>
                <div style={S.emptyIcon}>⏳</div>
                <div>Loading from database...</div>
              </div>
            ) : students.length === 0 ? (
              <div style={S.empty}>
                <div style={S.emptyIcon}>📋</div>
                <div style={{ fontWeight: '600', color: '#3d4f60' }}>No students yet</div>
                <div style={{ fontSize: '13px', marginTop: '6px' }}>Add your first student using the form</div>
              </div>
            ) : (
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>#</th>
                      <th style={S.th}>Student Name</th>
                      <th style={S.th}>Moodle ID</th>
                      <th style={S.th}>Course Name</th>
                      <th style={S.th}>Date Added</th>
                      <th style={S.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                        <td style={{ ...S.td, color: '#8896a5', fontSize: '13px' }}>{i + 1}</td>
                        <td style={{ ...S.td, fontWeight: '600' }}>{s.student_name}</td>
                        <td style={S.td}><span style={S.moodleId}>{s.moodle_id}</span></td>
                        <td style={S.td}><span style={S.courseTag}>{s.course_name}</span></td>
                        <td style={{ ...S.td, color: '#8896a5', fontSize: '13px' }}>
                          {new Date(s.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td style={S.td}>
                          <button style={S.deleteBtn} onClick={() => handleDelete(s.id, s.student_name)}>
                            Delete
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
