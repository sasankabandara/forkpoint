<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'submit', whatif: string): void
  (e: 'close'): void
}>()

const whatif = ref('')

function submit() {
  const trimmed = whatif.value.trim()
  if (trimmed) {
    emit('submit', trimmed)
    whatif.value = ''
  }
}
</script>

<template>
  <div class="fork-popover popover-fade-in" @click.stop>
    <input
      v-model="whatif"
      type="text"
      placeholder="What if instead…"
      class="fork-input"
      @keydown.enter="submit"
      @keydown.escape="emit('close')"
      autofocus
    />
    <button class="fork-confirm" @click="submit" :disabled="!whatif.trim()">
      Fork →
    </button>
  </div>
</template>

<style scoped>
.fork-popover {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  min-width: 280px;
}
.fork-input {
  flex: 1;
  padding: 8px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-size: 13px;
  font-family: var(--font-sans);
  outline: none;
  transition: border-color 0.15s;
}
.fork-input:focus {
  border-color: var(--color-accent);
}
.fork-input::placeholder {
  color: var(--color-text-dim);
}
.fork-confirm {
  padding: 8px 16px;
  background: var(--color-accent);
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.fork-confirm:hover:not(:disabled) {
  background: var(--color-accent-hover);
}
.fork-confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
