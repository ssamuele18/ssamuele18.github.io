---
title: "Gibbs' Sampler for Efficient LDA Mixture Models Inference"
summary: "A collapsed Gibbs sampler for Latent Dirichlet Allocation, written from scratch and compared with Stan to see when a hand-made sampler beats a general-purpose one."
date: 2024-01-28
kind: Personal
stack: [Python, STAN]
tags: [NLP, Bayes]
---

## The problem

Latent Dirichlet Allocation describes each document as a mixture of topics and each topic as a distribution over words. The posterior has no closed form, and generic samplers struggle with the many discrete topic assignments it involves.

## What I did

I derived and implemented a collapsed Gibbs sampler. It integrates out the topic and word proportions and resamples one word's topic at a time from

$$
p(z_i = k \mid z_{-i}, w) \propto \frac{n_{k,w_i}^{-i} + \beta}{n_{k}^{-i} + V\beta}\,\left(n_{d,k}^{-i} + \alpha\right).
$$

I then compared it with a Stan implementation of the same model, looking at speed, mixing and the topics each one recovers.

## Results

The specialised sampler exploits conjugacy that Stan cannot use with discrete latent variables. It is the clearest example I know of why model structure matters as much as the sampler.
