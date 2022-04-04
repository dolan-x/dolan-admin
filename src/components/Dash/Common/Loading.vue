<template>
  <Loading
    :active="$props.modelValue"
    :is-full-page="false"
    @update:active="$emit('update:modelValue', $event.target.value)"
  >
    <q-circular-progress
      indeterminate
      size="50px"
      color="primary"
      class="q-ma-md"
    />
  </Loading>
</template>

<script setup lang="ts">
import Loading from "vue-loading-overlay";

defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>
