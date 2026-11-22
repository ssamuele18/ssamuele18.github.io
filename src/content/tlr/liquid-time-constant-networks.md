---
title: "Liquid Time-Constant Networks: Bringing Continuous-Time Dynamics into Deep Learning"
abstract: >-
  Liquid Time-Constant Networks are recurrent networks for data that evolves continuously in time. Instead
  of giving every hidden unit one fixed response speed, they let the data decide how quickly each unit
  updates: a learned, state-dependent time constant with stability built into the architecture.
date: 2023-05-17
tags: [Deep Learning, Model Training, ODEs, Computational Cost]
---

**Liquid Time-Constant Networks (LTCs)** are recurrent neural networks designed for data whose behavior evolves continuously over time such as sensor readings, physical systems, medical signals, or financial measurements. Their central idea is simple: rather than giving every hidden unit one fixed response speed, let the data dynamically change how quickly each unit updates.

A conventional continuous-time recurrent network can be written as

$$
\frac{dx(t)}{dt} = -\frac{x(t)}{\tau} + f\big(x(t), I(t), t; \theta\big),
$$

where $x(t)$ is the hidden state, $I(t)$ is the input, and $\tau$ is a fixed time constant. The decay term $-x(t)/\tau$ encourages stable dynamics: without new input, the state is pulled toward equilibrium.

LTCs modify this structure so that the nonlinear function $f$ also determines the effective time constant:

$$
\frac{dx(t)}{dt} = -\left[\frac{1}{\tau} + f\big(x(t), I(t), t; \theta\big)\right] x(t) + f\big(x(t), I(t), t; \theta\big)
$$

