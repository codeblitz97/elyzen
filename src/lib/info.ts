import { cache } from './cache';

interface Prms {
  id: string;
}

interface VoiceActor {
  name: string;
  image: string;
}

interface ConsumetName {
  first: string;
  last: string;
  full: string;
  native: string | null;
  userPreferred: string;
}

interface ConsumetVoiceActor {
  id: number;
  language: string;
  name: ConsumetName;
  image: string;
  imageHash: string;
}

interface ConsumetCharacter {
  id: number;
  role: string;
  name: ConsumetName;
  image: string;
  imageHash: string;
  voiceActors: ConsumetVoiceActor[];
}

interface Character {
  name: string;
  image: string;
  voiceActor: VoiceActor;
}

export interface AnilistInfo {
  id: string;
  malId?: number | null;
  title: {
    english: string | null;
    native: string | null;
    romaji: string | null;
    userPreferred: string | null;
  };
  synonyms?: string[] | null;
  isLicensed?: boolean | null;
  isAdult?: boolean | null;
  countryOfOrigin?: string | null;
  trailer?: {
    id: string;
    site: string | null;
    thumbnail: string | null;
  } | null;
  coverImage: string | null;
  popularity?: number | null;
  color?: string | null;
  bannerImage?: string | null;
  description?: string | null;
  status: string;
  releaseDate?: number | null;
  startDate: {
    day?: number | null;
    month?: number | null;
    year?: number | null;
  };
  year: number | null;
  endDate: {
    day?: number | null;
    month?: number | null;
    year?: number | null;
  };
  averageRating?: number | null;
  nextAiringEpisode?: {
    airingTime: number | null;
    timeUntilAiring: number | null;
    episode: number | null;
  } | null;
  totalEpisodes: number | null;
  currentEpisode: number | null;
  rating?: number | null;
  duration?: number | null;
  genres?: string[] | null;
  season?: string | null;
  studios?: string[] | null;
  format: 'TV' | 'TV_SHORT' | 'MOVIE' | 'ONA' | 'OVA' | 'UNKNOWN';
  studiosInfo?:
    | {
        name: string;
        id: string;
        isMain: boolean;
      }[]
    | null;
  type?: string | null;
  characters?: Character[] | null;
  recommendations?:
    | {
        id: string | null;
        malId: number | null;
        title: {
          romaji: string | null;
          english: string | null;
          native: string | null;
          userPreferred: string | null;
        };
        status: string;
        totalEpisodes?: number | null;
        image: string | null;
        cover: string | null;
        rating?: number | null;
        type: string | null;
      }[]
    | null;
  relations?: RelationData[] | null;
}

export interface RelationData {
  id: string;
  relationType: string;
  malId?: number | null;
  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
    userPreferred: string | null;
  };
  season: string | null;
  seasonYear: number | null;
  status: string;
  episodes?: number | null;
  image: string | null;
  color?: string | null;
  type: string | null;
  cover: string | null;
  rating?: number | null;
}

function convertToVoiceActor(
  consumetVoiceActor: ConsumetVoiceActor
): VoiceActor {
  return {
    name: consumetVoiceActor.name.first + ' ' + consumetVoiceActor.name.last,
    image: consumetVoiceActor.image,
  };
}

export function convertToCharacter(
  consumetCharacter: ConsumetCharacter
): Character | null {
  const originalVoiceActor = consumetCharacter.voiceActors.find(
    (vo) => vo.language === 'Japanese'
  );
  if (!originalVoiceActor) return null;

  return {
    name: consumetCharacter.name.first + ' ' + consumetCharacter.name.last,
    image: consumetCharacter.image,
    voiceActor: convertToVoiceActor(originalVoiceActor),
  };
}

