import ky from 'ky';

const GRAPHQL_ENDPOINT = 'https://api.kuroji.xyz/graphql';

export interface Artwork {
  height: number;
  iso_639_1: string | null;
  large: string;
  medium: string;
  source: string;
  type: string;
  url: string;
  width: number;
}

export interface AgeRating {
  description: string;
  rating: string;
}

export interface Screenshot {
  large: string;
  medium: string;
  order: number;
  small: string;
  source: string;
  url: string;
}

export interface DateParts {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface Studio {
  id: number;
  name: string;
}

export interface StudioEdge {
  is_main: boolean;
  studio: Studio;
}

export interface Tag {
  category: string;
  description: string;
  id: number;
  is_adult: boolean;
  name: string;
}

export interface TagEdge {
  is_spoiler: boolean;
  rank: number;
  tag: Tag;
}

export interface Title {
  english: string | null;
  native: string | null;
  romaji: string | null;
}

export interface Poster {
  large: string;
  medium: string;
  small: string;
}

export interface Media {
  id: number;
  id_mal: number | null;
  format: string;
  color: string | null;
  background: string | null;
  artworks: Artwork[];
  air_week: number | null;
  age_rating: AgeRating | null;
  is_adult: boolean;
  screenshots: Screenshot[];
  season: string | null;
  season_year: number | null;
  start_date: DateParts;
  status: string;
  studios: StudioEdge[];
  tags: TagEdge[];
  title: Title;
  type: string;
  updated_at: number;
  poster: Poster;
  more_info: string | null;
  episodes_total: number | null;
  episodes_aired: number | null;
  end_date: DateParts;
  description: string | null;
  country: string;
}

interface InfoQueryResponse {
  data: {
    media: Media;
  };
}

interface GraphQLError {
  message: string;
}

interface GraphQLResponse<T> {
  data: T | null;
  errors?: GraphQLError[];
}

const INFO_QUERY = `
  query Info($id: Int!) {
    media(id: $id) {
      id
      id_mal
      format
      color
      background
      artworks {
        height
        iso_639_1
        large
        medium
        source
        type
        url
        width
      }
      air_week
      age_rating {
        description
        rating
      }
      is_adult
      screenshots {
        large
        medium
        order
        small
        source
        url
      }
      season
      season_year
      start_date {
        day
        month
        year
      }
      status
      studios {
        is_main
        studio {
          id
          name
        }
      }
      tags {
        is_spoiler
        rank
        tag {
          category
          description
          id
          is_adult
          name
        }
      }
      title {
        english
        native
        romaji
      }
      type
      updated_at
      poster {
        large
        medium
        small
      }
      more_info
      episodes_total
      episodes_aired
      end_date {
        day
        month
        year
      }
      description
      country
    }
  }
`;

export async function getInfo(id: number): Promise<Media> {
  const response = await ky
    .post(GRAPHQL_ENDPOINT, {
      json: {
        query: INFO_QUERY,
        variables: { id },
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .json<GraphQLResponse<{ media: Media }>>();

  if (response.errors && response.errors.length > 0) {
    throw new Error(
      `GraphQL error: ${response.errors.map((e) => e.message).join(', ')}`
    );
  }

  if (!response.data) {
    throw new Error('GraphQL response contained no data');
  }

  return response.data.media;
}
