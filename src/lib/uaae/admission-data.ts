/**
 * Two source documents feed this file:
 *  1. "University of Lagos 2025/2026 Admission Requirements" — UTME subject
 *     requirements per department (the older, 12-faculty breakdown).
 *  2. "UNILAG 2026/2027 UTME Merit Cut-Off Mark" Information Flash — real
 *     Merit + catchment-state cutoffs, under UNILAG's newer, 18-faculty
 *     breakdown (several faculties were split/renamed since document #1).
 *
 * Document #2 is treated as the authoritative faculty/programme structure
 * (it's the newer release), so every programme below is keyed to it.
 * `subjectPool` is carried over from document #1 wherever the programme
 * matches one-for-one; where a programme is new or was renamed (e.g. the
 * new Computing & Informatics or Health Professions faculties), the
 * subject pool is inferred from the closest cognate department — flagged
 * inline with a comment — since document #1 predates the reorganisation
 * and doesn't cover them directly.
 */

export interface Cutoffs {
  merit: number | null;
  ekiti: number | null;
  lagos: number | null;
  ogun: number | null;
  ondo: number | null;
  osun: number | null;
  oyo: number | null;
}

export interface DepartmentRequirement {
  faculty: string;
  department: string;
  utmeSubjectsText: string;
  subjectPool: string[];
  cutoffs: Cutoffs;
}

export const CATCHMENT_STATES = [
  "Ekiti",
  "Lagos",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
] as const;
export type CatchmentState = (typeof CATCHMENT_STATES)[number];

function c(
  merit: number | null,
  ekiti: number | null,
  lagos: number | null,
  ogun: number | null,
  ondo: number | null,
  osun: number | null,
  oyo: number | null
): Cutoffs {
  return { merit, ekiti, lagos, ogun, ondo, osun, oyo };
}

const EN = "English Language";
const MA = "Mathematics";
const FM = "Further Mathematics";
const PH = "Physics";
const CH = "Chemistry";
const BI = "Biology";
const EC = "Economics";
const GO = "Government";
const GE = "Geography";
const HI = "History";
const LE = "Literature-in-English";
const CR = "CRS/IRS";
const FR = "French";
const AG = "Agricultural Science";
const CO = "Commerce";
const FA = "Financial Accounting";
const FI = "Fine Arts";
const TD = "Technical Drawing";
const IG = "Igbo";
const YO = "Yoruba";
const AR = "Arabic";
const CE = "Civic Education";
const DP = "Data Processing/Computer Studies";
const MU = "Music";
const BM = "Business Management/Studies";
const NL = "Nigerian Language";