const defaultResponse: AnilistInfo = {
  id: '',
  title: {
    native: null,
    romaji: null,
    english: null,
    userPreferred: null,
  },
  coverImage: null,
  bannerImage: null,
  trailer: null,
  status: 'UNKNOWN',
  season: null,
  studios: null,
  currentEpisode: null,
  synonyms: null,
  countryOfOrigin: null,
  description: null,
  startDate: {
    day: new Date().getDay(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  endDate: {
    day: new Date().getDay(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  duration: null,
  color: null,
  year: null,
  recommendations: null,
  rating: null,
  popularity: null,
  type: null,
  format: 'UNKNOWN',
  relations: null,
  totalEpisodes: null,
  genres: null,
  averageRating: null,
  characters: null,
};

interface MediaInterface {
  id: number;
  idMal: number;
  title: {
    english: string;
    native: string;
    romaji: string;
    userPreferred: string;
  };
  synonyms: string[];
  countryOfOrigin: string;
  isLicensed: boolean;
  isAdult: boolean;
  externalLinks: {
    url: string;
    site: string;
    type: string;
    language: string;
  }[];
  coverImage: {
    extraLarge: string;
    large: string;
    medium: string;
    color: string;
  };
  bannerImage: string;
  season: string;
  seasonYear: number;
  description: string;
  type: string;
  format: string;
  status: string;
  episodes: number;
  duration: number;
  chapters: number;
  volumes: number;
  trailer: {
    id: number;
    site: string;
    thumbnail: string;
  };
  genres: string[];
  source: string;
  averageScore: number;
  popularity: number;
  meanScore: number;
  nextAiringEpisode: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  };
  characters: {
    edges: {
      role: string;
      node: {
        id: number;
        name: {
          first: string;
          middle: string;
          last: string;
          full: string;
          native: string;
          userPreferred: string;
        };
        image: {
          large: string;
          medium: string;
        };
      };
      voiceActors: {
        image: {
          large: string;
          medium: string;
        };
        name: {
          first: string;
          middle: string;
          last: string;
          full: string;
          native: string;
          alternative: string;
          userPreferred: string;
        };
        languageV2: string;
      }[];
    }[];
  };
  recommendations: {
    edges: {
      node: {
        id: number;
        mediaRecommendation: {
          id: number;
          idMal: number;
          title: {
            romaji: string;
            english: string;
            native: string;
            userPreferred: string;
          };
          status: string;
          episodes: number;
          coverImage: {
            extraLarge: string;
            large: string;
            medium: string;
            color: string;
          };
          bannerImage: string;
          format: string;
          chapters: number;
          meanScore: number;
          nextAiringEpisode: {
            episode: number;
            timeUntilAiring: number;
            airingAt: number;
          };
        };
      };
    }[];
  }[];
  relations: {
    edges: {
      id: number;
      relationType: string;
      node: {
        id: number;
        idMal: number;
        status: string;
        coverImage: {
          extraLarge: string;
          large: string;
          medium: string;
          color: string;
        };
        bannerImage: string;
        title: {
          romaji: string;
          english: string;
          native: string;
          userPreferred: string;
        };
        episodes: number;
        chapters: number;
        format: string;
        nextAiringEpisode: {
          airingAt: number;
          timeUntilAiring: number;
          episode: number;
        };
        meanScore: number;
      };
    }[];
  };
  studios: {
    edges: {
      isMain: boolean;
      node: {
        id: number;
        name: string;
      };
    }[];
  };
  startDate: {
    day: number;
    month: number;
    year: number;
  };
  endDate: {
    day: number;
    month: number;
    year: number;
  };
}

interface MediaResponse {
  data: {
    Media: MediaInterface;
  };
}

export const fetchAnilistInfo = async (params: Prms): Promise<AnilistInfo> => {
  let cachedData = await cache.get(`information:${params.id}`);

  if (!cachedData) {
    try {
      const query = `query ($id: Int) {
        Media(id: $id) {
          id
          idMal
          title {
            english
            native
            romaji
            userPreferred
          }
          synonyms
          countryOfOrigin
          isLicensed
          isAdult
          externalLinks {
            url
            site
            type
            language
          }
          coverImage {
            extraLarge
            large
            medium
            color
          }
          bannerImage
          season
          seasonYear
          description
          type
          format
          status(version: 2)
          episodes
          duration
          chapters
          volumes
          trailer {
            id
            site
            thumbnail
          }
          genres
          source
          averageScore
          popularity
          meanScore
          nextAiringEpisode {
            airingAt
            timeUntilAiring
            episode
          }
          characters(sort: ROLE) {
            edges {
              role
              node {
                id
                name {
                  first
                  middle
                  last
                  full
                  native
                  userPreferred
                }
                image {
                  large
                  medium
                }
              }
              voiceActors {
                image {
                  large
                  medium
                }
                name {
                  first
                  middle
                  last
                  full
                  native
                  alternative
                  userPreferred
                }
                languageV2
              }
              name
            }
          }
          recommendations {
            edges {
              node {
                id
                mediaRecommendation {
                  id
                  idMal
                  title {
                    romaji
                    english
                    native
                    userPreferred
                  }
                  status(version: 2)
                  episodes
                  coverImage {
                    extraLarge
                    large
                    medium
                    color
                  }
                  bannerImage
                  format
                  chapters
                  meanScore
                  nextAiringEpisode {
                    episode
                    timeUntilAiring
                    airingAt
                  }
                }
              }
            }
          }
          relations {
            edges {
              id
              relationType
              node {
                season
                seasonYear
                id
                idMal
                status(version: 2)
                coverImage {
                  extraLarge
                  large
                  medium
                  color
                }
                bannerImage
                title {
                  romaji
                  english
                  native
                  userPreferred
                }
                episodes
                chapters
                format
                nextAiringEpisode {
                  airingAt
                  timeUntilAiring
                  episode
                }
                meanScore
              }
            }
          }
          studios {
            edges {
              isMain
              node {
                id
                name
              }
              id
            }
          }
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          hashtag
          favourites
        }
      }`;

      const mediaResponse = await 
        fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, variables: { id: Number(params.id) } }),
        });

      const d = await mediaResponse.json();
      const { data } = d as MediaResponse;
      if (data) {
      }

      const animeInfo = {
        id: params.id,
        malId: data.Media?.idMal,
        title: { ...data.Media.title },
        synonyms: data.Media?.synonyms,
        year: data.Media?.seasonYear,
        format: data.Media?.format,
        isLicensed: data.Media?.isLicensed ?? undefined,
        isAdult: data.Media?.isAdult ?? undefined,
        countryOfOrigin: data.Media?.countryOfOrigin ?? undefined,
        trailer: data.Media?.trailer
          ? {
              id: data.Media.trailer.id,
              site: data.Media.trailer?.site,
              thumbnail: data.Media.trailer?.thumbnail,
            }
          : undefined,
        coverImage:
          data.Media?.coverImage?.extraLarge ??
          data.Media?.coverImage?.large ??
          data.Media?.coverImage?.medium,
        popularity: data.Media?.popularity,
        color: data.Media?.coverImage?.color,
        bannerImage: data.Media?.bannerImage,
        description: data.Media?.description,
        status:
          data.Media?.status === 'HIATUS'
            ? 'HIATUS'
            : data.Media?.status ?? 'UNKNOWN',
        releaseDate: data.Media?.startDate?.year,
        startDate: { ...data.Media.startDate },
        endDate: { ...data.Media.endDate },
        averageRating: data.Media?.averageScore,
        nextAiringEpisode: data.Media?.nextAiringEpisode
          ? {
              airingTime: data.Media.nextAiringEpisode?.airingAt,
              timeUntilAiring: data.Media.nextAiringEpisode?.timeUntilAiring,
              episode: data.Media.nextAiringEpisode?.episode,
            }
          : undefined,
        totalEpisodes:
          data.Media?.episodes ?? data.Media.nextAiringEpisode?.episode - 1,
        currentEpisode:
          data.Media?.nextAiringEpisode?.episode - 1 || data.Media?.episodes,
        rating: data.Media?.averageScore,
        duration: data.Media?.duration,
        genres: data.Media?.genres,
        season: data.Media?.season,
        studios: data.Media?.studios.edges.map((item) => item.node.name),
        studiosInfo: await data.Media?.studios.edges.map(async (item) => ({
          name: item.node.name,
          id: item.node.id,
          isMain: item.isMain,
        })),
        type: data.Media?.format,
        characters: data.Media?.characters?.edges?.map(async (item) => ({
          id: item.node?.id,
          role: item.role,
          name: { ...item.node.name },
          image: item.node.image.large ?? item.node.image.medium,
          voiceActors: await item.voiceActors.map(async (voiceActor) => ({
            language: voiceActor.languageV2,
            name: { ...voiceActor.name },
            image: (await voiceActor.image.large) ?? voiceActor.image.medium,
          })),
        })),
        //@ts-ignore
        recommendations: data.Media?.recommendations?.edges?.map(
          async (item: any) => ({
            id: item.node.mediaRecommendation?.id,
            malId: item.node.mediaRecommendation?.idMal,
            title: { ...item.node.mediaRecommendation?.title },
            status:
              item.node.mediaRecommendation?.status === 'HIATUS'
                ? 'HIATUS'
                : item.node.mediaRecommendation?.status ?? 'UNKNOWN',
            episodes: item.node.mediaRecommendation?.episodes,
            image:
              item.node.mediaRecommendation?.coverImage?.extraLarge ??
              item.node.mediaRecommendation?.coverImage?.large ??
              item.node.mediaRecommendation?.coverImage?.medium,
            cover:
              item.node.mediaRecommendation?.bannerImage ??
              item.node.mediaRecommendation?.coverImage?.extraLarge ??
              item.node.mediaRecommendation?.coverImage?.large ??
              item.node.mediaRecommendation?.coverImage?.medium,
            rating: item.node.mediaRecommendation?.meanScore,
            type: item.node.mediaRecommendation?.format,
          })
        ),
        relations: data.Media.relations.edges.map((relation) => ({
          title: relation.node.title,
          id: relation.node.id,
          idMal: relation.node.idMal,
          totalEpisodes: relation.node.episodes,
          coverImage:
            relation.node.coverImage.extraLarge ??
            relation.node.coverImage.large ??
            relation.node.coverImage.medium ??
            null,
          studios: data.Media?.studios.edges
            .filter((item) => item.isMain)
            .map((item) => item.node.name),
          // @ts-ignore
          season: relation.node.season,
          // @ts-ignore
          year: relation.node.seasonYear,
          genres: data.Media?.genres,
          bannerImage:
            relation.node.bannerImage ??
            relation.node.coverImage.extraLarge ??
            relation.node.coverImage.large ??
            relation.node.coverImage.medium ??
            null,
          type: relation.node.format,
          status: relation.node.status,
          color: relation.node.coverImage.color,
          relationType: relation.relationType,
          rating: relation.node.meanScore,
        })),
      };

      cachedData = animeInfo;
      await cache.set(
        `information:${params.id}`,
        JSON.stringify(animeInfo),
        5 * 3600
      );
    } catch (error) {
      console.error(error);
      cachedData = defaultResponse;
    }
  } else {
    cachedData = JSON.parse(cachedData);
  }

  return cachedData;
};

