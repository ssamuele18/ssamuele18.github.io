---
title: "That's why cartoons are fake"
subtitle: "In two dimensions sound never goes quiet: Huygens, Kirchhoff and the tail that never ends"
abstract: "In our 3D world a clap arrives sharply and then leaves silence behind. In a flat world it would leave a tail that decays like 1/t without ever reaching zero. This is the strong Huygens principle, and it depends on the dimension of space."
date: 2026-11-22
tags: [mathematics, pde]
author: "Samuele Caldarini"
---

Clap your hands. Someone ten metres away hears the clap and then silence returns, with no trailing noise. It seems obvious, but it is not: nothing in the wave equation forces this behaviour. It depends on how many dimensions the space has. In a flat world, a cartoon taken literally, a clap would never fully die away.

**The wave equation** in $\mathbb{R}^n$ is

$$
\partial_{tt} u - c^2 \Delta u = 0, \qquad u(x,0)=g(x), \quad \partial_t u(x,0)=h(x),
$$

where $c$ is the speed of sound, $g$ the initial shape and $h$ the initial velocity. A clarification that avoids a common misunderstanding: this equation conserves energy in every dimension. There is no dissipation, neither in 2D nor in 3D. The difference is something else: whether, once the front has passed, the signal at a point goes back to exactly zero or not.

## Strong and weak Huygens: what $u(x,t)$ depends on

The value $u(x,t)$ depends on the initial data, but not on all of it in the same way.

- **Strong Huygens principle:** $u(x,t)$ depends only on the data on the boundary of the ball, the sphere $\partial B(x,ct)$.
- **Weak Huygens principle:** $u(x,t)$ depends on the data on the whole ball $B(x,ct)$.

The strong principle holds in odd dimension $n \ge 3$ (3, 5, 7, ...). In even dimension (2, 4, 6, ...) only the weak one holds. Let us see why by looking at the two cases that matter to us.

## Three dimensions: only the shell counts

In $\mathbb{R}^3$ the solution is given by Kirchhoff's formula:

$$
u(x,t)=\frac{1}{4\pi c^{2}t^{2}}\int_{\partial B(x,ct)}\Big[t\,h(y)+g(y)+\nabla g(y)\cdot (y-x)\Big]\,dS(y),
$$

where $dS(y)$ is the surface element of the sphere. The domain of integration is only the shell $\partial B(x,ct)$: the surface, not the volume.

Suppose the initial disturbance is concentrated in a small region $D$, like a firecracker. As long as the shell of radius $ct$ does not touch $D$, the integral is zero and you hear nothing. While the shell crosses $D$, you hear the bang. Once the radius is large enough, $D$ sits inside the sphere and no longer on its boundary: the integral goes back to exactly zero. The sound has a sharp beginning and a sharp end. If the source lasts a time $\tau$, you hear it for a time $\tau$ and then nothing more (in an ideal vacuum, without reflections).

## Two dimensions: Hadamard's method of descent

To obtain the formula in $\mathbb{R}^2$ one uses Hadamard's method of descent: a 2D wave is seen as a 3D wave that does not depend on the third coordinate $z$, that is, an infinite cylinder. The 3D spherical shell, projected onto the plane $(x_1,x_2)$, does not become a circle: it covers the whole disc $B(x,ct)$, with a weight coming from the change of variables. The result is Poisson's formula. For the part due to the initial velocity $h$ it reads

$$
u_h(x,t)=\frac{1}{2\pi c}\int_{B(x,ct)}\frac{h(y)}{\sqrt{c^{2}t^{2}-|y-x|^{2}}}\,dy,
$$

and the contribution of $g$ is obtained by differentiating in $t$ the same expression with $g$ in place of $h$.

Now the integral runs over the whole disc. If the disturbance is concentrated in $D$ and $t$ is very large, $D$ is well inside the disc and keeps contributing. For a fixed point $x$ and $t \to \infty$ the square root tends to $ct$, so

$$
u_h(x,t)\;\approx\;\frac{M}{2\pi c^{2}\,t}, \qquad M=\int h\,dy.
$$

If $h \ge 0$ and $M>0$, this does not vanish at any finite time. The tail decays like $1/t$, but it is always there. The contribution of $g$ decays faster (like $1/t^2$, since it is the $t$-derivative of the previous one) and still never vanishes.

## The tail, in numbers

To avoid relying only on the analytical steps, I computed numerically a pulse of duration $\tau = 1$ (with $c=1$) observed at distance $r=10$: in 3D with the retarded potential, and in 2D with the two-dimensional Green's function. The 3D signal is zero outside the window $[r/c,\, r/c+\tau]$ (maximum absolute value after the window: 0). In 2D, after the front, the signal stays positive, and the product $t\cdot u$ converges to the predicted value $M/(2\pi c^2) \approx 0.07958$: at $t=2000$ the computation gives $0.07960$.

![On the left, the signal at a point at distance 10 from the source: in 3D it is a sharp pulse, in 2D a tail remains. On the right, the product t·u(t) tends to a constant, so the tail decays like 1/t. The 2D and 3D amplitudes are not comparable in absolute value: the source is the same but the normalisations differ.](/img/cartoons-waves-2d-vs-3d.png)

## What the formula does not say

A few clarifications, so as not to load the result with more than it can bear.

- **It is not dissipation.** Energy is conserved. The tail is not energy sitting still at the point: it is energy spread over a growing region, with an amplitude that shrinks over time.
- **The tail is not an oscillation.** For a pulse with $h\ge 0$ it is a slow relaxation of one sign. So the stone in the pond is not the right example: the ripples that follow the front are due to the dispersion of water waves, which do not obey the non-dispersive wave equation. A more faithful picture is an ideal membrane, like a drumhead.
- **One dimension is a case of its own.** In d'Alembert's formula $u=\tfrac12[g(x+ct)+g(x-ct)]+\tfrac{1}{2c}\int_{x-ct}^{x+ct}h$ the part due to $g$ is sharp (two travelling pulses), but the part due to $h$ leaves, after the passage, a constant value $\tfrac{1}{2c}\int h$: the signal does not return to zero.

In summary:

| Dimension $n$ | Huygens | What you hear after the front has passed |
| --- | --- | --- |
| 1 | does not hold for the $h$ part | a constant, non-zero value |
| 2 (and even) | weak | a tail decaying like $1/t$ |
| 3 (and odd $\ge 3$) | strong | exact silence |

The table refers to the ideal wave equation. Real sounds have reflections, absorption and extended sources, which change the picture.

## Why cartoons are fake

If we lived in a flat universe and sound obeyed the wave equation, every word would leave a trail that decays like $1/t$ without ever disappearing, and yesterday's sounds would blend with today's. Speaking intelligibly would be much harder. Cartoon characters live on a flat screen but talk as if they lived in 3D: it is a poetic licence that mathematics does not grant. **The sharpness of sound is not a property of air, but of the dimension of space.**

---

**References**

- L. C. Evans, *Partial Differential Equations*, ch. 2, section 2.4 (the wave equation: Kirchhoff's and Poisson's formulas, method of descent).
