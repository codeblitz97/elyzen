/**
 * ! Change whichever file you want. But if you don't have much knowledge about VidStack player I would recommend you not touch this. This code is really sensitive. One change can change the full player itself. Also the codebase of it is pretty messy so if you have headache reading the code, I'm no one to blame. Peace out - Codeblitz97
 */

'use client';

import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/default/captions.css';

interface Interval {
  startTime: number;
  endTime: number;
}

interface Result {
  interval: Interval;
  skipType: string;
  skipId: string;
  episodeLength: number;
}

interface ApiResponse {
  found: boolean;
  results: Result[];
  message: string;
  statusCode: number;
}

import { useEffect, useMemo, useRef, useState } from 'react';

import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaCanPlayDetail,
  type MediaCanPlayEvent,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
  PlayButton,
  TextTrack,
  Gesture,
  PlayerSrc,
  useMediaStore,
  useMediaRemote,
} from '@vidstack/react';

import { VideoLayout } from './components/layouts/video-layout';
import VideoProgressSave from '@/hooks/video-progress-save';
import { saveProgress } from '@/lib/authenticated';

type Props = {
  hls?: string;
  title: string;
  cover: string;
  currentEp: number;
  idMal: string;
  subtitles?: {
    file?: string;
    kind?: string;
    label?: string;
  }[];
  epid: string;
  animeTitle: string;
  anId: string;
  sources?: {
    url?: string;
    quality?: string;
  }[];
  thumbnails?: {
    file: string;
    kind: string;
  };
  session: any;
};

