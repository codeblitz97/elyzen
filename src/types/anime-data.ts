export interface PageInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export interface MediaTitle {
  userPreferred: string | null;
  romaji: string | null;
  english: string | null;
  native: string | null;
}

export interface Trailer {
  id: string;
  site: string;
  thumbnail: string;
}

export interface CoverImage {
  extraLarge: string;
  large: string;
  medium: string;
  color: string | null;
}

export interface KurojiDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface NextAiringEpisode {
  airingAt: number | null;
  timeUntilAiring: number | null;
  episode: number | null;
}

export interface Media {
  id: number;
  idMal: number;
  status: string;
  title: MediaTitle;
  genres: string[];
  trailer: Trailer | null;
  description: string;
  format: string;
  bannerImage: string;
  coverImage: CoverImage | null;
  episodes: number;
  meanScore: number;
  duration: number;
  season: string;
  seasonYear: number;
  averageScore: number;
  nextAiringEpisode: NextAiringEpisode | null;
  type: string;
  studios: {
    edges: {
      isMain: boolean;
      node: {
        id: number;
        name: string;
        isAnimationStudio: boolean;
      };
    }[];
  };
  startDate: KurojiDate;
  endDate: KurojiDate | null;
}

export interface ResponseData {
  Page: {
    pageInfo: PageInfo;
    media: Media[];
  };
}

export interface Result {
  id: string;
  malId: number | null;
  title: MediaTitle;
  coverImage: string | null;
  trailer: string | null;
  description: string | null;
  status: string | null;
  bannerImage: string | null;
  rating: number | null;
  meanScore: number | null;
  releaseDate: number | null;
  startDate: KurojiDate | null;
  color: string | null;
  genres: string[];
  totalEpisodes: number | null;
  duration: number | null;
  format: string | null;
  type: string | null;
  year: number | null;
  season: string | null;
  nextAiringEpisode: NextAiringEpisode | null;
  studios: (string | null)[];
}

export interface ReturnData {
  currentPage: number;
  hasNextPage: boolean;
  total: number;
  lastPage: number;
  results: Result[];
}

export interface UpcomingSeasonalResponse {
  Page: {
    media: {
      title: MediaTitle;
      countryOfOrigin: string;
      nextAiringEpisode: NextAiringEpisode | null;
      coverImage: CoverImage;
      id: number;
      idMal: number;
      isAdult: boolean;
      genres: string[];
      format: string;
      season: string;
      seasonYear: number;
      studios: {
        edges: {
          isMain: boolean;
          node: {
            id: number;
            name: string;
            isAnimationStudio: boolean;
          };
        }[];
      };
    }[];
    pageInfo: PageInfo;
  };
}

export interface SeasonalMedia {
  id: string;
  malId: number | null;
  title: MediaTitle;
  coverImage: string | null;
  color: string | null;
  genres: string[];
  year: number | null;
  season: string | null;
  format: string | null;
  nextAiringEpisode: NextAiringEpisode | null;
}

export interface UpcomingSeasonalReturnData {
  currentPage: number;
  hasNextPage: boolean;
  total: number;
  lastPage: number;
  results: SeasonalMedia[];
}
