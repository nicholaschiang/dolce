import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useFetcher } from '@remix-run/react'
import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { Tooltip } from 'components/tooltip'
import { Button } from 'components/ui/button'

import { Theme, Themed, isTheme, useTheme } from 'theme'

export function ThemeSwitcher({ className }: { className?: string }) {
  const [theme, setTheme] = useTheme()
  const fetcher = useFetcher()
  useEffect(() => {
    if (fetcher.formData)
      setTheme((prev) => {
        const themeValue = fetcher.formData.get('theme')
        return isTheme(themeValue) ? themeValue : prev
      })
  }, [fetcher.formData, setTheme])
  useHotkeys(
    't',
    () => setTheme((prev) => (prev === Theme.Light ? Theme.Dark : Theme.Light)),
    [setTheme],
  )
  return (
    <fetcher.Form action='/theme' method='post'>
      <Tooltip tip='Toggle theme' hotkey='t'>
        <Button type='submit' size='icon' variant='ghost' className={className}>
          <Themed
            dark={<MoonIcon className='h-3 w-3' />}
            light={<SunIcon className='h-3 w-3' />}
          />
        </Button>
      </Tooltip>
      <input
        type='hidden'
        name='theme'
        value={theme === Theme.Light ? Theme.Dark : Theme.Light}
      />
    </fetcher.Form>
  )
}
