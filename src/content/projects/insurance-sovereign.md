---
title: "Computing Assets and Liabilities for a Simplified Insurance Company over a contract of 50 years"
summary: "Projecting the balance sheet of a simplified life insurer over a 50-year contract, under stochastic interest rates and asset returns."
date: 2023-06-11
kind: University
stack: [Python, Matlab, Excel]
tags: [Forecasting, Insurance, Stochasticity]
---

## The problem

An insurer's assets and liabilities must be valued consistently over horizons far longer than any market forecast. Over 50 years, interest rates, investment returns and policyholder behaviour can all drift a long way.

## What I did

I built a Monte Carlo projection of a simplified company. It simulated stochastic paths for interest rates and assets, projected the contract cash flows on each path and discounted them to obtain the asset and liability values.

## Results

The model gives a full distribution of the company's net position rather than a single number, and shows which risk factors drive it.
