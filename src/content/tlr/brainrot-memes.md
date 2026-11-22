---
title: "Brainrot Memes at Your Fingertips"
subtitle: "Part 1: Denoising Diffusion Probabilistic Models, step by step"
abstract: >-
  Diffusion models generate images, videos, music and memes, but the theory behind them can feel dense.
  Following the DDPM paper step by step, we build the forward noising process, the learned reverse process
  and the ELBO, and watch the training objective collapse into a plain squared error on the noise.
date: 2025-05-06
tags: [Diffusion models, Generative AI, Deep Learning]
---

## Introduction

Diffusion models are now used in just about every domain you can think of: generating images, videos, music, memes and even useful things like drug discovery and protein folding problems. But while the results are very impressive, the underlying theory can feel a bit *dense*. There are lots of important details not to miss and the math isn't always friendly at first glance. We'll try to untangle the key ideas behind diffusion models by following step by step the research paper that made them so popular.

## General principles

The paper that brought diffusion models into the spotlight is called "Denoising Diffusion Probabilistic Models", or DDPM, by Jonathan Ho et al. [1]. Despite its reputation, this paper did not introduce diffusion models, nor did it coin the term. The earliest known reference to diffusion models comes from a 2015 paper titled "Deep Unsupervised Learning using Nonequilibrium Thermodynamics" [2]. In 2015, GANs were considered state-of-the-art in image generation research, and diffusion models received little to no attention.

In contrast, the 2020 DDPM paper quickly gained traction, and it is now the most cited work in the field with more than 30,000 citations as of 2025. If you look up diffusion models on any search engine, this is probably the first paper you'll come across. The main contribution of this paper was to take diffusion models from a theoretical concept — previously limited to simple toy datasets — into a SOTA technique for image generation. On the technical side, it mainly introduced a much simpler training objective compared to the 2015 version. This made the method more accessible, and highlighted interesting connections to earlier works on denoising models. Now, let's break down the core idea after giving a first definition of the acronym:

> *DDPMs*: Denoising Diffusion Probabilistic Models are a type of generative AI model that creates high-quality data, like images, by learning to reverse a gradual process of adding noise to data.

In the context of data generation, let's start with a probability distribution $p(x)$, which represents our training data. For instance in the case of images, we can think of this distribution as representing all natural images, or even just a subset of them containing only faces. Of course, this distribution is so complex that we can't really find a single expression to describe it completely, and there are probably no such expressions anyway. But even without an explicit formula, we still want to generate new images, which is equivalent to sampling new points from this underlying distribution.
So the challenge is to find a way to create new samples without actually having a good, comprehensive, way of describing the distribution itself.

Diffusion models tackle this problem with a seemingly unrelated process, by removing Gaussian noise from images. First, we gradually corrupt the images by adding noise. At each step, a small amount of noise is added slowly erasing the structure of the initial image. If we continue this process for many steps, the image eventually turns into pure noise. The key idea is then to train a model that learns to reverse these steps, and remove the noise bit by bit. If the model is effective, it should be able to start from random noise and refine it step by step into a meaningful image. Now, let's see how the DDPM paper formulates this process mathematically.

## Forward process

Let's start with an image, which we'll call $x_0 \in \mathbb{R}^n$ for some $n \in \mathbb{N} \gg 1$, as the starting point of the noising process. For now we can also assume that this image does not contain any noise. To generate the next image, $x_1$, we use a conditional distribution: $q(x_1 \mid x_0)$. We produce $x_1$ by adding some amount of Gaussian noise $\epsilon$. The amount of noise is controlled by a scalar value, $\beta$. Then the actual distribution describing $x_1$ is just a Gaussian centered on $x_0$ with noise of variance $\beta$. So rather than seeing this as adding noise to $x_0$, we can just imagine that we take a sample from a Gaussian distribution of variance $\beta$, centred on $x_0$. More formally:

$$
q(x_1 \mid x_0) \sim \mathcal{N}(x_0, \beta)
$$

Then, to go to the next step, we repeat the same thing. This time we label the distribution as $q(x_2 \mid x_1)$. Again the operation is simply taking the previous step and adding some amount $\beta$ of Gaussian noise. Which is the same as taking a sample from a Gaussian distribution centered on $x_1$ with variance $\beta$.

Now, since we are just summing the noise terms, we can go straight from $x_0$ to $x_2$. The image $x_2$ is created by adding twice as much noise, which is the same as sampling from a Gaussian centred on $x_0$, with variance $2\beta$.

