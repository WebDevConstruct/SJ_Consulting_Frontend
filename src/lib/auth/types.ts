export type UserProfile = "aspirant" | "undergraduate";

export interface UndergraduateAccountVerificationType {
  curent_college : string;
  current_faculty : string;
  current_department : string;
  current_year : number
}





export interface AspirantAccountVerificationType {
  subject_combination : string[],
  desired_college : string,
  desired_faculty : string,
  desired_department : string,
  //writtenJamb ?: boolean
}





