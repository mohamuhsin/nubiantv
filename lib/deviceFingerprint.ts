/**
 * Generates a unique, persistent browser/device fingerprint.
 * ----------------------------------------------------------
 * - Uses a local random secret per browser to ensure uniqueness.
 * - Combines safe, non-identifying browser signals.
 * - Returns a SHA-256 hash string (same device → same hash).
 * - Stored secret in localStorage keeps it consistent across sessions.
 */
export async function generateDeviceFingerprint(): Promise<string> {
  // Retrieve or create a persistent per-browser secret
  let deviceSecret = localStorage.getItem("device_secret");
  if (!deviceSecret) {
    deviceSecret = crypto.randomUUID();
    localStorage.setItem("device_secret", deviceSecret);
  }

  // Collect safe, non-identifying browser signals
  const signals = {
    ua: navigator.userAgent ?? "",
    platform: navigator.platform ?? "",
    language: navigator.language ?? "",
    screen: `${screen.width}x${screen.height}@${
      screen.pixelDepth ?? screen.colorDepth
    }`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
    cores: (navigator.hardwareConcurrency ?? 0).toString(),
    memory:
      (
        navigator as Navigator & { deviceMemory?: number }
      ).deviceMemory?.toString() ?? "0",
  };

  // Canonicalize object keys for deterministic hashing
  const canonical = JSON.stringify(
    Object.keys(signals)
      .sort()
      .reduce<Record<string, string>>((acc, key) => {
        acc[key] = signals[key as keyof typeof signals].toString();
        return acc;
      }, {})
  );

  // Combine canonicalized signals with persistent secret
  const fingerprintString = `${canonical}|${deviceSecret}`;

  // Hash using SHA-256 (Web Crypto API)
  const buffer = new TextEncoder().encode(fingerprintString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}
