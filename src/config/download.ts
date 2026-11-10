/**
 * URL de descarga oficial del instalador de BISync POS para Windows.
 * Se obtiene prioritariamente de la variable de entorno PUBLIC_DOWNLOAD_URL.
 * Si no está definida en el entorno, utiliza la URL oficial por defecto en GitHub Releases de bisync-pos-web (público).
 */
export const DEFAULT_DOWNLOAD_URL =
  'https://github.com/BISync-Solutions/bisync-pos-web/releases/latest/download/Bisync_POS_setup.exe';

export const downloadUrl: string =
  import.meta.env.PUBLIC_DOWNLOAD_URL || DEFAULT_DOWNLOAD_URL;

export const DOWNLOAD_URL = downloadUrl;

export default downloadUrl;
