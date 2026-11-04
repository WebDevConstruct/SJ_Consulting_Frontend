export const ANNOUNCEMENT_CATEGORIES = ["mentorship", "unilag", "jamb", "accommodation"] as const;
export type AnnouncementCategory = (typeof ANNOUNCEMENT_CATEGORIES)[number];
//ADD SOURCE, FOR BIG ORGANIZATIONS KNOW THE PRIMARY WRITTEN SOURCE IS ACKNWOLEDGED
export interface AnnouncementInput { 
    category: AnnouncementCategory; 
    title:string; subtext:string;
     content:string; summary?:string; 
     image_url?:string; link?:string; 
     location?:string; event_date?:string;
      is_published:boolean; slug : string;  source_name : string
    }
export interface AnnouncementRecord extends AnnouncementInput { id:string; created_at : string; updated_at?:string; }