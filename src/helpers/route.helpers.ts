import { isNotEmpty } from '@/utils/boolean.utils'
import {
  useRoute,
  RouteLocationMatched,
  useRouter,
  RouteLocationRaw,
  NavigationFailure,
} from 'vue-router'

const route = useRoute()
const router = useRouter()

/**
 * Gets the root route of the current route.
 *
 * @returns {RouteLocationMatched} The root route of the current route.
 */
export function getRootRoute(): RouteLocationMatched {
  return route.matched[0]
}

/**
 * Gets the parent route of the current route.
 *
 * @returns {RouteLocationMatched} The parent route of the current route.
 */
export function getParentRoute(): RouteLocationMatched {
  return route.matched[route.matched.length - 2]
}

/**
 * Navigates to a specified route while preserving the current page query parameter.
 *
 * @param {Record<string, any>} to - The target route location to navigate to, which may contain path, query, and other
 * route properties.
 * @returns {Promise<NavigationFailure | void | undefined>} A promise that resolves when the navigation is complete, or
 * rejects with a NavigationFailure if the navigation fails.
 */
export async function navigatePreservePage(
  to: Record<string, any>,
): Promise<NavigationFailure | void | undefined> {
  const page = route.query.page
  if (isNotEmpty(page)) {
    if (!to.query) to.query = {}
    to.query.page = page
  }

  return router.replace(to)
}
