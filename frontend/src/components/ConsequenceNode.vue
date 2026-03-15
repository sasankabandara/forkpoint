<script setup lang="ts">
import type { TimelineNodeData } from '../types'

const props = defineProps<{ data: TimelineNodeData }>()
const emit = defineEmits<{
  (e: 'click'): void
  (e: 'fork', whatif: string): void
}>()
</script>

<template>
  <div class="consequence-node node-enter">
    <div class="node-top" @click="emit('click')">
      <div class="node-label">what happened</div>
      <div class="node-title">{{ data.title }}</div>
      <div class="node-summary">{{ data.summary }}</div>
      <div class="badges" v-if="data.probability || data.emotion">
        <span class="badge probability" v-if="data.probability">{{ data.probability }}</span>
        <span class="badge emotion" v-if="data.emotion">{{ data.emotion }}</span>
      </div>
    </div>
    <button class="fork-btn" @click.stop="emit('fork', '')" title="Fork this timeline">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="6" y1="3" x2="6" y2="15"></line>
        <circle cx="18" cy="6" r="3"></circle>
        <circle cx="6" cy="18" r="3"></circle>
        <path d="M18 9a9 9 0 0 1-9 9"></path>
      </svg>
      What if instead…
    </button>
  </div>
</template>

<style scoped>
.consequence-node {
  width: 220px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-consequence);
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
}
.consequence-node:hover {
  border-color: var(--color-border-hover);
  transform: scale(1.01);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.node-top {
  padding: 16px;
  cursor: pointer;
}
.node-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--color-consequence);
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
  background: rgba(79, 204, 136, 0.1);
  color: var(--color-consequence);
}
.badge.emotion {
  background: rgba(79, 204, 136, 0.06);
  color: #6fd9a0;
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