export interface ICharacter {
  id: number;
  name: IName;
  role: string;
  node: ICharacterNode;
  voiceActors: IVoiceActor[];
  voiceActorRoles: IVoiceActorRole[];
}

export interface IName {
  first?: string;
  middle?: string;
  last?: string;
  full?: string;
  native?: string;
  alternative?: string[];
  alternativeSpoiler?: string[];
  userPreferred?: string;
}

export interface ICharacterNode {
  age?: number;
  bloodType?: string;
  dateOfBirth?: IDate;
  description?: string;
  favourites?: number;
  gender?: string;
  id: number;
  image: IImage;
  name: IName;
  siteUrl?: string;
}

export interface IDate {
  month?: number;
  day?: number;
  year?: number;
}

export interface IImage {
  large?: string;
  medium?: string;
}

export interface IVoiceActor {
  age?: number;
  bloodType?: string;
  dateOfBirth?: IDate;
  dateOfDeath?: IDate;
  description?: string;
  favourites?: number;
  gender?: string;
  homeTown?: string;
  id: number;
  image: IImage;
  languageV2?: string;
  name: IName;
  primaryOccupations?: string[];
  siteUrl?: string;
  yearsActive?: number[];
}

export interface IVoiceActorRole {
  dubGroup?: string;
  roleNotes?: string;
}

