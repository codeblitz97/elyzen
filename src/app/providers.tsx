'use client';

import TopProgressBar from '@/components/progress-bar';
import { ThemeProvider } from '@/components/theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider>
        <TopProgressBar />
        {children}
      </ThemeProvider>
    </>
  );
}
