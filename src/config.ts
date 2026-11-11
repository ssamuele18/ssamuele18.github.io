// Tutto quello che è "tuo" sta qui: cambia questi valori e il sito si aggiorna.
export const SITE = {
  name: 'Samuele Caldarini',
  tagline: 'Data Scientist · Statistics, ML & Deep Learning',
  intro:
    'I work with data for a living and for fun. Here you will find my CV, the projects I am proud of, and The Learning Rate, a place where I write about what made things click.',
  links: [
    { label: 'GitHub', href: 'https://github.com/ssamuele18?tab=repositories' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/samuele-caldarini-086304232' },
  ],
};

// Dati presi da public/cv.pdf. Telefono ed email restano solo nel PDF (non in chiaro sul sito).
export const CV = {
  location: 'Monza (MB), Italy',
  summary:
    'Data Scientist with an MSc in Mathematical Engineering from Politecnico di Milano. I work on forecasting, simulation and optimization for energy markets, and I have led the development of AI agents and LLM-based text pipelines. Statistics first, deep learning when it earns its place.',
  experience: [
    {
      role: 'Data Scientist',
      org: 'XIBER Energy Solutions',
      when: 'Jan 2026 – present',
      where: 'Milan, Italy',
      points: ['Forecasting, energy commodities, simulation, optimization and AI.'],
      tools: ['R', 'Python', 'SQL', 'GitHub'],
    },
    {
      role: 'Data Scientist – Lead',
      org: 'AlgoVerde.ai (startup)',
      when: 'Dec 2024 – Dec 2025',
      where: 'San Francisco, USA · full remote',
      points: ['Led the design and development of AI agents.'],
      tools: ['LangGraph', 'LangSmith', 'Python', 'Docker', 'GitHub'],
    },
    {
      role: 'Data Science Intern',
      org: 'Brembo N.V.',
      when: 'Jun 2024 – Nov 2024',
      where: 'Stezzano (BG), Italy',
      points: [
        'Statistical modelling, LLMs, text data and GenAI.',
        "Master's thesis: Synthetic data and GenAI for improved text classification: a Brembo case study.",
      ],
      tools: ['Azure Databricks', 'Python', 'R', 'SQL', 'MLflow', 'Spotfire'],
    },
  ],
  education: [
    {
      title: 'MSc in Data Science – Mathematical Engineering',
      org: 'Politecnico di Milano',
      when: 'Sep 2022 – Dec 2024',
      note: 'Thesis with Brembo on synthetic data and GenAI for text classification.',
    },
    {
      title: 'BSc in Mathematical Engineering',
      org: 'Politecnico di Milano',
      when: 'Sep 2019 – Sep 2022',
      note: '',
    },
  ],
  coursework: [
    'Applied statistics', 'Bayesian statistics', 'Nonparametric statistics', 'Machine learning',
    'Numerical analysis for deep learning', 'Scientific computing for mathematical modelling',
    'Econometrics', "Networks' complexity", 'Game theory',
  ],
  projects: [
    {
      title: 'Spatio-temporal Deep Survival Net for Zillow',
      when: 'Jun 2025',
      kind: 'Personal project · Python, R, PyTorch',
      text: 'Borrows information from nearby locations and time frames to capture smooth transitions and spatio-temporal heterogeneity, clearly improving survival predictions over one-size-fits-all or isolated regional models.',
    },
    {
      title: 'Surrogate Bayesian Physics-Informed Neural Network for surface reconstruction',
      when: 'Apr 2024',
      kind: 'University project · Python, PyTorch',
      text: 'A surrogate model that gives a fast yet accurate estimate of a surface over the whole domain from sparse data points (median MSE 4%).',
    },
    {
      title: 'Functional extension of the ITA18 Ground Motion Model',
      when: 'Feb 2024',
      kind: 'University project · R, Matlab',
      text: 'Extended the state-of-the-art discrete-time model used by Italian seismologists with functional regression, with bootstrap confidence intervals for the covariates of the continuous-time model, to support building safety.',
    },
  ],
  skills: [
    { group: 'Coding', items: ['Python', 'R', 'SQL', 'Git', 'Matlab', 'C++', 'LaTeX'] },
    { group: 'Methods', items: ['Forecasting', 'Simulation & optimization', 'Geostatistics', 'Time series', 'Functional data analysis', 'Survival analysis', 'LLMs & AI agents'] },
    { group: 'Tools', items: ['Databricks', 'MLflow', 'Docker', 'LangGraph', 'LangSmith', 'Shiny', 'Streamlit', 'Posit Connect Cloud', 'Cloudflare', 'Spotfire', 'Positron', 'VS Code', 'RStudio'] },
    { group: 'Extra courses', items: ['Probabilistic AI', 'Causal inference', 'Deep reinforcement learning', 'Time series analysis'] },
    { group: 'Languages', items: ['Italian (native)', 'English (C1, IELTS)', 'French (B1)', 'Spanish (B1)'] },
  ],
  extra: [
    { label: 'Further education', text: 'Kaplan International Schools, Dublin · IELTS C1' },
    { label: 'Scholarship', text: 'Merit-based scholarship, BCC Carate & Treviglio (Dec 2022)' },
    { label: 'Volunteering', text: 'Blood donor (2022 – present) · AIM member and mentor (2020 – present)' },
    { label: 'Interests', text: 'Swimming, cars, photography, travelling and board games. Favourite movie: Inception.' },
  ],
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
