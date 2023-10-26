import { type DataFunctionArgs } from '@vercel/remix'

import { OWN_SET_NAME } from 'utils/set'

import { prisma } from 'db.server'
import { requireUserId } from 'session.server'

export async function action({ request }: DataFunctionArgs) {
  const userId = await requireUserId(request)
  const data = await request.formData()
  const productIds = data.getAll('productId').map((id) => Number(id))
  const number = await prisma.look.findFirst({
    where: { authorId: userId },
    orderBy: { number: 'desc' },
  })
  const look = await prisma.look.create({
    data: {
      authorId: userId,
      number: number ? number.number + 1 : 1,
      products: { connect: productIds.map((id) => ({ id })) },
      sets: {
        connectOrCreate: {
          where: { name_authorId: { name: OWN_SET_NAME, authorId: userId } },
          create: { name: OWN_SET_NAME, authorId: userId },
        },
      },
    },
  })
  return look
}
