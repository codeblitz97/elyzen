// @ts-nocheck
import type { ReactElement } from 'react';

import {
  Menu,
  Tooltip,
  useCaptionOptions,
  type MenuPlacement,
  type TooltipPlacement,
  useVideoQualityOptions,
  useMediaState,
  usePlaybackRateOptions,
} from '@vidstack/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClosedCaptionsIcon,
  SettingsMenuIcon,
  RadioButtonIcon,
  RadioButtonSelectedIcon,
  SettingsIcon,
  // EpisodesIcon,
  SettingsSwitchIcon,
  // PlaybackSpeedCircleIcon,
  OdometerIcon,
} from '@vidstack/react/icons';

import { buttonClass, tooltipClass } from './buttons';
import React, { useState } from 'react';
import Link from 'next/link';

export interface SettingsProps {
  placement: MenuPlacement;
  tooltipPlacement: TooltipPlacement;
}

export const menuClass =
  'animate-out fade-out slide-out-to-bottom-2 data-[open]:animate-in data-[open]:fade-in data-[open]:slide-in-from-bottom-4 flex h-[var(--menu-height)] max-h-[400px] min-w-[260px] flex-col overflow-y-auto overscroll-y-contain rounded-md border border-white/10 bg-black/95 p-2.5 font-sans text-[15px] font-medium outline-none backdrop-blur-sm transition-[height] duration-300 will-change-[height] data-[resizing]:overflow-hidden z-[40]';

export const submenuClass =
  'hidden w-full flex-col items-start justify-center outline-none data-[keyboard]:mt-[3px] data-[open]:inline-block z-[40]';

export const contentMenuClass =
  'flex cust-scroll h-[var(--menu-height)] max-h-[180px] lg:max-h-[400px] min-w-[260px] flex-col overflow-y-auto overscroll-y-contain rounded-md border border-white/10 bg-black p-2 font-sans text-[15px] font-medium outline-none backdrop-blur-sm transition-[height] duration-300 will-change-[height] data-[resizing]:overflow-hidden z-[40]';

export function Settings({ placement, tooltipPlacement }: SettingsProps) {
  return (
    <Menu.Root className='parent'>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className={buttonClass}>
            <SettingsIcon className='h-8 w-8 transform transition-transform duration-200 ease-out group-data-[open]:rotate-90' />
          </Menu.Button>
        </Tooltip.Trigger>
        <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
          Settings
        </Tooltip.Content>
      </Tooltip.Root>
      <Menu.Content className={menuClass} placement={placement}>
        <QualitySubmenu />
      </Menu.Content>
      <Menu.Content className={contentMenuClass} placement={placement}>
        <AutoPlay />
        <AutoSkip />
        <SpeedSubmenu />
        <CaptionSubmenu />
        <QualitySubmenu />
        <AdvancedSettingsButton />
      </Menu.Content>
    </Menu.Root>
  );
}

