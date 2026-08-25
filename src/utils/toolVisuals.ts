/** Visuels documentaires : logo du domaine + capture de la page d’accueil officielle. */

const NO_SHOT = new Set([
  'doi.org',
  'dx.doi.org',
  'files.eric.ed.gov',
  'academic.oup.com'
]);

const LOGO_HOST: Record<string, string> = {
  'cran.r-project.org': 'r-project.org',
  'ggplot2.tidyverse.org': 'tidyverse.org',
  'personality-project.org': 'r-project.org',
  'pandas.pydata.org': 'pandas.pydata.org',
  'mne.tools': 'mne.tools',
  'posit.co': 'posit.co',
  'www.r-project.org': 'r-project.org'
};

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function homepageOf(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (NO_SHOT.has(host)) return '';
    if (host === 'cran.r-project.org') return 'https://www.r-project.org/';
    if (host === 'github.com') return url;
    return `${u.protocol}//${u.host}/`;
  } catch {
    return '';
  }
}

export function logoCandidates(url: string): string[] {
  const raw = hostOf(url);
  if (!raw) return [];
  const host = LOGO_HOST[raw] || raw;
  return [
    `https://logo.clearbit.com/${host}`,
    `https://www.google.com/s2/favicons?domain=${host}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${host}.ico`
  ];
}

export function shotUrl(url: string): string | undefined {
  const home = homepageOf(url);
  if (!home) return undefined;
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(home)}?w=800`;
}

const LOCAL_SHOTS = import.meta.glob('../assets/outils/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const LOCAL_LOGOS = import.meta.glob('../assets/outils/*-logo.{png,svg,webp,jpg,jpeg}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

function fileStem(path: string): string {
  return path.split('/').pop()?.replace(/\.[^.]+$/, '') || '';
}

export function localShot(id: string): string | undefined {
  const hit = Object.entries(LOCAL_SHOTS).find(([p]) => {
    const stem = fileStem(p);
    return stem === id && !stem.endsWith('-logo');
  });
  return hit?.[1];
}

export function localLogo(id: string): string | undefined {
  const hit = Object.entries(LOCAL_LOGOS).find(([p]) => fileStem(p) === `${id}-logo`);
  return hit?.[1];
}

export function monogramDataUri(title: string): string {
  const letters =
    title
      .replace(/[^A-Za-z0-9*+]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || '?';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="28" fill="#0f172a"/>
    <rect x="6" y="6" width="116" height="116" rx="24" fill="none" stroke="#5eead4" stroke-width="3"/>
    <text x="64" y="78" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="${letters.length > 1 ? 42 : 56}" font-weight="800" fill="#f8fafc">${letters}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
