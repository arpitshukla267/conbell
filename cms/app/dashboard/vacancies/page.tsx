"use client";
import { useState, useEffect, useCallback } from "react";
import { jobsApi, type Job } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/input";
import { ActiveToggle } from "@/components/ui/active-toggle";
import { optimisticToggle } from "@/lib/optimistic-toggle";
import { toast } from "sonner";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Clock,
  Layers,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface VacancyFormData {
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirementsText: string;
  responsibilitiesText: string;
  order: number;
  isActive: boolean;
}

const EMPTY_FORM: VacancyFormData = {
  title: "",
  department: "Engineering & CAD/CAM",
  location: "Kalol, Gujarat (On-site)",
  type: "Full-time",
  experience: "2-5 Years",
  description: "",
  requirementsText: "",
  responsibilitiesText: "",
  order: 0,
  isActive: true,
};

export default function VacanciesPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VacancyFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jobsApi.list();
      setJobs(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to load job vacancies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  function openNew() {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      order: jobs.length + 1,
    });
    setModalOpen(true);
  }

  function openEdit(job: Job) {
    setEditingId(job._id);
    setForm({
      title: job.title,
      department: job.department || "Engineering & CAD/CAM",
      location: job.location || "Kalol, Gujarat (On-site)",
      type: job.type || "Full-time",
      experience: job.experience || "2-5 Years",
      description: job.description || "",
      requirementsText: (job.requirements || []).join("\n"),
      responsibilitiesText: (job.responsibilities || []).join("\n"),
      order: job.order ?? 0,
      isActive: job.isActive ?? true,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Job description is required");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<Job> = {
        title: form.title.trim(),
        department: form.department.trim(),
        location: form.location.trim(),
        type: form.type.trim(),
        experience: form.experience.trim(),
        description: form.description.trim(),
        requirements: form.requirementsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        responsibilities: form.responsibilitiesText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        order: Number(form.order) || 0,
        isActive: form.isActive,
      };

      if (editingId) {
        await jobsApi.update(editingId, payload);
        toast.success("Job vacancy updated successfully");
      } else {
        await jobsApi.create(payload);
        toast.success("New job vacancy posted successfully");
      }

      setModalOpen(false);
      loadJobs();
    } catch (e: any) {
      toast.error(e.message || "Failed to save job vacancy");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await jobsApi.delete(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success("Vacancy removed");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete vacancy");
    } finally {
      setDeleteId(null);
    }
  }

  async function handleToggle(job: Job) {
    setTogglingId(job._id);
    await optimisticToggle(
      job,
      setJobs,
      (id) => jobsApi.toggle(id),
    );
    setTogglingId(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Vacancies & Hiring"
        description="Post and manage career openings displayed on the website's Careers page."
        action={
          <Button onClick={openNew}>
            <Plus className="w-4 h-4" /> Post New Vacancy
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-7 h-7 animate-spin text-[#00355F]" />
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardBody className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#00355F] flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">No Vacancies Posted</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-5">
              Click &quot;Post New Vacancy&quot; above to create open roles that prospective candidates can apply to.
            </p>
            <Button onClick={openNew}>
              <Plus className="w-4 h-4" /> Post First Job
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card key={job._id} className="relative overflow-hidden group hover:border-[#00355F]/40 transition-all shadow-sm">
              <CardBody className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF4FF] text-[#00355F]">
                        {job.department}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {job.type}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug pt-1">{job.title}</h3>
                  </div>

                  <Badge variant={job.isActive ? "success" : "warning"}>
                    {job.isActive ? "Accepting Applications" : "Closed / Hidden"}
                  </Badge>
                </div>

                {/* Meta details */}
                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Exp: {job.experience}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Priority: #{job.order}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Requirements tags */}
                {job.requirements && job.requirements.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Key Highlights ({job.requirements.length})
                    </span>
                    <ul className="space-y-1">
                      {job.requirements.slice(0, 2).map((req, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00355F] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Card Action footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <ActiveToggle
                      active={job.isActive}
                      loading={togglingId === job._id}
                      onToggle={() => handleToggle(job)}
                    />
                    <span className="text-xs text-slate-500">
                      {job.isActive ? "Live on site" : "Draft / Off"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(job)}>
                      <Pencil className="w-3.5 h-3.5 text-slate-600" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(job._id)}>
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Job Vacancy" : "Post New Job Vacancy"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Job Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Senior Structural Design Engineer"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="e.g. Engineering & CAD/CAM"
            />
            <Input
              label="Job Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              placeholder="e.g. Full-time, Contract"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Kalol, Gujarat (On-site)"
            />
            <Input
              label="Experience Required"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              placeholder="e.g. 3-5 Years"
            />
          </div>

          <Textarea
            label="Job Overview / Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Describe role objectives, team scope, and primary mission..."
            required
          />

          <Textarea
            label="Key Requirements (one per line)"
            value={form.requirementsText}
            onChange={(e) => setForm({ ...form, requirementsText: e.target.value })}
            rows={4}
            placeholder="Degree in Mechanical Engineering&#10;Proficiency in SolidWorks & AutoCAD&#10;Hands-on knowledge of IS 800 codes"
          />

          <Textarea
            label="Key Responsibilities (one per line)"
            value={form.responsibilitiesText}
            onChange={(e) => setForm({ ...form, responsibilitiesText: e.target.value })}
            rows={4}
            placeholder="Prepare 3D CAD models and fabrication blueprints&#10;Coordinate with production supervisors&#10;Perform static load calculations"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Input
              label="Display Order"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-[#00355F] focus:ring-[#00355F] border-slate-300"
              />
              <label htmlFor="isActive" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Accept Applications Immediately (Active)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editingId ? "Update Vacancy" : "Post Vacancy"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this job vacancy? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete Vacancy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
