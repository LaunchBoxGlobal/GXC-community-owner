export function extractEmailDomain(email) {
  const match = email.match(/@.+$/);
  return match ? match[0] : null;
}
