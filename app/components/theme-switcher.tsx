import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import cn from 'classnames'
import { useEffect } from 'react'
import { useFetcher } from '@remix-run/react'
import { useHotkeys } from 'react-hotkeys-hook'

import { Tooltip } from 'components/tooltip'

import { Theme, Themed, isTheme, useTheme } from 'theme'

export function ThemeSwitcher({ className }: { className?: string }) {
  const [theme, setTheme] = useTheme()
  const fetcher = useFetcher()
  useEffect(() => {
    if (fetcher.submission)
      setTheme((prev) => {
        const themeValue = fetcher.submission.formData.get('theme')
        return isTheme(themeValue) ? themeValue : prev
      })
  }, [fetcher.submission, setTheme])
  useHotkeys(
    't',
    () => setTheme((prev) => (prev === Theme.Light ? Theme.Dark : Theme.Light)),
    [setTheme],
  )
  return (
    <fetcher.Form action='/theme' method='post'>
      <Tooltip tip='Toggle theme' hotkey='t'>
        <button type='submit' className={cn('icon-button', className)}>
          <Themed
            dark={<MoonIcon className='h-3 w-3' />}
            light={<SunIcon className='h-3 w-3' />}
          />
        </button>
      </Tooltip>
      <input
        type='hidden'
        name='theme'
        value={theme === Theme.Light ? Theme.Dark : Theme.Light}
      />
    </fetcher.Form>
  )
}
