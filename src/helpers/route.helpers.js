import { useRoute } from "vue-router"

/**
 * Gets the root route of the current route.
 *
 * @returns {Object} The root route of the current route.
 */
export function getRootRoute() {
  const route = useRoute()
  return route.matched[0]
}

/**
 * Gets the parent route of the current route.
 *
 * @returns {Object} The parent route of the current route.
 */
export function getParentRoute() {
  const route = useRoute()
  return route.matched[route.matched.length - 2]
}

/**
 * Gets the meta data of the parent route of the current route.
 *
 * @returns {Object} The meta data of the parent route of the current route.
 */
export function getParentRouteMeta() {
  return getParentRoute().meta
}

/**
 * Gets the name of the parent route of the current route.
 *
 * @returns {String} The name of the parent route of the current route.
 */
export function getParentRouteName() {
  return getParentRoute().name
}
