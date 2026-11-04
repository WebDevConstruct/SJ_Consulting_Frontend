export type CBTSessionMode = "solo" | "peer" | "multiplayer";

export type MultiplayerInvitationStatus =
  | "invited"
  | "accepted"
  | "active"
  | "disconnected"
  | "completed"
  | "forfeited"
  | null;

export type StudentCourse = {
  id: string;
  offering_id: string;
  course_code: string;
  course_title: string;
  objective: string;
  college_name: string;
  faculty_name: string;
  department_name: string;
  level: string;
  price: number | null;
  currency: string;
  access_status: "locked" | "unlocked";
};

export type MultiplayerSessionNotification = {
  id: string;
  course_id: string;
  title: string;
  host_name: string;
  starts_at: string | null;
  invitation_status: MultiplayerInvitationStatus;
};

export type StudentCBTCoursesResponse = {
  student: {
    id: string;
    full_name: string;
    current_college: string | null;
    current_faculty: string | null;
    current_department: string | null;
    current_level: string | null;
  } | null;
  courses: StudentCourse[];
  multiplayer_session: MultiplayerSessionNotification | null;
  error?: string;
};