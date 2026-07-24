'use client';

import { useState } from 'react';

type VideoProgress = {
  [id: string]: any;
};

type UseVideoProgressSave = () => [
  (id: string) => any,
  (id: string, data: any) => void,
];

const useVideoProgressSave: UseVideoProgressSave = () => {
  const [settings, setSettings] = useState<VideoProgress>(() => {
    const storedSettings = localStorage?.getItem('vidstack_settings');
    return storedSettings ? JSON.parse(storedSettings) : {};
  });

  const getVideoProgress = (id: string) => {
    return settings[id];
  };

  const updateVideoProgress = (id: string, data: any) => {
    const updatedSettings = { ...settings, [id]: data };
    setSettings(updatedSettings);

    localStorage.setItem('vidstack_settings', JSON.stringify(updatedSettings));
  };

  return [getVideoProgress, updateVideoProgress];
};

export default useVideoProgressSave;
