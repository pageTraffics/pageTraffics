/**
 * AI Legal Agreement Generator Engine
 * Generates enterprise-grade, 14-clause Master Service Agreements (MSA) based on approved project scope
 */

export const generateAILegalAgreement = ({
  projectName,
  businessName,
  customerName,
  customerEmail,
  packageTitle,
  price,
  duration,
  features = []
}) => {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const clientDetails = `Client Name: ${customerName || 'Valued Client'}\nEmail Address: ${customerEmail}\nBusiness Name: ${businessName || 'Client Organization'}`;

  const companyDetails = `Company Name: PageTraffics Inc.\nRegistered Address: Plot No:-81, Old Ag Colony, Unit 4, Bhubaneswar\nEngineering Partner: Sawariya X (https://www.sawariyax.com/)\nOfficial Contact: ujwal@richasoftwaresolutions.com`;

  const scopeOfWork = `PageTraffics Inc. agrees to provide software engineering, architectural design, frontend/backend development, testing, and cloud deployment services for "${projectName}". Development will adhere strictly to the approved technical specification blueprint.`;

  const featuresText = Array.isArray(features) && features.length > 0
    ? features.map(f => `• ${f}`).join('\n')
    : `• Custom Web/Mobile Application Development\n• User Authentication & Role-Based Access Control\n• Interactive Admin Operations Portal\n• Resend Email & Payment Gateway Integration`;

  const deliverables = `1. Production Ready Source Code Repository\n2. Admin Operations Dashboard Access\n3. Database Schema & Architecture Blueprint\n4. Deployment Configuration & Handoff Documentation\n5. 30-Day Post-Launch Technical Warranty`;

  const timeline = `Estimated Duration: ${duration || '30-60 Days'} from initial deposit confirmation. Development executed in 2-week sprint cycles.`;

  const pricing = `Total Contract Value: ${price || 'As Per Accepted Package'} (Inclusive of applicable tax itemizations).`;

  const paymentTerms = `Milestone Payment Schedule:\n- Advance Payment (30%): Due upon agreement execution to initiate sprint setup.\n- Mid-Project Payment (40%): Due upon beta milestone demonstration.\n- Final Deployment Payment (30%): Due prior to final production release and IP handoff.`;

  const confidentiality = `Both parties agree to treat all proprietary code, trade secrets, business metrics, and customer data disclosed during the term of this agreement as strictly confidential. Neither party shall disclose such information to third parties without prior written consent.`;

  const intellectualProperty = `Upon receipt of full and final payment, PageTraffics Inc. irrevocably transfers all intellectual property rights, copyrights, and source code ownership of "${projectName}" to the Client. PageTraffics retains rights to pre-existing general frameworks and developer libraries.`;

  const warranty = `PageTraffics warrants that the delivered software will perform substantially in accordance with the specification for a period of 30 days post-deployment ("Warranty Period"). Any severity-1 bugs or defects identified during this period will be resolved at no additional charge.`;

  const cancellationPolicy = `Either party may terminate this agreement upon 14 days written notice. In the event of cancellation, the Client shall pay for all work completed up to the date of termination, and PageTraffics shall deliver all completed work products.`;

  const supportPeriod = `Includes 30 Days of complementary post-launch maintenance, server monitoring, and technical support following production deployment. Extended SLA support plans are available upon request.`;

  const termsAndConditions = `This Agreement is governed by the laws of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the courts in Bhubaneswar, Odisha.`;

  return {
    id: `msa_${Date.now()}`,
    title: `Master Service Agreement - ${projectName}`,
    date: dateStr,
    status: 'Signed & Active',
    clientDetails,
    companyDetails,
    scopeOfWork,
    features: featuresText,
    deliverables,
    timeline,
    pricing,
    paymentTerms,
    confidentiality,
    intellectualProperty,
    warranty,
    cancellationPolicy,
    supportPeriod,
    termsAndConditions
  };
};
