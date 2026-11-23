"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  homeImprovementServiceOptions,
  quoteSchema,
  type QuoteValues,
} from "./quote.schema";
import { FormReadyMessage } from "@/components/forms/FormReadyMessage";
import { FormSuccessOverlay } from "@/components/forms/FormSuccessOverlay";
import { SelectField } from "@/components/forms/SelectField";
import { PhoneField } from "@/components/forms/PhoneField";
import { TextareaField } from "@/components/forms/TextareaField";
import { TextField } from "@/components/forms/TextField";
import { submitSiteForm } from "@/lib/forms/submit-form";

function Arrow() {
  return <Image src="/images/listing-arrow-right.svg" alt="" aria-hidden="true" width={16} height={16} />;
}

export function HomeImprovementQuoteForm() {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { name: "", email: "", phone: "", serviceNeeded: "bathroom", address: "", details: "" },
  });
  const [honeypot, setHoneypot] = useState("");
  const [phoneResetKey, setPhoneResetKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const onValidSubmit = async (values: QuoteValues) => {
    setErrorMessage(null);
    const result = await submitSiteForm(
      "home-improvement-quote",
      values,
      honeypot
    );

    if (result.ok) {
      reset();
      setHoneypot("");
      setPhoneResetKey((key) => key + 1);
      setIsSuccessOpen(true);
      return;
    }

    setErrorMessage(result.error);
  };

  return (
    <div className="relative">
      <form
        aria-hidden={isSuccessOpen}
        className="border border-brand-sand bg-white p-6 sm:p-8"
        noValidate
        onSubmit={handleSubmit(onValidSubmit, () => setErrorMessage(null))}
      >
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <p className="text-xs text-brand-muted">* Required fields</p>
        <div className="mt-6 space-y-6">
          <TextField label="Name" error={errors.name} errorId="quote-name-error" placeholder="Your name" {...register("name")} required />
          <TextField label="Email" error={errors.email} errorId="quote-email-error" type="email" placeholder="you@example.com" {...register("email")} required />
          <PhoneField key={phoneResetKey} control={control} name="phone" label="Phone" error={errors.phone} errorId="quote-phone-error" id="quote-phone" required />
          <SelectField
            control={control}
            name="serviceNeeded"
            label="Service needed"
            required
            options={homeImprovementServiceOptions}
            errorId="quote-service-error"
            hint="Bathroom remodeling · Kitchen remodeling · Concrete & masonry · Flooring & drywall · Painting · Decks, patios & exterior · General repair or handyman · Not sure yet"
          />
          <TextField label="Property address" error={errors.address} errorId="quote-address-error" placeholder="Street, city DC or MD" {...register("address")} required />
          <TextareaField label="Project details" error={errors.details} errorId="quote-details-error" placeholder="What are you looking to have done?" {...register("details")} required />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 inline-flex min-h-12 items-center gap-3 border border-brand-gold-light bg-brand-gold-light px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "SENDING..." : "REQUEST A QUOTE"}
          {!isSubmitting && <Arrow />}
        </button>
        <FormReadyMessage visible={Boolean(errorMessage)} variant="error">
          {errorMessage}
        </FormReadyMessage>
        <p className="mt-6 text-[13px] leading-[1.8] text-brand-muted">By submitting you agree to our <Link href="/privacy-policy" className="underline underline-offset-2">Privacy Policy</Link>. We do not sell your information.</p>
      </form>

      <FormSuccessOverlay
        open={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Quote request sent"
        caption="We'll follow up within one business day."
      />
    </div>
  );
}
