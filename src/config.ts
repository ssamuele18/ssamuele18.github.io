// Tutto quello che è "tuo" sta qui: cambia questi valori e il sito si aggiorna.
export const SITE = {
  name: 'Samuele Caldarini',
  tagline: 'Data Scientist · Statistics, ML & Deep Learning',
  intro:
    'I work with data for a living and for fun. Here you will find my CV, the projects I am proud of, and The Learning Rate, a place where I write about what made things click.',
  links: [
    { label: 'GitHub', href: 'https://github.com/ssamuele18?tab=repositories' },
    { label: 'LinkedIn', href: 'www.linkedin.com/in/samuele-caldarini-086304232' },
  ],
};

export const CV = {
  summary:
    'Data Scientist with a background in Mathematical Engineering, working on applied statistical modelling, machine learning and data engineering in R and Python.',
  experience: [
    {
      role: 'Data Scientist',
      org: 'Your company',
      when: '2025 – present',
      points: [
        'Describe one concrete result with a number.',
        'Describe another one, focusing on impact rather than tools.',
      ],
    },
  ],
  education: [
    {
      title: 'MSc in Data Science',
      org: 'Your university',
      when: '2023 – 2026',
      note: 'Thesis topic or honours here.',
    },
    {
      title: 'BSc in Mathematical Engineering',
      org: 'Your university',
      when: '2020 – 2023',
      note: '',
    },
  ],
  skills: [
    { group: 'Languages', items: ['R', 'Python', 'SQL'] },
    { group: 'Statistics', items: ['Survival analysis', 'Geostatistics', 'Time series', 'Causal inference'] },
    { group: 'ML / DL', items: ['Deep learning', 'Forecasting', 'Interpretable models'] },
  ],
  // Metti qui il PDF del CV in public/cv.pdf per attivare il pulsante di download
  pdf: '/cv.pdf',
};

export const PROJECTS = [
  {
    title: 'Where DL Fails',
    subtitle: 'Survival analysis & geostatistics for interpretable house-pricing models',
    when: 'Mar – Jun 2025',
    summary:
      'Starting from the Zillow Zestimate challenge, I traded accuracy for interpretability: Universal Kriging, Kaplan-Meier and Nelson-Aalen estimators, Survival Forests and Deep Survival Nets to understand why some homes sell faster than others.',
    tags: ['Kriging', 'Survival analysis', 'Deep Survival Nets'],
    href: '/tlr/where-dl-fails',
  },
];
