const COOKIE_KEY = "mono_user_id";
const LEGACY_KEY = "mono_user_id";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string) {
  const expires = new Date(Date.now() + 365 * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

export function getUserId(): string {
  // 1. Try cookie
  let id = getCookie(COOKIE_KEY);
  if (id) return id;

  // 2. Fallback: check localStorage (recovery from cookie expiry or old version)
  id = localStorage.getItem(LEGACY_KEY);
  if (id) {
    setCookie(COOKIE_KEY, id);
    return id;
  }

  // 3. Generate new UUID, store in both
  id = crypto.randomUUID();
  setCookie(COOKIE_KEY, id);
  localStorage.setItem(LEGACY_KEY, id);
  return id;
}
