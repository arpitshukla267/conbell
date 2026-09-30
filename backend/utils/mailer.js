const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

let resendInstance = null;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured in backend environment.');
  }
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

/**
 * Reusable backend sendMail function using Resend
 * 
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient email(s)
 * @param {string} options.subject - Email subject
 * @param {string} [options.html] - HTML body
 * @param {string} [options.text] - Plain text body
 * @param {Array<{filename: string, content?: Buffer|string, path?: string, url?: string}>} [options.attachments]
 * @returns {Promise<{id: string, success: boolean}>}
 */
async function sendMail({ to, subject, html, text, attachments = [] }) {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL || 'Conbell Engineering <onboarding@resend.dev>';

  if (!to) {
    throw new Error('Recipient email (to) is required.');
  }
  if (!subject) {
    throw new Error('Email subject is required.');
  }

  // Format message content
  const emailText = text || (html ? html.replace(/<[^>]*>?/gm, '') : '');
  const emailHtml = html || (text ? text.replace(/\n/g, '<br/>') : '');

  // Process attachments
  const formattedAttachments = [];
  if (Array.isArray(attachments) && attachments.length > 0) {
    for (const att of attachments) {
      if (!att) continue;

      const filename = att.filename || 'attachment.pdf';

      // 1. Direct Buffer or string content
      if (att.content) {
        formattedAttachments.push({
          filename,
          content: att.content,
        });
        continue;
      }

      const filePathOrUrl = att.path || att.url;
      if (!filePathOrUrl) continue;

      // 2. Local uploads directory file
      if (filePathOrUrl.startsWith('/uploads/') || filePathOrUrl.startsWith('uploads/')) {
        const cleanPath = filePathOrUrl.replace(/^\/?uploads\//, '');
        const fullLocalPath = path.join(__dirname, '..', 'uploads', cleanPath);
        if (fs.existsSync(fullLocalPath)) {
          const fileBuffer = fs.readFileSync(fullLocalPath);
          formattedAttachments.push({
            filename,
            content: fileBuffer,
          });
          continue;
        }
      }

      // 3. Absolute local file path
      if (fs.existsSync(filePathOrUrl)) {
        const fileBuffer = fs.readFileSync(filePathOrUrl);
        formattedAttachments.push({
          filename,
          content: fileBuffer,
        });
        continue;
      }

      // 4. Remote HTTP(S) URL (e.g. Cloudinary)
      if (filePathOrUrl.startsWith('http://') || filePathOrUrl.startsWith('https://')) {
        try {
          const res = await fetch(filePathOrUrl);
          if (res.ok) {
            const arrayBuf = await res.arrayBuffer();
            formattedAttachments.push({
              filename,
              content: Buffer.from(arrayBuf),
            });
            continue;
          }
        } catch (fetchErr) {
          console.error(`Failed to fetch attachment from ${filePathOrUrl}:`, fetchErr);
        }

        // Fallback to passing remote path directly
        formattedAttachments.push({
          filename,
          path: filePathOrUrl,
        });
      }
    }
  }

  const payload = {
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    text: emailText,
    html: emailHtml,
  };

  if (formattedAttachments.length > 0) {
    payload.attachments = formattedAttachments;
  }

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    console.error('Resend send email error:', error);
    throw new Error(error.message || 'Failed to send email through Resend');
  }

  return {
    id: data?.id,
    success: true,
  };
}

module.exports = {
  sendMail,
};
