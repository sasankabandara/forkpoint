<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TimelineNodeData } from '../types'

const props = defineProps<{
  data: TimelineNodeData
}>()

const showTooltip = ref(false)

const truncatedText = computed(() => {
  const text = props.data.whatif || props.data.title || ''
  return text.length > 24 ? text.slice(0, 24) + '…' : text
})

const fullText = computed(() => props.data.whatif || props.data.title || '')

const branchColorVar = computed(() => {
  const c = props.data.branchColor
  return c ? `var(--color-branch-${c})` : 'var(--color-accent)'
})

const bgTint = computed(() => {
  const c = props.data.branchColor
  return c ? `var(--color-branch-${c}-tint, rgba(79, 124, 255, 0.06))` : 'rgba(79, 124, 255, 0.06)'
})

const formattedTime = computed(() => {
  if (!props.data.createdAt) return ''
  try {
    return new Date(props.data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
})

function toggleTooltip() {
  showTooltip.value = !showTooltip.value
}
</script>

<template>
  <div class="signpost-wrapper" @click="toggleTooltip">
    <div
      class="signpost-diamond"
      :style="{
        borderColor: branchColorVar,
        background: bgTint,
      }"
    >
      <span class="signpost-text">{{ truncatedText }}</span>
    </div>

    <!-- Tooltip popover -->
    <Transition name="tooltip">
      <div v-if="showTooltip" class="signpost-tooltip" @click.stop>
        <p class="tooltip-whatif">{{ fullText }}</p>
        <div class="tooltip-meta">
          <span v-if="formattedTime">{{ formattedTime }}</span>
          <span v-if="data.depth">Depth {{ data.depth }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.signpost-wrapper {
  position: relative;
  width: 56px;
  height: 56px;
  cursor: pointer;
  animation: signpost-enter 0.2s ease-out;
}

.signpost-diamond {
  width: 46px;
  height: 46px;
  transform: rotate(45deg);
  border: 1.5px solid var(--color-accent);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 5px;
  left: 5px;
  transition: transform 0.2s ease;
}

.signpost-wrapper:hover .signpost-diamond {
  transform: rotate(47deg);
}

.signpost-text {
  transform: rotate(-45deg);
  font-size: 10px;
  color: var(--color-text-muted);
  text-align: center;
  line-height: 1.2;
  max-width: 52px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
}

.signpost-tooltip {
  position: absolute;
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  padding: 10px 12px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  z-index: 20;
}

.tooltip-whatif {
  font-size: 12px;
  color: var(--color-text);
  line-height: 1.5;
  margin-bottom: 6px;
  font-style: italic;
}

.tooltip-meta {
  display: flex;
  gap: 8px;
  font-size: 10px;
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Tooltip transition */
.tooltip-enter-active { animation: fade-in 0.15s ease-out; }
.tooltip-leave-active { animation: fade-in 0.15s ease-in reverse; }

@keyframes signpost-enter {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
