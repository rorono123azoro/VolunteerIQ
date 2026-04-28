import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function OpportunityDetail() {
  const { id } = useParams();
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const snap = await getDoc(doc(db, 'opportunities', id));
      if (snap.exists()) {
        setOpportunity({ id: snap.id, ...snap.data() });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user || !opportunity) return;
    setApplying(true);
    try {
      await addDoc(collection(db, 'applications'), {
        opportunityId: opportunity.id,
        volunteerId: user.uid,
        orgId: opportunity.orgId || '',
        matchScore: 0.85,
        status: 'pending',
        appliedAt: serverTimestamp(),
        reviewedAt: null,
        reviewedBy: null,
        notes: '',
      });
      setApplied(true);
    } catch (err) {
      console.error(err);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
  if (!opportunity) return <div className="empty-state"><p>Opportunity not found</p></div>;

  const userSkills = userData?.skills || [];
  const requiredSkills = opportunity.requiredSkills || [];

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-logo">VolunteerIQ</div>
        <ul className="sidebar-nav">
          <li><a href="/volunteer">🏠 Home</a></li>
          <li><a href="/volunteer">🔍 Opportunities</a></li>
        </ul>
      </nav>

      <main className="main-content">
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '16px' }}>
          ← Back
        </button>

        <div className="detail-layout">
          <div>
            <p className="text-muted" style={{ marginBottom: '4px' }}>
              {opportunity.orgName || 'NGO Organization'}
            </p>
            <h1 style={{ marginBottom: '16px' }}>{opportunity.title}</h1>

            <div className="opportunity-meta" style={{ marginBottom: '24px' }}>
              <span>📅 {opportunity.eventDate?.toDate ? opportunity.eventDate.toDate().toLocaleDateString() : 'TBD'}</span>
              <span>📍 {opportunity.city || 'Location TBD'}</span>
              <span>⏱️ {opportunity.durationHours || 0} hours</span>
            </div>

            <h2 style={{ marginBottom: '8px' }}>Description</h2>
            <p style={{ marginBottom: '24px', lineHeight: 1.7 }}>
              {opportunity.description || 'No description provided.'}
            </p>

            <h2 style={{ marginBottom: '8px' }}>Required Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
              {requiredSkills.map(skill => (
                <span
                  key={skill}
                  className={`tag ${userSkills.includes(skill) ? 'tag-success' : 'tag-outline'}`}
                >
                  {userSkills.includes(skill) && '✓ '}{skill}
                </span>
              ))}
            </div>

            <h2 style={{ marginBottom: '8px' }}>Location</h2>
            <p className="text-muted">{opportunity.address || opportunity.city || 'Address not specified'}</p>
          </div>

          <div className="detail-sidebar">
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="match-badge" style={{ fontSize: '18px', marginBottom: '16px' }}>
                85% match
              </div>
              <p className="text-muted" style={{ marginBottom: '16px' }}>
                {requiredSkills.filter(s => userSkills.includes(s)).length} of {requiredSkills.length} skills matched
              </p>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                  👥 {opportunity.volunteersRegistered || 0} / {opportunity.volunteersNeeded || 0} slots filled
                </div>
              </div>

              {applied ? (
                <div className="badge badge-accent" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                  ✓ Application Submitted
                </div>
              ) : (
                <button
                  className="btn btn-accent btn-block"
                  onClick={handleApply}
                  disabled={applying || opportunity.status !== 'open'}
                  id="apply-btn"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
