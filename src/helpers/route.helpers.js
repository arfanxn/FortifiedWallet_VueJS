import { useRoute } from "vue-router"

export function getParentRoute() {
  const route = useRoute()
  return route.matched[route.matched.length - 2]
}

export function getParentRouteMeta() {
  return getParentRoute().meta
}

export function getParentRouteName() {
  return getParentRoute().name
}
