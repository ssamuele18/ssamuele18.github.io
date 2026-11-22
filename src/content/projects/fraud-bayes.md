---
title: "Bayesian Approach to Credit Card Fraud Detection"
summary: "A Bayesian classifier for heavily imbalanced card transactions, giving calibrated fraud probabilities instead of a bare yes/no."
date: 2024-03-09
kind: Personal
stack: [Python, STAN]
tags: [Classification, Bayes]
---

## The problem

Fraudulent transactions are a tiny fraction of the total, and missing one costs far more than a false alarm. A point classifier gives no sense of how sure it is, yet that uncertainty is exactly what an analyst needs to prioritise alerts.

## What I did

I fitted a Bayesian logistic regression in Stan, with weakly informative priors that keep the many coefficients under control. From the posterior predictive probability of fraud I set the alert threshold according to the asymmetric costs, not at the usual 0.5.

## Results

The posterior separates confident cases from doubtful ones. Doubtful transactions can go to manual review, while confident ones are handled automatically.
