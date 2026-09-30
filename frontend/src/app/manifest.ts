import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Conbell Engineering",
    short_name: "Conbell",
    description:
      "Premier heavy industrial fabrication and conveyor systems manufacturer in Gujarat, India.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1C30",
    theme_color: "#0B1C30",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
