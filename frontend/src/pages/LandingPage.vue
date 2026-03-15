<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTimeline } from '../composables/useTimeline'
import { useTimelineStore } from '../stores/timeline'
import { DEMO_TREE, DEMO_SCENARIO_ID } from '../demoData'

const store = useTimelineStore()
const { generate } = useTimeline()
const router = useRouter()

const input = ref('')

const examples = [
  'I quit my job without a plan',
  "I didn't apologize in time",
  'WW2 — what if D-Day failed',
  'I moved cities alone at 22',
  'I said yes instead of no',
]

function prefill(text: string) {
  input.value = text
}

async function explore() {
  const trimmed = input.value.trim()
  if (!trimmed) return
  try {
    await generate(trimmed)
  } catch {
    // error is in store
  }
}

function loadDemo() {
  store.setTree(DEMO_SCENARIO_ID, DEMO_TREE.input, DEMO_TREE)
  router.push({ name: 'timeline', params: { id: DEMO_SCENARIO_ID } })
}
</script>

<template>
  <div class="landing">
    <div class="landing-content">
      <h1 class="headline">What would have happened if…</h1>
      <p class="subheadline">Describe any scenario. Explore it as a branching timeline of alternate paths.</p>

      <div class="input-area">
        <input
          v-model="input"
          type="text"
          class="scenario-input"
          placeholder="I took that job in Berlin instead…"
          @keydown.enter="explore"
          :disabled="store.isLoading"
        />
        <button
          class="explore-btn"
          @click="explore"
          :disabled="!input.trim() || store.isLoading"
        >
          <span v-if="!store.isLoading">Explore →</span>
          <span v-else class="loading-text">Thinking…</span>
        </button>
      </div>

      <div v-if="store.error" class="error-msg">{{ store.error }}</div>

      <div class="examples">
        <button
          v-for="ex in examples"
          :key="ex"
          class="example-chip"
          @click="prefill(ex)"
          :disabled="store.isLoading"
        >
          {{ ex }}
        </button>
      </div>

      <button class="demo-link" @click="loadDemo">
        ✦ Try with a demo scenario (no API keys needed)
      </button>

      <p class="footer-text">Forkpoint uses AI to simulate plausible outcomes. Not predictions — possibilities.</p>
    </div>
  </div>
</template>

<style scoped>
.landing {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 48px 24px;
}
.landing-content {
  max-width: 620px;
  width: 100%;
  text-align: center;
}
.headline {
  font-family: var(--font-serif);
  font-size: 42px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}
.subheadline {
  font-size: 16px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 40px;
}
.input-area {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.scenario-input {
  flex: 1;
  padding: 16px 20px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  color: var(--color-text);
  font-size: 15px;
  font-family: var(--font-sans);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.scenario-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-glow);
}
.scenario-input::placeholder {
  color: var(--color-text-dim);
}
.scenario-input:disabled {
  opacity: 0.6;
}
.explore-btn {
  padding: 16px 28px;
  background: var(--color-accent);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  white-space: nowrap;
}
.explore-btn:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}
.explore-btn:active:not(:disabled) {
  transform: translateY(0);
}
.explore-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.loading-text {
  animation: pulse-ghost 1.4s ease-in-out infinite;
}
.error-msg {
  color: var(--color-sensitive);
  font-size: 13px;
  margin-bottom: 16px;
}
.examples {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 48px;
}
.example-chip {
  padding: 8px 16px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  font-family: var(--font-sans);
}
.example-chip:hover:not(:disabled) {
  border-color: var(--color-border-hover);
  color: var(--color-text);
  background: var(--color-bg-hover);
}
.example-chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.demo-link {
  display: inline-block;
  margin-bottom: 32px;
  padding: 10px 20px;
  background: transparent;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
  color: var(--color-accent);
  font-size: 13px;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.demo-link:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-glow);
}
.footer-text {
  font-size: 13px;
  color: var(--color-text-dim);
  line-height: 1.6;
}
</style>
