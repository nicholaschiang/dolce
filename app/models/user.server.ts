import { type Prisma, type Password, type User } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { prisma } from 'db.server'

export type { User } from '@prisma/client'

export async function getUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } })
}

export async function getUserByName(name: User['name']) {
  return prisma.user.findUnique({ where: { name } })
}

export async function getUserByUsername(username: User['username']) {
  return prisma.user.findFirst({ where: { username } })
}

export async function getUserByEmail(email: User['email']) {
  return prisma.user.findFirst({ where: { email } })
}

export async function createUser(
  name: User['name'],
  username: User['username'],
  email: User['email'],
  password: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: {
      name,
      username,
      email,
      password: { create: { hash: hashedPassword } },
    },
  })
}

export async function updateUser(
  id: User['id'],
  name: User['name'],
  username: User['username'],
  description: User['description'],
  email: User['email'],
  pwd?: string | null,
) {
  let password: Prisma.PasswordUpdateOneWithoutUserNestedInput | undefined
  if (pwd != null) {
    const hashedPassword = await bcrypt.hash(pwd, 10)
    password = { update: { hash: hashedPassword } }
  }
  return prisma.user.update({
    where: { id },
    data: {
      name,
      username,
      description,
      email,
      password,
    },
  })
}

export async function verifyLogin(
  emailOrUsername: User['email'] | User['username'],
  password: Password['hash'],
) {
  const userWithPassword = await prisma.user.findFirst({
    where: { OR: [{ email: emailOrUsername }, { username: emailOrUsername }] },
    include: { password: true },
  })
  console.log('user', userWithPassword)
  if (!userWithPassword || !userWithPassword.password) return null
  const isValid = await bcrypt.compare(password, userWithPassword.password.hash)
  if (!isValid) return null
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  const { password: _password, ...userWithoutPassword } = userWithPassword
  return userWithoutPassword
}
