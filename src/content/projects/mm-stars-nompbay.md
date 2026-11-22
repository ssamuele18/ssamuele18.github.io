---
title: "Mixture Models for Contaminated data"
summary: "Bayesian mixture models that classify astronomical images while staying robust to contaminated, mislabelled observations."
date: 2024-02-17
kind: University
stack: [Python, STAN]
tags: [Classification, Imagery]
---

## The problem

Real datasets contain observations that do not belong to any of the classes of interest: artefacts, noise, mislabelled points. A standard mixture model forces them into a class and distorts every estimate.

## What I did

I worked on a classification task based on star imagery and fitted Bayesian mixture models in Stan. Each model had an extra *contamination* component: a wide, low-weight distribution that absorbs outliers instead of letting them pull the real clusters.

## Results

The contaminated mixture keeps the class estimates stable, and as a by-product it flags the suspicious observations for inspection.
