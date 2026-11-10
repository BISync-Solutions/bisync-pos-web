import { downloadUrl, DEFAULT_DOWNLOAD_URL } from './download';

export { downloadUrl, DEFAULT_DOWNLOAD_URL };

export interface ReleaseAsset {
  name: string;
  downloadUrl: string;
  size?: number;
}

export interface ReleaseInfo {
  version: string;
  tagName: string;
  name: string;
  publishedAt: string;
  publishedFormatted: string;
  downloadUrlExe: string;
  downloadUrlMsi: string;
  versionedExeUrl?: string;
  releasesUrl: string;
  notesUrl: string;
}

export const GITHUB_REPO = {
  owner: 'BISync-Solutions',
  repo: 'bisync-pos-web',
};

/**
 * Configuración estática base / fallback de la última versión estable.
 * Se utiliza cuando la API pública de GitHub no está disponible o durante compilación offline.
 */
export const DEFAULT_RELEASE: ReleaseInfo = {
  version: '0.3.3',
  tagName: 'v0.3.3',
  name: 'Bisync POS v0.3.3',
  publishedAt: '2026-11-08T04:23:34Z',
  publishedFormatted: '8 de noviembre de 2026',
  downloadUrlExe: downloadUrl,
  downloadUrlMsi: `https://github.com/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/releases/download/v0.3.3/Bisync.POS_0.3.3_x64_en-US.msi`,
  versionedExeUrl: `https://github.com/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/releases/download/v0.3.3/Bisync.POS_0.3.3_x64-setup.exe`,
  releasesUrl: `https://github.com/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/releases`,
  notesUrl: `https://github.com/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/releases/tag/v0.3.3`,
};

/**
 * Obtiene los metadatos de la última versión publicada en GitHub Releases.
 * En modo SSG (Static Site Generation), consulta la API en build time.
 * Si falla la red o hay límite de tasa (rate-limit), retorna DEFAULT_RELEASE sin romper la compilación.
 */
export async function getLatestRelease(): Promise<ReleaseInfo> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'BISync-POS-Web-SSG',
    };

    // Soporte opcional para GITHUB_TOKEN en CI/CD para evitar rate limits
    const envToken = typeof process !== 'undefined' ? process.env?.GITHUB_TOKEN : undefined;
    if (envToken) {
      headers['Authorization'] = `token ${envToken}`;
    }

    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/releases/latest`;
    const response = await fetch(apiUrl, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return DEFAULT_RELEASE;
    }

    const data = await response.json();
    const tagName: string = data.tag_name || DEFAULT_RELEASE.tagName;
    const version = tagName.replace(/^v/, '');

    const assets = (data.assets || []) as Array<{ name: string; browser_download_url: string; size?: number }>;
    
    // Identificar instaladores
    const exeAsset = assets.find((a) => a.name === 'Bisync_POS_setup.exe') || assets.find((a) => a.name.endsWith('.exe'));
    const msiAsset = assets.find((a) => a.name.endsWith('.msi'));
    const versionedExeAsset = assets.find((a) => a.name.endsWith('.exe') && a.name !== 'Bisync_POS_setup.exe');

    const downloadUrlExe = exeAsset?.browser_download_url || DEFAULT_RELEASE.downloadUrlExe;
    const downloadUrlMsi = msiAsset?.browser_download_url || `https://github.com/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/releases/download/${tagName}/Bisync.POS_${version}_x64_en-US.msi`;
    const versionedExeUrl = versionedExeAsset?.browser_download_url;

    const publishedDate = data.published_at ? new Date(data.published_at) : new Date(DEFAULT_RELEASE.publishedAt);
    const publishedFormatted = publishedDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      version,
      tagName,
      name: data.name || `Bisync POS ${tagName}`,
      publishedAt: data.published_at || DEFAULT_RELEASE.publishedAt,
      publishedFormatted,
      downloadUrlExe,
      downloadUrlMsi,
      versionedExeUrl,
      releasesUrl: `https://github.com/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/releases`,
      notesUrl: data.html_url || `https://github.com/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/releases/tag/${tagName}`,
    };
  } catch (_err) {
    return DEFAULT_RELEASE;
  }
}
