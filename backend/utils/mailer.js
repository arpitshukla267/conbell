const { Resend } = require("resend");
const fs = require("fs");
const path = require("path");
const { downloadCloudinaryFile } = require("./cloudinaryFile");

let resendInstance = null;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured in backend environment.");
  }
  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

/* ───────────────────────── Branded email layout ───────────────────────── */

// Logo must be a public https URL (email apps cannot load local files).
// Set MAIL_LOGO_URL in the backend env to change it.
const LOGO_URL =
  process.env.MAIL_LOGO_URL || "https://cms.conbellengineering.com/icon.png";
const BRAND_NAME = "Conbell Engineering";
const BRAND_COLOR = "#0B1C30";

// Wraps the email body in a header (logo + name) and footer.
// Skips full HTML documents so nothing gets wrapped twice.
function wrapEmailHtml(bodyHtml) {
  if (/^\s*(<!doctype|<html)/i.test(bodyHtml)) return bodyHtml;

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f7fa;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
            <tr>
              <td style="background:${BRAND_COLOR};padding:18px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:12px;vertical-align:middle;">
                      <img src="${LOGO_URL}" alt="${BRAND_NAME}" height="44" style="display:block;height:44px;width:auto;border:0;" />
                    </td>
                    <td style="vertical-align:middle;color:#ffffff;font-size:18px;font-weight:bold;">
                      ${BRAND_NAME}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px;color:#1e293b;font-size:14px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:#f8fafc;color:#94a3b8;font-size:12px;text-align:center;">
                &copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Reusable backend sendMail function using Resend
 *
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient email(s)
 * @param {string} options.subject - Email subject
 * @param {string} [options.html] - HTML body
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.from] - Sender override (must belong to a verified domain)
 * @param {string|string[]} [options.replyTo] - Reply-To address
 * @param {boolean} [options.branded=true] - Wrap the body with the logo header/footer
 * @param {Array<{filename: string, content?: Buffer|string, path?: string, url?: string}>} [options.attachments]
 * @returns {Promise<{id: string, success: boolean}>}
 */
async function sendMail({
  to,
  subject,
  html,
  text,
  attachments = [],
  from: fromOverride,
  replyTo,
  branded = true,
}) {
  const resend = getResendClient();
  const from =
    fromOverride ||
    process.env.RESEND_FROM_WEBSITE ||
    process.env.RESEND_FROM_EMAIL ||
    "Conbell Engineering <onboarding@resend.dev>";

  if (!to) {
    throw new Error("Recipient email (to) is required.");
  }
  if (!subject) {
    throw new Error("Email subject is required.");
  }

  // Format message content
  const emailText = text || (html ? html.replace(/<[^>]*>?/gm, "") : "");
  const rawHtml = html || (text ? text.replace(/\n/g, "<br/>") : "");
  const emailHtml = branded ? wrapEmailHtml(rawHtml) : rawHtml;

  // Process attachments
  const formattedAttachments = [];
  if (Array.isArray(attachments) && attachments.length > 0) {
    for (const att of attachments) {
      if (!att) continue;

      const filename = att.filename || "attachment.pdf";

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
      if (
        filePathOrUrl.startsWith("/uploads/") ||
        filePathOrUrl.startsWith("uploads/")
      ) {
        const cleanPath = filePathOrUrl.replace(/^\/?uploads\//, "");
        const fullLocalPath = path.join(__dirname, "..", "uploads", cleanPath);
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
      // Cloudinary URLs are downloaded through the authenticated helper
      // (signed download), so public PDF delivery restrictions do not apply.
      // Other URLs use a plain fetch. If the download fails, we throw a clear
      // error instead of passing an inaccessible URL to Resend.
      if (
        filePathOrUrl.startsWith("http://") ||
        filePathOrUrl.startsWith("https://")
      ) {
        let res;
        try {
          res = filePathOrUrl.includes("res.cloudinary.com")
            ? await downloadCloudinaryFile(filePathOrUrl)
            : await fetch(filePathOrUrl);
        } catch (fetchErr) {
          console.error(
            `Failed to fetch attachment from ${filePathOrUrl}:`,
            fetchErr,
          );
          throw new Error(
            `Attachment "${filename}" could not be downloaded. Please check that the file URL is accessible.`,
          );
        }

        console.log("Attachment fetch:", filePathOrUrl, "->", res.status);

        if (!res.ok) {
          throw new Error(
            `Attachment "${filename}" could not be downloaded (HTTP ${res.status}). Please check that the file URL is accessible.`,
          );
        }

        const arrayBuf = await res.arrayBuffer();
        formattedAttachments.push({
          filename,
          content: Buffer.from(arrayBuf),
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

  if (replyTo) payload.replyTo = replyTo;

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    console.error("Resend send email error:", error);
    throw new Error(error.message || "Failed to send email through Resend");
  }

  return {
    id: data?.id,
    success: true,
  };
}

/**
 * Emails sent from the website: contact form, application received.
 * Sender: conbellengineering.com
 */
const sendWebsiteMail = (opts) =>
  sendMail({
    ...opts,
    from:
      opts.from ||
      process.env.RESEND_FROM_WEBSITE ||
      process.env.RESEND_FROM_EMAIL,
  });

/**
 * Emails sent from the CMS: OTP, interview, hire/offer letter, reject.
 * Sender: cms.conbellengineering.com
 * If REPLY_TO_EMAIL is set, replies will be delivered to that inbox (optional).
 */
const sendCmsMail = (opts) =>
  sendMail({
    ...opts,
    from:
      opts.from || process.env.RESEND_FROM_CMS || process.env.RESEND_FROM_EMAIL,
    replyTo: opts.replyTo || process.env.REPLY_TO_EMAIL || undefined,
  });

module.exports = {
  sendMail,
  sendWebsiteMail,
  sendCmsMail,
};
