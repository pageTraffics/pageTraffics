import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaUserShield, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaSignOutAlt, 
  FaSave,
  FaKey,
  FaCalendarAlt
} from 'react-icons/fa';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { currentUser, userData, updateUserProfileData, logout, resetPassword, role } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData || currentUser) {
      setDisplayName(userData?.displayName || currentUser?.displayName || '');
      setPhone(userData?.phone || '');
    }
  }, [userData, currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await updateUserProfileData({
        displayName,
        phone
      });
      setMessage('Profile updated successfully.');
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    setMessage('');
    setError('');
    try {
      await resetPassword(currentUser.email);
      setMessage(`Password reset email sent to ${currentUser.email}.`);
    } catch (err) {
      setError('Failed to send password reset email.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 10% 20%, rgba(25, 60, 184, 0.04) 0%, rgba(255, 105, 0, 0.04) 90%)',
      padding: '4rem 2rem',
      color: '#0f172a',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#ffffff',
            border: '1px solid rgba(25, 60, 184, 0.12)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #193CB8, #FF6900)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '800'
              }}>
                {(displayName || currentUser?.email || 'U')[0].toUpperCase()}
              </div>

              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#193CB8', margin: 0 }}>
                  {displayName || 'Customer Profile'}
                </h1>
                <p style={{ color: '#475569', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{
                padding: '6px 14px',
                borderRadius: '50px',
                background: role === 'admin' ? 'rgba(25, 60, 184, 0.1)' : 'rgba(255, 105, 0, 0.1)',
                color: role === 'admin' ? '#193CB8' : '#FF6900',
                fontSize: '0.85rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <FaUserShield /> Role: {role.toUpperCase()}
              </span>

              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#991b1b',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.9rem'
                }}
              >
                <FaSignOutAlt /> Log Out
              </button>
            </div>
          </div>

          {/* Verification Warning if email not verified */}
          {!currentUser?.emailVerified && (
            <div style={{
              padding: '1rem 1.2rem',
              borderRadius: '14px',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#92400e',
              fontSize: '0.92rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaExclamationTriangle />
                <span>Your email is not verified yet. Verify your email to ensure full account access.</span>
              </div>
              <button
                onClick={() => navigate('/verify-email')}
                style={{
                  padding: '6px 14px',
                  background: '#92400e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Verify Email
              </button>
            </div>
          )}

          {/* Quick Project Actions */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '2rem',
            padding: '1.2rem',
            background: 'radial-gradient(circle at 10% 20%, rgba(25, 60, 184, 0.04) 0%, rgba(255, 105, 0, 0.04) 90%)',
            borderRadius: '16px',
            border: '1px solid rgba(25, 60, 184, 0.12)',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/create-project')}
              style={{
                padding: '12px 20px',
                background: '#FF6900',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              + Create New Project Profile
            </button>
            <button
              onClick={() => navigate('/projects')}
              style={{
                padding: '12px 20px',
                background: '#ffffff',
                border: '1px solid rgba(25, 60, 184, 0.25)',
                color: '#193CB8',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              My Submitted Projects & Status
            </button>
          </div>

          {message && (
            <div style={{
              padding: '0.9rem',
              borderRadius: '10px',
              background: '#d1fae5',
              border: '1px solid #6ee7b7',
              color: '#065f46',
              fontSize: '0.9rem',
              marginBottom: '1.5rem'
            }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{
              padding: '0.9rem',
              borderRadius: '10px',
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              fontSize: '0.9rem',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
              <div>
                <label style={labelStyle}><FaUser style={{ color: '#FF6900' }} /> Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  disabled={!isEditing}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{ ...inputStyle, background: isEditing ? '#ffffff' : '#f8fafc' }}
                />
              </div>

              <div>
                <label style={labelStyle}><FaPhone style={{ color: '#FF6900' }} /> Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  disabled={!isEditing}
                  placeholder="+1 (555) 000-0000"
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ ...inputStyle, background: isEditing ? '#ffffff' : '#f8fafc' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
              <div>
                <label style={labelStyle}><FaEnvelope style={{ color: '#FF6900' }} /> Email Address (Primary)</label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  style={{ ...inputStyle, background: '#f8fafc', color: '#64748b' }}
                />
              </div>

              <div>
                <label style={labelStyle}><FaCalendarAlt style={{ color: '#FF6900' }} /> Account Created</label>
                <input
                  type="text"
                  value={userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                  disabled
                  style={{ ...inputStyle, background: '#f8fafc', color: '#64748b' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '1rem', flexWrap: 'wrap' }}>
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '12px 24px',
                      background: '#FF6900',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaSave /> {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: '12px 24px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      color: '#475569',
                      borderRadius: '10px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '12px 24px',
                    background: '#193CB8',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Edit Profile Details
                </button>
              )}

              <button
                type="button"
                onClick={handlePasswordReset}
                style={{
                  padding: '12px 24px',
                  background: '#ffffff',
                  border: '1px solid rgba(25, 60, 184, 0.25)',
                  color: '#193CB8',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaKey /> Request Password Reset Email
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.88rem',
  fontWeight: '600',
  color: '#334155',
  marginBottom: '6px'
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box'
};

export default CustomerProfile;
