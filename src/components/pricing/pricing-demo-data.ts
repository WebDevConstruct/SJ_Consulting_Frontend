import type { PricingProduct } from "./PricingCatalogue";

export const pricingDemoProducts: PricingProduct[] = [
  {
    id: "demo-economics",
    audience: "aspirant",
    title: "Economics PQ",
    subtitle: "Economic reasoning",
    subject: "Economics",
    objective:
      "Prepare for JAMB Economics with focused revision across core concepts, market behaviour, and economic decision-making.",
    price: 5000,
    currency: "NGN",
    icon: "chart",
  },
  {
    id: "demo-mathematics",
    audience: "aspirant",
    title: "Mathematics PQ",
    subtitle: "Quantitative confidence",
    subject: "Mathematics",
    objective:
      "Build confidence through targeted practice in mathematical reasoning and problem-solving for your JAMB preparation.",
    price: 5000,
    currency: "NGN",
    icon: "calculator",
  },
  {
    id: "demo-english",
    audience: "aspirant",
    title: "English PQ",
    subtitle: "Language mastery",
    subject: "Use of English",
    objective:
      "Strengthen comprehension, vocabulary, and expression through focused past-question revision.",
    price: 4000,
    currency: "NGN",
    icon: "language",
  },
  {
    id: "demo-gst-101",
    audience: "undergraduate",
    title: "GST 101",
    subtitle: "Effective communication",
    subject: "Sample Communication Course",
    objective:
      "Replace this sample with the approved course title and the specific revision objectives covered by this resource.",
    price: 3000,
    currency: "NGN",
    icon: "language",
  },
  {
    id: "demo-gst-102",
    audience: "undergraduate",
    title: "GST 102",
    subtitle: "Critical thinking",
    subject: "Sample General Studies Course",
    objective:
      "Replace this sample with the approved course title and a clear description of what the past-question resource covers.",
    price: 3000,
    currency: "NGN",
    icon: "book",
  },
  {
    id: "demo-gst-103",
    audience: "undergraduate",
    title: "GST 103",
    subtitle: "Scientific thinking",
    subject: "Sample Science Course",
    objective:
      "Replace this sample with the approved course title and the main learning objective for this resource.",
    price: 3000,
    currency: "NGN",
    icon: "science",
  },
];