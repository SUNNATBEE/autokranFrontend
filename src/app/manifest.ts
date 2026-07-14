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
      { src: "/autokran-logo.jpg", sizes: "any", type: "image/jpeg" },
    ],
  };
}
