import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/enums/routeEnums'
import { useAppUI } from '@/composables/useAppUI'

export function useEthereumNavigator() {
  // ==========================================================================
  //                                Variables
  // ==========================================================================
  const route = useRoute()
  const router = useRouter()
  const { withLoading, startLoading, stopLoading } = useAppUI()

  // ==========================================================================
  //                            Internal functions
  // ==========================================================================
  //

  // ==========================================================================
  //                            External functions
  // ==========================================================================

  const navigateToConnect = () => {
    router.push({ name: RouteName.Connect })
  }

  return {
    navigateToConnect,
  }
}
