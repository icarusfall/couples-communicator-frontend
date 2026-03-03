let cachedKey: CryptoKey | null = null;

export async function deriveKey(passphrase: string, saltBase64: string): Promise<void> {
  const encoder = new TextEncoder();
  const salt = Uint8Array.from(atob(saltBase64), (c) => c.charCodeAt(0));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  cachedKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function getKey(): CryptoKey {
  if (!cachedKey) throw new Error('Encryption key not derived. Call deriveKey first.');
  return cachedKey;
}

export async function encrypt(plaintext: string): Promise<{ ciphertext: string; iv: string }> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    getKey(),
    encoder.encode(plaintext)
  );

  return {
    ciphertext: btoa(Array.from(new Uint8Array(encrypted), b => String.fromCharCode(b)).join('')),
    iv: btoa(Array.from(iv, b => String.fromCharCode(b)).join('')),
  };
}

export async function decrypt(ciphertextBase64: string, ivBase64: string): Promise<string> {
  const ciphertext = Uint8Array.from(atob(ciphertextBase64), (c) => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    getKey(),
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

export function hasCryptoKey(): boolean {
  return cachedKey !== null;
}

export function clearCryptoKey(): void {
  cachedKey = null;
}
