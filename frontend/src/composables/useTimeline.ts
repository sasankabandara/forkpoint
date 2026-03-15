/**
 * useTimeline — composable for all timeline business logic.
 * Orchestrates API calls + store mutations.
 */

import { useTimelineStore } from '../stores/timeline'
import { generateScenario, forkNode } from '../api'
import { useRouter } from 'vue-router'

export function useTimeline() {
  const store = useTimelineStore()
  const router = useRouter()

  async function generate(input: string) {
    store.isLoading = true
    store.error = null
    try {
      const response = await generateScenario(input)
      store.setTree(response.id, input, response.tree)
      router.push({ name: 'timeline', params: { id: response.id } })
    } catch (err: any) {
      store.error = err?.response?.data?.detail || err.message || 'Something went wrong'
      throw err
    } finally {
      store.isLoading = false
    }
  }

  async function fork(parentNodeId: string, whatif: string) {
    if (!store.scenarioId) return

    const parentNode = store.nodes.find(n => n.id === parentNodeId)
    if (!parentNode) return

    store.isForking = true
    store.forkingNodeId = parentNodeId
    store.addGhostNode(parentNodeId)

    try {
      const response = await forkNode({
        scenario_id: store.scenarioId,
        parent_node_id: parentNodeId,
        parent_title: parentNode.data.title,
        parent_summary: parentNode.data.summary,
        whatif,
        depth: (parentNode.data.depth ?? 0) + 1,
        branch_color: store.nextBranchColor,
        ancestor_chain: store.getAncestorChain(parentNodeId),
      })

      store.removeGhostNode()
      store.addBranch(parentNodeId, response.branch, store.nextBranchColor)
    } catch (err: any) {
      store.removeGhostNode()
      store.error = err?.response?.data?.detail || err.message || 'Fork failed'
    } finally {
      store.isForking = false
      store.forkingNodeId = null
    }
  }

  function selectNode(nodeId: string | null) {
    store.selectNode(nodeId)
  }

  return { generate, fork, selectNode }
}
