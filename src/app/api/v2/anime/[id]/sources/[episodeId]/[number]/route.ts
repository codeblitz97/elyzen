import { NextRequest, NextResponse } from "next/server";
import ky, { type KyInstance, HTTPError } from "ky";
import * as v from "valibot";

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

const providerNames = providers.map((p) => p.name) as [string, ...string[]];

// Validates route params (from the dynamic segments)
const ParamsSchema = v.object({
  id: v.pipe(v.string(), v.trim(), v.minLength(1, "id is required")),
  episodeId: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "episodeId is required")
  ),
  number: v.pipe(v.string(), v.trim(), v.minLength(1, "number is required")),
});

const QuerySchema = v.object({
  provider: v.picklist(
    providerNames,
    `Invalid provider. Valid providers: ${providerNames.join(", ")}`
  ),
});

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
  const rawParams = await params;
  const { searchParams } = new URL(request.url);

  const paramsResult = v.safeParse(ParamsSchema, rawParams);
  if (!paramsResult.success) {
    return NextResponse.json(
      {
        error: "Invalid route params",
        issues: v.flatten(paramsResult.issues).nested,
      },
      { status: 400 }
    );
  }

  const queryResult = v.safeParse(QuerySchema, {
    provider: searchParams.get("provider") ?? undefined,
  });
  if (!queryResult.success) {
    return NextResponse.json(
      {
        error: "Invalid query params",
        issues: v.flatten(queryResult.issues).nested,
      },
      { status: 400 }
    );
  }

  const { id, episodeId, number } = paramsResult.output;
  const { provider } = queryResult.output;

  const providerEntry = providers.find((p) => p.name === provider)!;

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