/**
 * Hardcoded demo data for testing the timeline canvas without API keys.
 * Uses the D-Day scenario as a rich example with reasoning traces.
 */

import type { ScenarioTree, BranchNode } from './types'

export const DEMO_SCENARIO_ID = 'demo-dday-001'

const SCENARIO_REASONING = `STEP 1 — SCENARIO DECONSTRUCTION

The user has asked about one of the most consequential military operations in modern history: the D-Day invasion at Normandy on June 6, 1944. The core turning point is not just the invasion itself but the specific moment of contact — when the landing craft doors dropped and men stepped into the surf under fire. The key actors are Eisenhower (bearing the weight of the decision), the individual soldiers (experiencing the visceral reality), the German high command (caught between Hitler's micromanagement and their own tactical instincts), and the absent actors — Stalin on the Eastern Front, whose calculations shift dramatically based on what happens on these beaches.

The emotional subtext of the user's framing — "what if D-Day failed" — suggests they are interested not just in military history but in the fragility of moments we take for granted in hindsight. The word "failed" implies they already know it succeeded and want to understand how close it came to not succeeding, and what the world would look like if it hadn't.

The domain is historical but carries deep personal resonance — D-Day touched millions of families across multiple nations. The implicit question underneath is: how much of the world we live in today was contingent on a single day going right?

STEP 2 — CONSEQUENCE DESIGN

Three genuinely distinct paths:

Path 1 changes the SPEED of success — the beaches are held but the advance is rapid rather than grinding. This explores how momentum creates its own problems (overextended supply lines, strategic disagreements). This is different in kind because it's about success creating unexpected friction.

Path 2 changes the DEGREE of failure — not total disaster but a bloody stalemate. This is the most psychologically interesting because it creates an agonizing middle ground where leadership must decide whether to double down or pivot. It's different from Path 1 because the fundamental question shifts from "how fast can we advance" to "should we even stay."

Path 3 changes the TOTALITY of the outcome — complete withdrawal. This is the scenario Eisenhower himself feared enough to draft a letter for. It's different from both others because it doesn't just affect the military situation — it reshapes the entire post-war political order.

I am deliberately rejecting two generic outcomes: "the Allies win but with more casualties" (this is just Path 1 with a grimmer tone, not a different kind) and "Hitler uses secret weapons to win" (this is speculative fantasy, not plausible reasoning). Both would produce shallow output that could apply to any battle scenario.

STEP 3 — SPECIFICITY CHECK

Each consequence must reference: the specific beaches (Omaha, Utah), specific commanders (Eisenhower, Patton, Montgomery), specific military units and tactics (DD tanks, bocage hedgerows, the Panzer reserves debate), and specific political dynamics (Churchill's parliamentary position, Roosevelt's election year, Stalin's territorial calculations). If any node could appear in a scenario about Stalingrad or the Battle of the Bulge, it fails the check.`

