# Portfolio + The Learning Rate (Astro)

Sito statico: Home animata, CV, Projects e TLR (articoli raggruppati per trimestre, con formule LaTeX).
Tutto gratis: build con Astro, hosting su GitHub Pages.

## Avvio in locale
```bash
npm install
npm run dev        # http://localhost:4321
```

## Cosa cambiare per primo
- `src/config.ts` → nome, tagline, link social, CV, progetti
- `public/cv.pdf` → il tuo CV (il pulsante "Download PDF" punta qui)
- `astro.config.mjs` → `site` con il tuo username GitHub

## Scrivere un nuovo articolo TLR
1. Copia `src/content/tlr/_template.md` in `src/content/tlr/nome-articolo.md`
2. Compila titolo, abstract, data, tag e metti `draft: false` (o togli la riga)
3. Scrivi in Markdown: formule con `$...$` e `$$...$$`, immagini in `public/img/`
4. Il trimestre (Q1–Q4) viene calcolato dalla data: l'articolo finisce nel toggle giusto da solo

## Pubblicare su GitHub Pages
1. Crea una repo su GitHub (se si chiama `USERNAME.github.io` il sito sta alla radice)
2. `git init && git add . && git commit -m "first commit"` e fai push su `main`
3. Su GitHub: Settings → Pages → Source: **GitHub Actions**
4. Ogni push su `main` ripubblica il sito (workflow in `.github/workflows/deploy.yml`)

Se la repo ha un nome diverso da `USERNAME.github.io`, in `astro.config.mjs` imposta `base: '/nome-repo'`.

## Idee per la fase 2
- Cambiare l'sfondo (`src/components/RegressionBackground.astro`): regressione che si adatta con lo scroll
- Colori e font in `src/styles/global.css` (variabili in `:root`)
- Dominio personalizzato (unica cosa a pagamento, facoltativa)
