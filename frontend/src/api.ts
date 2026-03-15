/**
 * api.ts — single file for all HTTP calls to the backend.
 */

import axios from 'axios'
import type { ScenarioTree, GenerateResponse, ForkRequest, ForkResponse, ScenarioListItem } from './types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // Claude can take a while
})

export async function generateScenario(input: string): Promise<GenerateResponse> {
  const { data } = await api.post<GenerateResponse>('/api/generate', { input })
  return data
}

export async function forkNode(request: ForkRequest): Promise<ForkResponse> {
  const { data } = await api.post<ForkResponse>('/api/fork', request)
  return data
}

export async function getScenario(id: string): Promise<{ scenario: { id: string; input: string; tree: ScenarioTree }; branches: any[] }> {
  const { data } = await api.get(`/api/scenarios/${id}`)
  return data
}

export async function listScenarios(): Promise<ScenarioListItem[]> {
  const { data } = await api.get<{ scenarios: ScenarioListItem[] }>('/api/scenarios')
  return data.scenarios
}
