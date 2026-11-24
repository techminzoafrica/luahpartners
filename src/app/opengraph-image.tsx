import { renderBrandOgImage } from "@/lib/og-card";

export const alt =
  "Luah Partners — Residential Real Estate, Property Management, and Home Improvement in Washington, DC and Maryland";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return renderBrandOgImage();
}
