import { Resend } from 'resend';

// Simple in-memory rate limiting store
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

// Helper to generate Responsive HTML Templates for all 7 Admin Email Types
const renderEmailTemplate = ({ type, recipientName, projectName, data, message }) => {
  const brandHeader = `
    <div style="background: linear-gradient(135deg, #193CB8, #FF6900); padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">
        <span>PAGE</span><span style="color: #FF6900;">TRAFFICS</span>
      </h1>
      <p style="color: rgba(255,255,255,0.9); margin: 6px 0 0; font-size: 13px; font-weight: 500;">
        Software Engineering & Growth Solutions
      </p>
    </div>
  `;

  const brandFooter = `
    <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 6px 0;"><strong>PageTraffics Inc.</strong> &bull; Plot No:-81, Old Ag Colony, Unit 4, Bhubaneswar</p>
      <p style="margin: 0;">© ${new Date().getFullYear()} PageTraffics. Made with ❤️ by <a href="https://www.sawariyax.com/" style="color: #193CB8; text-decoration: none;">Sawariya X</a>.</p>
    </div>
  `;

  let contentBody = '';

  switch (type) {
    case 'quotation':
      contentBody = `
        <h2 style="color: #193CB8; margin-top: 0;">Official Project Quotation</h2>
        <p style="color: #475569; font-size: 15px;">Hello ${recipientName || 'Valued Client'},</p>
        <p style="color: #475569; font-size: 15px;">We have generated an official quotation for your project <strong>${projectName || 'Initiative'}</strong>:</p>
        
        <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #cbd5e1; margin: 20px 0;">
          <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #334155;">Service Scope:</strong> ${data.serviceTitle || 'Software Development'}</p>
          <p style="margin: 6px 0; font-size: 18px;"><strong style="color: #FF6900;">Total Amount:</strong> $${data.amount || '0.00'}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong style="color: #334155;">Validity Period:</strong> ${data.validDays || 15} Days</p>
        </div>

        <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #FF6900; font-size: 14px; color: #1e293b; white-space: pre-wrap; margin-bottom: 20px;">
          ${message || 'Please review the quotation details above and let us know if you have any questions.'}
        </div>
      `;
      break;

    case 'meeting_invitation':
      contentBody = `
        <h2 style="color: #193CB8; margin-top: 0;">Project Consultation Meeting Invitation</h2>
        <p style="color: #475569; font-size: 15px;">Hello ${recipientName || 'Valued Client'},</p>
        <p style="color: #475569; font-size: 15px;">A technical briefing meeting has been scheduled for <strong>${projectName || 'your project'}</strong>:</p>

        <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #cbd5e1; margin: 20px 0;">
          <p style="margin: 6px 0;"><strong style="color: #334155;">Meeting Date:</strong> ${data.date || 'TBD'}</p>
          <p style="margin: 6px 0;"><strong style="color: #334155;">Meeting Time:</strong> ${data.time || 'TBD'}</p>
          ${data.notes ? `<p style="margin: 6px 0;"><strong style="color: #334155;">Agenda:</strong> ${data.notes}</p>` : ''}
        </div>

        ${data.meetingUrl ? `
          <div style="text-align: center; margin: 25px 0;">
            <a href="${data.meetingUrl}" style="padding: 14px 28px; background: #FF6900; color: #ffffff; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">
              🎥 Join Google Meet Call
            </a>
          </div>
        ` : ''}
      `;
      break;

    case 'project_status':
      contentBody = `
        <h2 style="color: #193CB8; margin-top: 0;">Project Progress Status Update</h2>
        <p style="color: #475569; font-size: 15px;">Hello ${recipientName || 'Valued Client'},</p>
        <p style="color: #475569; font-size: 15px;">Here is the latest progress milestone for <strong>${projectName || 'your project'}</strong>:</p>

        <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #cbd5e1; margin: 20px 0; text-align: center;">
          <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Current Status</span>
          <h3 style="color: #FF6900; font-size: 22px; margin: 6px 0;">${data.status || 'In Progress'}</h3>
        </div>

        <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #193CB8; font-size: 14px; color: #1e293b; white-space: pre-wrap;">
          ${message || 'Our engineering team is executing current sprint tasks as scheduled.'}
        </div>
      `;
      break;

    case 'approval_notification':
      contentBody = `
        <h2 style="color: #10b981; margin-top: 0;">🎉 Project Approved & Briefing Scheduled</h2>
        <p style="color: #475569; font-size: 15px;">Hello ${recipientName || 'Valued Client'},</p>
        <p style="color: #475569; font-size: 15px;">Great news! Your project profile <strong>${projectName}</strong> has been officially <strong>APPROVED</strong> by our technical board.</p>

        ${data.meetingUrl ? `
          <div style="background: rgba(25, 60, 184, 0.05); padding: 20px; border-radius: 10px; border: 1px solid rgba(25, 60, 184, 0.2); margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 12px 0; color: #193CB8; font-weight: bold;">Your Dedicated Google Meet Link is Ready:</p>
            <a href="${data.meetingUrl}" style="padding: 14px 28px; background: #FF6900; color: #ffffff; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">
              Join Google Meet Briefing
            </a>
          </div>
        ` : ''}
      `;
      break;

    case 'deployment_notification':
      contentBody = `
        <h2 style="color: #193CB8; margin-top: 0;">🚀 Deployment Complete — Product Live!</h2>
        <p style="color: #475569; font-size: 15px;">Hello ${recipientName || 'Valued Client'},</p>
        <p style="color: #475569; font-size: 15px;">We are thrilled to announce that <strong>${projectName}</strong> has been successfully deployed to production!</p>

        ${data.liveUrl ? `
          <div style="text-align: center; margin: 25px 0;">
            <a href="${data.liveUrl}" style="padding: 14px 28px; background: #10b981; color: #ffffff; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">
              🌐 Visit Production Website
            </a>
          </div>
        ` : ''}
      `;
      break;

    case 'payment_reminder':
      contentBody = `
        <h2 style="color: #92400e; margin-top: 0;">Payment Invoice Reminder</h2>
        <p style="color: #475569; font-size: 15px;">Hello ${recipientName || 'Valued Client'},</p>
        <p style="color: #475569; font-size: 15px;">This is a friendly payment reminder regarding <strong>${projectName}</strong>:</p>

        <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #cbd5e1; margin: 20px 0;">
          <p style="margin: 6px 0;"><strong style="color: #334155;">Outstanding Amount:</strong> $${data.amount || '0.00'}</p>
          <p style="margin: 6px 0;"><strong style="color: #334155;">Payment Due Date:</strong> ${data.dueDate || 'Immediate'}</p>
        </div>
      `;
      break;

    default: // regular_update
      contentBody = `
        <h2 style="color: #193CB8; margin-top: 0;">Project Update & Information</h2>
        <p style="color: #475569; font-size: 15px;">Hello ${recipientName || 'Valued Client'},</p>
        <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #cbd5e1; margin: 20px 0; font-size: 14px; color: #1e293b; white-space: pre-wrap;">
          ${message || 'Thank you for choosing PageTraffics. Here is an update regarding your project.'}
        </div>
      `;
      break;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
      ${brandHeader}
      <div style="padding: 30px; background-color: #f8fafc;">
        ${contentBody}
      </div>
      ${brandFooter}
    </div>
  `;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const clientData = rateLimitMap.get(clientIp) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + RATE_LIMIT_WINDOW;
    } else {
      clientData.count++;
    }
    rateLimitMap.set(clientIp, clientData);

    if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.'
      });
    }

    const { 
      emailType, // 'regular_update', 'quotation', 'meeting_invitation', 'project_status', 'approval_notification', 'deployment_notification', 'payment_reminder'
      recipientEmail, 
      recipientName, 
      projectName, 
      subject, 
      message, 
      templateData,
      _honeypot, 
      _timestamp 
    } = req.body || {};

    // 1. Spam Protection - Honeypot
    if (_honeypot && _honeypot.trim() !== '') {
      return res.status(200).json({ success: true, message: 'Submission received.' });
    }

    // 2. Validate Target Email
    const targetRecipient = recipientEmail ? recipientEmail.trim().toLowerCase() : (process.env.COMPANY_EMAIL || 'ujwal@richasoftwaresolutions.com');
    const emailSubject = subject || `[PageTraffics] Update regarding ${projectName || 'your project'}`;

    // 3. Render Responsive HTML Template
    const emailHtml = renderEmailTemplate({
      type: emailType || 'regular_update',
      recipientName: recipientName || 'Client',
      projectName: projectName || '',
      data: templateData || {},
      message: message || ''
    });

    // 4. Send via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey && resendApiKey.startsWith('re_') && !resendApiKey.includes('placeholder')) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: 'PageTraffics Notifications <onboarding@resend.dev>',
        to: targetRecipient,
        subject: emailSubject,
        html: emailHtml
      });
    } else {
      console.log(`[DEV MODE - Resend HTML Email] Type: ${emailType || 'regular_update'} -> To: ${targetRecipient} | Subject: ${emailSubject}`);
    }

    return res.status(200).json({
      success: true,
      message: `Email notification (${emailType || 'update'}) sent successfully to ${targetRecipient}.`
    });

  } catch (error) {
    console.error('Email API Dispatch Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to dispatch email via Resend API.'
    });
  }
}
