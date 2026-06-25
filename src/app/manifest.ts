import type { MetadataRoute } from "next";
import { companyInfo } from "@/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${companyInfo.shortName} — ${companyInfo.name}`,
    short_name: companyInfo.shortName,
    description: companyInfo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#121214",
    theme_color: "#facc15",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
  };
}
