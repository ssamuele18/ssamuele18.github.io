---
title: "Score-Based Diffusion Models"
subtitle: "Part 2: from Markov chains to stochastic differential equations"
abstract: >-
  The same equations that describe particles drifting on a plane sit at the heart of modern generative AI.
  Taking DDPM to the continuous-time limit gives an Itô SDE; reversing it requires the score of the noisy
  data, which a neural network learns by denoising score matching, and sampling becomes solving an SDE.
date: 2025-08-01
tags: [Diffusion models, SDEs, Generative AI]
---

*This is the second part of [Brainrot Memes at Your Fingertips](/tlr/brainrot-memes), check that out first!*

## Introduction

Imagine a lot of tiny particles drifting randomly on a 2D plane, bouncing and spreading in every direction. While this process appears chaotic, we actually know the physical equations governing the movement of these particles:

$$
dx = f(x, t)\, dt + g(t)\, dW
$$

More surprisingly, the same equations are at the heart of the revolution behind much of today's generative AI. So let's see how we can use physics to reverse this chaos and generate brand new data in the process, like it's done for images for instance.

## Two different formulations

Diffusion models actually have two very different formulations. One was popularized by Jonathan Ho [2], based on previous work [4, 3]. It is mostly based on variational inference, so the general derivations and framework are close to VAEs.

A forward noising process can be defined using a Markov chain, and the reverse process can be learned by training a neural network with the Evidence Lower Bound (ELBO) as cost function. But a little earlier, in 2019, another line of work was being developed by Yang Song, following ideas from energy-based models and score matching [5, 7]. This formulation is based on a completely different mathematical framework, but also provided very good generation results at the time. Song then introduced a different perspective in 2021, which we usually call score-based diffusion models [6]. Keep in mind that both points of view describe the very same objects, and both are equally valid. So let's see what the score-based formulation is all about.

## Itô SDEs

In DDPMs, we define a discrete Markov chain to corrupt data step by step with Gaussian noise. The specific expression of this Markov chain was carefully chosen so that it converges to a normal distribution when we apply it a lot of times. And sure enough, with this expression, when the number of steps $T$ becomes very big, we end up with something looking very close to pure Gaussian noise. The time-dependent parameter $\beta_t$ controls how big each step is, meaning how much noise we add to the image. If we take big steps between each image, the neural network struggles to reverse this noising process. And if we take very small steps, we have to do a lot more iterations to reach pure Gaussian noise.

Now instead of thinking in terms of discrete steps, we'll take a whole other point of view: let's think of this process in terms of very, very small noising steps. Think of this as a slow flow of a liquid like when pouring a high viscosity fluid like honey. Now at the infinitesimal scale, this is the expression describing our noising process:

$$
dx = f(x, t)\, dt + g(t)\, dw
$$

This is a specific kind of stochastic differential equation (SDE) called an Itô equation. It is stochastic because this expression contains a term called *Brownian motion* ($dw$), which is random.

Let's think of this in terms of particles. The first term in the equation, $f(x, t)\, dt$, describes how the position of a particle changes due to a deterministic force — like a wind pushing it in a given direction. This term is called the **drift**, and it is completely deterministic, meaning that we can predict the exact path that the particle will follow. Now as I said, the second term is random, and it is comprised of a Brownian process as well as a **diffusion coefficient**, $g(t)$. These two terms capture all the tiny, unpredictable fluctuations in the environment making the particle appear to move randomly. The diffusion coefficient is the function controlling the intensity of this random motion. If it is small, the particle barely moves, and if it is big the particle makes big random jumps. When we combine these two terms, the resulting motion is neither fully deterministic nor entirely random. The particles generally follow the direction imposed by the deterministic force, but their paths remain influenced by random fluctuations.

## DDPM as an SDE

Let's now see which specific drift and diffusion coefficients correspond to the DDPM Markov chain. So let's first recall the expression of this Markov chain describing the noising process in the DDPM framework:

$$
x_i = \sqrt{1 - \beta_i}\, x_{i-1} + \sqrt{\beta_i}\, \epsilon_{i-1}, \quad \text{where } \epsilon \sim \mathcal{N}(0, I) \tag{1}
$$

We'll quickly demonstrate how this chain actually converges to the Itô equation we just saw, which will also reveal the drift and diffusion coefficients.

The first step is to define a new quantity, which we'll call $\tilde\beta$. It's simply the number of steps, $N$, multiplied by the noise variance, $\beta$.

$$
\tilde\beta_i = N \beta_i
$$

