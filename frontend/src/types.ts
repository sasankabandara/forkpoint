/* ── Types for the Forkpoint timeline ───────────────── */

export interface RippleEffects {
  practical: string
  relationships: string
  psychological: string
}

export interface PivotNode {
  id: string
  title: string
  summary: string
  category: 'personal' | 'historical' | 'social'
  turning_point: string
}

export interface CauseNode {
  id: string
  title: string
  summary: string
  depth: number
  parent_id: string
  confidence: 'established' | 'likely' | 'speculative'
}

export interface ConsequenceNode {
  id: string
  whatif: string
  title: string
  summary: string
  narrative: string
  probability: string
  emotion: string
  depth: number
  parent_id: string
  ripple: RippleEffects | null
  sensitive: boolean
  reasoning_trace?: string
}

export interface BranchNode extends ConsequenceNode {
  children: ConsequenceNode[]
}

export interface ScenarioTree {
  pivot: PivotNode
  causes: CauseNode[]
  consequences: ConsequenceNode[]
  input: string
  reasoning_trace?: string
}

export interface GenerateResponse {
  id: string
  tree: ScenarioTree
}

export interface ForkRequest {
  scenario_id: string
  parent_node_id: string
  parent_title: string
  parent_summary: string
  whatif: string
  depth: number
  branch_color: string
  ancestor_chain: string[]
}

export interface ForkResponse {
  id: string
  scenario_id: string
  branch: BranchNode
}

/* ── Unified node for the canvas ─────────────────────── */
export type TimelineNodeType = 'cause' | 'pivot' | 'consequence' | 'branch' | 'ghost' | 'fork_signpost'

export interface TimelineNodeData {
  type: TimelineNodeType
  title: string
  summary: string
  label?: string        // "cause", "the event", "what happened", or the whatif question
  confidence?: string   // for cause nodes
  probability?: string
  emotion?: string
  narrative?: string
  ripple?: RippleEffects | null
  sensitive?: boolean
  whatif?: string
  branchColor?: string
  depth?: number
  parentNodeId?: string  // for fork reference
  nodeId: string         // original ID from the tree
  reasoningTrace?: string // AI's reasoning process (collapsible in detail panel)
  createdAt?: string      // timestamp for signpost nodes
}

/* ── Branch tracking ─────────────────────────────────── */
export interface Branch {
  id: string
  parentNodeId: string
  color: string
  row: number     // vertical row index (1, 2, 3...)
  nodes: string[] // node IDs in this branch
}

export interface ScenarioListItem {
  id: string
  input: string
  created_at: string
}
