import {
  isGoogleFormType,
  validateAndSubmitGoogleForm,
} from "@/lib/google-forms";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ formType: string }> }
) {
  const { formType } = await params;

  if (!isGoogleFormType(formType)) {
    return Response.json(
      { ok: false, error: "Unsupported form type." },
      { status: 404 }
    );
  }

  let body: Record<string, unknown>;
  try {
    const json: unknown = await request.json();
    if (!json || typeof json !== "object" || Array.isArray(json)) {
      return Response.json(
        { ok: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }
    body = json as Record<string, unknown>;
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  // Honeypot anti-spam check: silently accept bot submissions without forwarding.
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return Response.json({ ok: true });
  }

  try {
    const result = await validateAndSubmitGoogleForm(formType, body);

    if (!result.ok) {
      return Response.json(
        { ok: false, error: result.error, fieldErrors: result.fieldErrors },
        { status: result.status }
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error(`[forms/${formType}] Google Forms submission failed:`, error);
    return Response.json(
      {
        ok: false,
        error:
          "We couldn't submit your request right now. Please try again, or reach us at 800 800 2911 or Info@luahpartners.com.",
      },
      { status: 502 }
    );
  }
}
