---
title: "The Hilbert Projection Theorem and Statistics"
subtitle: "Beyond Interpolation: Why Spatial Prediction is Just Geometric Projection in Infinite Dimensions"
abstract: >-
  Kriging looks like a clever weighted average of nearby samples, but underneath it sits one of the most
  elegant results of functional analysis. Every Kriging system is just an orthogonal projection, high-school
  vector geometry performed in the infinite-dimensional Hilbert space of random variables.
date: 2022-08-15
tags: [Geostatistics, Kriging, Functional analysis]
---

## Introduction: The Aesthetic Behind the Equations

To many outside our field, Kriging looks like a purely empirical data-fitting technique, a clever weighted average of nearby samples. But we know that mathematics is rarely just a collection of numerical recipes. Today, I want to step back from the raw code and matrix inversions to reveal the foundational, elegant mathematical engine hiding beneath spatial statistics: **The Hilbert Space Projection Theorem**.

By the end of this article, we will see that every Kriging system you write on a whiteboard or compute in Python is nothing more than **high-school vector trigonometry performed inside an infinite-dimensional abstract space.**

## Setting Up $L^2(\Omega, \mathcal{F}, P)$

To understand why spatial prediction is a geometric problem, we first need to define the space in which our random variables live.

Let $(\Omega, \mathcal{F}, P)$ be a probability space. Consider the collection of all real-valued random variables with finite second moments:

$$
L^2(\Omega, \mathcal{F}, P) = \left\{ X : \Omega \to \mathbb{R} \;\middle|\; \mathbb{E}[X^2] < \infty \right\}
$$

Equipped with standard addition and scalar multiplication, $L^2$ forms a vector space. But to talk about *geometry*, distance, angles, and orthogonality, we need an **inner product**. We define the inner product of two random variables $X, Y \in L^2$ as their joint moment (or covariance for centered variables):

$$
\langle X, Y \rangle = \mathbb{E}[XY]
$$

If we assume zero-mean process conditions (or center our variables such that $\mathbb{E}[X] = \mathbb{E}[Y] = 0$), then:

$$
\langle X, Y \rangle = \operatorname{Cov}(X, Y)
$$

This inner product naturally induces a **norm** (measuring the "magnitude" of a random variable):

$$
\lVert X \rVert = \sqrt{\langle X, X \rangle} = \sqrt{\mathbb{E}[X^2]} = \sigma_X
$$

and a **metric** (measuring the distance between two random variables):

$$
d(X, Y) = \lVert X - Y \rVert = \sqrt{\mathbb{E}[(X - Y)^2]}
$$

Because $L^2(\Omega, \mathcal{F}, P)$ is complete under the metric induced by this inner product, it constitutes a **Hilbert Space**, i.e. a vector space with an inner product that allows infinite-dimensional geometry.

## Optimal Spatial Prediction

Let $Z(x)$ be a spatial random process defined over a domain $D \subset \mathbb{R}^d$. Suppose we have observed the process at $N$ discrete spatial locations $x_1, x_2, \dots, x_N$, yielding data $Z(x_1), Z(x_2), \dots, Z(x_N)$.

We wish to estimate the unobserved value $Z(x_0)$ at a new location $x_0 \notin \{x_1, \dots, x_N\}$. In geostatistics, we restrict our estimator $\widehat{Z}(x_0)$ to be a linear combination of our observed data:

$$
\widehat{Z}(x_0) = \sum_{i=1}^{N} \lambda_i Z(x_i)
$$

Our goal is to find the optimal scalar weights $\boldsymbol{\lambda} = [\lambda_1, \lambda_2, \dots, \lambda_N]^T$ such that the estimation error variance is minimized:

$$
\text{Minimize } \operatorname{Var}\left(Z(x_0) - \widehat{Z}(x_0)\right) = \mathbb{E}\left[\left(Z(x_0) - \sum_{i=1}^{N} \lambda_i Z(x_i)\right)^2\right]
$$

In the language of $L^2$, minimizing the expected squared error is **identical** to minimizing the squared distance between the random variable $Z(x_0)$ and our estimator $\widehat{Z}(x_0)$:

$$
\text{Minimize } \left\lVert Z(x_0) - \widehat{Z}(x_0) \right\rVert^2
$$

## Hilbert's Projection Theorem

Now, let us bring in the fundamental theorem from functional analysis that solves this problem instantly.