$$
q(x_2 \mid x_0) \sim \mathcal{N}(x_0, 2\beta)
$$

Now we have an issue with this process. What we wanted was a process that gradually transforms our data into a standard normal distribution; clearly, that's not what's happening here. The mean always stays fixed at $x_0$ and is never modified by the process, while the variance keeps increasing indefinitely. So in this setup, there is absolutely no chance that our diffusion process converges to the normal distribution. In this diffusion process, the variance just keeps growing without bound: in the literature we often say that the **variance explodes**; and we call this process the **variance exploding diffusion**. So let's stay away from this formulation for now and let's describe a diffusion process that actually converges to some distribution.

## Variance preserving forward process

In the DDPM paper, the authors made the choice to use a noising process that converges to a normal distribution, which is often called variance preserving, so let's see how they do it.

A diffusion process that works and manages to get us to the objective, i.e. $q(x_t \mid x_0) \to \mathcal{N}(0, 1)$, must satisfy two conditions:

- the mean converges to 0
- the variance converges to 1

To achieve this, we will modify the way we move from a step to the given next. Namely the expression to be used is:

$$
x_t = \sqrt{1 - \beta} \cdot x_{t-1} + \sqrt{\beta} \cdot \epsilon, \qquad \epsilon \sim \mathcal{N}(0, I)
$$

where $\sqrt{1 - \beta}$ is one of the multiple other valid choices one could use, but for coherence I used the same as in [1].

This becomes pretty handy and convenient when we represent the conditional distribution at a given timestep, and can be re-written as:

$$
x_t = \sqrt{\bar\alpha_t} \cdot x_0 + \sqrt{1 - \bar\alpha_t} \cdot \epsilon
$$

so to go from the noiseless input $x_0$ to $x_t$ we just have to apply this formula. It now depends on the term $\bar\alpha_t$ which is simply defined as:

$$
\bar\alpha_t = (1 - \beta)^t
$$

But does this allow us to actually converge to the normal distribution?
Well, if we choose $\beta \in (0, 1)$ it's easy to see that $\bar\alpha_t$ will converge to 0, hence leaving the equation above to be pure white noise. And just like that we have a proper variance preserving diffusion process.

This formula is supposed to take our data distribution $p(x)$ and slowly (not so slowly actually because we can avoid to iterate by simply multiplying by all the forward steps we need) transform it into a normal distribution by means of convolution products. The definition for $\bar\alpha_t$ in [1] is slightly different to be completely honest. It accounts for the fact that $\beta$ is not fixed at every step, meaning that the diffusion process can take into account different degrees of noise within a single process.

$$
\bar\alpha_t = \prod_{i=1}^{t} (1 - \beta_i)
$$

Please notice that the equation makes sense iff $\beta_i \in (0, 1)\ \forall i$.

The diffusion process is now properly defined and allows us to transform any distribution into a $Z$ distribution. Reversing the diffusion process can be quite challenging from a computational perspective, but deep learning usually is the answer to these kind of problems.

## Reverse process

Let's recall once again that there exists a forward process that enables us to go from our clean image $x_0$ to a Gaussian noise sample $x_T$, using the probability densities $q(\cdot)$. Now let's assume there is a way to reverse these individual steps, and let's represent it with a probability density $p(\cdot)$, which produces $x_{t-1}$ given $x_t$. Just like we defined conditional distributions $q(\cdot)$ to go forward from one step to the next, we now define conditional distributions $p(\cdot)$ to go backward in the opposite direction.
While in the forward process all parameters are fixed, for the reverse process our goal is actually to find the best parameters $\theta$ that allow us to remove the noise effectively. And as you've probably guessed, these parameters $\theta$ will be the weights of a neural network.

How do we train this network? Well, we'll adopt a very standard approach in Bayesian statistics, which is to minimize the negative log likelihood of producing a sample with our model, i.e.

$$
-\log p_\theta(x_0)
$$

This means finding the best set of parameters $\theta$ that maximizes the likelihood of generating real samples $x_0$ from our data distribution, using the neural network. But instead of maximizing $p_\theta(x_0)$ directly, we minimize the negative log likelihood, which in practice is easier in many cases also from a computational perspective. Before going further, let's define some useful notations clearly.

