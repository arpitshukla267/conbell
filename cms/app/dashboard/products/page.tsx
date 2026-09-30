"use client";
import { useEffect, useState, useCallback } from "react";
import { productsApi, type Product, type Spec } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input, Textarea } from "@/components/ui/input";
import { ImageUpload } from "@/components/image-upload";
import { resolveMediaUrl } from "@/lib/media-url";
import { PageHeader } from "@/components/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Package } from "lucide-react";
import { ActiveToggle } from "@/components/ui/active-toggle";
import { optimisticToggle } from "@/lib/optimistic-toggle";

const CATEGORIES = [
  { value: "conveyor", label: "Conveyor" },
  { value: "structural", label: "Structural" },
  { value: "safety", label: "Safety" },
  { value: "fabrication", label: "Fabrication" },
  { value: "project", label: "Turnkey Projects" },
];

const EMPTY: Partial<Product> = {
  slug: "",
  title: "",
  category: "conveyor",
  badge: "",
  description: "",
  longDescription: "",
  features: [],
  image: "",
  gallery: [],
  specs: [],
  isActive: true,
  order: 0,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productsApi.list();
      setProducts(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditing({ ...EMPTY, order: products.length + 1 });
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditing({ ...p });
    setModalOpen(true);
  }

  function setField<K extends keyof Product>(key: K, value: Product[K]) {
    setEditing((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!editing.title) { toast.error("Product title is required"); return; }
    setSaving(true);
    try {
      const payload = {
        ...editing,
        slug: editing.slug || slugify(editing.title || ""),
      };
      if (editing._id) {
        await productsApi.update(editing._id, payload);
        toast.success("Product updated");
      } else {
        await productsApi.create(payload);
        toast.success("Product created");
      }
      setModalOpen(false);
      load();
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(p: Product) {
    setTogglingId(p._id);
    try {
      await optimisticToggle(p, setProducts, productsApi.toggle, {
        on: "Product shown on site",
        off: "Product hidden from site",
      });
    } finally {
      setTogglingId(null);
    }
  }

  async function doDelete(id: string) {
    try {
      await productsApi.delete(id);
      toast.success("Product deleted");
      setDeleteId(null);
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  const productIdentifier = editing.slug || slugify(editing.title || "") || "new-product";

  return (
    <div>
      <PageHeader
        title="Products Catalogue"
        description="Manage engineered structural components, fabrication products, and project specifications."
        action={
          <Button onClick={openNew} size="lg" className="shadow-md shadow-[#00355F]/20">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-7 h-7 animate-spin text-[#00355F]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card key={p._id} className="overflow-hidden flex flex-col justify-between group hover:border-[#B2CDFA] hover:shadow-lg transition-all duration-200">
              <div>
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveMediaUrl(p.image)}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Package className="w-12 h-12" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-[#00355F] text-white text-[11px] font-semibold uppercase tracking-wider">
                      {p.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <Badge variant={p.isActive ? "success" : "warning"}>
                      {p.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                </div>

                <CardBody className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#00355F] transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {p.description || "No short description."}
                    </p>
                  </div>

                  {p.specs && p.specs.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      {p.specs.slice(0, 3).map((s, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-slate-600">
                          <span className="font-medium text-slate-400">{s.label}:</span>
                          <span className="truncate max-w-[150px]">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <ActiveToggle
                  active={Boolean(p.isActive)}
                  loading={togglingId === p._id}
                  onToggle={() => toggle(p)}
                />

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteId(p._id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing._id ? "Edit Product" : "Add Product"} size="xl">
        <div className="flex flex-col gap-6">
          {/* Basic */}
          <section className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-[#00355F] uppercase tracking-widest">Basic Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Product Title"
                value={editing.title || ""}
                onChange={(e) => {
                  setField("title", e.target.value);
                  if (!editing._id) setField("slug", slugify(e.target.value));
                }}
                placeholder="e.g. Conveyor Structure"
                className="col-span-2"
              />
              <Input
                label="Slug (URL ID)"
                value={editing.slug || ""}
                onChange={(e) => setField("slug", e.target.value)}
                placeholder="conveyor-structure"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
                <select
                  value={editing.category || "conveyor"}
                  onChange={(e) => setField("category", e.target.value)}
                  className="border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#00355F]/25 focus:border-[#00355F] transition-all"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Badge"
                value={editing.badge || ""}
                onChange={(e) => setField("badge", e.target.value)}
                placeholder="e.g. Heavy Duty, Safety, Structural"
                className="col-span-2"
              />
            </div>
          </section>

          {/* Product Image */}
          <section className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-[#00355F] uppercase tracking-widest">Main Cover Image</h3>
            <ImageUpload
              value={editing.image || ""}
              onChange={(url) => setField("image", url)}
              uploadContext={{
                section: "products",
                identifier: productIdentifier,
                field: "main",
              }}
            />
          </section>

          {/* Card & Detail Descriptions */}
          <section className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-[#00355F] uppercase tracking-widest">Descriptions</h3>
            <div className="flex flex-col gap-3">
              <Textarea
                label="Short Description (Card)"
                value={editing.description || ""}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Short 1-2 line summary for card view..."
                rows={2}
              />
              <Textarea
                label="Long Description (Detail Page)"
                value={editing.longDescription || ""}
                onChange={(e) => setField("longDescription", e.target.value)}
                placeholder="Comprehensive description for the product detail page..."
                rows={4}
              />
            </div>
          </section>

          {/* Features */}
          <section className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-[#00355F] uppercase tracking-widest">Bullet Features / Highlights</h3>
            <div className="flex flex-col gap-2">
              {(editing.features || []).map((feat, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-xs text-slate-400 font-mono w-4">{i + 1}.</span>
                  <Input
                    value={feat}
                    onChange={(e) => {
                      const updated = [...(editing.features || [])];
                      updated[i] = e.target.value;
                      setField("features", updated);
                    }}
                    placeholder="e.g. Engineered for site-specific span and load"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (editing.features || []).filter((_, idx) => idx !== i);
                      setField("features", updated);
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
                onClick={() => setField("features", [...(editing.features || []), ""])}
              >
                <Plus className="w-3.5 h-3.5" /> Add Feature
              </Button>
            </div>
          </section>

          {/* Specifications */}
          <section className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-[#00355F] uppercase tracking-widest">Technical Specifications</h3>
            <div className="flex flex-col gap-2">
              {(editing.specs || []).map((spec, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    value={spec.label}
                    onChange={(e) => {
                      const updated = [...(editing.specs || [])];
                      updated[i] = { ...updated[i], label: e.target.value };
                      setField("specs", updated);
                    }}
                    placeholder="Label (e.g. Material)"
                    className="flex-1"
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) => {
                      const updated = [...(editing.specs || [])];
                      updated[i] = { ...updated[i], value: e.target.value };
                      setField("specs", updated);
                    }}
                    placeholder="Value (e.g. MS / GI structural steel)"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (editing.specs || []).filter((_, idx) => idx !== i);
                      setField("specs", updated);
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
                onClick={() => setField("specs", [...(editing.specs || []), { label: "", value: "" }])}
              >
                <Plus className="w-3.5 h-3.5" /> Add Specification
              </Button>
            </div>
          </section>

          {/* Gallery Images */}
          <section className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-[#00355F] uppercase tracking-widest">Detail Page Gallery Images</h3>
            <div className="flex flex-col gap-2">
              {(editing.gallery || []).map((gUrl, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    value={gUrl}
                    onChange={(e) => {
                      const updated = [...(editing.gallery || [])];
                      updated[i] = e.target.value;
                      setField("gallery", updated);
                    }}
                    placeholder="Image URL or static path (e.g. /products/conveyor-structure-1.webp)"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (editing.gallery || []).filter((_, idx) => idx !== i);
                      setField("gallery", updated);
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
                onClick={() => setField("gallery", [...(editing.gallery || []), ""])}
              >
                <Plus className="w-3.5 h-3.5" /> Add Gallery Image URL
              </Button>
            </div>
          </section>

          {/* Settings */}
          <section className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-[#00355F] uppercase tracking-widest">Display Settings</h3>
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
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} loading={saving}>
              {editing._id ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product?" size="sm">
        <p className="text-sm text-slate-600 mb-6">This action will permanently remove this product from the database.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="destructive" onClick={() => deleteId && doDelete(deleteId)}>Delete Product</Button>
        </div>
      </Modal>
    </div>
  );
}
