import { cache } from './cache';
import {
  KurojiDate,
  ReturnData,
  UpcomingSeasonalReturnData,
} from '@/types/anime-data';
import { getCurrentSeason } from './utils';

interface KurojiTitle {
  romaji: string | null;
  english: string | null;
  native: string | null;
}

interface KurojiPoster {
  small: string | null;
  medium: string | null;
  large: string | null;
}


interface KurojiGenre {
  id: string;
  name: string;
}

interface KurojiStudio {
  id: number;
  name: string | null;
}

interface KurojiStudioConnection {
  is_main: boolean | null;
  studio: KurojiStudio;
}

interface KurojiAiringSchedule {
  episode: number | null;
  airing_at: number | null;
}

interface KurojiVideo {
  url: string;
  type: string | null;
  source: string | null;
}

interface KurojiMedia {
  id: number;
  id_mal: number | null;
  title: KurojiTitle;
  genres: KurojiGenre[];
  videos: KurojiVideo[];
  description: string | null;
  format: string | null;
  background: string | null;
  poster: KurojiPoster;
  episodes_total: number | null;
  episodes_aired: number | null;
  score: number | null;
  duration: number | null;
  season: string | null;
  season_year: number | null;
  next_airing_episode: KurojiAiringSchedule | null;
  studios: KurojiStudioConnection[];
  type: string | null;
  status: string | null;
  color: string | null;
  start_date: KurojiDate | null;
  end_date: KurojiDate | null;
}

interface KurojiPageInfo {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  has_next_page: boolean;
}

interface KurojiMediaPage<TItem> {
  data: TItem[];
  page_info: KurojiPageInfo;
}

interface KurojiResponse<TItem> {
  data: { media_page: KurojiMediaPage<TItem> };
  errors?: unknown;
}

