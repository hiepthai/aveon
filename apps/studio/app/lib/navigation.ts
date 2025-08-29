import {
  ChartNoAxesCombinedIcon,
  FileCheckIcon,
  HomeIcon,
  MessageCircleQuestionMarkIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';

export interface MenuItem {
  href: string;
  icon: React.ComponentType;
  label: string;
  disabled: boolean;
}

export const mainMenuItems: MenuItem[] = [
  {
    href: '/',
    icon: HomeIcon,
    label: 'Dashboard',
    disabled: false,
  },
  {
    href: '/flashcards',
    icon: FileCheckIcon,
    label: 'Flashcards',
    disabled: false,
  },
  {
    href: '/quizzes',
    icon: MessageCircleQuestionMarkIcon,
    label: 'Quizzes',
    disabled: true,
  },
  {
    href: '/analytics',
    icon: ChartNoAxesCombinedIcon,
    label: 'Analytics',
    disabled: true,
  },
];

export const accountMenuItems: MenuItem[] = [
  {
    href: '/profile',
    icon: UserIcon,
    label: 'Profile',
    disabled: true,
  },
  {
    href: '/settings',
    icon: SettingsIcon,
    label: 'Settings',
    disabled: true,
  },
];

export const allMenuItems = [...mainMenuItems, ...accountMenuItems];