export default function Player({
  hls,
  title,
  cover,
  currentEp,
  epid,
  animeTitle,
  idMal,
  anId,
  subtitles,
  sources,
  thumbnails,
  session,
}: Readonly<Props>) {
  let player = useRef<MediaPlayerInstance>(null);
  const { duration } = useMediaStore(player);
  const remote = useMediaRemote(player);
  const [getVideoProgress, UpdateVideoProgress] = VideoProgressSave();

  useEffect(() => {
    // Subscribe to state updates.
    return player.current!.subscribe(({ paused, viewType }) => {});
  }, []);
  const [skipData, setSkipData] = useState<ApiResponse | null>(null);

  const { qualities, quality, autoQuality, canSetQuality } =
    useMediaStore(player);

  useEffect(() => {
    console.log('Qualities', qualities);
    console.log('qualtiy', quality);
    console.log('AutoQ', autoQuality);
    console.log('autoQualityS', canSetQuality);
  }, [qualities, quality, autoQuality, canSetQuality]);

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent
  ) {
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  const uniqueSubtitles = subtitles
    ?.reduce(
      (
        unique: {
          file?: string;
          label?: string;
          kind?: string;
        }[],
        s
      ) => {
        if (!unique.some((item) => item.label === s.label)) {
          unique.push(s);
        }
        return unique;
      },
      []
    )
    .filter((u) => u.kind === 'captions');

  useEffect(() => {
    (async () => {
      const skipR = await (
        await fetch(
          `https://api.aniskip.com/v2/skip-times/${idMal}/${Number(
            currentEp
          )}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`
        )
      ).json();

      setSkipData(skipR);
    })();
  }, [currentEp, idMal]);

  const thumbnail = uniqueSubtitles?.find((e) => e.kind === 'Thumbnails');

  const op = skipData?.results?.find((item) => item.skipType === 'op') || null;
  const ed = skipData?.results?.find((item) => item.skipType === 'ed') || null;
  const episodeLength =
    skipData?.results?.find((item) => item.episodeLength)?.episodeLength || 0;

  const skiptime = useMemo(() => {
    const calculatedSkiptime = [];

    if (op?.interval) {
      calculatedSkiptime.push({
        startTime: op.interval.startTime ?? 0,
        endTime: op.interval.endTime ?? 0,
        text: 'Opening',
      });
    }
    if (ed?.interval) {
      calculatedSkiptime.push({
        startTime: ed.interval.startTime ?? 0,
        endTime: ed.interval.endTime ?? 0,
        text: 'Ending',
      });
    } else {
      calculatedSkiptime.push({
        startTime: op?.interval?.endTime ?? 0,
        endTime: episodeLength,
        text: `${title}`,
      });
    }

    return calculatedSkiptime;
  }, [op, ed, episodeLength, title]);

  function onCanPlay() {
    if (skiptime && skiptime.length > 0) {
      const track = new TextTrack({
        kind: 'chapters',
        default: true,
        label: 'English',
        language: 'en-US',
        type: 'json',
      });
      for (const cue of skiptime) {
        track.addCue(
          new window.VTTCue(
            Number(cue.startTime),
            Number(cue.endTime),
            cue.text
          )
        );
      }
      player.current?.textTracks.add(track);
    }
  }

  const [openingButton, setOpeningButton] = useState(false);
  const [endingButton, setEndingButton] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [progressSaved, setProgressSaved] = useState(false);

  useEffect(() => {
    const btn = localStorage.getItem('show-player-button');
    if (btn) {
      setShowButton(btn === 'on');
    }
  }, []);
  let interval: any;

  useEffect(() => {
    player.current?.subscribe(({ currentTime, duration }) => {
      if (skiptime && skiptime.length > 0) {
        const opStart = skiptime[0]?.startTime ?? 0;
        const opEnd = skiptime[0]?.endTime ?? 0;

        const epStart = skiptime[1]?.startTime ?? 0;
        const epEnd = skiptime[1]?.endTime ?? 0;

        const opButtonText = skiptime[0]?.text || '';
        const edButtonText = skiptime[1]?.text || '';

        setOpeningButton(
          opButtonText === 'Opening' &&
            currentTime > opStart &&
            currentTime < opEnd
        );
        setEndingButton(
          edButtonText === 'Ending' &&
            currentTime > epStart &&
            currentTime < epEnd
        );

        const autoSkip = localStorage.getItem('autoSkip');
        if (autoSkip === 'on') {
          if (currentTime > opStart && currentTime < opEnd) {
            Object.assign(player.current ?? {}, { currentTime: opEnd });
            return null;
          }
        }
      }
    });
  }, [skiptime]);

  useEffect(() => {
    if (isPlaying) {
      interval = setInterval(async () => {
        const currentTime = player.current?.currentTime
          ? Math.round(player.current?.currentTime)
          : 0;

        const epimage = cover;

        UpdateVideoProgress(anId, {
          id: String(anId),
          epid: epid,
          eptitle: title,
          aniTitle: animeTitle,
          image: cover,
          epnum: Number(currentEp),
          duration: duration,
          timeWatched: currentTime,
          subtype: 'sub',
          createdAt: new Date().toISOString(),
        });
      }, 5000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, duration]);

  function onLoadedMetadata() {
    const seek = getVideoProgress(anId);
    if (seek?.epnum === Number(currentEp)) {
      const seekTime = seek?.timeWatched;
      const percentage = duration !== 0 ? seekTime / Math.round(duration) : 0;

      if (percentage >= 0.9) {
        remote.seek(0);
      } else {
        remote.seek(seekTime - 3);
      }
    }
  }

  function onPlay() {
    setIsPlaying(true);
  }

  function onEnd() {
    setIsPlaying(false);
  }

  function handleOpening() {
    Object.assign(player.current ?? {}, {
      currentTime: skiptime[0]?.endTime ?? 0,
    });
  }

  function handleEnding() {
    Object.assign(player.current ?? {}, {
      currentTime: skiptime[1]?.endTime ?? 0,
    });
  }

  function handleTimeChange() {
    const currentTime = player.current?.currentTime;
    const percentage = currentTime! / duration;
    console.log('Percentage', percentage);

    if (session && !progressSaved && percentage >= 0.9) {
      setProgressSaved(true);
      saveProgress(session.user.token, Number(anId), currentEp);
    }
  }

  return (
    <div>
      {sources && subtitles ? (
        <MediaPlayer
          className={`m-0 h-full w-full cursor-pointer overflow-hidden rounded-lg`}
          title={title}
          crossorigin
          playsinline
          // @ts-ignore
          src={sources as any}
          aspectRatio={`16 / 9`}
          onProviderChange={onProviderChange}
          onCanPlay={onCanPlay}
          onPlay={onPlay}
          onEnd={onEnd}
          onLoadedMetadata={onLoadedMetadata}
          ref={player}
          onTimeUpdate={handleTimeChange}
        >
          <MediaProvider>
            <Poster
              className='absolute inset-0 block h-full w-full rounded-md object-cover opacity-0 transition-opacity data-[visible]:opacity-100'
              src={cover}
              alt={title}
            />
            <Gesture
              className='vds-gesture'
              event='pointerup'
              action='toggle:paused'
            />
            <Gesture
              className='vds-gesture'
              event='pointerup'
              action='toggle:controls'
            />
            <Gesture
              className='vds-gesture'
              event='dblpointerup'
              action='seek:-5'
            />
            <Gesture
              className='vds-gesture'
              event='dblpointerup'
              action='seek:5'
            />
            <Gesture
              className='vds-gesture'
              event='dblpointerup'
              action='toggle:fullscreen'
            />
            {showButton && openingButton && (
              <button
                onClick={handleOpening}
                className='font-inter animate-show border-opacity-10 bg-opacity-80 absolute bottom-[70px] left-4 z-[40] flex cursor-pointer items-center gap-2 rounded-lg border border-solid border-white bg-black px-3 py-2 text-left text-base font-medium text-white sm:bottom-[83px]'
              >
                Skip Opening
              </button>
            )}
            {showButton && endingButton && (
              <button
                onClick={handleEnding}
                className='font-inter animate-show border-opacity-10 bg-opacity-80 absolute bottom-[70px] left-4 z-[40] flex cursor-pointer items-center gap-2 rounded-lg border border-solid border-white bg-black px-3 py-2 text-left text-base font-medium text-white sm:bottom-[83px]'
              >
                Skip Ending
              </button>
            )}
            {thumbnails && thumbnails.file ? (
              <VideoLayout
                thumbnails={`${process.env.NEXT_PUBLIC_CORS_PROXY_URL}/${thumbnails.file}`}
              />
            ) : (
              <VideoLayout />
            )}
            {uniqueSubtitles?.map((s, i) => {
              return (
                <Track
                  key={`${s.file}-${i}`}
                  src={s.file as string}
                  label={s.label}
                  default={s.label === 'English'}
                  kind={'subtitles'}
                  language={s.label?.substring(0, 2).toLowerCase()}
                />
              );
            })}
          </MediaProvider>
          <VideoLayout thumbnails={thumbnail?.file} />
        </MediaPlayer>
      ) : (
        <MediaPlayer
          className={`m-0 h-full w-full cursor-pointer overflow-hidden rounded-lg`}
          title={title}
          crossorigin
          playsinline
          src={hls}
          aspectRatio={`16 / 9`}
          onProviderChange={onProviderChange}
          onCanPlay={onCanPlay}
          onPlay={onPlay}
          onEnd={onEnd}
          onLoadedMetadata={onLoadedMetadata}
          ref={player}
          onTimeUpdate={handleTimeChange}
        >
          <MediaProvider>
            <Poster
              className='absolute inset-0 block h-full w-full rounded-md object-cover opacity-0 transition-opacity data-[visible]:opacity-100'
              src={cover}
              alt={title}
            />
          </MediaProvider>
          <Gesture
            className='vds-gesture'
            event='pointerup'
            action='toggle:paused'
          />
          <Gesture
            className='vds-gesture'
            event='pointerup'
            action='toggle:controls'
          />
          <Gesture
            className='vds-gesture'
            event='dblpointerup'
            action='seek:-5'
          />
          <Gesture
            className='vds-gesture'
            event='dblpointerup'
            action='seek:5'
          />
          <Gesture
            className='vds-gesture'
            event='dblpointerup'
            action='toggle:fullscreen'
          />
          {showButton && openingButton && (
            <button
              onClick={handleOpening}
              className='font-inter animate-show border-opacity-10 bg-opacity-80 absolute bottom-[70px] left-4 z-[40] flex cursor-pointer items-center gap-2 rounded-lg border border-solid border-white bg-black px-3 py-2 text-left text-base font-medium text-white sm:bottom-[83px]'
            >
              Skip Opening
            </button>
          )}
          {showButton && endingButton && (
            <button
              onClick={handleEnding}
              className='font-inter animate-show border-opacity-10 bg-opacity-80 absolute bottom-[70px] left-4 z-[40] flex cursor-pointer items-center gap-2 rounded-lg border border-solid border-white bg-black px-3 py-2 text-left text-base font-medium text-white sm:bottom-[83px]'
            >
              Skip Ending
            </button>
          )}
          {uniqueSubtitles &&
            uniqueSubtitles?.map((s, i) => {
              return (
                <Track
                  key={`${s.file}-${i}`}
                  src={s.file as string}
                  label={s.label}
                  default={s.label === 'English'}
                  kind={'subtitles'}
                  language={s.label?.substring(0, 2).toLowerCase()}
                />
              );
            })}
          {thumbnails && thumbnails.file ? (
            <VideoLayout
              thumbnails={`${process.env.NEXT_PUBLIC_CORS_PROXY_URL}/${thumbnails.file}`}
            />
          ) : (
            <VideoLayout />
          )}
        </MediaPlayer>
      )}
    </div>
  );
}
