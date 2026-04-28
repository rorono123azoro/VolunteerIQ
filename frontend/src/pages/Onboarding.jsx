import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { SKILL_SUGGESTIONS, DAYS_OF_WEEK } from '../constants';

const TIME_SLOTS = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];

export default function Onboarding() {
  const { user, updateUserData } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    city: '',
    phone: '',
    bio: '',
    skills: [],
    skillInput: '',
    availability: {},
  });

  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillInput = (value) => {
    setFormData(prev => ({ ...prev, skillInput: value }));
    if (value.length > 1) {
      const filtered = SKILL_SUGGESTIONS.filter(
        s => s.toLowerCase().includes(value.toLowerCase()) && !formData.skills.includes(s)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const addSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill], skillInput: '' }));
    }
    setSuggestions([]);
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const toggleSlot = (day, slot) => {
    setFormData(prev => {
      const daySlots = prev.availability[day] || [];
      const updated = daySlots.includes(slot)
        ? daySlots.filter(s => s !== slot)
        : [...daySlots, slot];
      return { ...prev, availability: { ...prev.availability, [day]: updated } };
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updates = {
        city: formData.city,
        bio: formData.bio,
        skills: formData.skills,
        availability: formData.availability,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(doc(db, 'users', user.uid), updates);
      await updateUserData(updates);
      navigate('/volunteer');
    } catch (err) {
      console.error('Onboarding error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <h1>Complete Your Profile</h1>

      <div className="steps">
        <div className={`step-dot ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`} />
        <div className="step-connector" />
        <div className={`step-dot ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`} />
        <div className="step-connector" />
        <div className={`step-dot ${step >= 3 ? 'active' : ''}`} />
      </div>

      {step === 1 && (
        <div>
          <h2>Personal Details</h2>
          <div className="form-group">
            <label className="form-label" htmlFor="onboard-name">Full Name</label>
            <input className="form-input" id="onboard-name" value={user?.displayName || ''} disabled />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="onboard-city">City</label>
            <input
              className="form-input"
              id="onboard-city"
              placeholder="e.g. Delhi, Mumbai"
              value={formData.city}
              onChange={e => handleInputChange('city', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="onboard-phone">Phone (optional)</label>
            <input
              className="form-input"
              id="onboard-phone"
              placeholder="+91 XXXXX XXXXX"
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="onboard-bio">Short Bio</label>
            <textarea
              className="form-textarea"
              id="onboard-bio"
              placeholder="Tell us about yourself (max 300 chars)"
              maxLength={300}
              value={formData.bio}
              onChange={e => handleInputChange('bio', e.target.value)}
            />
            <p className="form-helper">{formData.bio.length}/300</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Skills & Interests</h2>
          <div className="form-group">
            <label className="form-label" htmlFor="skill-input">Add your skills</label>
            <input
              className="form-input"
              id="skill-input"
              placeholder="Type a skill (e.g. Teaching, Python)..."
              value={formData.skillInput}
              onChange={e => handleSkillInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && formData.skillInput.trim()) {
                  e.preventDefault();
                  addSkill(formData.skillInput.trim());
                }
              }}
            />
            {suggestions.length > 0 && (
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginTop: '4px' }}>
                {suggestions.map(s => (
                  <div
                    key={s}
                    style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px' }}
                    onClick={() => addSkill(s)}
                    onMouseEnter={e => e.target.style.background = 'var(--color-surface)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {formData.skills.map(skill => (
              <span key={skill} className="tag">
                {skill}
                <button className="tag-remove" onClick={() => removeSkill(skill)}>×</button>
              </span>
            ))}
          </div>
          {formData.skills.length === 0 && (
            <p className="text-muted" style={{ marginTop: '16px' }}>
              Add at least one skill to continue
            </p>
          )}
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Availability</h2>
          <p className="text-muted" style={{ marginBottom: '16px' }}>
            Click time slots to mark when you're available
          </p>
          <div className="availability-grid">
            <div className="day-label"></div>
            {TIME_SLOTS.map(slot => (
              <div key={slot} className="day-label" style={{ fontSize: '11px', textAlign: 'center' }}>{slot}</div>
            ))}
            {DAYS_OF_WEEK.map(day => (
              <>
                <div key={day} className="day-label">{day.toUpperCase()}</div>
                {TIME_SLOTS.map(slot => (
                  <div
                    key={`${day}-${slot}`}
                    className={`slot ${(formData.availability[day] || []).includes(slot) ? 'selected' : ''}`}
                    onClick={() => toggleSlot(day, slot)}
                  />
                ))}
              </>
            ))}
          </div>
        </div>
      )}

      <div className="onboarding-actions">
        {step > 1 ? (
          <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>Back</button>
        ) : <div />}
        {step < 3 ? (
          <button
            className="btn btn-primary"
            onClick={() => setStep(s => s + 1)}
            disabled={step === 1 && !formData.city || step === 2 && formData.skills.length === 0}
          >
            Next
          </button>
        ) : (
          <button className="btn btn-accent" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        )}
      </div>
    </div>
  );
}
