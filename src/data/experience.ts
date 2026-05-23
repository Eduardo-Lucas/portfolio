export interface Experience {
  company: string;
  role: string;
  period: string;
  duration: string;
  location: string;
  description?: string[];
  tags?: string[];
  current?: boolean;
}

export const experience: Experience[] = [
  {
    company: "Fornax Tecnologia",
    role: "Data Architect",
    period: "Nov 2025 – Present",
    duration: "7 months",
    location: "São Paulo, Brazil",
    current: true,
    description: [
      "Designing enterprise-grade data architectures for business-critical systems.",
      "Defining data models, pipelines, and governance strategies.",
    ],
    tags: ["Data Architecture", "Python", "PostgreSQL", "AWS"],
  },
  {
    company: "DGTAX®",
    role: "Python Developer",
    period: "Nov 2021 – Present",
    duration: "4+ years",
    location: "Salvador, Bahia, Brazil",
    current: true,
    description: [
      "Building and maintaining robust tax-tech platform features using Python/Django.",
      "Designing REST APIs consumed by frontend and third-party integrations.",
      "Improving system performance and maintainability across the stack.",
    ],
    tags: ["Python", "Django", "DRF", "PostgreSQL", "Docker"],
  },
  {
    company: "Green Tech Innovation",
    role: "IT Manager",
    period: "Oct 2024 – Oct 2025",
    duration: "1 year",
    location: "Salvador, Bahia, Brazil",
    description: [
      "Led IT strategy and team across infrastructure, development, and operations.",
      "Aligned technology initiatives with business transformation objectives.",
    ],
    tags: ["IT Management", "Digital Transformation", "Leadership"],
  },
  {
    company: "MTM Tecnologia",
    role: "Senior Developer – mobileX",
    period: "Apr 2024 – May 2024",
    duration: "2 months",
    location: "Salvador, Bahia, Brazil",
    description: ["Mobile backend development using Python services."],
    tags: ["Python", "Mobile Backend"],
  },
  {
    company: "ATECH – Negócios em Tecnologias S/A",
    role: "Senior Software Developer",
    period: "May 2022 – Feb 2024",
    duration: "1 year 10 months",
    location: "São Paulo, Brazil",
    description: [
      "Developed mission-critical software for enterprise clients in the aerospace and defense sectors.",
      "Worked with Python, Django REST Framework, and Oracle databases.",
      "Contributed to modernizing legacy systems into distributed architectures.",
    ],
    tags: ["Python", "Django", "Oracle", "REST API", "Enterprise"],
  },
  {
    company: "Blinctek",
    role: "Python / Django Developer",
    period: "Dec 2021 – Apr 2022",
    duration: "5 months",
    location: "Salvador, Bahia, Brazil",
    description: ["Full-stack Python/Django development for SaaS products."],
    tags: ["Python", "Django", "PostgreSQL"],
  },
  {
    company: "HelloGym",
    role: "Python Django Developer",
    period: "Aug 2021 – Dec 2021",
    duration: "5 months",
    location: "Minnesota, USA",
    description: [
      "Developed backend APIs for a US-based fitness platform.",
      "Remote collaboration with international team across time zones.",
    ],
    tags: ["Python", "Django", "REST API", "International"],
  },
  {
    company: "MAPESolutions",
    role: "IT Consultant – Python / Django",
    period: "Jan 2021 – Aug 2021",
    duration: "8 months",
    location: "São Paulo, Brazil",
    description: [
      "Provided technical consulting and Python/Django development for business clients.",
    ],
    tags: ["Python", "Django", "Consulting"],
  },
  {
    company: "TRACTEBEL",
    role: "Python / Django Software Developer",
    period: "May 2020 – Dec 2020",
    duration: "8 months",
    location: "Remote",
    description: [
      "Built data-driven applications for the energy sector using Python and Django.",
    ],
    tags: ["Python", "Django", "Energy Sector"],
  },
  {
    company: "Extreme Digital Solutions – EDS",
    role: "IT Project Manager",
    period: "Dec 2019 – Apr 2020",
    duration: "5 months",
    location: "Salvador, Brazil",
    description: ["Managed IT project portfolios and delivery timelines."],
    tags: ["Project Management", "PRINCE2"],
  },
  {
    company: "Usesoft do Brasil",
    role: "Technology Director / IT Project Manager",
    period: "Oct 2015 – Sep 2019",
    duration: "4 years",
    location: "Salvador, Brazil",
    description: [
      "Directed technology strategy and managed a team of developers.",
      "Oversaw ERP implementations and customizations using Oracle.",
      "Managed IT project portfolio and delivery excellence.",
    ],
    tags: ["Leadership", "ERP", "Oracle", "Project Management"],
  },
  {
    company: "Cristal",
    role: "IT Specialist",
    period: "Aug 1989 – May 2015",
    duration: "25+ years",
    location: "Brazil & USA",
    description: [
      "25+ year tenure spanning every layer of enterprise IT.",
      "Led SPED Contábil and FCONT implementation projects.",
      "ERP/Oracle integration with Deloitte for business process design.",
      "Gap Analysis for SAP ERP (Plant Maintenance & Project System modules).",
      "SOX audit mechanisms with US headquarters in Houston, Texas.",
      "Adapted internal ERP for US GAAP / BR GAAP compliance.",
      "Part of the global IT Leaders group spanning 5 continents — collaborating with colleagues in India, Australia, UK, France, and beyond.",
    ],
    tags: ["ERP", "Oracle", "SAP", "SOX", "US GAAP", "Enterprise IT"],
  },
];
