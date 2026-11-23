import {
  listingAlertSchema,
  listingInterestLabels,
} from "@/feature-slices/listings/listing-alert.schema";
import {
  homeImprovementServiceLabels,
  quoteSchema,
} from "@/feature-slices/home-improvement/quote.schema";
import {
  contactAudienceLabels,
  contactSchema,
} from "@/feature-slices/contact/contact.schema";

export type GoogleFormType =
  | "waiting-list"
  | "home-improvement-quote"
  | "contact";

export function isGoogleFormType(value: string): value is GoogleFormType {
  return (
    value === "waiting-list" ||
    value === "home-improvement-quote" ||
    value === "contact"
  );
}

function getFormConfig() {
  return {
    "waiting-list": {
      formId:
        process.env.GOOGLE_FORM_WAITING_LIST_ID ??
        "1FAIpQLSfZP5FreAo9LoAqdgTHwMD0wta5NNcIEPOYP-kwRj3Njfp5JQ",
      entries: {
        name:
          process.env.GOOGLE_FORM_WAITING_LIST_ENTRY_NAME ?? "entry.765111705",
        email:
          process.env.GOOGLE_FORM_WAITING_LIST_ENTRY_EMAIL ?? "entry.774499873",
        phone:
          process.env.GOOGLE_FORM_WAITING_LIST_ENTRY_PHONE ?? "entry.2079147007",
        interest:
          process.env.GOOGLE_FORM_WAITING_LIST_ENTRY_INTEREST ??
          "entry.1767651652",
        preferredArea:
          process.env.GOOGLE_FORM_WAITING_LIST_ENTRY_AREA ?? "entry.2042530215",
      },
    },
    "home-improvement-quote": {
      formId:
        process.env.GOOGLE_FORM_QUOTE_ID ??
        "1FAIpQLSeZH9P9YGMjjfY2X5BwDJP64lCWL4WS1ey-nKmsK9HbRUIqWQ",
      entries: {
        name: process.env.GOOGLE_FORM_QUOTE_ENTRY_NAME ?? "entry.767950272",
        email: process.env.GOOGLE_FORM_QUOTE_ENTRY_EMAIL ?? "entry.1099002246",
        phone: process.env.GOOGLE_FORM_QUOTE_ENTRY_PHONE ?? "entry.1442706935",
        serviceNeeded:
          process.env.GOOGLE_FORM_QUOTE_ENTRY_SERVICE ?? "entry.560011628",
        address:
          process.env.GOOGLE_FORM_QUOTE_ENTRY_ADDRESS ?? "entry.1859872463",
        details:
          process.env.GOOGLE_FORM_QUOTE_ENTRY_DETAILS ?? "entry.1097451890",
      },
    },
    contact: {
      formId:
        process.env.GOOGLE_FORM_CONTACT_ID ??
        "1FAIpQLSdpqaxuG8lzmp1ijs_J4YO-KBcJBWSiklzbADKCf_Oydacp3Q",
      entries: {
        name: process.env.GOOGLE_FORM_CONTACT_ENTRY_NAME ?? "entry.406960199",
        email: process.env.GOOGLE_FORM_CONTACT_ENTRY_EMAIL ?? "entry.1975512496",
        phone: process.env.GOOGLE_FORM_CONTACT_ENTRY_PHONE ?? "entry.838629864",
        audience:
          process.env.GOOGLE_FORM_CONTACT_ENTRY_AUDIENCE ?? "entry.596427665",
        message:
          process.env.GOOGLE_FORM_CONTACT_ENTRY_MESSAGE ?? "entry.762250571",
      },
    },
  } as const;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length > 0 ? `+${digits}` : "";
}

async function postToGoogleForm(
  formId: string,
  fields: Record<string, string>
): Promise<void> {
  const params = new URLSearchParams();
  for (const [entryKey, value] of Object.entries(fields)) {
    if (value.trim().length > 0) {
      params.append(entryKey, value);
    }
  }

  const endpoint = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: params.toString(),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok || response.url.includes("accounts.google.com")) {
    throw new Error(
      `Google Forms rejected submission (status ${response.status})`
    );
  }
}

function toFieldErrors(
  issues: { path: PropertyKey[]; message: string }[]
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "_form");
    fieldErrors[key] ??= [];
    fieldErrors[key].push(issue.message);
  }
  return fieldErrors;
}

export type FormSubmissionOutcome =
  | { ok: true }
  | {
      ok: false;
      status: number;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

export async function validateAndSubmitGoogleForm(
  formType: GoogleFormType,
  rawPayload: unknown
): Promise<FormSubmissionOutcome> {
  const config = getFormConfig();

  if (formType === "waiting-list") {
    const parsed = listingAlertSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return {
        ok: false,
        status: 400,
        error: "Please check your details and try again.",
        fieldErrors: toFieldErrors(parsed.error.issues),
      };
    }

    const { entries, formId } = config["waiting-list"];
    const data = parsed.data;
    await postToGoogleForm(formId, {
      [entries.name]: data.name,
      [entries.email]: data.email,
      [entries.phone]: formatPhone(data.phone),
      [entries.interest]: listingInterestLabels[data.interest],
      [entries.preferredArea]: data.preferredArea,
    });

    return { ok: true };
  }

  if (formType === "home-improvement-quote") {
    const parsed = quoteSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return {
        ok: false,
        status: 400,
        error: "Please check your project details and try again.",
        fieldErrors: toFieldErrors(parsed.error.issues),
      };
    }

    const { entries, formId } = config["home-improvement-quote"];
    const data = parsed.data;
    await postToGoogleForm(formId, {
      [entries.name]: data.name,
      [entries.email]: data.email,
      [entries.phone]: formatPhone(data.phone),
      [entries.serviceNeeded]: homeImprovementServiceLabels[data.serviceNeeded],
      [entries.address]: data.address,
      [entries.details]: data.details,
    });

    return { ok: true };
  }

  const parsed = contactSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Please check your message details and try again.",
      fieldErrors: toFieldErrors(parsed.error.issues),
    };
  }

  const { entries, formId } = config.contact;
  const data = parsed.data;
  await postToGoogleForm(formId, {
    [entries.name]: data.name,
    [entries.email]: data.email,
    [entries.phone]: formatPhone(data.phone),
    [entries.audience]: contactAudienceLabels[data.audience],
    [entries.message]: data.message,
  });

  return { ok: true };
}
