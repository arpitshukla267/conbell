"use client";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { applicationsApi, type Application } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import {
  FileText,
  Mail,
  Phone,
  Trash2,
  Search,
  Loader2,
  X,
  Download,
} from "lucide-react";
import { InterviewModal } from "./interview-modal";
import { HireModal } from "./hire-modal";

type Stage = "pending" | "interview" | "interview_taken" | "hired" | "rejected";
type FilterTab = "all" | Stage;

function stageOf(status: string): Stage {
  if (status === "interview") return "interview";
  if (status === "interview_taken") return "interview_taken";
  if (status === "hired" || status === "accepted") return "hired";
  if (status === "rejected") return "rejected";
  return "pending"; // pending, reviewed, shortlisted
}

const STAGE_META: Record<Stage, { label: string; badge: string }> = {
  pending: { label: "New", badge: "bg-amber-50 text-amber-700" },
  interview: { label: "Interview", badge: "bg-blue-50 text-blue-700" },
  interview_taken: {
    label: "Interview taken",
    badge: "bg-indigo-50 text-indigo-700",
  },
  hired: { label: "Hired", badge: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Rejected", badge: "bg-rose-50 text-rose-700" },
};

function formatDate(value?: string) {
  if (!value) return "";
  const d = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(
        ...((value.split("-").map(Number) as [number, number, number]).map(
          (n, i) => (i === 1 ? n - 1 : n),
        ) as [number, number, number]),
      )
    : new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [interviewApp, setInterviewApp] = useState<Application | null>(null);
  const [hireApp, setHireApp] = useState<Application | null>(null);
  const [resumeApp, setResumeApp] = useState<Application | null>(null);
  const [rejectApp, setRejectApp] = useState<Application | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState("");

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await applicationsApi.list();
      setApplications(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  function handleApplicationUpdated(updated: Application) {
    setApplications((prev) =>
      prev.map((app) => (app._id === updated._id ? updated : app)),
    );
  }

  async function handleMarkInterviewTaken(app: Application) {
    setActionLoadingId(app._id);
    try {
      const res = await applicationsApi.markInterviewTaken(app._id, {
        performedBy: "Admin",
      });
      handleApplicationUpdated(res);
      toast.success(`Interview marked as taken for ${app.applicantName}.`);
    } catch (e: any) {
      toast.error(e.message || "Failed to update interview status");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleReject(app: Application) {
    setActionLoadingId(app._id);
    try {
      const res = await applicationsApi.reject(app._id, {
        performedBy: "Admin",
      });
      handleApplicationUpdated(res);
      toast.success(`${app.applicantName} marked as rejected.`);
      setRejectApp(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to reject application");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    setActionLoadingId(id);
    try {
      await applicationsApi.delete(id);
      setApplications((prev) => prev.filter((app) => app._id !== id));
      toast.success("Application removed");
      setDeleteId(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to delete application");
    } finally {
      setActionLoadingId(null);
    }
  }

  const filtered = applications.filter((app) => {
    const matchesTab = filterTab === "all" || stageOf(app.status) === filterTab;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.applicantName.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.jobTitle.toLowerCase().includes(q) ||
      app.phone.includes(q) ||
      app._id.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  const count = (stage: Stage) =>
    applications.filter((a) => stageOf(a.status) === stage).length;

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: applications.length },
    { id: "pending", label: "New", count: count("pending") },
    { id: "interview", label: "Interview", count: count("interview") },
    {
      id: "interview_taken",
      label: "Interview taken",
      count: count("interview_taken"),
    },
    { id: "hired", label: "Hired", count: count("hired") },
    { id: "rejected", label: "Rejected", count: count("rejected") },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Review candidates, schedule interviews and send offers."
        action={
          <Button
            variant="outline"
            onClick={loadApplications}
            disabled={loading}
          >
            Refresh
          </Button>
        }
      />

      {/* Filter Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-full overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterTab === tab.id
                  ? "bg-white text-[#00355F] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-slate-400">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, role, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#00355F]"
          />
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-7 h-7 animate-spin text-[#00355F]" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardBody className="py-16 text-center">
            <h3 className="font-semibold text-slate-800 text-base mb-1">
              No applications found
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              {applications.length === 0
                ? "Applications submitted from the Careers page will appear here."
                : "Nothing matches the current filter."}
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const stage = stageOf(app.status);
            const meta = STAGE_META[stage];
            const isHired = stage === "hired";
            const isRejected = stage === "rejected";
            const isInterview = stage === "interview";
            const isBusy = actionLoadingId === app._id;

            return (
              <Card key={app._id} className="border-slate-200">
                <CardBody className="p-5 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Info */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-semibold text-slate-900 text-base">
                          {app.applicantName}
                        </h3>
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#00355F]">
                          {app.jobTitle}
                        </span>
                        {app.experience && (
                          <span className="text-xs text-slate-500">
                            {app.experience}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-x-5 gap-y-1 text-xs text-slate-500 flex-wrap">
                        <a
                          href={`mailto:${app.email}`}
                          className="flex items-center gap-1.5 hover:text-[#00355F] transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.email}</span>
                        </a>
                        <a
                          href={`tel:${app.phone}`}
                          className="flex items-center gap-1.5 hover:text-[#00355F] transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.phone}</span>
                        </a>
                        <span className="text-slate-400">
                          Applied{" "}
                          {app.createdAt
                            ? formatDate(app.createdAt)
                            : "recently"}
                        </span>
                      </div>

                      {app.message && (
                        <p className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg max-w-2xl leading-relaxed">
                          {app.message}
                        </p>
                      )}

                      {/* Stage details as plain text */}
                      {isInterview && app.interviewDetails?.date && (
                        <p className="text-sm text-slate-600">
                          Interview on {formatDate(app.interviewDetails.date)}
                          {app.interviewDetails.time &&
                            `, ${app.interviewDetails.time}`}
                          {app.interviewDetails.mode &&
                            ` · ${app.interviewDetails.mode}`}
                          {app.interviewDetails.location &&
                            ` · ${app.interviewDetails.location}`}
                        </p>
                      )}
                      {stage === "interview_taken" && (
                        <p className="text-sm text-slate-600">
                          Interview completed. Waiting for a decision.
                        </p>
                      )}
                      {isHired && (
                        <p className="text-sm text-slate-600">
                          Hired
                          {app.hiringDetails?.hiredAt &&
                            ` on ${formatDate(app.hiringDetails.hiredAt)}`}
                          {app.hiringDetails?.offerLetterUrl && (
                            <>
                              {" · "}
                              <a
                                href={app.hiringDetails.offerLetterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#00355F] hover:underline"
                              >
                                {app.hiringDetails.offerLetterName ||
                                  "Offer letter"}
                              </a>
                            </>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Right: status + utilities */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${meta.badge}`}
                      >
                        {meta.label}
                      </span>

                      <div className="flex items-center gap-2">
                        {app.resumeUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setResumeApp(app)}
                            className="text-xs flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>Resume</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(app._id)}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2"
                          title="Delete application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {(!isRejected || isHired) && (
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                      {!isHired && !isRejected && (
                        <Button
                          size="sm"
                          onClick={() => setInterviewApp(app)}
                          className="bg-[#00355F] hover:bg-[#09253d] text-white text-xs"
                        >
                          {isInterview
                            ? "Reschedule interview"
                            : "Schedule interview"}
                        </Button>
                      )}

                      {isInterview && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isBusy}
                          onClick={() => handleMarkInterviewTaken(app)}
                          className="text-xs flex items-center gap-1.5"
                        >
                          {isBusy && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          )}
                          Mark interview taken
                        </Button>
                      )}

                      {!isHired && !isRejected && (
                        <Button
                          size="sm"
                          onClick={() => setHireApp(app)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                        >
                          Accept / Hire
                        </Button>
                      )}

                      {!isRejected && !isHired && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRejectApp(app)}
                          className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
                        >
                          Reject
                        </Button>
                      )}

                      {isHired && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setHireApp(app)}
                          className="text-xs text-slate-700"
                        >
                          Resend offer email
                        </Button>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <InterviewModal
        application={interviewApp}
        open={!!interviewApp}
        onClose={() => setInterviewApp(null)}
        onSuccess={handleApplicationUpdated}
      />

      <HireModal
        application={hireApp}
        open={!!hireApp}
        onClose={() => setHireApp(null)}
        onSuccess={handleApplicationUpdated}
      />

      {resumeApp?.resumeUrl && (
        <ResumeViewer app={resumeApp} onClose={() => setResumeApp(null)} />
      )}

      {/* Reject Confirmation */}
      <Modal
        open={!!rejectApp}
        onClose={() => setRejectApp(null)}
        title="Reject candidate"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Reject <strong>{rejectApp?.applicantName}</strong> for{" "}
            <strong>{rejectApp?.jobTitle}</strong>? The status will change to
            rejected. No email is sent to the candidate.
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setRejectApp(null)}
              disabled={!!actionLoadingId}
            >
              Cancel
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
              disabled={!!actionLoadingId}
              onClick={() => rejectApp && handleReject(rejectApp)}
            >
              {actionLoadingId === rejectApp?._id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Rejecting...
                </>
              ) : (
                "Reject"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete application"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            This will permanently remove the application. This can&apos;t be
            undone.
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={!!actionLoadingId}
            >
              Cancel
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
              disabled={!!actionLoadingId}
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              {actionLoadingId === deleteId ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ---------------------------- Resume viewer ---------------------------- */

function ResumeViewer({
  app,
  onClose,
}: {
  app: Application;
  onClose: () => void;
}) {
  const url = app.resumeUrl as string;
  const ext =
    url.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase() || "";
  const isImage = ["png", "jpg", "jpeg", "webp", "gif"].includes(ext);
  const isDoc = ["doc", "docx"].includes(ext);
  const isPdf = ext === "pdf" || (!isImage && !isDoc);

  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    isDoc ? "ready" : "loading",
  );
  const [downloading, setDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load file as blob (avoids X-Frame-Options / attachment header issues)
  useEffect(() => {
    if (isDoc) return;
    let objectUrl: string | null = null;
    let cancelled = false;

    (async () => {
      try {
        let res = await fetch(url).catch(() => null);
        if (!res || !res.ok) {
          res = await fetch(`/api/resume-proxy?url=${encodeURIComponent(url)}`);
          if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
        }
  
        const raw = await res.blob();
        const blob = new Blob([raw], {
          type: isPdf ? "application/pdf" : raw.type,
        });
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) {
          setBlobUrl(objectUrl);
          setStatus("ready");
        }
      } catch (e: any) {
        if (!cancelled) {
          setErrorMsg(e?.message || "Unknown error");
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url, isDoc, isPdf]);

  // Lock background scroll + close on Escape
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function handleDownload() {
    if (!blobUrl) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    setDownloading(true);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${app.applicantName} - Resume${ext ? `.${ext}` : ".pdf"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setDownloading(false);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 overscroll-contain"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Resume of ${app.applicantName}`}
        onClick={(e) => e.stopPropagation()}
        className="flex h-[calc(100vh-2rem)] max-h-[920px] w-full max-w-[820px] flex-col overflow-hidden rounded-xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {app.applicantName}
            </p>
            <p className="truncate text-xs text-slate-500">{app.jobTitle}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={downloading || status === "loading"}
              className="flex items-center gap-1.5 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-slate-100">
          {status === "loading" && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#00355F]" />
            </div>
          )}

          {status === "error" && (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
              <p className="text-sm font-medium text-slate-700">
                Could not load resume
              </p>
              <p className="max-w-md break-all text-xs text-slate-500">
                {errorMsg}
              </p>
              <p className="max-w-md break-all text-xs text-slate-400">{url}</p>
            </div>
          )}

          {status === "ready" && isDoc && (
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
              title={`Resume of ${app.applicantName}`}
              className="block h-full w-full border-0 bg-white"
            />
          )}

          {status === "ready" && !isDoc && blobUrl && isImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blobUrl}
              alt={`Resume of ${app.applicantName}`}
              className="mx-auto block h-auto max-w-full"
            />
          )}

          {status === "ready" && !isDoc && blobUrl && !isImage && (
            <iframe
              src={blobUrl}
              title={`Resume of ${app.applicantName}`}
              className="block h-full w-full border-0 bg-white"
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
