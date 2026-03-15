"""API routers — HTTP endpoints with rate limiting."""

from __future__ import annotations
from fastapi import APIRouter, Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from models import GenerateRequest, ForkRequest, GenerateResponse, ForkResponse
import services
import database as db

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api")


@router.post("/generate", response_model=GenerateResponse)
@limiter.limit("10/hour")
async def generate(request: Request, body: GenerateRequest):
    """Generate a full bidirectional timeline from a scenario."""
    try:
        result = await services.generate_scenario(body.input)
        return result
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@router.post("/fork", response_model=ForkResponse)
@limiter.limit("30/hour")
async def fork(request: Request, body: ForkRequest):
    """Fork a new branch from an existing node."""
    try:
        result = await services.fork_node(body)
        return result
    except ValueError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fork failed: {str(e)}")


@router.get("/scenarios/{scenario_id}")
async def get_scenario(scenario_id: str):
    """Load a saved scenario by ID."""
    try:
        scenario = db.get_scenario(scenario_id)
        if not scenario:
            raise HTTPException(status_code=404, detail="Scenario not found")
        # Also load branches
        branches = db.get_branches(scenario_id)
        return {"scenario": scenario, "branches": branches}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Load failed: {str(e)}")


@router.get("/scenarios")
async def list_scenarios():
    """List recent scenarios."""
    try:
        scenarios = db.list_scenarios()
        return {"scenarios": scenarios}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"List failed: {str(e)}")
