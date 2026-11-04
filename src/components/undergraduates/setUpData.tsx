export type UndergraduateSetupField =
  | "college"
  | "faculty"
  | "department"
  | "level";

export type SetupInput = {
  id: UndergraduateSetupField;
  label: string;
  inputType: string;
  isDropdown: boolean;
  dropdown: string[];
};

export const InputArray: SetupInput[] = [
  {
    id: "college",
    label: "Current College",
    inputType: "text",
    isDropdown: true,
    dropdown: [
       "UNILAG",

    ],
  },
  {
    id: "faculty",
    label: "Current Faculty",
    inputType: "text",
    isDropdown: true,
    dropdown: [
      "Arts",
      "Education",
      "Basic Medical Sciences",
      "Dental Sciences",
      "Engineering",
      "Clinical Sciences",
      "Management Sciences",
      "Environmental Sciences",
      "Law",
      "Sciences",
      "Social Sciences",
    ],
  },
  {
    id: "department",
    label: "Current Department",
    inputType: "text",
    isDropdown: true,
    dropdown: [],
  },
  {
    id: "level",
    label: "Current Level",
    inputType: "text",
    isDropdown: true,
    dropdown: [
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
    ],
  },
];