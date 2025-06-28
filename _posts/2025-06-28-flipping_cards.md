---
layout: post
title: "Flipping cards, counting groups"
date: 2025-06-28
tags: [math]
---

I own a set of Carnegie Mellon University playing cards despite never having been to Pittsburgh. My friend gifted me them when he moved to Amsterdam. These cards are special for that reason, but also in that the face of the card is not symmetrical, unlike normal playing cards. Here's what the ace of spades looks like:

![non symmetrical ace of spades](/images/ace_of_spades.png)


I was looking through the cards this morning and it bothered me that, due to their asymmetry, they weren't all facing the same direction. In my classic autistic fashion I arranged them such that they were. While doing so I noticed that there were times when multiple cards were flipped in a row, and so I could grab those $N$ cards and flip them together. This lead me to think of a simple problem with no immediately clear solution: Let's say you have a set of cards like this, some are facing the wrong way -- they're rotated uniformly at random -- and sometimes they are in a row and you can rotate them all at once, which counts as a single rotation. On average, how many rotations would you expect to have to do?

My first intuition is to think about this sort of problem like a binary string: let's label a card as 1 if it's facing the correct way, and 0 if it's not. The first card determines the "correct" rotation. Here's how I'm picturing it:

$$ 10100111010111111000.. $$

That string would be 52 digits long. The first digit would always be 1, hence we only care about the following 51 digits.

Starting with a simple question is usually helpful. How many cards would we expect to have an incorrect rotation _at all_, i.e. how many $0$'s do we expect? The answer to that is simple and intuitive: given that they are rotated uniformly at random, we would expect half of them to be facing the wrong way, that means that we'd expect to see $E[Z] = \frac{51}{2} = 25.5$ 0's, and if we were only allowed to rotate the cards individually we'd expect to have to do that many rotations.

But this blog post is more interesting, because we're allowed to rotate them together whenever they do happen to be in a row, so the question we want to ask now is how many _groups_ (a group being defined as one 0 or more in a row) do we expect? Another question that may follow is: what is the average size of a group? Well, the probability of seeing a $0$ after we've just seen one is $\frac{1}{2}$, the probability of seeing 3 would be $\frac{1}{4}$ and so on. We quickly realize that the average size of a group is $E[S] = \sum_{i = 1}^{51} \frac{1}{2^n} n \approx 2$.

So if the average size of a group is 2, and we expect $25.5$ of the cards to be rotated, may be we would expect to have $\frac{25.5}{2} = 12.75$ groups, and do that many rotations. I then asked gpt to write a monte carlo simulation:

```python3
import random

trials = 100000
total_groups = 0

for _ in range(trials):
    s = ''.join(random.choice('01') for _ in range(51))
    groups = sum(1 for i in range(51) if s[i] == '0' and (i == 0 or s[i-1] != '0'))
    total_groups += groups

print(total_groups / trials)
```

This gives us 13, the real average number of groups. It's pretty close, but not quite the 12.75 we got from our naive calculation. The problem lies in the fact that the number of groups and the average group length are **negatively correlated**. This makes sense: the more groups you have, the shorter they are likely to be, or vice versa. Simply dividing these two expected values assumes independence and ignores this negative covariance.

To get to the actual answer we can leverage indicator variables and [Linearity of Expectations](https://www.youtube.com/watch?v=0IJFBMIU6x4). Let us define an indicator variable $I_i$ that is $1$ if a position $i$ in our string $X$ starts a 0 group, and is $0$ otherwise. A 0-group starts at $i$ when $X_i = 0$ and $X_{i-1} = 1$ (this is always true for $i = 1$). So we have $E[I_1] = P(X_1 = 0) = \frac{1}{2}$ for the first group, and $E[I_i] = P(X_i = 0, X_{i-1} = 1) = \frac{1}{2} \cdot \frac{1}{2} = \frac{1}{4}$ for the $i > 1$ groups. That means $E[G] = \frac{1}{2} + 50 \cdot \frac{1}{4} = 0.5 + 12.5 = 13$ -- exactly the result of our monte carlo simulation.


_When describing the problem this morning, my friend encouraged me to write about it. So this post is dedicated to her._

