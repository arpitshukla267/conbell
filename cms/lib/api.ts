import type { UploadContext } from "./upload-context";
import { getToken, clearToken } from "./auth";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function handleUnauthorized() {
  clearToken();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cms-logout"));
  }
}

async function req<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Your session has expired. Please sign in again.");
  }

  const json = await res.json();
  if (!json.success) throw new Error(json.error || "API error");
  return json.data as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type Spec = { label: string; value: string };

export type Product = {
  _id: string;
  slug: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  longDescription: string;
  features: string[];
  image: string;
  gallery: string[];
  specs: Spec[];
  isActive: boolean;
  order: number;
};

export type HeroSlide = {
  _id: string;
  heading: string;
  accentHeading: string;
  subtext: string;
  imageDesktop: string;
  imageMobile: string;
  isActive: boolean;
  order: number;
};

export type ProcessStep = {
  _id: string;
  number: string;
  title: string;
  description: string;
  highlights: string[];
  isActive: boolean;
  order: number;
};

export type QualityPoint = {
  _id: string;
  number: string;
  title: string;
  description: string;
  isActive: boolean;
  order: number;
};

export type Service = {
  _id: string;
  slug: string;
  category: string;
  badge: string;
  title: string;
  shortTitle: string;
  description: string;
  contribution: string;
  specs: Spec[];
  image: string;
  isActive: boolean;
  order: number;
};

export type Faq = {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
};

export type Client = {
  _id: string;
  name: string;
  logo: string;
  order: number;
  isActive: boolean;
};

export type Job = {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  order: number;
  isActive: boolean;
  createdAt?: string;
};

export type RecruitmentHistoryItem = {
  _id?: string;
  action: string;
  fromStatus?: string;
  toStatus?: string;
  details?: Record<string, any>;
  email?: {
    to: string;
    subject: string;
    body: string;
    hasAttachment?: boolean;
    attachmentName?: string;
    attachmentUrl?: string;
    messageId?: string;
    sentAt?: string;
  };
  performedBy: string;
  timestamp: string;
};

export type InterviewDetails = {
  date?: string;
  time?: string;
  mode?: string;
  location?: string;
  notes?: string;
  scheduledAt?: string;
  scheduledBy?: string;
};

export type HiringDetails = {
  hiredAt?: string;
  hiredBy?: string;
  offerLetterUrl?: string;
  offerLetterName?: string;
};

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "interview"
  | "interview_taken"
  | "hired"
  | "accepted"
  | "rejected";

export type Application = {
  _id: string;
  jobId?: { _id: string; title: string; department?: string } | string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  message: string;
  experience: string;
  status: ApplicationStatus;
  interviewDetails?: InterviewDetails;
  hiringDetails?: HiringDetails;
  history?: RecruitmentHistoryItem[];
  createdAt: string;
  updatedAt?: string;
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  list: () => req<Product[]>("/api/products/all"),
  get: (slug: string) => req<Product>(`/api/products/${slug}`),
  create: (data: Partial<Product>) =>
    req<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Product>) =>
    req<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  toggle: (id: string) =>
    req<Product>(`/api/products/${id}/toggle`, { method: "PATCH" }),
  delete: (id: string) =>
    req<{ message: string }>(`/api/products/${id}`, { method: "DELETE" }),
};

