"use client"
import {getAnnouncements} from "@lib/api";
import { useState, useEffect} from "react"
import type { AnnouncementRecord } from "@/types/announcementTypes"
// type informationCategories = "mentorship" | "unilag" | "jamb" | "accommodation" 


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
  type: 'jamb' | 'unilag' | 'mentorship' | 'accommodation';
  title: string;
  description: string;
  link: string;
  data: AnnouncementRecord[];
}

// export const informationData: InformationCategory[] = [
//   {
//     type: "exam",
//     title: "Exam Body Guidelines & Updates",
//     description: "Examination updates, guidelines, syllabus changes, and official gazette bulletins directly from JAMB and national examination bodies.",

//     link : "/exam",
//  //   data: jambAnnouncements
//   },
//   {
//     type: "college",
//     title: "College Entry Guidelines",
//     description: "Accurate and timely institutional admission guidelines, Post-UTME screening requirements, and departmental cut-off rules.",
//     link : "/college-entry",
//     //data: unilagAnnouncements
//   },
//   {
//     type: "mentorship",
//     title: "Mentorship & Scholarship Opportunities",
//     description: "Mentorship guides, hackathons, and scholarship opportunities from reputable organizations for ambitious youths and students. DON'T MISS OUT!",
//     link : "/mentorship",
//     //data:  mentorshipAnnouncements
//   },
//   {
//     type: "undergraduate",
//     title: "Undergraduate Information & Correspondents",
//     description: "Campus notices, course registration deadlines, dockets, GST login access, continuous assessment updates, and campus accommodation alerts.",
//     link : "/undergraduate",
//     //data:  accommodationAnnouncements
//   }
// ];