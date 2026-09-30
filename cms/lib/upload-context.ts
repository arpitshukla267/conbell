export type UploadContext = {
  section: "products" | "hero" | "services" | "process-steps" | "assets" | "clients" | "resumes" | "offer-letters";
  identifier: string;
  field: string;
};

export type UploadSection = UploadContext["section"];
