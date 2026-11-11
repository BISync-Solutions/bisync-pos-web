/**
 * BISync POS - Dynamic Client-side Release Synchronizer
 * 
 * Verifica en segundo plano la última versión disponible en GitHub Releases
 * y actualiza de manera no intrusiva los elementos de la interfaz:
 * - [data-release-version]: Etiquetas de versión (ej. v0.3.3)
 * - [data-release-link="exe"]: Enlaces de descarga del instalador EXE
 * - [data-release-link="msi"]: Enlaces de descarga del paquete MSI
 * - [data-release-link="notes"]: Enlaces a las notas de versión
 */

const REPO_OWNER = 'BISync-Solutions';
const REPO_NAME = 'bisync-pos-web';
const CACHE_KEY = 'bisync_latest_release';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos de caché para evitar rate-limits

interface CachedRelease {
  version: string;
  tagName: string;
  downloadUrlExe: string;
  downloadUrlMsi: string;
  notesUrl: string;
  timestamp: number;
}

function applyReleaseData(data: Pick<CachedRelease, 'tagName' | 'version' | 'downloadUrlExe' | 'downloadUrlMsi' | 'notesUrl'>) {
  // Actualizar textos de versión
  document.querySelectorAll<HTMLElement>('[data-release-version]').forEach((el) => {
    el.textContent = data.tagName;
  });

  // Actualizar enlaces EXE
  if (data.downloadUrlExe) {
    document.querySelectorAll<HTMLAnchorElement>('[data-release-link="exe"]').forEach((el) => {
      el.href = data.downloadUrlExe;
    });
  }

  // Actualizar enlaces MSI
  if (data.downloadUrlMsi) {
    document.querySelectorAll<HTMLAnchorElement>('[data-release-link="msi"]').forEach((el) => {
      el.href = data.downloadUrlMsi;
    });
  }

  // Actualizar enlaces a notas
  if (data.notesUrl) {
    document.querySelectorAll<HTMLAnchorElement>('[data-release-link="notes"]').forEach((el) => {
      el.href = data.notesUrl;
    });
  }
}

export async function initReleaseSync() {
  if (typeof window === 'undefined') return;

  // 1. Intentar leer desde caché en sessionStorage
  try {
    const rawCache = sessionStorage.getItem(CACHE_KEY);
    if (rawCache) {
      const parsed: CachedRelease = JSON.parse(rawCache);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        applyReleaseData(parsed);
        return;
      }
    }
  } catch (_e) {
    // Si el storage está bloqueado o corrupto, continuar
  }

  // 2. Consultar API de GitHub de forma asíncrona no bloqueante
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) return;

    const data = await res.json();
    const tagName: string = data.tag_name;
    if (!tagName) return;

    const version = tagName.replace(/^v/, '');
    const assets = (data.assets || []) as Array<{ name: string; browser_download_url: string }>;

    const exeAsset = assets.find((a) => a.name === 'Bisync_POS_setup.exe') || assets.find((a) => a.name.endsWith('.exe'));
    const msiAsset = assets.find((a) => a.name.endsWith('.msi'));

    const releasePayload: CachedRelease = {
      tagName,
      version,
      downloadUrlExe: exeAsset?.browser_download_url || `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/`,
      downloadUrlMsi: msiAsset?.browser_download_url || `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/download/${tagName}/Bisync.POS_${version}_x64_en-US.msi`,
      notesUrl: data.html_url || `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/tag/${tagName}`,
      timestamp: Date.now(),
    };

    applyReleaseData(releasePayload);

    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(releasePayload));
    } catch (_e) {
      // Ignorar si el storage está restringido
    }
  } catch (_err) {
    // Fallo silencioso: la página ya cuenta con los valores renderizados en build time
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReleaseSync);
  } else {
    initReleaseSync();
  }
}
