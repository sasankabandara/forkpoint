<script setup lang="ts">
import { computed } from 'vue'
import type { TimelineNodeData } from '../types'

const props = defineProps<{ data: TimelineNodeData }>()
const emit = defineEmits<{ (e: 'click'): void }>()

const confidenceStyles: Record<string, { bg: string; text: string }> = {
  established: { bg: 'rgba(79, 143, 255, 0.15)', text: '#4f8fff' },
  likely: { bg: 'rgba(79, 143, 255, 0.10)', text: '#6fa0ff' },
  speculative: { bg: 'rgba(79, 143, 255, 0.06)', text: '#8eb5ff' },
}
const badge = computed(() => confidenceStyles[props.data.confidence ?? 'likely'])
</script>

<template>
  <div class="cause-node node-enter" @click="emit('click')">
    <div class="node-label">cause</div>
    <div class="node-title">{{ data.title }}</div>
    <div class="node-summary">{{ data.summary }}</div>
    <div class="confidence-badge" v-if="data.confidence" :style="{ background: badge.bg, color: badge.text }">
      {{ data.confidence }}
    </div>
  </div>
</template>

<style scoped>
.cause-node {
  width: 220px;
  padding: 16px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-cause);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
}
.cause-node:hover {
  border-color: var(--color-border-hover);
  transform: scale(1.01);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.node-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--color-cause);
  margin-bottom: 6px;
  font-weight: 600;
}
.node-title {
  font-family: var(--font-serif);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 6px;
  line-height: 1.3;
}
.node-summary {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-bottom: 8px;
}
.confidence-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: capitalize;
}
</style>
