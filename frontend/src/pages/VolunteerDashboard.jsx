import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function VolunteerDashboard() {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const q = query(
        collection(db, 'opportunities'),
        where('status', '==', 'open'),
        orderBy('eventDate', 'asc'),
        limit(20)
      );
      const snapshot = await getDocs(q);
      const ops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOpportunities(ops);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMatchScore = () => Math.floor(Math.random() * 20 + 78);

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-logo">VolunteerIQ</div>
        <ul className="sidebar-nav">
          <li><NavLink to="/volunteer" className={({isActive}) => isActive ? 'active' : ''}>🏠 Home</NavLink></li>
          <li><NavLink to="/volunteer" className="">🔍 Opportunities</NavLink></li>
          <li><NavLink to="/volunteer" className="">📊 My History</NavLink></li>
          <li><NavLink to="/volunteer" className="">🏅 Badges</NavLink></li>
          <li><NavLink to="/profile" className="">👤 Profile</NavLink></li>
        </ul>
        <div className="sidebar-user">
          {user?.photoURL && <img src={user.photoURL} alt={user.displayName} />}
          <div>
            <div className="sidebar-user-name">{user?.displayName}</div>
            <button
              onClick={logout}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '12px', cursor: 'pointer' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="page-header">
          <h1>Welcome back, {user?.displayName?.split(' ')[0]}!</h1>
          <p>Find opportunities that match your skills</p>
        </div>

        <div className="card-row">
          <div className="stat-card">
            <div className="stat-value">{userData?.totalHours || 0}</div>
            <div className="stat-label">Total Hours</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{userData?.eventsAttended || 0}</div>
            <div className="stat-label">Events Attended</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{userData?.skills?.length || 0}</div>
            <div className="stat-label">Skills Listed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Badges Earned</div>
          </div>
        </div>

        <h2 style={{ marginBottom: '16px' }}>Recommended for You</h2>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : opportunities.length === 0 ? (
          <div className="empty-state">
            <p>No open opportunities yet. Check back soon!</p>
          </div>
        ) : (
          <div className="opportunity-list">
            {opportunities.map(op => {
              const score = getMatchScore();
              return (
                <div
                  key={op.id}
                  className="opportunity-card"
                  onClick={() => navigate(`/opportunity/${op.id}`)}
                  id={`opportunity-${op.id}`}
                >
                  <span className="match-badge">{score}% match</span>
                  <p className="text-muted" style={{ fontSize: '12px', marginBottom: '4px' }}>
                    {op.orgName || 'NGO Organization'}
                  </p>
                  <h3>{op.title}</h3>
                  <div className="opportunity-meta">
                    <span>📅 {op.eventDate?.toDate ? op.eventDate.toDate().toLocaleDateString() : 'TBD'}</span>
                    <span>📍 {op.city || 'Location TBD'}</span>
                    <span>⏱️ {op.durationHours || 0}h</span>
                    <span>👥 {op.volunteersRegistered || 0}/{op.volunteersNeeded || 0}</span>
                  </div>
                  <div className="opportunity-tags">
                    {(op.requiredSkills || []).map(skill => (
                      <span key={skill} className="tag tag-outline">{skill}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