The joint probability describing the distribution of all the variables from $x_1$ to $x_T$ given $x_0$ represents our complete forward process

$$
q(x_1, \dots, x_T \mid x_0) = q(x_1 \mid x_0)\, q(x_2 \mid x_1, x_0) \dots q(x_T \mid x_{T-1}, \dots, x_0)
$$

Using Bayes' theorem, we can decompose this joint probability into individual conditional distributions. The neat thing is that since our forward process is a Markov chain, each noising step depends only on the previous step, which simplifies these conditional probabilities into:

$$
q(x_1, \dots, x_T \mid x_0) = q(x_1 \mid x_0)\, q(x_2 \mid x_1) \dots q(x_T \mid x_{T-1}) = q(x_{1:T} \mid x_0)
$$

that can be written in an even more compact form, using the standard notation for products

$$
q(x_{1:T} \mid x_0) = \prod_{t=1}^{T} q(x_t \mid x_{t-1})
$$

$$
p_\theta(x_{0:T}) = p_\theta(x_T) \prod_{t=1}^{T} p_\theta(x_{t-1} \mid x_t)
$$

We use the same compact notation for the joint distribution describing our **complete reverse process**. As you may have noticed, the reverse process is not conditioned on anything: indeed, we will start from pure Gaussian noise, without prior knowledge, whereas the forward process requires an input image $x_0$.

## The ELBO

Now that we have expressions describing clearly our complete forward and reverse processes, let's try to find an expression for the negative log likelihood. Generally speaking, when dealing with joint probabilities, a useful first step is often to marginalize the distribution with respect to the other variables. Doing this gives us that $p_\theta(x_0)$ is simply the integral of the joint probability with respect to all the other variables. Now could we compute the likelihood using just this formula? Not really. What this integral means is that to compute the probability that our neural network generates a sample $x_0$, we would have to sum over all possible paths capable of generating it. Ok, but that does not mean we can't compute the negative log likelihood at all!

Let's now use a very well-known trick: we multiply and divide by the density representing our forward process. We can rewrite this integral as an expectation, making the expression slightly more compact. And here comes another very well-known trick: Jensen's inequality in equation (4) below. The negative log function is known to be convex, so we can put the log inside the expectation at the cost of introducing an inequality. And now we obtain an upper bound on our negative log likelihood, often called the Evidence Lower BOund, or ELBO. Since it's an upper bound on the negative log likelihood, it corresponds to a lower bound on the likelihood itself.

$$
\begin{aligned}
-\log p_\theta(x_0) &= -\log \int p_\theta(x_{0:T})\, dx_{1:T} && (1) \\
-\log p_\theta(x_0) &= -\log \int q(x_{1:T} \mid x_0) \frac{p_\theta(x_{0:T})}{q(x_{1:T} \mid x_0)}\, dx_{1:T} && (2) \\
-\log p_\theta(x_0) &= -\log \mathbb{E}_{q(x_{1:T} \mid x_0)}\left[\frac{p_\theta(x_{0:T})}{q(x_{1:T} \mid x_0)}\right] && (3) \\
-\log p_\theta(x_0) &\leq -\mathbb{E}_{q(x_{1:T} \mid x_0)}\left[\log \frac{p_\theta(x_{0:T})}{q(x_{1:T} \mid x_0)}\right] && (4)
\end{aligned}
$$

Now, we'll try to make sense of this training objective by modifying and simplifying its expression further. With some straightforward algebra and Bayes' theorem, we can rewrite the ELBO to this more useful expression:

$$
\mathbb{E}_q\left[D_{\mathrm{KL}}\big(q(x_T \mid x_0) \,\|\, p(x_T)\big) + \sum_{t>1} D_{\mathrm{KL}}\big(q(x_{t-1} \mid x_t, x_0) \,\|\, p_\theta(x_{t-1} \mid x_t)\big) - \log p_\theta(x_0 \mid x_1)\right]
$$

This new expression might look intimidating at first glance, but as usual, there's some intuition behind it. The first thing you might notice is the Kullback–Leibler divergence term, which we refer to as $D_{\mathrm{KL}}$. The KL divergence is a way of measuring how close two probability distributions are — you can think of it as a kind of distance in probability space. If the distributions are very different, for example they have different means or variances, the KL divergence will be large. On the other hand, if the distributions are very similar, the KL divergence becomes small and it actually reaches zero only when the two distributions are exactly the same. So, going back to our loss expression, we see that it's essentially measuring how far apart $q(\cdot)$ and $p(\cdot)$ are.

