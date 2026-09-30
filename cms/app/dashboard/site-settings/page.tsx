"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Save, Phone, Building2, MapPin, Share2 } from "lucide-react";
import { siteSettingsApi } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

type ContactForm = {
  companyName: string;
  brandName: string;
  tagline: string;
  locationShort?: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  addressLines: string[];
  social: { facebook: string; instagram: string; linkedin: string; whatsapp: string };
  copyrightTagline: string;
};

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [contact, setContact] = useState<ContactForm>({
    companyName: "Conbell Engineering Private Limited",
    brandName: "Conbell Engineering",
    tagline: "A trusted engineering partner delivering precision fabrication and industrial solutions",
    email: "info@conbellengineering.com",
    phone: "+919586610281",
    phoneDisplay: "+91-95866 10281",
    addressLines: [
      "Survey No. 298/A, Vadavswami-Ambapura Road",
      "Village: Vadavswami, Ta.: Kalol (N.G) – 382740, Gujarat.",
    ],
    social: { facebook: "", instagram: "", linkedin: "", whatsapp: "919586610281" },
    copyrightTagline: "Copyright © ConBell Engineering Pvt Ltd 2026-27",
  });

  useEffect(() => {
    siteSettingsApi
      .getAll()
      .then((cfg) => {
        if (cfg.contact) setContact(cfg.contact as ContactForm);
      })
      .catch((e) => toast.error(e.message || "Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    try {
      await siteSettingsApi.update("contact", contact);
      toast.success("Settings saved successfully");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-7 h-7 animate-spin text-[#00355F]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Site Settings"
        description="Configure contact channels, registered address, and official company credentials."
        action={
          <Button
            onClick={save}
            loading={saving}
            size="lg"
            className="px-6 shadow-md shadow-[#00355F]/20"
          >
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Card 1: Company Information */}
        <Card>
          <CardHeader className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-[#00355F]" />
            <h2 className="font-bold text-slate-900 text-sm">
              Company Information
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={contact.companyName}
                onChange={(e) =>
                  setContact({ ...contact, companyName: e.target.value })
                }
                placeholder="Conbell Engineering Private Limited"
              />
              <Input
                label="Brand Name"
                value={contact.brandName}
                onChange={(e) =>
                  setContact({ ...contact, brandName: e.target.value })
                }
                placeholder="Conbell Engineering"
              />
              <div className="md:col-span-2">
                <Input
                  label="Brand Tagline"
                  value={contact.tagline}
                  onChange={(e) =>
                    setContact({ ...contact, tagline: e.target.value })
                  }
                  placeholder="A trusted engineering partner delivering precision fabrication and industrial solutions"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Card 2: Contact Details */}
        <Card>
          <CardHeader className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-[#00355F]" />
            <h2 className="font-bold text-slate-900 text-sm">
              Contact Channels
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
                placeholder="info@conbellengineering.com"
              />
              <Input
                label="Phone Number (tel: format)"
                value={contact.phone}
                onChange={(e) =>
                  setContact({ ...contact, phone: e.target.value })
                }
                hint="+919586610281"
              />
              <Input
                label="Phone Display Text"
                value={contact.phoneDisplay}
                onChange={(e) =>
                  setContact({ ...contact, phoneDisplay: e.target.value })
                }
                placeholder="+91-95866 10281"
              />
              <Input
                label="Copyright Tagline"
                value={contact.copyrightTagline}
                onChange={(e) =>
                  setContact({ ...contact, copyrightTagline: e.target.value })
                }
                placeholder="Copyright © ConBell Engineering Pvt Ltd 2026-27"
              />
            </div>
          </CardBody>
        </Card>

        {/* Card 3: Address Details */}
        <Card>
          <CardHeader className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#00355F]" />
            <h2 className="font-bold text-slate-900 text-sm">
              Plant & Office Address
            </h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <Input
              label="Top Bar Location (short)"
              value={contact.locationShort || ""}
              onChange={(e) =>
                setContact({ ...contact, locationShort: e.target.value })
              }
              placeholder="e.g. Vadavswami, Gujarat, India"
            />
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Address Lines
            </label>
            <div className="space-y-2.5">
              {contact.addressLines.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={line}
                      onChange={(e) => {
                        const lines = [...contact.addressLines];
                        lines[i] = e.target.value;
                        setContact({ ...contact, addressLines: lines });
                      }}
                      placeholder={`Line ${i + 1}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setContact({
                        ...contact,
                        addressLines: contact.addressLines.filter(
                          (_, idx) => idx !== i,
                        ),
                      })
                    }
                    className="text-rose-400 hover:text-rose-600 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setContact({
                    ...contact,
                    addressLines: [...contact.addressLines, ""],
                  })
                }
              >
                <Plus className="w-3.5 h-3.5" /> Add Address Line
              </Button>
            </div>
          </CardBody>
        </Card>

        {/*Card 4: Contact*/}

        {/* Card 5: Social Links */}
        {/* <Card>
          <CardHeader className="flex items-center gap-2.5">
            <Share2 className="w-4 h-4 text-[#00355F]" />
            <h2 className="font-bold text-slate-900 text-sm">Social Channels & WhatsApp</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Facebook URL" value={contact.social.facebook} onChange={(e) => setContact({ ...contact, social: { ...contact.social, facebook: e.target.value } })} />
              <Input label="Instagram URL" value={contact.social.instagram} onChange={(e) => setContact({ ...contact, social: { ...contact.social, instagram: e.target.value } })} />
              <Input label="LinkedIn URL" value={contact.social.linkedin} onChange={(e) => setContact({ ...contact, social: { ...contact.social, linkedin: e.target.value } })} />
              <Input label="WhatsApp Number" value={contact.social.whatsapp} onChange={(e) => setContact({ ...contact, social: { ...contact.social, whatsapp: e.target.value } })} hint="e.g. 919586610281" />
            </div>
          </CardBody>
        </Card> */}
      </div>
    </div>
  );
}
