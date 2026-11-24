import {
  BookOpen,
  ChartColumn,
  Dumbbell,
  Flag,
  House,
  ListChecks,
  Settings,
  Target,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  /** ボトムナビ用の短い名称 */
  shortLabel: string;
  icon: LucideIcon;
}

/** スマホのボトムナビに常時表示する画面 */
export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "ホーム", shortLabel: "ホーム", icon: House },
  { href: "/habits", label: "習慣", shortLabel: "習慣", icon: ListChecks },
  {
    href: "/challenges",
    label: "チャレンジ",
    shortLabel: "チャレンジ",
    icon: Flag,
  },
  {
    href: "/workouts",
    label: "筋トレ・ジム",
    shortLabel: "筋トレ",
    icon: Dumbbell,
  },
];

/** スマホでは「その他」にまとめる画面 */
export const SECONDARY_NAV: NavItem[] = [
  {
    href: "/goals",
    label: "目標・タスク",
    shortLabel: "目標",
    icon: Target,
  },
  {
    href: "/analytics",
    label: "積み上げ・分析",
    shortLabel: "分析",
    icon: ChartColumn,
  },
  {
    href: "/reviews",
    label: "振り返り",
    shortLabel: "振り返り",
    icon: BookOpen,
  },
  { href: "/settings", label: "設定", shortLabel: "設定", icon: Settings },
];

export const ALL_NAV: NavItem[] = [...PRIMARY_NAV, ...SECONDARY_NAV];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
