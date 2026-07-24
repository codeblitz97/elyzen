import { cache } from './cache';
import {
  ReturnData,
  UpcomingSeasonalResponse,
  UpcomingSeasonalReturnData,
} from '@/types/anime-data';
import { getCurrentSeason } from './utils';

interface AniListTitle {
  userPreferred: string;
  romaji: string;
  english: string | null;
  native: string;
}

interface AniListDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

interface AniListCoverImage {
  extraLarge: string | null;
  large: string | null;
  medium: string | null;
  color: string | null;
}

interface AniListNextAiringEpisode {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
}

interface AniListStudioEdge {
  isMain: boolean;
  node: { id: number; name: string; isAnimationStudio: boolean };
}

interface AniListMedia {
  id: number;
  idMal: number;
  status: string;
  title: AniListTitle;
  genres: string[];
  trailer: { id: string; site: string; thumbnail: string } | null;
  description: string;
  format: string;
  bannerImage: string | null;
  coverImage: AniListCoverImage;
  episodes: number | null;
  meanScore: number | null;
  duration: number | null;
  season: string;
  seasonYear: number;
  averageScore: number | null;
  nextAiringEpisode: AniListNextAiringEpisode | null;
  studios: { edges: AniListStudioEdge[] };
  type: string;
  startDate: AniListDate;
  endDate: AniListDate;
}

interface AniListPage<TItem> {
  pageInfo: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
  };
  media: TItem[];
}

interface AniListResponse<TItem> {
  data: { Page: AniListPage<TItem> };
  errors?: unknown;
}

const ANILIST_URL = 'https://graphql.anilist.co';

const EMPTY_RETURN: ReturnData = {
  hasNextPage: false,
  total: 0,
  lastPage: 0,
  currentPage: 0,
  results: [],
};

const fetchAndCache = async <TItem>(
  cacheId: string,
  query: string,
  variables: Record<string, unknown>
): Promise<AniListResponse<TItem>> => {
  const cacheKey = `${ANILIST_URL}:${cacheId}`;
  const cached = await cache.get(cacheKey);

  if (cached) {
    const parsed = JSON.parse(cached) as AniListResponse<TItem>;
    if (!parsed.errors) return parsed;
    await cache.del(cacheKey);
  }

  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json', Accept: 'application/json' }),
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  const data = (await response.json()) as AniListResponse<TItem>;

  if (!data.errors) await cache.set(cacheKey, JSON.stringify(data), 5 * 60 * 60);
  return data;
};

const MEDIA_FRAGMENT = `
  id idMal status(version: 2)
  title { userPreferred romaji english native }
  genres
  trailer { id site thumbnail }
  description format bannerImage
  coverImage { extraLarge large medium color }
  episodes meanScore duration season seasonYear averageScore
  nextAiringEpisode { airingAt timeUntilAiring episode }
  studios { edges { isMain node { id name isAnimationStudio } } }
  type
  startDate { year month day }
  endDate { year month day }
`;

const MEDIA_QUERY = `query (
  $page: Int, $size: Int, $sort: [MediaSort], $type: MediaType,
  $isAdult: Boolean = false, $format: MediaFormat, $season: MediaSeason,
  $seasonYear: Int, $search: String, $rating: Int, $status: MediaStatus,
  $genres: [String]
) {
  Page(page: $page, perPage: $size) {
    pageInfo { total perPage currentPage lastPage hasNextPage }
    media(
      isAdult: $isAdult, sort: $sort, type: $type, format: $format,
      season: $season, seasonYear: $seasonYear, search: $search,
      averageScore_greater: $rating, status: $status, genre_in: $genres
    ) { ${MEDIA_FRAGMENT} }
  }
}`;

const pickFirst = (...sources: (string | null | undefined)[]): string | null =>
  sources.find((src) => !!src) ?? null;

const computeTotalEpisodes = (
  episodes: number | null,
  nextAiringEpisode: AniListNextAiringEpisode | null
): number => {
  if (typeof episodes === 'number' && !Number.isNaN(episodes)) return episodes;
  if (nextAiringEpisode?.episode) return nextAiringEpisode.episode - 1;
  return 0;
};

const mapMediaItem = (item: AniListMedia) => ({
  id: item.id.toString(),
  malId: item.idMal,
  title: item.title,
  coverImage: pickFirst(item.coverImage.extraLarge, item.coverImage.large, item.coverImage.medium),
  trailer: item.trailer?.id ? `https://www.youtube.com/watch?v=${item.trailer.id}` : null,
  description: item.description,
  status: item.status,
  bannerImage: pickFirst(
    item.bannerImage,
    item.coverImage.extraLarge,
    item.coverImage.large,
    item.coverImage.medium
  ),
  rating: item.averageScore,
  meanScore: item.meanScore,
  releaseDate: item.seasonYear,
  startDate: item.startDate,
  color: item.coverImage.color,
  genres: item.genres,
  totalEpisodes: computeTotalEpisodes(item.episodes, item.nextAiringEpisode),
  duration: item.duration,
  format: item.format,
  type: item.type,
  studios: item.studios.edges.filter((edge) => edge.isMain).map((edge) => edge.node.name),
  season: item.season,
  year: item.seasonYear,
  nextAiringEpisode: item.nextAiringEpisode,
});

const toReturnData = (page: AniListPage<AniListMedia>): ReturnData => ({
  currentPage: page.pageInfo.currentPage,
  hasNextPage: page.pageInfo.hasNextPage,
  total: page.pageInfo.total,
  lastPage: page.pageInfo.lastPage,
  results: page.media.filter((item) => item.status !== 'NOT_YET_RELEASED').map(mapMediaItem),
});

