---
layout: post
title: "On the most important person in history"
date: 2026-07-13
tags: [economics, networks]
---

I recently watched a video called *Wikipedia’s Biggest Mystery*, which begins with one of those questions that seems profound until you try to formalize it: who is the most important person in history?

Apparently, researchers at MIT had attempted to answer this by scanning Wikipedia and considering various methods of ranking historical figures. Eventually they settled on a wonderfully simple criterion: count how many languages each person’s Wikipedia article has been translated into.

The top three were:

1. Jesus Christ
2. Barack Obama
3. Corbin Bleu

Corbin Bleu, for those whose memories have been mercifully spared, was a supporting actor in a movie about a high school musical.

The leading hypothesis is that some unusually dedicated Wikipedia editor developed an obsession with Corbin Bleu and translated his article into an enormous number of languages. This is funny, but also useful. Somewhere between Jesus and Obama, history’s third-greatest man was inserted by the raw, concentrated power of one person with an internet connection and a special interest.

The video is worth watching. But the result also demonstrates the basic problem with naive ranking functions: every metric is a theory of the world wearing a fake moustache.

Count translations, and you measure translations. Count page views, and you get celebrities, serial killers, and whoever died yesterday. Count words, and somewhere an editor will write a 70,000-word article about a regional railway junction in Lower Saxony.

So how do you actually find the most important person in history?

This reminded me of an economics class I took in college called *Networks*, which is funny because only at MIT could you take a class called *Networks* and discover that it belongs to the economics department rather than computer science.

One of the papers we studied was John F. Padgett and Christopher K. Ansell’s 1993 paper, *Robust Action and the Rise of the Medici, 1400-1434*.

The paper asks why the Medici became so powerful in Renaissance Florence. The obvious answer would be that they were the richest family, or the family with the most formal political authority, or perhaps simply the family most willing to have unpleasant things happen to its rivals.

But this was not quite the case.

The Medici were powerful because of their position in the network.

Florentine elite society can be represented as a graph of families connected through marriages, business relationships, political alliances, and patronage. The Medici occupied an unusually central brokerage position. They sat between groups that were otherwise poorly connected to one another. In the language of network theory, they spanned structural holes.

A family that wants to reach another family often has to pass through the Medici.

This is where measures like betweenness centrality become useful. Imagine drawing every shortest path between every pair of families in Florence, then counting how often each family sits somewhere in the middle. The Medici appear again and again. Their power came partly from the fact that information, coordination, favors, and political possibilities passed through them.

They were not simply powerful nodes. They were part of the connective tissue of the system.

This same basic idea appears in another famous centrality algorithm: PageRank.

PageRank was the algorithm at the heart of early Google. A web page was important not simply because many other pages linked to it, but because important pages linked to it. A link from a highly central page counted for more than a link from some forgotten GeoCities shrine to *The X-Files*.

This turned out to be a reasonably good way to organize the internet and, incidentally, helped create a company worth trillions of dollars.

So the obvious idea is: why not do this to history?

Wikipedia already contains an enormous network of people. Every biography links to other biographies. Newton links to Leibniz. Caesar links to Pompey. Marx links to Hegel. Steve Jobs probably links to Bono for some reason.

Take every person with a Wikipedia page. Draw a directed edge whenever one person’s page links to another person’s page. Build one giant historical social graph. Then apply centrality algorithms and see which nodes emerge as the most important.

Conveniently, you can download the entirety of Wikipedia from Wikimedia’s public dumps. So I did the natural thing: downloaded it, had Codex write a parser and the centrality code, filtered out citations and other junk, and ran PageRank.

The result was:

1. Donald Trump
2. Barack Obama
3. George W. Bush
4. Adolf Hitler
5. Bill Clinton
6. Ronald Reagan
7. Franklin D. Roosevelt
8. Joe Biden
9. John F. Kennedy
10. Richard Nixon

This is less a ranking of the most important people in history than the guest list for an extremely cursed presidential dinner.

A simpler weighted-indegree ranking gives:

