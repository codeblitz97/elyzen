import ky, { KyInstance } from 'ky';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { getInfo } from '@/lib/info';
import { NextRequest, NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import * as v from 'valibot';

const API_URL = 'https://scrape-api-ten.vercel.app/api';

const animepahe = ky.create({ prefix: `${API_URL}/animepahe` });
const senshi = ky.create({ prefix: `${API_URL}/senshi` });
const anineko = ky.create({ prefix: `${API_URL}/anineko` });
const animegg = ky.create({ prefix: `${API_URL}/animegg` });
const anizone = ky.create({ prefix: `${API_URL}/anizone` });
const watchanimeworld = ky.create({ prefix: `${API_URL}/watchanimeworld` });

const providers: { name: string; client: KyInstance }[] = [
  { name: 'animepahe', client: animepahe },
  { name: 'senshi', client: senshi },
  { name: 'anineko', client: anineko },
  { name: 'animegg', client: animegg },
  { name: 'watchanimeworld', client: watchanimeworld },
  { name: 'anizone', client: anizone },
];

const providerClientMap = new Map<string, KyInstance>(
  providers.map(({ name, client }) => [name, client])
);

export interface UnifiedEpisode {
  title: string;
  number: number;
  description: string;
  thumbnail: string;
  rating: number;
  season: number;
  released: string;
  tvdbId: number;
  duration: number;
  hasAired: boolean;
  providers: { providerName: string; providerId: string }[];
}

interface RawProviderEpisodes {
  providerName: string;
  animeId: string;
  episodes: ProviderEpisodeRaw[];
}

interface ProviderEpisodeRaw {
  id: string;
  number: number;
  url: string;
  title?: string;
  image?: string;
}

export interface MergedEpisode {
  title: string | null;
  image: string | null;
  number: number;
  providers: { providerName: string; providerId: string }[];
}

export interface ProviderSearchResult {
  id: string;
  title: string;
  url: string;
  image: string;
}

export interface ProviderMatch {
  providerName: string;
  providerId: string;
  matchScore: number;
}

export interface TitleProviderMapping {
  title: string;
  providers: ProviderMatch[];
}

export interface EpisodeReturn {
  id: string;
  title: string;
  number: number;
  description: string;
  isFiller: boolean;
  thumbnail: string;
  rating: number;
  season: number;
  released: string;
  tvdbId: number;
  duration: number;
  hasAired: boolean;
}

export interface EpisodeReturnType {
  providerId: string;
  episodes: {
    sub: EpisodeReturn[];
    dub: EpisodeReturn[];
  };
}

type AnizipEpisode = Omit<EpisodeReturn, 'isFiller' | 'id'>;

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[a.length][b.length];
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function similarityScore(a: string, b: string): number {
  const normA = normalize(a);
  const normB = normalize(b);

  if (normA === normB) return 100;

  const distance = levenshtein(normA, normB);
  const maxLen = Math.max(normA.length, normB.length) || 1;
  const score = (1 - distance / maxLen) * 100;

  return Math.max(0, Math.round(score));
}

const ParamsSchema = v.object({
  id: v.pipe(v.string(), v.trim(), v.minLength(1, 'Missing anime id!')),
});

const getAnizipMetadata = async (anilistId: string) => {
  const response = await ky
    .get(`https://api.ani.zip/mappings?anilist_id=${anilistId}`)
    .json<{
      episodes: {
        [key: string]: {
          seasonNumber: number;
          episodeNumber: number;
          title: {
            ja: string;
            en?: string;
            'x-jat'?: string;
          };
          image: string;
          overview: string;
          summary: string;
          airDateUtc: string;
          rating: string;
          episode: string;
          runtime: number;
          tvdbId: number;
        };
      };
    }>();

  // ignore special episodes.
  const episodes = Object.values(response.episodes).filter(
    (ep) => !ep.episode.startsWith('S')
  );

  const formattedEpisodes: AnizipEpisode[] = episodes.map((episode, idx) => ({
    title: episode.title.en || episode.title['x-jat'] || episode.title.ja,
    number: idx + 1,
    description: episode.overview || episode.summary.split('\nSource:')[0],
    thumbnail: episode.image,
    released: formatDistanceToNow(parseISO(episode.airDateUtc), {
      addSuffix: true,
    }),
    season: episode.seasonNumber,
    rating: Number(episode.rating),
    tvdbId: episode.tvdbId,
    duration: episode.runtime,
    hasAired: episode.airDateUtc
      ? new Date(episode.airDateUtc) <= new Date()
      : false,
  }));

  return formattedEpisodes;
};

async function searchAllProviders(
  titles: string[]
): Promise<{ providerName: string; result: ProviderSearchResult }[]> {
  const tasks = providers.flatMap(({ name, client }) =>
    titles.map(async (title) => {
      const results = await client
        .get(`search?q=${encodeURIComponent(title)}`)
        .json<ProviderSearchResult[]>();
      return { providerName: name, results };
    })
  );

  const settled = await Promise.allSettled(tasks);

  const pool: { providerName: string; result: ProviderSearchResult }[] = [];

  for (const outcome of settled) {
    if (outcome.status === 'fulfilled') {
      for (const result of outcome.value.results) {
        pool.push({ providerName: outcome.value.providerName, result });
      }
    }
  }

  return pool;
}

export async function getAllProvidersSearch(
  titles: string[]
): Promise<TitleProviderMapping> {
  const mainTitle = titles[0];
  if (!mainTitle) {
    throw new Error('Need at least one title to search with, silly!');
  }

  const pool = await searchAllProviders(titles);

  const bestByProvider = new Map<string, ProviderMatch>();

  for (const { providerName, result } of pool) {
    let bestScore = 0;
    for (const title of titles) {
      const score = similarityScore(title, result.title);
      if (score > bestScore) bestScore = score;
    }

    const current = bestByProvider.get(providerName);
    if (!current || bestScore > current.matchScore) {
      bestByProvider.set(providerName, {
        providerName,
        providerId: result.id,
        matchScore: bestScore,
      });
    }
  }

  return {
    title: mainTitle,
    providers: Array.from(bestByProvider.values()),
  };
}

async function fetchProviderEpisodes(
  providerName: string,
  providerId: string
): Promise<{ providerName: string; episodes: ProviderEpisodeRaw[] }> {
  const client = providerClientMap.get(providerName);
  if (!client) {
    throw new Error(`No client found for provider: ${providerName}`);
  }

  const episodes = await client
    .get(`episodes/${providerId}`)
    .json<ProviderEpisodeRaw[]>();

  return { providerName, episodes };
}

async function fetchAllRawProviderEpisodes(
  searches: TitleProviderMapping
): Promise<RawProviderEpisodes[]> {
  const tasks = searches.providers.map(async ({ providerName, providerId }) => {
    const { episodes } = await fetchProviderEpisodes(providerName, providerId);
    return { providerName, animeId: providerId, episodes };
  });

  const settled = await Promise.allSettled(tasks);

  return settled
    .filter(
      (outcome): outcome is PromiseFulfilledResult<RawProviderEpisodes> =>
        outcome.status === 'fulfilled'
    )
    .map((outcome) => outcome.value);
}

export function getEpisodes(
  id: string,
  legacy?: true
): Promise<EpisodeReturnType[]>;
export function getEpisodes(
  id: string,
  legacy: false
): Promise<UnifiedEpisode[]>;
export async function getEpisodes(
  id: string
): Promise<EpisodeReturnType[] | UnifiedEpisode[]> {
  const anilistInfo = await getInfo(Number(id));
  const titles = [
    ...new Set(
      Object.values(anilistInfo.title).filter((title) => title) as string[]
    ),
  ];

  const [anizipEpisodes, searches] = await Promise.all([
    getAnizipMetadata(id).catch(() => [] as AnizipEpisode[]),
    getAllProvidersSearch(titles),
  ]);

  const anizipByNumber = new Map<number, AnizipEpisode>(
    anizipEpisodes.map((ep) => [ep.number, ep])
  );

  const rawProviderEpisodes = await fetchAllRawProviderEpisodes(searches);

  const merged = new Map<number, UnifiedEpisode>();

  for (const { providerName, episodes } of rawProviderEpisodes) {
    for (const ep of episodes) {
      const anizipEp = anizipByNumber.get(ep.number);
      const existing = merged.get(ep.number);

      if (existing) {
        existing.providers.push({ providerName, providerId: ep.id });
        continue;
      }

      merged.set(ep.number, {
        title: anizipEp?.title ?? ep.title ?? `Episode ${ep.number}`,
        description: anizipEp?.description ?? '',
        thumbnail: anizipEp?.thumbnail ?? ep.image ?? '',
        rating: anizipEp?.rating ?? 0,
        season: anizipEp?.season ?? 1,
        released: anizipEp?.released ?? '',
        tvdbId: anizipEp?.tvdbId ?? 0,
        duration: anizipEp?.duration ?? 0,
        hasAired: anizipEp?.hasAired ?? false,
        number: ep.number,
        providers: [{ providerName, providerId: ep.id }],
      });
    }
  }

  return Array.from(merged.values()).sort((a, b) => a.number - b.number);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rawParams = await params;

  const result = v.safeParse(ParamsSchema, rawParams);
  if (!result.success) {
    return NextResponse.json(
      { error: v.flatten(result.issues).nested?.id?.[0] ?? 'Invalid anime id' },
      { status: 400 }
    );
  }

  const { id } = result.output;
  const cacheKey = `episodes:${id}`;

  const cachedData = await cache.get(cacheKey);

  if (cachedData)
    return NextResponse.json(JSON.parse(cachedData), {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });

  try {
    const episodes = await getEpisodes(id, false);

    await cache.set(cacheKey, JSON.stringify(episodes));

    return NextResponse.json(episodes, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error(`Failed to fetch episodes for ${id}:`, error);

    return NextResponse.json(
      { error: 'Failed to fetch episodes, oopsie!' },
      { status: 500 }
    );
  }
}
