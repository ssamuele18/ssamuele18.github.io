---
title: "Predicting Tumour Regression Grade in Colorectal-Liver Metastases Patients"
summary: "A multiclass logistic model that predicts the tumour regression grade, to support the decision on whether further surgery is needed."
date: 2023-07-19
kind: University
stack: [R, Github]
tags: [Classification, Medicine]
---

## The problem

The analysis focused on deciding whether another surgery was needed for patients already affected by colorectal-liver metastases. The tumour regression grade (TRG), which measures how the tumour responded to therapy, is a key input to that decision.

## What I did

TRG is an ordered, multi-level outcome, so I fitted a multiclass logistic regression in R on the patients' clinical variables. I selected the predictors carefully, given the small sample, and validated the model to avoid overfitting.

## Results

The model gives each patient a probability for every TRG level rather than one label. That is closer to how clinicians reason about risk.
