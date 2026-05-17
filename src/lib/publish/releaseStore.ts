import fs from 'fs/promises';
import path from 'path';
import type { Page, ReleaseSnapshot } from '@/types/page';
import { comparePages } from '@/lib/semver/comparePages';
import {
  bumpVersion,
  detectVersionBump,
  getInitialVersion,
} from '@/lib/semver/detectVersionBump';
import { generateChangelog } from './generateChangelog';
import { generateSnapshot, snapshotFingerprint, type PublishResult } from './generateSnapshot';
import { pagesAreEqual } from '@/lib/semver/comparePages';

const RELEASES_DIR = path.join(process.cwd(), 'releases');

function releaseDir(slug: string): string {
  return path.join(RELEASES_DIR, slug);
}

function releaseFile(slug: string, version: string): string {
  return path.join(releaseDir(slug), `${version}.json`);
}

export async function listVersions(slug: string): Promise<string[]> {
  try {
    const files = await fs.readdir(releaseDir(slug));
    return files
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''))
      .sort((a, b) => {
        const pa = a.split('.').map(Number);
        const pb = b.split('.').map(Number);
        for (let i = 0; i < 3; i++) {
          if (pa[i] !== pb[i]) return pa[i] - pb[i];
        }
        return 0;
      });
  } catch {
    return [];
  }
}

export async function getLatestRelease(slug: string): Promise<ReleaseSnapshot | null> {
  const versions = await listVersions(slug);
  if (versions.length === 0) return null;

  const latest = versions[versions.length - 1];
  const content = await fs.readFile(releaseFile(slug, latest), 'utf-8');
  return JSON.parse(content) as ReleaseSnapshot;
}

export async function getReleaseByVersion(
  slug: string,
  version: string,
): Promise<ReleaseSnapshot | null> {
  try {
    const content = await fs.readFile(releaseFile(slug, version), 'utf-8');
    return JSON.parse(content) as ReleaseSnapshot;
  } catch {
    return null;
  }
}

export async function publishPage(draft: Page): Promise<PublishResult> {
  const latest = await getLatestRelease(draft.slug);
  const previousPage = latest?.page ?? null;

  if (pagesAreEqual(previousPage, draft)) {
    const version = latest?.version ?? getInitialVersion();
    return {
      created: false,
      version,
      bump: 'patch',
      snapshot: latest ?? generateSnapshot(draft, version, ['No changes — idempotent publish']),
    };
  }

  const fingerprint = snapshotFingerprint(draft);
  if (latest && snapshotFingerprint(latest.page) === fingerprint) {
    return {
      created: false,
      version: latest.version,
      bump: 'patch',
      snapshot: latest,
    };
  }

  const bump = detectVersionBump(previousPage, draft);
  const currentVersion = latest?.version ?? '0.0.0';
  const version =
    latest === null ? getInitialVersion() : bumpVersion(currentVersion, bump);

  const diff = comparePages(previousPage, draft);
  const changelog = generateChangelog(diff, bump);
  const snapshot = generateSnapshot(draft, version, changelog);

  await fs.mkdir(releaseDir(draft.slug), { recursive: true });
  await fs.writeFile(releaseFile(draft.slug, version), JSON.stringify(snapshot, null, 2));

  return { created: true, version, bump, snapshot };
}