export interface IGetCharactersResponse {
  Media: {
    characters: {
      edges: ICharacter[];
    };
  };
}

export const getCharacters = async (id: string): Promise<ICharacter[]> => {
  let cachedData = await cache.get(`characters:${id}`);

  if (!cachedData) {
    const response = await fetch(`https://graphql.anilist.co`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `
          query Query($id: Int) {
  Media(id: $id) {
    characters {
      edges {
        id
        name
        role
        node {
          age
          bloodType
          dateOfBirth {
            month
            day
            year
          }
          description
          favourites
          gender
          id
          image {
            large
            medium
          }
          name {
            first
            middle
            last
            full
            native
            alternative
            alternativeSpoiler
            userPreferred
          }
          siteUrl
        }
        voiceActors {
          age
          bloodType
          dateOfBirth {
            year
            month
            day
          }
          dateOfDeath {
            year
            month
            day
          }
          description
          favourites
          gender
          homeTown
          id
          image {
            large
            medium
          }
          languageV2
          name {
            first
            middle
            last
            full
            native
            alternative
            userPreferred
          }
          primaryOccupations
          siteUrl
          yearsActive
        }
        voiceActorRoles {
          dubGroup
          roleNotes
        }
      }
    }
  }
}
        `,
        variables: {
          id: parseInt(id, 10),
        },
      }),
    });

    const { data } = (await response.json()) as {
      data: IGetCharactersResponse;
    };

    cachedData = data.Media.characters.edges;
    await cache.set(`characters:${id}`, JSON.stringify(cachedData), 5 * 3600);
  } else {
    cachedData = JSON.parse(cachedData) as ICharacter[];
  }

  return cachedData;
};

