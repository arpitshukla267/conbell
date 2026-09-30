"use client";
import { useEffect, useState, useCallback } from "react";
import { processStepsApi, type ProcessStep } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { ActiveToggle } from "@/components/ui/active-toggle";
import { optimisticToggle } from "@/lib/optimistic-toggle";

const EMPTY: Partial<ProcessStep> = {
  number: "01",
  title: "",
  description: "",
  highlights: [],
  isActive: true,
  order: 0,
};

export default function ProcessStepsPage() {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<ProcessStep>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await processStepsApi.list();
      setSteps(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to load process steps");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditing({
      ...EMPTY,
      order: steps.length + 1,
      number: String(steps.length + 1).padStart(2, "0"),
    });
    setModalOpen(true);
  }

  function openEdit(s: ProcessStep) {
    setEditing({ ...s });
    setModalOpen(true);
  }

  function setField<K extends keyof ProcessStep>(key: K, value: ProcessStep[K]) {
    setEditing((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!editing.title) { toast.error("Step title is required"); return; }
    setSaving(true);
    try {
      if (editing._id) {
        await processStepsApi.update(editing._id, editing);
        toast.success("Process step updated");
      } else {
        await processStepsApi.create(editing);
        toast.success("Process step created");
      }
      setModalOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(s: ProcessStep) {
    setTogglingId(s._id);
    try {
      await optimisticToggle(s, setSteps, processStepsApi.toggle, {
        on: "Step shown on site",
        off: "Step hidden from site",
      });
    } finally {
      setTogglingId(null);
    }
  }

  async function doDelete(id: string) {
    try {
      await processStepsApi.delete(id);
      toast.success("Process step deleted");
      setDeleteId(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <div>
      <PageHeader
        title="Engineering Process Steps"
        description="Manage the 4-step delivery workflow (Design, Manufacturing, Supply, Installation) displayed in Our Process."
        action={
          <Button onClick={openNew} size="lg" className="shadow-md shadow-[#00355F]/20">
            <Plus className="w-4 h-4" /> Add Step
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-7 h-7 animate-spin text-[#00355F]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((s) => (
            <Card key={s._id} className="overflow-hidden flex flex-col justify-between group hover:border-[#B2CDFA] hover:shadow-lg transition-all duration-200">
              <CardBody className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#00355F] text-white font-mono font-bold text-lg flex items-center justify-center shadow-md shadow-[#00355F]/30 shrink-0">
                      {s.number || "01"}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#00355F]">
                        Step {s.number}
                      </span>
                      <h3 className="font-bold text-slate-900 text-lg leading-snug">{s.title}</h3>
                    </div>
                  </div>

                  <Badge variant={s.isActive ? "success" : "warning"}>
                    {s.isActive ? "Active" : "Hidden"}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.description || "No description provided."}
                </p>

                {s.highlights && s.highlights.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {s.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EEF4FF] text-[#00355F] text-[11px] font-medium border border-[#B2CDFA]/50"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#00355F]" />
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </CardBody>

              <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <ActiveToggle
                  active={Boolean(s.isActive)}
                  loading={togglingId === s._id}
                  onToggle={() => toggle(s)}
                />

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteId(s._id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing._id ? "Edit Process Step" : "Add Process Step"} size="lg">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Step Number"
              value={editing.number || ""}
              onChange={(e) => setField("number", e.target.value)}
              placeholder="01"
            />
            <Input
              label="Step Title"
              value={editing.title || ""}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. Design, Manufacturing"
              className="col-span-2"
            />
          </div>

          <Textarea
            label="Description"
            value={editing.description || ""}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Detailed workflow description..."
            rows={3}
          />

          {/* Highlights List */}
          <section className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-[#00355F] uppercase tracking-widest">Key Highlights / Bullets</h3>
            <div className="flex flex-col gap-2">
              {(editing.highlights || []).map((h, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    value={h}
                    onChange={(e) => {
                      const updated = [...(editing.highlights || [])];
                      updated[i] = e.target.value;
                      setField("highlights", updated);
                    }}
                    placeholder="e.g. 3D CAD Modeling, Laser Cutting"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (editing.highlights || []).filter((_, idx) => idx !== i);
                      setField("highlights", updated);
                    }}
                    className="text-rose-400 hover:text-rose-600 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setField("highlights", [...(editing.highlights || []), ""])}
              >
                <Plus className="w-3.5 h-3.5" /> Add Highlight
              </Button>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Order" type="number" value={String(editing.order ?? 0)} onChange={(e) => setField("order", Number(e.target.value))} />
            <div className="flex flex-col gap-1.5 justify-end">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Visibility Status</label>
              <ActiveToggle
                active={Boolean(editing.isActive)}
                onToggle={() => setField("isActive", !editing.isActive)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} loading={saving}>
              {editing._id ? "Save Changes" : "Create Step"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Step?" size="sm">
        <p className="text-sm text-slate-600 mb-6">This action will permanently remove this process step.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="destructive" onClick={() => deleteId && doDelete(deleteId)}>Delete Step</Button>
        </div>
      </Modal>
    </div>
  );
}
