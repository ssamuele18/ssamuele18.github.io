---
title: "From Optimization to Sampling: One Family of Gradient Algorithms"
abstract: >-
  Gradient descent is taught as an optimization method, Langevin dynamics and Hamiltonian Monte Carlo as
  sampling methods. Yet they share one structure: gradients, randomness and sometimes momentum, mixed in
  different proportions. Seeing them as a single family makes both worlds easier to understand.
date: 2025-02-28
tags: [Sampling, Probabilistic AI, Deep Learning, Optimization]
---

Many machine-learning algorithms look different because they are presented with different goals. Gradient descent is taught as an optimization method; Langevin dynamics and Hamiltonian Monte Carlo are taught as sampling methods. But they share a common structure: each combines gradient information, randomness, and sometimes momentum in different proportions.

**Optimization** aims to find a single parameter vector $\theta^\star$ that minimizes a loss function $f(\theta)$. A standard gradient-descent update is

$$
\theta_{t+1} = \theta_t - \eta \nabla f(\theta_t),
$$

where $\eta$ is the learning rate. Each step moves downhill, toward lower loss.

**Sampling**, in contrast, aims to represent uncertainty by producing many plausible values of $\theta$. In Bayesian inference, the target may be a posterior distribution,

$$
p(\theta \mid \mathcal{D}) \propto \exp(-f(\theta))
$$

Rather than stopping at one low-loss solution, a sampler should spend more time in regions where this distribution is high.

## Adding noise: from GD to Langevin dynamics

Langevin dynamics starts from the gradient-descent update and adds Gaussian noise:

$$
\theta_{t+1} = \theta_t - \eta \nabla f(\theta_t) + \varepsilon_t, \qquad \varepsilon_t \sim \mathcal{N}(0, 2\eta I).
$$

The gradient term pulls the parameters toward lower-energy (or more probable) regions. The noise term prevents the algorithm from simply settling at one minimum. With the right step-size behavior, the sequence of iterates can approximate draws from the target distribution.

A useful intuition is:

- **Gradient descent:** "Find the bottom of the valley"
- **Langevin dynamics:** "Explore the valley, spending most time near its bottom"

## Stochastic gradients: scaling to large datasets

Computing $\nabla f(\theta)$ over an entire dataset can be expensive. Stochastic gradient descent replaces it with a minibatch estimate:

$$
\theta_{t+1} = \theta_t - \eta \widehat{\nabla f}(\theta_t)
$$

This makes training large models feasible, but it also introduces accidental randomness: each minibatch gives a slightly different gradient.

Stochastic-gradient Langevin dynamics combines this minibatch approximation with *deliberately added* Gaussian noise. The resulting algorithm sits between conventional deep-learning training and Bayesian posterior sampling.

It is important not to confuse the two sources of randomness:

- **SGD noise** arises because the gradient is estimated from a minibatch.
- **Langevin noise** is injected on purpose, with a scale chosen to support sampling.
- **SGLD includes both.**

In practice, this means an SGD training run is not automatically a Bayesian sampler, even though its trajectory is noisy.

## Momentum: from local moves to directed trajectories

Momentum adds another ingredient: velocity. Instead of reacting only to the current gradient, the algorithm retains part of its previous update direction. This can reduce zig-zagging and speed progress through long, shallow regions of a loss landscape.

The sampling counterpart is Hamiltonian Monte Carlo (HMC). HMC introduces an auxiliary momentum variable and uses gradients to simulate a physical trajectory through parameter space. This produces longer, more coherent proposals than a method that takes only local noisy steps.

That matters especially when the target distribution has correlated parameters or separated high-probability regions. A purely local sampler can take a long time to move between such regions; momentum can carry HMC farther while maintaining a reasonable probability of accepting the proposal.

## A compact mental model

The relationships can be summarized as follows:

| Goal | Exact-gradient method | Minibatch-gradient method | Momentum-based method |
| --- | --- | --- | --- |
| Find one good solution | Gradient descent | Stochastic gradient descent | Momentum SGD |
| Explore a distribution of solutions | Langevin dynamics | Stochastic-gradient Langevin dynamics | Hamiltonian Monte Carlo / stochastic-gradient HMC |

The table is not a claim that every method is interchangeable. Sampling methods require care about step sizes, noise calibration, mixing, and convergence; optimization methods can often tolerate choices that would bias a sampler. Still, the family resemblance is valuable.

The broader lesson is that **optimization and probabilistic inference use many of the same computational tools**. Gradients provide direction, minibatches provide scalability, momentum provides persistence, and noise turns a search procedure into an exploration procedure.

---

**References**

- [arXiv:2502.05244](https://arxiv.org/abs/2502.05244)
