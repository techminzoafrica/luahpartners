import { z } from "zod";
import { requiredPhoneSchema } from "@/lib/validation/phone";

export const homeImprovementServiceOptions = [
  { value: "bathroom", label: "Bathroom remodeling" },
  { value: "kitchen", label: "Kitchen remodeling" },
  { value: "concrete", label: "Concrete & masonry" },
  { value: "flooring", label: "Flooring & drywall" },
  { value: "painting", label: "Painting" },
  { value: "exterior", label: "Decks, patios & exterior" },
  { value: "repair", label: "General repair or handyman" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const homeImprovementServiceLabels: Record<QuoteValues["serviceNeeded"], string> = {
  bathroom: "Bathroom remodeling",
  kitchen: "Kitchen remodeling",
  concrete: "Concrete & masonry",
  flooring: "Flooring & drywall",
  painting: "Painting",
  exterior: "Decks, patios & exterior",
  repair: "General repair or handyman",
  "not-sure": "Not sure yet",
};

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: requiredPhoneSchema,
  serviceNeeded: z.enum(["bathroom", "kitchen", "concrete", "flooring", "painting", "exterior", "repair", "not-sure"]),
  address: z.string().trim().min(5, "Enter the project address."),
  details: z.string().trim().min(15, "Please add a little more detail about the project."),
});

export type QuoteValues = z.infer<typeof quoteSchema>;
