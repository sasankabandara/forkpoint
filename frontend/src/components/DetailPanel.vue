<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TimelineNodeData } from '../types'

const props = defineProps<{
  node: { data: TimelineNodeData } | null
}>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'fork', nodeId: string): void
}>()

const data = computed(() => props.node?.data ?? null)
const reasoningOpen = ref(false)

const typeColor = computed(() => {
  if (!data.value) return ''
  switch (data.value.type) {
    case 'cause': return 'var(--color-cause)'
    case 'pivot': return 'var(--color-pivot)'
    case 'consequence': return 'var(--color-consequence)'
    case 'branch': return data.value.branchColor ? `var(--color-branch-${data.value.branchColor})` : 'var(--color-cause)'
    default: return 'var(--color-text-dim)'
  }
})
</script>

<template>
  <Transition name="panel">
    <div v-if="node && data" class="detail-panel panel-slide-in">
      <div class="panel-header">
        <button class="close-btn" @click="emit('close')" title="Close">✕</button>
      </div>

      <div class="panel-content">
        <!-- Type label -->
        <div class="type-label" :style="{ color: typeColor }">
          {{ data.type === 'pivot' ? '★ the event' : data.type === 'cause' ? 'cause' : data.whatif || 'what happened' }}
        </div>

        <!-- Title -->
        <h2 class="panel-title">{{ data.title }}</h2>

        <!-- Summary -->
        <p class="panel-summary">{{ data.summary }}</p>

        <!-- Narrative -->
        <div v-if="data.narrative" class="narrative-section">
          <h3 class="section-heading">The story</h3>
          <p class="narrative-text" v-for="(para, i) in data.narrative.split('\n\n')" :key="i">
            {{ para }}
          </p>
        </div>

        <!-- Ripple Effects -->
        <div v-if="data.ripple" class="ripple-section">
          <h3 class="section-heading">Ripple effects</h3>
          <div class="ripple-item">
            <span class="ripple-icon">⚡</span>
            <div>
              <div class="ripple-label">Practical impact</div>
              <p class="ripple-text">{{ data.ripple.practical }}</p>
            </div>
          </div>
          <div class="ripple-item">
            <span class="ripple-icon">🤝</span>
            <div>
              <div class="ripple-label">Relationships</div>
              <p class="ripple-text">{{ data.ripple.relationships }}</p>
            </div>
          </div>
          <div class="ripple-item">
            <span class="ripple-icon">🧠</span>
            <div>
              <div class="ripple-label">Psychological</div>
              <p class="ripple-text">{{ data.ripple.psychological }}</p>
            </div>
          </div>
        </div>

        <!-- Badges -->
        <div class="badges-row">
          <span v-if="data.confidence" class="panel-badge confidence" :style="{ borderColor: typeColor, color: typeColor }">
            {{ data.confidence }}
          </span>
          <span v-if="data.probability" class="panel-badge probability">
            {{ data.probability }}
          </span>
          <span v-if="data.emotion" class="panel-badge emotion">
            {{ data.emotion }}
          </span>
        </div>

        <!-- Sensitive banner -->
        <div v-if="data.sensitive" class="sensitive-banner">
          <p>This scenario touches on something heavy. If you're working through something difficult, talking to someone helps.</p>
          <a href="https://findahelpline.com" target="_blank" rel="noopener">Find a helpline →</a>
        </div>

        <!-- Reasoning trace (collapsible) -->
        <div v-if="data.reasoningTrace" class="reasoning-section">
          <button class="reasoning-toggle" @click="reasoningOpen = !reasoningOpen">
            <svg :class="{ rotated: reasoningOpen }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            AI's thinking process
          </button>
          <div v-if="reasoningOpen" class="reasoning-content">
            <p v-for="(para, i) in data.reasoningTrace.split('\n\n')" :key="i" class="reasoning-text">
              {{ para }}
            </p>
          </div>
        </div>

        <!-- Fork button -->
        <button
          v-if="data.type !== 'cause'"
          class="panel-fork-btn"
          @click="emit('fork', data.nodeId)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="6" y1="3" x2="6" y2="15"></line>
            <circle cx="18" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M18 9a9 9 0 0 1-9 9"></path>
          </svg>
          Fork this moment
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.detail-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 340px;
  height: 100vh;
  background: var(--color-bg-surface);
  border-left: 1px solid var(--color-border);
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.panel-header {
  display: flex;
  justify-content: flex-end;
  padding: 16px 16px 0;
}
.close-btn {
  background: none;
  border: none;
  color: var(--color-text-dim);
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
}
.close-btn:hover {
  background: var(--color-bg-hover);
  color: var(--color-text);
}
.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 24px 32px;
}
.type-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 600;
  margin-bottom: 12px;
}
.panel-title {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 12px;
  line-height: 1.3;
}
.panel-summary {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 24px;
}
.section-heading {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-dim);
  margin-bottom: 12px;
  font-weight: 600;
}
.narrative-section {
  margin-bottom: 24px;
}
.narrative-text {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: 12px;
}
.ripple-section {
  margin-bottom: 24px;
}
.ripple-item {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}
.ripple-icon {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}
.ripple-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 2px;
}
.ripple-text {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.5;
}
.badges-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.panel-badge {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 5px;
  font-weight: 500;
  text-transform: capitalize;
}
.panel-badge.confidence {
  background: transparent;
  border: 1px solid;
}
.panel-badge.probability {
  background: rgba(79, 204, 136, 0.1);
  color: var(--color-consequence);
}
.panel-badge.emotion {
  background: rgba(79, 124, 255, 0.08);
  color: var(--color-accent);
}
.sensitive-banner {
  padding: 14px;
  background: rgba(204, 107, 90, 0.08);
  border: 1px solid rgba(204, 107, 90, 0.2);
  border-radius: 8px;
  margin-bottom: 20px;
}
.sensitive-banner p {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-bottom: 8px;
}
.sensitive-banner a {
  font-size: 13px;
  color: var(--color-sensitive);
  text-decoration: none;
  font-weight: 500;
}
.sensitive-banner a:hover {
  text-decoration: underline;
}
.panel-fork-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: var(--color-accent-glow);
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  color: var(--color-accent);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.panel-fork-btn:hover {
  background: rgba(79, 124, 255, 0.2);
}
.reasoning-section {
  margin-bottom: 20px;
}
.reasoning-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--color-text-dim);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 0;
  transition: color 0.15s;
}
.reasoning-toggle:hover {
  color: var(--color-text-muted);
}
.reasoning-toggle svg {
  transition: transform 0.2s;
}
.reasoning-toggle svg.rotated {
  transform: rotate(90deg);
}
.reasoning-content {
  margin-top: 8px;
  padding: 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
}
.reasoning-text {
  font-size: 12px;
  color: var(--color-text-dim);
  line-height: 1.6;
  margin-bottom: 8px;
  font-style: italic;
}
.reasoning-text:last-child {
  margin-bottom: 0;
}
</style>
