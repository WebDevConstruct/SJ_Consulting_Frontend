
"use client";
import {useGlobalContext} from "../../../Context";


export interface SubjectItem {
  id: number;
  subject: string;
  subjectChosen: boolean;
}

export const subjectChoiceState = [ 
{id : 0, subject :"English Language", subjectChosen : false}, 
{id : 1, subject :"Mathematics", subjectChosen : false}, 
{id : 2, subject :"Further Mathematics", subjectChosen : false}, 
{id : 3, subject :"Physics", subjectChosen : false}, 
{id : 4, subject :"Chemistry", subjectChosen : false}, 
{id : 5, subject :"Biology", subjectChosen : false}, 
 {id : 6, subject :"Economics", subjectChosen : false},
 {id : 7, subject :"Government", subjectChosen : false},
 {id : 8, subject :"Geography", subjectChosen : false},
 {id : 9, subject :"History", subjectChosen : false},
{ id : 10, subject :"Literature-in-English", subjectChosen : false},
 {id : 11, subject :"CRS/IRS", subjectChosen : false},
{ id : 12, subject :"French", subjectChosen : false},
 {id : 13, subject :"Agricultural Science", subjectChosen : false},
 {id : 14, subject :"Commerce", subjectChosen : false},
{ id : 15, subject :"Accounting", subjectChosen : false},
 {id : 16, subject :"Fine Arts", subjectChosen : false},
 {id : 17, subject :"Technical Drawing", subjectChosen : false},
 {id : 18, subject :"Igbo", subjectChosen : false},
 {id : 19, subject :"Yoruba", subjectChosen : false},
{ id : 20, subject :"Arabic", subjectChosen : false},
 {id : 21, subject :"Civic Education", subjectChosen : false},
 {id : 22, subject :"Data Processing/Computer Studies", subjectChosen : false},
 {id : 23, subject :"Music", subjectChosen : false},
{ id : 24, subject :"Business Management/Studies", subjectChosen : false},
 {id : 25, subject :"Nigerian Language", subjectChosen : false}
  ];


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
   dropdown : [""]},
                 {id : "college", label : "College of Choice",
                     inputType : "text",
                      isDropdown : true, dropdown : ["University of Lagos (UNILAG)"]},
                    {id : "faculty", label : "Faculty of Choice", inputType : "text",
                         isDropdown : true, dropdown : ["Arts", "Education", , "Basic Medical Sciences",
                             "Dental Sciences", "Engineering",  "Clinical sciences", "Management Sciences",
                              "Environmental Sciences", "Law", "Sciences", "Social Sciences"],
                            },
                                 {id : "department", label : "Department of Choice", inputType : "text",
                         isDropdown : true,
                            }
]