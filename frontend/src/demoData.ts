/**
 * Hardcoded demo data for testing the timeline canvas without API keys.
 * Uses the D-Day scenario as a rich example.
 */

import type { ScenarioTree, BranchNode } from './types'

export const DEMO_SCENARIO_ID = 'demo-dday-001'

export const DEMO_TREE: ScenarioTree = {
  input: 'WW2 — what if D-Day failed',
  pivot: {
    id: 'pivot',
    title: 'The Normandy Gamble',
    summary:
      'On June 6, 1944, Allied forces launched the largest amphibious invasion in history on the beaches of Normandy. Everything hung on whether the beachheads could hold.',
    category: 'historical',
    turning_point:
      'The moment the first landing craft doors dropped on Omaha Beach under withering German fire.',
  },
  causes: [
    {
      id: 'cause_1',
      title: 'Rise of Nazi Expansionism',
      summary:
        "Hitler's annexation of Austria and Czechoslovakia signaled an insatiable territorial ambition. Europe's policy of appeasement only emboldened further aggression.",
      depth: 3,
      parent_id: 'cause_2',
      confidence: 'established',
    },
    {
      id: 'cause_2',
      title: 'Fall of France in 1940',
      summary:
        "Germany's blitzkrieg shattered French defenses in six weeks. Britain stood alone, and liberating the continent became the defining Allied objective.",
      depth: 2,
      parent_id: 'cause_3',
      confidence: 'established',
    },
    {
      id: 'cause_3',
      title: 'Operation Overlord Planned',
      summary:
        'Eisenhower and Montgomery spent months planning the invasion, balancing deception operations with the sheer logistics of moving 150,000 men across the Channel.',
      depth: 1,
      parent_id: 'pivot',
      confidence: 'established',
    },
  ],
  consequences: [
    {
      id: 'con_1',
      whatif: 'What if the beaches were held and Allies pushed inland fast',
      title: 'Rapid Allied Advance',
      summary:
        'With beachheads secured, Allied forces broke through at Saint-Lô and raced across France. Paris was liberated by August, and the Nazi war machine began its terminal retreat.',
      narrative:
        "The success at Normandy unleashed a torrent of Allied momentum that would have been unimaginable just weeks before. Once the hedgerow country of Bocage was finally breached at Saint-Lô, Patton's Third Army exploded into open terrain, covering ground at a pace that stunned even optimistic planners.\n\nParis fell on August 25, 1944 — not through bitter street fighting, but through a combination of internal uprising and the German garrison's recognition that holding the city was futile. De Gaulle's walk down the Champs-Élysées became one of the war's most iconic moments.\n\nBut the rapid advance carried its own seeds of trouble. Supply lines stretched thin, fuel ran critically short, and the debate between Montgomery's narrow thrust and Eisenhower's broad front approach created strategic friction that would cost precious weeks.\n\nThe euphoria of liberation masked a hard truth: Germany was wounded but far from finished. The Ardennes offensive in December would prove that the Wehrmacht could still strike with devastating force.",
      probability: 'likely',
      emotion: 'hopeful',
      depth: 1,
      parent_id: 'pivot',
      ripple: {
        practical:
          'The liberation of France reopened critical ports and supply routes that sustained the Allied advance.',
        relationships:
          'Franco-American bonds deepened into a generation-defining alliance forged in shared sacrifice.',
        psychological:
          'After years of occupation, the taste of freedom unleashed both euphoria and a painful reckoning with collaboration.',
      },
      sensitive: false,
    },
    {
      id: 'con_2',
      whatif: 'What if the invasion stalled at the beaches',
      title: 'Bloody Stalemate at Normandy',
      summary:
        'German reinforcements arrived faster than expected, pinning Allied forces in a narrow coastal strip. Weeks of grinding attrition turned the beachhead into a bloody WWI-style deadlock.',
      narrative:
        "In this darker timeline, the initial landings succeed but just barely. German panzer divisions, released earlier than they were historically, arrive at the beachhead within 48 hours rather than the critical days it actually took. The result is a nightmare scenario that Eisenhower had privately feared.\n\nAllied forces hold a strip of beach roughly 10 miles deep and 30 miles wide — enough to survive but not enough to break out. Every attempt to push inland meets coordinated counterattacks. The bocage hedgerows become a killing ground where American infantry advantages in mobility count for nothing.\n\nChurchill and Roosevelt face an agonizing decision: pour more men into the meat grinder, or pivot to a Mediterranean strategy that would take years longer. The political pressure is immense — this was supposed to be the decisive blow.\n\nMeanwhile, the Eastern Front continues its relentless grind. Stalin, watching the Allies struggle in France, begins to recalculate the post-war map with even greater ambition.",
      probability: 'plausible',
      emotion: 'anxious',
      depth: 1,
      parent_id: 'pivot',
      ripple: {
        practical:
          'A stalemate would have consumed Allied reserves and delayed the end of the European war by 6-12 months.',
        relationships:
          'Anglo-American military trust would have fractured under mutual blame for the strategic failure.',
        psychological:
          'The morale blow of a stalled invasion would have echoed through Allied populations already exhausted by four years of war.',
      },
      sensitive: false,
    },
    {
      id: 'con_3',
      whatif: 'What if D-Day was a total disaster and forces withdrew',
      title: 'The Great Retreat',
      summary:
        'Catastrophic losses on the beaches force Eisenhower to order a withdrawal. The Allies abandon the invasion, and the entire trajectory of the war shifts.',
      narrative:
        "This is the scenario that haunted Eisenhower enough to draft his famous \"our landings have failed\" letter. In this timeline, he has to send it.\n\nOmaha Beach becomes a slaughter. The naval bombardment misses its targets, the DD tanks sink in rough seas, and German defenders in the bluffs pour devastating fire into the exposed infantry. By midday, with casualties approaching 70%, the decision is made to evacuate.\n\nThe political fallout is seismic. Churchill's government faces a vote of no confidence. Roosevelt, in an election year, must explain to the American public why tens of thousands of their sons died on a French beach for nothing. Eisenhower offers his resignation.\n\nBut the war doesn't end — it transforms. The Soviet Union becomes the undisputed liberator of Europe, and the post-war map looks radically different. There is no NATO, no Marshall Plan as we know it, and the Iron Curtain falls far further west than it did in our timeline.",
      probability: 'unlikely',
      emotion: 'sobering',
      depth: 1,
      parent_id: 'pivot',
      ripple: {
        practical:
          'A failed D-Day would have extended the war by years and shifted the entire post-war order eastward.',
        relationships:
          'The US-UK special relationship would have been tested to breaking point by mutual recrimination.',
        psychological:
          'An entire generation would carry the trauma of a catastrophic military failure, reshaping Western identity.',
      },
      sensitive: false,
    },
  ],
}

