<template>
  <button class="relative" @click="isDropdownOpened = !isDropdownOpened">
    <FontAwesomeIcon icon="user" class="text-xl" />
    <ul
      class="absolute right-0 min-w-44 origin-top-right flex-col items-start overflow-auto rounded-lg bg-slate-700 outline-2 outline-slate-200 transition duration-300 ease-in-out md:min-w-64"
      :class="{
        'flex opacity-100': isDropdownOpened,
        'hidden opacity-0': !isDropdownOpened,
      }"
    >
      <li v-for="(menu, index) in props.menus" :key="index" class="w-full">
        <button
          @click="menuOnClick(menu)"
          class="inline-flex w-full items-center justify-between gap-x-2 px-2 py-1 text-slate-300 hover:bg-slate-600 hover:text-slate-200"
        >
          <FontAwesomeIcon
            v-if="menu.icon"
            :icon="menu.icon"
            class="w-4 text-center text-xl md:w-6"
          />
          <span class="grow text-left">
            {{ menu.name }}
          </span>
        </button>
      </li>
    </ul>
  </button>
</template>

<script setup lang="ts">
import { defineComponent, defineProps, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import type { StringOrNull } from '@/interfaces/interfaces'

defineComponent({
  name: 'DropdownMenuC',
})

let router = useRouter()

const isDropdownOpened = ref(false)

interface Menu {
  icon: IconDefinition
  name: string
  path: StringOrNull
  handler: (() => Promise<void>) | (() => void) | null
}
interface Props {
  menus: Array<Menu>
}
const props = withDefaults(defineProps<Props>(), {
  menus: () => [],
})

function menuOnClick(menu: Menu) {
  if (menu.path !== null) router.push(menu.path)
  else if (menu.handler !== null) menu.handler()
}
</script>
