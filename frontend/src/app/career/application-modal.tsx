"use client";

import { useState, useRef, DragEvent, ChangeEvent, FormEvent, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  AlertCircle,
  Loader2,
  Trash2,
  Briefcase,
  Send,
  Building,
} from "lucide-react";

interface Job {
  _id: string;
  title: string;
  department?: string;
  location?: string;
  type?: string;
}

interface ApplicationModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function ApplicationModal({
  job,
  open,
  onClose,
  onSuccess,
}: ApplicationModalProps) {
  const [applicantName, setApplicantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusStep, setStatusStep] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setError(null);
      setStatusStep("");
    }
  }, [open]);

  if (!open) return null;

  const jobTitle = job?.title || "General Application";

  function handleFileChange(file: File | undefined) {
    setError(null);
    if (!file) return;

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("Resume file size must be less than 10MB.");
      return;
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const isExtensionValid = /\.(pdf|doc|docx)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !isExtensionValid) {
      setError("Please upload a PDF or Word document (.pdf, .doc, .docx).");
      return;
    }

    setResumeFile(file);
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function onDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!applicantName.trim()) {
      setError("Please provide your full name.");
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please provide a valid email address.");
      return;
    }
    if (!phone.trim()) {
      setError("Please provide your contact phone number.");
      return;
    }
    if (!resumeFile) {
      setError("Please attach or drop your resume (PDF or DOCX).");
      return;
    }

    setSubmitting(true);
    setStatusStep("Uploading resume...");

    try {
      // 1. Upload Resume file to backend
      const uploadData = new FormData();
      uploadData.append("resume", resumeFile);
      uploadData.append("section", "resumes");
      uploadData.append(
        "identifier",
        applicantName.trim().replace(/[^a-zA-Z0-9]/g, "_") || "applicant"
      );
      uploadData.append("field", "resume");

      const uploadRes = await fetch(`${API}/api/upload`, {
        method: "POST",
        body: uploadData,
      });

      const uploadJson = await uploadRes.json();
      if (!uploadJson.success || !uploadJson.url) {
        throw new Error(uploadJson.error || "Failed to upload resume file.");
      }

      // Format clean full URL if relative
      const resumeUrl = uploadJson.url.startsWith("http")
        ? uploadJson.url
        : `${API}${uploadJson.url}`;

      // 2. Submit Application to backend database and trigger recipient email
      setStatusStep("Submitting candidate profile...");
      const appRes = await fetch(`${API}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job?._id || null,
          jobTitle: jobTitle,
          applicantName: applicantName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          experience: experience.trim(),
          message: message.trim(),
          resumeUrl: resumeUrl,
        }),
      });

      const appJson = await appRes.json();
      if (!appJson.success) {
        throw new Error(appJson.error || "Failed to submit job application.");
      }

      // Application successfully registered
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Application submission error:", err);
      setError(
        err.message || "Something went wrong while submitting. Please try again."
      );
    } finally {
      setSubmitting(false);
      setStatusStep("");
    }
  }

  function handleResetAndClose() {
    setApplicantName("");
    setEmail("");
    setPhone("");
    setExperience("");
    setMessage("");
    setResumeFile(null);
    setSubmitted(false);
    setError(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B1C30]/70 backdrop-blur-xs transition-opacity"
        onClick={submitting ? undefined : handleResetAndClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-[#0B1C30] text-white flex items-start justify-between gap-4 shrink-0">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF4FF]/20 text-[#EFF4FF] mb-1.5">
              <Briefcase className="w-3 h-3 text-[#4A90C4]" />
              Career Application
            </span>
            <h3 className="text-lg md:text-xl font-bold font-[family-name:var(--font-manrope)] leading-snug">
              {jobTitle}
            </h3>
            {job?.department && (
              <p className="text-xs text-slate-300 mt-0.5">
                {job.department} {job.location ? `• ${job.location}` : ""} {job.type ? `• ${job.type}` : ""}
              </p>
            )}
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 font-[family-name:var(--font-inter)]">
          {submitted ? (
            /* Success Confirmation Screen */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-100 animate-in zoom-in-50 duration-300">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h4 className="text-xl font-bold text-[#0B1C30] font-[family-name:var(--font-manrope)]">
                  Application Submitted!
                </h4>
                <p className="text-sm text-[#5B5E67] leading-relaxed">
                  Thank you for applying, <strong>{applicantName}</strong>. Your profile and resume have been received by our recruitment team and logged into our management system.
                </p>
              </div>

              <div className="p-4 bg-[#EFF4FF]/50 border border-[#D8DEEA] rounded-xl max-w-md mx-auto text-xs text-left text-slate-700 space-y-1.5">
                <p>
                  <strong>Role:</strong> {jobTitle}
                </p>
                <p>
                  <strong>Applicant:</strong> {applicantName} ({email})
                </p>
                {resumeFile && (
                  <p className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <FileText className="w-3.5 h-3.5" />
                    Resume Attached: {resumeFile.name}
                  </p>
                )}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-lg bg-[#0B1C30] hover:bg-[#0F4C81] text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8DEEA] rounded-xl text-xs text-[#0B1C30] placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/10 transition-all"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D8DEEA] rounded-xl text-xs text-[#0B1C30] placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D8DEEA] rounded-xl text-xs text-[#0B1C30] placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/10 transition-all"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                  Relevant Experience
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4 Years in Heavy Fabrication / CNC Machining"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8DEEA] rounded-xl text-xs text-[#0B1C30] placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/10 transition-all"
                />
              </div>

              {/* Message / Cover Note */}
              <div>
                <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                  Cover Note / Message (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly introduce yourself, notable projects, or why you want to join Conbell..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-white border border-[#D8DEEA] rounded-xl text-xs text-[#0B1C30] placeholder:text-slate-400 focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/10 transition-all leading-relaxed"
                />
              </div>

              {/* Resume Drop Field */}
              <div>
                <label className="block text-xs font-semibold text-[#0B1C30] mb-1.5">
                  Resume / CV <span className="text-rose-500">*</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFileChange(e.target.files?.[0])
                  }
                  className="hidden"
                />

                {!resumeFile ? (
                  <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-[#0F4C81] bg-[#EFF4FF]"
                        : "border-[#D8DEEA] bg-slate-50/70 hover:bg-slate-50 hover:border-[#0F4C81]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#EFF4FF] text-[#0F4C81] flex items-center justify-center mx-auto mb-2">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-[#0B1C30]">
                      Click to upload or drag & drop your resume
                    </p>
                    <p className="text-[11px] text-[#5B5E67] mt-0.5">
                      Word or DOCX files up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0B1C30] truncate">
                          {resumeFile.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to submit
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B1C30] hover:bg-[#0F4C81] text-white text-xs md:text-sm font-bold transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{statusStep || "Submitting..."}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Your application will be sent directly to Conbell HR & logged in the recruitment portal.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
