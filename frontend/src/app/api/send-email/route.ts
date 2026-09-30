import { NextResponse } from "next/server";
import { Resend } from "resend";


interface EmailRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  product?: string;
  service?: string;
  scope?: string;
  message?: string;
  ndaRequired?: boolean;
  subject?: string;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "RESEND_API_KEY is missing. Please add your Resend API key to the .env file.",
        },
        { status: 500 }
      );
    }

    const body: EmailRequestBody = await req.json();
    const {
      name,
      email,
      phone,
      company,
      product,
      service,
      scope,
      message,
      ndaRequired,
      subject,
    } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Full name and email are required.",
        },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);
    const recipientEmail = process.env.RECIPIENT_EMAIL ;
    const senderEmail = process.env.RESEND_FROM_EMAIL ;

    if (!recipientEmail || !senderEmail) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email configuration is missing. Please check RECIPIENT_EMAIL and RESEND_FROM_EMAIL.",
        },
        { status: 500 },
      );
    }

    const emailSubject =
      subject ||
      `New RFQ / Inquiry from ${name.trim()}${company ? ` (${company.trim()})` : ""}`;

    const projectDetails = scope || message || "None provided";

    // Formatted HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7fb; color: #0b1c30; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e4e9f2; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { background-color: #0b1c30; color: #ffffff; padding: 24px; text-align: left; }
            .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; }
            .header p { margin: 0; color: #8fa9c9; font-size: 13px; }
            .content { padding: 24px; }
            .section-title { font-size: 12px; text-transform: uppercase; color: #0f4c81; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 2px solid #eff4ff; padding-bottom: 6px; }
            .field-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .field-table td { padding: 10px 8px; border-bottom: 1px solid #f0f2f5; font-size: 14px; }
            .field-label { width: 35%; font-weight: 600; color: #5b5e67; }
            .field-val { width: 65%; color: #0b1c30; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background: #eff4ff; color: #0f4c81; }
            .nda-badge { background: #fee2e2; color: #991b1b; }
            .message-box { background: #f8faff; border: 1px solid #d8deea; border-radius: 6px; padding: 14px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; word-break: break-word; }
            .footer { background: #fafbfc; border-top: 1px solid #e4e9f2; padding: 16px 24px; font-size: 12px; color: #8fa9c9; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Technical Inquiry / RFQ</h1>
              <p>Received via Conbell Engineering Website</p>
            </div>
            <div class="content">
              <div class="section-title">Client Information</div>
              <table class="field-table">
                <tr>
                  <td class="field-label">Name:</td>
                  <td class="field-val"><strong>${escapeHtml(name)}</strong></td>
                </tr>
                <tr>
                  <td class="field-label">Email:</td>
                  <td class="field-val"><a href="mailto:${escapeHtml(email)}" style="color: #0f4c81;">${escapeHtml(email)}</a></td>
                </tr>
                ${
                  phone
                    ? `<tr>
                        <td class="field-label">Phone:</td>
                        <td class="field-val"><a href="tel:${escapeHtml(phone)}" style="color: #0f4c81;">${escapeHtml(phone)}</a></td>
                      </tr>`
                    : ""
                }
                ${
                  company
                    ? `<tr>
                        <td class="field-label">Company / Org:</td>
                        <td class="field-val"><strong>${escapeHtml(company)}</strong></td>
                      </tr>`
                    : ""
                }
              </table>

              <div class="section-title">Inquiry Details</div>
              <table class="field-table">
                ${
                  product
                    ? `<tr>
                        <td class="field-label">Product of Interest:</td>
                        <td class="field-val"><span class="badge">${escapeHtml(product)}</span></td>
                      </tr>`
                    : ""
                }
                ${
                  service
                    ? `<tr>
                        <td class="field-label">Service of Interest:</td>
                        <td class="field-val"><span class="badge">${escapeHtml(service)}</span></td>
                      </tr>`
                    : ""
                }
                <tr>
                  <td class="field-label">NDA Requested:</td>
                  <td class="field-val">
                    ${
                      ndaRequired
                        ? `<span class="badge nda-badge">Yes — Bilateral NDA Required Prior to Data Exchange</span>`
                        : "<span>No</span>"
                    }
                  </td>
                </tr>
              </table>

              <div class="section-title">Project Scope & Specifications</div>
              <div class="message-box">${escapeHtml(projectDetails)}</div>
            </div>
            <div class="footer">
              This message was sent automatically from your website's RFQ form to <strong>${recipientEmail}</strong>.
            </div>
          </div>
        </body>
      </html>
    `;

    // Plain text alternative
    const textContent = `
New Technical Inquiry / RFQ Received
-----------------------------------------
Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}
Company: ${company || "N/A"}
Product: ${product || "N/A"}
Service: ${service || "N/A"}
NDA Required: ${ndaRequired ? "Yes" : "No"}

Project Scope / Message:
-----------------------------------------
${projectDetails}
    `.trim();

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: recipientEmail,
      replyTo: email.trim(),
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to send email through Resend.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully",
        id: data?.id,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Internal error sending email:", err);
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
