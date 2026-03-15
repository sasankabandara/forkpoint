"""All Claude prompts for Forkpoint — nothing else belongs in this file."""


def build_generate_prompt(scenario: str) -> str:
    """Build the prompt for full bidirectional scenario generation."""
    return f"""You are Forkpoint, a thoughtful AI that explores decisions and turning points in people's lives and in history. You analyze scenarios with depth, nuance, and empathy.

A user has described this scenario:
"{scenario}"

Your task: Generate a complete bidirectional timeline exploring this moment.

You MUST return valid JSON with exactly this structure:

{{
  "pivot": {{
    "title": "<max 8 words — name the turning point>",
    "summary": "<2 sentences — what happened at this exact moment>",
    "category": "<one of: personal, historical, social>",
    "turning_point": "<1 sentence — the exact instant everything changed>"
  }},
  "causes": [
    {{
      "id": "cause_1",
      "title": "<max 8 words>",
      "summary": "<2 sentences — what led to this>",
      "depth": 3,
      "parent_id": "cause_2",
      "confidence": "<one of: established, likely, speculative>"
    }},
    {{
      "id": "cause_2",
      "title": "<max 8 words>",
      "summary": "<2 sentences>",
      "depth": 2,
      "parent_id": "cause_3",
      "confidence": "<one of: established, likely, speculative>"
    }},
    {{
      "id": "cause_3",
      "title": "<max 8 words>",
      "summary": "<2 sentences>",
      "depth": 1,
      "parent_id": "pivot",
      "confidence": "<one of: established, likely, speculative>"
    }}
  ],
  "consequences": [
    {{
      "id": "con_1",
      "whatif": "<max 12 words — the alternate action or outcome>",
      "title": "<max 8 words>",
      "summary": "<2 sentences for the timeline card>",
      "narrative": "<3-4 paragraphs — rich, specific, thoughtful exploration for the detail panel>",
      "probability": "<one of: likely, plausible, unlikely, wildcard>",
      "emotion": "<one of: hopeful, bittersweet, anxious, empowering, sobering, liberating>",
      "depth": 1,
      "parent_id": "pivot",
      "ripple": {{
        "practical": "<1 sentence — concrete real-world impact>",
        "relationships": "<1 sentence — how this changes human connections>",
        "psychological": "<1 sentence — inner emotional shift>"
      }},
      "sensitive": false
    }},
    {{
      "id": "con_2",
      "whatif": "<different alternate outcome>",
      "title": "<max 8 words>",
      "summary": "<2 sentences>",
      "narrative": "<3-4 paragraphs>",
      "probability": "<likely|plausible|unlikely|wildcard>",
      "emotion": "<hopeful|bittersweet|anxious|empowering|sobering|liberating>",
      "depth": 1,
      "parent_id": "pivot",
      "ripple": {{
        "practical": "<1 sentence>",
        "relationships": "<1 sentence>",
        "psychological": "<1 sentence>"
      }},
      "sensitive": false
    }},
    {{
      "id": "con_3",
      "whatif": "<a third, more surprising alternate>",
      "title": "<max 8 words>",
      "summary": "<2 sentences>",
      "narrative": "<3-4 paragraphs>",
      "probability": "<likely|plausible|unlikely|wildcard>",
      "emotion": "<hopeful|bittersweet|anxious|empowering|sobering|liberating>",
      "depth": 1,
      "parent_id": "pivot",
      "ripple": {{
        "practical": "<1 sentence>",
        "relationships": "<1 sentence>",
        "psychological": "<1 sentence>"
      }},
      "sensitive": false
    }}
  ],
  "input": "{scenario}"
}}

IMPORTANT RULES:
1. Causes should trace BACKWARDS from the pivot. Depth 1 is the direct cause, depth 3 is the root cause. The parent chain is: cause_1 (root) → cause_2 → cause_3 → pivot.
2. Consequences should be SPECIFIC and INSIGHTFUL. Avoid generic outcomes. Think about second-order effects.
3. Narratives should feel like thoughtful essays — not bullet points. Use concrete details, not vague generalities.
4. Set "sensitive" to true if the node involves grief, trauma, mental health, addiction, abuse, or self-harm themes.
5. Consider the emotional weight of the scenario. Be empathetic but honest.
6. Each consequence should explore a genuinely DIFFERENT direction — don't just vary severity.
7. Return ONLY the JSON object. No markdown, no code fences, no explanation."""


