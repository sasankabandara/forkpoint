<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { useTimelineStore } from '../stores/timeline'
import { useTimeline } from '../composables/useTimeline'
import { DEMO_SCENARIO_ID, DEMO_TREE, DEMO_BRANCH } from '../demoData'
import type { TimelineNodeData } from '../types'
import CauseNode from '../components/CauseNode.vue'
import PivotNode from '../components/PivotNode.vue'
import ConsequenceNode from '../components/ConsequenceNode.vue'
import BranchNode from '../components/BranchNode.vue'
import GhostNode from '../components/GhostNode.vue'
import ForkSignpostNode from '../components/ForkSignpostNode.vue'
import DetailPanel from '../components/DetailPanel.vue'
import ForkPopover from '../components/ForkPopover.vue'

const store = useTimelineStore()
const { fork, selectNode } = useTimeline()
const { fitView } = useVueFlow()
const route = useRoute()
const router = useRouter()

const isDemo = computed(() => store.scenarioId === DEMO_SCENARIO_ID)
let demoForked = false

// Cast selectedNode to the type DetailPanel expects
const detailNode = computed(() => {
  const n = store.selectedNode
  if (!n || !n.data) return null
  return { data: n.data as TimelineNodeData }
})

// Fork popover state
const showPopover = ref(false)
const popoverNodeId = ref<string | null>(null)

onMounted(() => {
  // Restore demo state if page is refreshed on the demo URL
  if (!store.tree && route.params.id) {
    if (route.params.id === DEMO_SCENARIO_ID) {
      store.setTree(DEMO_SCENARIO_ID, DEMO_TREE.input, DEMO_TREE)
      demoForked = false
    } else {
      router.push('/')
      return
    }
  }

  // Auto-fit after a short delay to let nodes render
  setTimeout(() => {
    fitView({ padding: 0.2, duration: 300 })
  }, 200)
})

function onNodeClick(event: any) {
  const nodeId = event.node?.id
  const nodeType = event.node?.type
  if (nodeId && nodeId !== 'ghost-loading' && nodeType !== 'fork_signpost') {
    selectNode(nodeId)
  }
}

function openPopover(nodeId: string) {
  popoverNodeId.value = nodeId
  showPopover.value = true
}

async function onForkSubmit(whatif: string) {
  if (!popoverNodeId.value) return
  showPopover.value = false

  const branchColor = store.nextBranchColor

  // Create signpost immediately (before any API call)
  store.addSignpostNode(popoverNodeId.value, whatif, branchColor)

  if (isDemo.value && !demoForked) {
    // Demo fork: use hardcoded data
    demoForked = true
    store.addGhostNode(popoverNodeId.value)
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800))
    store.removeGhostNode()
    store.addBranch(popoverNodeId.value, DEMO_BRANCH, branchColor)
    setTimeout(() => fitView({ padding: 0.2, duration: 500 }), 300)
  } else {
    await fork(popoverNodeId.value, whatif)
    setTimeout(() => fitView({ padding: 0.2, duration: 500 }), 300)
  }
}

function onPanelFork(nodeId: string) {
  selectNode(null) // close panel
  openPopover(nodeId)
}

function handleConsequenceFork(nodeId: string) {
  openPopover(nodeId)
}
</script>

<template>
  <div class="timeline-page">
    <VueFlow
      :nodes="store.nodes"
      :edges="store.edges"
      :default-viewport="{ x: 0, y: 0, zoom: 0.85 }"
      :min-zoom="0.2"
      :max-zoom="2"
      fit-view-on-init
      @node-click="onNodeClick"
      class="timeline-flow"
    >
      <!-- Custom node types -->
      <template #node-cause="{ data }">
        <CauseNode :data="data" @click="selectNode(data.nodeId)" />
      </template>

      <template #node-pivot="{ data }">
        <PivotNode :data="data" @click="selectNode(data.nodeId)" />
      </template>

      <template #node-consequence="{ data }">
        <ConsequenceNode
          :data="data"
          @click="selectNode(data.nodeId)"
          @fork="handleConsequenceFork(data.nodeId)"
        />
      </template>

      <template #node-branch="{ data }">
        <BranchNode
          :data="data"
          @click="selectNode(data.nodeId)"
          @fork="openPopover(data.nodeId)"
        />
      </template>

      <template #node-ghost="{ data }">
        <GhostNode />
      </template>

      <template #node-fork_signpost="{ data }">
        <ForkSignpostNode :data="data" />
      </template>

      <Controls position="bottom-left" />
    </VueFlow>

    <!-- Fork Popover (floating) -->
    <Teleport to="body">
      <div
        v-if="showPopover"
        class="popover-overlay"
        @click="showPopover = false"
      >
        <div class="popover-container" @click.stop>
          <ForkPopover
            @submit="onForkSubmit"
            @close="showPopover = false"
          />
        </div>
      </div>
    </Teleport>

    <!-- Detail Panel -->
    <DetailPanel
      :node="detailNode"
      @close="selectNode(null)"
      @fork="onPanelFork"
    />

    <!-- Loading overlay for forking -->
    <div v-if="store.isForking" class="fork-loading">
      <div class="fork-loading-text thinking-phases">
        <span class="phase phase-1">thinking through the journey so far…</span>
        <span class="phase phase-2">considering what comes next…</span>
      </div>
    </div>

    <!-- Back button -->
    <router-link to="/" class="back-btn" title="New scenario">
      ← New
    </router-link>

    <!-- Error banner -->
    <div v-if="store.error" class="error-banner">
      {{ store.error }}
      <button @click="store.error = null">✕</button>
    </div>
  </div>
</template>

<style scoped>
.timeline-page {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
.timeline-flow {
  width: 100%;
  height: 100%;
}
.popover-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}
.popover-container {
  animation: fade-in 0.15s ease-out;
}
.fork-loading {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  z-index: 50;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}
.fork-loading-text {
  font-size: 13px;
  color: var(--color-text-muted);
}
.thinking-phases {
  position: relative;
  min-width: 260px;
  text-align: center;
}
.thinking-phases .phase {
  position: absolute;
  left: 0;
  right: 0;
  opacity: 0;
  animation: pulse-ghost 1.4s ease-in-out infinite;
}
.thinking-phases .phase-1 {
  opacity: 1;
  animation: phase-out 6s ease-in-out forwards;
}
.thinking-phases .phase-2 {
  animation: phase-in 6s ease-in-out forwards;
}
@keyframes phase-out {
  0%, 40% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes phase-in {
  0%, 40% { opacity: 0; }
  50%, 100% { opacity: 1; }
}
.back-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  padding: 8px 16px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-muted);
  font-size: 13px;
  text-decoration: none;
  z-index: 50;
  transition: border-color 0.15s, color 0.15s;
}
.back-btn:hover {
  border-color: var(--color-border-hover);
  color: var(--color-text);
}
.error-banner {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  background: rgba(204, 107, 90, 0.12);
  border: 1px solid rgba(204, 107, 90, 0.3);
  border-radius: 8px;
  color: var(--color-sensitive);
  font-size: 13px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 12px;
}
.error-banner button {
  background: none;
  border: none;
  color: var(--color-sensitive);
  cursor: pointer;
  font-size: 14px;
}
</style>
