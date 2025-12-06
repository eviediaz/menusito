const ALLOWED_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateSecureId(length: number = 4): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * ALLOWED_CHARS.length);
    result += ALLOWED_CHARS[randomIndex];
  }
  return result;
}
