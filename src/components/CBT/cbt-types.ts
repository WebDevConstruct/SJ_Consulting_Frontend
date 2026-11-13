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
  course_code: string;
  offering_id : string | null;
  faculty_name : string | null;
  college_name : string | null;
  department_name : string | null;
  short_description : string | null;
  course_title: string;
  objective: string | null;
  level: string;
  price: number | null;
  currency: string;
  access_status: "locked" | "unlocked";
  payment_status?: CoursePaymentStatus | null;
  payment_request_id?: string | null;
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

export type CoursePaymentStatus =
  | "pending_payment"
  | "payment_claimed"
  | "receipt_sent"
  | "approved"
  | "rejected"
  | "cancelled"
  | "expired";

export type CoursePaymentRequest = {
  id: string;
  course_id: string;
  status: CoursePaymentStatus;
  amount: number;
  currency: string;
  claimed_at: string | null;
  receipt_sent_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  expires_at: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export type CoursePaymentStateResponse = {
  course_id: string;
  payment_request: CoursePaymentRequest | null;
  access_status: "locked" | "unlocked";
};

export type StartCoursePaymentResponse = {
  success: true;
  payment_request: CoursePaymentRequest;
};