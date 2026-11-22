---
title: "Smart Surrogates: Efficient Downscaling for Flow Prediction in Porous Media"
summary: "Neural surrogates that predict fine-scale flow in porous media from coarse simulations, replacing most of the expensive high-resolution solves."
date: 2024-05-21
kind: University
stack: [Python, Tensorflow, Github]
tags: [Surrogate, CFD]
---

## The problem

Flow through porous media (soils, aquifers, reservoirs) depends on heterogeneity at very small scales. Resolving it everywhere is expensive, but coarse simulations miss the details that matter.

## What I did

I trained TensorFlow networks to *downscale* coarse-resolution flow fields to the fine resolution, using pairs of coarse and fine simulations. The work was done as a team, with the code shared on GitHub.

## Results

The surrogate reconstructs fine-scale fields from cheap coarse runs, so high-resolution solves are needed only to train it.
