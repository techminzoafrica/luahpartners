import type { ReactNode } from "react";

export function FormReadyMessage({
  visible,
  variant = "success",
  children = "Your details have passed validation. Online submissions will be connected when Luah Partners confirms its preferred system.",
}: {
  visible: boolean;
  variant?: "success" | "error";
  children?: ReactNode;
}) {
  if (!visible) return null;

  const toneClass =
    variant === "error"
      ? "border-red-600 bg-red-50 text-red-700"
      : "border-brand-gold bg-brand-sand-light text-brand-navy";

  return (
    <p
      className={`mt-4 border-l-2 px-3 py-2 text-sm ${toneClass}`}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      {children}
    </p>
  );
}
