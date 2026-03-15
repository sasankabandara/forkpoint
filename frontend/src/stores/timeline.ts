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

  // ── Actions ───────────────────────────────────────────
  function setTree(id: string, input: string, treeData: ScenarioTree) {
    scenarioId.value = id
    scenarioInput.value = input
    tree.value = treeData
    branches.value = []
    selectedNodeId.value = null
    error.value = null

    const layout = computeMainLayout(treeData)
    nodes.value = layout.nodes
    edges.value = layout.edges
  }

  function addBranch(parentNodeId: string, branchNode: BranchNode, branchColor: string) {
    const row = nextBranchRow.value
    const branchY = row * BRANCH_Y_OFFSET

    // Find parent node position
    const parentNode = nodes.value.find(n => n.id === parentNodeId)
    if (!parentNode) return

    const parentX = parentNode.position.x
    const branchId = `branch-${branches.value.length + 1}`

    // Track branch
    const branchRecord: Branch = {
      id: branchId,
      parentNodeId,
      color: branchColor,
      row,
      nodes: [branchNode.id],
    }

    // Add branch node
    nodes.value.push({
      id: branchNode.id,
      type: 'branch',
      position: { x: parentX, y: branchY },
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
      }
    })

    // Add connector from parent to branch node (curved dashed)
    edges.value.push({
      id: `e-fork-${parentNodeId}-${branchNode.id}`,
      source: parentNodeId,
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
      const childX = parentX + (i + 1) * (NODE_WIDTH + NODE_GAP)
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
    const parentNode = nodes.value.find(n => n.id === parentNodeId)
    if (!parentNode) return

    nodes.value.push({
      id: 'ghost-loading',
      type: 'ghost',
      position: { x: parentNode.position.x, y: branchY },
      data: {
        type: 'ghost',
        title: 'Exploring...',
        summary: '',
        nodeId: 'ghost-loading',
      }
    })

    edges.value.push({
      id: `e-fork-${parentNodeId}-ghost`,
      source: parentNodeId,
      target: 'ghost-loading',
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: '#3d3f54',
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
    getAncestorChain, reset,
  }
})
