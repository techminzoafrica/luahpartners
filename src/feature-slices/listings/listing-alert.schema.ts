import { z } from "zod";
import { optionalPhoneSchema } from "@/lib/validation/phone";

export const listingInterestOptions = [
  { value: "lease-now", label: "A home for lease now" },
  { value: "studio-one", label: "Studio or 1 bedroom" },
  { value: "two-three", label: "2 or 3 bedroom" },
  { value: "multifamily", label: "Multifamily or investment unit" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const listingInterestLabels: Record<ListingAlertValues["interest"], string> = {
  "lease-now": "A home for lease now",
  "studio-one": "Studio or 1 bedroom",
  "two-three": "2 or 3 bedroom",
  multifamily: "Multifamily or investment unit",
  "not-sure": "Not sure yet",
};

export const listingAlertSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: optionalPhoneSchema,
  interest: z.enum(["lease-now", "studio-one", "two-three", "multifamily", "not-sure"]),
  preferredArea: z.string().trim().max(120, "Use 120 characters or fewer."),
});

export type ListingAlertValues = z.infer<typeof listingAlertSchema>;
