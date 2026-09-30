"use client";

import { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import { Application, applicationsApi } from "@/lib/api";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

interface InterviewModalProps {
  application: Application | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (updated: Application) => void;
}

interface TemplateVars {
  name: string;
  jobTitle: string;
  date: string;
  time: string;
  mode: string;
  location: string;
}

// "2026-10-02" -> "Friday, 2 October 2026"
function formatDate(value: string) {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return value;
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function locationLabel(mode: string) {
  if (mode === "In-person / Office") return "Venue";
  if (mode === "Phone Call") return "Phone";
  return "Meeting link";
}

function detailLines(v: TemplateVars) {
  return [
    v.date && `Date: ${formatDate(v.date)}`,
    v.time && `Time: ${v.time}`,
    `Mode: ${v.mode}`,
    v.location && `${locationLabel(v.mode)}: ${v.location}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const INTERVIEW_TEMPLATES = [
  {
    id: "standard",
    name: "Interview invitation",
    subject: (jobTitle: string) =>
      `Interview for ${jobTitle} at Conbell Engineering`,
    body: (v: TemplateVars) =>
      `Hi ${v.name},

Thank you for applying for the ${v.jobTitle} position at Conbell Engineering. We have gone through your application and would like to invite you for an interview.

${detailLines(v)}

Please reply to this email to confirm. If the slot doesn't work for you, let us know a time that suits you and we'll try to adjust.

Regards,
HR Team
Conbell Engineering
https://conbellengineering.com`,
  },
  {
    id: "technical",
    name: "Technical interview",
    subject: (jobTitle: string) =>
      `Technical interview for ${jobTitle} at Conbell Engineering`,
    body: (v: TemplateVars) =>
      `Hi ${v.name},

Your application for ${v.jobTitle} has been shortlisted, and we would like to schedule a technical interview with our team. We will mostly discuss your past projects and technical background.

${detailLines(v)}

Please confirm by replying to this email. If you are joining online, make sure you have a stable internet connection.

Regards,
HR Team
Conbell Engineering
https://conbellengineering.com`,
  },
];

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#00355F] focus:outline-none focus:ring-1 focus:ring-[#00355F]";
const labelClass = "mb-1.5 block text-xs font-medium text-slate-600";

export function InterviewModal({
  application,
  open,
  onClose,
  onSuccess,
}: InterviewModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("Online Video Meeting");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const [sendEmail, setSendEmail] = useState(true);
  const [templateId, setTemplateId] = useState("standard");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [bodyEdited, setBodyEdited] = useState(false);

  const [loading, setLoading] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (application && open) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
      const dd = String(tomorrow.getDate()).padStart(2, "0");

      setDate(application.interviewDetails?.date || `${yyyy}-${mm}-${dd}`);
      setTime(application.interviewDetails?.time || "11:00 AM");
      setMode(application.interviewDetails?.mode || "Online Video Meeting");
      setLocation(application.interviewDetails?.location || "");
      setNotes(application.interviewDetails?.notes || "");
      setEmailTo(application.email);
      setTemplateId("standard");
      setBodyEdited(false);
    }
  }, [application, open]);

  // Keep subject and body in sync with the form (until body is edited manually)
  useEffect(() => {
    if (!application || !open) return;
    const tmpl =
      INTERVIEW_TEMPLATES.find((t) => t.id === templateId) ||
      INTERVIEW_TEMPLATES[0];
    setEmailSubject(tmpl.subject(application.jobTitle));
    if (!bodyEdited) {
      setEmailBody(
        tmpl.body({
          name: application.applicantName,
          jobTitle: application.jobTitle,
          date,
          time,
          mode,
          location,
        }),
      );
    }
  }, [application, open, templateId, date, time, mode, location, bodyEdited]);

  function handleTemplateChange(id: string) {
    setTemplateId(id);
    setBodyEdited(false);
  }

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!application) return;

    if (!date.trim() || !time.trim()) {
      toast.error("Please enter interview date and time.");
      return;
    }

    if (
      sendEmail &&
      (!emailTo.trim() || !emailSubject.trim() || !emailBody.trim())
    ) {
      toast.error("Please complete all email fields before sending.");
      return;
    }

    setLoading(true);
    try {
      const result = await applicationsApi.scheduleInterview(application._id, {
        date,
        time,
        mode,
        location,
        notes,
        sendEmailNotification: sendEmail,
        email: sendEmail
          ? {
              to: emailTo.trim(),
              subject: emailSubject.trim(),
              message: emailBody.trim(),
            }
          : undefined,
        performedBy: "Admin",
      });

      toast.success(
        sendEmail
          ? "Interview scheduled and email sent."
          : "Interview scheduled.",
      );
      onSuccess(result);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to schedule interview.");
    } finally {
      setLoading(false);
    }
  }

  if (!application) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Schedule Interview — ${application.applicantName}`}
      size="xl"
    >
      <form
        onSubmit={handleSchedule}
        className={`${poppins.className} space-y-6`}
      >
        <p className="text-sm text-slate-500">
          {application.jobTitle}
          <span className="mx-2 text-slate-300">|</span>
          {application.email}
        </p>

        {/* Interview details */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Time</label>
            <input
              type="text"
              required
              placeholder="11:00 AM IST"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className={inputClass}
            >
              <option value="Online Video Meeting">Online Video Meeting</option>
              <option value="In-person / Office">In-person / Office</option>
              <option value="Phone Call">Phone Call</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>{locationLabel(mode)}</label>
            <input
              type="text"
              placeholder={
                mode === "In-person / Office"
                  ? "Office address"
                  : mode === "Phone Call"
                    ? "Phone number"
                    : "https://meet.google.com/..."
              }
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-4 border-t border-slate-200 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#00355F] focus:ring-[#00355F]"
              />
              Email the candidate
            </label>

            {sendEmail && (
              <select
                value={templateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-[#00355F] focus:outline-none"
              >
                {INTERVIEW_TEMPLATES.map((t) => (
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
                  rows={11}
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
              No email will be sent. The interview will only be saved in the
              system.
            </p>
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
            disabled={loading}
            className="flex items-center gap-2 bg-[#00355F] text-white hover:bg-[#09253d]"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading
              ? "Scheduling..."
              : sendEmail
                ? "Schedule & Send Email"
                : "Schedule Interview"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