> **Theorem (Hilbert Projection Theorem).**
> Let $\mathcal{H}$ be a Hilbert space and let $\mathcal{K}$ be a closed linear subspace of $\mathcal{H}$. For any vector $y \in \mathcal{H}$, there exists a unique vector $\hat{y} \in \mathcal{K}$ that minimizes the distance $\lVert y - v \rVert$ over all $v \in \mathcal{K}$:
>
> $$
> \lVert y - \hat{y} \rVert = \inf_{v \in \mathcal{K}} \lVert y - v \rVert
> $$
>
> Furthermore, a necessary and sufficient condition for $\hat{y}$ to be this unique best approximation is that the error vector $(y - \hat{y})$ is **orthogonal** to the subspace $\mathcal{K}$:
>
> $$
> (y - \hat{y}) \perp \mathcal{K} \iff \langle y - \hat{y}, v \rangle = 0 \quad \forall v \in \mathcal{K}
> $$

## The Geometric Intuition

Think back to elementary 3D geometry: if you have a point $P$ in space and a 2D plane $W$, what is the point on $W$ closest to $P$?
It is the perpendicular (orthogonal) projection of $P$ onto $W$.

The Projection Theorem proves that this simple geometric truth holds true even in infinite-dimensional spaces of random variables!

## Pinpointing

Let us map our geostatistical problem directly onto the theorem:

1. **The Hilbert Space $\mathcal{H}$**: $L^2(\Omega, \mathcal{F}, P)$, the space of finite-variance random variables.
2. **The Target Vector $y$**: The unknown random variable $Z(x_0)$.
3. **The Subspace $\mathcal{K}$**: The linear span of our observations:
   $$
   \mathcal{K} = \operatorname{span}\{Z(x_1), Z(x_2), \dots, Z(x_N)\}
   $$
4. **The Best Approximation $\hat{y}$**: The Best Linear Estimator $\widehat{Z}(x_0) = \sum_{j=1}^{N} \lambda_j Z(x_j)$.

By the Hilbert Projection Theorem, the optimal estimator $\widehat{Z}(x_0)$ must satisfy the **Orthogonality Principle**:

$$
\left(Z(x_0) - \widehat{Z}(x_0)\right) \perp \mathcal{K}
$$

Since $\mathcal{K}$ is spanned by $\{Z(x_1), \dots, Z(x_N)\}$, the error vector must be orthogonal to **every individual basis element** $Z(x_i)$ for $i = 1, 2, \dots, N$:

$$
\left\langle Z(x_0) - \sum_{j=1}^{N} \lambda_j Z(x_j),\; Z(x_i) \right\rangle = 0 \quad \forall i \in \{1, \dots, N\}
$$

Using the linearity of the inner product:

$$
\langle Z(x_0), Z(x_i) \rangle - \sum_{j=1}^{N} \lambda_j \langle Z(x_j), Z(x_i) \rangle = 0
$$

Recalling that our inner product is the spatial covariance $\langle X, Y \rangle = \operatorname{Cov}(X, Y) = C(x, y)$:

$$
C(x_0, x_i) = \sum_{j=1}^{N} \lambda_j C(x_j, x_i) \quad \text{for } i = 1, 2, \dots, N
$$

## The Matrix Equation

In matrix notation, this becomes:

$$
\mathbf{C} \boldsymbol{\lambda} = \mathbf{c}_0
$$

Where:

- $\mathbf{C}_{ij} = \operatorname{Cov}(Z(x_i), Z(x_j))$ is the $N \times N$ spatial covariance matrix of observations.
- $\boldsymbol{\lambda} = [\lambda_1, \dots, \lambda_N]^T$ is the vector of unknown Kriging weights.
- $\mathbf{c}_0 = [\operatorname{Cov}(Z(x_0), Z(x_1)), \dots, \operatorname{Cov}(Z(x_0), Z(x_N))]^T$ is the covariance vector between the target point and observed points.

Solving for the weights:

$$
\boldsymbol{\lambda} = \mathbf{C}^{-1} \mathbf{c}_0
$$

This is precisely the **Simple Kriging system**. The Kriging system is not an arbitrary formula; it is the algebraic realization of setting the estimation error orthogonal to the data subspace!

## What About Unbiasedness? (Ordinary Kriging)

When the process mean $\mu$ is unknown, we impose an unbiasedness constraint:
$\mathbb{E}[\widehat{Z}(x_0)] = \mathbb{E}[Z(x_0)] \implies \sum_{i=1}^{N} \lambda_i = 1$.

Geometrically, restricting the weights to sum to 1 shifts our subspace $\mathcal{K}$ to an **affine hyperplane** $\mathcal{A} \subset \mathcal{H}$:

$$
\mathcal{A} = \left\{ \sum_{i=1}^{N} \lambda_i Z(x_i) \;\middle|\; \sum_{i=1}^{N} \lambda_i = 1 \right\}
$$

