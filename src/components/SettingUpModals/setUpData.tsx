
"use client";
import {useGlobalContext} from "../../../Context";




export const facultyDepartments = {
  facultyOfArts: [
    "Creative Arts",
    "English Language",
    "European Languages (French, Russian, German)",
    "History & Strategic Studies",
    "Linguistics, African and Asian Studies (Linguistics/Igbo, Linguistics/Yoruba, Chinese, Linguistics)",
    "Philosophy",
    "Christian Religious Studies",
    "Islamic Studies"
  ],
  facultyOfBasicMedicalSciences: [
    "Pharmacology",
    "Physiology",
    "Medical Laboratory Science"
  ],
  facultyOfClinicalSciences: [
    "Anatomy",
    "Medicine & Surgery",
    "Nursing",
    "Physiotherapy",
    "Radiography"
  ],
  facultyOfDentalSciences: [
    "Dentistry"
  ],
  facultyOfEducation: [
    "Science & Technology Education (Biology, Chemistry, Integrated Science, Mathematics, Physics, Technology Education, Home Economics)",
    "Adult and Continuing Education",
    "Educational Administration",
    "Human Kinetics & Health Education",
    "Educational Foundations (Guidance & Counseling)",
    "Special Needs Education",
    "Arts & Social Sciences Education (Christian Religion Studies, English, French, Geography, History, Igbo, Islamic Studies, Yoruba, Early Childhood Education, Business Education, Education Economics)"
  ],
  facultyOfEngineering: [
    "Biomedical Engineering",
    "Chemical Engineering",
    "Civil & Environmental Engineering",
    "Computer Engineering",
    "Electrical/Electronics Engineering",
    "Mechanical Engineering",
    "Metallurgical & Materials Engineering",
    "Petroleum & Gas Engineering",
    "Surveying & Geoinformatics Engineering",
    "Systems Engineering"
  ],
  facultyOfEnvironmentalSciences: [
    "Architecture",
    "Building",
    "Estate Management",
    "Quantity Surveying",
    "Urban & Regional Planning"
  ],
  facultyOfLaw: [
    "Law"
  ],
  facultyOfManagementSciences: [
    "Accounting",
    "Accounting Taxation",
    "Actuarial Science",
    "Insurance",
    "Business Administration",
    "Banking & Finance",
    "Employment Relations and Human Resource Management",
    "Procurement Management"
  ],
  facultyOfPharmacy: [
    "Pharmacy",
    "Doctor of Pharmacy"
  ],
  facultyOfScience: [
    "Biochemistry",
    "Biostatistics",
    "Botany",
    "Cell Biology & Genetics",
    "Chemistry",
    "Computer Science",
    "Data Science",
    "Environmental Standards",
    "Fisheries and Aquaculture",
    "Geology",
    "Geophysics",
    "Industrial Mathematics",
    "Marine Biology",
    "Mathematics",
    "Microbiology",
    "Physics",
    "Statistics",
    "Zoology"
  ],
  facultyOfSocialSciences: [
    "Economics",
    "Economics and Development Studies",
    "Geography",
    "Meteorology and Climate Science",
    "Mass Communication",
    "Library and Information Science",
    "Political Science",
    "Psychology",
    "Public Administration",
    "Social Standards",
    "Social Work",
    "Sociology"
  ]
};

export const InputArray = [
    {id : "s_combination",label : "Subject Combination", inputType : "text",
  isDropdown : true,
   dropdown : ["English",
             "Mathematics", 
             "Physics", "Chemistry",
              "Biology", "Economics",
               "Government", 
               "Literature-in-English",
                "Agricultural Science",
                 "Geography"]},
                 {id : "college", label : "College of Choice",
                     inputType : "text",
                      isDropdown : true, dropdown : ["University of Lagos (UNILAG)"]},
                    {id : "faculty", label : "Faculty of Choice", inputType : "text",
                         isDropdown : true, dropdown : ["Faculty of Arts", "Faculty of Education", , "Faculty of Basic Medical Sciences",
                             "Faculty of Dental Sciences", "Faculty of Engineering",  "Faculty of Clinical sciences", "Faculty of Management Sciences",
                              "Faculty of Environmental Sciences", "Faculty of Law", "Faculty of Sciences", "Faculty of Social Sciences"],
                            },
                                 {id : "department", label : "Department of Choice", inputType : "text",
                         isDropdown : true,
                            }
]