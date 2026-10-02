import type { Question, SubjectCombination, Topic } from "./types";

export const subjectCombinations: SubjectCombination[] = [
  {
    slug: "science",
    label: "Science",
    description: "Physics, Chemistry, Biology and Mathematics.",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics"],
  },
  {
    slug: "arts",
    label: "Arts",
    description: "Literature, Government, CRS and Mathematics.",
    subjects: ["Literature in English", "Government", "CRS", "Mathematics"],
  },
  {
    slug: "commercial",
    label: "Commercial",
    description: "Accounting, Commerce, Economics and Mathematics.",
    subjects: ["Accounting", "Commerce", "Economics", "Mathematics"],
  },
];

const TOPIC_BANK: Record<string, string[]> = {
  Physics: ["Motion & Forces", "Waves & Optics", "Electricity", "Modern Physics"],
  Chemistry: ["Atomic Structure", "Chemical Bonding", "Acids & Bases", "Organic Chemistry"],
  Biology: ["Cell Biology", "Genetics", "Ecology", "Human Physiology"],
  Mathematics: ["Algebra", "Trigonometry", "Calculus Basics", "Statistics & Probability"],
  "Literature in English": ["Prose Analysis", "Poetry Forms", "Drama & Setting", "African Literature"],
  Government: ["Systems of Government", "The Nigerian Constitution", "Political Parties", "International Relations"],
  CRS: ["The Old Testament", "The New Testament", "Christian Ethics", "Church History"],
  Accounting: ["Double-Entry Basics", "Final Accounts", "Depreciation", "Partnership Accounts"],
  Commerce: ["Trade & Aids to Trade", "Business Units", "Insurance", "Stock Exchange"],
  Economics: ["Demand & Supply", "Market Structures", "National Income", "Money & Banking"],
};

export function getTopicsForSubject(subject: string): Topic[] {
  const topics = TOPIC_BANK[subject] ?? [
    "Foundations",
    "Core Concepts",
    "Applied Problems",
    "Exam Technique",
  ];
  return topics.map((title, index) => ({
    id: `${subject.toLowerCase().replace(/\s+/g, "-")}-topic-${index}`,
    title,
    summary: `A verified walkthrough of ${title.toLowerCase()} for the current syllabus, with worked examples.`,
  }));
}

const OPTION_LABELS = ["A", "B", "C", "D"];

/** Generates a consistent, deterministic set of placeholder questions for a subject. */
export function getMockQuestions(subject: string, count = 10): Question[] {
  return Array.from({ length: count }, (_, i) => {
    const correctIndex = i % 4;
    return {
      id: `${subject}-q${i + 1}`,
      subject,
      prompt: `Sample ${subject} question ${i + 1} of ${count} — placeholder prompt for demo purposes.`,
      options: OPTION_LABELS.map((label, optIndex) => ({
        id: `${subject}-q${i + 1}-opt-${optIndex}`,
        text: `Option ${label}${optIndex === correctIndex ? "" : ""}`,
      })),
      correctOptionId: `${subject}-q${i + 1}-opt-${correctIndex}`,
    };
  });
}
