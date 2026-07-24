import '@vidstack/react/player/styles/default/captions.css';
import styles from './video-layout.module.css';

import { Captions, Controls, Gesture } from '@vidstack/react';

import * as Buttons from '../buttons';
import * as Menus from '../menus';
import * as Sliders from '../sliders';
import { TimeGroup } from '../time-group';
import { Title } from '../title';

export interface VideoLayoutProps {
  thumbnails?: string;
}

export function VideoLayout({ thumbnails }: VideoLayoutProps) {
  return (
    <>
      <Gestures />
      <Captions
        className={`vds-captions media-preview:opacity-0 media-controls:bottom-[85px] media-captions:opacity-100 absolute inset-0 bottom-2 z-10 rounded-lg break-words transition-[opacity,bottom] duration-300 select-none`}
      />
      <Controls.Root
        className={`${styles.controls} media-controls:opacity-100 absolute inset-0 z-10 flex h-full w-full flex-col bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity`}
      >
        <div className='flex-1' />
        <Controls.Group className='flex w-full items-center px-2'>
          <Sliders.Time thumbnails={thumbnails} />
        </Controls.Group>
        <Controls.Group className='-mt-0.5 flex w-full items-center px-2 pb-2'>
          <Buttons.Play tooltipPlacement='top start' />
          <Buttons.Mute tooltipPlacement='top' />
          <Sliders.Volume />
          <TimeGroup />
          <Title />
          <div className='flex-1' />
          <Buttons.Caption tooltipPlacement='top' />
          <Menus.Settings placement='top end' tooltipPlacement='top' />
          <Buttons.ScreenshotButton tooltipPlacement='top' />
          <Buttons.PIP tooltipPlacement='top' />
          <Buttons.Fullscreen tooltipPlacement='top end' />
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

function Gestures() {
  return (
    <>
      <Gesture
        className='absolute inset-0 z-0 block h-full w-full'
        event='pointerup'
        action='toggle:paused'
      />
      <Gesture
        className='absolute inset-0 z-0 block h-full w-full'
        event='dblpointerup'
        action='toggle:fullscreen'
      />
      <Gesture
        className='absolute top-0 left-0 z-10 block h-full w-1/5'
        event='dblpointerup'
        action='seek:-10'
      />
      <Gesture
        className='absolute top-0 right-0 z-10 block h-full w-1/5'
        event='dblpointerup'
        action='seek:10'
      />
    </>
  );
}
