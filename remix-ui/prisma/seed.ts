import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { show } from '../../data-collection/scripts/node/save/shows/hermes'

const prisma = new PrismaClient()

async function seed() {
  const email = 'site@nicholaschiang.com'

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  })

  const hashedPassword = await bcrypt.hash('password', 10)

  await prisma.user.create({
    data: {
      email,
      name: 'Nicholas',
      username: 'nicholas',
      password: { create: { hash: hashedPassword } },
    },
  })

  await prisma.show.create({ data: show })

  console.log(`Database has been seeded. 🌱`)
}

void seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
