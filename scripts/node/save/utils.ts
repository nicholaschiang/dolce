/**
 * Derive the brand slug based on the brand name. Ideally, I should just set it
 * by default at the database level, but I don't know of a way to express this
 * RegExp in the Prisma Schema format (see the migration, though).
 */
export function slug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()\s]+/g, '-')
    .replace(/-$/, '')
}
