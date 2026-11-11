---
title: "Il titolone del tuo prossimo articolo"
subtitle: "Sottotitolo opzionale"
abstract: "Due o tre frasi: di cosa parla e perché vale la pena leggerlo."
date: 2026-11-11
tags: [statistics]
author: "Il tuo nome"
draft: true   # metti false (o cancella la riga) per pubblicarlo
---

## Una sezione che dice qualcosa

Testo normale. Formula inline: $\hat{\beta} = (X^\top X)^{-1} X^\top y$.

Formula a blocco:

$$
\mathcal{L}(\theta) = -\frac{1}{n}\sum_{i=1}^{n} \log p_\theta(y_i \mid x_i)
$$

Immagine (metti il file in `public/img/`):

![Didascalia](/img/esempio.png)

Codice mostrato ma non eseguito:

```python
import pandas as pd
df = pd.read_csv("dati.csv")
```