// ─── Services ─────────────────────────────────────────────────────────────────
export const servicesApi = {
  list: () => req<Service[]>("/api/services/all"),
  create: (data: Partial<Service>) =>
    req<Service>("/api/services", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Service>) =>
    req<Service>(`/api/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  toggle: (id: string) =>
    req<Service>(`/api/services/${id}/toggle`, { method: "PATCH" }),
  delete: (id: string) =>
    req<{ message: string }>(`/api/services/${id}`, { method: "DELETE" }),
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
export const heroApi = {
  list: () => req<HeroSlide[]>("/api/hero/all"),
  create: (data: Partial<HeroSlide>) =>
    req<HeroSlide>("/api/hero", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<HeroSlide>) =>
    req<HeroSlide>(`/api/hero/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  toggle: (id: string) =>
    req<HeroSlide>(`/api/hero/${id}/toggle`, { method: "PATCH" }),
  delete: (id: string) =>
    req<{ message: string }>(`/api/hero/${id}`, { method: "DELETE" }),
};

// ─── Content helpers (process-steps, quality-points, etc.) ───────────────────
function contentApi<T>(segment: string) {
  return {
    list: () => req<T[]>(`/api/content/${segment}/all`),
    create: (data: Partial<T>) =>
      req<T>(`/api/content/${segment}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<T>) =>
      req<T>(`/api/content/${segment}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    toggle: (id: string) =>
      req<T>(`/api/content/${segment}/${id}/toggle`, { method: "PATCH" }),
    delete: (id: string) =>
      req<{ message: string }>(`/api/content/${segment}/${id}`, {
        method: "DELETE",
      }),
  };
}

export const processStepsApi = contentApi<ProcessStep>("process-steps");
export const qualityPointsApi = contentApi<QualityPoint>("quality-points");

// ─── Site settings (config keys) ─────────────────────────────────────────────
export const siteSettingsApi = {
  getAll: () => req<Record<string, unknown>>("/api/content/config"),
  update: (key: string, value: unknown) =>
    req<{ key: string; value: unknown }>(`/api/content/config/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    }),
};

// ─── FAQs ─────────────────────────────────────────────────────────────────────
export const faqsApi = {
  list: () => req<Faq[]>("/api/faqs/all"),
  create: (data: Partial<Faq>) =>
    req<Faq>("/api/faqs", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Faq>) =>
    req<Faq>(`/api/faqs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  toggle: (id: string) =>
    req<Faq>(`/api/faqs/${id}/toggle`, { method: "PATCH" }),
  delete: (id: string) =>
    req<{ message: string }>(`/api/faqs/${id}`, { method: "DELETE" }),
};

// ─── Clients ──────────────────────────────────────────────────────────────────
export const clientsApi = {
  list: () => req<Client[]>("/api/clients/all"),
  create: (data: Partial<Client>) =>
    req<Client>("/api/clients", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Client>) =>
    req<Client>(`/api/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  toggle: (id: string) =>
    req<Client>(`/api/clients/${id}/toggle`, { method: "PATCH" }),
  delete: (id: string) =>
    req<{ message: string }>(`/api/clients/${id}`, { method: "DELETE" }),
};

// ─── Jobs / Vacancies ─────────────────────────────────────────────────────────
export const jobsApi = {
  list: () => req<Job[]>("/api/jobs/all"),
  get: (id: string) => req<Job>(`/api/jobs/${id}`),
  create: (data: Partial<Job>) =>
    req<Job>("/api/jobs", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Job>) =>
    req<Job>(`/api/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  toggle: (id: string) =>
    req<Job>(`/api/jobs/${id}/toggle`, { method: "PATCH" }),
  delete: (id: string) =>
    req<{ message: string }>(`/api/jobs/${id}`, { method: "DELETE" }),
};

// ─── Job Applications / Responses ─────────────────────────────────────────────
export const applicationsApi = {
  list: (status?: string) =>
    req<Application[]>(
      `/api/applications/all${status ? `?status=${status}` : ""}`,
    ),
  get: (id: string) => req<Application>(`/api/applications/${id}`),
  updateStatus: (id: string, status: string, performedBy?: string) =>
    req<Application>(`/api/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, performedBy }),
    }),
  scheduleInterview: (
    id: string,
    data: {
      date: string;
      time: string;
      mode: string;
      location: string;
      notes?: string;
      sendEmailNotification: boolean;
      email?: { to: string; subject: string; message: string };
      performedBy?: string;
    },
  ) =>
    req<Application>(`/api/applications/${id}/schedule-interview`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  markInterviewTaken: (
    id: string,
    data?: { notes?: string; performedBy?: string },
  ) =>
    req<Application>(`/api/applications/${id}/interview-taken`, {
      method: "POST",
      body: JSON.stringify(data || {}),
    }),
  hire: (
    id: string,
    data: {
      sendEmailNotification?: boolean;
      email?: {
        to: string;
        subject: string;
        message: string;
      };
      offerLetterUrl?: string;
      offerLetterName?: string;
      performedBy?: string;
    },
  ) =>
    req<Application>(`/api/applications/${id}/hire`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  reject: (id: string, data?: { reason?: string; performedBy?: string }) =>
    req<Application>(`/api/applications/${id}/reject`, {
      method: "POST",
      body: JSON.stringify(data || {}),
    }),
  delete: (id: string) =>
    req<{ message: string }>(`/api/applications/${id}`, { method: "DELETE" }),
  count: (status?: string) =>
    req<{ count: number }>(
      `/api/applications/count${status ? `?status=${status}` : ""}`,
    ),
};

// ─── Upload ───────────────────────────────────────────────────────────────────

export async function uploadFile(
  file: File,
  context: UploadContext,
): Promise<string> {
  if (!context.identifier?.trim()) {
    throw new Error(
      "Save a slug or ID before uploading so the image is named correctly.",
    );
  }

  const form = new FormData();
  form.append("image", file);
  form.append("section", context.section);
  form.append("identifier", context.identifier.trim());
  form.append("field", context.field || "main");

  // FormData ke saath Content-Type khud set mat karna, browser boundary ke saath lagata hai
  const token = getToken();
  const res = await fetch(`${API}/api/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Your session has expired. Please sign in again.");
  }

  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Upload failed");
  return json.url as string;
}

/** @deprecated use uploadFile with UploadContext */
export async function uploadImage(
  file: File,
  context?: UploadContext,
): Promise<string> {
  return uploadFile(
    file,
    context || { section: "assets", identifier: "misc", field: "file" },
  );
}

// ─── Protected file download (resume / offer letter) ─────────────────────────
/**
 * Fetches a file through the backend (/api/files/download), which downloads it
 * from Cloudinary with signed credentials, and returns a blob: URL.
 *
 * Usage:
 *   const blobUrl = await fileToBlobUrl(app.resumeUrl, "resume.pdf");
 *   <iframe src={blobUrl} />
 *   <a href={blobUrl} download="resume.pdf">Download</a>
 *
 * Component unmount par URL.revokeObjectURL(blobUrl) call karna memory ke liye.
 */
export async function fileToBlobUrl(
  url: string,
  name = "file.pdf",
): Promise<string> {
  const token = getToken();
  const res = await fetch(
    `${API}/api/files/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Your session has expired. Please sign in again.");
  }

  if (!res.ok) {
    let msg = "Could not load the file.";
    try {
      const json = await res.json();
      if (json?.error) msg = json.error;
    } catch {
      /* response JSON nahi tha, default message rakho */
    }
    throw new Error(msg);
  }

  return URL.createObjectURL(await res.blob());
}

// ─── Health ───────────────────────────────────────────────────────────────────
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}
