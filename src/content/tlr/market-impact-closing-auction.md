---
title: "The Cost of Being Noticed: Market Impact and the Closing Auction"
subtitle: "A lesson on how the very act of trading moves prices against you, why the last few minutes of the trading day have become the most contested minutes in modern markets, and what a simple piece of algebra can teach a statistician about optimal execution."
abstract: >-
  Every order leaves a footprint. A statistician trained to think of price as an exogenous stochastic process
  must eventually confront an uncomfortable fact: when the order is large enough, the trader is not merely
  observing the price, but partially causing it. This article introduces market impact, the systematic cost of
  moving size through markets. It builds a minimal analytical model to derive an optimal order size from first
  principles, and then turns to a special and increasingly important trading venue where impact behaves
  differently from the rest of the day: the closing auction. Along the way we decompose impact into an
  instantaneous component and a decaying one, examine how the timing of an order within the auction call
  changes the split between the two, and close with a methodological reminder that belongs on any empirical
  scientist's desk: a single elegant result, however persuasive, is not evidence until it has been tested.
date: 2026-08-15
tags: [Market microstructure, Quant finance, Optimal execution, Statistical modelling, Closing auction]
---

## An inconvenient assumption

Most introductory treatments of trading strategy quietly assume that the trader is a price-taker: an order is submitted, and it executes at "the" market price, as though the market were an inert vending machine indifferent to how much has just been requested of it. This assumption is convenient — it is what allows a return signal $\alpha$ to be converted directly into expected profit, $\alpha \cdot x$, for an order of size $x$, and it is also false the moment $x$ stops being negligible relative to the liquidity available.

Real markets respond to the orders sent into them. A buy order consumes the best-priced sell orders resting in the book and, in doing so, pushes the price a trader would pay for the *next* unit slightly higher; a sell order does the symmetric thing to the downside. This response is what practitioners call **market impact**: the change in the execution price attributable not to new information reaching the market, but to the mere presence of one's own order.

## What market impact is, formally

Four regularities recur across essentially every empirical study of market impact, and they are worth stating plainly before any model is built:

> Impact is the deviation of the realised execution price from the price that would have prevailed absent the order.

> A buy order moves the price up; a sell order moves it down — impact carries the sign of the trade.

> Larger orders produce larger impact.

> Impact is an increasing function of *participation* — the size of an order relative to the liquidity available to absorb it, typically expressed as a fraction of average consecutive (or daily) volume, ACV.

The simplest functional form consistent with these four facts is linear in participation:

$$
\text{impact}(x) = \lambda \cdot \frac{x}{\text{ACV}}
$$

where $x$ is the signed order size and $\lambda$ is a market-specific sensitivity coefficient. It is a deliberately crude approximation — the empirical literature on market impact has, since Almgren and Chriss's foundational work on optimal execution, generally favoured a concave (square-root-like) relationship between size and impact rather than a strictly linear one — but the linear form is the right place to start a first-principles argument, precisely because its simplicity keeps the mechanism visible.

<!-- FIGURE: "Impact grows in proportion to participation" — price impact (%) vs participation rate (order size / ACV), from -20% to +20%. Add as ![Impact grows in proportion to participation](/img/impact-participation.png) -->

## Why a data scientist should care

There are three distinct reasons a linear-impact model, however toy, earns its keep.

First, impact is a cost that is actually paid, not a modelling nicety. It erodes the spread between a signal's theoretical return and the return a strategy can realistically capture, and it does so asymmetrically: the more conviction a strategy expresses through size, the more that conviction taxes itself.

Second, any backtest that ignores impact is systematically optimistic. A strategy that looks profitable when every fill is assumed to occur at the pre-trade mid-price can be reliably expected to look worse (sometimes catastrophically worse) once execution costs are folded in. Impact modelling is therefore not a peripheral concern for the trading desk; it belongs inside the validation loop of any strategy that trades at meaningful size, in the same way that a held-out test set belongs inside any predictive model.

Third — and this is the constructive part — an impact model does not merely subtract a cost. It tells you the *size at which further trading stops paying for itself*, which turns an otherwise open-ended question ("How much should I trade?") into a solvable optimisation.

## A toy model of optimal order size

Suppose a signal $\alpha$ predicts the expected return per unit traded, so that the naïve expected profit of an order of size $x$ is $\alpha \cdot x$. Now let that same order pay for the impact it generates. Under the linear impact model above, and adopting the simplifying (and conservative) convention that the entire order is charged the impact incurred by its last unit, expected profit net of impact becomes

$$
\mathbb{E}[\text{P\&L}] = \alpha x - \lambda \frac{x^2}{\text{ACV}}
$$

This is a concave quadratic in $x$: profit rises while the marginal gain from the signal outweighs the marginal cost of impact, peaks, and then falls as the order grows large enough to trade away the very edge it was meant to capture. Differentiating and setting the result to zero gives a closed-form optimum,

$$
x^* = \text{ACV} \cdot \frac{\alpha}{2\lambda}
$$

a strikingly simple result: the optimal order size scales linearly with available liquidity and with the strength of one's conviction, and inversely with how expensive the market is to trade in.

To make this concrete, take an illustrative $\text{ACV} = \$10\text{M}$, a modest alpha of $\alpha = 0.001$ (10 basis points of expected edge) and $\lambda = 0.01$. The formula returns an optimal order of $\$500{,}000$ — about 5% of daily volume. The chart below shows why straying far from that point is costly in both directions, but especially to the right of it: past the optimum, every additional dollar traded is now, in expectation, *destroying* value rather than creating it.

<!-- FIGURE: "Beyond a point, a bigger order destroys value" — expected P&L (USD) vs order size, ignoring impact vs net of impact, optimum at 500k. Add as ![Beyond a point, a bigger order destroys value](/img/impact-optimal-size.png) -->

