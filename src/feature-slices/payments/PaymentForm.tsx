"use client";

import Image from "next/image";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { paymentSchema, type PaymentValues } from "./payment.schema";
import { SelectField } from "@/components/forms/SelectField";
import { TextField } from "@/components/forms/TextField";
import { FormSuccessOverlay } from "@/components/forms/FormSuccessOverlay";

const paymentTypeOptions = [
  { value: "rent", label: "Rent" },
  { value: "security-deposit", label: "Security Deposit" },
  { value: "application-fee", label: "Application Fee" },
  { value: "invoice", label: "Invoice" },
];

function Arrow() {
  return <Image src="/images/listing-arrow-right.svg" alt="" aria-hidden="true" width={16} height={16} />;
}

export function PaymentForm() {
  const { control, handleSubmit, register, formState: { errors } } = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema), mode: "onChange", reValidateMode: "onChange",
    defaultValues: { name: "", paymentType: "rent", email: "", amount: "" },
  });
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  return (
    <div className="relative">
      <form
        aria-hidden={isSuccessOpen}
        className="border border-brand-sand bg-white p-6 sm:p-8"
        noValidate
        onSubmit={handleSubmit(
          () => setIsSuccessOpen(true),
          () => setIsSuccessOpen(false)
        )}
      >
        <p className="text-xs text-brand-muted">* Required fields</p>
        <div className="mt-6 space-y-6">
          <TextField label="Full name" error={errors.name} errorId="payment-name-error" placeholder="Your name" {...register("name")} required />
          <SelectField
            control={control}
            name="paymentType"
            label="Payment type"
            required
            options={paymentTypeOptions}
            errorId="payment-type-error"
          />
          <TextField label="Email for receipt" error={errors.email} errorId="payment-email-error" type="email" placeholder="you@example.com" {...register("email")} required />
          <TextField label="Amount (USD)" error={errors.amount} errorId="payment-amount-error" type="number" min="0.01" step="0.01" inputMode="decimal" placeholder="$  2,150.00" {...register("amount")} required />
        </div>
        <button type="submit" className="mt-6 inline-flex min-h-12 items-center gap-3 border border-brand-gold-light bg-brand-gold-light px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold">Continue to secure checkout<Arrow /></button>
        <p className="mt-6 text-[13px] leading-[1.8] text-brand-muted">Your card and bank details are entered on Stripe, not on this form.</p>
      </form>

      <FormSuccessOverlay
        open={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Details verified"
        caption="Online checkout is coming soon — call 800 800 2911 for billing help."
      />
    </div>
  );
}
