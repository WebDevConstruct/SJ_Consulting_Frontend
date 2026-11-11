import { useState } from "react";

import { Modal } from "@components/Modal";
import { Button } from "@components/Button";
import { TextField } from "../forms/text-field";
import { useStatusToast } from "@/components/ui/status-toast";
import { createClient } from "@lib/supabase/client";
import { ImCancelCircle } from "react-icons/im";
import { BookAudio } from "lucide-react";
import {facultyDepartments} from "../SettingUpModals/setUpData"
import { useGlobalContext } from "../../../Context";
import {
  InputArray,
  type UndergraduateSetupField,
} from "./setUpData";

type UndergraduateLevel =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600";

type UndergraduateAccountVerification = {
  current_college: string;
  current_faculty: string;
  current_department: string;
  current_level: UndergraduateLevel;
};

type InitialSetUpProps = {
  header: string;
  text: string;
  buttonText: string;
  setInitialSetUpState: () => void;
};

const levelOptions: UndergraduateLevel[] = [
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
];

const InitialSetUp = ({
  header,
  text,
  buttonText,
  setInitialSetUpState,
}: InitialSetUpProps) => {
  const { showToast } = useStatusToast();

  const {
    setAccountCompletionState,
    setFacultyValue,
    facultyValue,
    departmentValue,
    collegeValue,
    setDepartmentValue,
    setCollegeValue,
  } = useGlobalContext();

  const [levelValue, setLevelValue] =
    useState<UndergraduateLevel | "">("");

  const [dropDownState, setDropDownState] = useState<
    {
      id: number;
      field: UndergraduateSetupField;
      dropdown: boolean;
    }[]
  >(
    InputArray.map((item, index) => ({
      id: index,
      field: item.id,
      dropdown: false,
    })),
  );

  const [departmentalArray, setDepartmentalArray] = useState<
    string[]
  >([]);

  const closeAllDropdowns = () => {
    setDropDownState((previous) =>
      previous.map((item) => ({
        ...item,
        dropdown: false,
      })),
    );
  };

  const facultySwitch = (faculty: string) => {
    switch (faculty) {
      case "Arts":
        setDepartmentalArray(
          facultyDepartments.facultyOfArts,
        );
        break;

      case "Education":
        setDepartmentalArray(
          facultyDepartments.facultyOfEducation,
        );
        break;

      case "Basic Medical Sciences":
        setDepartmentalArray(
          facultyDepartments.facultyOfBasicMedicalSciences,
        );
        break;

      case "Dental Sciences":
        setDepartmentalArray(
          facultyDepartments.facultyOfDentalSciences,
        );
        break;

      case "Engineering":
        setDepartmentalArray(
          facultyDepartments.facultyOfEngineering,
        );
        break;

      case "Clinical Sciences":
        setDepartmentalArray(
          facultyDepartments.facultyOfClinicalSciences,
        );
        break;

      case "Management Sciences":
        setDepartmentalArray(
          facultyDepartments.facultyOfManagementSciences,
        );
        break;

      case "Environmental Sciences":
        setDepartmentalArray(
          facultyDepartments.facultyOfEnvironmentalSciences,
        );
        break;

      case "Law":
        setDepartmentalArray(
          facultyDepartments.facultyOfLaw,
        );
        break;

      case "Sciences":
        setDepartmentalArray(
          facultyDepartments.facultyOfScience,
        );
        break;

      case "Social Sciences":
        setDepartmentalArray(
          facultyDepartments.facultyOfSocialSciences,
        );
        break;

      default:
        setDepartmentalArray([]);
    }
  };

  const handleFieldClick = (
    field: UndergraduateSetupField,
    index: number,
  ) => {
    if (
      field === "faculty" &&
      departmentValue.length > 1
    ) {
      setDepartmentalArray([]);
      setDepartmentValue("");
    }

    setDropDownState((previous) =>
      previous.map((item, itemIndex) => ({
        ...item,
        dropdown: itemIndex === index,
      })),
    );
  };

  const handleCollegeSelect = (value: string) => {
    setCollegeValue(value);
    closeAllDropdowns();
  };

  const handleFacultySelect = (value: string) => {
    setFacultyValue(value);
    setDepartmentalArray([]);
    setDepartmentValue("");
    facultySwitch(value);
    closeAllDropdowns();
  };

  const handleDepartmentSelect = (value: string) => {
    setDepartmentValue(value);
    closeAllDropdowns();
  };

  const handleLevelSelect = (value: UndergraduateLevel) => {
    setLevelValue(value);
    closeAllDropdowns();
  };

  const updateUserProfile = async () => {
    if (
      !collegeValue ||
      !facultyValue ||
      !departmentValue ||
      !levelValue
    ) {
      showToast({
        kind: "error",
        title: "Incomplete profile",
        message:
          "Select your current college, faculty, department, and level.",
      });

      return;
    }

    try {
      const supabase = createClient();

      const {
        data: authData,
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authData.user) {
        showToast({
          kind: "error",
          title: "Identification error",
          message: "Log in again to continue.",
        });

        return;
      }

      const accountVerification: UndergraduateAccountVerification = {
        current_college: collegeValue?.toLowerCase(),
        current_faculty: facultyValue?.toLowerCase(),
        current_department: departmentValue?.toLowerCase(),
        current_level: levelValue,
      };

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .update({
            unilag_year: parseInt(levelValue, 10) || 1,
          })
          .eq("id", authData.user.id)
          .select()
          .single();

      if (profileError || !profile) {
        showToast({
          kind: "error",
          title: "Profile update failed",
          message:
            "We could not save your current academic details.",
        });

        return;
      }

      const { error: metadataError } =
        await supabase.auth.updateUser({
          data: {
            account_verification: accountVerification,
          },
        });

      if (metadataError) {
        showToast({
          kind: "error",
          title: "Profile update failed",
          message:
            "Your academic details were saved, but the session could not be refreshed.",
        });

        return;
      }

      setInitialSetUpState();

      showToast({
        kind: "success",
        title: "Account verification successful",
        message:
          "Your CBT contents are now personalized to your current academic details.",
      });
    } catch {
      showToast({
        kind: "error",
        title: "Server error",
        message: "Try again later.",
      });
    }
  };

  return (
    <Modal>
      <div className="flex h-full w-full items-center md:justify-center lg:pr-10">
        <div className="flex h-screen w-full flex-col gap-10 overflow-y-scroll rounded-lg bg-paper-line px-5 py-4 md:h-3/4 md:w-1/2 dark:bg-ink-surface [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <div className="flex w-full justify-end">
            <ImCancelCircle
              className="cursor-pointer text-[20px] text-current/60 hover:text-current/80"
              onClick={() => setAccountCompletionState(false)}
            />
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-[25px] font-bold leading-[30px] text-black lg:text-[30px] lg:leading-[35px] dark:text-white">
              {header}
            </h1>

            <BookAudio className="h-10 w-10 rounded-lg bg-gold-metal-soft" />
          </div>

          <p className="text-base font-semibold text-current/60 dark:text-white">
            {text}
          </p>

          <div className="relative z-0 flex h-full w-full flex-col gap-5">
            {InputArray.map((item, index) => (
              <div
                key={item.id}
                className="w-full relative"
              >
                <TextField
                  value={
                    item.id === "faculty"
                      ? facultyValue
                      : item.id === "college"
                        ? collegeValue
                        : item.id === "department"
                          ? departmentValue
                          : item.id === "level"
                            ? levelValue
                            : ""
                  }
                  readOnly={item.isDropdown}
                  onClick={() =>
                    handleFieldClick(item.id, index)
                  }
                  label={item.label}
                  type={item.inputType}
                />

                {dropDownState[index]?.dropdown && (
                  <div className="absolute top-20
                   z-10 flex max-h-[300px] w-full 
                   flex-col overflow-y-scroll rounded-lg border
                    border-gray-200 bg-white text-black shadow-lg dark:border-ink-line dark:bg-black dark:text-white [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                    {item.id === "college" &&
                      item.dropdown.map((value) => (
                        <button
                          key={value}
                          type="button"
                          className="w-full border-y border-y-gray-200 px-3 py-4 text-left text-base font-semibold text-current/70 transition hover:bg-gray-50 dark:border-ink-line dark:hover:bg-ink-surface"
                          onClick={() =>
                            handleCollegeSelect(value)
                          }
                        >
                          {value}
                        </button>
                      ))}

                    {item.id === "faculty" &&
                      item.dropdown.map((value) => (
                        <button
                          key={value}
                          type="button"
                          className="w-full border-y border-y-gray-200 px-3 py-4 text-left text-base font-semibold text-current/70 transition hover:bg-gray-50 dark:border-ink-line dark:hover:bg-ink-surface"
                          onClick={() =>
                            handleFacultySelect(value)
                          }
                        >
                          {value}
                        </button>
                      ))}

                    {item.id === "department" &&
                      departmentalArray.map((value) => (
                        <button
                          key={value}
                          type="button"
                          className="w-full border-y border-y-gray-200 px-3 py-4 text-left text-base font-semibold text-current/70 transition hover:bg-gray-50 dark:border-ink-line dark:hover:bg-ink-surface"
                          onClick={() =>
                            handleDepartmentSelect(value)
                          }
                        >
                          {value}
                        </button>
                      ))}

                    {item.id === "level" &&
                      levelOptions.map((value) => (
                        <button
                          key={value}
                          type="button"
                          className="w-full border-y border-y-gray-200 px-3 py-4 text-left text-base font-semibold text-current/70 transition hover:bg-gray-50 dark:border-ink-line dark:hover:bg-ink-surface"
                          onClick={() =>
                            handleLevelSelect(value)
                          }
                        >
                          {value}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            className="mx-auto mb-20 flex w-full justify-center rounded-md text-center lg:w-[200px]"
            text={buttonText}
            type="submit"
            onClick={updateUserProfile}
          />
        </div>
      </div>
    </Modal>
  );
};

export default InitialSetUp;