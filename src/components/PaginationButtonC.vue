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
      :icon="isLeftDirection ? faSquareCaretLeft : faSquareCaretRight"
      class="text-xl"
    />
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSquareCaretLeft, faSquareCaretRight } from '@fortawesome/free-solid-svg-icons'

const emit = defineEmits(['onClick'])

function onClick() {
  emit('onClick')
}

const props = defineProps({
  direction: { type: String, required: true }, // direction can be 'prev' or 'next'
  disabled: { type: Boolean, required: true },
})

// TODO: use enum instead of raw string
const isLeftDirection = computed(() => {
  switch (props.direction) {
    case 'prev':
    case 'previous':
    case 'left':
      return true
    case 'next':
    case 'right':
    default:
      return false
  }
})
</script>
