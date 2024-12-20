import { useFetcher } from '@remix-run/react'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useRef } from 'react'
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
        const themeValue = fetcher.formData?.get('theme')
        return isTheme(themeValue) ? themeValue : prev
      })
  }, [fetcher.formData, setTheme])
  const ref = useRef<HTMLFormElement>(null)
  useHotkeys('t', () => fetcher.submit(ref.current), [setTheme])
  return (
    <fetcher.Form ref={ref} action='/theme' method='post'>
      <Tooltip tip='Toggle theme' hotkey='t'>
        <Button
          aria-label='Toggle theme'
          type='submit'
          size='icon'
          variant='ghost'
          className={className}
        >
          <Themed
            dark={<Moon className='h-3 w-3' />}
            light={<Sun className='h-3 w-3' />}
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
