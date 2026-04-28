import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useState } from 'react';
import { SKILL_SUGGESTIONS, DAYS_OF_WEEK } from '../constants';

const TIME_SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

export default function Profile() {
  const { user, userData, logout, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    city: userData?.city || '',
    bio: userData?.bio || '',
    skills: userData?.skills || [],
    skillInput: '',
    availability: userData?.availability || {},
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        city: form.city,
        bio: form.bio,
        skills: form.skills,
        availability: form.availability,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(doc(db, 'users', user.uid), updates);
      await updateUserData(updates);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = (skill) => {
    if (skill && !form.skills.includes(skill)) {
      setForm(p => ({ ...p, skills: [...p.skills, skill], skillInput: '' }));
    }
  };

  const removeSkill = (skill) => {
    setForm(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));
  };

  const toggleSlot = (day, slot) => {
    setForm(prev => {
      const daySlots = prev.availability[day] || [];
      const updated = daySlots.includes(slot) ? daySlots.filter(s => s !== slot) : [...daySlots, slot];
      return { ...prev, availability: { ...prev.availability, [day]: updated } };
    });
  };

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-logo">VolunteerIQ</div>
        <ul className="sidebar-nav">
          <li><a href={userData?.role === 'coordinator' ? '/coordinator' : '/volunteer'}>🏠 Home</a></li>
          <li><a href="/profile" className="active">👤 Profile</a></li>
        </ul>
        <div className="sidebar-user">
          {user?.photoURL && <img src={user.photoURL} alt="" />}
          <div>
            <div className="sidebar-user-name">{user?.displayName}</div>
            <button onClick={logout} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', fontSize:'12px', cursor:'pointer' }}>Sign out</button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="page-header">
          <h1>My Profile</h1>
          <p>Manage your information and preferences</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            {user?.photoURL && (
              <img src={user.photoURL} alt={user.displayName} style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px' }} />
            )}
            <h3>{user?.displayName}</h3>
            <p className="text-muted" style={{ marginBottom: '8px' }}>{user?.email}</p>
            <span className={`badge ${userData?.role === 'coordinator' ? 'badge-primary' : 'badge-accent'}`}>
              {userData?.role}
            </span>
            <div style={{ marginTop: '24px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span className="text-muted">Total Hours</span>
                <strong>{userData?.totalHours || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span className="text-muted">Events</span>
                <strong>{userData?.eventsAttended || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span className="text-muted">City</span>
                <strong>{userData?.city || '—'}</strong>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2>Details</h2>
              {!editing ? (
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>Edit Profile</button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="btn btn-accent btn-sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                </div>
              )}
            </div>

            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                {editing ? (
                  <input className="form-input" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                ) : (
                  <p>{userData?.city || 'Not set'}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                {editing ? (
                  <textarea className="form-textarea" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} maxLength={300} />
                ) : (
                  <p>{userData?.bio || 'No bio yet'}</p>
                )}
              </div>
            </div>

            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '12px' }}>Skills</h3>
              {editing && (
                <div className="form-group">
                  <input
                    className="form-input"
                    placeholder="Add a skill and press Enter"
                    value={form.skillInput}
                    onChange={e => setForm(p => ({ ...p, skillInput: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(form.skillInput.trim()); } }}
                  />
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(editing ? form.skills : userData?.skills || []).map(skill => (
                  <span key={skill} className="tag">
                    {skill}
                    {editing && <button className="tag-remove" onClick={() => removeSkill(skill)}>×</button>}
                  </span>
                ))}
                {(editing ? form.skills : userData?.skills || []).length === 0 && (
                  <p className="text-muted">No skills added</p>
                )}
              </div>
            </div>

            {userData?.role === 'volunteer' && (
              <div className="card">
                <h3 style={{ marginBottom: '12px' }}>Availability</h3>
                <div className="availability-grid">
                  <div className="day-label"></div>
                  {TIME_SLOTS.map(s => <div key={s} className="day-label" style={{ fontSize:'11px', textAlign:'center' }}>{s}</div>)}
                  {DAYS_OF_WEEK.map(day => (
                    <>{/* Fragment key handled by React */}
                      <div key={day} className="day-label">{day.toUpperCase()}</div>
                      {TIME_SLOTS.map(slot => (
                        <div
                          key={`${day}-${slot}`}
                          className={`slot ${((editing ? form.availability : userData?.availability || {})[day] || []).includes(slot) ? 'selected' : ''}`}
                          onClick={editing ? () => toggleSlot(day, slot) : undefined}
                          style={!editing ? { cursor: 'default' } : {}}
                        />
                      ))}
                    </>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
