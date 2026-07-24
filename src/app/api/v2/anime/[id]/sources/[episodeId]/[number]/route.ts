import { NextRequest, NextResponse } from "next/server";
import ky, { type KyInstance, HTTPError } from "ky";

const API_URL = "https://scrape-api-ten.vercel.app/api";

const animepahe = ky.create({ prefix: `${API_URL}/animepahe` });
const senshi = ky.create({ prefix: `${API_URL}/senshi` });
const anineko = ky.create({ prefix: `${API_URL}/anineko` });
const animegg = ky.create({ prefix: `${API_URL}/animegg` });
const anizone = ky.create({ prefix: `${API_URL}/anizone` });
const watchanimeworld = ky.create({ prefix: `${API_URL}/watchanimeworld` });

const providers: { name: string; client: KyInstance }[] = [
  { name: "animepahe", client: animepahe },
  { name: "senshi", client: senshi },
  { name: "anineko", client: anineko },
  { name: "animegg", client: animegg },
  { name: "watchanimeworld", client: watchanimeworld },
  { name: "anizone", client: anizone },
];

interface Subtitle {
  url: string;
  label: string;
}

interface Stream {
  videoUrl: string;
  title: string;
  headers: Record<string, string>;
  subtitles: Subtitle[];
}

interface SourcesResponse {
  streams: Stream[];
}

interface RouteParams {
  params: Promise<{
    id: string;
    episodeId: string;
    number: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id, episodeId, number } = await params;
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");

  if (!provider) {
    return NextResponse.json(
      { error: "Missing required query param: provider" },
      { status: 400 }
    );
  }

  const providerEntry = providers.find((p) => p.name === provider);

  if (!providerEntry) {
    return NextResponse.json(
      {
        error: `Invalid provider "${provider}". Valid providers: ${providers
          .map((p) => p.name)
          .join(", ")}`,
      },
      { status: 400 }
    );
  }

  if (!episodeId || !number) {
    return NextResponse.json(
      { error: "Missing required params: episodeId, number" },
      { status: 400 }
    );
  }

  try {
    const data = await providerEntry.client
      .get("sources", {
        searchParams: {
          id: episodeId,
          number,
        },
      })
      .json<SourcesResponse>();

    return NextResponse.json(
      {
        anime: id,
        provider: providerEntry.name,
        episodeId,
        number,
        ...data,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof HTTPError) {
      const status = error.response.status;
      let body: unknown = null;
      try {
        body = await error.response.json();
      } catch {
        // response wasn't JSON, ignore
      }

      return NextResponse.json(
        {
          error: `Provider "${providerEntry.name}" returned an error`,
          status,
          details: body,
        },
        { status }
      );
    }

    console.error(
      `Failed to fetch sources from "${providerEntry.name}":`,
      error
    );

    return NextResponse.json(
      { error: "Failed to fetch sources", provider: providerEntry.name },
      { status: 502 }
    );
  }
}