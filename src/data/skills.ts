export interface SkillGroup {
  category: string;
  icon: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Backend & APIs",
    icon: "server",
    skills: ["Python", "Django", "Django REST Framework", "FastAPI", "Celery"],
  },
  {
    category: "Databases",
    icon: "database",
    skills: ["PostgreSQL", "Oracle", "SQLite", "Data Modeling", "Query Optimization"],
  },
  {
    category: "DevOps & Cloud",
    icon: "cloud",
    skills: ["Docker", "AWS", "CI/CD", "Linux", "Nginx"],
  },
  {
    category: "Frontend",
    icon: "monitor",
    skills: ["JavaScript", "HTML/CSS", "Next.js", "React"],
  },
  {
    category: "Testing & QA",
    icon: "check",
    skills: ["PyTest", "Unit Testing", "Test-Driven Development", "API Testing"],
  },
  {
    category: "Enterprise & ERP",
    icon: "briefcase",
    skills: ["ERP Integration", "SAP", "Oracle ERP", "SOX Compliance", "US GAAP / BR GAAP"],
  },
  {
    category: "Project & Architecture",
    icon: "layers",
    skills: ["PRINCE2®", "Data Architecture", "System Design", "Technical Leadership"],
  },
  {
    category: "AI & Emerging",
    icon: "cpu",
    skills: ["AI Engineering", "Pair Programming with AI", "LLM Integration", "Prompt Engineering"],
  },
];