export const admissionRequirements: DepartmentRequirement[] = [
  // Faculty of Architecture (split out from the old Environmental Sciences)
  { faculty: "Architecture", department: "Architecture", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Chemistry, Geography, Economics, Biology, Fine Arts.", subjectPool: [EN, MA, PH, CH, GE, EC, BI, FI], cutoffs: c(72.9, 56.85, 61.925, 65.45, 54.55, 67.375, 56.525) },
  { faculty: "Architecture", department: "Landscape Architecture", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Fine Arts, Geography, Chemistry, Biology. (inferred — cognate with Architecture)", subjectPool: [EN, MA, PH, FI, GE, CH, BI], cutoffs: c(null, null, null, null, null, null, null) },
  { faculty: "Architecture", department: "Interior Architecture", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Fine Arts, Geography, Chemistry, Biology. (inferred — cognate with Architecture)", subjectPool: [EN, MA, PH, FI, GE, CH, BI], cutoffs: c(null, null, null, null, null, null, null) },

  // Faculty of Arts
  { faculty: "Arts", department: "English", utmeSubjectsText: "English Language, Literature-in-English and any two of CRS/IRS, French, History, Government and any Nigerian Language.", subjectPool: [EN, LE, CR, FR, HI, GO, NL], cutoffs: c(68.15, 56.65, 63.475, 63.7, 57.1, 53.475, 61.325) },
  { faculty: "Arts", department: "French", utmeSubjectsText: "English Language and any three Arts or Social Sciences.", subjectPool: [EN], cutoffs: c(64, null, 62.2, 60.45, null, null, 59.85) },
  { faculty: "Arts", department: "Russian", utmeSubjectsText: "English Language and any three Arts or Social Sciences.", subjectPool: [EN], cutoffs: c(55.45, null, null, null, null, null, null) },
  { faculty: "Arts", department: "German", utmeSubjectsText: "English Language and any three Arts or Social Sciences.", subjectPool: [EN], cutoffs: c(69.125, 54.875, 59.725, 67.775, 63.925, 59.25, 53.925) },
  { faculty: "Arts", department: "History & Strategic Studies", utmeSubjectsText: "English Language, History and/or Government and any one or two Arts or Social Sciences.", subjectPool: [EN, HI, GO], cutoffs: c(70.8, 62.65, 67.425, 68.65, 63.2, 64.225, 66.6) },
  { faculty: "Arts", department: "Linguistics/Igbo", utmeSubjectsText: "English Language and any three Arts, Science or Social Sciences.", subjectPool: [EN, IG], cutoffs: c(null, null, null, null, null, null, null) },
  { faculty: "Arts", department: "Linguistics/Yoruba", utmeSubjectsText: "English Language and any three Arts, Science or Social Sciences.", subjectPool: [EN, YO], cutoffs: c(60.35, null, null, null, null, null, null) },
  { faculty: "Arts", department: "Linguistics", utmeSubjectsText: "Any three (3) subjects from Arts, Sciences or Social Sciences.", subjectPool: [EN], cutoffs: c(72.575, 69.525, 59.575, 70.6, 66.425, 68.375, 69.1) },
  { faculty: "Arts", department: "Chinese", utmeSubjectsText: "English Language and any three Arts, Science or Social Sciences.", subjectPool: [EN], cutoffs: c(71.625, 67.15, 66.75, 70.325, 71.275, 70.9, 70.175) },
  { faculty: "Arts", department: "Philosophy", utmeSubjectsText: "English Language, one Arts and any two Arts, Social Sciences or Science.", subjectPool: [EN], cutoffs: c(67.725, 67.3, 61.15, 66.6, 57.925, 55.5, 58.15) },
  { faculty: "Arts", department: "Christian Religious Studies", utmeSubjectsText: "English Language, CRS and any two (2) from Literature-in-English, History, Government, French, Yoruba, Igbo, Hausa, Visual Arts, Economics and Commerce.", subjectPool: [EN, CR, LE, HI, GO, FR, YO, IG, EC, CO], cutoffs: c(55.825, null, null, null, null, null, null) },
  { faculty: "Arts", department: "Islamic Religious Studies", utmeSubjectsText: "English Language, Islamic Studies and any two from Literature-in-English, History, Government, French, Yoruba, Igbo, Visual Arts, Economics and Commerce.", subjectPool: [EN, LE, HI, GO, FR, YO, IG, EC, CO], cutoffs: c(56.35, null, null, null, null, 51.95, null) },

  // Faculty of Basic Medical Sciences
  { faculty: "Basic Medical Sciences", department: "Anatomy", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(72.7, 59.8, 72.1, 70.9, 69.425, 67.35, 67.975) },
  { faculty: "Basic Medical Sciences", department: "Pharmacology", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(74.275, 70.4, 71.625, 72.675, 69.75, 71.3, 65.125) },
  { faculty: "Basic Medical Sciences", department: "Physiology", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(71.125, 68.05, 68.65, 61.175, 69.85, 66.375, 71.025) },

  // Faculty of Clinical Sciences
  { faculty: "Clinical Sciences", department: "Medicine & Surgery", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(83.425, 79.425, 79.1, 81.75, 81.35, 79.825, 80.05) },

  // Faculty of Communication & Media Studies (split out from old Social Sciences' Mass Communication)
  { faculty: "Communication & Media Studies", department: "Mass Communication", utmeSubjectsText: "English Language, Literature-in-English and any two subjects from Arts or Social Sciences.", subjectPool: [EN, LE], cutoffs: c(74.6, 64.275, 72.45, 73.025, 71.9, 70.775, 71.725) },
  { faculty: "Communication & Media Studies", department: "Public Relations", utmeSubjectsText: "English Language, Literature-in-English and any two subjects from Arts or Social Sciences. (inferred — cognate with Mass Communication)", subjectPool: [EN, LE], cutoffs: c(61.225, null, null, 56.35, null, null, null) },
  { faculty: "Communication & Media Studies", department: "Broadcasting", utmeSubjectsText: "English Language, Literature-in-English and any two subjects from Arts or Social Sciences. (inferred — cognate with Mass Communication)", subjectPool: [EN, LE], cutoffs: c(63.1, null, null, null, null, null, null) },

  // Faculty of Computing & Informatics (split out from old Science faculty's Computer Science)
  { faculty: "Computing & Informatics", department: "Artificial Intelligence", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Chemistry or Biology. (inferred — cognate with Computer Science)", subjectPool: [EN, MA, PH, CH, BI], cutoffs: c(53.2, null, null, null, null, null, null) },
  { faculty: "Computing & Informatics", department: "Computer Science", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Chemistry or Biology.", subjectPool: [EN, MA, PH, CH, BI], cutoffs: c(82.05, 78.4, 73.225, 79.175, 79.675, 78.85, 79.875) },
  { faculty: "Computing & Informatics", department: "Cybersecurity", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Chemistry or Biology. (inferred — cognate with Computer Science)", subjectPool: [EN, MA, PH, CH, BI], cutoffs: c(66.075, null, 60.4, 59.975, 62.25, 59.375, 56.75) },
  { faculty: "Computing & Informatics", department: "Software Engineering", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Chemistry or Biology. (inferred — cognate with Computer Science)", subjectPool: [EN, MA, PH, CH, BI], cutoffs: c(59.25, null, null, null, null, null, null) },

  // Faculty of Creative Arts (split out from the old Arts faculty's Creative Arts)
  { faculty: "Creative Arts", department: "Music", utmeSubjectsText: "English Language, Music and any two of Literature-in-English, Fine Arts and other Arts subjects. (inferred — cognate with the former Creative Arts department)", subjectPool: [EN, MU, LE, FI], cutoffs: c(63.45, null, null, 59.5, 54.65, 59.625, null) },
  { faculty: "Creative Arts", department: "Film Production", utmeSubjectsText: "English Language, Literature-in-English, Fine Arts and one other Arts subject. (inferred — cognate with the former Creative Arts department)", subjectPool: [EN, LE, FI], cutoffs: c(69.625, 58.475, 65.775, 62.875, 65.8, 55.125, 55.3) },
  { faculty: "Creative Arts", department: "Theatre Arts", utmeSubjectsText: "English Language, Literature-in-English and any two of Igbo/Yoruba, CRS/IRS, French, History, Government, Music and Visual Arts.", subjectPool: [EN, LE, IG, YO, CR, FR, HI, GO, MU, FI], cutoffs: c(71.5, 70.4, 67.2, 69.85, 68.025, 68.775, 68.45) },
  { faculty: "Creative Arts", department: "Fine and Applied Arts", utmeSubjectsText: "English Language, Mathematics, Fine Arts and any other subject. (inferred — cognate with the former Creative Arts: Visual Arts option)", subjectPool: [EN, MA, FI], cutoffs: c(66.53, 58.23, 59.18, 54.88, 59.50, 61.23, 65.53) },

  // Faculty of Dental Sciences
  { faculty: "Dental Sciences", department: "Dentistry", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(79.025, 74.575, 72.725, 77.3, 76.325, 77.775, 76.65) },

  // Faculty of Education
  { faculty: "Education", department: "Adult Education", utmeSubjectsText: "English Language and any three of Literature-in-English, History/Government, French, Geography, Mathematics, any Nigerian Language, CRS/IRS, Economics, Commerce, Civic Education, Social Studies, Financial Accounting, Biology/Agricultural Science, Food & Nutrition.", subjectPool: [EN, LE, HI, GO, FR, GE, MA, NL, CR, EC, CO, CE, FA, BI, AG], cutoffs: c(59.325, 56.95, 57.4, 54.975, 57.475, 51.175, 53.625) },
  { faculty: "Education", department: "Education Economics", utmeSubjectsText: "English Language, Mathematics, Economics and any one of Geography, History/Government and Literature-in-English.", subjectPool: [EN, MA, EC, GE, HI, GO, LE], cutoffs: c(49.65, null, null, null, null, null, null) },
  { faculty: "Education", department: "Education Business", utmeSubjectsText: "English Language, Mathematics, Economics and any one of Arts or Social Sciences subject.", subjectPool: [EN, MA, EC], cutoffs: c(62.3, null, 58.475, 57.575, null, 58.35, 57.5) },
  { faculty: "Education", department: "Education IRS", utmeSubjectsText: "English language and Islamic Religious Studies (IRS) and any two of Literature-in-English, History/Government, French/Arabic, Geography, Mathematics, Yoruba/Igbo, CRS, Economics/Commerce.", subjectPool: [EN, LE, HI, GO, FR, AR, GE, MA, YO, IG, CR, EC, CO], cutoffs: c(60.475, null, null, null, null, null, null) },
  { faculty: "Education", department: "Education Igbo", utmeSubjectsText: "English Language and any three subjects from Arts or Social Sciences.", subjectPool: [EN, IG], cutoffs: c(null, null, null, null, null, null, null) },
  { faculty: "Education", department: "Education English", utmeSubjectsText: "English Language, Mathematics, Literature-in-English and any two subjects from Arts, Science and Social Sciences.", subjectPool: [EN, MA, LE], cutoffs: c(66.475, 59.95, 58.675, 62.075, 59.85, 62.1, 61.05) },
  { faculty: "Education", department: "Education Early Childhood", utmeSubjectsText: "English Language and any three subjects.", subjectPool: [EN], cutoffs: c(60.45, null, 56.2, 54.575, 55.95, null, 59.225) },
  { faculty: "Education", department: "Education Yoruba", utmeSubjectsText: "English Language and any three subjects from Arts or Social Sciences.", subjectPool: [EN, YO], cutoffs: c(57.825, null, null, null, null, null, null) },
  { faculty: "Education", department: "Education French", utmeSubjectsText: "English Language and any three subjects from Arts or Social Sciences.", subjectPool: [EN], cutoffs: c(60.225, null, null, null, null, null, null) },
  { faculty: "Education", department: "Education History", utmeSubjectsText: "English language and any three subjects from Arts or Social Sciences.", subjectPool: [EN], cutoffs: c(62.575, null, null, 57.975, null, null, null) },
  { faculty: "Education", department: "Education CRS", utmeSubjectsText: "English Language, CRS and any two of Literature-in-English, History/Government, French, any Nigerian Language, Geography, Mathematics, Economics/Commerce.", subjectPool: [EN, CR, LE, HI, GO, FR, NL, GE, MA, EC, CO], cutoffs: c(57, null, null, null, null, null, null) },
  { faculty: "Education", department: "Education Geography", utmeSubjectsText: "English language and any three of Literature-in-English, History/Government, French/Arabic, Geography, Mathematics, any Nigerian Language, CRS/IRS, Economics/Commerce.", subjectPool: [EN, LE, HI, GO, FR, AR, GE, MA, NL, CR, EC, CO], cutoffs: c(null, null, null, null, null, null, null) },
  { faculty: "Education", department: "Educational Administration", utmeSubjectsText: "English Language and any three of Literature-in-English, History, Government, Geography, any Nigerian Language, CRS/IRS, Economics.", subjectPool: [EN, LE, HI, GO, GE, NL, CR, EC], cutoffs: c(59.975, 55.05, 57.725, 51.125, 56.7, null, 53.5) },
  { faculty: "Education", department: "Educational Foundations", utmeSubjectsText: "English Language and any three of Literature-in-English, History, Government, Geography, Economics, Igbo/Yoruba, CRS/IRS, French and Civic Education.", subjectPool: [EN, LE, HI, GO, GE, EC, IG, YO, CR, FR, CE], cutoffs: c(57.25, null, null, 52.05, null, null, 54.05) },
  { faculty: "Education", department: "Special Education", utmeSubjectsText: "English Language and any three of Mathematics, Literature-in-English, Geography, Economics, History, Government, Yoruba, Igbo, CRS/IRS, French, Civic Education.", subjectPool: [EN, MA, LE, GE, EC, HI, GO, YO, IG, CR, FR, CE], cutoffs: c(52.85, null, null, null, null, null, null) },
  { faculty: "Education", department: "Health Education", utmeSubjectsText: "English Language, Biology and any two Science subjects. (inferred — split out from the former Human Kinetics & Health Education)", subjectPool: [EN, BI, CH, PH], cutoffs: c(53.5, null, null, null, null, null, null) },
  { faculty: "Education", department: "Human Kinetics", utmeSubjectsText: "English Language, Biology and any two Science subjects. (inferred — split out from the former Human Kinetics & Health Education)", subjectPool: [EN, BI, CH, PH], cutoffs: c(52.525, null, null, null, null, null, null) },
  { faculty: "Education", department: "Education Biology", utmeSubjectsText: "English Language, Biology and any two of Chemistry, Mathematics, Physics, Integrated Science.", subjectPool: [EN, BI, CH, MA, PH], cutoffs: c(57.4, null, 55.625, 55.25, 54.725, 55.1, 56.425) },
  { faculty: "Education", department: "Education Chemistry", utmeSubjectsText: "English Language, Chemistry and any two of Physics, Biology, Agricultural Science, Integrated Science.", subjectPool: [EN, CH, PH, BI, AG], cutoffs: c(53.375, null, null, null, null, null, null) },
  { faculty: "Education", department: "Education Home Economics", utmeSubjectsText: "English Language, Chemistry, Biology/Agricultural Science and one other subject from Mathematics, Physics, Food & Nutrition, Home Management, Clothing & Textile.", subjectPool: [EN, CH, BI, AG, MA, PH], cutoffs: c(55.575, null, null, null, null, null, null) },
  { faculty: "Education", department: "Education Integrated Science", utmeSubjectsText: "English Language, Biology and any two of Chemistry, Physics, Mathematics, Agricultural Science.", subjectPool: [EN, BI, CH, PH, MA, AG], cutoffs: c(66.7, null, null, null, null, null, null) },
  { faculty: "Education", department: "Education Mathematics", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Chemistry, Biology, Computer Studies, Data processing.", subjectPool: [EN, MA, PH, CH, BI, DP], cutoffs: c(57, null, 53.25, 54.4, null, null, null) },
  { faculty: "Education", department: "Education Physics", utmeSubjectsText: "English Language, Physics, Mathematics/Chemistry and one of Biology, Agricultural Science.", subjectPool: [EN, PH, MA, CH, BI, AG], cutoffs: c(56.05, null, null, null, null, null, null) },
  { faculty: "Education", department: "Education Technology", utmeSubjectsText: "English Language, Mathematics, Physics/Technical Drawing and any one Science/Technical subject.", subjectPool: [EN, MA, PH, TD], cutoffs: c(53.025, null, null, null, null, null, null) },

  // Faculty of Engineering (all identical UTME requirements per the source)
  ...(
    [
      ["Biomedical Engineering", c(77.05, 75.2, 70.2, 76.175, 74.775, 66.05, null)],
      ["Chemical Engineering", c(72.925, 62.625, 63.525, 70.925, 67.525, 64.675, 62.75)],
      ["Civil Engineering", c(74.35, 62.675, 69.7, 71.9, 67.775, 71.55, 68.575)],
      ["Computer Engineering", c(82.175, 80.225, 77.35, 78.8, 75.25, 80.875, 74.3)],
      ["Electrical Engineering", c(79.025, 67.925, 74.625, 73.975, 67.7, 69.2, 71.3)],
      ["Mechanical Engineering", c(79.275, 67.625, 76.35, 77.05, 68.8, 70.525, 74.325)],
      ["Metallurgical & Material Engineering", c(67.025, 64.875, 60.825, 65.45, 60.3, 59.375, 60.95)],
      ["Petroleum & Gas Engineering", c(75.025, 64.15, 66.125, 71.675, 63.75, 68.275, 69.425)],
      ["Surveying & Geoformatics Engineering", c(66.075, 58.075, 62.5, 64.35, 58.875, 59.75, 64.3)],
      ["Systems Engineering", c(78.8, 73.275, 72.975, 77.925, 74.3, 73.95, 72.525)],
    ] as [string, Cutoffs][]
  ).map(([department, cutoffs]) => ({
    faculty: "Engineering",
    department,
    utmeSubjectsText: "English Language, Chemistry, Mathematics & Physics.",
    subjectPool: [EN, CH, MA, PH],
    cutoffs,
  })),

  // Faculty of Environmental Sciences (Architecture split out into its own faculty)
  { faculty: "Environmental Sciences", department: "Building", utmeSubjectsText: "English Language, Mathematics, Physics and Chemistry.", subjectPool: [EN, MA, PH, CH], cutoffs: c(61.65, 54.95, 59.325, 58.925, 56.425, 59.025, 59.475) },
  { faculty: "Environmental Sciences", department: "Estate Management", utmeSubjectsText: "English Language, Mathematics, Economics and any one of Chemistry, Physics, Biology, Geography and Financial Accounting.", subjectPool: [EN, MA, EC, CH, PH, BI, GE, FA], cutoffs: c(56.85, null, null, 52.625, 55.225, null, 56.75) },
  { faculty: "Environmental Sciences", department: "Quantity Surveying", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Chemistry, Economics or Geography.", subjectPool: [EN, MA, PH, CH, EC, GE], cutoffs: c(65.95, 56.575, 59.85, 65.175, 63.75, 50.7, 64.625) },
  { faculty: "Environmental Sciences", department: "Urban & Regional Planning", utmeSubjectsText: "English Language, Mathematics, Geography/Economics and any one of Chemistry, Physics, Biology, Fine Arts/Technical Drawing.", subjectPool: [EN, MA, GE, EC, CH, PH, BI, FI, TD], cutoffs: c(52.825, null, null, null, null, null, null) },

  // Faculty of Health Professions (new — split out from the old Clinical Sciences / Basic Medical Sciences)
  { faculty: "Health Professions", department: "Medical & Laboratory Science", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(75.075, 66.525, 71.55, 73.425, 71.625, 74.35, 69.875) },
  { faculty: "Health Professions", department: "Nursing Sciences", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(77.925, 72.775, 73.95, 76.275, 74.875, 75.2, 74.1) },
  { faculty: "Health Professions", department: "Physiotherapy", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(76, 72.75, 67.4, 75.375, 74.7, 73.675, 72.3) },
  { faculty: "Health Professions", department: "Radiography", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(77.375, 73.4, 74.9, 77.25, 75.025, 76.475, 77.1) },

  // Faculty of Law
  { faculty: "Law", department: "Law", utmeSubjectsText: "English Language and any three Arts or Social Sciences subjects. Lagos does not accept Music, Fine Arts, and Principles of Accounting. Lagos accepts either Economics or Commerce but not both.", subjectPool: [EN, LE, HI, GO, CR, FR, EC, CO], cutoffs: c(79.125, 75.975, 75.15, 77.275, 75.55, 75.25, 76.35) },

  // Faculty of Life Sciences (new — split out from the old Science faculty)
  { faculty: "Life Sciences", department: "Biochemistry", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(67.9, 55.95, 63.15, 63.65, 60.625, 64.025, 57.03) },
  { faculty: "Life Sciences", department: "Botany", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(54.3, null, 50.95, null, null, null, null) },
  { faculty: "Life Sciences", department: "Cell Biology & Genetics", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(68.8, 65.175, 62.35, 64.5, 53.2, 66.15, 65.45) },
  { faculty: "Life Sciences", department: "Marine Science", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(64.825, 54.25, 54.95, 60.975, 50.55, 59.3, 59.075) },
  { faculty: "Life Sciences", department: "Fisheries", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(59.825, null, null, null, null, null, null) },
  { faculty: "Life Sciences", department: "Microbiology", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(67.6, 59.75, 61.125, 66.525, 61.475, 64.75, 65.2) },
  { faculty: "Life Sciences", department: "Zoology", utmeSubjectsText: "English Language, Biology, Chemistry and Physics.", subjectPool: [EN, BI, CH, PH], cutoffs: c(54.825, null, null, null, null, null, null) },

  // Faculty of Management Sciences
  { faculty: "Management Sciences", department: "Accounting", utmeSubjectsText: "English Language, Mathematics, Economics, plus one of Financial Accounting, Further Mathematics, Geography, Government, Literature-in-English and Biology.", subjectPool: [EN, MA, EC, FA, FM, GE, GO, LE, BI], cutoffs: c(73, 61.6, 65.275, 69.35, 65.9, 68.625, 67.85) },
  { faculty: "Management Sciences", department: "Actuarial Science", utmeSubjectsText: "English Language, Mathematics, Economics and any one of Geography, Government, Biology, Chemistry, Physics, Commerce.", subjectPool: [EN, MA, EC, GE, GO, BI, CH, PH, CO], cutoffs: c(65.875, 65.575, 62.925, 64.175, 52.3, 61.5, 54.1) },
  { faculty: "Management Sciences", department: "Banking & Finance", utmeSubjectsText: "English Language, Mathematics, Economics and any one subject from Science, Social Science or Arts.", subjectPool: [EN, MA, EC], cutoffs: c(70.35, 62.775, 60.375, 68.875, 55.6, 65.925, 64.275) },
  { faculty: "Management Sciences", department: "Business Administration", utmeSubjectsText: "English Language, Mathematics, Economics and any one subject from Science, Social Science or Arts.", subjectPool: [EN, MA, EC], cutoffs: c(66.725, 55.45, 60.025, 62.7, 57.1, 60.25, 57.175) },
  { faculty: "Management Sciences", department: "Employment Relations and Human Resource Management", utmeSubjectsText: "English Language, Mathematics, Economics and any one subject from Science, Social Science or Arts.", subjectPool: [EN, MA, EC], cutoffs: c(66.025, 59, 54.975, 64, 60.125, 57.4, 59.90) },
  { faculty: "Management Sciences", department: "Insurance", utmeSubjectsText: "English Language, Mathematics, Economics and any one of Financial Accounting, Geography, Government, Biology, Chemistry, Physics and Commerce.", subjectPool: [EN, MA, EC, FA, GE, GO, BI, CH, PH, CO], cutoffs: c(63.125, 58.275, 57.125, 54.425, 52.6, 54.075, 58.275) },
  { faculty: "Management Sciences", department: "Taxation", utmeSubjectsText: "English Language, Economics, Mathematics and any one of Commerce, Government, Business Management, Geography, Literature-in-English, Civic Education.", subjectPool: [EN, EC, MA, CO, GO, BM, GE, LE, CE], cutoffs: c(65.48, 55.70, 59.88, 63.55, 50.73, 65.33, 56.85) },
  { faculty: "Management Sciences", department: "Procurement Management", utmeSubjectsText: "English Language, Mathematics, Economics and any one from Business Studies, Government, Chemistry and Physics.", subjectPool: [EN, MA, EC, BM, GO, CH, PH], cutoffs: c(58.95, 55.55, 56.575, 54.75, null, null, null) },

  // Faculty of Pharmacy
  { faculty: "Pharmacy", department: "Pharmacy", utmeSubjectsText: "English Language, Physics, Chemistry and Biology.", subjectPool: [EN, PH, CH, BI], cutoffs: c(78.325, 72.875, 72.175, 76.3, 75.275, 75.85, 74.1) },

  // Faculty of Physical & Earth Science (new — split out from the old Science faculty)
  { faculty: "Physical & Earth Science", department: "Chemistry", utmeSubjectsText: "English Language, Chemistry, Physics and any one of Biology or Mathematics.", subjectPool: [EN, CH, PH, BI, MA], cutoffs: c(65.4, 62.8, 59.15, 61.25, 55.625, 59.975, 59.875) },
  { faculty: "Physical & Earth Science", department: "Industrial Chemistry", utmeSubjectsText: "English Language, Chemistry, Physics and any one of Biology or Mathematics. (inferred — cognate with Chemistry)", subjectPool: [EN, CH, PH, BI, MA], cutoffs: c(54.425, null, null, null, null, null, null) },
  { faculty: "Physical & Earth Science", department: "Environmental Standards", utmeSubjectsText: "English Language, Mathematics and any two from Physics, Chemistry and Biology.", subjectPool: [EN, MA, PH, CH, BI], cutoffs: c(56.275, null, null, 54.95, null, null, null) },
  { faculty: "Physical & Earth Science", department: "Geology", utmeSubjectsText: "English Language, Mathematics, Physics and Chemistry.", subjectPool: [EN, MA, PH, CH], cutoffs: c(64.5, 58.125, 56.575, 61.475, 52.575, 58.375, 63.225) },
  { faculty: "Physical & Earth Science", department: "Geophysics", utmeSubjectsText: "English Language, Mathematics, Physics and Chemistry.", subjectPool: [EN, MA, PH, CH], cutoffs: c(63.75, 60.5, 55.65, 58.45, 58.25, 57.9, 60) },
  { faculty: "Physical & Earth Science", department: "Mathematics", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Chemistry, Economics, Biology and Geography.", subjectPool: [EN, MA, PH, CH, EC, BI, GE], cutoffs: c(58.775, 57.5, 58.275, 57.8, null, 55.125, null) },
  { faculty: "Physical & Earth Science", department: "Industrial Mathematics", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Chemistry, Economics, Biology and Geography.", subjectPool: [EN, MA, PH, CH, EC, BI, GE], cutoffs: c(68.275, 64.475, 65.775, 66.65, 60.7, 61.775, 62.35) },
  { faculty: "Physical & Earth Science", department: "Physics", utmeSubjectsText: "English Language, Physics, Mathematics and Chemistry.", subjectPool: [EN, PH, MA, CH], cutoffs: c(54.5, null, null, null, null, null, null) },
  { faculty: "Physical & Earth Science", department: "Biostatistics", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Chemistry, Biology, Economics, Geography.", subjectPool: [EN, MA, PH, CH, BI, EC, GE], cutoffs: c(64.35, 62.675, 58.6, 52.025, 53.25, null, 52.2) },
  { faculty: "Physical & Earth Science", department: "Data Science", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Chemistry, Biology, Economics, Geography.", subjectPool: [EN, MA, PH, CH, BI, EC, GE], cutoffs: c(77.25, 73.925, 72.825, 74.425, 71.35, 76.675, 76.475) },
  { faculty: "Physical & Earth Science", department: "Statistics", utmeSubjectsText: "English Language, Mathematics, Physics and any one of Chemistry, Economics, Biology and Geography.", subjectPool: [EN, MA, PH, CH, EC, BI, GE], cutoffs: c(70.45, 69.15, 64.725, 69.9, 66.475, 65, 65.825) },

  // Faculty of Social Sciences (Mass Communication split out to Communication & Media Studies)
  { faculty: "Social Sciences", department: "Economics", utmeSubjectsText: "English Language, Mathematics, Economics and any other subjects.", subjectPool: [EN, MA, EC], cutoffs: c(73.625, 62.525, 64.9, 68.05, 62.175, 67.35, 69.35) },
  { faculty: "Social Sciences", department: "Economics and Development Studies", utmeSubjectsText: "English Language, Economics and/or Mathematics, and any other two/one subject(s).", subjectPool: [EN, EC, MA], cutoffs: c(60.65, null, null, null, null, null, null) },
  { faculty: "Social Sciences", department: "Geography", utmeSubjectsText: "English Language, Geography and any two from Biology, Chemistry, Physics, Economics, Government and Mathematics.", subjectPool: [EN, GE, BI, CH, PH, EC, GO, MA], cutoffs: c(55.7, null, null, null, null, null, null) },
  { faculty: "Social Sciences", department: "Meteorology and Climate Science", utmeSubjectsText: "English Language, Mathematics, Physics and any one subject from Geography, Chemistry, Biology and Agricultural Science.", subjectPool: [EN, MA, PH, GE, CH, BI, AG], cutoffs: c(51.725, null, null, null, null, null, null) },
  { faculty: "Social Sciences", department: "Library and Information Science", utmeSubjectsText: "English Language, Literature-in-English and any two subjects from Arts or Social Sciences.", subjectPool: [EN, LE], cutoffs: c(58.375, null, 54.1, null, null, null, null) },
  { faculty: "Social Sciences", department: "Political Science", utmeSubjectsText: "English Language, Government, Economics/Geography and any one of History, Literature-in-English, CRS/IRS.", subjectPool: [EN, GO, EC, GE, HI, LE, CR], cutoffs: c(65.65, 59.75, 51.5, 61.975, 58.825, 51.5, 55.275) },
  { faculty: "Social Sciences", department: "Psychology", utmeSubjectsText: "English Language and any three subjects from Mathematics, Biology, Physics, Chemistry, Economics, Government, and Literature-in-English.", subjectPool: [EN, MA, BI, PH, CH, EC, GO, LE], cutoffs: c(70.15, 56.975, 67.125, 62.95, 55.8, 58.05, 60.975) },
  { faculty: "Social Sciences", department: "Public Administration", utmeSubjectsText: "English Language, Government/Civic Education/History, Economics and any other Social Sciences or Art subjects.", subjectPool: [EN, GO, CE, HI, EC], cutoffs: c(70.475, 67.65, 67.375, 70.025, 66.075, 68.7, null) },
  { faculty: "Social Sciences", department: "Social Work", utmeSubjectsText: "English Language, two Social Sciences subjects and one Arts subject. Mathematics is accepted.", subjectPool: [EN, EC, GO, GE, HI, MA, CR, LE], cutoffs: c(65.5, null, 64.95, 64.15, 60.325, 59.35, 59.625) },
  { faculty: "Social Sciences", department: "Sociology", utmeSubjectsText: "English Language, two Social Sciences and one Arts subject. Mathematics is accepted.", subjectPool: [EN, EC, GO, GE, HI, MA, CR, LE], cutoffs: c(65.65, null, 55.675, 52.675, 56.55, 56.5, 57.925) },
  { faculty: "Social Sciences", department: "Social Standards", utmeSubjectsText: "English Language and any three subject from Economics, Government, Civic Education, Mathematics and Biology.", subjectPool: [EN, EC, GO, CE, MA, BI], cutoffs: c(53.925, null, null, null, null, null, null) },
];

export const faculties = Array.from(
  new Set(admissionRequirements.map((d) => d.faculty))
).sort();

export const allUtmeSubjects = Array.from(
  new Set(admissionRequirements.flatMap((d) => d.subjectPool))
).sort();

export function getDepartmentsByFaculty(faculty: string | "All") {
  if (faculty === "All") return admissionRequirements;
  return admissionRequirements.filter((d) => d.faculty === faculty);
}
