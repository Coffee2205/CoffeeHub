export type NavigationItem = {
  href: string;
  label: string;
  shortLabel?: string;
  icon:
    | "home"
    | "target"
    | "check"
    | "calendar"
    | "notes"
    | "roadmap"
    | "spark"
    | "profile"
    | "settings"
    | "more";
};

export const desktopNavigation: Array<{
  label: string;
  items: NavigationItem[];
}> = [
  {
    label: "Tổng quan",
    items: [{ href: "/app/dashboard", label: "Dashboard", icon: "home" }],
  },
  {
    label: "Workspace",
    items: [
      { href: "/app/goals", label: "Mục tiêu", icon: "target" },
      { href: "/app/tasks", label: "Công việc", icon: "check" },
      { href: "/app/calendar", label: "Lịch", icon: "calendar" },
      { href: "/app/notes", label: "Ghi chú", icon: "notes" },
      { href: "/app/roadmaps", label: "Lộ trình", icon: "roadmap" },
    ],
  },
  {
    label: "Trí tuệ",
    items: [{ href: "/app/ai", label: "AI Assistant", icon: "spark" }],
  },
  {
    label: "Tài khoản",
    items: [
      { href: "/app/profile", label: "Hồ sơ", icon: "profile" },
      { href: "/app/settings", label: "Cài đặt", icon: "settings" },
    ],
  },
];

export const mobileNavigation: NavigationItem[] = [
  {
    href: "/app/dashboard",
    label: "Trang chủ",
    shortLabel: "Home",
    icon: "home",
  },
  {
    href: "/app/goals",
    label: "Mục tiêu",
    shortLabel: "Goals",
    icon: "target",
  },
  {
    href: "/app/tasks",
    label: "Công việc",
    shortLabel: "Tasks",
    icon: "check",
  },
  {
    href: "/app/calendar",
    label: "Kế hoạch",
    shortLabel: "Planner",
    icon: "calendar",
  },
  {
    href: "/app/settings",
    label: "Xem thêm",
    shortLabel: "More",
    icon: "more",
  },
];
