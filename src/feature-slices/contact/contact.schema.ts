import { z } from "zod";
import { optionalPhoneSchema } from "@/lib/validation/phone";

export const contactAudienceOptions = [
  { value: "prospective-resident", label: "Prospective resident" },
  { value: "current-resident", label: "Current resident" },
  { value: "property-owner", label: "Property owner" },
  { value: "seller-landowner", label: "Seller or Landowner" },
  { value: "vendor", label: "Vendor" },
] as const;

export const contactAudienceLabels: Record<ContactValues["audience"], string> = {
  "prospective-resident": "Prospective resident",
  "current-resident": "Current resident",
  "property-owner": "Property owner",
  "seller-landowner": "Seller or Landowner",
  vendor: "Vendor",
};

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: optionalPhoneSchema,
  audience: z.enum(["prospective-resident", "current-resident", "property-owner", "seller-landowner", "vendor"]),
  message: z.string().trim().max(2000, "Use 2,000 characters or fewer."),
});

export type ContactValues = z.infer<typeof contactSchema>;
