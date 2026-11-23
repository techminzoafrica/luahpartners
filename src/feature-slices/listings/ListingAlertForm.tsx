"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  listingAlertSchema,
  listingInterestOptions,
  type ListingAlertValues,
} from "./listing-alert.schema";
import { FormReadyMessage } from "@/components/forms/FormReadyMessage";
import { FormSuccessOverlay } from "@/components/forms/FormSuccessOverlay";
import { SelectField } from "@/components/forms/SelectField";
import { PhoneField } from "@/components/forms/PhoneField";
import { TextField } from "@/components/forms/TextField";
import { submitSiteForm } from "@/lib/forms/submit-form";

function Arrow() {
  return <Image src="/images/listing-arrow-right.svg" alt="" aria-hidden="true" width={16} height={16} />;
}

export function ListingAlertForm() {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ListingAlertValues>({
    resolver: zodResolver(listingAlertSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: "lease-now",
      preferredArea: "",
    },
  });
  const [honeypot, setHoneypot] = useState("");
  const [phoneResetKey, setPhoneResetKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const onValidSubmit = async (values: ListingAlertValues) => {
    setErrorMessage(null);
    const result = await submitSiteForm("waiting-list", values, honeypot);

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
          <TextField label="Name" error={errors.name} errorId="listing-name-error" placeholder="Your name" {...register("name")} required />
          <TextField label="Email" error={errors.email} errorId="listing-email-error" type="email" placeholder="you@example.com" {...register("email")} required />
          <PhoneField key={phoneResetKey} control={control} name="phone" label="Phone (optional)" error={errors.phone} errorId="listing-phone-error" />
          <SelectField
            control={control}
            name="interest"
            label="Looking for"
            required
            options={listingInterestOptions}
            errorId="listing-interest-error"
            hint="A home for lease now · Studio or 1 bedroom · 2 or 3 bedroom · Multifamily or investment unit · Not sure yet"
          />
          <TextField label="Preferred area (optional)" error={errors.preferredArea} errorId="listing-area-error" placeholder="Neighborhood, city or county" {...register("preferredArea")} />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 inline-flex min-h-12 items-center gap-3 border border-brand-gold-light bg-brand-gold-light px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "SENDING..." : "NOTIFY ME"}
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
        title="You're on the list"
        caption="We'll email you when a matching home is ready."
      />
    </div>
  );
}
