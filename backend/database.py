"""Singleton Supabase client and database operations."""

from __future__ import annotations
import uuid
from typing import Optional
from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_KEY


_client: Optional[Client] = None


def get_client() -> Client:
    """Get or create the singleton Supabase client."""
    global _client
    if _client is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set")
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client


def save_scenario(input_text: str, tree: dict) -> str:
    """Save a generated scenario tree. Returns the scenario ID."""
    scenario_id = str(uuid.uuid4())
    client = get_client()
    client.table("scenarios").insert({
        "id": scenario_id,
        "input": input_text,
        "tree": tree,
        "is_public": False,
    }).execute()
    return scenario_id


def save_branch(
    scenario_id: str,
    parent_node_id: str,
    whatif: str,
    branch_color: str,
    branch_data: dict,
) -> str:
    """Save a fork branch. Returns the branch ID."""
    branch_id = str(uuid.uuid4())
    client = get_client()
    client.table("branches").insert({
        "id": branch_id,
        "scenario_id": scenario_id,
        "parent_node_id": parent_node_id,
        "whatif": whatif,
        "branch_color": branch_color,
        "branch_data": branch_data,
    }).execute()
    return branch_id


def get_scenario(scenario_id: str) -> Optional[dict]:
    """Load a scenario by ID."""
    client = get_client()
    result = client.table("scenarios").select("*").eq("id", scenario_id).execute()
    if result.data:
        return result.data[0]
    return None


def list_scenarios(limit: int = 20) -> list[dict]:
    """List recent scenarios."""
    client = get_client()
    result = (
        client.table("scenarios")
        .select("id, input, created_at")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data


def get_branches(scenario_id: str) -> list[dict]:
    """Get all branches for a scenario."""
    client = get_client()
    result = (
        client.table("branches")
        .select("*")
        .eq("scenario_id", scenario_id)
        .order("created_at")
        .execute()
    )
    return result.data
