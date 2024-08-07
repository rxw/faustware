---
layout: post
title: "The revenue equivalence theorem"
date: 2022-01-01
tags: [math, economics, game theory]
---

This semester I took a class called Market Design. It's an economics class that focuses on different rules for markets and their outcomes under equilibrium. One of the more interesting things I learned was something called the revenue equivalence theorem. It states the following: any mechanism that results in the same outcomes also has the same expected revenue (there are certain other conditions but they are pretty much always met).

For example, let's say that we want to auction an item and we have two different ways of creating the auction: One is a first price auction, meaning that the highest bidder wins and pays his bid. The other one is a second price auction, meaning the highest bidder wins and pays the amount of the second highest bid. In both of these cases we can expect the amount paid to be the same! But how? It seems like the second price auction would result in a lower amount being paid since the winner is paying the second highest bid, whereas in the first price auction the winner pays his own bid: the highest bid. This is actually because the optimal bidding strategies differ for the first and second price auction.

## Bidding strategies

Thankfully, to prove that the bidding strategies for both of these auctions differ is not too hard, especially if you have some prior knowledge. Let's say that we have two agents in our auction: 1 and 2 with valuations $v_1$ and $v_2$ such that $v_1 > v_2$.

### Strategy for second price auction

Let's say that as $v_2$ you choose to bid $b > v_2$. If $b < v_1$ you still don't win the auction, the outcome is the same. If you bid $b > v_1 > v_2$, you win the auction and get the item, but at a price $v_1$ which is greater than your valuation of the item. Now what if you bid $b < v_2$, in this case the outcome is the same, you don't win the item (while at the same time decreasing your chances of getting it for a price you would have paid). Therefore in a second price auction the optimal strategy is to simply bid your valuation of the item.

### Strategy for first price auction

For a first price auction I will simply prove that bidding your true valuation is not the optimal strategy. Lets say that $v_1 >> v_2$. And we have the following bids $(b_1, b_2) = (v_1, v_2)$. As $b_1$ you are going to win the auction, but you are incentivized to decrease your bid since you could still win the auction with bid $v_2 + \epsilon$, therefore $(b_1, b_2) = (v_1, v_2)$ is not a Nash equilibrium.

As you can see the strategies for these different types of auctions differ, in fact in the first price auction you are incentivized to bid lower than your true valuation and for this reason the expected revenue is the same. The proof for this is a little longer so I won't go through it but this gives a solid intuition.
