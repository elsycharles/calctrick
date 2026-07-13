export const SITE_NAME = "CalcTrick";

export const SITE_DESCRIPTION =
  "Turn difficult calculations into simpler, ranked mental-math strategies with clear step-by-step explanations.";

const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  "http://localhost:3000";

function normalizeSiteUrl(value: string): URL {
  const valueWithProtocol = /^https?:\/\//u.test(value) ? value : `https://${value}`;

  try {
    return new URL(valueWithProtocol);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const SITE_URL = normalizeSiteUrl(configuredUrl);

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</gu, "\\u003c");
}
