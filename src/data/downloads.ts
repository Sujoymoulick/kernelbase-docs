/**
 * Kernel Base IDE desktop installers.
 *
 * Binaries are ~110–115 MB each, above GitHub's 100 MB per-file limit, so they
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

export type PlatformId = 'mac-arm64' | 'linux-x64' | 'linux-arm64';

export interface InstallerBuild {
  id: PlatformId;
  os: 'macOS' | 'Linux';
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

/** Best-guess platform for the visitor, used to pick the primary CTA. */
export function detectPlatform(): PlatformId {
  if (typeof navigator === 'undefined') return 'mac-arm64';
  const ua = navigator.userAgent.toLowerCase();
  const platform = (
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ||
    navigator.platform ||
    ''
  ).toLowerCase();
  if (ua.includes('linux') || platform.includes('linux')) {
    return ua.includes('aarch64') || ua.includes('arm64') ? 'linux-arm64' : 'linux-x64';
  }
  return 'mac-arm64';
}
