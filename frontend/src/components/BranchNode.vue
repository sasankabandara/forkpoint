<script setup lang="ts">
import { computed } from 'vue'
import type { TimelineNodeData } from '../types'

const props = defineProps<{ data: TimelineNodeData }>()
const emit = defineEmits<{
  (e: 'click'): void
  (e: 'fork', whatif: string): void
}>()

const accentColor = computed(() => {
  return props.data.branchColor
    ? `var(--color-branch-${props.data.branchColor})`
    : 'var(--color-cause)'
})
</script>

<template>
  <div class="branch-node node-enter" :style="{ borderColor: accentColor }">
    <div class="node-top" @click="emit('click')">
      <div class="whatif-label" v-if="data.whatif">{{ data.whatif }}</div>
      <div class="node-title">{{ data.title }}</div>
      <div class="node-summary">{{ data.summary }}</div>
      <div class="badges" v-if="data.probability || data.emotion">
        <span class="badge probability" :style="{ color: accentColor, background: accentColor.replace(')', ', 0.1)').replace('var(', 'rgba(').replace('--color-branch-' + data.branchColor, '79, 143, 255') }">{{ data.probability }}</span>
        <span class="badge emotion" v-if="data.emotion">{{ data.emotion }}</span>
      </div>
    </div>
    <button class="fork-btn" @click.stop="emit('fork', '')" title="Fork deeper">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="6" y1="3" x2="6" y2="15"></line>
        <circle cx="18" cy="6" r="3"></circle>
        <circle cx="6" cy="18" r="3"></circle>
        <path d="M18 9a9 9 0 0 1-9 9"></path>
      </svg>
      Go deeper…
    </button>
  </div>
</template>

<style scoped>
.branch-node {
  width: 220px;
  background: var(--color-bg-surface);
  border: 1px dashed var(--color-border);
  border-left: 3px solid;
  border-left-style: solid;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
}
.branch-node:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.node-top {
  padding: 16px;
  cursor: pointer;
}
.whatif-label {
  font-size: 10px;
  color: var(--color-text-dim);
  margin-bottom: 6px;
  font-style: italic;
  line-height: 1.4;
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
.badges {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  text-transform: capitalize;
}
.badge.probability {
  background: rgba(79, 143, 255, 0.1);
}
.badge.emotion {
  background: rgba(79, 143, 255, 0.06);
  color: var(--color-text-dim);
}
.fork-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 10px 16px;
  background: transparent;
  border: none;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-dim);
  font-size: 11px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.fork-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-muted);
}
</style>
