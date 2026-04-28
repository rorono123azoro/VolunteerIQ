import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ROLES } from '../constants';

export default function RoleSelect() {
  const { user, userData, hasProfile, updateUserData } = useAuth();
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If user already has a profile, redirect them immediately
  useEffect(() => {
    if (hasProfile) {
      if (userData.role === 'coordinator') navigate('/coordinator');
      else navigate('/volunteer');
    }
  }, [hasProfile, userData, navigate]);

  const handleContinue = async () => {
    if (!selected || !user) return;
    setLoading(true);
    try {
      const basicData = {
        role: selected,
        updatedAt: serverTimestamp(),
      };
      
      // If the user document doesn't exist at all yet, we can set defaults.
      // But AuthContext now creates a shell doc on login.
      // So we just merge the role selection.
      await setDoc(doc(db, 'users', user.uid), basicData, { merge: true });
      await updateUserData(basicData);

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