const KUROJI_URL = 'https://api.kuroji.xyz/graphql';

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
): Promise<KurojiResponse<TItem>> => {
  const cacheKey = `${KUROJI_URL}:${cacheId}`;
  const cached = await cache.get(cacheKey);

  if (cached) {
    const parsed = JSON.parse(cached) as KurojiResponse<TItem>;
    if (!parsed.errors) return parsed;
    await cache.del(cacheKey);
  }

  const response = await fetch(KUROJI_URL, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  const data = (await response.json()) as KurojiResponse<TItem>;

  if (!data.errors)
    await cache.set(cacheKey, JSON.stringify(data), 5 * 60 * 60);
  return data;
};

const MEDIA_FRAGMENT = `
  id id_mal status
  title { romaji english native }
  genres { id name }
  videos(type: "trailer") { url type source }
  description format background
  poster { small medium large }
  episodes_total episodes_aired score duration season season_year
  next_airing_episode { episode airing_at }
  studios(only_main: true) { is_main studio { id name } }
  type
  color
  start_date { year month day }
  end_date { year month day }
`;

const MEDIA_QUERY = `query (
  $page: Int, $per_page: Int, $sort: [MediaSort!], $type: MediaType,
  $is_adult: Boolean = false, $format: MediaFormat, $season: MediaSeason,
  $season_year: Int, $search: String, $score_greater: Int, $status: MediaStatus,
  $genres_in: [String!]
) {
  media_page(
    page: $page, per_page: $per_page, sort: $sort, type: $type,
    is_adult: $is_adult, format: $format, season: $season,
    season_year: $season_year, search: $search,
    score_greater: $score_greater, status: $status, genres_in: $genres_in
  ) {
    data { ${MEDIA_FRAGMENT} }
    page_info { total per_page current_page last_page has_next_page }
  }
}`;

const pickFirst = (...sources: (string | null | undefined)[]): string | null =>
  sources.find((src) => !!src) ?? null;

const computeTotalEpisodes = (
  episodesTotal: number | null,
  episodesAired: number | null,
  nextAiringEpisode: KurojiAiringSchedule | null
): number => {
  if (typeof episodesTotal === 'number' && !Number.isNaN(episodesTotal))
    return episodesTotal;
  if (typeof episodesAired === 'number' && !Number.isNaN(episodesAired))
    return episodesAired;
  if (nextAiringEpisode?.episode) return nextAiringEpisode.episode - 1;
  return 0;
};

const extractTrailer = (videos: KurojiVideo[]): string | null => {
  const trailer = videos.find(
    (video) => video.type?.toLowerCase() === 'trailer'
  );
  return trailer?.url ?? null;
};

const toNextAiringEpisode = (schedule: KurojiAiringSchedule | null) => {
  if (!schedule || schedule.airing_at == null) return null;
  return {
    airingAt: schedule.airing_at,
    episode: schedule.episode,
    timeUntilAiring: Math.max(
      0,
      schedule.airing_at - Math.floor(Date.now() / 1000)
    ),
  };
};

const mapMediaItem = (item: KurojiMedia) => ({
  id: item.id.toString(),
  malId: item.id_mal,
  title: {
    userPreferred: pickFirst(
      item.title.english,
      item.title.romaji,
      item.title.native
    ),
    romaji: item.title.romaji,
    english: item.title.english,
    native: item.title.native,
  },
  coverImage: pickFirst(item.poster.large, item.poster.medium, item.poster.small),
  trailer: extractTrailer(item.videos ?? []),
  description: item.description,
  status: item.status,
  bannerImage: pickFirst(
    item.background,
    item.poster.large,
    item.poster.medium,
    item.poster.small
  ),
  rating: item.score,
  meanScore: item.score,
  releaseDate: item.season_year,
  startDate: item.start_date,
  color: item.color,
  genres: (item.genres ?? []).map((genre) => genre.name),
  totalEpisodes: computeTotalEpisodes(
    item.episodes_total,
    item.episodes_aired,
    item.next_airing_episode
  ),
  duration: item.duration,
  format: item.format,
  type: item.type,
  studios: (item.studios ?? []).map((edge) => edge.studio.name).filter(Boolean),
  season: item.season,
  year: item.season_year,
  nextAiringEpisode: toNextAiringEpisode(item.next_airing_episode),
});

const toReturnData = (page: KurojiMediaPage<KurojiMedia>): ReturnData => ({
  currentPage: page.page_info.current_page,
  hasNextPage: page.page_info.has_next_page,
  total: page.page_info.total,
  lastPage: page.page_info.last_page,
  results: page.data
    .filter((item) => item.status !== 'NOT_YET_RELEASED')
    .map(mapMediaItem),
});

const runMediaQuery = async (
  cacheId: string,
  variables: Record<string, unknown>
): Promise<ReturnData> => {
  try {
    const response = await fetchAndCache<KurojiMedia>(
      cacheId,
      MEDIA_QUERY,
      variables
    );
    return toReturnData(response.data.media_page);
  } catch (error) {
    console.error(error);
    return EMPTY_RETURN;
  }
};

export const getTrendingAnime = (page = 1, perPage = 24): Promise<ReturnData> =>
  runMediaQuery(`trendingNow:${page}:${perPage}`, {
    page,
    per_page: perPage,
    sort: ['TRENDING_DESC', 'POPULARITY_DESC'],
    type: 'ANIME',
  });

export const getAllTimePopularAnime = (): Promise<ReturnData> =>
  runMediaQuery('allTimePopularAnime', {
    page: 1,
    per_page: 35,
    sort: ['POPULARITY_DESC'],
    type: 'ANIME',
  });

export const getAllTimePopularMovies = (): Promise<ReturnData> =>
  runMediaQuery('allTimePopularMovies', {
    page: 1,
    per_page: 35,
    sort: ['POPULARITY_DESC', 'SCORE_DESC'],
    format: 'MOVIE',
  });

export const getPopularThisSeasonAnime = (): Promise<ReturnData> =>
  runMediaQuery('popularThisSeasonAnime', {
    page: 1,
    per_page: 35,
    sort: ['POPULARITY_DESC'],
    type: 'ANIME',
    season: getCurrentSeason().toUpperCase(),
    season_year: new Date().getFullYear(),
  });

export const top100Anime = (): Promise<ReturnData> =>
  runMediaQuery('top100Anime', {
    page: 1,
    per_page: 10,
    sort: ['SCORE_DESC'],
    type: 'ANIME',
  });

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
    {
      page,
      per_page: perPage,
      sort,
      search,
      score_greater: rating || undefined,
      status: status || undefined,
      format: format || undefined,
      type: type || undefined,
      season_year: year || undefined,
      season: season || undefined,
      genres_in: genres.length ? genres : undefined,
    }
  );

