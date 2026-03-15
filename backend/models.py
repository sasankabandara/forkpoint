"""Pydantic v2 models for the Forkpoint API."""

from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field


# ── Request Models ──────────────────────────────────────────────────

class GenerateRequest(BaseModel):
    input: str = Field(..., min_length=3, max_length=500, description="The scenario to explore")


class ForkRequest(BaseModel):
    scenario_id: str
    parent_node_id: str
    parent_title: str
    parent_summary: str
    whatif: str = Field(..., min_length=3, max_length=300)
    depth: int = Field(default=1, ge=1, le=10)
    branch_color: str = Field(default="blue")
    ancestor_chain: list[str] = Field(default_factory=list)


# ── Node Models ─────────────────────────────────────────────────────

class RippleEffects(BaseModel):
    practical: str
    relationships: str
    psychological: str


class PivotNode(BaseModel):
    id: str = Field(default="pivot")
    title: str
    summary: str
    category: str  # "personal" | "historical" | "social"
    turning_point: str


class CauseNode(BaseModel):
    id: str
    title: str
    summary: str
    depth: int = Field(ge=1, le=3)
    parent_id: str
    confidence: str  # "established" | "likely" | "speculative"


class ConsequenceNode(BaseModel):
    id: str
    whatif: str
    title: str
    summary: str
    narrative: str = ""
    probability: str = ""  # e.g. "likely", "plausible", "unlikely"
    emotion: str = ""  # e.g. "hopeful", "bittersweet", "anxious"
    depth: int = Field(default=1, ge=1)
    parent_id: str
    ripple: Optional[RippleEffects] = None
    sensitive: bool = False
    reasoning_trace: Optional[str] = None


class BranchNode(BaseModel):
    """A node created from a fork. Same fields as ConsequenceNode + children."""
    id: str
    whatif: str
    title: str
    summary: str
    narrative: str = ""
    probability: str = ""
    emotion: str = ""
    depth: int = Field(default=1, ge=1)
    parent_id: str
    ripple: Optional[RippleEffects] = None
    sensitive: bool = False
    reasoning_trace: Optional[str] = None
    children: list[ConsequenceNode] = Field(default_factory=list)


# ── Response Models ─────────────────────────────────────────────────

class ScenarioTree(BaseModel):
    pivot: PivotNode
    causes: list[CauseNode]
    consequences: list[ConsequenceNode]
    input: str
    reasoning_trace: Optional[str] = None


class GenerateResponse(BaseModel):
    id: str
    tree: ScenarioTree


class ForkResponse(BaseModel):
    id: str
    scenario_id: str
    branch: BranchNode
