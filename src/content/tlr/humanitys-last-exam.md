---
title: "The Test Built to Be Failed"
subtitle: "Humanity's Last Exam and the problem of benchmark saturation"
abstract: "Every benchmark in AI eventually gets solved: scores climb, the gap between the best models shrinks to a rounding error, and the test stops telling you anything useful. Humanity's Last Exam is what happens when someone tries to build a test that survives its own success."
date: 2026-09-15
tags: [Benchmarks, LLM, Evaluation]
---

## The problem with being too easy

Here's a pattern that keeps repeating in machine learning: a benchmark gets released, it's genuinely hard, researchers rally around it, progress happens — and then, a few years later, models are scoring in the high 90s and the benchmark is basically dead. Not wrong, just useless. When every serious model gets a near-perfect score, the benchmark can no longer tell you which model is actually better, only that they've both maxed it out. This is called saturation, and it's happened over and over: GLUE gave way to SuperGLUE, SQuAD's reading comprehension questions stopped being a real challenge, and even MMLU — for years the go-to test of broad knowledge — started drawing criticism as frontier models pushed into the high 80s and 90s.

Saturation isn't a sign that AI has "solved" reasoning or knowledge. It's usually a sign that the test had a ceiling, and everyone good enough eventually hits it. The honest response, every time, has been the same: build a harder test.

## So someone built an exam meant to be failed

Humanity's Last Exam (HLE) is the most deliberate version of that response so far. It came out of a conversation between Dan Hendrycks — a machine learning researcher who directs the Center for AI Safety — and Elon Musk, who thought existing benchmarks like MMLU had gotten too easy. Hendrycks partnered with Scale AI to do something unusual: instead of writing the questions themselves, they crowdsourced them from subject-matter experts around the world, then ran every submitted question past the leading AI models before accepting it. If a model got the question right, or even did better than random guessing on the multiple-choice ones, it was thrown out. Only the questions that stumped the best models made it through — followed by two more rounds of human expert review. There was even a prize pool of half a million dollars, with the best individual questions worth up to $5,000, which is a genuinely fun way to incentivize people to write the meanest question they can think of.

The result is a benchmark designed, from the ground up, to not be solved yet — and to keep a private, held-out set of questions specifically so models can't be trained to game the public ones.

## What's actually in it

HLE is 2,500 questions, and they're not trivia — the paper behind it describes them as requiring graduate-level expertise or knowledge of extremely narrow topics. Math dominates at 41% of the set, followed by biology/medicine (11%), computer science and AI (10%), physics and humanities/social science (9% each), chemistry (7%), engineering (4%), and a grab-bag "other" category. About 14% require reading both text and images, and roughly a quarter are multiple-choice; the rest demand a specific, exact-match answer with nowhere to hide.

To get a feel for how narrow "narrow" means here: one of the released example questions is about a specific paired bone found only in hummingbirds' wing anatomy, and asks how many tendons it supports. That's the flavor of the whole set — not "what is the capital of X," but the kind of question you'd only get right if you'd spent real time in that specific corner of a specific field.

## Nobody's close to acing it (yet)

As of the most recent published results, the best model on HLE — Claude Opus 4.8 — sits at 45.7% accuracy. Gemini 3.1 Pro Preview and GPT-5.5 are close behind at 44.7% and 44.3%. Other frontier models from Z.ai, Meta, Alibaba, MiniMax, DeepSeek, Moonshot, xAI, and Nvidia trail off from there, down to around 26–27% at the bottom of the published leaderboard. In other words: even the best AI systems in the world are still getting more than half of these questions wrong. Given how fast these numbers tend to move, they'll probably look outdated within a year of writing this — which, honestly, is exactly the point of building a benchmark this hard in the first place.

## The benchmark isn't perfect either

Here's the part I found most interesting, and the part that keeps this from turning into an uncritical "look how hard this test is" story: an independent group, FutureHouse, investigated the chemistry and biology questions and estimated that around 30% of the text-only answers in those categories might actually be wrong. The HLE team partially confirmed the finding and responded by launching HLE-Rolling, a continuously updated version meant to catch and fix errors as they're found, instead of treating the original release as gospel.

That's worth sitting with. Even a benchmark built specifically to be rigorous, reviewed twice by human experts, and filtered through the best AI models available — still shipped with meaningful errors. Difficulty and correctness aren't the same axis, and it's easy to mistake one for the other when a test looks intimidating.

## What this says about how we measure intelligence

The real story here isn't "will AI eventually ace Humanity's Last Exam." Of course it will, probably faster than most people expect — that's what happened to every benchmark before it. The more useful takeaway is the pattern itself: every hard test we build has a shelf life, and the shelf life keeps getting shorter as models improve faster than our ability to write questions that stump them. HLE isn't a finish line for AI capability, it's just the newest room in a building that keeps needing extensions.

Which means the actual skill in reading an AI benchmark score isn't knowing what the number is — it's knowing that the number is a snapshot of how far we are from saturating *that particular test*, not a verdict on how smart the thing actually is. That's a much less satisfying headline, but it's the honest one.
