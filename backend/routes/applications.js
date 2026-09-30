const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { sendMail } = require('../utils/mailer');

// GET /api/applications/all - fetch all applications with history
router.get('/all', async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate('jobId', 'title department')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
});

// GET /api/applications/:id - get single application details & history
router.get('/:id', async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId', 'title department');
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

// POST /api/applications - submit new job application
router.post('/', async (req, res, next) => {
  try {
    const {
      jobId,
      jobTitle,
      applicantName,
      email,
      phone,
      resumeUrl,
      message,
      experience,
    } = req.body;

    if (!jobTitle || !applicantName || !email || !phone || !resumeUrl) {
      return res.status(400).json({
        success: false,
        error: 'Job title, applicant name, email, phone, and resume URL are required.',
      });
    }

    const application = await Application.create({
      jobId: jobId || null,
      jobTitle,
      applicantName,
      email,
      phone,
      resumeUrl,
      message: message || '',
      experience: experience || '',
      status: 'pending',
      history: [
        {
          action: 'application_submitted',
          toStatus: 'pending',
          details: { message: message || '', experience: experience || '' },
          performedBy: applicantName,
          timestamp: new Date(),
        },
      ],
    });

    // Send email notification to recipient email
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'conbellengineering@gmail.com';
    try {
      await sendMail({
        to: recipientEmail,
        subject: `New Job Application: ${jobTitle} - ${applicantName}`,
        html: `
          <div style="font-family: sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0b1c30; padding: 20px 24px; color: #ffffff;">
              <h2 style="margin: 0; font-size: 20px;">New Job Application Received</h2>
              <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">Conbell Engineering Recruitment</p>
            </div>
            <div style="padding: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Position:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a;"><strong>${jobTitle}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;"><strong>Candidate:</strong></td>
                  <td style="padding: 8px 0; color: #0f172a;">${applicantName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0284c7;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td>
                  <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #0284c7;">${phone}</a></td>
                </tr>
                ${experience ? `<tr><td style="padding: 8px 0; color: #64748b;"><strong>Experience:</strong></td><td style="padding: 8px 0; color: #0f172a;">${experience}</td></tr>` : ''}
              </table>
              ${message ? `
                <div style="margin-top: 16px; padding: 12px 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                  <strong style="font-size: 12px; color: #64748b; text-transform: uppercase;">Cover Note:</strong>
                  <p style="margin: 6px 0 0; font-size: 14px; color: #334155; white-space: pre-line;">${message}</p>
                </div>
              ` : ''}
              <div style="margin-top: 20px;">
                <a href="${resumeUrl}" target="_blank" style="display: inline-block; background-color: #00355F; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px;">
                  View / Download Resume
                </a>
              </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 14px 24px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
              This application has been recorded in the Conbell CMS dashboard. You can schedule an interview or manage candidate status directly from the CMS.
            </div>
          </div>
        `,
        text: `New Job Application: ${jobTitle}\nApplicant: ${applicantName}\nEmail: ${email}\nPhone: ${phone}\nExperience: ${experience || 'N/A'}\nResume: ${resumeUrl}\nMessage: ${message || 'None'}`,
        attachments: resumeUrl ? [{ filename: `${applicantName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`, url: resumeUrl }] : []
      });
    } catch (mailErr) {
      console.error('Error sending application notification email to recipient:', mailErr);
    }

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully.',
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/applications/:id/schedule-interview
// Admin enters date, time, mode and meeting link/location.
// On "Send Notification Email", sends email via sendMail and updates status to 'interview'
router.post('/:id/schedule-interview', async (req, res, next) => {
  try {
    const {
      date,
      time,
      mode,
      location,
      notes,
      email, // { to, subject, message }
      sendEmailNotification,
      performedBy = 'Admin',
    } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    let emailLog = null;

    // Send email notification if requested
    if (sendEmailNotification && email) {
      const recipient = email.to || application.email;
      const subject = email.subject || `Interview Scheduled: ${application.jobTitle} - Conbell Engineering`;
      const body = email.message || '';

      const mailResult = await sendMail({
        to: recipient,
        subject,
        text: body,
      });

      emailLog = {
        to: recipient,
        subject,
        body,
        hasAttachment: false,
        messageId: mailResult?.id || '',
        sentAt: new Date(),
      };
    }

    const previousStatus = application.status;
    application.status = 'interview';
    application.interviewDetails = {
      date: date || '',
      time: time || '',
      mode: mode || 'Online',
      location: location || '',
      notes: notes || '',
      scheduledAt: new Date(),
      scheduledBy: performedBy,
    };

    application.history.push({
      action: 'interview_scheduled',
      fromStatus: previousStatus,
      toStatus: 'interview',
      details: {
        date,
        time,
        mode,
        location,
        notes,
      },
      email: emailLog,
      performedBy,
      timestamp: new Date(),
    });

    await application.save();

    res.json({
      success: true,
      data: application,
      message: 'Interview scheduled successfully' + (emailLog ? ' and notification email sent.' : '.'),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/applications/:id/interview-taken
// "Mark Interview Taken" only updates the status. No email.
router.post('/:id/interview-taken', async (req, res, next) => {
  try {
    const { performedBy = 'Admin', notes = '' } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const previousStatus = application.status;
    application.status = 'interview_taken';

    application.history.push({
      action: 'interview_taken',
      fromStatus: previousStatus,
      toStatus: 'interview_taken',
      details: { notes },
      performedBy,
      timestamp: new Date(),
    });

    await application.save();

    res.json({
      success: true,
      data: application,
      message: 'Application marked as Interview Taken.',
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/applications/:id/hire
// Admin accepts/hires candidate, sends hiring email with optional Offer Letter PDF attachment
router.post('/:id/hire', async (req, res, next) => {
  try {
    const {
      email, // { to, subject, message, offerLetterUrl, offerLetterName }
      sendEmailNotification = true,
      offerLetterUrl,
      offerLetterName,
      performedBy = 'Admin',
    } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const letterUrl = offerLetterUrl || email?.offerLetterUrl || null;
    const letterName = offerLetterName || email?.offerLetterName || 'Offer-Letter.pdf';
    let emailLog = null;

    if (sendEmailNotification && email) {
      const recipient = email.to || application.email;
      const subject = email.subject || `Job Offer: ${application.jobTitle} - Conbell Engineering`;
      const body = email.message || '';

      const attachments = [];
      if (letterUrl) {
        attachments.push({
          filename: letterName,
          url: letterUrl,
        });
      }

      const mailResult = await sendMail({
        to: recipient,
        subject,
        text: body,
        attachments,
      });

      emailLog = {
        to: recipient,
        subject,
        body,
        hasAttachment: !!letterUrl,
        attachmentName: letterName,
        attachmentUrl: letterUrl,
        messageId: mailResult?.id || '',
        sentAt: new Date(),
      };
    }

    const previousStatus = application.status;
    application.status = 'hired';
    application.hiringDetails = {
      hiredAt: new Date(),
      hiredBy: performedBy,
      offerLetterUrl: letterUrl,
      offerLetterName: letterName,
    };

    application.history.push({
      action: 'hired',
      fromStatus: previousStatus,
      toStatus: 'hired',
      details: {
        hiringDate: new Date(),
        offerLetterUrl: letterUrl,
        offerLetterName: letterName,
      },
      email: emailLog,
      performedBy,
      timestamp: new Date(),
    });

    await application.save();

    res.json({
      success: true,
      data: application,
      message: 'Candidate hired successfully' + (emailLog ? ' and offer email sent.' : '.'),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/applications/:id/reject
// Reject only updates the application status. Do NOT send rejection emails.
router.post('/:id/reject', async (req, res, next) => {
  try {
    const { performedBy = 'Admin', reason = '' } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const previousStatus = application.status;
    application.status = 'rejected';

    application.history.push({
      action: 'rejected',
      fromStatus: previousStatus,
      toStatus: 'rejected',
      details: { reason },
      performedBy,
      timestamp: new Date(),
    });

    await application.save();

    res.json({
      success: true,
      data: application,
      message: 'Application marked as Rejected.',
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/applications/:id/status - update status directly
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status, performedBy = 'Admin' } = req.body;
    const allowed = [
      'pending',
      'reviewed',
      'shortlisted',
      'interview',
      'interview_taken',
      'hired',
      'accepted',
      'rejected',
    ];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const previousStatus = application.status;
    application.status = status;
    application.history.push({
      action: 'status_change',
      fromStatus: previousStatus,
      toStatus: status,
      performedBy,
      timestamp: new Date(),
    });

    await application.save();

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/applications/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
