import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaFolderPlus, 
  FaFileUpload, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaFileAlt,
  FaTrash,
  FaPaperPlane,
  FaArrowLeft
} from 'react-icons/fa';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'zip'];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

const CreateProject = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  const [projectName, setProjectName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFileError('');
    const files = Array.from(e.target.files);
    const validFiles = [];

    for (let file of files) {
      const ext = file.name.split('.').pop().toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setFileError(`Invalid file type: .${ext}. Allowed formats: PDF, DOC, DOCX, PNG, JPG, ZIP.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File "${file.name}" exceeds the 2 MB maximum size limit.`);
        return;
      }

      validFiles.push(file);
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!projectName.trim() || !businessName.trim() || !description.trim() || !requirements.trim() || !deadline) {
      setError('Please fill in all required project fields.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upload files to Firebase Storage or create metadata
      const uploadedDocs = [];

      for (let file of selectedFiles) {
        try {
          const storagePath = `projects/${currentUser.uid}/${Date.now()}_${file.name}`;
          const storageRef = ref(storage, storagePath);
          await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(storageRef);

          uploadedDocs.push({
            name: file.name,
            size: file.size,
            type: file.type,
            url: downloadUrl
          });
        } catch (uploadErr) {
          console.warn('Storage upload fallback:', uploadErr);
          // Metadata fallback if storage rule blocks direct blob
          uploadedDocs.push({
            name: file.name,
            size: file.size,
            type: file.type,
            url: ''
          });
        }
      }

      // 2. Create Project document in Firestore
      const projectPayload = {
        customerUid: currentUser.uid,
        customerEmail: currentUser.email,
        customerName: userData?.displayName || currentUser.displayName || 'Customer',
        projectName: projectName.trim(),
        businessName: businessName.trim(),
        description: description.trim(),
        requirements: requirements.trim(),
        budget: budget ? budget.trim() : 'Flexible',
        deadline: deadline,
        documents: uploadedDocs,
        status: 'Submitted', // Default initial status
        meetingUrl: '', // Generated ONLY after approval
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'projects'), projectPayload);

      setSuccess('Project profile created successfully! Redirecting to tracking dashboard...');
      setTimeout(() => {
        navigate('/projects');
      }, 2000);

    } catch (err) {
      console.error('Create project error:', err);
      setError('Failed to create project profile. Please try again.');
    } finally {
      setSubmitting(false);
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
        {/* Navigation & Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/projects')}
            style={{
              padding: '10px 18px',
              background: '#ffffff',
              border: '1px solid rgba(25, 60, 184, 0.2)',
              borderRadius: '10px',
              color: '#193CB8',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaArrowLeft /> View All Projects
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#ffffff',
            border: '1px solid rgba(25, 60, 184, 0.12)',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            boxShadow: '0 10px 35px rgba(25, 60, 184, 0.08)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '50px',
              background: 'rgba(255, 105, 0, 0.08)',
              color: '#FF6900',
              fontSize: '0.85rem',
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '0.8rem'
            }}>New Initiative</span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#193CB8', margin: 0 }}>Create Project Profile</h1>
            <p style={{ color: '#475569', fontSize: '1rem', marginTop: '0.5rem' }}>Submit your project requirements, scope, and documents to begin.</p>
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              borderRadius: '12px',
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              fontSize: '0.92rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FaExclamationTriangle /> {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '1rem',
              borderRadius: '12px',
              background: '#d1fae5',
              border: '1px solid #6ee7b7',
              color: '#065f46',
              fontSize: '0.92rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FaCheckCircle /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {/* Row 1: Project Name & Business Name */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
              <div>
                <label style={labelStyle}>Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. E-Commerce Mobile App"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Retail Ltd"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Row 2: Description */}
            <div>
              <label style={labelStyle}>Project Description *</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your business goals, target audience, and key features..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {/* Row 3: Technical Requirements */}
            <div>
              <label style={labelStyle}>Technical Requirements & Scope *</label>
              <textarea
                required
                rows={4}
                placeholder="List specific technology preferences, integrations, or functional requirements..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            {/* Row 4: Budget & Deadline */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
              <div>
                <label style={labelStyle}>Estimated Budget (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. $5,000 - $10,000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Expected Target Deadline *</label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Row 5: Document Upload */}
            <div style={{
              border: '2px dashed rgba(25, 60, 184, 0.25)',
              borderRadius: '16px',
              padding: '1.8rem',
              textAlign: 'center',
              background: '#f8fafc'
            }}>
              <FaFileUpload style={{ fontSize: '2.5rem', color: '#FF6900', marginBottom: '0.8rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#193CB8', margin: '0 0 0.4rem 0' }}>
                Upload Project Documents
              </h4>
              <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 1rem 0' }}>
                Maximum size per file: <strong>2 MB</strong> &bull; Allowed: <strong>PDF, DOC, DOCX, PNG, JPG, ZIP</strong>
              </p>

              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: '#193CB8',
                color: '#ffffff',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}>
                Choose Files
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                  style={{ display: 'none' }}
                />
              </label>

              {fileError && (
                <div style={{ color: '#dc2626', fontSize: '0.88rem', marginTop: '0.8rem', fontWeight: '600' }}>
                  {fileError}
                </div>
              )}

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div style={{ marginTop: '1.2rem', textAlign: 'left' }}>
                  <h5 style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '0.6rem' }}>Selected Files ({selectedFiles.length}):</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.88rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FaFileAlt style={{ color: '#FF6900' }} />
                          <span>{file.name}</span>
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: '1rem',
                padding: '16px',
                background: submitting ? '#cbd5e1' : '#FF6900',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: '700',
                cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 10px 25px -5px rgba(255, 105, 0, 0.4)'
              }}
            >
              <FaPaperPlane /> {submitting ? 'Submitting Project Profile...' : 'Submit Project Profile'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.9rem',
  fontWeight: '700',
  color: '#193CB8',
  marginBottom: '6px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box'
};

export default CreateProject;
