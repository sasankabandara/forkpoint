"""Service layer — all business logic and Claude AI calls."""

from __future__ import annotations
import json
import logging
import anthropic
from models import (
    ScenarioTree, PivotNode, CauseNode, ConsequenceNode,
    BranchNode, ForkRequest, ForkResponse, GenerateResponse,
)
from prompts import build_generate_prompt, build_fork_prompt
from config import ANTHROPIC_API_KEY, CLAUDE_MODEL, CLAUDE_MAX_TOKENS
import database as db

logger = logging.getLogger(__name__)

_anthropic_client: anthropic.Anthropic | None = None


def _get_claude() -> anthropic.Anthropic:
    """Get or create the Anthropic client."""
    global _anthropic_client
    if _anthropic_client is None:
        if not ANTHROPIC_API_KEY:
            raise RuntimeError("ANTHROPIC_API_KEY must be set")
        _anthropic_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    return _anthropic_client


def _call_claude(prompt: str) -> dict:
    """Call Claude and parse the JSON response."""
    client = _get_claude()
    message = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=CLAUDE_MAX_TOKENS,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()

    # Strip markdown code fences if present
    if raw.startswith("```"):
        lines = raw.split("\n")
        # Remove first and last lines (```json and ```)
        lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        raw = "\n".join(lines)

    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse Claude response: {e}\nRaw: {raw[:500]}")
        raise ValueError(f"Claude returned invalid JSON: {e}")


async def generate_scenario(input_text: str) -> GenerateResponse:
    """Generate a complete bidirectional timeline from a scenario description."""
    prompt = build_generate_prompt(input_text)
    data = _call_claude(prompt)

    # Parse into typed models
    tree = ScenarioTree(
        pivot=PivotNode(**data["pivot"]),
        causes=[CauseNode(**c) for c in data["causes"]],
        consequences=[ConsequenceNode(**c) for c in data["consequences"]],
        input=data.get("input", input_text),
    )

    # Save to Supabase
    try:
        scenario_id = db.save_scenario(input_text, tree.model_dump())
    except Exception as e:
        logger.warning(f"Supabase save failed (continuing without persistence): {e}")
        import uuid
        scenario_id = str(uuid.uuid4())

    return GenerateResponse(id=scenario_id, tree=tree)


async def fork_node(request: ForkRequest) -> ForkResponse:
    """Fork a new branch from an existing node."""
    prompt = build_fork_prompt(
        parent_title=request.parent_title,
        parent_summary=request.parent_summary,
        whatif=request.whatif,
        ancestor_chain=request.ancestor_chain,
        depth=request.depth,
        branch_color=request.branch_color,
    )
    data = _call_claude(prompt)

    # Set the correct parent_id
    data["parent_id"] = request.parent_node_id

    # Parse children
    children = []
    for child in data.get("children", []):
        children.append(ConsequenceNode(**child))

    branch = BranchNode(
        id=data["id"],
        whatif=data["whatif"],
        title=data["title"],
        summary=data["summary"],
        narrative=data.get("narrative", ""),
        probability=data.get("probability", "plausible"),
        emotion=data.get("emotion", ""),
        depth=data.get("depth", request.depth),
        parent_id=request.parent_node_id,
        ripple=data.get("ripple"),
        sensitive=data.get("sensitive", False),
        children=children,
    )

    # Save branch to Supabase
    try:
        branch_id = db.save_branch(
            scenario_id=request.scenario_id,
            parent_node_id=request.parent_node_id,
            whatif=request.whatif,
            branch_color=request.branch_color,
            branch_data=branch.model_dump(),
        )
    except Exception as e:
        logger.warning(f"Supabase branch save failed: {e}")
        import uuid
        branch_id = str(uuid.uuid4())

    return ForkResponse(
        id=branch_id,
        scenario_id=request.scenario_id,
        branch=branch,
    )