export const DEMO_TREE: ScenarioTree = {
  input: 'WW2 — what if D-Day failed',
  reasoning_trace: SCENARIO_REASONING,
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
      reasoning_trace: 'This consequence passes the specificity check: it names Saint-Lô, Patton\'s Third Army, the bocage hedgerows, Montgomery vs. Eisenhower\'s strategic debate, De Gaulle\'s Champs-Élysées walk, and the Ardennes counter-offensive. None of these details could appear in a scenario about a different battle. The emotion is "hopeful" because rapid success creates genuine optimism — but the narrative deliberately complicates that hope with the supply line crisis and strategic friction, preventing it from reading as simple triumphalism.',
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
      reasoning_trace: 'This is fundamentally different from Path 1 (rapid advance) because it changes the DEGREE of outcome rather than the speed. The key tension here is the agonizing middle ground — not failure, not success, but a limbo that forces impossible political decisions. I rejected "the Allies slowly grind forward and eventually win" because that is just Path 1 at a slower pace, not a different kind of consequence. The stalemate scenario is specifically grounded in the historical debate about Panzer reserve timing — Rommel wanted them at the beaches, Rundstedt wanted them inland, and Hitler compromised by keeping them under his personal control. In this timeline, that compromise breaks differently.',
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
      reasoning_trace: 'This path changes the TOTALITY of the outcome — not stalemate but complete withdrawal. It is specifically anchored to Eisenhower\'s actual drafted letter ("our landings in the Cherbourg–Le Havre area have failed to gain a satisfactory foothold and I have withdrawn the troops"), the specific technical failures that nearly happened historically (DD tanks sinking, naval bombardment missing at Omaha), and the specific political contexts (Churchill\'s parliamentary vulnerability, Roosevelt\'s 1944 election calendar). The "sobering" emotion is distinct from con_2\'s "anxious" because this is not about uncertainty — it is about the weight of a definitive failure and its long shadow. The most important detail is the post-war implication: without a Western front, the entire NATO/Marshall Plan framework that shaped our world simply does not exist.',
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
  reasoning_trace: `STEP 1 — JOURNEY ANALYSIS

The journey so far traces a clear arc: from the root scenario ("what if D-Day failed") through "The Normandy Gamble" pivot to "The Great Retreat" — a total Allied withdrawal from the beaches. The emotional trajectory has moved from the tension of the gamble to the devastation of complete failure. The user has chosen to explore the political rather than the military consequences of that failure, which tells me they are interested in how military outcomes cascade into civilian leadership crises.

The key actors at this stage are: Churchill (whose entire political identity is built on "we shall never surrender"), the Conservative backbenchers (who have supported him through loyalty but whose patience has limits when constituents' sons die), Lord Halifax (who historically represented the negotiation faction and nearly became PM instead of Churchill in 1940), Roosevelt (who loses his most critical ally), and Stalin (who watches from the East with strategic patience).

The unresolved tension is this: Churchill's defiance — the very quality that saved Britain during the Blitz — becomes his political vulnerability when that defiance leads to catastrophic losses.

STEP 2 — PLAUSIBILITY REASONING

I am rejecting two obvious outcomes: "Churchill stays in power but weakened" (this avoids the interesting question — the user specifically asked about a political crisis, not a dip in approval ratings) and "Britain immediately surrenders to Germany" (this is historically implausible — even Halifax's faction wanted negotiation, not capitulation, and the British public would not have accepted outright surrender).

The most interesting tension is the irony: the man who saved Britain through stubbornness is destroyed by that same stubbornness. And the genuinely surprising element is who replaces him — not a Labour figure but Lord Halifax, a man from Churchill's own party, representing the "reasonable" wing that Churchill had spent years fighting against.

STEP 3 — SPECIFICITY CHECK

Every detail traces to this specific journey: the vote of no confidence (a real British parliamentary mechanism, not just "political trouble"), Lord Halifax by name (a real historical figure who nearly became PM in 1940), the Sweden channel (historically used for back-channel diplomacy), and the specific cascade effects on Roosevelt, De Gaulle, and Stalin. None of this could appear in a scenario about, say, the Battle of Stalingrad.`,
  children: [
    {
      id: 'branch_1_1_child_1',
      whatif: 'Negotiations lead to a divided Europe under Nazi influence',
      title: 'The Bitter Peace of 1945',
      summary:
        'Halifax negotiates an armistice that leaves Nazi Germany controlling continental Europe. Britain survives, but the moral cost is staggering.',
      narrative:
        "The peace terms are harsh but not catastrophic for Britain itself. Germany keeps its continental conquests, Britain keeps its empire, and an uneasy peace settles over Europe.\n\nBut the human cost is beyond calculation. Millions of Jews, Roma, and political prisoners remain in camps that Britain has now tacitly accepted by signing a peace that leaves them in place. The moral stain is one that no amount of imperial pageantry can wash away.\n\nIn the House of Commons, Halifax speaks of 'pragmatic realism' and 'saving British lives.' Across the Atlantic, Roosevelt — who loses his re-election bid in November 1944, blamed for the Normandy disaster — watches as the architecture of the post-war order he envisioned crumbles before it can be built.",
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
        "With no Western opposition on the continent, the Soviet war machine grinds through Germany alone. Berlin falls entirely to the Red Army, and there is no handshake at the Elbe — because there are no Americans or British on the Elbe.\n\nStalin's territorial ambitions, unchecked by any Western presence, extend to the Atlantic coast. France, Belgium, the Netherlands — all fall under Soviet 'liberation' that quickly becomes occupation. The Iron Curtain does not fall across the middle of Germany. It falls along the English Channel.\n\nBritain, having just negotiated peace with one totalitarian power, now faces another across twenty miles of water. The atomic bomb, when it comes in August 1945, belongs only to the Americans — but the Americans, burned by Normandy and the 1944 election backlash, are in no mood for another European adventure.",
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
