import { useForm } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import {
  Form as RemixForm,
  useLoaderData,
  useActionData,
  useNavigation,
} from '@remix-run/react'
import { type DataFunctionArgs, json, redirect } from '@vercel/remix'
import { Plus } from 'lucide-react'
import { type PropsWithChildren } from 'react'
import { z } from 'zod'

import {
  Form,
  FormField,
  FormLabel,
  FormLabelWrapper,
  FormControl,
  FormSubmit,
  FormMessage,
} from 'components/form'
import { ImageItem } from 'components/image-item'
import { Button } from 'components/ui/button'
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from 'components/ui/dialog'
import { Input } from 'components/ui/input'
import { Textarea } from 'components/ui/textarea'

import { useOptionalUser } from 'utils/general'

import { prisma } from 'db.server'
import { requireUser } from 'session.server'

const schema = z.object({
  url: z.string().url(),
  description: z.string().optional(),
})

export async function loader({ params }: DataFunctionArgs) {
  if (params.username == null) throw new Response('Not Found', { status: 404 })
  const posts = await prisma.post.findMany({
    where: { author: { username: params.username } },
    include: { images: { take: 1 } },
    orderBy: { updatedAt: 'desc' },
  })
  return posts
}

export async function action({ request, params }: DataFunctionArgs) {
  const user = await requireUser(request, `/${params.username}/posts/new`)
  if (user.username !== params.username)
    throw new Response('Forbidden', { status: 403 })

  const submission = parse(await request.formData(), { schema })

  if (!submission.value || submission.intent !== 'submit')
    return json(submission, { status: 400 })

  const post = await prisma.post.create({
    data: {
      url: submission.value.url,
      description: submission.value.description,
      authorId: user.id,
    },
  })

  return redirect(`/${user.username}/posts/${post.id}`)
}

export default function UserPostsPage() {
  const posts = useLoaderData<typeof loader>()
  const user = useOptionalUser()
  return (
    <ol className='grid grid-cols-5 gap-1 relative'>
      {posts.map((post) => (
        <ImageItem
          key={post.id}
          className='aspect-product'
          to={post.id.toString()}
          image={post.images[0]?.url}
        />
      ))}
      {user && (
        <NewPostDialog>
          <Button
            className='absolute bottom-4 right-4 shadow-lg'
            size='icon'
            variant='outline'
          >
            <Plus className='w-4 h-4' />
          </Button>
        </NewPostDialog>
      )}
    </ol>
  )
}

function NewPostDialog({ children }: PropsWithChildren) {
  const navigation = useNavigation()
  const lastSubmission = useActionData<typeof action>()
  const [form, { url, description }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New post</DialogTitle>
          <DialogDescription>
            Create a new post and link it to products or looks
          </DialogDescription>
        </DialogHeader>
        <Form asChild>
          <RemixForm method='patch' {...form.props}>
            <FormField name={url.name}>
              <FormLabelWrapper>
                <FormLabel>URL</FormLabel>
                {url.error && <FormMessage>{url.error}</FormMessage>}
              </FormLabelWrapper>
              <FormControl asChild>
                <Input
                  placeholder='https://www.instagram.com/p/CzfHohephHr'
                  required
                />
              </FormControl>
            </FormField>
            <FormField name={description.name}>
              <FormLabelWrapper>
                <FormLabel>Description</FormLabel>
                {description.error && (
                  <FormMessage>{description.error}</FormMessage>
                )}
              </FormLabelWrapper>
              <FormControl asChild>
                <Textarea placeholder='Joe Scandrett traversing cities' />
              </FormControl>
            </FormField>
            <DialogFooter>
              <FormSubmit asChild>
                <Button disabled={navigation.formAction != null}>
                  Create post
                </Button>
              </FormSubmit>
            </DialogFooter>
          </RemixForm>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
