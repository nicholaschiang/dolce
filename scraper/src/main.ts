import { save, saveImages } from './marant'

async function main(dir = 'public/data/marant/02-26-2023') {
  await saveImages(dir)
  await save(dir)
}

void main()
