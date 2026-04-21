---
layout: post
title: "Who Wins in AI?"
date: 2026-04-21
tags: [AI, economics]
---

The frontier models are not AGI. This seems worth saying plainly before anything else, because the alternative -- treating every impressive demo as evidence of imminent superintelligence -- leads to a kind of permanent hallucination about what's actually happening. There are limitations that appear structural to the LLM paradigm, not incidental, not fixable with scale alone. And yet. You can sit with Claude or GPT for an afternoon and come away with the quiet, slightly vertiginous sensation of having glimpsed something from the future. The models are extremely smart and extremely dumb in a distribution that maps onto no prior conception of intelligence. They are also, increasingly and unambiguously, useful.

Anthropic's projected annual revenue recently exceeded thirty billion dollars, surpassing OpenAI's. People are, as they say, putting their money where their mouth is.

Though it is worth noting that some fraction of this money is being put there by procurement managers and executives who have decided, top-down, that their companies will be AI companies now. As someone employed at one of Anthropic's largest recent customers, I can report that the ROI on the marginal Opus 4.6 token after the sixtieth trillion is, let's say, speculative. But some percentage of it has to be real. I've experienced it myself. And one can easily imagine revenue climbing into the hundreds of billions, even trillions, if the models keep improving.

But revenue, of course, is not profit. What matters is how much you keep.

---

## The Economics

Inference -- actually running a trained model -- is cheap. Margins of 90% on inference have been floated, and this is not entirely crazy. Training is where the money disappears: the enormous, multi-billion-dollar runs that produce each new generation. The whole business turns on whether the labs can slow the cadence of frontier training, amortize what they already have, and convert the model stack into an annuity.

That depends on pricing power. The relevant theory is standard: for a firm with market power, the optimal markup satisfies the Lerner condition,

$$\frac{p - MC}{p} = \frac{1}{|\varepsilon|}$$

where $p$ is price, $MC$ is marginal cost, and $\varepsilon$ is the price elasticity of demand. High margins require inelastic demand: users who will pay regardless of price because the alternative is worse.

Consider a frontend engineer whose task takes $X$ hours without the model and $Y$ hours with it, valued at 200 dollars per hour. The value created is

$$V = 200(X - Y).$$

If the task consumes $N$ tokens, willingness to pay per token is

$$z = \frac{V}{N} = \frac{200(X-Y)}{N}.$$

Now suppose tasks are heterogeneous. The hours saved, $S = X - Y$, are exponentially distributed with mean $\bar{S}$ -- a tractable assumption that captures the fact that some tasks are trivially improved by AI and others are transformed. Token usage is roughly constant at $N$ within a task class. Then $z$ is exponential with mean

$$\bar{z} = \frac{200\bar{S}}{N},$$

and demand at token price $p$ -- the share of tasks whose value exceeds cost -- is

$$Q(p) = M\, e^{-p/\bar{z}}.$$

The implied elasticity is

$$\varepsilon(p) = \frac{dQ}{dp}\cdot\frac{p}{Q(p)} = -\frac{p}{\bar{z}}.$$

Substituting $\bar{z} = 200\bar{S}/N$ and applying the Lerner condition, we recover marginal cost:

$$MC = p - \frac{200\bar{S}}{N}.$$

For Opus 4.6 at a blended rate of roughly 6 dollars per million tokens, a task consuming 20 million tokens, and a mean time-saving of $\bar{S} = 0.4$ hours (twenty-four minutes), this gives $MC \approx 2$ dollars per million tokens, implying margins near 67%. That is close to numbers Dario Amodei has cited publicly.

Under duopoly the markup equation gets halved: margins fall toward 33%. Under oligopoly they compress further -- 22%, 16%, 13% -- converging toward the competitive outcome. Today's AI coding market looks roughly like a duopoly; Opus and GPT are interchangeable for most tasks, which is why 33% is probably close to the present reality. The exact numbers can move around, but the shape of the business is hard to miss: revenue only turns into money if demand stays stubbornly inelastic.

---

## Two Futures

