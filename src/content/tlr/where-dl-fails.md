---
title: "Where DL Fails"
subtitle: "Survival analysis & geostatistics for interpretable house-pricing modelling"
abstract: "A project built on top of Zillow's Zestimate challenge, but not really about beating Zestimate. I wanted to understand why it was wrong where it was wrong, and along the way I traded some accuracy for something I cared about more: being able to explain why some homes sell faster than others."
date: 2025-06-15
tags: [Kriging, Survival analysis, Deep Survival Nets, Interpretability]
---

## The question I actually cared about

Zestimate is Zillow's AI-driven valuation model — the number you see next to a listing that guesses what a house is worth. It's good, but not perfect, and its error has a name: logerror, defined as $\log(\text{Zestimate}) - \log(\text{SalePrice})$. Most people treat that error as noise to minimize. I got more interested in a different question: is the error actually noise, or does it follow a pattern? And if it follows a pattern, what does that pattern tell us about *why* houses sell the way they do — something a black-box deep learning model will happily predict but never explain.

That's the thread running through the whole project: trading some raw predictive accuracy for models that could actually answer "why."

## The data: 2.9 million homes, one very messy error term

The starting point was Zillow's Zestimate dataset from the Kaggle Zillow Prize — 2.9 million property records, 58 variables. After keeping only sold properties with a valid logerror and cleaning up the mess (columns with over 80% missing values dropped, medians/modes imputed, logerror outliers outside [-0.4, 0.4] excluded to keep training stable, rows with missing geolocation or malformed transaction dates dropped), I was left with roughly 125,000 usable observations.

Even at this early stage, patterns started to show up that a single accuracy number would have hidden completely:

- Zestimate tends to overestimate home values on average.
- Errors aren't spread evenly — they cluster in suburban and rural areas with low data density.
- Older and larger homes come with higher error rates.
- Single-family homes are the most stable and accurately predicted category.

## First pass: linear models, and where they broke

I started simple, on purpose: linear regression, for the interpretability. It performed modestly — it could tell me which features mattered (square footage, year built, location) but it couldn't capture the non-linear relationships that clearly existed in the data. Adding polynomial terms for square footage and year built helped a little — a marginal bump in RMSE and R² — but the bias didn't go away, especially at the edges: peripheral zones and atypical properties (very old, very large) kept getting mispredicted.

This is usually the point where people reach for a deep model and let it eat the non-linearity. I didn't want to do that yet — I wanted to know *what kind* of non-linearity I was dealing with first.

## Geography was the missing variable

The next step was checking whether logerror had spatial structure — whether the model's mistakes were geographically clustered rather than random. They were, clearly. Errors were higher in low-density or semi-rural regions, likely because there simply weren't enough comparable sales nearby for Zestimate to anchor on. Urban cores and well-sampled neighborhoods, by contrast, showed lower and more consistent errors — the model generalizes better where it has more to learn from.

Once that spatial structure was confirmed, I applied Universal Kriging — a geostatistical technique built for exactly this: modelling spatial dependence explicitly and interpolating values (in this case, logerror) into unsampled or poorly predicted areas. It worked well, particularly for underrepresented geographies, and it made something important visible: Zestimate's errors aren't random noise, they're aligned with geography — a structural bias a standard ML pipeline would never surface on its own.

## Borrowing from medicine: survival analysis for house sales

The part I found most fun was reframing "when does a house sell" as a survival problem — the kind of technique usually reserved for clinical trials, where the "event" is death or recovery instead of a sale. Here, the event was a property selling; censoring meant the property hadn't sold by the end of the observation window (01 Jan 2016 – 25 Sep 2017 — worth noting the censoring rate was very high, around 94.5%, so a lot of the signal had to be extracted from relatively few observed sales).

The Kaplan-Meier estimator showed that newer homes (built after 2000) had the lowest survival probability — meaning they sold fastest — while properties built before 1950 tended to sit on the market much longer. The Nelson-Aalen hazard function added a temporal layer: a clear seasonal cycle, with hazard (i.e., likelihood of selling) peaking in mid-summer and dropping off in late fall, which lines up with how the real estate market actually moves through the year. A log-rank test confirmed the differences across age groups were statistically significant (p < 0.001). Smaller homes, somewhat counter-intuitively, also sold faster than larger ones.

## Testing the trade-off: where the black-box models actually stood

To make the "interpretability vs. accuracy" trade-off more than a talking point, I also ran Survival Forests and Deep Survival Nets on the same time-to-sale problem — the more flexible, less transparent end of the survival-modelling spectrum. The honest takeaway wasn't that they were bad models. It's that even in the cases where they matched or edged out Kaplan-Meier and Nelson-Aalen on raw predictive terms, they couldn't hand me a hazard curve I could point to and say "this is why sales peak in July" or "this is why age matters here." That explanatory layer — the actual point of the project — only survived in the classical, interpretable methods.

## What I took away from this

Zestimate's errors aren't random: they follow clear geographic and structural patterns, concentrated in sparsely populated areas and atypical properties. Kriging turned out to be genuinely effective at correcting those local inaccuracies, which says something about how much spatial interpolation is worth in real estate modelling generally. And survival analysis surfaced market dynamics — newer and smaller homes selling faster — that a standard regression setup would have missed entirely, because it was never asking a "when" question in the first place.

The real conclusion isn't "interpretable models beat deep learning." It's narrower and, I think, more useful: when the goal is *understanding* rather than just *predicting*, combining classical machine learning with spatial and temporal statistical tools gets you somewhere a black-box model — however accurate — simply can't take you.