The lesson generalises well beyond this toy model. Whatever the true shape of the impact function — linear, square-root, or something estimated directly from data — the same qualitative structure holds: a signal of fixed strength implies a *finite* optimal size, and pushing past it is not merely inefficient but actively value-destroying. Sizing a position is therefore not a separate decision from generating the signal that motivates it; the two are coupled through the cost of execution.

## A market within the market: the closing auction

Everything above describes trading during continuous session — the familiar limit order book, matching incoming orders against resting ones in real time. But the last few minutes of the trading day on most exchanges work by an entirely different mechanism: the **closing auction**.

A closing auction is a short call phase, typically three to ten minutes, depending on the venue, during which no trades occur. Instead, participants submit and revise orders that accumulate in an indicative order book. At the end of the call, the exchange computes a single price: the one that maximises the volume that can be matched. Every executable order is then filled at that one price, the official closing price, regardless of the price each participant originally indicated. This "one clearing price for everyone" property is the defining feature that separates an auction from continuous trading, where each trade can, in principle, occur at its own price.

The closing auction is no longer a footnote to the trading day. In European equity markets, roughly a fifth of daily volume now trades at the close — a share that has grown steadily for years, driven by benchmark-tracking funds, index rebalancing flows, and a general institutional preference for a price that is, by construction, harder to game than a single continuous-session print.

Empirically, impact paid at the close also tends to be lower than impact paid during continuous trading for comparable size — which is precisely why the auction has become a magnet for volume, and precisely why it deserves a model of its own rather than the continuous-trading model applied by extension.

## Decomposing impact: the jump and its decay

Within the auction call, price impact is not a single number but the sum of two opposing forces. Submitting a market order shifts the indicative auction price immediately — an **instantaneous impact** — but because the call phase lasts several minutes, the rest of the market has time to react and partially reabsorb that shift before the auction actually prints. That reabsorption is the **decay**, and what survives it by the end of the call is the **impact on close**: the only component that is actually paid, since it alone affects the price every participant is filled at.

<!-- FIGURE: "Most of the instantaneous jump fades before the print" — instantaneous impact, decay (reversion) and net impact on close (bps) vs order size (% of daily volume). Add as ![Most of the instantaneous jump fades before the print](/img/impact-decay.png) -->

The empirical picture (this is the finding reported in the closing-auction impact literature published by exchange research groups, notably work associated with Euronext) is that decay does most of the work: a large majority of the initial instantaneous jump is mitigated by the time the auction concludes, so that the impact ultimately realised on the closing price is only a modest fraction of the impact the order appeared to cause the instant it was submitted. Both the instantaneous jump and the decay that follows it grow with order size, and — this is the operationally relevant point — they do not grow at the same rate, so the *net* impact on close increases roughly linearly with size even though neither of its two components does so in isolation.

## Timing inside the call: early orders, quieter footprints

If impact within the auction is the net result of a jump and a decay, then *when* an order is submitted during the call should matter as much as *how large* it is — and it does, in a direction that is not entirely obvious in advance.

Orders submitted early in the call face a thinner indicative book, fewer competing orders have arrived yet, and so their instantaneous impact tends to be larger. But an early order also has more time left in the call for the rest of the market to observe it and respond, which means it is also subject to more decay. Orders submitted late in the call face the opposite trade-off: a fuller book cushions the instantaneous jump, but there is little time left for that jump to fade before the print.

The empirical net effect favours patience, or more precisely, favours declaring intent early: orders submitted earlier in the call tend to end up with a *smaller* net impact on the closing price than economically identical orders submitted late, because the extra decay they earn by arriving early more than offsets the extra instantaneous impact they pay for arriving into a thinner book. Late submissions get the opposite bargain — a gentler initial jump, but almost no time for the market to unwind it — and end up paying more, not less, on net.

This is a genuinely counter-intuitive result for anyone whose intuition about impact was formed in continuous trading, where "wait and see" is often the safer default. Inside an auction call, the clock itself is part of the impact model.

## A methodological coda

It is worth pausing on how this last result was reached, because the reasoning matters as much as the conclusion. A finding of this kind typically originates in a single empirical study, built on one exchange's data, over one sample period, using one particular impact decomposition. That is a perfectly legitimate way to generate a hypothesis — and a thoroughly insufficient basis on which to trade a model.

Three questions are worth asking of any impact result before it is trusted, closing-auction or otherwise. Does it replicate out of sample — a different venue, a different asset class, a different year, ideally a different market regime? Is the effect stable enough in magnitude to survive the transaction costs and slippage of actually acting on it, or does it live entirely inside the standard errors? And once validated, what is the concrete change in behaviour it justifies — submitting earlier, splitting an order differently across the call, or simply resizing it using something closer to the optimum derived in the toy model above? An empirical regularity that cannot answer that last question is interesting; one that can is useful.

## Closing thought

Market impact sits at an unusually productive intersection for anyone trained in statistics: it is, at once, an optimisation problem, a regression problem, and a lesson in the limits of controlled experimentation — since the trader, unlike the analyst in most other applied settings, cannot observe the counterfactual price that would have prevailed had they not traded at all. Modelling it well requires the same discipline this blog keeps returning to: start from a model simple enough to derive by hand, understand exactly which assumption makes it simple, and only then reach for the data that will tell you where that assumption breaks.

---

*Further reading: for the empirical decomposition of closing-auction impact into instantaneous and decay components discussed above, see the exchange research literature on closing-auction execution, including work published by Euronext under the title "Better trading at the close thanks to market impact models."*

<https://www.euronext.com/en/news/better-trading-close-thanks-market-impact-models>
