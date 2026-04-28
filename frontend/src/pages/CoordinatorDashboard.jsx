import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { CATEGORIES } from '../constants';

export default function CoordinatorDashboard() {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newOpp, setNewOpp] = useState({
    title: '', description: '', category: 'education', city: '',
    address: '', requiredSkills: '', volunteersNeeded: 10,
    durationHours: 3, eventDate: '', beneficiariesTarget: 50,
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const oppSnap = await getDocs(query(collection(db, 'opportunities'), orderBy('createdAt', 'desc')));
      setOpportunities(oppSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const appSnap = await getDocs(query(collection(db, 'applications'), orderBy('appliedAt', 'desc')));
      setApplications(appSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handlePostOpportunity = async (e) => {
    e.preventDefault();
    try {
      const skills = newOpp.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
      await addDoc(collection(db, 'opportunities'), {
        ...newOpp,
        requiredSkills: skills,
        orgId: userData?.organizationId || '',
        orgName: userData?.displayName || 'Organization',
        createdBy: user.uid,
        volunteersRegistered: 0,
        status: 'open',
        skillEmbedding: [],
        eventDate: new Date(newOpp.eventDate),
        volunteersNeeded: Number(newOpp.volunteersNeeded),
        durationHours: Number(newOpp.durationHours),
        beneficiariesTarget: Number(newOpp.beneficiariesTarget),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setShowPostForm(false);
      setNewOpp({ title: '', description: '', category: 'education', city: '', address: '', requiredSkills: '', volunteersNeeded: 10, durationHours: 3, eventDate: '', beneficiariesTarget: 50 });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const tabs = ['overview', 'roster', 'events', 'reports'];

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-logo">VolunteerIQ</div>
        <ul className="sidebar-nav">
          <li><NavLink to="/coordinator" className="active">📊 Dashboard</NavLink></li>
          <li><a href="#" onClick={() => setActiveTab('roster')}>👥 Volunteers</a></li>
          <li><a href="#" onClick={() => setActiveTab('events')}>📅 Events</a></li>
          <li><NavLink to="/report">📈 Reports</NavLink></li>
          <li><NavLink to="/profile">👤 Profile</NavLink></li>
        </ul>
        <div className="sidebar-user">
          {user?.photoURL && <img src={user.photoURL} alt="" />}
          <div>
            <div className="sidebar-user-name">{user?.displayName}</div>
            <button onClick={logout} style={{ background:'none',border:'none',color:'rgba(255,255,255,0.5)',fontSize:'12px',cursor:'pointer' }}>Sign out</button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="page-header">
          <h1>Coordinator Dashboard</h1>
          <p>Manage volunteers, events, and impact</p>
        </div>

        <div className="card-row">
          <div className="stat-card"><div className="stat-value">{applications.filter(a => a.status === 'accepted').length}</div><div className="stat-label">Active Volunteers</div></div>
          <div className="stat-card"><div className="stat-value">{opportunities.filter(o => o.status === 'open').length}</div><div className="stat-label">Open Roles</div></div>
          <div className="stat-card"><div className="stat-value">{applications.length > 0 ? '78%' : '—'}</div><div className="stat-label">Attendance Rate</div></div>
          <div className="stat-card"><div className="stat-value">{opportunities.length}</div><div className="stat-label">Total Events</div></div>
        </div>

        <div className="tabs">
          {tabs.map(t => (
            <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2>Recent Applications</h2>
            </div>
            {applications.length === 0 ? (
              <div className="empty-state"><p>No applications yet</p></div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr><th>Volunteer</th><th>Opportunity</th><th>Match</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {applications.slice(0, 10).map(app => (
                      <tr key={app.id}>
                        <td>{app.volunteerId?.slice(0,8)}...</td>
                        <td>{app.opportunityId?.slice(0,8)}...</td>
                        <td><span className="match-badge" style={{fontSize:'11px'}}>{Math.round((app.matchScore || 0) * 100)}%</span></td>
                        <td><span className={`badge ${app.status === 'accepted' ? 'badge-accent' : app.status === 'rejected' ? 'badge-danger' : 'badge-primary'}`}>{app.status}</span></td>
                        <td className="text-muted">{app.appliedAt?.toDate ? app.appliedAt.toDate().toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2>Events</h2>
              <button className="btn btn-accent" onClick={() => setShowPostForm(!showPostForm)} id="post-opportunity-btn">
                {showPostForm ? 'Cancel' : '+ Post Opportunity'}
              </button>
            </div>

            {showPostForm && (
              <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>New Opportunity</h3>
                <form onSubmit={handlePostOpportunity}>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input className="form-input" value={newOpp.title} onChange={e => setNewOpp({...newOpp, title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" value={newOpp.description} onChange={e => setNewOpp({...newOpp, description: e.target.value})} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-select" value={newOpp.category} onChange={e => setNewOpp({...newOpp, category: e.target.value})}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input className="form-input" value={newOpp.city} onChange={e => setNewOpp({...newOpp, city: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Event Date</label>
                      <input className="form-input" type="datetime-local" value={newOpp.eventDate} onChange={e => setNewOpp({...newOpp, eventDate: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Volunteers Needed</label>
                      <input className="form-input" type="number" value={newOpp.volunteersNeeded} onChange={e => setNewOpp({...newOpp, volunteersNeeded: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration (hours)</label>
                      <input className="form-input" type="number" value={newOpp.durationHours} onChange={e => setNewOpp({...newOpp, durationHours: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Required Skills (comma-separated)</label>
                      <input className="form-input" value={newOpp.requiredSkills} onChange={e => setNewOpp({...newOpp, requiredSkills: e.target.value})} placeholder="Teaching, Python" />
                    </div>
                  </div>
                  <button className="btn btn-primary" type="submit">Post Opportunity</button>
                </form>
              </div>
            )}

            {opportunities.length === 0 ? (
              <div className="empty-state"><p>No events yet. Post your first opportunity!</p></div>
            ) : (
              <div className="opportunity-list">
                {opportunities.map(op => (
                  <div key={op.id} className="opportunity-card">
                    <h3>{op.title}</h3>
                    <div className="opportunity-meta">
                      <span>📅 {op.eventDate?.toDate ? op.eventDate.toDate().toLocaleDateString() : 'TBD'}</span>
                      <span>📍 {op.city}</span>
                      <span>👥 {op.volunteersRegistered}/{op.volunteersNeeded}</span>
                      <span className={`badge ${op.status === 'open' ? 'badge-accent' : 'badge-primary'}`}>{op.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'roster' && (
          <div className="empty-state"><p>Volunteer roster will appear after volunteers apply to your opportunities.</p></div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2>Impact Reports</h2>
            <p className="text-muted" style={{ marginBottom: '16px' }}>Generate AI-powered impact reports for your organization</p>
            <button className="btn btn-accent" id="generate-report-btn" onClick={() => navigate('/report')}>Generate Report</button>
          </div>
        )}
      </main>
    </div>
  );
}
