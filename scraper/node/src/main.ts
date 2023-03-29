import { save, saveImages } from './marant'
import { scrape } from './aritzia'

export async function marant(
  dirs = [
    'public/data/marant/02-26-2023',
    'public/data/marant/02-27-2023/all',
    'public/data/marant/02-27-2023/new',
  ],
) {
  await Promise.all(
    dirs.map(async (dir) => {
      await saveImages(dir)
      await save(dir)
    }),
  )
}

void scrape()