1. Donald Trump
2. Barack Obama
3. Pope John Paul II
4. George W. Bush
5. Pope Francis
6. Bill Clinton
7. Ronald Reagan
8. Adolf Hitler
9. Joe Biden
10. Elizabeth II

The difference is interesting. The popes appear under weighted indegree but disappear under PageRank. PageRank rewards links from pages that are themselves highly central, producing a recursive rich-get-richer effect. And on English Wikipedia, the already-central political ecosystem is heavily dominated by modern American presidents.

There are several obvious biases here.

First, this is English Wikipedia. The graph therefore reflects the preoccupations of the English-speaking world.

Second, it has an enormous recency bias. Modern political figures accumulate links because modern events are documented with almost pathological granularity. Donald Trump has relationships with thousands of politicians, scandals, lawsuits, elections, books, television programs, cabinet officials, foreign leaders, conspiracy theories, and probably several Wikipedia pages devoted entirely to individual tweets. Aristotle had the disadvantage of living before congressional subcommittees and 24-hour cable news.

So I added two crude corrections: a reward for cross-language representation and a naive recency penalty.

The new top ten became:

1. William Shakespeare
2. Napoleon
3. Abraham Lincoln
4. George Washington
5. Wolfgang Amadeus Mozart
6. Johann Sebastian Bach
7. Adolf Hitler
8. Ludwig van Beethoven
9. Aristotle
10. Charles Darwin

This looks much more respectable. It resembles a list assembled by asking a Western school system which names it has repeated most consistently for the last hundred years.

And that is exactly the problem.

The ranking feels plausible, but I am not sure it captures what I mean by *importance*.

Importance, to me, has something to do with counterfactual force. How different would the world be without this person? How much causal weight did they exert? How many downstream consequences depend, directly or indirectly, on their existence?

On that definition, Shakespeare may be enormously important. But was he more important than Newton? Than Maxwell? Than Haber? Than von Neumann? Than the people responsible for semiconductors, antibiotics, electrification, modern sanitation, or the mathematical foundations of computing?

The world of 2026 is almost incomprehensibly different from the world of 1926. Most of that transformation was not caused by presidents or kings. It came from scientists, mathematicians, engineers, inventors, institutions, and technologies whose effects diffused outward until they became invisible.

The trouble with the Wikipedia graph is that it naturally measures something closer to narrative prevalence.

A person is central when many stories pass through them.

Presidents are linked to wars, elections, legislation, scandals, cabinet members, foreign leaders, spouses, assassinations, speeches, political parties, and one another. Shakespeare is linked to hundreds of plays, films, actors, adaptations, characters, theatres, critics, and cultural works.

But causal influence is not the same thing as narrative density.

A scientist may change the structure of civilization through one discovery, then receive fewer links than a monarch who spent forty years attending weddings.

So perhaps the graph should be altered.

Instead of treating every incoming link equally, we could reward links from downstream concepts: inventions, scientific theories, technologies, laws, religions, institutions, artistic movements, mathematical objects, medical treatments.

A link from *classical mechanics* to Newton should perhaps count differently from a link from a list of British politicians to some nineteenth-century MP.

In other words, we want to move from measuring who appears most often inside history’s stories to measuring who seems to have generated the largest number of things that came afterward.

After adjusting the model in that direction, the ranking becomes:

1. Napoleon
2. George Washington
3. Carl Linnaeus
4. Aristotle
5. Alexander the Great
6. William Shakespeare
7. Abraham Lincoln
8. Isaac Newton
9. Charles Darwin
10. Leonardo da Vinci

This feels closer.

Not correct, exactly. There is probably no correct answer. The phrase *most important person in history* conceals several different questions: most influential, most consequential, most central, most famous, most causally necessary, most difficult to remove from the timeline without producing a radically different world.

But that may be the more interesting result.

The ranking function does not merely discover importance. It defines it.

Ask Wikipedia who the most translated person is, and somewhere Corbin Bleu becomes greater than Caesar. Ask PageRank, and history becomes an endless argument among American presidents. Penalize recency, and the school curriculum reappears. Reward downstream concepts, and scientists, empire-builders, and system-creators begin to rise.
