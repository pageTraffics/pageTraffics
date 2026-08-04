import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaPaperPlane, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaVideo,
  FaBuilding,
  FaUser,
  FaTag
} from 'react-icons/fa';
import axios from 'axios';

const ContactForm = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    _honeypot: ''
  });
  
  const [mountTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateClientSide = () => {
    if (!formData.name.trim()) return 'Name is required.';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) return 'Subject is required.';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      return 'Message must be at least 10 characters long.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    const validationError = validateClientSide();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/send-email', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        subject: formData.subject,
        message: formData.message,
        _honeypot: formData._honeypot,
        _timestamp: mountTime
      });

      if (response.data && response.data.success) {
        setSuccessMessage(
          response.data.message ||
            'Thank you. Your query has been submitted successfully. Our team will contact you shortly.'
        );
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          _honeypot: ''
        });
      } else {
        setSubmitError(response.data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'An error occurred while submitting your query. Please try again later.';
      setSubmitError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'radial-gradient(circle at 10% 20%, rgba(25, 60, 184, 0.04) 0%, rgba(255, 105, 0, 0.04) 90%)',
        color: '#0f172a',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        padding: isMobile ? '2rem 1rem' : '4rem 2rem',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Light Glow Blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '-150px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 105, 0, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          right: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(25, 60, 184, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '50px',
              background: 'rgba(255, 105, 0, 0.08)',
              border: '1px solid rgba(255, 105, 0, 0.25)',
              color: '#FF6900',
              fontSize: '0.85rem',
              fontWeight: '700',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}
          >
            Get In Touch
          </span>
          <h1
            style={{
              fontSize: isMobile ? '2.2rem' : '3.5rem',
              fontWeight: '800',
              lineHeight: '1.2',
              margin: '0 0 1rem 0',
              color: '#193CB8'
            }}
          >
            Let's Build Something <span style={{ color: '#FF6900' }}>Extraordinary</span>
          </h1>
          <p
            style={{
              color: '#475569',
              fontSize: isMobile ? '1rem' : '1.2rem',
              maxWidth: '680px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
          >
            Have a project in mind or need expert software solutions? Fill out the form below and our engineering team will get back to you promptly.
          </p>

          {/* Meeting Policy Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '1.5rem',
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'rgba(25, 60, 184, 0.06)',
              border: '1px solid rgba(25, 60, 184, 0.2)',
              color: '#193CB8',
              fontSize: '0.9rem'
            }}
          >
            <FaVideo style={{ color: '#FF6900' }} />
            <span><strong>Meeting Policy:</strong> Google Meet links are generated dynamically upon project approval.</span>
          </motion.div>
        </motion.div>

        {/* Main Grid: Form + Info/Map */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.3fr 1fr',
            gap: '2.5rem',
            alignItems: 'start'
          }}
        >
          {/* Contact Form Card (Light Theme) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: '#ffffff',
              border: '1px solid rgba(25, 60, 184, 0.12)',
              borderRadius: '24px',
              padding: isMobile ? '1.8rem' : '2.8rem',
              boxShadow: '0 10px 35px rgba(25, 60, 184, 0.08)'
            }}
          >
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                margin: '0 0 0.5rem 0',
                color: '#193CB8',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <FaPaperPlane style={{ color: '#FF6900', fontSize: '1.5rem' }} />
              Send Us a Message
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Fill in your details and project context. We respond within 24 hours.
            </p>

            {/* Success Message Banner */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: '1.5rem' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  style={{
                    padding: '1.2rem',
                    borderRadius: '12px',
                    background: '#d1fae5',
                    border: '1px solid #6ee7b7',
                    color: '#065f46',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}
                >
                  <FaCheckCircle style={{ fontSize: '1.4rem', flexShrink: 0 }} />
                  <div>{successMessage}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message Banner */}
            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: '1.5rem' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  style={{
                    padding: '1.2rem',
                    borderRadius: '12px',
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    color: '#991b1b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.95rem'
                  }}
                >
                  <FaExclamationTriangle style={{ fontSize: '1.4rem', flexShrink: 0 }} />
                  <div>{submitError}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Hidden Honeypot Field for Spam Protection */}
              <input
                type="text"
                name="_honeypot"
                value={formData._honeypot}
                onChange={handleInputChange}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Row 1: Name & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.2rem' }}>
                <div>
                  <label style={labelStyle}><FaUser style={{ color: '#FF6900' }} /> Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}><FaEnvelope style={{ color: '#FF6900' }} /> Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Row 2: Phone & Company */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.2rem' }}>
                <div>
                  <label style={labelStyle}><FaPhone style={{ color: '#FF6900' }} /> Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}><FaBuilding style={{ color: '#FF6900' }} /> Company / Organization</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={handleInputChange}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Row 3: Subject */}
              <div>
                <label style={labelStyle}><FaTag style={{ color: '#FF6900' }} /> Subject *</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Web Development Inquiry"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>

              {/* Row 4: Message */}
              <div>
                <label style={labelStyle}>Message *</label>
                <textarea
                  name="message"
                  placeholder="Describe your project requirements, scope, or questions..."
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '130px' }}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                style={{
                  marginTop: '0.8rem',
                  padding: '16px 28px',
                  background: isSubmitting ? '#94a3b8' : '#FF6900',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 25px -5px rgba(255, 105, 0, 0.35)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" style={spinnerStyle} />
                    <span>Submitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Right Column: Contact Details & Office Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}
          >
            {/* Info Box Cards */}
            <div style={infoCardStyle}>
              <div style={iconBadgeStyle}>
                <FaMapMarkerAlt style={{ color: '#FF6900', fontSize: '1.2rem' }} />
              </div>
              <div>
                <h3 style={infoTitleStyle}>Head Office Location</h3>
                <p style={infoTextStyle}>
                  Plot No:-81, beside Road of Truptee Restaurant,<br />
                  Old Ag Colony, Unit 4, Bhubaneswar, Odisha 751001
                </p>
              </div>
            </div>

            <div style={infoCardStyle}>
              <div style={iconBadgeStyle}>
                <FaEnvelope style={{ color: '#FF6900', fontSize: '1.2rem' }} />
              </div>
              <div>
                <h3 style={infoTitleStyle}>Email Communication</h3>
                <p style={infoTextStyle}>
                  Direct: <a href="mailto:ujwal@richasoftwaresolutions.com" style={{ color: '#193CB8', textDecoration: 'none', fontWeight: '600' }}>ujwal@richasoftwaresolutions.com</a><br />
                  Support: <a href="mailto:contact@pagetraffics.com" style={{ color: '#193CB8', textDecoration: 'none', fontWeight: '600' }}>contact@pagetraffics.com</a>
                </p>
              </div>
            </div>

            <div style={infoCardStyle}>
              <div style={iconBadgeStyle}>
                <FaPhone style={{ color: '#FF6900', fontSize: '1.2rem' }} />
              </div>
              <div>
                <h3 style={infoTitleStyle}>Phone & Hours</h3>
                <p style={infoTextStyle}>
                  Phone: <a href="tel:+917655000956" style={{ color: '#193CB8', textDecoration: 'none', fontWeight: '600' }}>+91 7655000956</a><br />
                  Hours: Mon - Fri: 9:00 AM - 6:00 PM IST
                </p>
              </div>
            </div>

            {/* Embedded Google Map Frame */}
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(25, 60, 184, 0.15)',
                boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)',
                height: '240px'
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.222193833199!2d85.8178563153843!3d20.29304728640029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a190a0d8e0c972d%3A0x4b7a1a6c6e1d3b1a!2sTruptee%20Restaurant!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="PageTraffics Office Location Map"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Light Theme Styling Object Constants
const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#334155',
  fontSize: '0.88rem',
  fontWeight: '600',
  marginBottom: '6px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  color: '#0f172a',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
};

const infoCardStyle = {
  background: '#ffffff',
  border: '1px solid rgba(25, 60, 184, 0.12)',
  borderRadius: '18px',
  padding: '1.2rem 1.5rem',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  boxShadow: '0 10px 25px rgba(25, 60, 184, 0.06)'
};

const iconBadgeStyle = {
  width: '46px',
  height: '46px',
  borderRadius: '12px',
  background: 'rgba(255, 105, 0, 0.08)',
  border: '1px solid rgba(255, 105, 0, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const infoTitleStyle = {
  fontSize: '1.05rem',
  fontWeight: '700',
  color: '#193CB8',
  margin: '0 0 4px 0'
};

const infoTextStyle = {
  color: '#475569',
  fontSize: '0.9rem',
  lineHeight: '1.5',
  margin: 0
};

const spinnerStyle = {
  width: '18px',
  height: '18px',
  border: '2px solid rgba(255, 255, 255, 0.4)',
  borderTop: '2px solid #ffffff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

export default ContactForm;