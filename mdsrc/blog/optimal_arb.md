---
author: tato
title: Optimal arbitrage on constant product liquidity pools
date: 2022-07-24
---
# Optimal arbitrage on constant product liquidity pools

The crypto world brings a new set of rules that create a large and diverse set of opportunities.
For example: the atomicity of transactions lets one borrow millions of dollars with no collateral through
the use of [flash loans](https://docs.aave.com/faq/flash-loans). This is only possible due to the guarantee
that is given to us by smart contracts on blockchains: code is law.


Perhaps one of the most exciting, and most popular, applications of smart contracts has been decentralized
exchanges. These exchanges run as programs on the blockchain and allow one to trade one asset for another through
the use of liquidity pools. These pools can have any two tokens $\alpha$ and $\beta$, and use some mathematical
function to price these two assets according to the amount they have of each. Given this fact, one can imagine a pretty 
trivial scenario: there are 2 decentralized exchanges each of which has a pool for the same 2 assets, trading at
the same rate. At some point, someone makes a trade on one of those pools and the rates become imbalanced. You can 
buy one of these assets at a discount on one pool and sell them for a premium on the other. Hence, you can make a profit.

## But, how much do I buy and sell?
This is the best part! Recall that these assets are priced with some mathematical function such that the marginal price
is increasing. In fact, the most common function is the constant product function, which simply says the following: the 
product of the 2 amounts of assets needs to be constant. For example lets say we have a pool that trades $\alpha$ and
$\beta$, and this pool has $R_{\alpha}$ amount of token $\alpha$ and $R_{\beta}$ amount of token $\beta$. Then the
constant product says the following: $R_{\alpha}R_{\beta}=k$, thus when you trade an amount in of token $\beta$, the 
amount of token $\alpha$ that comes out will be exactly such that the new amounts still multiply to 
$R_{\alpha}R_{\beta}=k=(R_{\alpha} - \Delta_{\alpha})(R_{\beta} + \Delta_{\beta})$ hence
$\Delta_{\alpha} = R_{\alpha} - \frac{R_{\alpha}R_{\beta}}{R_{\beta} + \Delta_{\beta}}$. 

Lets go back to the scenario in which we have two pools $1$ and $2$, where on the first pool we can buy $\alpha$ 
at a discount. Then we want to trade $\beta$ for $\alpha$ on pool $1$ and trade that $\alpha$ for $\beta$ on pool $2$.
Hence we use $\Delta_{1\alpha} = R_{1\alpha} - \frac{R_{1\alpha}R_{1\beta}}{R_{1\beta} + \Delta_{1\beta}}$ as an input
for the second pool. Thus we have 
  
  $$\Delta_{2\beta} = R_{2\beta} - \frac{R_{2\beta}R_{2\alpha}}{R_{2\alpha} + \Delta_{2\alpha}}$$ 
  $$\Delta_{2\alpha} = \Delta_{1\alpha}$$
  $$\downarrow$$
  $$\Delta_{2\beta} = R_{2\beta} - \frac{R_{2\beta}R_{2\alpha}}{R_{2\alpha} + 
  R_{1\alpha} - \frac{R_{1\alpha}R_{1\beta}}{R_{1\beta} + \Delta_{1\beta}}}$$

Where our profit is simply the difference $\Delta_{2\beta} - \Delta_{1\beta}$, thus we want to input the amount of
tokens that maximizes our profit: $\Delta_{1\beta}^{\ast} = \max_{\Delta_{1\beta}} \Delta_{2\beta} - \Delta_{1\beta}$.

Therefore our optimal amount in $\Delta_{1\beta}^{\ast}$ is: 

  $$\frac{\partial}{\partial \Delta_{1\beta}}
  \left( 
  R_{2\beta} - \frac{R_{2\beta}R_{2\alpha}}{R_{2\alpha} + 
  R_{1\alpha} - \frac{R_{1\alpha}R_{1\beta}}{R_{1\beta} + \Delta_{1\beta}}} - \Delta_{1\beta}
  \right) = 0$$ 
  $$\downarrow$$
  $$\Delta_{1\beta}^{\ast} = \frac{\pm \sqrt{R_{2\alpha}R_{2\beta}R_{1\alpha}R_{1\beta}} 
  + R_{1\alpha}R_{1\beta}}{R_{2\alpha} + R_{1\alpha}} - R_{1\beta}$$
