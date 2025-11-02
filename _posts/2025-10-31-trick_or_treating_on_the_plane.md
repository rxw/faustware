---
layout: post
title: "Trick-or-treating on the plane"
date: 2025-10-31
tags: [math, planes, halloween]
---

*Or: making inherently quadratic things fast*

Let’s perhaps unrealistically suppose that you were to leave the East Village and spend Halloween evening on a plane going from NYC to Orlando, Florida. Would you be able to trick-or-treat on said plane?

If you were the only person trick-or-treating on the plane, you could just walk around from row 1 to row 33 (this is a Boeing 737, and I’m on the last row: 33), asking each seat (A–C then D–F) on each row for a trick or a treat. That would only take you about 10 seconds per seat. That’s

$$33 \times 6 \times 10 = 1{,}980 \text{ seconds} \approx 33 \text{ minutes}.$$

That’s about how long we’d expect for it to take the flight attendants to distribute snacks and drinks if they used a single cart. If we wanted to let all 198 passengers do that sequentially, it wouldn’t be possible, since the flight is only ~3 hours, not 99.

But airlines have figured out that they can be smarter about this (re: distributing drinks and snacks), so they use **two carts** instead of one: one coming from the front and one from the back, effectively cutting the time in half, taking ~10–15 minutes to distribute drinks. Inspired by them, what if we allowed multiple people to trick-or-treat at the same time?

## First naive speedup

People on the same row can just trick-or-treat with each other while seated. So what if we allowed an entire row to walk down the aisle at once? That would cut the time by a factor of 6 — so we’d go from ~99 minutes to ~16.5 minutes for one full traversal. (Still ~5× longer than the duration of the flight if everyone did it.)

## Let the seated people “treat back”

Okay, what if while some people are walking down the aisle trick-or-treating, the people sitting can also trick-or-treat *back*?

Example: the people from row 1 are trick-or-treating down the aisle, and all the rows ask them for a trick or a treat. That means future rows never have to go back to row 1. This is also true for row 2, and it implies that row 3 doesn’t need to walk to rows 1–2, row 4 doesn’t need to walk to rows 1–3, etc. Lucky for me, row 33 doesn’t even need to stand up to receive all of their goods.

How long would this take? Looking from the back forward is simpler: row 33 takes 0 time (everything comes to them). Row 32 only has to walk to row 33, so that’s $$6 \times 10 \times 1 = 60 \text{ seconds}$$, and so on. The total time looks like:

$$
\sum_{n=1}^{32} 60n
= 60 \cdot \frac{32 \cdot 33}{2}
= 60 \cdot 528
= 31{,}680 \text{ seconds}
\approx 528 \text{ minutes}
\approx 8.8 \text{ hours}.
$$

We’ve cut the time by about half, but it’s still ~3× longer than the duration of the flight — though ~10× less than our initial estimate.

This problem is inherently quadratic (which our summation above also hints at). Every person must talk to every other person: for $$N$$ people, this is $$N^2$$ interactions. While we can get speedups from clever scheduling, as long as this requirement holds, we can’t do *that* much better. Such constant-factor improvements become negligible for larger $$N$$ compared to solutions that simply do **less work**. This illustrates why asymptotic time complexity matters in computer algorithms.

## Parallelizing more à-la drink cart

A solution closer to what the drink carts do is to allow row 1 and row 33 to start trick-or-treating at the same time. As before, the seated people trick-or-treat back, and walkers trick-or-treat as they pass. When they meet in the middle, they trick-or-treat with each other.

This implies that row 1 must walk 31 rows (2–32) and row 33 must walk 31 rows (32–2). Then row 2 and row 32 trick-or-treat in parallel, meeting in the middle, each only traversing 29 rows (3–31). This continues inward, so the walking distances are:

$$31,\ 29,\ 27,\ \dots,\ 1.$$

These happen in parallel, so only the longest segment in each symmetric pair counts. The total number of rows walked is:

$$1 + 3 + 5 + \dots + 31 = 256.$$

But since the front and back traverse these distances simultaneously, the effective traversal time is halved, giving only **128 row-traversals’ worth of time**. At ~1 minute per row (6 seats × 10 s), that’s:

$$128 \text{ minutes} \approx 2\text{ hours } 8 \text{ minutes}.$$

Ample time for everyone to trick-or-treat after takeoff and before starting final descent.
