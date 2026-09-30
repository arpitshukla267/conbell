"use client";

import { useState, useEffect, useRef } from "react";
import { Poppins } from "next/font/google";
import { Application, applicationsApi, uploadFile } from "@/lib/api";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Paperclip, Trash2 } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

interface HireModalProps {
  application: Application | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (updated: Application) => void;
}

interface TemplateVars {
  name: string;
  jobTitle: string;
  hasAttachment: boolean;
}

const HIRING_TEMPLATES = [
  {
    id: "standard_offer",
    name: "Offer email",
    subject: (jobTitle: string) =>
      `Offer for ${jobTitle} at Conbell Engineering`,
    body: (v: TemplateVars) =>
      `Hi ${v.name},

Thank you for the time you gave us during the interview process. We are happy to let you know that we would like to offer you the position of ${v.jobTitle} at Conbell Engineering.

${
  v.hasAttachment
    ? "Your offer letter is attached to this email with the details of the role, compensation and terms of employment. Please go through it, sign it and send us a copy by replying to this email."
    : "We will share the formal offer letter with you shortly."
}

If you have any questions about the offer, feel free to reply to this email.

We hope to have you on the team.

Regards,
HR Team
Conbell Engineering
https://conbellengineering.com`,
  },
  {
    id: "formal_offer",
    name: "Offer with deadline",
    subject: (jobTitle: string) =>
      `Offer of employment: ${jobTitle}, Conbell Engineering`,
    body: (v: TemplateVars) =>
      `Hi ${v.name},

We are pleased to offer you the position of ${v.jobTitle} at Conbell Engineering, following your interviews with our team.

${
  v.hasAttachment
    ? "The offer letter with all terms of employment is attached. Please sign it and send the copy back to us within 5 working days to confirm your acceptance."
    : "The formal offer letter will follow shortly. Please confirm your acceptance by replying to this email within 5 working days."
}

If anything is unclear or you would like to discuss the offer, let us know and we will be happy to help.

Regards,
HR Team
Conbell Engineering
https://conbellengineering.com`,
  },
];

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#00355F] focus:outline-none focus:ring-1 focus:ring-[#00355F]";
const labelClass = "mb-1.5 block text-xs font-medium text-slate-600";

export function HireModal({
  application,
  open,
  onClose,
  onSuccess,
}: HireModalProps) {
  const [templateId, setTemplateId] = useState("standard_offer");
  const [sendEmail, setSendEmail] = useState(true);

  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [bodyEdited, setBodyEdited] = useState(false);

  const [offerLetterUrl, setOfferLetterUrl] = useState("");
  const [offerLetterName, setOfferLetterName] = useState("");
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (application && open) {
      setEmailTo(application.email);
      setOfferLetterUrl(application.hiringDetails?.offerLetterUrl || "");
      setOfferLetterName(application.hiringDetails?.offerLetterName || "");
      setTemplateId("standard_offer");
      setSendEmail(true);
      setBodyEdited(false);
    }
  }, [application, open]);

  // Keep subject and body in sync (body only until it is edited manually)
  useEffect(() => {
    if (!application || !open) return;
    const tmpl =
      HIRING_TEMPLATES.find((t) => t.id === templateId) || HIRING_TEMPLATES[0];
    setEmailSubject(tmpl.subject(application.jobTitle));
    if (!bodyEdited) {
      setEmailBody(
        tmpl.body({
          name: application.applicantName,
          jobTitle: application.jobTitle,
          hasAttachment: !!offerLetterUrl,
        }),
      );
    }
  }, [application, open, templateId, offerLetterUrl, bodyEdited]);

  function handleTemplateChange(id: string) {
    setTemplateId(id);
    setBodyEdited(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !application) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF file.");
      return;
    }

    setUploadingPdf(true);
    try {
      const url = await uploadFile(file, {
        section: "offer-letters",
        identifier: application._id,
        field: "offer-letter",
      });
      setOfferLetterUrl(url);
      setOfferLetterName(file.name);
    } catch (err: any) {
      toast.error(err.message || "Failed to upload offer letter.");
    } finally {
      setUploadingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeAttachment() {
    setOfferLetterUrl("");
    setOfferLetterName("");
  }

  async function handleHire(e: React.FormEvent) {
    e.preventDefault();
    if (!application) return;

    if (
      sendEmail &&
      (!emailTo.trim() || !emailSubject.trim() || !emailBody.trim())
    ) {
      toast.error("Please fill in recipient, subject and message.");
      return;
    }

    setLoading(true);
    try {
      const result = await applicationsApi.hire(application._id, {
        sendEmailNotification: sendEmail,
        email: sendEmail
          ? {
              to: emailTo.trim(),
              subject: emailSubject.trim(),
              message: emailBody.trim(),
            }
          : undefined,
        offerLetterUrl: offerLetterUrl || undefined,
        offerLetterName: offerLetterName || undefined,
        performedBy: "Admin",
      });

      toast.success(
        sendEmail
          ? `${application.applicantName} marked as hired and offer email sent.`
          : `${application.applicantName} marked as hired.`,
      );
      onSuccess(result);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to complete hiring.");
    } finally {
      setLoading(false);
    }
  }

  if (!application) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Hire Candidate — ${application.applicantName}`}
      size="xl"
    >
      <form onSubmit={handleHire} className={`${poppins.className} space-y-6`}>
        <p className="text-sm text-slate-500">
          {application.jobTitle}
          <span className="mx-2 text-slate-300">|</span>
          {application.email}
        </p>

        {/* Email */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">

            {sendEmail && (
              <select
                value={templateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-[#00355F] focus:outline-none"
              >
                {HIRING_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {sendEmail ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>To</label>
                  <input
                    type="email"
                    required
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Subject</label>
                  <input
                    type="text"
                    required
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  rows={12}
                  required
                  value={emailBody}
                  onChange={(e) => {
                    setEmailBody(e.target.value);
                    setBodyEdited(true);
                  }}
                  className={`${inputClass} leading-relaxed`}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No email will be sent. The candidate will only be marked as hired
              in the system.
            </p>
          )}
        </div>

        {/* Offer letter */}
        <div className="border-t border-slate-200 pt-5">
          <label className={labelClass}>Offer letter (PDF, optional)</label>

          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          {offerLetterUrl ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />
                <a
                  href={offerLetterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-slate-800 hover:text-[#00355F] hover:underline"
                >
                  {offerLetterName || "Offer-Letter.pdf"}
                </a>
              </div>
              <button
                type="button"
                onClick={removeAttachment}
                aria-label="Remove offer letter"
                className="shrink-0 rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadingPdf}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              {uploadingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Paperclip className="h-4 w-4" />
              )}
              {uploadingPdf ? "Uploading..." : "Attach PDF"}
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || uploadingPdf}
            className="flex items-center gap-2 bg-[#00355F] text-white hover:bg-[#09253d]"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading
              ? "Saving..."
              : sendEmail
                ? "Hire & Send Offer"
                : "Mark as Hired"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
