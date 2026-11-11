/**
 * Kernel Base IDE desktop installers.
 *
 * Binaries are ~80–115 MB each (most above GitHub's 100 MB per-file limit), so they
 * are NOT committed. They are published as assets on the GitHub Release below.
 * - Dev server: served from `public/downloads/` (gitignored local copies).
 * - Production: served from the GitHub Release.
 * Override either with `VITE_DOWNLOAD_BASE_URL`.
 */
export const IDE_RELEASE_TAG = 'v1.0.0';
const RELEASE_BASE = `https://github.com/Sujoymoulick/kernelbase-docs/releases/download/${IDE_RELEASE_TAG}/`;

const env = (import.meta as unknown as { env?: Record<string, string | boolean | undefined> }).env ?? {};
const RAW_BASE: string = (env.VITE_DOWNLOAD_BASE_URL as string | undefined) || (env.DEV ? '/downloads/' : RELEASE_BASE);

export const DOWNLOAD_BASE_URL = RAW_BASE.endsWith('/') ? RAW_BASE : `${RAW_BASE}/`;

export const IDE_VERSION = '1.0.0';

export type PlatformId = 'win-x64' | 'win-arm64' | 'mac-arm64' | 'linux-x64' | 'linux-arm64';
export type OsFamily = 'Windows' | 'macOS' | 'Linux';

export interface InstallerBuild {
  id: PlatformId;
  os: OsFamily;
  arch: string;
  label: string;
  shortName: string;
  fileName: string;
  format: string;
  sizeBytes: number;
  sha256: string;
  requirements: string;
  installSteps: { text: string; code?: string }[];
}

export const INSTALLERS: InstallerBuild[] = [
  {
    id: 'win-x64',
    os: 'Windows',
    arch: 'x64 (Intel / AMD)',
    label: 'Download for Windows',
    shortName: 'Windows x64',
    fileName: 'Kernel-Base-IDE-win-x64-Setup.exe',
    format: '.exe',
    sizeBytes: 91323061,
    sha256: '2af5692ff9a2cae010892fb86bfeef89bae9a3844b39cf07f75c38ca58caeae0',
    requirements: 'Windows 10 / 11 · 64-bit · no admin rights needed',
    installSteps: [
      { text: 'Run Kernel-Base-IDE-win-x64-Setup.exe. It installs per-user to:', code: '%LOCALAPPDATA%\\Programs\\Kernel Base' },
      { text: 'The preview installer is unsigned. If SmartScreen appears, choose More info, then Run anyway.' },
      { text: 'Launch Kernel Base from the Start menu.' },
    ],
  },
  {
    id: 'win-arm64',
    os: 'Windows',
    arch: 'ARM64 (Snapdragon)',
    label: 'Download for Windows ARM64',
    shortName: 'Windows ARM64',
    fileName: 'Kernel-Base-IDE-win-arm64-Setup.exe',
    format: '.exe',
    sizeBytes: 86343406,
    sha256: 'deae9ee32e6377cd682cdf14f1b62acbffdfdd4fe89d1bac65e403c7dd11fed1',
    requirements: 'Windows 11 on ARM · no admin rights needed',
    installSteps: [
      { text: 'Run Kernel-Base-IDE-win-arm64-Setup.exe. It installs per-user to:', code: '%LOCALAPPDATA%\\Programs\\Kernel Base' },
      { text: 'The preview installer is unsigned. If SmartScreen appears, choose More info, then Run anyway.' },
      { text: 'Launch Kernel Base from the Start menu.' },
    ],
  },
  {
    id: 'mac-arm64',
    os: 'macOS',
    arch: 'Apple Silicon (arm64)',
    label: 'Download for macOS',
    shortName: 'macOS (Apple Silicon)',
    fileName: 'Kernel-Base-IDE-arm64.dmg',
    format: '.dmg',
    sizeBytes: 120117444,
    sha256: 'fb8ddcc123226500b36a41d3da34d2758b3d83acb3898d183b9d0c5529c8c774',
    requirements: 'macOS Sonoma 14+ · M1 / M2 / M3 / M4',
    installSteps: [
      { text: 'Open the .dmg and drag Kernel Base into Applications.' },
      {
        text: 'The preview build is ad-hoc signed. If Gatekeeper blocks it, clear the quarantine flag:',
        code: 'xattr -dr com.apple.quarantine "/Applications/Kernel Base.app"',
      },
      { text: 'Launch Kernel Base from Launchpad or Spotlight.' },
    ],
  },
  {
    id: 'linux-x64',
    os: 'Linux',
    arch: 'x86_64 (x64)',
    label: 'Download for Linux x64',
    shortName: 'Linux x64',
    fileName: 'Kernel-Base-IDE-linux-x64.tar.gz',
    format: '.tar.gz',
    sizeBytes: 115683689,
    sha256: 'd636227b44d8f6fc2c4eb69212b48292281d230ef8685dcea7bb054bee1921f1',
    requirements: '64-bit desktop Linux (glibc) · Intel / AMD',
    installSteps: [
      { text: 'Extract the archive:', code: 'tar -xzf Kernel-Base-IDE-linux-x64.tar.gz' },
      { text: 'Run the IDE:', code: 'cd KernelBase-linux-x64 && ./kernelbase' },
      { text: 'If Chromium sandbox errors appear:', code: './kernelbase --no-sandbox' },
    ],
  },
  {
    id: 'linux-arm64',
    os: 'Linux',
    arch: 'ARM64 (aarch64)',
    label: 'Download for Linux ARM64',
    shortName: 'Linux ARM64',
    fileName: 'Kernel-Base-IDE-linux-arm64.tar.gz',
    format: '.tar.gz',
    sizeBytes: 120630142,
    sha256: '9e2158ff664931517cf2fa1294c75f14ae7c257e225f44356550baadf63c1ec0',
    requirements: '64-bit desktop Linux (glibc) · ARM64 devices',
    installSteps: [
      { text: 'Extract the archive:', code: 'tar -xzf Kernel-Base-IDE-linux-arm64.tar.gz' },
      { text: 'Run the IDE:', code: 'cd KernelBase-linux-arm64 && ./kernelbase' },
      { text: 'If Chromium sandbox errors appear:', code: './kernelbase --no-sandbox' },
    ],
  },
];

