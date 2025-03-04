import { useRoute, RouteLocationMatched } from 'vue-router'

/**
 * Gets the root route of the current route.
 *
 * @returns {RouteLocationMatched} The root route of the current route.
 */
export function getRootRoute(): RouteLocationMatched {
  const route = useRoute()
  return route.matched[0]
}

/**
 * Gets the parent route of the current route.
 *
 * @returns {RouteLocationMatched} The parent route of the current route.
 */
export function getParentRoute(): RouteLocationMatched {
  const route = useRoute()
  return route.matched[route.matched.length - 2]
}
