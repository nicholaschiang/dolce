// Use this to create a new user and login with that user
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/create-user.ts username@example.com
// and it will log out the cookie value you can use to interact with the server
// as that new user.

import { parse } from 'cookie'

import { createUser } from 'models/user.server'

import { createUserSession } from 'session.server'

async function createAndLogin(email: string) {
  if (!email) {
    throw new Error('email required for login')
  }
  if (!email.endsWith('@example.com')) {
    throw new Error('All test emails must end in @example.com')
  }

  // TODO: perhaps name and username should be params to this function?
  const user = await createUser(
    'John Doe',
    'john.doe',
    email,
    'myreallystrongpassword',
  )

  const response = await createUserSession({
    request: new Request('test://test'),
    userId: user.id,
    remember: false,
    redirectTo: '/',
  })

  const cookieValue = response.headers.get('Set-Cookie')
  if (!cookieValue) {
    throw new Error('Cookie missing from createUserSession response')
  }
  const parsedCookie = parse(cookieValue)
  // we log it like this so our cypress command can parse it out and set it as
  // the cookie value.
  console.log(
    `
<cookie>
  ${parsedCookie.__session}
</cookie>
  `.trim(),
  )
}

createAndLogin(process.argv[2])
