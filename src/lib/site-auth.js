export const SESSION_COOKIE = "life_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getPassword() {
  return process.env.CHAT_PASSWORD?.trim() ?? "";
}

function getSecret() {
  const explicit = process.env.AUTH_SECRET?.trim();
  if (explicit) return explicit;
  const password = getPassword();
  // Local/dev fallback so a single CHAT_PASSWORD is enough to start.
  return password ? `life-admin-agent:${password}` : "";
}

function base64urlFromBytes(bytes) {
  let binary = "";
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i = 0; i < view.length; i += 1) {
    binary += String.fromCharCode(view[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function bytesFromBase64url(input) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64urlFromString(value) {
  return base64urlFromBytes(new TextEncoder().encode(value));
}

function stringFromBase64url(input) {
  return new TextDecoder().decode(bytesFromBase64url(input));
}

function timingSafeEqualBytes(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function sign(payloadB64) {
  const secret = getSecret();
  if (!secret) return null;
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64),
  );
  return base64urlFromBytes(signature);
}

export function isAuthConfigured() {
  return Boolean(getPassword() && getSecret());
}

export function checkPassword(password) {
  const expected = getPassword();
  if (!expected || typeof password !== "string") return false;
  const a = new TextEncoder().encode(password.normalize("NFC"));
  const b = new TextEncoder().encode(expected.normalize("NFC"));
  return timingSafeEqualBytes(a, b);
}

export async function createSessionToken() {
  if (!isAuthConfigured()) return null;
  const payload = base64urlFromString(
    JSON.stringify({ exp: Date.now() + SESSION_TTL_MS, v: 1 }),
  );
  const signature = await sign(payload);
  if (!signature) return null;
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !isAuthConfigured()) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = await sign(payload);
  if (!expected) return false;

  const a = bytesFromBase64url(signature);
  const b = bytesFromBase64url(expected);
  if (!timingSafeEqualBytes(a, b)) return false;

  try {
    const data = JSON.parse(stringFromBase64url(payload));
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function readSessionTokenFromCookieHeader(cookieHeader) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

export async function isRequestAuthenticated(request) {
  const header =
    typeof request.headers?.get === "function"
      ? request.headers.get("cookie")
      : request.headers?.cookie;
  const token = readSessionTokenFromCookieHeader(header ?? "");
  return verifySessionToken(token);
}

export function sessionCookieOptions(token) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL),
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}