Now, let's also introduce a small time interval, $\Delta t$, which we'll eventually let shrink to zero. We can just take $\Delta t = 1/N$, so as $N$ increases, $\Delta t$ becomes smaller and smaller.
Next, we reinterpret the index $i$ in terms of continuous time. We'll say that $x$ at discrete step $i$ is simply the image at time $t + \Delta t$, so $x_i = x(t + \Delta t)$, and $\tilde\beta$ at step $i$ becomes $\tilde\beta$ evaluated at time $t$. If we replace this in our previous expression, we get this formulation which only depends on $t$ and $\Delta t$ (dropping the tilde from now on).

$$
x(t + \Delta t) = \sqrt{1 - \beta(t + \Delta t)\Delta t}\; x(t) + \sqrt{\beta(t + \Delta t)\Delta t}\; \epsilon(t) \tag{2}
$$

Now once we have this equation, the trick is to use approximations because we make $\Delta t$ tend to zero and this lets us manipulate the first term on the right hand side of Equation (2). The Taylor expansion for $\sqrt{1 - x}$ when $x$ is small is $\approx 1 - x/2$. With that, we can write:

$$
\begin{aligned}
x(t + \Delta t) &\approx x(t) - \tfrac{1}{2}\beta(t + \Delta t)\, x(t)\, \Delta t + \sqrt{\beta(t + \Delta t)\Delta t}\; \epsilon(t) && (3) \\
x(t + \Delta t) &\approx x(t) - \tfrac{1}{2}\beta(t)\, x(t)\, \Delta t + \sqrt{\beta(t)\Delta t}\; \epsilon(t) && (4)
\end{aligned}
$$

The further simplification of step (4) above is due to the fact that $\beta$ is assumed to be a function with some level of regularity, hence $\beta(t) \approx \beta(t + \Delta t)$. It is a reasonable approximation since $\Delta t \to 0$. With this we can further write:

$$
x(t + \Delta t) - x(t) \approx -\tfrac{1}{2}\beta(t)\, x(t)\, \Delta t + \sqrt{\beta(t)\Delta t}\; \epsilon(t) \tag{5}
$$

And since $\Delta t \to 0$, on the left we're really looking at the infinitesimal change in $x$, which is $dx$ and in $t$, leading us to a differential equation. The random term on the right also becomes $\sqrt{dt}\, \epsilon(t)$, which happens to be the discrete expression of the random Brownian process $dw$ we saw earlier. And just like that, we arrived at our Itô equation:

$$
dx = -\tfrac{1}{2}\beta(t)\, x\, dt + \sqrt{\beta(t)}\, dW \tag{6}
$$

## The reverse SDE

The drift term is $-\frac{1}{2}\beta(t)x$, where $\beta(t)$ is our variance schedule, and the diffusion coefficient is $\sqrt{\beta(t)}$, which makes sense because it's just the standard deviation of the noise we chose to add at each step in DDPM.

Now that we know the drift and diffusion coefficients, what's the actual effect of this equation on a given distribution of particles? If we take as example two clouds of points scattered around zero, as time progresses, those points get shuffled around, but they remain roughly centered around the mean. This is because the drift term pulls them toward the origin, while the diffusion term spreads them out, preventing them from collapsing to a single point. This also works with any other distribution, indeed, the stochastic differential equation (6) transforms any initial distribution into a Gaussian. This is just another way of looking at what happens in the forward process of DDPM, where we gradually turn images into pure noise; here we gradually transform any distribution into a Gaussian.

We still have to cover two important aspects, for now it was just introductory material that will be used to answer two questions:

- *How does this relate to image generation?* Well, imagine that each point $x \in \mathbb{R}^n$ for some $n \gg 1$ represents an image (after all images are just vectors in a high-dimensional feature space). Then this SDE is effectively converting a complex distribution of images into a simple $n$-dimensional Gaussian. If we are able to reverse this equation, we can start from random noise and slowly move backward to the original distribution. This means that, by reversing the SDE, we can generate brand new noiseless images starting from a Gaussian distribution.
  This poses a new question, directly related to the first.
- *Can we even reverse this particular SDE?* Luckily, yes. Previous work from the eighties on SDEs tells us that, under mild regularity conditions, any forward SDE has a corresponding reverse-time SDE. This result was first formally derived 40 years ago, and it is now at the heart of diffusion models [1].

$$
\begin{aligned}
dx &= f(x, t)\, dt + g(t)\, dW && \text{Forward SDE} \\
dx &= \left[f(x, t) - g(t)^2 \nabla_x \log p_t(x)\right] dt + g(t)\, d\bar{W} && \text{Reverse SDE}
\end{aligned}
$$

Since the continuous version of the DDPM forward process is just a special case of an Itô equation, it means we should in principle be able to reverse it. So let's take a closer look at this reverse SDE and replace $f$ and $g$ with the DDPM coefficients to make this a little simpler:

$$
\begin{aligned}
dx &= -\tfrac{1}{2}\beta(t)\, x\, dt + \sqrt{\beta(t)}\, dW \\
dx &= \left[-\tfrac{1}{2}\beta(t)\, x - \beta(t) \nabla_x \log p_t(x)\right] dt + \sqrt{\beta(t)}\, d\bar{W}
\end{aligned}
$$

First, the diffusion coefficient $g(t)$ stays the same. But the drift term changes: we still keep the original drift from the forward process, but we need to subtract an additional term, $g(t)^2 \nabla_x \log p_t(x)$. We already know that $\beta_t$ is our noise variance schedule, so the only thing we don't yet know is this new term, $\nabla_x \log p_t(x)$, which is usually called a **score function**.

## Score functions

Let's say we have a distribution $p(x)$, e.g. a simple mixture of Gaussians. Some regions of the space have a high probability of containing samples. The score of this distribution, $\nabla_x \log p(x)$, is a function that assigns to every point in space a vector pointing toward regions of higher probability. In other words, it tells us in which direction the density increases the fastest.

Now remember: in the forward process, we gradually corrupt the data with Gaussian noise. At each time $t$, we denote by $p_t(x)$ the distribution of the noisy samples. We already saw that the effect of this noising process is to transform the distribution slowly into a Gaussian. Now what's the effect on the score function? Well, adding Gaussian noise to a distribution has a smoothing effect, which also smooths the score function. At the beginning, the score function is sharp and complex, but as we add more noise, it gradually flattens out — until, at the final time $T$, it becomes similar to the score of the normal distribution.

To reverse the SDE, we need to know the score of these intermediate distributions $p_t(x)$ for all the time steps. Of course we don't know their expressions, so now we'll see how we learn these scores using a neural network, which we'll call $s_\theta(x_t, t)$.

## Learning the score

First of all, the architecture used as a backbone is usually a *U-Net*, a type of convolution architecture widely used in image processing. Most advanced networks might be equipped with attention layers, but surely they all keep the underlying $U$ shape able to capture local and global features. In the case of diffusion models, we adapt the input: the network doesn't just take a noisy image $x_t$ — it also takes the time-step $t$. This tells the network how far along the forward diffusion process we are, which helps it know which score function it's supposed to output.

### Training

We want the net to approximate as best as it can the score function ($s_\theta(x_t, t) \approx \nabla_x \log p_t(x)$) at every time $t$. Formally, we define a loss that measures how far our network's output is from this true score:

$$
\mathcal{L}(\theta) = \mathbb{E}_{x_0 \sim p(x),\, t}\left[\lVert s_\theta(x_t, t) - \nabla_{x_t} \log p_t(x_t) \rVert^2\right] \tag{7}
$$

So to predict the score, we need to know it, and, of course, we don't know the explicit expression for the score. Luckily, it's been known for a while that minimizing this loss is equivalent to learning the score of the conditional distribution, $p(x_t \mid x_0)$, hence (7) becomes:

$$
\mathcal{L}(\theta) = \mathbb{E}_{x_0 \sim p(x),\, t}\left[\lVert s_\theta(x_t, t) - \nabla_{x_t} \log p_t(x_t \mid x_0) \rVert^2\right] \tag{8}
$$

How this conditional score looks like in practice is not common knowledge and is not fixed for all the SDEs governing the process. For the specific SDE associated to the DDPM, we know that this conditional distribution $p(x_t \mid x_0)$ is a Gaussian, so computing its score is very easy.

$$
x_t = \sqrt{1 - \beta_t}\, x_0 + \sqrt{\beta_t}\, \epsilon \implies p_t(x_t \mid x_0) = \mathcal{N}\big(\sqrt{1 - \beta_t}\, x_0,\, \beta_t\big),
$$

one just has to compute the derivative of a Gaussian.
We end up with this simple expression which only requires knowing $x_0$ (the ground-truth) and $x_t$ (the noisy sample). And because $x_t$ is constructed from $x_0$ and the Gaussian noise $\epsilon$, we can write the conditional score depending only on $\epsilon$:

$$
\nabla_{x_t} \log p(x_t \mid x_0) = -\frac{\epsilon}{\sqrt{\beta_t}}
$$

When we plug this into the loss, we have a training objective (9) that is very similar to the DDPM training loss. If we take a quick look at both losses, you can see that in one case there's a minus between the network's output and the noise, and in the other there's a plus. This is because both networks learn two different things: in DDPM, the network learns to remove noise ($\epsilon_\theta$), while here the network learns the score ($s_\theta$). In fact, the way these networks are expressed make them approximately opposites (up to the scale $\sqrt{\beta_t}$, $s_\theta(x, t) \approx -\epsilon_\theta(x, t)/\sqrt{\beta_t}$), but both can be used to generate new data and we will see how in the next section.