To solve the constrained minimization, we apply Lagrange multipliers $\mu_L$, leading to the **Ordinary Kriging System**:

$$
\begin{bmatrix} \mathbf{C} & \mathbf{1} \\ \mathbf{1}^T & 0 \end{bmatrix}
\begin{bmatrix} \boldsymbol{\lambda} \\ \mu_L \end{bmatrix}
=
\begin{bmatrix} \mathbf{c}_0 \\ 1 \end{bmatrix}
$$

Or, expressed in terms of the experimental variogram $\gamma(h)$:

$$
\begin{bmatrix} \boldsymbol{\Gamma} & \mathbf{1} \\ \mathbf{1}^T & 0 \end{bmatrix}
\begin{bmatrix} \boldsymbol{\lambda} \\ -\mu_L \end{bmatrix}
=
\begin{bmatrix} \boldsymbol{\gamma}_0 \\ 1 \end{bmatrix}
$$

Even with Lagrange multipliers involved, the core principle remains unchanged: we are finding the point on an affine manifold that minimizes the Euclidean distance in $L^2$ space.

## Why Orthogonality Guarantees Minimal Error Variance

Why is the orthogonal projection guaranteed to give the smallest error variance?

Consider any alternative estimator $W \in \mathcal{K}$ different from our projection $\widehat{Z}(x_0)$. We can decompose the error of $W$ using the Pythagorean theorem in Hilbert space:

$$
Z(x_0) - W = \underbrace{\left(Z(x_0) - \widehat{Z}(x_0)\right)}_{\text{Orthogonal Error } e_\perp} + \underbrace{\left(\widehat{Z}(x_0) - W\right)}_{\text{Vector in } \mathcal{K}}
$$

Since $e_\perp \perp \mathcal{K}$ and $(\widehat{Z}(x_0) - W) \in \mathcal{K}$, their inner product is 0. Taking the squared norm:

$$
\begin{aligned}
\lVert Z(x_0) - W \rVert^2 &= \lVert Z(x_0) - \widehat{Z}(x_0) \rVert^2 + \lVert \widehat{Z}(x_0) - W \rVert^2 \\
\operatorname{Var}(Z(x_0) - W) &= \sigma^2_{\text{Kriging}} + \underbrace{\lVert \widehat{Z}(x_0) - W \rVert^2}_{\geq 0}
\end{aligned}
$$

Because $\lVert \widehat{Z}(x_0) - W \rVert^2 \geq 0$, the error variance is strictly minimized if and only if $W = \widehat{Z}(x_0)$.

The geometric orthogonality guarantees that no residual correlation remains between the error and the input data. The error is complete "white noise" relative to the information content of our sample points.

## Summary: The Bridge Between Geometry and Geostatistics

| Hilbert Space Geometry | Geostatistical Equivalent | Mathematical Definition |
| --- | --- | --- |
| **Vector Space** $\mathcal{H}$ | Space of Random Variables $L^2$ | $Z(x) \in L^2(\Omega, \mathcal{F}, P)$ |
| **Vector** $y$ | True unobserved value | $Z(x_0)$ |
| **Subspace** $\mathcal{K}$ | Linear combination of sample data | $\operatorname{span}\{Z(x_1), \dots, Z(x_N)\}$ |
| **Inner Product** $\langle X, Y \rangle$ | Covariance / Spatial structure | $\operatorname{Cov}(X, Y) = C(x, y)$ |
| **Squared Norm** $\lVert X - Y \rVert^2$ | Estimation Error Variance | $\mathbb{E}[(Z(x_0) - \widehat{Z}(x_0))^2]$ |
| **Orthogonal Projection** $\hat{y}$ | Best Linear Unbiased Estimator (Kriging) | $\widehat{Z}(x_0) = \boldsymbol{\lambda}^T \mathbf{Z}$ |
| **Orthogonality Condition** | Kriging Linear System | $\langle Z(x_0) - \widehat{Z}(x_0), Z(x_i) \rangle = 0 \implies \mathbf{C}\boldsymbol{\lambda} = \mathbf{c}_0$ |

## Conclusions

As you step out into academia or industry, whether you end up modeling subsurface oil reservoirs, predicting climate patterns, mining precious metals, or modeling urban air quality, never view spatial interpolation as just "drawing smooth lines between dots".

When you solve a Kriging system, you are exercising one of the most elegant results in 20th-century functional analysis. You are dropping a perpendicular line from an unknown point in an infinite-dimensional space down onto the hyper-plane defined by your data observations.

The Hilbert Projection Theorem gives you the mathematical guarantee that **no other linear combination of your data can yield a smaller estimation variance.** Kriging is optimal not by luck or empirical trial, but by geometric necessity.
