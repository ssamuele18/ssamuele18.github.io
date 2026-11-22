---
title: "Synthetic Data and GenAI for Improved Text Classification: a Brembo case study"
summary: "My thesis at Brembo: using generative AI to create synthetic training text and improve a classifier on scarce, imbalanced industrial data."
date: 2024-11-29
kind: Work
stack: [Python, R, MLflow]
tags: [AI, NLP, Classification]
---

## The problem

Industrial text data is short, full of jargon and very unbalanced: a few classes have plenty of examples, many have almost none. A classifier trained on it learns the frequent classes well and ignores the rest.

## What I did

During my internship at Brembo I used large language models to generate synthetic examples for the under-represented classes. I then compared classifiers trained on real data alone with those trained on real plus synthetic data, tracking every experiment in MLflow.

## Results

Well-targeted synthetic data helps the rare classes the most. The work also showed that quality checks on the generated text matter as much as its quantity.