export const CHECKSUMS_URL = `${DOWNLOAD_BASE_URL}SHA256SUMS.txt`;

export const downloadUrl = (build: InstallerBuild) => `${DOWNLOAD_BASE_URL}${build.fileName}`;

export const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(0)} MB`;

export const OS_FAMILIES: OsFamily[] = ['Windows', 'macOS', 'Linux'];

export interface DetectedPlatform {
  /** Best-guess installer for this visitor. */
  id: PlatformId;
  /** Phone or tablet: the desktop app cannot be installed on this device. */
  isMobile: boolean;
}

/** Synchronous best guess, from the user agent. */
export function detectPlatform(): DetectedPlatform {
  if (typeof navigator === 'undefined') return { id: 'win-x64', isMobile: false };
  const ua = navigator.userAgent.toLowerCase();
  const uaData = (navigator as Navigator & { userAgentData?: { platform?: string; mobile?: boolean } }).userAgentData;
  const platform = (uaData?.platform || navigator.platform || '').toLowerCase();
  const isIpad = platform === 'macintel' && navigator.maxTouchPoints > 1;
  const isMobile = Boolean(uaData?.mobile) || /android|iphone|ipad|ipod|mobile/.test(ua) || isIpad;

  if (/iphone|ipad|ipod/.test(ua) || isIpad) return { id: 'mac-arm64', isMobile: true };
  if (ua.includes('android')) return { id: 'win-x64', isMobile: true };
  if (ua.includes('windows') || platform.startsWith('win')) {
    return { id: /arm64|aarch64/.test(ua) ? 'win-arm64' : 'win-x64', isMobile };
  }
  if (ua.includes('mac') || platform.includes('mac')) return { id: 'mac-arm64', isMobile };
  if (ua.includes('linux') || platform.includes('linux') || ua.includes('cros')) {
    return { id: /aarch64|arm64/.test(ua) ? 'linux-arm64' : 'linux-x64', isMobile };
  }
  return { id: 'win-x64', isMobile };
}

/**
 * Refines the CPU architecture with User-Agent Client Hints where available
 * (Chromium on Windows/Linux reports "arm" vs "x86"). Resolves to the sync guess otherwise.
 */
export async function refinePlatform(guess: DetectedPlatform): Promise<DetectedPlatform> {
  if (guess.isMobile || typeof navigator === 'undefined') return guess;
  const uaData = (navigator as Navigator & {
    userAgentData?: { getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string; bitness?: string }> };
  }).userAgentData;
  if (!uaData?.getHighEntropyValues) return guess;
  try {
    const { architecture } = await uaData.getHighEntropyValues(['architecture', 'bitness']);
    const arm = architecture === 'arm';
    if (guess.id.startsWith('win')) return { ...guess, id: arm ? 'win-arm64' : 'win-x64' };
    if (guess.id.startsWith('linux')) return { ...guess, id: arm ? 'linux-arm64' : 'linux-x64' };
  } catch {
    /* hints unavailable */
  }
  return guess;
}
