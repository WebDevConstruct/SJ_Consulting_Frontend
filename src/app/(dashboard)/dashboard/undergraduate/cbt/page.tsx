"use client";

import { useRouter } from "next/navigation";

import CBTPage from "@/components/CBT/CBTPage";
import { useStatusToast } from "@/components/ui/status-toast";
import { usePathname } from "next/navigation"
import type { StudentCourse } from "@/components/CBT/cbt-types";

const UndergraduateCBTPage = () => {
  const pathname = usePathname();
  console.log(pathname);
  const router = useRouter();
  const { showToast } = useStatusToast();

  const handleStudyCourse = (course: StudentCourse) => {
    router.push(`/dashboard/undergraduate/cbt/${course.id}/study`);
  };

  const handleBuyCourse = async (course: StudentCourse) => {
    try {
      const response = await fetch(`/api/student/cbt/courses/${course.id}/checkout`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: course.id,
        }),
      });
      if(response.ok && window !== undefined){
            window.location.reload()
 }

      //const result = await response.json();

      if (!response.ok) {
      showToast({
        kind: "error",
        title: "Payment Failed",
        message: `${course.course_code} purchase failed at this time..`,
      });
      }

      showToast({
        kind: "success",
        title: "Payment successful",
        message: `${course.course_code} is now unlocked.`,
      });

      router.refresh();
    } catch (error) {
      showToast({
        kind: "error",
        title: "Checkout failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to complete checkout.",
      });
    }
  };

  return (
    <CBTPage
      onStudyCourse={handleStudyCourse}
      onBuyCourse={handleBuyCourse}
    />
  );
};

export default UndergraduateCBTPage;