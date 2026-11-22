---
title: "Modelling Activation Times for Pathological Seizures in Brain Tissues"
summary: "Simulating how electrical activation spreads through brain tissue during a seizure, and predicting activation times on a graph-based representation of the domain."
date: 2024-06-28
kind: University
stack: [Python, C++]
tags: [Graph ML, Simulation]
---

## The problem

During a pathological seizure, an activation front travels through the brain tissue. Knowing *when* each region activates helps locate where the seizure starts. A full numerical simulation, however, is too slow to run repeatedly.

## What I did

I produced activation-time maps with a C++ numerical solver on the tissue mesh. I then treated the mesh as a graph and trained a graph-based model in Python to predict the activation times from the tissue properties and the starting point.

## Results

The learned model approximates the simulator's activation maps at a fraction of the cost, which makes many quick "what if" scenarios affordable.