$$
\begin{aligned}
\mathcal{L}(\theta) &= \mathbb{E}_{x_0 \sim p(x),\, t}\left[\left\lVert s_\theta(x, t) + \frac{\epsilon}{\sqrt{\beta_t}} \right\rVert^2\right] && (9) \\
\mathcal{L}_{\text{DDPM}}(\theta) &= \mathbb{E}_{x_0 \sim p(x),\, t}\left[\lVert \epsilon_\theta(x, t) - \epsilon \rVert^2\right] && (10)
\end{aligned}
$$

Notice that (9) is also referred to as the *Denoising score-matching loss*.

## Euler–Maruyama sampling

We can now plug into this SDE

$$
dx = \left[-\tfrac{1}{2}\beta(t)\, x - \beta(t) \nabla_x \log p_t(x)\right] dt + \sqrt{\beta(t)}\, d\bar{W}
$$

the neural network's estimate $s_\theta(x_t, t)$ that approximates the score function.

$$
dx = \left[-\tfrac{1}{2}\beta(t)\, x - \beta(t)\, s_\theta(x, t)\right] dt + \sqrt{\beta(t)}\, d\bar{W} \tag{11}
$$

If we want to actually use this continuous-time equation to generate samples, we need to discretize it first. There are many ways to do this, but we'll stick with the simplest: the Euler–Maruyama discretization.

First, we approximate the infinitesimal change $dx$ as the difference between $x$ at the next time step and $x$ at the current one, $x_{t+1} - x_t$. Instead of an infinitesimal change in time $dt$, we take a discrete time step $\Delta t$. Finally, we need to discretize also the Brownian process: it's just $\sqrt{\Delta t}$ times a sample from a normal distribution. And that's it, now we have a simple algorithm to generate samples using our trained neural network:

$$
x_{t+1} = x_t - \left[\tfrac{1}{2}\beta(t)\, x + \beta(t)\, s_\theta(x, t)\right] \Delta t + \sqrt{\beta(t)}\, \sqrt{\Delta t}\, \epsilon \tag{12}
$$

## Conclusion

Let's wrap things up with a quick recap. In DDPM, we started by describing the noising process as a discrete Markov chain. In contrast, the score-based formulation uses continuous stochastic differential equations (SDEs). To reverse the process, DDPM defines a reverse Markov chain where the neural network predicts the mean of a Gaussian. In score-based diffusion, we rely on theoretical results which give us a reverse-time SDE that depends on the score function. To train the network in DDPM, we used the ELBO. In score-based models, the network is trained to approximate the score function, using denoising score matching. In the end, in DDPM, we parametrize the network to output the amount of noise $\epsilon$. In score-diffusion the network outputs the score function $\nabla_x \log p_t(x)$. Despite these differences, the final loss in both cases is very similar — it's just a weighted $L_2$ loss against Gaussian noise.

With all that said, the score-based formulation is in my opinion much more general. We're not limited to a single SDE to corrupt the data. We also have more freedom in the implementation; we used the Euler–Maruyama solver, but many other numerical solvers are possible (Heun, Runge–Kutta, …). This SDE formulation is also the basis for an even more recent generative model called flow matching.

---

**References**

1. Brian D. O. Anderson. Reverse-time diffusion equation models. *Stochastic Processes and their Applications*, 12(3):313–326, 1982.
2. Jonathan Ho, Ajay Jain, and Pieter Abbeel. Denoising diffusion probabilistic models. In *Advances in Neural Information Processing Systems*, volume 33, pages 6840–6851, 2020. <https://proceedings.neurips.cc/paper/2020/hash/4c5bcfec8584af0d967f1800aa1c4b72-Abstract.html>
3. Diederik P. Kingma and Max Welling. Auto-encoding variational Bayes, 2013.
4. Jascha Sohl-Dickstein, Eric A. Weiss, Niru Maheswaranathan, and Surya Ganguli. Deep unsupervised learning using nonequilibrium thermodynamics. In *Proceedings of the 32nd ICML*, volume 37 of Proceedings of Machine Learning Research, pages 2256–2265. PMLR, 2015. <https://proceedings.mlr.press/v37/sohl-dickstein15.html>
5. Yang Song and Stefano Ermon. Generative modeling by estimating gradients of the data distribution, 2019.
6. Yang Song, Jascha Sohl-Dickstein, Diederik P. Kingma, Abhishek Kumar, Stefano Ermon, and Ben Poole. Score-based generative modeling through stochastic differential equations, 2020.
7. Pascal Vincent, Hugo Larochelle, Isabelle Lajoie, Yoshua Bengio, and Pierre-Antoine Manzagol. Stacked denoising autoencoders: Learning useful representations in a deep network with a local denoising criterion. Technical Report 1615, Département d'Informatique et de Recherche Opérationnelle, Université de Montréal, 2010.

<https://www.youtube.com/watch?v=lUljxdkolK8>