export interface InfoCharacter {
  age: number | null;
  bloodType: string | null;
  dateOfBirth: InfoDate | null;
  description: string | null;
  favourites: number;
  gender: string | null;
  id: number;
  image: InfoImage;
  name: InfoCharacterName;
  media: InfoMediaConnection;
}

export interface InfoDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface InfoImage {
  large: string | null;
  medium: string | null;
}

export interface InfoCharacterName {
  first: string | null;
  middle: string | null;
  last: string | null;
  full: string | null;
  native: string | null;
  alternative: string[] | null;
  alternativeSpoiler: string[] | null;
  userPreferred: string | null;
}

export interface InfoMediaConnection {
  edges: InfoMediaEdge[];
}

export interface InfoMediaEdge {
  characterName: string | null;
  characterRole: string | null;
  id: number;
  node: InfoMediaNode;
  voiceActors: InfoVoiceActor[];
}

export interface InfoMediaNode {
  averageScore: number | null;
  bannerImage: string | null;
  countryOfOrigin: string | null;
  coverImage: InfoImageDetails;
  description: string | null;
  duration: number | null;
  endDate: InfoDate | null;
  seasonYear: number | null;
  season: string | null;
  startDate: InfoDate | null;
  title: InfoMediaTitle;
  trending: number | null;
  type: string;
  synonyms: string[];
  status: string | null;
  popularity: number | null;
  meanScore: number | null;
  id: number;
  idMal: number | null;
  genres: string[];
  format: string | null;
  episodes: number | null;
}

export interface InfoImageDetails {
  extraLarge: string | null;
  large: string | null;
  medium: string | null;
  color: string | null;
}

export interface InfoMediaTitle {
  romaji: string | null;
  english: string | null;
  native: string | null;
  userPreferred: string | null;
}

export interface InfoVoiceActor {
  age: number | null;
  bloodType: string | null;
  dateOfBirth: InfoDate | null;
  dateOfDeath: InfoDate | null;
  description: string | null;
  gender: string | null;
  id: number;
  image: InfoImage;
  languageV2: string | null;
  name: InfoVoiceActorName;
  yearsActive: number[] | null;
  favourites: number;
  homeTown: string | null;
}

export interface InfoVoiceActorName {
  first: string | null;
  middle: string | null;
  last: string | null;
  full: string | null;
  native: string | null;
  alternative: string[] | null;
  userPreferred: string | null;
}

export const getCharacterInfo = async (
  characterId: string
): Promise<InfoCharacter> => {
  let cachedData = await cache.get(`character.info:${characterId}`);

  if (!cachedData) {
    const response = await fetch(`https://graphql.anilist.co`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: `query Query($characterId: Int, $type: MediaType) {
  Character(id: $characterId) {
    age
    bloodType
    dateOfBirth {
      year
      month
      day
    }
    description
    favourites
    gender
    id
    image {
      large
      medium
    }
    name {
      first
      middle
      last
      full
      native
      alternative
      alternativeSpoiler
      userPreferred
    }
    media(type: $type) {
      edges {
        characterName
        characterRole
        id
        node {
          averageScore
          bannerImage
          countryOfOrigin
          coverImage {
            extraLarge
            large
            medium
            color
          }
          description
          duration
          endDate {
            year
            month
            day
          }
          seasonYear
          season
          startDate {
            year
            month
            day
          }
          title {
            romaji
            english
            native
            userPreferred
          }
          trending
          type
          synonyms
          status
          popularity
          meanScore
          id
          idMal
          genres
          format
          episodes
        }
        voiceActors {
          age
          bloodType
          dateOfBirth {
            year
            month
            day
          }
          dateOfDeath {
            year
            month
            day
          }
          description
          gender
          id
          image {
            large
            medium
          }
          languageV2
          name {
            first
            middle
            last
            full
            native
            alternative
            userPreferred
          }
          yearsActive
          favourites
          homeTown
        }
      }
    }
  }
}`,
        variables: {
          characterId: Number(characterId),
          type: 'ANIME',
        },
      }),
    });
    const { data } = (await response.json()) as {
      data: { Character: InfoCharacter };
    };

    cachedData = data.Character;
    await cache.set(
      `character.info:${characterId}`,
      JSON.stringify(cachedData),
      30 * 24 * 3600
    );
  } else {
    cachedData = JSON.parse(cachedData);
  }
  return cachedData;
};
