import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ROLES } from '../constants';

export default function RoleSelect() {
  const { user, updateUserData } = useAuth();
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selected || !user) return;
    setLoading(true);
    try {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: selected,
        organizationId: null,
        city: '',
        skills: [],
        skillEmbedding: [],
        availability: {},
        bio: '',
        totalHours: 0,
        eventsAttended: 0,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', user.uid), userData);
      await updateUserData(userData);

      if (selected === ROLES.VOLUNTEER) {
        navigate('/onboarding');
      } else {
        navigate('/coordinator');
      }
    } catch (err) {
      console.error('Error saving role:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-select-page">
      <div className="role-select-container">
        <h1>How will you use VolunteerIQ?</h1>
        <p>Choose your role to get started</p>

        <div className="role-cards">
          <div
            className={`role-card ${selected === ROLES.VOLUNTEER ? 'selected' : ''}`}
            onClick={() => setSelected(ROLES.VOLUNTEER)}
            id="role-volunteer"
          >
            <div className="role-icon">🙋</div>
            <h3>Volunteer</h3>
            <p>Find opportunities that match your skills and track your social impact</p>
          </div>

          <div
            className={`role-card ${selected === ROLES.COORDINATOR ? 'selected' : ''}`}
            onClick={() => setSelected(ROLES.COORDINATOR)}
            id="role-coordinator"
          >
            <div className="role-icon">📋</div>
            <h3>NGO Coordinator</h3>
            <p>Manage volunteers, post opportunities, and generate impact reports</p>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <button
            className="btn btn-accent btn-lg btn-block"
            onClick={handleContinue}
            disabled={!selected || loading}
            id="role-continue-btn"
          >
            {loading ? 'Setting up...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