interface KurojiSeasonalMedia {
  title: KurojiTitle;
  country: string | null;
  next_airing_episode: KurojiAiringSchedule | null;
  poster: KurojiPoster;
  id: number;
  id_mal: number | null;
  season: string | null;
  season_year: number | null;
  is_adult: boolean | null;
  genres: KurojiGenre[];
  format: string | null;
  color: string | null;
  studios: KurojiStudioConnection[];
}

const UPCOMING_SEASON_QUERY = `query (
  $season: MediaSeason, $season_year: Int, $sort: [MediaSort],
  $is_adult: Boolean, $type: MediaType, $page: Int, $per_page: Int
) {
  media_page(
    season: $season, season_year: $season_year, sort: $sort,
    is_adult: $is_adult, type: $type, page: $page, per_page: $per_page
  ) {
    data {
      title { romaji english native }
      country
      next_airing_episode { episode airing_at }
      poster { small medium large }
      id id_mal season season_year is_adult genres { id name } format color
      studios(only_main: true) { is_main studio { id name } }
    }
    page_info { current_page has_next_page last_page per_page total }
  }
}`;

const getNextSeasonAndYear = (): { season: string; year: number } => {
  const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
  const now = new Date();
  const currentIndex = seasons.indexOf(
    getCurrentSeason(now.getMonth() + 1).toUpperCase()
  );
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
    const response = await fetchAndCache<KurojiSeasonalMedia>(
      `upcomingNextSeason:${season}:${year}:${page}:${perPage}`,
      UPCOMING_SEASON_QUERY,
      {
        sort: ['POPULARITY_DESC'],
        is_adult: false,
        type: 'ANIME',
        season,
        season_year: year,
        page,
        per_page: perPage,
      }
    );
    const page_ = (
      response as unknown as {
        data: { media_page: KurojiMediaPage<KurojiSeasonalMedia> };
      }
    ).data.media_page;

    return {
      currentPage: page_.page_info.current_page,
      hasNextPage: page_.page_info.has_next_page,
      total: page_.page_info.total,
      lastPage: page_.page_info.last_page,
      results: page_.data.map((item) => ({
        id: item.id.toString(),
        malId: item.id_mal,
        title: {
          userPreferred: pickFirst(
            item.title.english,
            item.title.romaji,
            item.title.native
          ),
          romaji: item.title.romaji,
          english: item.title.english,
          native: item.title.native,
        },
        coverImage: pickFirst(
          item.poster.large,
          item.poster.medium,
          item.poster.small
        ),
        color: item.color,
        studios: (item.studios ?? [])
          .map((edge) => edge.studio.name)
          .filter(Boolean),
        season: item.season,
        year: item.season_year,
        genres: (item.genres ?? []).map((genre) => genre.name),
        format: item.format,
        nextAiringEpisode: toNextAiringEpisode(item.next_airing_episode),
      })),
    };
  } catch (error) {
    console.error(error);
    return {
      hasNextPage: false,
      total: 0,
      lastPage: 0,
      currentPage: 0,
      results: [],
    };
  }
};