/** Pre-built demo branch for showing fork functionality */
export const DEMO_BRANCH: BranchNode = {
  id: 'branch_1_1',
  whatif: 'What if the retreat caused a political crisis in Britain',
  title: 'Churchill Falls from Power',
  summary:
    'The failed invasion triggers a vote of no confidence. Churchill resigns, and a new government seeks a negotiated settlement with Germany.',
  narrative:
    "The news from Normandy arrives in the House of Commons like a thunderclap. The opposition, long restive under Churchill's bulldog leadership, senses blood. Within a week, a vote of no confidence is tabled.\n\nChurchill fights with characteristic defiance, but the numbers are against him. Too many MPs have constituents who lost sons on those beaches. The vote fails by a narrow margin, and Churchill — the man who held Britain together through the Blitz — walks out of 10 Downing Street in defeat.\n\nHis successor, Lord Halifax, represents a wing of the Conservative Party that has always been more pragmatic about negotiation. Secret channels to Berlin are opened through neutral Sweden.\n\nThe implications cascade outward: Roosevelt loses his most important ally, the Free French movement is cast adrift, and Stalin watches the Western alliance fracture with grim satisfaction.",
  probability: 'plausible',
  emotion: 'sobering',
  depth: 2,
  parent_id: 'con_3',
  ripple: {
    practical:
      'British war production would pivot from offensive to defensive, fundamentally altering the resource calculus.',
    relationships:
      'The Anglo-American alliance would face its most severe test since the War of 1812.',
    psychological:
      "The fall of Churchill would shatter the myth of British resolve that had sustained morale since 1940.",
  },
  sensitive: false,
  children: [
    {
      id: 'branch_1_1_child_1',
      whatif: 'Negotiations lead to a divided Europe under Nazi influence',
      title: 'The Bitter Peace of 1945',
      summary:
        'Halifax negotiates an armistice that leaves Nazi Germany controlling continental Europe. Britain survives, but the moral cost is staggering.',
      narrative:
        'The peace terms are harsh but not catastrophic for Britain itself. Germany keeps its continental conquests, Britain keeps its empire, and an uneasy peace settles over Europe.',
      probability: 'plausible',
      emotion: 'bittersweet',
      depth: 3,
      parent_id: 'branch_1_1',
      ripple: {
        practical: 'European trade networks collapse as the continent fragments into German-dominated economic blocs.',
        relationships: 'Millions of Europeans under Nazi rule would view Britain as the country that abandoned them.',
        psychological: 'The knowledge of having traded freedom for peace would haunt British identity for generations.',
      },
      sensitive: false,
    },
    {
      id: 'branch_1_1_child_2',
      whatif: 'The Soviet Union fills the power vacuum alone',
      title: 'Stalin Reaches the Atlantic',
      summary:
        'Without a Western front, the Red Army continues its advance westward. By 1946, Soviet forces stand on the shores of the English Channel.',
      narrative:
        "With no Western opposition on the continent, the Soviet war machine grinds through Germany alone. Berlin falls entirely to the Red Army, and there is no handshake at the Elbe.",
      probability: 'plausible',
      emotion: 'anxious',
      depth: 3,
      parent_id: 'branch_1_1',
      ripple: {
        practical: 'Soviet control of European industrial capacity would have created a superpower without parallel.',
        relationships: 'The Cold War begins earlier and with far higher stakes — a Soviet-dominated continent facing an isolated Anglo-American bloc.',
        psychological: 'The fear of communist expansion becomes an existential dread rather than a geopolitical concern.',
      },
      sensitive: false,
    },
  ],
}
