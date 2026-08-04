import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaCheckCircle, FaRedo, FaArrowLeft, FaExclamationCircle } from 'react-icons/fa';

const VerifyEmail = () => {
  const { currentUser, triggerVerificationEmail } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await triggerVerificationEmail();
      setMessage('A new verification email has been sent to ' + (currentUser?.email || 'your email') + '.');
    } catch (err) {
      console.error('Resend verification error:', err);
      setError('Failed to resend verification email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 10% 20%, rgba(25, 60, 184, 0.04) 0%, rgba(255, 105, 0, 0.04) 90%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      color: '#0f172a',
      fontFamily: "'Inter', sans-serif"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          border: '1px solid rgba(25, 60, 184, 0.12)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 15px 35px rgba(25, 60, 184, 0.08)',
          textAlign: 'center'
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(255, 105, 0, 0.1)',
          color: '#FF6900',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          margin: '0 auto 1.5rem auto'
        }}>
          <FaEnvelope />
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#193CB8', margin: '0 0 0.5rem 0' }}>
          Verify Your Email
        </h2>
        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          We've sent an email verification link to{' '}
          <strong style={{ color: '#193CB8' }}>{currentUser?.email || 'your email address'}</strong>. Please check your inbox and click the link to activate all profile features.
        </p>

        {currentUser?.emailVerified ? (
          <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: '#d1fae5',
            border: '1px solid #6ee7b7',
            color: '#065f46',
            fontSize: '0.95rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <FaCheckCircle /> Your email address is verified!
          </div>
        ) : (
          <div style={{
            padding: '0.8rem',
            borderRadius: '10px',
            background: '#fef3c7',
            border: '1px solid #fde68a',
            color: '#92400e',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <FaExclamationCircle /> Verification Status: Pending
          </div>
        )}

        {message && (
          <div style={{
            padding: '0.8rem',
            borderRadius: '10px',
            background: '#d1fae5',
            color: '#065f46',
            fontSize: '0.88rem',
            marginBottom: '1.2rem'
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            padding: '0.8rem',
            borderRadius: '10px',
            background: '#fee2e2',
            color: '#991b1b',
            fontSize: '0.88rem',
            marginBottom: '1.2rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={handleResend}
            disabled={loading}
            style={{
              padding: '12px 20px',
              background: loading ? '#cbd5e1' : '#193CB8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <FaRedo /> {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>

          <Link
            to="/profile"
            style={{
              padding: '12px 20px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              color: '#475569',
              fontWeight: '700',
              textDecoration: 'none'
            }}
          >
            Go to Profile Management
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
