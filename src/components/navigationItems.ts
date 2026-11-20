import {
  CalendarDays,
  ChartNoAxesCombined,
  Dumbbell,
  Utensils,
  Trophy,
  LibraryBig,
  BookOpen,
  Shield,
  UserRound,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
export type NavigationItem = { path: string; label: string; icon: LucideIcon };
export const primaryNavigation: NavigationItem[] = [
  { path: '/workout', label: 'navToday', icon: Dumbbell },
  { path: '/program', label: 'program', icon: CalendarDays },
  { path: '/nutrition', label: 'nutrition', icon: Utensils },
  { path: '/progress', label: 'progress', icon: ChartNoAxesCombined },
];
export const navigationGroups: { label: string; items: NavigationItem[] }[] = [
  {
    label: 'navDaily',
    items: [
      { path: '/', label: 'overview', icon: LayoutDashboard },
      { path: '/test', label: 'test', icon: Trophy },
    ],
  },
  {
    label: 'navLibrary',
    items: [
      { path: '/library', label: 'library', icon: LibraryBig },
      { path: '/reference', label: 'reference', icon: BookOpen },
    ],
  },
  {
    label: 'navTools',
    items: [{ path: '/injuries', label: 'injuryModule', icon: Shield }],
  },
  {
    label: 'navSettings',
    items: [
      { path: '/profile', label: 'profile', icon: UserRound },
      { path: '/settings', label: 'settings', icon: Settings },
    ],
  },
];
export const legalNavigation = [
  'terms',
  'privacy',
  'storage',
  'medical',
  'ai',
  'advertising',
  'operator',
  'sources',
  'accessibility',
  'contact',
] as const;