const runMediaQuery = async (
  cacheId: string,
  variables: Record<string, unknown>
): Promise<ReturnData> => {
  try {
    const response = await fetchAndCache<AniListMedia>(cacheId, MEDIA_QUERY, variables);
    return toReturnData(response.data.Page);
  } catch (error) {
    console.error(error);
    return EMPTY_RETURN;
  }
};

export const getTrendingAnime = (page = 1, perPage = 24): Promise<ReturnData> =>
  runMediaQuery(`trendingNow:${page}:${perPage}`, {
    page,
    size: perPage,
    sort: ['TRENDING_DESC', 'POPULARITY_DESC'],
    type: 'ANIME',
  });

export const getAllTimePopularAnime = (): Promise<ReturnData> =>
  runMediaQuery('allTimePopularAnime', { page: 1, size: 35, sort: ['POPULARITY_DESC'], type: 'ANIME' });

export const getAllTimePopularMovies = (): Promise<ReturnData> =>
  runMediaQuery('allTimePopularMovies', {
    page: 1,
    size: 35,
    sort: ['POPULARITY_DESC', 'SCORE_DESC'],
    format: 'MOVIE',
  });

export const getPopularThisSeasonAnime = (): Promise<ReturnData> =>
  runMediaQuery('popularThisSeasonAnime', {
    page: 1,
    size: 35,
    sort: ['POPULARITY_DESC'],
    type: 'ANIME',
    season: getCurrentSeason().toUpperCase(),
    seasonYear: new Date().getFullYear(),
  });

export const top100Anime = (): Promise<ReturnData> =>
  runMediaQuery('top100Anime', { page: 1, size: 10, sort: ['SCORE_DESC'], type: 'ANIME' });

export const advancedSearch = (
  sort: string[] = ['POPULARITY_DESC'],
  search = '',
  rating = 0,
  status = '',
  format = '',
  type = '',
  year = 0,
  season = '',
  genres: string[] = [],
  page = 1,
  perPage = 24
): Promise<ReturnData> =>
  runMediaQuery(
    `advancedSearch:${search}:${sort}:${rating}:${status}:${format}:${type}:${year}:${season}:${genres}:${page}:${perPage}`,
    { page, size: perPage, sort, search, rating, status, format, type, seasonYear: year, season, genres }
  );

interface AniListSeasonalMedia {
  title: AniListTitle;
  countryOfOrigin: string;
  nextAiringEpisode: AniListNextAiringEpisode | null;
  coverImage: AniListCoverImage;
  id: number;
  idMal: number;
  season: string;
  seasonYear: number;
  isAdult: boolean;
  genres: string[];
  format: string;
  studios: { edges: AniListStudioEdge[] };
}

const UPCOMING_SEASON_QUERY = `query (
  $season: MediaSeason, $seasonYear: Int, $sort: [MediaSort],
  $isAdult: Boolean, $type: MediaType, $page: Int, $perPage: Int
) {
  Page(page: $page, perPage: $perPage) {
    media(season: $season, seasonYear: $seasonYear, sort: $sort, isAdult: $isAdult, type: $type) {
      title { romaji english native userPreferred }
      countryOfOrigin
      nextAiringEpisode { airingAt episode id mediaId timeUntilAiring }
      coverImage { extraLarge large medium color }
      id idMal season seasonYear isAdult genres format
      studios { edges { isMain node { id name isAnimationStudio } } }
    }
    pageInfo { currentPage hasNextPage lastPage perPage total }
  }
}`;

const getNextSeasonAndYear = (): { season: string; year: number } => {
  const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
  const now = new Date();
  const currentIndex = seasons.indexOf(getCurrentSeason(now.getMonth() + 1).toUpperCase());
  const nextIndex = (currentIndex + 1) % 4;
  const year = nextIndex === 0 ? now.getFullYear() + 1 : now.getFullYear();
  return { season: seasons[nextIndex], year };
};

export const getUpcomingNextSeason = async (
  page = 1,
  perPage = 24
): Promise<UpcomingSeasonalReturnData> => {
  try {
    const { season, year } = getNextSeasonAndYear();
    const response = await fetchAndCache<AniListSeasonalMedia>(
      `upcomingNextSeason:${season}:${year}:${page}:${perPage}`,
      UPCOMING_SEASON_QUERY,
      { sort: ['POPULARITY_DESC'], isAdult: false, type: 'ANIME', season, seasonYear: year, page, perPage }
    );
    const page_ = (response as unknown as { data: UpcomingSeasonalResponse }).data.Page;

    return {
      currentPage: page_.pageInfo.currentPage,
      hasNextPage: page_.pageInfo.hasNextPage,
      total: page_.pageInfo.total,
      lastPage: page_.pageInfo.lastPage,
      results: page_.media.map((item) => ({
        id: item.id.toString(),
        malId: item.idMal,
        title: item.title,
        coverImage: pickFirst(item.coverImage.extraLarge, item.coverImage.large, item.coverImage.medium),
        color: item.coverImage.color,
        studios: item.studios.edges.filter((edge) => edge.isMain).map((edge) => edge.node.name),
        season: item.season,
        year: item.seasonYear,
        genres: item.genres,
        format: item.format,
        nextAiringEpisode: item.nextAiringEpisode,
      })),
    };
  } catch (error) {
    console.error(error);
    return { hasNextPage: false, total: 0, lastPage: 0, currentPage: 0, results: [] };
  }
};