This makes the time constant *liquid*: it changes with the network state and incoming data. Intuitively, an LTC neuron can react quickly to an important event while retaining information more slowly when the signal is stable. The authors frame this as a more flexible continuous-time alternative to standard RNNs, where the dynamics are typically specified more directly by a nonlinear neural network [[1]](https://www.alphaxiv.org/abs/2006.04439?page=1).

## Why this matters for statistics

Statistical time-series models assume that observations are sampled on a regular grid and that dependence is governed by a relatively fixed mechanism. But real data often violate both assumptions:

- measurements may arrive irregularly;
- the same variable can evolve rapidly during one period and slowly during another;
- nonlinear feedback can make fixed-coefficient models too restrictive;
- stability matters because forecasting systems should not produce exploding trajectories from noisy or large inputs.

LTCs encode these concerns through a dynamical-systems perspective. Each hidden state is governed by a differential equation, while the network learns how observations alter the local rate of change. In statistical language, the model learns a **state-dependent transition mechanism** rather than relying on a fixed autoregressive coefficient or fixed decay rate.

The key quantity is the data-dependent effective time constant:

$$
\tau_{\text{sys}} = \frac{\tau}{1 + \tau f\big(x(t), I(t), t; \theta\big)}
$$

When the gating function $f$ is large, $\tau_{\text{sys}}$ becomes smaller and the hidden state can change more rapidly. When $f$ is small, the system updates more slowly. This is a learned form of adaptive temporal smoothing [[2]](https://www.alphaxiv.org/abs/2006.04439?page=1).

## Stability is built into the architecture

A useful property of LTCs is that their hidden states are theoretically bounded. The paper proves that each neuron's time constant lies in a finite interval, and that hidden states stay between bounds determined by the model's parameters. In particular, the authors argue that the output cannot explode even if inputs grow without bound [[3]](https://www.alphaxiv.org/abs/2006.04439?page=3).

For a statistics audience, this is important: predictive flexibility is valuable only if it does not come at the cost of pathological extrapolation. A neural model can fit complex temporal patterns, but unconstrained nonlinear dynamics may become numerically or behaviorally unstable outside the training distribution. LTCs try to address this by making decay explicit in the state equation.

## Training and numerical computation

Because LTCs are defined by differential equations, evaluating the model requires a numerical ODE solver. The authors argue that the LTC dynamics can be stiff, meaning that some components may evolve at very different time scales. They therefore propose a "fused" solver that combines the stability benefits of implicit Euler updates with the efficiency of explicit Euler-style computation [[4]](https://www.alphaxiv.org/abs/2006.04439?page=2).

Their discrete update is

$$
x(t + \Delta t) = \frac{x(t) + \Delta t\, f\big(x(t), I(t), t; \theta\big)}{1 + \Delta t \left(\frac{1}{\tau} + f\big(x(t), I(t), t; \theta\big)\right)}
$$

Rather than using an adjoint method for gradients, the paper trains LTCs with backpropagation through time (BPTT). This uses more memory, but the authors prefer it because it retains the forward computational trajectory and can yield a more accurate backward pass through the numerical solver [[5]](https://www.alphaxiv.org/abs/2006.04439?page=3).

## Expressivity: more than universal approximation

Like many neural architectures, LTCs are shown to be universal approximators over finite time intervals: with sufficient hidden units, they can approximate trajectories generated by a smooth dynamical system [[6]](https://www.alphaxiv.org/abs/2006.04439?page=4).

But universal approximation alone does not distinguish architectures very well: many models have it. The paper instead compares models using **trajectory length** in a low-dimensional representation of hidden activations. The intuition is that a model that maps a simple input trajectory into a longer, more intricate latent trajectory may represent more complex temporal transformations.

Across their simulations, LTCs often produce longer latent trajectories than Neural ODEs and continuous-time RNNs, particularly with ReLU or Hard-tanh nonlinearities. The paper interprets this as evidence of greater expressivity, though trajectory length is a structural proxy rather than a direct measure of predictive accuracy [[7]](https://www.alphaxiv.org/abs/2006.04439?page=4).

## Experimental results

The experiments compare LTCs with LSTMs, continuous-time RNNs, Neural ODEs, and continuous-time GRUs on seven time-series tasks. LTCs achieved the strongest mean result on gesture classification, occupancy detection, traffic forecasting, and ozone detection; they were competitive but not best on activity recognition, sequential MNIST, and power forecasting [[8]](https://www.alphaxiv.org/abs/2006.04439?page=6).

A striking example is traffic prediction: LTCs report a squared error of $0.099 \pm 0.0095$, compared with $0.169 \pm 0.004$ for LSTMs and $1.512 \pm 0.179$ for the Neural ODE baseline. On the authors' second person-activity setup, LTCs reach accuracy $0.882 \pm 0.005$, above the listed latent-ODE and ODE-RNN baselines [9].

## What to take away

LTCs are best understood as a bridge between deep learning and statistical dynamical modeling. They retain the nonlinear representation learning of RNNs while adding an interpretable modeling ingredient: **the rate at which each hidden state evolves is itself learned from the data**.

The broader lesson is that model architecture can encode statistical assumptions. Here, the assumption is not merely "the past matters", it is that temporal dependence is nonlinear, continuous, state-dependent, and potentially also variable in speed. That is a stronger, and often more realistic, hypothesis for physical, biological, and sensor-driven time series.

The trade-off is computational. The authors explicitly note that LTCs can have higher time and memory costs than Neural ODEs, can suffer from vanishing gradients on long-term dependencies, and depend strongly on the numerical solver used in practice [[10]](https://www.alphaxiv.org/abs/2006.04439?page=7).

---

**References**

1. <https://www.alphaxiv.org/abs/2006.04439?page=1>
2. <https://www.alphaxiv.org/abs/2006.04439?page=1>
3. <https://www.alphaxiv.org/abs/2006.04439?page=3>
4. <https://www.alphaxiv.org/abs/2006.04439?page=2>
5. <https://www.alphaxiv.org/abs/2006.04439?page=3>
6. <https://www.alphaxiv.org/abs/2006.04439?page=4>
7. <https://www.alphaxiv.org/abs/2006.04439?page=4>
8. <https://www.alphaxiv.org/abs/2006.04439?page=6>
9. Benchmark results and activity results tables in the paper.
10. <https://www.alphaxiv.org/abs/2006.04439?page=7>
