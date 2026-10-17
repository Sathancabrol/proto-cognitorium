/**
 * Normalise une URL de preuve pour un lien sortant dans le navigateur.
 * Aucun document local, script, identifiant ou protocole non-web n'est ouvert.
 * @param {unknown} value
 * @returns {string | null}
 */
export function safeEvidenceSourceUrl(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 2048 || /[\u0000-\u001F\u007F]/.test(trimmed)) return null;
  try {
    const url = new URL(trimmed);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (!url.hostname || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}
