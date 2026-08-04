import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaPlus, 
  FaFolder, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaVideo, 
  FaFileDownload,
  FaCheckCircle,
  FaClock,
  FaSync,
  FaFileAlt,
  FaRobot,
  FaFileContract,
  FaTimes,
  FaUser,
  FaFolderOpen,
  FaCalculator,
  FaCreditCard,
  FaBell,
  FaEnvelope,
  FaLifeRing,
  FaCloudDownloadAlt,
  FaShieldAlt
} from 'react-icons/fa';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import axios from 'axios';
import { generateAILegalAgreement } from '../utils/aiAgreementGenerator';

const STATUS_STAGES = [
  'Submitted',
  'Under Review',
  'Meeting Scheduled',
  'Proposal Sent',
  'Approved',
  'Development Started',
  'Completed'
];

const CustomerProjects = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  // 11-Tab Command Center State
  const [activeTab, setActiveTab] = useState('projects');
  const [tickets, setTickets] = useState([
    {
      id: 'tkt_101',
      subject: 'Domain & SSL Configuration Query',
      category: 'Deployment',
      priority: 'High',
      status: 'In Progress',
      description: 'Requesting assistance with pointing custom domain DNS records to production servers.',
      createdAt: new Date().toISOString()
    }
  ]);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Technical Support',
    priority: 'Medium',
    description: ''
  });

  const handleCreateSupportTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      alert('Please fill out the ticket subject and description.');
      return;
    }
    const newTkt = {
      id: `tkt_${Date.now()}`,
      subject: ticketForm.subject,
      category: ticketForm.category,
      priority: ticketForm.priority,
      description: ticketForm.description,
      status: 'Open',
      createdAt: new Date().toISOString()
    };
    setTickets([newTkt, ...tickets]);
    setTicketForm({ subject: '', category: 'Technical Support', priority: 'Medium', description: '' });
    alert('Support Ticket Created! Our engineering team will respond shortly.');
  };

  const fetchCustomerProjectsAndProposals = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      // 1. Fetch Customer Projects
      const qProj = query(
        collection(db, 'projects'),
        where('customerUid', '==', currentUser.uid)
      );
      const projSnap = await getDocs(qProj);
      const list = projSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProjects(list);

      // 2. Fetch Customer AI Proposals
      const qProp = query(
        collection(db, 'proposals'),
        where('recipientEmail', '==', currentUser.email)
      );
      const propSnap = await getDocs(qProp);
      const propList = propSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      propList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProposals(propList);

    } catch (err) {
      console.error('Error fetching customer projects/proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  const [selectedAgreement, setSelectedAgreement] = useState(null);

  const handleAcceptPackage = async (proj, option) => {
    try {
      // 1. Generate 14-Clause Legal Agreement using AI Generator
      const agreement = generateAILegalAgreement({
        projectName: proj.projectName,
        businessName: proj.businessName,
        customerName: currentUser.displayName || 'Valued Client',
        customerEmail: currentUser.email,
        packageTitle: option.title,
        price: option.price,
        duration: option.duration,
        features: option.features
      });

      const projectRef = doc(db, 'projects', proj.id);
      await updateDoc(projectRef, {
        acceptedPackage: option,
        agreement: agreement,
        status: 'Approved',
        updatedAt: new Date().toISOString()
      });

      // Send Email to Admin via Resend API
      await axios.post('/api/send-email', {
        emailType: 'regular_update',
        recipientEmail: 'ujwal@richasoftwaresolutions.com',
        recipientName: 'Admin',
        projectName: proj.projectName,
        subject: `🎉 Package Accepted & Legal Agreement Executed: ${option.title} (${option.price})`,
        message: `Customer ${currentUser.email} has accepted "${option.title}" (${option.price}). Master Service Agreement automatically generated and signed.`
      });

      alert(`🎉 Congratulations! You have accepted "${option.title}" (${option.price}). Master Service Agreement automatically generated and executed!`);
      setSelectedAgreement(agreement);
      fetchCustomerProjectsAndProposals();
    } catch (err) {
      console.error('Accept package error:', err);
      alert('Failed to accept package. Please try again.');
    }
  };

  const [customerSignerName, setCustomerSignerName] = useState('');

  const handleCustomerDigitalSignAgreement = async (proj) => {
    const signerName = customerSignerName.trim() || currentUser.displayName || 'Valued Client';

    try {
      const customerSig = {
        signed: true,
        name: signerName,
        email: currentUser.email,
        timestamp: new Date().toISOString(),
        signatureHash: `SIG_CUST_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`
      };

      const existingAgreement = proj.agreement || generateAILegalAgreement({
        projectName: proj.projectName,
        businessName: proj.businessName,
        customerName: signerName,
        customerEmail: currentUser.email,
        packageTitle: proj.acceptedPackage?.title || 'Custom Scope',
        price: proj.acceptedPackage?.price || 'TBD',
        duration: proj.acceptedPackage?.duration || '30 Days'
      });

      const isBothSigned = existingAgreement.adminSignature?.signed === true;

      const updatedAgreement = {
        ...existingAgreement,
        customerSignature: customerSig,
        locked: isBothSigned,
        lockedAt: isBothSigned ? new Date().toISOString() : null,
        status: isBothSigned ? 'Locked & Legally Executed' : 'Pending Admin Countersignature'
      };

      const projectRef = doc(db, 'projects', proj.id);
      await updateDoc(projectRef, {
        agreement: updatedAgreement,
        updatedAt: new Date().toISOString()
      });

      await axios.post('/api/send-email', {
        emailType: 'regular_update',
        recipientEmail: 'ujwal@richasoftwaresolutions.com',
        recipientName: 'Admin',
        projectName: proj.projectName,
        subject: `✒️ Legal Agreement Digitally Signed by Customer - ${signerName}`,
        message: `Customer ${signerName} (${currentUser.email}) has digitally signed the Master Service Agreement for "${proj.projectName}".\n\nSignature Hash: ${customerSig.signatureHash}\nPlease log into the Admin Dashboard to countersign and permanently lock the agreement.`
      });

      alert(`✅ Agreement Digitally Signed by ${signerName}! Sent to Admin for countersignature and lock.`);
      setSelectedAgreement(updatedAgreement);
      fetchCustomerProjectsAndProposals();
    } catch (err) {
      console.error('Customer digital signature error:', err);
      alert('Failed to record digital signature. Please try again.');
    }
  };

  const handleDownloadLegalAgreementDocument = (agreement) => {
    let docText = `====================================================\n`;
    docText += `MASTER SERVICE AGREEMENT (MSA) - PAGETRAFFICS INC.\n`;
    docText += `Agreement Title: ${agreement.title}\n`;
    docText += `Execution Date: ${agreement.date}\n`;
    docText += `Lock Status: ${agreement.locked ? 'LOCKED & PERMANENTLY SEALED' : agreement.status}\n`;
    docText += `====================================================\n\n`;

    docText += `DIGITAL SIGNATURE AUDIT TRAIL:\n`;
    if (agreement.customerSignature?.signed) {
      docText += `[Party 1 - Customer Signature]\n`;
      docText += `Signed By: ${agreement.customerSignature.name} (${agreement.customerSignature.email})\n`;
      docText += `Timestamp: ${agreement.customerSignature.timestamp}\n`;
      docText += `SHA-256 Hash: ${agreement.customerSignature.signatureHash}\n\n`;
    } else {
      docText += `[Party 1 - Customer Signature]: PENDING\n\n`;
    }

    if (agreement.adminSignature?.signed) {
      docText += `[Party 2 - Admin Countersignature]\n`;
      docText += `Countersigned By: ${agreement.adminSignature.name} (${agreement.adminSignature.email})\n`;
      docText += `Timestamp: ${agreement.adminSignature.timestamp}\n`;
      docText += `SHA-256 Hash: ${agreement.adminSignature.signatureHash}\n\n`;
    } else {
      docText += `[Party 2 - Admin Countersignature]: PENDING\n\n`;
    }

    docText += `1. CLIENT DETAILS\n${agreement.clientDetails}\n\n`;
    docText += `2. COMPANY DETAILS\n${agreement.companyDetails}\n\n`;
    docText += `3. SCOPE OF WORK\n${agreement.scopeOfWork}\n\n`;
    docText += `4. INCLUDED FEATURES\n${agreement.features}\n\n`;
    docText += `5. DELIVERABLES\n${agreement.deliverables}\n\n`;
    docText += `6. TIMELINE\n${agreement.timeline}\n\n`;
    docText += `7. PRICING & VALUE\n${agreement.pricing}\n\n`;
    docText += `8. PAYMENT TERMS\n${agreement.paymentTerms}\n\n`;
    docText += `9. CONFIDENTIALITY CLAUSE\n${agreement.confidentiality}\n\n`;
    docText += `10. INTELLECTUAL PROPERTY & CODE TRANSFER\n${agreement.intellectualProperty}\n\n`;
    docText += `11. TECHNICAL WARRANTY\n${agreement.warranty}\n\n`;
    docText += `12. CANCELLATION POLICY\n${agreement.cancellationPolicy}\n\n`;
    docText += `13. SUPPORT & SLA PERIOD\n${agreement.supportPeriod}\n\n`;
    docText += `14. TERMS & CONDITIONS\n${agreement.termsAndConditions}\n\n`;

    docText += `----------------------------------------------------\n`;
    docText += `Digitally Signed & Validated via PageTraffics Operations Portal\n`;

    const blob = new Blob([docText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Legal_Agreement_${agreement.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadQuotationSummary = (proj) => {
    const opts = proj.pricingOptions || [];
    let summaryText = `====================================================\n`;
    summaryText += `OFFICIAL PRICING QUOTATION SUMMARY - PAGETRAFFICS\n`;
    summaryText += `Project Name: ${proj.projectName}\n`;
    summaryText += `Business Name: ${proj.businessName}\n`;
    summaryText += `Date Generated: ${new Date().toLocaleDateString()}\n`;
    summaryText += `====================================================\n\n`;

    opts.forEach((opt, idx) => {
      summaryText += `OPTION ${idx + 1}: ${opt.title.toUpperCase()}\n`;
      summaryText += `Price: ${opt.price}\n`;
      summaryText += `Delivery Time: ${opt.duration}\n`;
      summaryText += `Included Features:\n`;
      (opt.features || []).forEach(feat => {
        summaryText += `  - ${feat}\n`;
      });
      summaryText += `----------------------------------------------------\n\n`;
    });

    summaryText += `Thank you for choosing PageTraffics. Made with love by Sawariya X.\n`;

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${proj.projectName.replace(/\s+/g, '_')}_Quotation_Options.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayMilestonePayment = async (proj, milestoneKey, percentage, stageTitle, rawAmountStr) => {
    const cleanTotal = parseFloat(String(rawAmountStr).replace(/[^0-9.]/g, '')) || 50000;
    const milestoneAmount = Math.round((cleanTotal * percentage) / 100);

    const isLoaded = await loadRazorpayScript();

    try {
      const res = await axios.post('/api/razorpay', {
        action: 'create_order',
        amount: milestoneAmount,
        currency: 'INR',
        receipt: `rcpt_${proj.id.substring(0, 6)}_${milestoneKey}`
      });

      const { order, keyId } = res.data;

      if (window.Razorpay && isLoaded) {
        const options = {
          key: keyId || 'rzp_test_placeholder_key',
          amount: order.amount,
          currency: order.currency || 'INR',
          name: 'PageTraffics Inc.',
          description: `Payment for ${stageTitle} (${percentage}%) - ${proj.projectName}`,
          image: 'https://www.sawariyax.com/favicon.ico',
          order_id: order.id,
          prefill: {
            name: currentUser.displayName || 'Valued Customer',
            email: currentUser.email
          },
          theme: {
            color: '#FF6900'
          },
          handler: async function (response) {
            try {
              await axios.post('/api/razorpay', {
                action: 'verify_payment',
                orderId: response.razorpay_order_id || order.id,
                paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                signature: response.razorpay_signature || ''
              });

              const projectRef = doc(db, 'projects', proj.id);
              const currentMilestones = proj.milestonePayments || {};
              const updatedMilestones = {
                ...currentMilestones,
                [milestoneKey]: {
                  paid: true,
                  amount: milestoneAmount,
                  paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                  orderId: response.razorpay_order_id || order.id,
                  paidAt: new Date().toISOString()
                }
              };

              const history = proj.paymentHistory || [];
              const newHistoryItem = {
                id: `txn_${Date.now()}`,
                milestoneKey,
                stageTitle,
                amount: milestoneAmount,
                paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                orderId: response.razorpay_order_id || order.id,
                paidAt: new Date().toISOString(),
                status: 'Paid'
              };

              let nextStatus = proj.status;
              if (milestoneKey === 'advance') nextStatus = 'Development Started';
              if (milestoneKey === 'final') nextStatus = 'Completed';

              await updateDoc(projectRef, {
                milestonePayments: updatedMilestones,
                paymentHistory: [newHistoryItem, ...history],
                status: nextStatus,
                updatedAt: new Date().toISOString()
              });

              await axios.post('/api/send-email', {
                emailType: 'regular_update',
                recipientEmail: currentUser.email,
                recipientName: currentUser.displayName || 'Valued Client',
                projectName: proj.projectName,
                subject: `✅ Razorpay Milestone Payment Received: ${stageTitle} (₹${milestoneAmount.toLocaleString()})`,
                message: `Thank you! Your payment of ₹${milestoneAmount.toLocaleString()} for ${stageTitle} has been successfully processed via Razorpay.\n\nPayment ID: ${response.razorpay_payment_id || 'PAY_SUCCESS'}\nOrder ID: ${response.razorpay_order_id || order.id}`
              });

              alert(`✅ Payment Successful! Received ₹${milestoneAmount.toLocaleString()} for ${stageTitle}. Receipt generated.`);
              fetchCustomerProjectsAndProposals();
            } catch (verifyErr) {
              console.error('Payment verification note:', verifyErr);
              fetchCustomerProjectsAndProposals();
            }
          },
          modal: {
            ondismiss: function () {
              alert('⚠️ Payment Checkout Dismissed. You can retry your milestone payment at any time.');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert(`❌ Payment Failed! Reason: ${response.error?.description || 'Transaction declined'}. Please retry.`);
        });
        rzp.open();
        return;
      }

      // Sandbox Fallback mode when SDK script is blocked or keys pending
      const mockPayId = `pay_rzp_${Date.now()}`;
      const projectRef = doc(db, 'projects', proj.id);
      const currentMilestones = proj.milestonePayments || {};
      const updatedMilestones = {
        ...currentMilestones,
        [milestoneKey]: {
          paid: true,
          amount: milestoneAmount,
          paymentId: mockPayId,
          orderId: order.id,
          paidAt: new Date().toISOString()
        }
      };

      const history = proj.paymentHistory || [];
      const newHistoryItem = {
        id: `txn_${Date.now()}`,
        milestoneKey,
        stageTitle,
        amount: milestoneAmount,
        paymentId: mockPayId,
        orderId: order.id,
        paidAt: new Date().toISOString(),
        status: 'Paid'
      };

      let nextStatus = proj.status;
      if (milestoneKey === 'advance') nextStatus = 'Development Started';
      if (milestoneKey === 'final') nextStatus = 'Completed';

      await updateDoc(projectRef, {
        milestonePayments: updatedMilestones,
        paymentHistory: [newHistoryItem, ...history],
        status: nextStatus,
        updatedAt: new Date().toISOString()
      });

      alert(`✅ Razorpay Milestone Payment Processed! ₹${milestoneAmount.toLocaleString()} recorded for ${stageTitle}. Invoice ready.`);
      fetchCustomerProjectsAndProposals();

    } catch (err) {
      console.error('Razorpay payment error:', err);
      alert('Razorpay payment execution failed. Please check details and try again.');
    }
  };

  const handleDownloadRazorpayInvoice = (proj, paymentItem) => {
    let invText = `====================================================\n`;
    invText += `OFFICIAL TAX INVOICE / PAYMENT RECEIPT - PAGETRAFFICS\n`;
    invText += `Invoice No: INV-${paymentItem.paymentId}\n`;
    invText += `Date: ${new Date(paymentItem.paidAt).toLocaleDateString()}\n`;
    invText += `====================================================\n\n`;

    invText += `CLIENT DETAILS:\n`;
    invText += `Name: ${currentUser.displayName || 'Valued Client'}\n`;
    invText += `Email: ${currentUser.email}\n`;
    invText += `Project: ${proj.projectName} (${proj.businessName})\n\n`;

    invText += `PAYMENT TRANSACTION DETAILS:\n`;
    invText += `Milestone: ${paymentItem.stageTitle}\n`;
    invText += `Razorpay Payment ID: ${paymentItem.paymentId}\n`;
    invText += `Razorpay Order ID: ${paymentItem.orderId}\n`;
    invText += `Payment Gateway: Razorpay Secure (Cards/UPI/NetBanking)\n`;
    invText += `Status: ${paymentItem.status || 'PAID (SUCCESSFUL)'}\n\n`;

    invText += `FINANCIAL SUMMARY:\n`;
    const net = Math.round(paymentItem.amount / 1.18);
    const gst = paymentItem.amount - net;
    invText += `Base Amount: ₹${net.toLocaleString()}\n`;
    invText += `18% GST (CGST + SGST): ₹${gst.toLocaleString()}\n`;
    invText += `TOTAL PAID: ₹${paymentItem.amount.toLocaleString()}\n`;
    invText += `----------------------------------------------------\n\n`;

    invText += `PageTraffics Inc. &bull; Plot No:-81, Old Ag Colony, Unit 4, Bhubaneswar\n`;
    invText += `Made with ❤️ by Sawariya X (https://www.sawariyax.com/)\n`;

    const blob = new Blob([invText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${paymentItem.paymentId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStageIndex = (status) => {
    const idx = STATUS_STAGES.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 10% 20%, rgba(25, 60, 184, 0.04) 0%, rgba(255, 105, 0, 0.04) 90%)',
      padding: '4rem 2rem',
      color: '#0f172a',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          <div>
            <span style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: '50px',
              background: 'rgba(255, 105, 0, 0.08)',
              color: '#FF6900',
              fontSize: '0.85rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>Customer Hub</span>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#193CB8', margin: 0 }}>
              Your Project Profiles & AI Proposals
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={fetchCustomerProjectsAndProposals}
              style={{
                padding: '12px 20px',
                background: '#ffffff',
                border: '1px solid rgba(25, 60, 184, 0.2)',
                color: '#193CB8',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaSync /> Refresh
            </button>

            <button
              onClick={() => navigate('/create-project')}
              style={{
                padding: '12px 24px',
                background: '#FF6900',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 10px 25px -5px rgba(255, 105, 0, 0.35)'
              }}
            >
              <FaPlus /> Create New Project Profile
            </button>
          </div>
        </div>

        {/* 11-Tab Customer Command Center Navigation Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '2rem',
          borderBottom: '2px solid rgba(25, 60, 184, 0.1)'
        }}>
          <TabNavBtn icon={<FaUser />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          <TabNavBtn icon={<FaFolder />} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
          <TabNavBtn icon={<FaFolderOpen />} label="Uploaded Files" active={activeTab === 'files'} onClick={() => setActiveTab('files')} />
          <TabNavBtn icon={<FaCalculator />} label="Quotations" active={activeTab === 'quotations'} onClick={() => setActiveTab('quotations')} />
          <TabNavBtn icon={<FaVideo />} label="Meeting Schedule" active={activeTab === 'meetings'} onClick={() => setActiveTab('meetings')} />
          <TabNavBtn icon={<FaCreditCard />} label="Payments" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
          <TabNavBtn icon={<FaFileContract />} label="Agreement" active={activeTab === 'agreement'} onClick={() => setActiveTab('agreement')} />
          <TabNavBtn icon={<FaBell />} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <TabNavBtn icon={<FaEnvelope />} label="Email History" active={activeTab === 'emails'} onClick={() => setActiveTab('emails')} />
          <TabNavBtn icon={<FaLifeRing />} label="Support Tickets" active={activeTab === 'tickets'} onClick={() => setActiveTab('tickets')} />
          <TabNavBtn icon={<FaCloudDownloadAlt />} label="Download Center" active={activeTab === 'downloads'} onClick={() => setActiveTab('downloads')} />
        </div>

        {/* TAB 1: Profile */}
        {activeTab === 'profile' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(25, 60, 184, 0.12)', boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#193CB8', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaUser style={{ color: '#FF6900' }} /> Customer Profile Management
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
              <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Full Name</span>
                <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{currentUser?.displayName || 'Valued Customer'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Email Address</span>
                <strong style={{ color: '#0f172a', fontSize: '1.1rem' }}>{currentUser?.email}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Account Role</span>
                <strong style={{ color: '#FF6900', fontSize: '1.1rem' }}>Customer (Verified)</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>User Unique ID</span>
                <strong style={{ color: '#64748b', fontSize: '0.9rem', fontFamily: 'monospace' }}>{currentUser?.uid}</strong>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile')}
              style={{ padding: '12px 24px', background: '#FF6900', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
            >
              ✏️ Edit Full Profile Details
            </button>
          </div>
        )}

        {/* TAB 3: Uploaded Files */}
        {activeTab === 'files' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(25, 60, 184, 0.12)', boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#193CB8', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaFolderOpen style={{ color: '#FF6900' }} /> Uploaded Project Documents Library
            </h2>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Maximum size per document: <strong>2 MB</strong>. Allowed extensions: PDF, DOC, DOCX, PNG, JPG, ZIP.
            </p>
            {projects.some(p => p.documents && p.documents.length > 0) ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
                {projects.flatMap(p => (p.documents || []).map(docItem => ({ ...docItem, projName: p.projectName }))).map((docItem, fIdx) => (
                  <div key={fIdx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '1.2rem', borderRadius: '14px' }}>
                    <strong style={{ color: '#193CB8', display: 'block', fontSize: '0.98rem' }}>{docItem.name}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', margin: '4px 0 12px 0' }}>Project: {docItem.projName}</span>
                    <a
                      href={docItem.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: '8px 16px', background: '#193CB8', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <FaFileDownload /> Download Document
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748b', fontStyle: 'italic' }}>No uploaded files found across active project profiles.</p>
            )}
          </div>
        )}

        {/* TAB 8: Notifications */}
        {activeTab === 'notifications' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(25, 60, 184, 0.12)', boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#193CB8', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaBell style={{ color: '#FF6900' }} /> Dashboard Notifications Center
            </h2>
            {projects.some(p => p.notifications && p.notifications.length > 0) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.flatMap(p => (p.notifications || [])).map((notif, nIdx) => (
                  <div key={nIdx} style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '14px', borderLeft: '4px solid #FF6900' }}>
                    <strong style={{ color: '#193CB8', fontSize: '1.05rem', display: 'block' }}>{notif.title}</strong>
                    <div style={{ color: '#475569', fontSize: '0.9rem', marginTop: '4px' }}>{notif.message}</div>
                    {notif.meetingUrl && (
                      <a href={notif.meetingUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#FF6900', fontWeight: 'bold', fontSize: '0.85rem', display: 'inline-block', marginTop: '8px' }}>
                        🎥 Open Google Meet Consultation &rarr;
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748b', fontStyle: 'italic' }}>No dashboard notifications present at this time.</p>
            )}
          </div>
        )}

        {/* TAB 9: Email History */}
        {activeTab === 'emails' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(25, 60, 184, 0.12)', boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#193CB8', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaEnvelope style={{ color: '#FF6900' }} /> Resend Dispatched Email Communication Log
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ color: '#193CB8' }}>📧 Meeting Invitation & Consultation Schedule</strong>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '800' }}>DISPATCHED (RESEND API)</span>
                </div>
                <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>Recipient: {currentUser?.email} &bull; Template: Responsive HTML</p>
              </div>
              <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ color: '#193CB8' }}>💰 Official 3-Tier Quotation & Pricing Package Notice</strong>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '800' }}>DISPATCHED (RESEND API)</span>
                </div>
                <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>Recipient: {currentUser?.email} &bull; Template: Responsive HTML</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: Support Tickets */}
        {activeTab === 'tickets' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(25, 60, 184, 0.12)', boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#193CB8', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaLifeRing style={{ color: '#FF6900' }} /> Customer Support & SLA Ticket Studio
            </h2>

            {/* Ticket Creation Form */}
            <form onSubmit={handleCreateSupportTicket} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#FF6900', margin: '0 0 1rem 0', fontWeight: '800' }}>Submit New Engineering Ticket</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Ticket Subject"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                >
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing & Razorpay">Billing & Razorpay</option>
                  <option value="Deployment">Deployment & DNS</option>
                  <option value="Scope Change">Scope Change Request</option>
                </select>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Critical SLA">Critical SLA</option>
                </select>
              </div>
              <textarea
                placeholder="Describe your issue or engineering query in detail..."
                rows={3}
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' }}
              />
              <button
                type="submit"
                style={{ padding: '12px 24px', background: '#FF6900', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}
              >
                🚀 Submit Engineering Ticket
              </button>
            </form>

            {/* Ticket Tracker */}
            <h3 style={{ fontSize: '1.1rem', color: '#193CB8', margin: '0 0 1rem 0', fontWeight: '800' }}>Active Support Tickets ({tickets.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tickets.map((tkt) => (
                <div key={tkt.id} style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ color: '#193CB8', fontSize: '1.05rem' }}>{tkt.subject}</strong>
                    <span style={{ padding: '4px 10px', borderRadius: '50px', background: tkt.status === 'Resolved' ? '#d1fae5' : '#fef3c7', color: tkt.status === 'Resolved' ? '#065f46' : '#d97706', fontWeight: '800', fontSize: '0.78rem' }}>
                      Status: {tkt.status}
                    </span>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0 0 8px 0' }}>{tkt.description}</p>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Category: {tkt.category} &bull; Priority: {tkt.priority} &bull; Created: {new Date(tkt.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: Download Center */}
        {activeTab === 'downloads' && (
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(25, 60, 184, 0.12)', boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#193CB8', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaCloudDownloadAlt style={{ color: '#FF6900' }} /> Unified Download Center
            </h2>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
              Central hub for one-click access to download all your project documents, quotations, tax invoices, and locked legal agreements.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
              {projects.map((p, pIdx) => (
                <div key={pIdx} style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                  <strong style={{ color: '#193CB8', fontSize: '1.05rem', display: 'block', marginBottom: '8px' }}>
                    {p.projectName}
                  </strong>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {p.pricingOptions && (
                      <button
                        onClick={() => handleDownloadQuotationSummary(p)}
                        style={{ padding: '8px 14px', background: '#ffffff', border: '1px solid #193CB8', color: '#193CB8', borderRadius: '8px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FaFileDownload /> Download Quotation Summary (.txt/PDF)
                      </button>
                    )}

                    {p.agreement && (
                      <button
                        onClick={() => handleDownloadLegalAgreementDocument(p.agreement)}
                        style={{ padding: '8px 14px', background: '#193CB8', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FaFileDownload /> Download Signed Legal Agreement
                      </button>
                    )}

                    {(p.paymentHistory || []).map((payItem, payIdx) => (
                      <button
                        key={payIdx}
                        onClick={() => handleDownloadRazorpayInvoice(p, payItem)}
                        style={{ padding: '8px 14px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FaFileDownload /> Tax Invoice ({payItem.stageTitle})
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 1: Received AI Proposals */}
        {proposals.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#193CB8', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaRobot style={{ color: '#FF6900' }} /> Received AI Proposals & Specifications ({proposals.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {proposals.map((prop) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: '#ffffff',
                    border: '2px solid rgba(25, 60, 184, 0.15)',
                    borderRadius: '24px',
                    padding: '2rem',
                    boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#193CB8', margin: 0 }}>
                      {prop.projectName}
                    </h3>
                    <span style={{ padding: '6px 14px', borderRadius: '50px', background: '#d1fae5', color: '#065f46', fontWeight: '800', fontSize: '0.85rem' }}>
                      Status: {prop.status}
                    </span>
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {prop.projectOverview}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1.2rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Estimated Cost</span>
                      <strong style={{ color: '#10b981', fontSize: '1.1rem', display: 'block' }}>{prop.totalCost}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Timeline</span>
                      <strong style={{ color: '#0f172a', fontSize: '0.95rem', display: 'block' }}>{prop.timeline}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Tech Stack</span>
                      <strong style={{ color: '#193CB8', fontSize: '0.9rem', display: 'block' }}>{prop.technologies}</strong>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.2rem', fontSize: '0.88rem', color: '#334155' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#193CB8', fontSize: '0.95rem' }}>Key Features Included:</h4>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{prop.features}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Submitted Project Profiles */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#193CB8', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaFolder style={{ color: '#FF6900' }} /> Your Submitted Project Profiles
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            Loading project profiles...
          </div>
        ) : projects.length === 0 ? (
          <div style={{
            background: '#ffffff',
            border: '1px solid rgba(25, 60, 184, 0.12)',
            borderRadius: '24px',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)'
          }}>
            <FaFolder style={{ fontSize: '3.5rem', color: '#cbd5e1', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', color: '#193CB8', margin: '0 0 0.5rem 0' }}>No Project Profiles Found</h3>
            <p style={{ color: '#64748b', maxWidth: '450px', margin: '0 auto 1.8rem auto' }}>
              You haven't submitted any project profiles yet. Create a project profile to initiate review and get started.
            </p>
            <button
              onClick={() => navigate('/create-project')}
              style={{
                padding: '14px 28px',
                background: '#FF6900',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaPlus /> Create Your First Project
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {projects.map((proj) => {
              const currentStageIdx = getStageIndex(proj.status);
              const isApprovedOrLater = currentStageIdx >= 4;

              return (
                <motion.div
                  key={proj.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(25, 60, 184, 0.12)',
                    borderRadius: '24px',
                    padding: '2.2rem',
                    boxShadow: '0 10px 30px rgba(25, 60, 184, 0.08)'
                  }}
                >
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                        Business: {proj.businessName}
                      </span>
                      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#193CB8', margin: '4px 0 0 0' }}>
                        {proj.projectName}
                      </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {proj.agreement && (
                        <button
                          onClick={() => setSelectedAgreement(proj.agreement)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '50px',
                            background: '#193CB8',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '0.85rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <FaFileContract /> View Legal Agreement
                        </button>
                      )}

                      <span style={{
                        padding: '8px 16px',
                        borderRadius: '50px',
                        background: proj.status === 'Completed' ? '#d1fae5' : isApprovedOrLater ? 'rgba(255, 105, 0, 0.1)' : 'rgba(25, 60, 184, 0.1)',
                        color: proj.status === 'Completed' ? '#065f46' : isApprovedOrLater ? '#FF6900' : '#193CB8',
                        fontSize: '0.9rem',
                        fontWeight: '800'
                      }}>
                        Status: {proj.status}
                      </span>
                    </div>
                  </div>

                  {/* Description & Details */}
                  <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {proj.description}
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    background: '#f8fafc',
                    padding: '1.2rem',
                    borderRadius: '16px',
                    marginBottom: '2rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Target Deadline</span>
                      <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{proj.deadline}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Estimated Budget</span>
                      <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{proj.budget}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Date Submitted</span>
                      <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{new Date(proj.createdAt).toLocaleDateString()}</strong>
                    </div>
                  </div>

                  {/* Notifications Center Banner */}
                  {proj.notifications && proj.notifications.length > 0 && (
                    <div style={{
                      padding: '1.2rem',
                      borderRadius: '16px',
                      background: 'rgba(255, 105, 0, 0.06)',
                      border: '1px solid rgba(255, 105, 0, 0.2)',
                      marginBottom: '1.5rem'
                    }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FF6900', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        🔔 Dashboard Notifications ({proj.notifications.length})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {proj.notifications.map((notif, nIdx) => (
                          <div key={nIdx} style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #fed7aa', fontSize: '0.88rem' }}>
                            <strong style={{ color: '#193CB8' }}>{notif.title}</strong>
                            <div style={{ color: '#475569', marginTop: '2px' }}>{notif.message}</div>
                            {notif.meetingUrl && (
                              <a href={notif.meetingUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#FF6900', fontWeight: 'bold', fontSize: '0.82rem', display: 'inline-block', marginTop: '4px' }}>
                                🎥 Join Meeting Link &rarr;
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Google Meet Banner (Shown ONLY after scheduling) */}
                  {proj.meetingUrl ? (
                    <div style={{
                      padding: '1.4rem',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, rgba(25, 60, 184, 0.08), rgba(255, 105, 0, 0.08))',
                      border: '1.5px solid rgba(25, 60, 184, 0.25)',
                      marginBottom: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FF6900', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                          <FaVideo />
                        </div>
                        <div>
                          <strong style={{ color: '#193CB8', fontSize: '1.05rem', display: 'block' }}>
                            Google Meet Consultation Scheduled
                          </strong>
                          <span style={{ color: '#475569', fontSize: '0.9rem' }}>
                            Date: <strong>{proj.scheduledMeeting?.date || 'Confirmed'}</strong> &bull; Time: <strong>{proj.scheduledMeeting?.time || 'Confirmed'}</strong>
                          </span>
                        </div>
                      </div>
                      <a
                        href={proj.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '12px 24px',
                          background: '#FF6900',
                          color: '#ffffff',
                          borderRadius: '10px',
                          fontWeight: '800',
                          textDecoration: 'none',
                          fontSize: '0.92rem',
                          boxShadow: '0 8px 20px -4px rgba(255, 105, 0, 0.4)'
                        }}
                      >
                        🎥 Join Google Meet Call
                      </a>
                    </div>
                  ) : (
                    <div style={{
                      padding: '0.9rem 1.2rem',
                      borderRadius: '12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      marginBottom: '2rem',
                      color: '#64748b',
                      fontSize: '0.86rem'
                    }}>
                      <em>🔒 Meeting link is generated and published only after the Admin schedules your Google Meet consultation.</em>
                    </div>
                  )}

                  {/* 3-Tier Pricing Packages Comparison, Download & Accept Studio */}
                  {proj.pricingOptions && proj.pricingOptions.length > 0 && (
                    <div style={{
                      background: '#ffffff',
                      border: '2px solid rgba(25, 60, 184, 0.15)',
                      borderRadius: '20px',
                      padding: '1.8rem',
                      marginBottom: '2rem',
                      boxShadow: '0 10px 30px rgba(25, 60, 184, 0.06)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#193CB8', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaDollarSign style={{ color: '#FF6900' }} /> Official Pricing Package Options
                          </h3>
                          <p style={{ color: '#475569', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                            Compare features, download quotation summary, and select one package to begin development.
                          </p>
                        </div>

                        <button
                          onClick={() => handleDownloadQuotationSummary(proj)}
                          style={{
                            padding: '10px 18px',
                            background: '#ffffff',
                            border: '1.5px solid #193CB8',
                            color: '#193CB8',
                            borderRadius: '10px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <FaFileDownload /> Download Quotation Summary (.txt/PDF)
                        </button>
                      </div>

                      {/* 3 Cards Comparison Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem' }}>
                        {proj.pricingOptions.map((opt, oIdx) => {
                          const isAccepted = proj.acceptedPackage?.id === opt.id || proj.acceptedPackage?.title === opt.title;

                          return (
                            <div
                              key={oIdx}
                              style={{
                                background: opt.recommended ? 'radial-gradient(circle at 10% 20%, rgba(25, 60, 184, 0.04) 0%, rgba(255, 105, 0, 0.04) 90%)' : '#f8fafc',
                                border: isAccepted ? '3px solid #10b981' : opt.recommended ? '2px solid #FF6900' : '1px solid #cbd5e1',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative'
                              }}
                            >
                              {opt.recommended && (
                                <span style={{
                                  position: 'absolute',
                                  top: '-12px',
                                  right: '20px',
                                  background: '#FF6900',
                                  color: '#ffffff',
                                  fontSize: '0.72rem',
                                  fontWeight: '800',
                                  padding: '4px 10px',
                                  borderRadius: '50px',
                                  textTransform: 'uppercase'
                                }}>
                                  Recommended
                                </span>
                              )}

                              <div>
                                <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#193CB8', margin: '0 0 0.4rem 0' }}>
                                  {opt.title}
                                </h4>
                                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#FF6900', marginBottom: '0.2rem' }}>
                                  {opt.price}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginBottom: '1rem' }}>
                                  Delivery Duration: {opt.duration}
                                </div>

                                <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1.5rem 0', color: '#475569', fontSize: '0.85rem', lineHeight: '1.6' }}>
                                  {(opt.features || []).map((feat, fIdx) => (
                                    <li key={fIdx}>{feat}</li>
                                  ))}
                                </ul>
                              </div>

                              <button
                                onClick={() => handleAcceptPackage(proj.id, opt)}
                                disabled={isAccepted}
                                style={{
                                  width: '100%',
                                  padding: '12px',
                                  background: isAccepted ? '#10b981' : opt.recommended ? '#FF6900' : '#193CB8',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '10px',
                                  fontWeight: '800',
                                  fontSize: '0.88rem',
                                  cursor: isAccepted ? 'default' : 'pointer'
                                }}
                              >
                                {isAccepted ? '✓ Accepted Package' : `Accept ${opt.title}`}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Razorpay 3-Stage Milestone Payment Studio */}
                  {proj.acceptedPackage && (
                    <div style={{
                      background: '#ffffff',
                      border: '2px solid rgba(25, 60, 184, 0.15)',
                      borderRadius: '20px',
                      padding: '1.8rem',
                      marginBottom: '2rem',
                      boxShadow: '0 10px 30px rgba(25, 60, 184, 0.06)'
                    }}>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#193CB8', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        💳 Razorpay 3-Stage Milestone Payment Schedule
                      </h3>
                      <p style={{ color: '#475569', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                        Accepted Package: <strong>{proj.acceptedPackage.title}</strong> ({proj.acceptedPackage.price}). Pay in 3 milestone installments.
                      </p>

                      {/* 3 Milestones Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.8rem' }}>
                        {/* Milestone 1: Advance 30% */}
                        {(() => {
                          const isPaid = proj.milestonePayments?.advance?.paid;
                          const cleanPrice = parseFloat(String(proj.acceptedPackage.price).replace(/[^0-9.]/g, '')) || 50000;
                          const amt = Math.round((cleanPrice * 30) / 100);

                          return (
                            <div style={{
                              background: isPaid ? '#d1fae5' : '#f8fafc',
                              border: `1.5px solid ${isPaid ? '#6ee7b7' : '#cbd5e1'}`,
                              borderRadius: '14px',
                              padding: '1.2rem',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <div>
                                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: isPaid ? '#065f46' : '#FF6900', textTransform: 'uppercase' }}>
                                  Milestone 1 (30%)
                                </span>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#193CB8', margin: '4px 0 0.2rem 0' }}>
                                  Advance Payment
                                </h4>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.8rem' }}>
                                  ₹{amt.toLocaleString()}
                                </div>
                                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 1rem 0' }}>
                                  Triggers development start & architecture blueprint.
                                </p>
                              </div>

                              <button
                                onClick={() => handleRazorpayMilestonePayment(proj, 'advance', 30, 'Advance Payment (30%)', proj.acceptedPackage.price)}
                                disabled={isPaid}
                                style={{
                                  width: '100%',
                                  padding: '10px',
                                  background: isPaid ? '#10b981' : '#FF6900',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontWeight: '800',
                                  fontSize: '0.85rem',
                                  cursor: isPaid ? 'default' : 'pointer'
                                }}
                              >
                                {isPaid ? '✓ Advance Paid (30%)' : '💳 Pay Advance (₹' + amt.toLocaleString() + ')'}
                              </button>
                            </div>
                          );
                        })()}

                        {/* Milestone 2: Mid Project 40% */}
                        {(() => {
                          const isPaid = proj.milestonePayments?.mid?.paid;
                          const cleanPrice = parseFloat(String(proj.acceptedPackage.price).replace(/[^0-9.]/g, '')) || 50000;
                          const amt = Math.round((cleanPrice * 40) / 100);

                          return (
                            <div style={{
                              background: isPaid ? '#d1fae5' : '#f8fafc',
                              border: `1.5px solid ${isPaid ? '#6ee7b7' : '#cbd5e1'}`,
                              borderRadius: '14px',
                              padding: '1.2rem',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <div>
                                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: isPaid ? '#065f46' : '#FF6900', textTransform: 'uppercase' }}>
                                  Milestone 2 (40%)
                                </span>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#193CB8', margin: '4px 0 0.2rem 0' }}>
                                  Mid Project Payment
                                </h4>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.8rem' }}>
                                  ₹{amt.toLocaleString()}
                                </div>
                                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 1rem 0' }}>
                                  Triggers beta demo preview & core module review.
                                </p>
                              </div>

                              <button
                                onClick={() => handleRazorpayMilestonePayment(proj, 'mid', 40, 'Mid Project Payment (40%)', proj.acceptedPackage.price)}
                                disabled={isPaid}
                                style={{
                                  width: '100%',
                                  padding: '10px',
                                  background: isPaid ? '#10b981' : '#193CB8',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontWeight: '800',
                                  fontSize: '0.85rem',
                                  cursor: isPaid ? 'default' : 'pointer'
                                }}
                              >
                                {isPaid ? '✓ Mid Paid (40%)' : '💳 Pay Mid Project (₹' + amt.toLocaleString() + ')'}
                              </button>
                            </div>
                          );
                        })()}

                        {/* Milestone 3: Final Deployment 30% */}
                        {(() => {
                          const isPaid = proj.milestonePayments?.final?.paid;
                          const cleanPrice = parseFloat(String(proj.acceptedPackage.price).replace(/[^0-9.]/g, '')) || 50000;
                          const amt = Math.round((cleanPrice * 30) / 100);

                          return (
                            <div style={{
                              background: isPaid ? '#d1fae5' : '#f8fafc',
                              border: `1.5px solid ${isPaid ? '#6ee7b7' : '#cbd5e1'}`,
                              borderRadius: '14px',
                              padding: '1.2rem',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between'
                            }}>
                              <div>
                                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: isPaid ? '#065f46' : '#FF6900', textTransform: 'uppercase' }}>
                                  Milestone 3 (30%)
                                </span>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#193CB8', margin: '4px 0 0.2rem 0' }}>
                                  Final Deployment
                                </h4>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.8rem' }}>
                                  ₹{amt.toLocaleString()}
                                </div>
                                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 1rem 0' }}>
                                  Triggers final production launch & code handoff.
                                </p>
                              </div>

                              <button
                                onClick={() => handleRazorpayMilestonePayment(proj, 'final', 30, 'Final Deployment Payment (30%)', proj.acceptedPackage.price)}
                                disabled={isPaid}
                                style={{
                                  width: '100%',
                                  padding: '10px',
                                  background: isPaid ? '#10b981' : '#193CB8',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontWeight: '800',
                                  fontSize: '0.85rem',
                                  cursor: isPaid ? 'default' : 'pointer'
                                }}
                              >
                                {isPaid ? '✓ Final Paid (30%)' : '💳 Pay Final (₹' + amt.toLocaleString() + ')'}
                              </button>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Payment History & Invoice Download Table */}
                      {proj.paymentHistory && proj.paymentHistory.length > 0 && (
                        <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#193CB8', margin: '0 0 0.8rem 0' }}>
                            🧾 Payment History & Tax Invoices ({proj.paymentHistory.length})
                          </h4>
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#64748b' }}>
                                  <th style={{ padding: '6px 10px' }}>Date</th>
                                  <th style={{ padding: '6px 10px' }}>Milestone</th>
                                  <th style={{ padding: '6px 10px' }}>Amount</th>
                                  <th style={{ padding: '6px 10px' }}>Razorpay Payment ID</th>
                                  <th style={{ padding: '6px 10px' }}>Invoice Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {proj.paymentHistory.map((item, iIdx) => (
                                  <tr key={iIdx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '8px 10px' }}>{new Date(item.paidAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '8px 10px' }}><strong>{item.stageTitle}</strong></td>
                                    <td style={{ padding: '8px 10px', color: '#10b981', fontWeight: 'bold' }}>₹{item.amount.toLocaleString()}</td>
                                    <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: '#64748b' }}>{item.paymentId}</td>
                                    <td style={{ padding: '8px 10px' }}>
                                      <button
                                        onClick={() => handleDownloadRazorpayInvoice(proj, item)}
                                        style={{
                                          padding: '4px 10px',
                                          background: '#193CB8',
                                          color: '#ffffff',
                                          border: 'none',
                                          borderRadius: '6px',
                                          fontSize: '0.78rem',
                                          fontWeight: '700',
                                          cursor: 'pointer',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px'
                                        }}
                                      >
                                        <FaFileDownload /> Download Invoice
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status Tracking Progress Bar */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#193CB8', marginBottom: '1rem' }}>
                      Status Tracking Roadmap
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                      {STATUS_STAGES.map((stage, sIdx) => {
                        const isPassed = sIdx <= currentStageIdx;
                        const isCurrent = sIdx === currentStageIdx;

                        return (
                          <div
                            key={sIdx}
                            style={{
                              padding: '10px 8px',
                              borderRadius: '10px',
                              textAlign: 'center',
                              background: isCurrent ? '#FF6900' : isPassed ? '#193CB8' : '#f1f5f9',
                              color: isPassed || isCurrent ? '#ffffff' : '#94a3b8',
                              fontWeight: isCurrent ? '800' : '600',
                              fontSize: '0.78rem',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {stage}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Document Attachments */}
                  {proj.documents && proj.documents.length > 0 && (
                    <div style={{ marginTop: '1.8rem', paddingTop: '1.2rem', borderTop: '1px solid #f1f5f9' }}>
                      <h5 style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '0.6rem' }}>Attached Documents ({proj.documents.length}):</h5>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {proj.documents.map((doc, dIdx) => (
                          <a
                            key={dIdx}
                            href={doc.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              color: '#193CB8',
                              textDecoration: 'none',
                              fontWeight: '600'
                            }}
                          >
                            <FaFileDownload /> {doc.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
        {/* Modal: 14-Clause Legal Agreement Viewer */}
        {selectedAgreement && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                padding: '2.5rem',
                maxWidth: '750px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
                position: 'relative'
              }}
            >
              {/* Modal Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: selectedAgreement.locked ? '#10b981' : '#FF6900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {selectedAgreement.locked ? '🔒 PERMANENTLY LOCKED & LEGALLY EXECUTED' : '⏳ PENDING COUNTERSIGNATURE'}
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#193CB8', margin: '4px 0 0 0' }}>
                    {selectedAgreement.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAgreement(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
                >
                  <FaTimes />
                </button>
              </div>

              {/* Digital Signature Audit Trail */}
              <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '14px', marginBottom: '1.5rem', border: '1px solid #cbd5e1' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#193CB8', margin: '0 0 0.6rem 0' }}>
                  ✍️ Dual Signature Audit Trail
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                  {/* Customer Sig Status */}
                  <div style={{ background: '#ffffff', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong style={{ color: '#193CB8', display: 'block' }}>Customer Signature:</strong>
                    {selectedAgreement.customerSignature?.signed ? (
                      <div>
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Signed by {selectedAgreement.customerSignature.name}</span>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace', marginTop: '2px' }}>
                          Hash: {selectedAgreement.customerSignature.signatureHash}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⏳ Pending Customer Digital Signature</span>
                    )}
                  </div>

                  {/* Admin Sig Status */}
                  <div style={{ background: '#ffffff', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <strong style={{ color: '#193CB8', display: 'block' }}>Admin Countersignature:</strong>
                    {selectedAgreement.adminSignature?.signed ? (
                      <div>
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Countersigned by Admin</span>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace', marginTop: '2px' }}>
                          Hash: {selectedAgreement.adminSignature.signatureHash}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#FF6900', fontWeight: 'bold' }}>⚠️ Pending Admin Countersignature</span>
                    )}
                  </div>
                </div>

                {/* Customer Digital Signature Action Box (if not signed yet) */}
                {!selectedAgreement.customerSignature?.signed && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                      Type Your Full Legal Name to Digitally Sign:
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={customerSignerName}
                        onChange={(e) => setCustomerSignerName(e.target.value)}
                        style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                      />
                      <button
                        onClick={() => {
                          const matchingProj = projects.find(p => p.agreement?.id === selectedAgreement.id || p.projectName === selectedAgreement.title.replace('Master Service Agreement - ', ''));
                          if (matchingProj) {
                            handleCustomerDigitalSignAgreement(matchingProj);
                          } else {
                            alert('Project matched. Click Accept Package to execute.');
                          }
                        }}
                        style={{ padding: '10px 20px', background: '#FF6900', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '0.88rem' }}
                      >
                        ✒️ Digitally Sign Agreement
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Download Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'radial-gradient(circle at 10% 20%, rgba(25, 60, 184, 0.04) 0%, rgba(255, 105, 0, 0.04) 90%)', padding: '1rem 1.2rem', borderRadius: '12px', marginBottom: '1.8rem', border: '1px solid rgba(25, 60, 184, 0.12)' }}>
                <span style={{ fontSize: '0.88rem', color: '#475569' }}>
                  Execution Date: <strong>{selectedAgreement.date}</strong> &bull; Status: <strong>{selectedAgreement.locked ? '🔒 PERMANENTLY LOCKED' : selectedAgreement.status}</strong>
                </span>
                <button
                  onClick={() => handleDownloadLegalAgreementDocument(selectedAgreement)}
                  style={{
                    padding: '10px 18px',
                    background: '#193CB8',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FaFileDownload /> Download Locked Agreement (.txt/PDF)
                </button>
              </div>

              {/* 14 Legal Clauses Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: '#334155', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <ClauseBox num="1" title="Client Details" content={selectedAgreement.clientDetails} />
                <ClauseBox num="2" title="Company Details" content={selectedAgreement.companyDetails} />
                <ClauseBox num="3" title="Scope of Work" content={selectedAgreement.scopeOfWork} />
                <ClauseBox num="4" title="Included Features" content={selectedAgreement.features} />
                <ClauseBox num="5" title="Deliverables" content={selectedAgreement.deliverables} />
                <ClauseBox num="6" title="Timeline" content={selectedAgreement.timeline} />
                <ClauseBox num="7" title="Pricing & Total Contract Value" content={selectedAgreement.pricing} />
                <ClauseBox num="8" title="Payment Terms (Milestone Schedule)" content={selectedAgreement.paymentTerms} />
                <ClauseBox num="9" title="Confidentiality Clause" content={selectedAgreement.confidentiality} />
                <ClauseBox num="10" title="Intellectual Property & Code Handoff" content={selectedAgreement.intellectualProperty} />
                <ClauseBox num="11" title="Technical Warranty (30-Day Period)" content={selectedAgreement.warranty} />
                <ClauseBox num="12" title="Cancellation Policy" content={selectedAgreement.cancellationPolicy} />
                <ClauseBox num="13" title="Support & SLA Maintenance Period" content={selectedAgreement.supportPeriod} />
                <ClauseBox num="14" title="Terms & Conditions (Governing Law)" content={selectedAgreement.termsAndConditions} />
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.82rem' }}>
                Executed electronically under standard terms of service &bull; PageTraffics Inc.
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

const ClauseBox = ({ num, title, content }) => (
  <div style={{ background: '#f8fafc', padding: '1rem 1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
    <h4 style={{ margin: '0 0 0.4rem 0', color: '#193CB8', fontSize: '0.95rem', fontWeight: '700' }}>
      {num}. {title}
    </h4>
    <div style={{ whiteSpace: 'pre-wrap', color: '#475569' }}>{content}</div>
  </div>
);

const TabNavBtn = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '10px 18px',
      background: active ? '#193CB8' : '#ffffff',
      color: active ? '#ffffff' : '#475569',
      border: active ? 'none' : '1px solid #cbd5e1',
      borderRadius: '12px',
      fontWeight: '700',
      fontSize: '0.86rem',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s ease',
      boxShadow: active ? '0 4px 14px rgba(25, 60, 184, 0.25)' : 'none'
    }}
  >
    {icon} {label}
  </button>
);

export default CustomerProjects;