function SpeedSubmenu() {
  const options = usePlaybackRateOptions(),
    hint =
      options.selectedValue === '1' ? 'Normal' : options.selectedValue + 'x';
  return (
    <Menu.Root>
      <SubmenuButton
        label='Playback Rate'
        hint={hint}
        icon={OdometerIcon}
        disabled={options.disabled}
      >
        Speed ({hint})
      </SubmenuButton>
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className='flex w-full flex-col'
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function CaptionSubmenu() {
  const options = useCaptionOptions(),
    hint = options.selectedTrack?.label ?? 'Off';
  return (
    <Menu.Root>
      <SubmenuButton
        label='Captions'
        hint={hint}
        disabled={options.disabled}
        /**@ts-ignore */
        icon={ClosedCaptionsIcon}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className='flex w-full flex-col'
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function AutoPlay() {
  const [options, setOptions] = React.useState([
    {
      label: 'On',
      value: 'on',
      selected: false,
    },
    {
      label: 'Off',
      value: 'off',
      selected: true,
    },
  ]);

  const [showbtns, setShowbtns] = React.useState(false);

  React.useEffect(() => {
    const storedAutoPlay = localStorage.getItem('showbtns');
    if (storedAutoPlay) {
      setShowbtns(storedAutoPlay);
    }
  }, []);

  return (
    <Menu.Root>
      <SubmenuButton
        label='Show Buttons'
        hint={
          showbtns
            ? options.find((option) => option.value === showbtns)?.value
            : options.find((option) => option.selected)?.value
        }
        icon={SettingsSwitchIcon}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className='flex w-full flex-col'
          value={
            showbtns
              ? options.find((option) => option.value === showbtns)?.value
              : options.find((option) => option.selected)?.value
          }
          onChange={(value) => {
            setOptions((options) =>
              options.map((option) =>
                option.value === value
                  ? { ...option, selected: true }
                  : { ...option, selected: false }
              )
            );
            setShowbtns(value);
            localStorage.setItem('showbtns', value);
          }}
        >
          {options.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function AutoNext() {
  const [options, setOptions] = React.useState([
    {
      label: 'On',
      value: 'on',
      selected: false,
    },
    {
      label: 'Off',
      value: 'off',
      selected: true,
    },
  ]);

  const [autoNext, setAutoNext] = React.useState(false);

  React.useEffect(() => {
    const storedAutoNext = localStorage.getItem('autoNext');
    if (storedAutoNext) {
      setAutoNext(storedAutoNext);
    }
  }, []);

  return (
    <Menu.Root>
      <SubmenuButton
        label='Autoplay Next'
        hint={
          autoNext
            ? options.find((option) => option.value === autoNext)?.value
            : options.find((option) => option.selected)?.value
        }
        icon={SettingsSwitchIcon}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className='flex w-full flex-col'
          value={
            autoNext
              ? options.find((option) => option.value === autoNext)?.value
              : options.find((option) => option.selected)?.value
          }
          onChange={(value) => {
            setOptions((options) =>
              options.map((option) =>
                option.value === value
                  ? { ...option, selected: true }
                  : { ...option, selected: false }
              )
            );
            setAutoNext(value);
            localStorage.setItem('autoNext', value);
          }}
        >
          {options.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function AutoSkip() {
  const [options, setOptions] = React.useState([
    {
      label: 'On',
      value: 'on',
      selected: false,
    },
    {
      label: 'Off',
      value: 'off',
      selected: true,
    },
  ]);

  const [autoSkip, setAutoSkip] = React.useState(false);

  React.useEffect(() => {
    const storedAutoSkip = localStorage.getItem('autoSkip');
    if (storedAutoSkip) {
      setAutoSkip(storedAutoSkip);
    }
  }, []);

  return (
    <Menu.Root>
      <SubmenuButton
        label='AutoSkip'
        hint={
          autoSkip
            ? options.find((option) => option.value === autoSkip)?.value
            : options.find((option) => option.selected)?.value
        }
        icon={SettingsSwitchIcon}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className='flex w-full flex-col'
          value={
            autoSkip
              ? options.find((option) => option.value === autoSkip)?.value
              : options.find((option) => option.selected)?.value
          }
          onChange={(value) => {
            setOptions((options) =>
              options.map((option) =>
                option.value === value
                  ? { ...option, selected: true }
                  : { ...option, selected: false }
              )
            );
            setAutoSkip(value);
            localStorage.setItem('autoSkip', value);
          }}
        >
          {options.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function QualitySubmenu() {
  const options = useVideoQualityOptions({ sort: 'descending' }),
    autoQuality = useMediaState('autoQuality'),
    currentQualityText = options.selectedQuality?.height + 'p' ?? '',
    hint = !autoQuality ? currentQualityText : `Auto (${currentQualityText})`;

  // console.log({ options });

  return (
    <Menu.Root>
      <SubmenuButton
        label='Quality'
        hint={hint}
        disabled={options.disabled}
        icon={SettingsMenuIcon}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className='flex w-full flex-col'
          value={options.selectedValue}
        >
          {options.map(({ label, value, bitrateText, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function AdvancedSettingsButton() {
  return (
    <Menu.Root>
      <Link href='/settings/player' target='_blank'>
        <SubmenuButton
          label='Advanced Settings'
          hint=''
          icon={SettingsIcon}
        ></SubmenuButton>
      </Link>
    </Menu.Root>
  );
}

export interface RadioProps extends Menu.RadioProps {}

function Radio({ children, ...props }: RadioProps) {
  return (
    <Menu.Radio
      className='ring-media-focus group relative flex w-full cursor-pointer items-center justify-start rounded-sm p-2.5 outline-none select-none data-[focus]:ring-[3px] data-[hocus]:bg-white/10'
      {...props}
    >
      <RadioButtonIcon className='h-4 w-4 text-white group-data-[checked]:hidden' />
      <RadioButtonSelectedIcon
        className='text-media-brand hidden h-4 w-4 group-data-[checked]:block'
        type='radio-button-selected'
      />
      <span className='ml-2'>{children}</span>
    </Menu.Radio>
  );
}

export interface SubmenuButtonProps {
  label: string;
  hint: string;
  disabled?: boolean;
  icon: ReactElement;
}

function SubmenuButton({
  label,
  hint,
  icon: Icon,
  disabled,
}: SubmenuButtonProps) {
  const [r, setR] = React.useState(null);

  React.useEffect(() => {
    const clr = localStorage.getItem('playerMenuColor');
    if (clr) {
      setR(clr);
    }
  }, []);

  const possibilities = [
    'bg-primary',
    'bg-secondary',
    'bg-success',
    'bg-warning',
    'bg-danger',
    'data-[open]:bg-primary',
    'data-[open]:bg-secondary',
    'data-[open]:bg-success',
    'data-[open]:bg-warning',
    'data-[open]:bg-danger',
  ];
  return (
    <Menu.Button
      className={`ring-media-focus parent left-0 z-10 flex w-full cursor-pointer items-center justify-start rounded-sm p-2.5 outline-none select-none ring-inset data-[hocus]:bg-white/10 data-[open]:sticky data-[open]:-top-2.5 data-[open]:${r ? r : 'bg-primary'} data-[focus]:ring-[3px]`}
      disabled={disabled}
    >
      <ChevronLeftIcon className='parent-data-[open]:block mr-1.5 -ml-0.5 hidden h-[18px] w-[18px]' />
      <div className='parent-data-[open]:hidden contents'>
        <Icon className='h-5 w-5' />
      </div>
      <span className='parent-data-[open]:ml-0 ml-1.5'>{label}</span>
      <span className='ml-auto text-sm text-white/50'>{hint}</span>
      <ChevronRightIcon className='parent-data-[open]:hidden ml-0.5 h-[18px] w-[18px] text-sm text-white/50' />
    </Menu.Button>
  );
}
