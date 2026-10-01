import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookMarked,
  LayoutDashboard,
  MessageCircle,
  ScrollText,
  User,
} from "lucide-react";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const aspirantNavItems: DashboardNavItem[] = [
  { href: "/dashboard/aspirant", label: "Home", icon: LayoutDashboard },
  {
    href: "/dashboard/aspirant/analysis",
    label: "Analysis",
    icon: BarChart3,
  },
  {
    href: "/dashboard/aspirant/study",
    label: "Study",
    icon: BookMarked,
  },
  
  {
    href: "/dashboard/aspirant/guidance",
    label: "1:1 Guidance",
    icon: MessageCircle,
  },
  
  { href: "/dashboard/aspirant/profile", label: "Profile", icon: User },
];

export const undergraduateNavItems: DashboardNavItem[] = [
  {
    href: "/dashboard/undergraduate",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  { href: "/dashboard/undergraduate/gst", label: "GST", icon: BookMarked },
  {
    href: "/dashboard/undergraduate/cbt",
    label: "CBT Questions",
    icon: ScrollText,
  },
  {
    href: "/dashboard/undergraduate/profile",
    label: "Profile",
    icon: User,
  },
];
