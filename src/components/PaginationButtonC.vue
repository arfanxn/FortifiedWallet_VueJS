<template>
  <button
    :class="{
      'cursor-not-allowed opacity-75': props.disabled,
      'cursor-pointer': !props.disabled,
    }"
    :disabled="props.disabled"
    @click="onClick"
  >
    <FontAwesomeIcon
      :icon="props.direction === 'prev' ? faSquareCaretLeft : faSquareCaretRight"
      class="text-xl"
    />
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, withDefaults } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSquareCaretLeft, faSquareCaretRight } from '@fortawesome/free-solid-svg-icons'

const emit = defineEmits(['onClick'])

function onClick() {
  emit('onClick')
}

const props = withDefaults(
  defineProps<{
    direction: 'prev' | 'next'
    disabled: boolean
  }>(),
  {
    disabled: false,
  },
)
</script>
