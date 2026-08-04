/**
 * AI Proposal Generation Engine
 * Generates structured 9-section proposals from simple admin prompts using AI
 */

export const generateAIProposalFromPrompt = async (promptText, projectName = '', customerName = 'Valued Client') => {
  const prompt = promptText || 'Build a custom web application with admin dashboard';
  const name = projectName || extractProjectName(prompt);

  // Default structured proposal template populated based on prompt keywords
  const isRealEstate = /real estate|property|listing/i.test(prompt);
  const isECommerce = /e-commerce|shop|store|cart/i.test(prompt);
  const isMobileApp = /mobile|ios|android|app/i.test(prompt);

  let overview = `PageTraffics is pleased to present this comprehensive technical proposal for "${name}". Based on your specifications ("${prompt}"), our engineering team will build a secure, high-performance digital product tailored to scale your operations.`;

  let features = [
    'User Authentication & Role-Based Access Control (Customer & Admin roles)',
    'Responsive High-Conversion Interface with Glassmorphism & Light Theme UI',
    'Interactive Real-Time Dashboard & Analytics Monitoring',
    'Automated Email & SMS Notifications System',
    'Database Security & Cloud Infrastructure Deployment'
  ];

  if (isRealEstate) {
    features.push(
      'Property Listings Catalog with Advanced Filtering (Price, Location, Bedrooms)',
      'Agent Consultation Scheduling & Virtual Tour Integration',
      'Interactive Location Map & Lead Capture System'
    );
  } else if (isECommerce) {
    features.push(
      'Product Catalog & Inventory Management System',
      'Secure Shopping Cart & Stripe/PayPal Payment Gateway Integration',
      'Order Tracking & Automated Customer Receipt Generation'
    );
  } else if (isMobileApp) {
    features.push(
      'Cross-Platform iOS & Android Native Performance',
      'Push Notifications & Offline Data Caching',
      'Biometric Login & In-App Messaging'
    );
  }

  let scopeOfWork = [
    'Phase 1: Requirements Gathering, UX Wireframing, and Architectural Design',
    'Phase 2: Frontend & Backend Engineering, API Integration, and Database Schema Setup',
    'Phase 3: Security Auditing, Performance Optimization, and Cross-Device Testing',
    'Phase 4: Production Cloud Deployment, Domain Configuration, and Handoff Training'
  ];

  let technologies = 'React.js, Node.js, Firebase Auth & Firestore, TailwindCSS, Resend Email API, Vercel/Cloud Hosting';

  let timeline = '4 to 6 Weeks (Sprint Iteration Delivery)';

  let deliverables = [
    'Fully Functional Production Application (Web / Mobile)',
    'Admin Portal Access with Role-Based Controls',
    'Complete Source Code Repository & Documentation',
    '30-Day Post-Launch Maintenance & Technical Support'
  ];

  let assumptions = [
    'Client will provide necessary branding assets, logos, and domain access.',
    'Third-party API credentials (if applicable) will be provided promptly.',
    'Scope changes outside this document will be evaluated via change requests.'
  ];

  let costBreakdown = [
    { item: 'UI/UX Design & Architecture Blueprint', cost: '$750' },
    { item: 'Full-Stack Frontend & Backend Engineering', cost: '$2,250' },
    { item: 'Admin Operations Portal & RBAC Integration', cost: '$950' },
    { item: 'Security Hardening, Testing & Production Deployment', cost: '$550' }
  ];

  let termsAndConditions = '50% upfront deposit upon proposal acceptance, 50% upon final production deployment. 30-day warranty period included.';

  return {
    projectName: name,
    projectOverview: overview,
    features: features.join('\n• '),
    scopeOfWork: scopeOfWork.join('\n'),
    technologies: technologies,
    timeline: timeline,
    deliverables: deliverables.join('\n• '),
    assumptions: assumptions.join('\n• '),
    costBreakdown: JSON.stringify(costBreakdown, null, 2),
    totalCost: '$4,500.00',
    termsAndConditions: termsAndConditions
  };
};

const extractProjectName = (prompt) => {
  const words = prompt.split(' ');
  if (words.length <= 4) return prompt;
  return words.slice(0, 5).join(' ') + '...';
};