Before we specify what these distributions are, we can simplify this expression further. The first term on the left doesn't depend on $\theta$, so we can ignore it when optimizing the model. The last term on the right does depend on the weights of the network, and it measures how likely the model is to reconstruct a clean image $x_0$ from a slightly noisier one $x_1$. But remember, in diffusion models, we usually take about a thousand denoising steps. So by the time we go from $x_1$ to $x_0$, there's barely any noise left, the model has already recovered most of the image. As a result, this term is pretty small and doesn't provide much extra learning signal. In practice, including it in the loss makes little to no difference, so we usually drop it.

That leaves us with the main part: a big sum of KL divergences between some distributions.

$$
\mathbb{E}_q\left[\sum_{t>1} D_{\mathrm{KL}}\big(q(x_{t-1} \mid x_t, x_0) \,\|\, p_\theta(x_{t-1} \mid x_t)\big)\right]
$$

We know that $p_\theta(x_{t-1} \mid x_t)$ is our reverse diffusion step. But what exactly is the other distribution, $q(x_{t-1} \mid x_t, x_0)$? Well, this distribution is what we call the **true posterior**. If we have our forward process $q(x_t \mid x_{t-1})$ we know there's a reverse process, which we're trying to approximate, by adjusting the parameters of a distribution $p$. Now, if we also condition on the original image, $x_0$, we can actually compute the exact reverse process. This process, which uses the clean image $x_0$, is what we call the true posterior. And the nice thing is, we actually have a closed-form expression for it.

You might be wondering: *Why do I need a neural network if we already have a closed-form expression for reversing the noise?* The answer is: using this true posterior is cheating, because it requires us to know $x_0$ and during inference, our goal is to **generate** $x_0$ starting from pure noise. So of course, we can't use the true posterior conditioned on $x_0$ to produce new samples. But we can apply it when $x_0$ is known, like during training, which is exactly what we're doing here. So what we're really doing with this loss function is training the neural network to match the true posterior, the one we could compute if we had access to $x_0$ even though in practice, the network only sees $x_t$.

Now, about the expression of this true posterior, with the proper assumptions it turns out that its distribution is Gaussian, with mean $\tilde\mu_t$ and variance $\tilde\beta_t$.
We also need to choose a form for our approximate posterior $p_\theta(x_{t-1} \mid x_t)$. Naturally, we'll make it Gaussian, and there are two reasons for that. First, there's a theorem that says the reverse of a Gaussian Markov chain is also Gaussian — so choosing a Gaussian makes sense. And second, everything is just simpler when working with Gaussians. Our neural network will therefore predict the parameters of this density — its mean, $\mu_\theta$, and variance, $\sigma_\theta$, which controls its spread. To simplify things even further, the authors choose to fix the variance of the approximate posterior to a constant $\sigma_t$, which is not learned. That means the neural network only has to learn $\mu_\theta$.

### Moment matching

Since we're trying to match two Gaussian distributions, but can only control the mean of the approximate one, the best we can do is bring its mean as close as possible to the mean of the true posterior. Said differently, we aim to minimize the distance between the two means. And in fact, that's exactly how the KL divergence behaves in this case. As you can see, in this setting, the KL divergence simplifies to a plain squared distance between the means of the Gaussians.

$$
D_{\mathrm{KL}}\big(q(x_{t-1} \mid x_t, x_0) \,\|\, p_\theta(x_{t-1} \mid x_t)\big) = \frac{1}{2\sigma_t^2} \lVert \tilde\mu_t - \mu_\theta \rVert^2 \tag{5}
$$

So, zooming out: minimizing the sum of KL divergences in our objective function really just means bringing each approximate posterior closer to its true counterpart. And since we can only control the mean of each approximate posterior, we just try to reduce its distance to the mean of each true posterior.

## From ELBO to $L_2$ to …

Now that we have a better intuition of the ELBO, we'll simplify it further to state the final training objective. We just saw that each of the KL divergence terms in this sum simplifies into a squared distance — so overall, we're minimizing a sum of $L_2$ distances. Each of these terms measures how far the predicted-mean $\mu_\theta$ is from the true posterior-mean $\tilde\mu$, and the distance is weighted by a factor that depends on $\sigma_t$.

