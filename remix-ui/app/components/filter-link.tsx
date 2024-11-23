import { Link, type LinkProps } from '@remix-run/react'

import {
  FILTER_PARAM,
  filterToSearchParam,
  type Filter,
  type FilterName,
  type FilterCondition,
} from 'filters'

/**
 * A convenient wrapper around the Remix <Link> component that allows you to
 * append any number of arbitrary filters as query parameters to the href.
 * @param to - assumes that the `to` prop does not include query parameters.
 * @param filters - the filters to append to the href.
 */
export function FilterLink({
  to,
  filters,
  ...etc
}: Omit<LinkProps, 'to'> & { to: string; filters: Filter[] }) {
  const query = new URLSearchParams()
  filters.forEach((f) =>
    query.append(
      FILTER_PARAM,
      filterToSearchParam<FilterName, FilterCondition>(f),
    ),
  )
  return <Link to={`${to}?${query.toString()}`} {...etc} />
}
