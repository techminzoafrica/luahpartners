export type SiteFormType =
  | "waiting-list"
  | "home-improvement-quote"
  | "contact";

export type SiteFormSubmitResult =
  | { ok: true }
  | { ok: false; error: string };

const FALLBACK_ERROR =
  "We couldn't submit your request right now. Please try again, or reach us at 800 800 2911 or Info@luahpartners.com.";

export async function submitSiteForm<T extends Record<string, unknown>>(
  formType: SiteFormType,
  values: T,
  honeypot = ""
): Promise<SiteFormSubmitResult> {
  try {
    const response = await fetch(`/api/forms/${formType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, website: honeypot }),
    });

    const data: { ok?: boolean; error?: string } | null = await response
      .json()
      .catch(() => null);

    if (!response.ok || !data?.ok) {
      return { ok: false, error: data?.error || FALLBACK_ERROR };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: FALLBACK_ERROR };
  }
}