$$
\mathbb{E}_q\left[\sum_{t>1} \frac{1}{2\sigma_t^2} \lVert \tilde\mu_t - \mu_\theta(x_t, t) \rVert^2\right]
$$

We want to simplify again the writing above and we do have a closed-form expression for the true posterior mean $\tilde\mu$, but it is a bit complicated:

$$
\tilde\mu_t = \frac{\sqrt{\bar\alpha_{t-1}}\, \beta_t}{1 - \bar\alpha_t} x_0 + \frac{\sqrt{\alpha_t}\, (1 - \bar\alpha_{t-1})}{1 - \bar\alpha_t} x_t \tag{6}
$$

As you can see, it's a weighted combination of $x_0$ and $x_t$, which is not very convenient to work with.
Now thanks to the reparameterization trick, we can write $x_t$ as being the sum between $x_0$ and a pure Gaussian noise $\epsilon$ in this way $x_t = \sqrt{\bar\alpha_t}\, x_0 + \sqrt{1 - \bar\alpha_t}\, \epsilon$.

Conversely, we can also write $x_0$ as depending only on $x_t$ and $\epsilon$: $x_0 = \frac{1}{\sqrt{\bar\alpha_t}}\left(x_t - \sqrt{1 - \bar\alpha_t}\, \epsilon\right)$. If we plug this into the expression of $\tilde\mu$, we also get an expression that depends only on $x_t$ and $\epsilon$:

$$
\tilde\mu_t = \frac{1}{\sqrt{\alpha_t}}\left(x_t - \frac{\beta_t}{\sqrt{1 - \bar\alpha_t}}\, \epsilon\right)
$$

Then comes the key idea: since the denoiser also has access to $x_t$, we can apply the same trick to the network's predicted mean $\mu_\theta$, and we write it as a function of $x_t$ and a predicted noise term $\epsilon_\theta$ as:

$$
\mu_\theta(x_t, t) = \frac{1}{\sqrt{\alpha_t}}\left(x_t - \frac{\beta_t}{\sqrt{1 - \bar\alpha_t}}\, \epsilon_\theta(x_t, t)\right) \tag{7}
$$

Now if we plug both of these expressions into the loss, the terms in $x_t$ cancel out, revealing our final objective function.

$$
\mathcal{L} = \mathbb{E}_q\left[\sum_{t>1} \frac{\beta_t^2}{2\sigma_t^2\, \alpha_t (1 - \bar\alpha_t)} \lVert \epsilon - \epsilon_\theta(x_t, t) \rVert^2\right] \tag{8}
$$

We're left with a plain squared distance between $\epsilon$ and $\epsilon_\theta$. So $\epsilon_\theta$ becomes the network's estimate of the noise that was added to $x_0$ to produce $x_t$ — and minimizing the quadratic loss just means making this prediction as accurate as possible. However, we can do a final simplification. Instead of summing over all time steps we just pick a random time instant $t$ and include it in the expectation.

$$
\mathbb{E}_{q,t}\left[\frac{\beta_t^2}{2\sigma_t^2\, \alpha_t (1 - \bar\alpha_t)} \lVert \epsilon - \epsilon_\theta(x_t, t) \rVert^2\right] \tag{9}
$$

## Conclusions

A more general approach to the problem involves substituting Markov chains with continuous time SDEs, forcing us to leave the discrete time steps world.

Oh… and btw, this paper is what led humanity to:

<!-- FIGURE: the shark-with-sneakers meme. Add as ![The shark with sneakers](/img/shark-sneakers.png) -->

---

**References**

1. Jonathan Ho, Ajay Jain, and Pieter Abbeel. Denoising diffusion probabilistic models. In *Advances in Neural Information Processing Systems*, volume 33, pages 6840–6851, 2020. <https://proceedings.neurips.cc/paper/2020/hash/4c5bcfec8584af0d967f1800aa1c4b72-Abstract.html>
2. Jascha Sohl-Dickstein, Eric A Weiss, Niru Maheswaranathan, and Surya Ganguli. Deep unsupervised learning using nonequilibrium thermodynamics. In *Proceedings of the 32nd ICML*, volume 37 of Proceedings of Machine Learning Research, pages 2256–2265. PMLR, 2015. <https://proceedings.mlr.press/v37/sohl-dickstein15.html>

<https://www.youtube.com/watch?v=EhndHhIvWWw>

**Part 2 follows:** [Score-Based Diffusion Models](/tlr/score-based-diffusion-models)
