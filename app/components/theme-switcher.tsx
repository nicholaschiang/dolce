import { useEffect } from 'react';
import { useFetcher } from '@remix-run/react';

import { Theme, Themed, isTheme, useTheme } from '~/theme';
import IconButton from '~/components/icon-button';
import MoonIcon from '~/icons/moon';
import SunIcon from '~/icons/sun';

export default function ThemeSwitcher({ className }: { className?: string }) {
  const [theme, setTheme] = useTheme();
  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.submission)
      setTheme((prev) => {
        const themeValue = fetcher.submission.formData.get('theme');
        return isTheme(themeValue) ? themeValue : prev;
      });
  }, [fetcher.submission, setTheme]);
  return (
    <fetcher.Form action='/theme' method='post'>
      <IconButton type='submit' className={className}>
        <Themed
          dark={<MoonIcon className='h-3 w-3' />}
          light={<SunIcon className='h-3 w-3' />}
        />
      </IconButton>
      <input
        type='hidden'
        name='theme'
        value={theme === Theme.Light ? Theme.Dark : Theme.Light}
      />
    </fetcher.Form>
  );
}
