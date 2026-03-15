/**
 * Pinia store — holds all shared timeline state.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Node, Edge } from '@vue-flow/core'
import type {
  ScenarioTree, TimelineNodeData, Branch,
  CauseNode, ConsequenceNode, BranchNode
} from '../types'

const BRANCH_COLORS = ['blue', 'green', 'red', 'purple', 'orange', 'cyan', 'pink'] as const
const NODE_WIDTH = 220
const NODE_GAP = 60
const SIGNPOST_WIDTH = 60
const SIGNPOST_GAP = 40
const BRANCH_Y_OFFSET = 140

export const useTimelineStore = defineStore('timeline', () => {
  // ── State ─────────────────────────────────────────────
  const scenarioId = ref<string>('')
  const scenarioInput = ref<string>('')
  const tree = ref<ScenarioTree | null>(null)
  const nodes = ref<Node<TimelineNodeData>[]>([])
  const edges = ref<Edge[]>([])
  const branches = ref<Branch[]>([])
  const selectedNodeId = ref<string | null>(null)
  const isLoading = ref(false)
  const isForking = ref(false)
  const forkingNodeId = ref<string | null>(null)
  const error = ref<string | null>(null)

  // ── Computed ──────────────────────────────────────────
  const selectedNode = computed(() => {
    if (!selectedNodeId.value) return null
    return nodes.value.find(n => n.id === selectedNodeId.value) ?? null
  })
  const nextBranchColor = computed(() => {
    return BRANCH_COLORS[branches.value.length % BRANCH_COLORS.length]
  })
  const nextBranchRow = computed(() => branches.value.length + 1)

  // ── Layout helpers ────────────────────────────────────
  function computeMainLayout(treeData: ScenarioTree) {
    const newNodes: Node<TimelineNodeData>[] = []
    const newEdges: Edge[] = []

    // Sort causes by depth descending (root cause = depth 3 leftmost)
    const sortedCauses = [...treeData.causes].sort((a, b) => b.depth - a.depth)

    // Place cause nodes left of pivot
    sortedCauses.forEach((cause, i) => {
      const x = i * (NODE_WIDTH + NODE_GAP)
      newNodes.push({
        id: cause.id,
        type: 'cause',
        position: { x, y: 0 },
        data: {
          type: 'cause',
          title: cause.title,
          summary: cause.summary,
          label: 'cause',
          confidence: cause.confidence,
          nodeId: cause.id,
          depth: cause.depth,
        }
      })
    })

    // Connect causes in chain
    for (let i = 0; i < sortedCauses.length - 1; i++) {
      newEdges.push({
        id: `e-${sortedCauses[i].id}-${sortedCauses[i + 1].id}`,
        source: sortedCauses[i].id,
        target: sortedCauses[i + 1].id,
        type: 'smoothstep',
        style: { stroke: '#3d3f54' },
      })
    }

    // Connect last cause to pivot
    if (sortedCauses.length > 0) {
      newEdges.push({
        id: `e-${sortedCauses[sortedCauses.length - 1].id}-pivot`,
        source: sortedCauses[sortedCauses.length - 1].id,
        target: 'pivot',
        type: 'smoothstep',
        style: { stroke: '#3d3f54' },
      })
    }

    // Place pivot in center
    const pivotX = sortedCauses.length * (NODE_WIDTH + NODE_GAP)
    newNodes.push({
      id: 'pivot',
      type: 'pivot',
      position: { x: pivotX, y: 0 },
      data: {
        type: 'pivot',
        title: treeData.pivot.title,
        summary: treeData.pivot.summary,
        label: 'the event',
        nodeId: 'pivot',
      }
    })

    // Place consequence nodes right of pivot
    treeData.consequences.forEach((con, i) => {
      const x = pivotX + (i + 1) * (NODE_WIDTH + NODE_GAP)
      newNodes.push({
        id: con.id,
        type: 'consequence',
        position: { x, y: 0 },
        data: {
          type: 'consequence',
          title: con.title,
          summary: con.summary,
          label: 'what happened',
          whatif: con.whatif,
          probability: con.probability,
          emotion: con.emotion,
          narrative: con.narrative,
          ripple: con.ripple,
          sensitive: con.sensitive,
          nodeId: con.id,
          depth: con.depth,
          parentNodeId: con.parent_id,
          reasoningTrace: con.reasoning_trace || treeData.reasoning_trace,
        }
      })

      // Connect pivot → consequence chain
      const sourceId = i === 0 ? 'pivot' : treeData.consequences[i - 1].id
      newEdges.push({
        id: `e-${sourceId}-${con.id}`,
        source: sourceId,
        target: con.id,
        type: 'smoothstep',
        style: { stroke: '#3d3f54' },
      })
    })

    return { nodes: newNodes, edges: newEdges }
  }

  // Current signpost ID for the in-progress fork
  const currentSignpostId = ref<string | null>(null)

  // ── Actions ───────────────────────────────────────────
  function setTree(id: string, input: string, treeData: ScenarioTree) {
    scenarioId.value = id
    scenarioInput.value = input
    tree.value = treeData
    branches.value = []
    selectedNodeId.value = null
    error.value = null
    currentSignpostId.value = null

    const layout = computeMainLayout(treeData)
    nodes.value = layout.nodes
    edges.value = layout.edges
  }

  function addSignpostNode(parentNodeId: string, whatif: string, branchColor: string): string {
    const row = nextBranchRow.value
    const branchY = row * BRANCH_Y_OFFSET
    const parentNode = nodes.value.find(n => n.id === parentNodeId)
    if (!parentNode) return ''

    const signpostId = `${parentNodeId}-fork-${Date.now()}`
    currentSignpostId.value = signpostId

    nodes.value.push({
      id: signpostId,
      type: 'fork_signpost',
      position: { x: parentNode.position.x + 30, y: branchY },
      data: {
        type: 'fork_signpost',
        title: whatif,
        summary: '',
        whatif: whatif,
        branchColor: branchColor,
        nodeId: signpostId,
        depth: row,
        createdAt: new Date().toISOString(),
      }
    })

    // Curved dashed connector from parent to signpost
    edges.value.push({
      id: `e-fork-${parentNodeId}-${signpostId}`,
      source: parentNodeId,
      target: signpostId,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: `var(--color-branch-${branchColor})`,
        strokeDasharray: '6, 4',
      },
    })

    return signpostId
  }

  function addBranch(parentNodeId: string, branchNode: BranchNode, branchColor: string) {
    const row = nextBranchRow.value
    const branchY = row * BRANCH_Y_OFFSET

    // Find the signpost node if it exists; otherwise find parent
    const signpostId = currentSignpostId.value
    const signpostNode = signpostId ? nodes.value.find(n => n.id === signpostId) : null
    const parentNode = nodes.value.find(n => n.id === parentNodeId)
    if (!parentNode) return

    // Branch nodes start after the signpost (or after parent if no signpost)
    const branchStartX = signpostNode
      ? signpostNode.position.x + SIGNPOST_WIDTH + SIGNPOST_GAP
      : parentNode.position.x

    const branchId = `branch-${branches.value.length + 1}`

    // Track branch
    const branchRecord: Branch = {
      id: branchId,
      parentNodeId,
      color: branchColor,
      row,
      nodes: signpostId ? [signpostId, branchNode.id] : [branchNode.id],
    }

    // Add branch node
    nodes.value.push({
      id: branchNode.id,
      type: 'branch',
      position: { x: branchStartX, y: branchY },
      data: {
        type: 'branch',
        title: branchNode.title,
        summary: branchNode.summary,
        label: branchNode.whatif,
        whatif: branchNode.whatif,
        probability: branchNode.probability,
        emotion: branchNode.emotion,
        narrative: branchNode.narrative,
        ripple: branchNode.ripple,
        sensitive: branchNode.sensitive,
        branchColor: branchColor,
        nodeId: branchNode.id,
        depth: branchNode.depth,
        parentNodeId,
        reasoningTrace: branchNode.reasoning_trace,
      }
    })

    // Connector: signpost → first branch node (or parent → first if no signpost)
    const connectorSource = signpostId || parentNodeId
    edges.value.push({
      id: `e-fork-${connectorSource}-${branchNode.id}`,
      source: connectorSource,
      target: branchNode.id,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: `var(--color-branch-${branchColor})`,
        strokeDasharray: '6, 4',
      },
    })

    // Add child nodes along the branch
    branchNode.children.forEach((child, i) => {
      const childX = branchStartX + (i + 1) * (NODE_WIDTH + NODE_GAP)
      branchRecord.nodes.push(child.id)

      nodes.value.push({
        id: child.id,
        type: 'branch',
        position: { x: childX, y: branchY },
        data: {
          type: 'branch',
          title: child.title,
          summary: child.summary,
          label: child.whatif,
          whatif: child.whatif,
          probability: child.probability,
          emotion: child.emotion,
          narrative: child.narrative,
          ripple: child.ripple,
          sensitive: child.sensitive,
          branchColor: branchColor,
          nodeId: child.id,
          depth: child.depth,
          parentNodeId: branchNode.id,
        }
      })

      // Connect within branch
      const sourceId = i === 0 ? branchNode.id : branchNode.children[i - 1].id
      edges.value.push({
        id: `e-${sourceId}-${child.id}`,
        source: sourceId,
        target: child.id,
        type: 'smoothstep',
        style: {
          stroke: `var(--color-branch-${branchColor})`,
          strokeDasharray: '6, 4',
        },
      })
    })

    branches.value.push(branchRecord)
    currentSignpostId.value = null
  }

  function selectNode(nodeId: string | null) {
    selectedNodeId.value = nodeId
  }

  function removeGhostNode() {
    nodes.value = nodes.value.filter(n => n.data.type !== 'ghost')
    edges.value = edges.value.filter(e => !e.id.includes('ghost'))
  }

  function addGhostNode(parentNodeId: string) {
    const row = nextBranchRow.value
    const branchY = row * BRANCH_Y_OFFSET

    // Position ghost to the right of the signpost if it exists
    const signpostNode = currentSignpostId.value
      ? nodes.value.find(n => n.id === currentSignpostId.value)
      : null
    const parentNode = nodes.value.find(n => n.id === parentNodeId)
    if (!parentNode && !signpostNode) return

    const ghostX = signpostNode
      ? signpostNode.position.x + SIGNPOST_WIDTH + SIGNPOST_GAP
      : (parentNode?.position.x ?? 0)

    nodes.value.push({
      id: 'ghost-loading',
      type: 'ghost',
      position: { x: ghostX, y: branchY },
      data: {
        type: 'ghost',
        title: 'Exploring...',
        summary: '',
        nodeId: 'ghost-loading',
      }
    })

    // Connect signpost → ghost (or parent → ghost)
    const ghostSource = currentSignpostId.value || parentNodeId
    edges.value.push({
      id: `e-fork-${ghostSource}-ghost`,
      source: ghostSource,
      target: 'ghost-loading',
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: `var(--color-branch-${nextBranchColor.value})`,
        strokeDasharray: '6, 4',
      },
    })
  }

  function getAncestorChain(nodeId: string): string[] {
    const chain: string[] = []
    let currentNode = nodes.value.find(n => n.id === nodeId)
    while (currentNode) {
      chain.unshift(currentNode.data.title)
      const parentId = currentNode.data.parentNodeId
      if (!parentId) break
      currentNode = nodes.value.find(n => n.id === parentId)
    }
    return chain
  }

  function reset() {
    scenarioId.value = ''
    scenarioInput.value = ''
    tree.value = null
    nodes.value = []
    edges.value = []
    branches.value = []
    selectedNodeId.value = null
    isLoading.value = false
    isForking.value = false
    forkingNodeId.value = null
    error.value = null
  }

  return {
    // State
    scenarioId, scenarioInput, tree, nodes, edges, branches,
    selectedNodeId, isLoading, isForking, forkingNodeId, error,
    // Computed
    selectedNode, nextBranchColor, nextBranchRow,
    // Actions
    setTree, addBranch, selectNode, addGhostNode, removeGhostNode,
    addSignpostNode, getAncestorChain, reset,
    currentSignpostId,
  }
})
