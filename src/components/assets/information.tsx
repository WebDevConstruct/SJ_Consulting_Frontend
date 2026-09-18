export interface InformationItem {
  id: string;
  topic: string;
  location: string;
  short_message: string;
  long_message: string;
  date: string;
  image: string;
  link?: string;
  summary?: string;
}

export interface InformationCategory {
  type: 'exam' | 'college' | 'mentorship' | 'undergraduate';
  title: string;
  description: string;
  endpoint: string;
  link: string;
  data: InformationItem[];
}

export const informationData: InformationCategory[] = [
  {
    type: "exam",
    title: "Exam Body Guidelines & Updates",
    description: "Examination updates, guidelines, syllabus changes, and official gazette bulletins directly from JAMB and national examination bodies.",
    endpoint: "/api/v1/exam_body/jamb",
    link : "/exam",
    data: [
      {
        id: "ex-1",
        topic: "JAMB UTME Official Registration Timetable",
        location: "National Gazette",
        short_message: "Official commencement date for UTME registration and CBT center accreditations announced.",
        long_message: "The Joint Admissions and Matriculation Board has officially announced the registration schedule. All candidates are required to generate their National Identification Number (NIN) profile codes prior to purchasing e-PINs.",
        date: "2026-01-15",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
        link: "https://jamb.gov.ng"
      },
      {
        id: "ex-2",
        topic: "Novel Novel Reading Text Released for UTME English",
        location: "JAMB Headquarters",
        short_message: "New mandatory literature text introduced for Use of English candidates.",
        long_message: "JAMB has updated the compulsory reading text for the Use of English paper. Candidates are advised to obtain official copies from accredited vendors only.",
        date: "2026-01-20",
        image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ex-3",
        topic: "CBT Center Biometric Verification Compliance",
        location: "Abuja",
        short_message: "Strict biometric verification protocols mandated for all accredited test centers.",
        long_message: "To curb examination malpractice, double 10-fingerprint biometric verification will be enforced at all entry points into the examination hall.",
        date: "2026-02-02",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ex-4",
        topic: "WAEC Subject Combination Requirements for Science",
        location: "WAEC Council",
        short_message: "Updated list of compulsory subject pairings for Engineering and Health Sciences.",
        long_message: "The West African Examinations Council has re-issued guidelines on core credit requirements for candidates aspiring for competitive university programs.",
        date: "2026-02-10",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ex-5",
        topic: "Post-UTME Screening Cut-Off Policy Standard",
        location: "NUC Headquarters",
        short_message: "National Universities Commission releases standardized minimum cut-off benchmark.",
        long_message: "The NUC in collaboration with JAMB has approved the baseline score for tertiary institution admissions for the upcoming academic session.",
        date: "2026-02-18",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ex-6",
        topic: "Direct Entry (DE) Verification Protocol",
        location: "JAMB Portal",
        short_message: "Mandatory verification for A-Level, OND, and HND certificates before admission.",
        long_message: "Direct Entry candidates must ensure their awarding institutions upload transcripts directly to the JAMB verification portal to prevent application invalidation.",
        date: "2026-02-25",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ex-7",
        topic: "NECO Senior Secondary Certificate Exam Regulations",
        location: "Minna Office",
        short_message: "NECO updates registration guidelines and photo-card standards.",
        long_message: "Schools presenting candidates for SSCE must ensure candidate details match exactly across NIN and registration forms to avoid certificate withholding.",
        date: "2026-03-01",
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ex-8",
        topic: "JAMB CAPS Portal Acceptance Guidelines",
        location: "JAMB CAPS",
        short_message: "Step-by-step instructions on accepting or rejecting admission offers on CAPS.",
        long_message: "Candidates who receive admission notifications on Central Admissions Processing System (CAPS) have a 4-week window to accept or reject the offer.",
        date: "2026-03-05",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ex-9",
        topic: "Correction of Data Window Open for UTME",
        location: "JAMB Portal",
        short_message: "Change of course, institution, and bio-data details now accessible.",
        long_message: "Candidates requiring amendments to their names, date of birth, state of origin, or preferred institution choice can now process updates at certified CBT centers.",
        date: "2026-03-10",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ex-10",
        topic: "Mock-UTME Examination Schedule",
        location: "National CBT Centers",
        short_message: "Optional trial mock examination date confirmed for registered candidates.",
        long_message: "The optional Mock-UTME test will hold nationwide to assist candidates in familiarizing themselves with the computer-based testing interface.",
        date: "2026-03-15",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    type: "college",
    title: "College Entry Guidelines",
    description: "Accurate and timely institutional admission guidelines, Post-UTME screening requirements, and departmental cut-off rules.",
    endpoint: "/api/v1/college/unilag",
    link : "/college-entry",
    data: [
      {
        id: "col-1",
        topic: "UNILAG Post-UTME Screening Requirements",
        location: "University of Lagos, Akoka",
        short_message: "Comprehensive eligibility criteria for UNILAG Post-UTME applicants.",
        long_message: "Only candidates who made UNILAG their first choice and scored 200 and above in the UTME are eligible to apply for the online Post-UTME screening.",
        date: "2026-01-18",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
        link: "https://unilag.edu.ng"
      },
      {
        id: "col-2",
        topic: "Departmental O-Level Combination Directives",
        location: "UNILAG Admissions Office",
        short_message: "Strict 1-sitting and 2-sitting regulations per faculty specified.",
        long_message: "Faculties of Law, Medicine, and Pharmacy require O-Level results obtained in a single sitting. Candidates must cross-check requirements before applying.",
        date: "2026-01-28",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "col-3",
        topic: "Catchment Area Admission Quota Breakdown",
        location: "UNILAG Senate Building",
        short_message: "Distribution matrix for Merit, Catchment, and Educationally Less Developed States.",
        long_message: "Admissions follow the federal mandate: 45% Merit, 35% Catchment Area, and 20% Educationally Less Developed States (ELDS).",
        date: "2026-02-05",
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "col-4",
        topic: "Post-UTME Aggregate Score Formula",
        location: "UNILAG Admissions Desk",
        short_message: "Standard computation model combining O-Level, UTME, and Post-UTME.",
        long_message: "Aggregate scores are calculated out of 100%: UTME score contributes 50%, Post-UTME score contributes 30%, and O-Level grades contribute 20%.",
        date: "2026-02-12",
        image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "col-5",
        topic: "UNILAG Foundation / JUPEB Programme Entry",
        location: "School of Foundation Studies",
        short_message: "Application opening for 1-year direct entry preparation program.",
        long_message: "Applications are open for the School of Foundation Studies for candidates seeking Direct Entry admission into 200-level degree programs.",
        date: "2026-02-20",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "col-6",
        topic: "Change of Course / Transfer Policy",
        location: "Academic Affairs Unit",
        short_message: "Inter-faculty transfer guidelines for candidates missing merit cut-offs.",
        long_message: "Candidates who meet the general university threshold but miss departmental merit scores can apply for transfer into under-subscribed programs.",
        date: "2026-02-28",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "col-7",
        topic: "Screening Document Upload Checklist",
        location: "UNILAG Portal",
        short_message: "Required digital documents for online credential verification.",
        long_message: "Candidates must upload clear scans of birth certificates, testimonials, citizenship letters, and O-Level statements of result prior to the deadline.",
        date: "2026-03-02",
        image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "col-8",
        topic: "Age Requirement Compliance Notice",
        location: "UNILAG Senate",
        short_message: "Strict enforcement of 16-year age minimum by October 31.",
        long_message: "Candidates who will not attain 16 years of age by October 31 of the admission year are ineligible for admission into UNILAG.",
        date: "2026-03-08",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "col-9",
        topic: "UNILAG Distance Learning Institute (DLI) Prospectus",
        location: "DLI Campus, Akoka",
        short_message: "Alternative part-time degree path for working professionals and aspirants.",
        long_message: "DLI applications are open for Accounting, Business Administration, Economics, and Science Education with no JAMB required.",
        date: "2026-03-12",
        image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "col-10",
        topic: "Final Admission List Verification & Clearance",
        location: "CITS UNILAG",
        short_message: "Physical screening timetable released for newly admitted candidates.",
        long_message: "Admitted candidates must report to their respective faculty secretariats with original credentials for physical screening and matriculation number generation.",
        date: "2026-03-16",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    type: "mentorship",
    title: "Mentorship & Scholarship Opportunities",
    description: "Mentorship guides, hackathons, and scholarship opportunities from reputable organizations for ambitious youths and students. DON'T MISS OUT!",
    endpoint: "/api/v1/mentorship",
    link : "/mentorship",
    data: [
      {
        id: "m-1",
        topic: "Yale Young African Scholars (YYAS) Program",
        location: "Yale University",
        short_message: "Intensive academic and leadership program for high school students across Africa.",
        long_message: "YYAS offers full-funding scholarships for outstanding secondary school students aged 14–17. Gain university preparation, peer mentorship, and global network exposure.",
        date: "2026-01-10",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
        link: "https://africanscholars.yale.edu"
      },
      {
        id: "m-2",
        topic: "Mastercard Foundation Scholars Program",
        location: "Global Partner Universities",
        short_message: "Fully funded undergraduate scholarship covering tuition, housing, and stipend.",
        long_message: "Targeted at academically talented young Africans with leadership potential. Provides comprehensive academic, social, and career development support.",
        date: "2026-01-22",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
        link: "https://mastercardfdn.org"
      },
      {
        id: "m-3",
        topic: "NLNG Undergraduate Scholarship Scheme",
        location: "Nigeria",
        short_message: "Annual merit scholarship for first-year tertiary institution students.",
        long_message: "Nigeria LNG Limited invites applications from high-performing 100-level undergraduates in accredited Nigerian public universities.",
        date: "2026-02-01",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "m-4",
        topic: "National Youth Tech Hackathon 2026",
        location: "Lagos / Virtual",
        short_message: "Building software solutions for education and financial inclusion. $10k prizes.",
        long_message: "Open to developers, designers, and innovators aged 15–24. Teams will receive mentorship from senior engineering leads from top tech firms.",
        date: "2026-02-08",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "m-5",
        topic: "MTN Science & Technology Scholarship (MTNST)",
        location: "Nigeria Universities",
        short_message: "N200,000 annual grant for 300-level STEM undergraduates.",
        long_message: "Designed to recognize and support high-achieving full-time 300-level students studying Science and Technology courses in public universities.",
        date: "2026-02-15",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "m-6",
        topic: "Google Generation Scholarship for Women in Computer Science",
        location: "EMEA Region / Online",
        short_message: "€7,000 award for women pursuing computer science and technology degrees.",
        long_message: "Helps computer science students excel in technology studies and become leaders in the field. Includes invitation to Google Student Summit.",
        date: "2026-02-22",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "m-7",
        topic: "Chevron / NNPC National University Scholarship",
        location: "Nigeria",
        short_message: "Funding support for 200-level undergraduates across all faculties.",
        long_message: "Star Deep Water Petroleum invites applications for its annual university scholarship award to promote academic excellence among Nigerian youth.",
        date: "2026-03-01",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "m-8",
        topic: "SJ Consult 1-on-1 Academic Mentorship Fellowship",
        location: "UNILAG Hub",
        short_message: "Direct personal strategy sessions with top-performing university scholars.",
        long_message: "Exclusive fellowship pairing secondary school graduates and undergraduates with experienced academic strategists for goal setting and GPA tracking.",
        date: "2026-03-05",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "m-9",
        topic: "Agip Postgraduate & Undergraduate Merit Award",
        location: "Port Harcourt / Lagos",
        short_message: "Full tuition and living expense bursary for engineering and geosciences.",
        long_message: "Nigerian Agip Oil Company (NAOC) scheme for host community and national applicants pursuing engineering and environmental sciences.",
        date: "2026-03-11",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "m-10",
        topic: "Tony Elumelu Foundation Young Entrepreneurship Program",
        location: "Pan-Africa",
        short_message: "$5,000 seed capital and 12-week business mentorship program.",
        long_message: "Empowering young African entrepreneurs with business ideas in education technology, agriculture, and digital services. Applications open annually.",
        date: "2026-03-14",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    type: "undergraduate",
    title: "Undergraduate Information & Correspondents",
    description: "Campus notices, course registration deadlines, dockets, GST login access, continuous assessment updates, and campus accommodation alerts.",
    endpoint: "/api/v1/undergraduates/accommodation",
    link : "/undergraduate",
    data: [
      {
        id: "ug-1",
        topic: "First Semester Course Registration Deadline",
        location: "Academic Affairs Portal",
        short_message: "Official portal closure date for undergraduate course form editing.",
        long_message: "All returning and fresh undergraduates must finalize online course registration and submit printed forms to departmental course advisers before portal closure.",
        date: "2026-01-12",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ug-2",
        topic: "GST 102 & GST 105 Online Portal Login Verification",
        location: "GST Centre, UNILAG",
        short_message: "Login credentials generated for General Studies e-learning platform.",
        long_message: "Fresh students (100 Level) are instructed to activate their university student email addresses to access GST modules, quizzes, and continuous assessment dates.",
        date: "2026-01-25",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ug-3",
        topic: "On-Campus Hostel Accommodation Ballot Notice",
        location: "Dean of Student Affairs (DSA)",
        short_message: "Online hostel balloting date and eligibility criteria for 100L & final year.",
        long_message: "Balloting for hostel spaces (Mariere, Moremi, Biobaku, Jaja) will open at 10:00 AM on the DSA portal. Only fully registered students are eligible.",
        date: "2026-02-04",
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ug-4",
        topic: "Mid-Semester Continuous Assessment (CA) Timetable",
        location: "Faculty Secretariats",
        short_message: "Published test schedules for Faculties of Management, Science, and Arts.",
        long_message: "Students are advised to review the decentralized CA timetable posted on faculty bulletin boards. Non-attendance attracts zero CA marks.",
        date: "2026-02-14",
        image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ug-5",
        topic: "Examination Docket Clearance and Printing Directive",
        location: "CITS UNILAG",
        short_message: "Color-printed dockets required for entry into semester examination halls.",
        long_message: "Dockets must be verified and stamped by Course Advisers and HODs prior to the commencement of semester examinations.",
        date: "2026-02-21",
        image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ug-6",
        topic: "Off-Campus Verified Accommodation Listings",
        location: "Akoka / Yaba Community Desk",
        short_message: "Checked and verified private student housing options near campus gates.",
        long_message: "SJ Consult student desk provides verified listings for self-contained apartments and shared student flats around Onike, Abule-Oja, and Akoka.",
        date: "2026-02-27",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ug-7",
        topic: "Biodata Verification & Matriculation Number Issuance",
        location: "Admissions Office",
        short_message: "Final clearance schedule for newly admitted 100-level undergraduates.",
        long_message: "Students with pending red flags in bio-data details must present original birth certificates at the CITS center to finalize matriculation profile creation.",
        date: "2026-03-03",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ug-8",
        topic: "Library Digital Card Activation",
        location: "Main Library, UNILAG",
        short_message: "E-resource barcode integration with university ID cards.",
        long_message: "Undergraduates can now access international research journals (IEEE, JSTOR, ScienceDirect) remotely using activated student library barcodes.",
        date: "2026-03-07",
        image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ug-9",
        topic: "SIWES / Industrial Training (IT) Attachment Orientation",
        location: "Faculty of Engineering & Science",
        short_message: "Compulsory briefing for 300L & 400L students proceeding on IT.",
        long_message: "The Industrial Training Coordinating Unit will conduct logbook distribution and employer acceptance letter guidelines for upcoming placement sessions.",
        date: "2026-03-11",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "ug-10",
        topic: "Students' Emergency Health Insurance Scheme (TSHIP)",
        location: "UNILAG Medical Centre",
        short_message: "Medical center registration and emergency card collection notice.",
        long_message: "All registered students are covered under TSHIP. Health center records must be updated with student matriculation numbers for full service access.",
        date: "2026-03-15",
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }
];