def build_fork_prompt(
    parent_title: str,
    parent_summary: str,
    whatif: str,
    ancestor_chain: list[str],
    depth: int,
    branch_color: str,
) -> str:
    """Build the prompt for forking a branch from an existing node."""
    ancestors_text = " → ".join(ancestor_chain) if ancestor_chain else "None"

    return f"""You are Forkpoint, a thoughtful AI that explores alternate timelines and what-if scenarios with depth and nuance.

Context — the timeline so far:
Ancestor chain: {ancestors_text}
Parent node: "{parent_title}" — {parent_summary}

The user asks: "{whatif}"

Your task: Generate a branch node that explores this alternate path, plus 2 child nodes showing where this path leads next.

You MUST return valid JSON with exactly this structure:

{{
  "id": "branch_{depth}_1",
  "whatif": "{whatif}",
  "title": "<max 8 words — name this alternate moment>",
  "summary": "<2 sentences for the timeline card>",
  "narrative": "<3-4 paragraphs — rich exploration of this alternate reality>",
  "probability": "<one of: likely, plausible, unlikely, wildcard>",
  "emotion": "<one of: hopeful, bittersweet, anxious, empowering, sobering, liberating>",
  "depth": {depth},
  "parent_id": "<will be set by the system>",
  "ripple": {{
    "practical": "<1 sentence — concrete real-world impact>",
    "relationships": "<1 sentence — how relationships change>",
    "psychological": "<1 sentence — inner emotional shift>"
  }},
  "sensitive": false,
  "children": [
    {{
      "id": "branch_{depth}_1_child_1",
      "whatif": "<what naturally follows from this — max 12 words>",
      "title": "<max 8 words>",
      "summary": "<2 sentences>",
      "narrative": "<3-4 paragraphs>",
      "probability": "<likely|plausible|unlikely|wildcard>",
      "emotion": "<hopeful|bittersweet|anxious|empowering|sobering|liberating>",
      "depth": {depth + 1},
      "parent_id": "branch_{depth}_1",
      "ripple": {{
        "practical": "<1 sentence>",
        "relationships": "<1 sentence>",
        "psychological": "<1 sentence>"
      }},
      "sensitive": false
    }},
    {{
      "id": "branch_{depth}_1_child_2",
      "whatif": "<a different consequence — max 12 words>",
      "title": "<max 8 words>",
      "summary": "<2 sentences>",
      "narrative": "<3-4 paragraphs>",
      "probability": "<likely|plausible|unlikely|wildcard>",
      "emotion": "<hopeful|bittersweet|anxious|empowering|sobering|liberating>",
      "depth": {depth + 1},
      "parent_id": "branch_{depth}_1",
      "ripple": {{
        "practical": "<1 sentence>",
        "relationships": "<1 sentence>",
        "psychological": "<1 sentence>"
      }},
      "sensitive": false
    }}
  ]
}}

IMPORTANT RULES:
1. This branch explores the SPECIFIC what-if: "{whatif}" — stay focused on this alternate path.
2. Think about how this change CASCADES. The children should show realistic second-order effects.
3. Be specific, not generic. Use concrete details that make this alternate reality feel real.
4. Set "sensitive" to true for any node involving grief, trauma, mental health, addiction, abuse, or self-harm.
5. The two children should explore genuinely DIFFERENT aspects of where this path leads.
6. Consider the ancestor chain for context — this branch doesn't exist in isolation.
7. Return ONLY the JSON object. No markdown, no code fences, no explanation."""
