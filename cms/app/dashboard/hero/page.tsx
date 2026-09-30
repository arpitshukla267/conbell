"use client";
import { useEffect, useState, useCallback } from "react";
import { heroApi, type HeroSlide } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";
import { resolveMediaUrl } from "@/lib/media-url";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { ActiveToggle } from "@/components/ui/active-toggle";
import { optimisticToggle } from "@/lib/optimistic-toggle";

const EMPTY: Partial<HeroSlide> = {
  heading: "", accentHeading: "", subtext: "",
  imageDesktop: "", imageMobile: "",
  isActive: true, order: 0,
};

export default function HeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<HeroSlide>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await heroApi.list();
      setSlides(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to load hero slides");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditing({ ...EMPTY, order: slides.length + 1 });
    setModalOpen(true);
  }

  function openEdit(s: HeroSlide) {
    setEditing({ ...s });
    setModalOpen(true);
  }

  function setField<K extends keyof HeroSlide>(key: K, value: HeroSlide[K]) {
    setEditing((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!editing.heading) { toast.error("Heading is required"); return; }
    setSaving(true);
    try {
      if (editing._id) {
        await heroApi.update(editing._id, editing);
        toast.success("Slide updated");
      } else {
        await heroApi.create(editing);
        toast.success("Slide created");
      }
      setModalOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(s: HeroSlide) {
    setTogglingId(s._id);
    try {
      await optimisticToggle(s, setSlides, heroApi.toggle, {
        on: "Slide shown on homepage",
        off: "Slide hidden from homepage",
      });
    } finally {
      setTogglingId(null);
    }
  }

  async function doDelete(id: string) {
    try {
      await heroApi.delete(id);
      toast.success("Slide deleted");
      setDeleteId(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  const heroIdentifier = editing.heading?.substring(0, 15).replace(/\s+/g, '-') || "new-slide";

  return (
    <div>
      <PageHeader
        title="Hero Slides"
        description="Manage hero slides and visual feature stories displayed on the homepage slider."
        action={
          <Button onClick={openNew} size="lg" className="shadow-md shadow-[#00355F]/20">
            <Plus className="w-4 h-4" /> Add Slide
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-7 h-7 animate-spin text-[#00355F]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((s) => (
            <Card
              key={s._id}
              className="overflow-hidden flex flex-col justify-between group hover:border-[#B2CDFA] hover:shadow-lg transition-all duration-200"
            >
              <div>
                <div className="relative w-full h-56 bg-slate-900 overflow-hidden">
                  {s.imageDesktop ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveMediaUrl(s.imageDesktop)}
                      alt={s.heading}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  <div className="absolute top-3 right-3">
                    <Badge variant={s.isActive ? "success" : "warning"}>
                      {s.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg sm:text-xl line-clamp-1 leading-snug">
                      {s.heading} <span className="text-[#B2CDFA]">{s.accentHeading}</span>
                    </h3>
                  </div>
                </div>

                <CardBody className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {s.subtext || "No slide description."}
                  </p>
                </CardBody>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <ActiveToggle
                  active={Boolean(s.isActive)}
                  loading={togglingId === s._id}
                  onToggle={() => toggle(s)}
                />

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                    <Pencil className="w-3.5 h-3.5" /> Edit Slide
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing._id ? "Edit Hero Slide" : "Add Hero Slide"} size="lg">
        <div className="flex flex-col gap-5">
          <Input label="Heading" value={editing.heading || ""} onChange={(e) => setField("heading", e.target.value)} placeholder="Precision Engineering" className="w-full" />
          <Input label="Accent Heading" value={editing.accentHeading || ""} onChange={(e) => setField("accentHeading", e.target.value)} placeholder="Solutions" className="w-full" />
          <Textarea label="Subtext" value={editing.subtext || ""} onChange={(e) => setField("subtext", e.target.value)} rows={3} className="w-full" />

          <ImageUpload
            label="Desktop Image"
            value={editing.imageDesktop || ""}
            onChange={(url) => setField("imageDesktop", url)}
            uploadContext={{ section: "hero", identifier: heroIdentifier, field: "desktop" }}
          />
          <ImageUpload
            label="Mobile Image (optional)"
            value={editing.imageMobile || ""}
            onChange={(url) => setField("imageMobile", url)}
            uploadContext={{ section: "hero", identifier: heroIdentifier, field: "mobile" }}
          />

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
            <Button onClick={save} loading={saving}>{editing._id ? "Save Changes" : "Create Slide"}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Slide?" size="sm">
        <p className="text-sm text-slate-600 mb-6">This action will permanently remove this hero slide.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="destructive" onClick={() => deleteId && doDelete(deleteId)}>Delete Slide</Button>
        </div>
      </Modal>
    </div>
  );
}
