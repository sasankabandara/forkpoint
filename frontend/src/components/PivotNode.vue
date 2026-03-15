<script setup lang="ts">
import type { TimelineNodeData } from '../types'

const props = defineProps<{ data: TimelineNodeData }>()
const emit = defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <div class="pivot-node node-enter" @click="emit('click')">
    <div class="node-label">
      <span class="star">★</span> the event
    </div>
    <div class="node-title">{{ data.title }}</div>
    <div class="node-summary">{{ data.summary }}</div>
  </div>
</template>

<style scoped>
.pivot-node {
  width: 240px;
  padding: 20px;
  background: var(--color-bg-surface);
  border: 2px solid var(--color-pivot);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 0 20px rgba(212, 160, 87, 0.08);
}
.pivot-node:hover {
  transform: scale(1.01);
  box-shadow: 0 0 28px rgba(212, 160, 87, 0.15);
}
.node-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--color-pivot);
  margin-bottom: 8px;
  font-weight: 600;
}
.star {
  font-size: 12px;
  margin-right: 3px;
}
.node-title {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
  line-height: 1.3;
}
.node-summary {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.5;
}
</style>
