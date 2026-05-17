import { createClient, type ContentfulClientApi } from 'contentful';

export type ContentfulMode = 'preview' | 'published';

function getSpaceId(): string | undefined {
  return process.env.CONTENTFUL_SPACE_ID;
}

function getAccessToken(mode: ContentfulMode): string | undefined {
  if (mode === 'preview') {
    return process.env.CONTENTFUL_PREVIEW_TOKEN ?? process.env.CONTENTFUL_ACCESS_TOKEN;
  }
  return process.env.CONTENTFUL_ACCESS_TOKEN;
}

export function isContentfulConfigured(): boolean {
  return Boolean(getSpaceId() && getAccessToken('published'));
}

export function createContentfulClient(
  mode: ContentfulMode = 'published',
): ContentfulClientApi<undefined> | null {
  const spaceId = getSpaceId();
  const accessToken = getAccessToken(mode);

  if (!spaceId || !accessToken) {
    return null;
  }

  return createClient({
    space: spaceId,
    accessToken,
    host: mode === 'preview' ? 'preview.contentful.com' : 'cdn.contentful.com',
  });
}