The grim version: model improvements continue to shrink, distillation techniques mature, and smaller players train frontier-comparable models for a fraction of the cost. Competition intensifies. Margins race toward zero. Training and serving LLMs becomes, structurally, a low-margin infrastructure business. Trillion-dollar revenues with near-zero free cash flows imply valuations bounded by asset values, not earnings. The labs will have spent a decade conducting the most expensive charity drive in history.

There is a related but distinct question about whether the biggest, most expensive models will even remain the dominant choice. GPT-5 Pro exists; it has reportedly made genuine progress on open problems in combinatorics. I don't know anyone using it in their day-to-day coding workflow. They use regular GPT. The frontier may keep advancing while everyday users happily anchor at the level that was frontier eighteen months ago, where competition is fierce and margins are thin.

The optimistic version requires that the labs maintain pricing power, which requires that they maintain meaningful differentiation between themselves and everyone else -- and that this differentiation persists faster than it can be replicated, distilled, or regulated away. The historical record of software moats suggests this is hard. The historical record of AI progress over the last three years suggests the rate of replication is accelerating, not slowing.

---

## Compute

If the model itself becomes a commodity, value migrates to whoever owns the compute to run it. The AI labs discovered something close to an inexhaustible resource and built their pipes to extract it. But the pipes belong to Nvidia. The data centers belong to Microsoft and Amazon. The physical capital required to run inference at scale -- the fabs, the power infrastructure, the specialized chips -- is not something you can distill. You cannot compress a semiconductor fab into a smaller semiconductor fab and run it on a Mac mini.

The economics here are genuinely constrained in a way that software economics often aren't. Chips are rivalrous. Power is rivalrous. The physical world, despite the best efforts of several San Francisco companies to convince us otherwise, remains physical. This may be where value ultimately accretes -- not in the weights, which can be copied, but in the infrastructure required to run them fast enough to matter.

---

## Regulation

One path the major labs might plausibly pursue: convince governments that their technology is so powerful and so dangerous that only a small number of licensed entities should be allowed to develop or deploy it. The "we are building something that could kill everyone, please stop us" rhetorical posture that Dario Amodei has adopted in various public fora could be read entirely sincerely, and probably should be. It could also, in a less charitable framing, be read as the opening move of a regulatory capture strategy: the same maneuver that incumbents in finance, pharmaceuticals, and energy have used for a century to crystallize temporary market leadership into permanent structural advantage.

Whether this works depends on whether regulators can be persuaded fast enough, and whether the underlying technology cooperates. A Gemma 4 running on a Mac mini that performs respectably on most tasks is a fairly compelling argument that the regulatory perimeter, if it comes, will be leaky. You can regulate who trains frontier models. It is considerably harder to regulate who runs them.

---

## So Who Wins?

Not the labs. Or at least: probably not, and the structure of the problem tells you why.

The labs are caught in a particularly unpleasant bind. Their value proposition rests on staying ahead of a frontier that, by its nature, diffuses. Every technique they develop gets published, studied, and eventually replicated at lower cost. Every capability that once required Anthropic's best model becomes, within eighteen months, available in something you can run locally. The knowledge that makes their models good is, in the long run, non-excludable -- and a business built on non-excludable knowledge is not really a business, it's a research institution that has temporarily convinced the market it's something else.

The training cost argument cuts both ways. Yes, the labs could stop their expensive training runs and harvest margins on existing models. But the moment they do, they've conceded the frontier -- and the frontier, while it exists, is the only thing keeping the duopoly intact. The optimal strategy and the sustainable strategy are in direct tension.

Regulation might save them, but regulatory capture at the speed required would be historically unprecedented, and the technical reality is working against it. You cannot easily restrict a capability that increasingly runs on consumer hardware.

Which leaves compute. The physical infrastructure -- the GPUs, the power contracts, the purpose-built data centers -- is genuinely hard to replicate, genuinely rivalrous, and genuinely upstream of everything the AI economy requires. Microsoft, Amazon, Google, and Nvidia are not glamorous answers. They are not the companies whose names appear in the breathless magazine profiles about the people building god. But they are sitting on the pipes through which all of this flows, and pipes, historically, are where the money is.

The labs built the discovery. Someone else will own the delivery. This is not a new story. It is, in fact, the oldest story in technology -- and it tends to end the same way.
