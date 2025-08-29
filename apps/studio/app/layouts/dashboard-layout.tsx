import type { ReactElement } from 'react';
import { useLocation } from 'react-router';

import { AppSidebar } from '~/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Separator } from '~/components/ui/separator';
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { allMenuItems } from '~/lib/navigation';

interface BreadcrumbSegment {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

function generateBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [];

  // Always start with Dashboard
  const dashboardItem = allMenuItems.find((item) => item.href === '/');
  if (dashboardItem) {
    segments.push({
      label: dashboardItem.label,
      href: dashboardItem.href,
      isCurrentPage: pathname === '/',
    });
  }

  // If we're not on dashboard, add the current page
  if (pathname !== '/') {
    // Handle nested routes like /flashcards/1/play
    if (pathname.match(/^\/flashcards\/\d+\/play$/)) {
      const flashcardsItem = allMenuItems.find(
        (item) => item.href === '/flashcards',
      );
      if (flashcardsItem) {
        segments.push({
          label: flashcardsItem.label,
          href: flashcardsItem.href,
        });
      }
      segments.push({
        label: 'Play',
        href: pathname,
        isCurrentPage: true,
      });
    } else {
      // Find the matching menu item for simple routes
      const currentItem = allMenuItems.find((item) => item.href === pathname);
      if (currentItem) {
        segments.push({
          label: currentItem.label,
          href: currentItem.href,
          isCurrentPage: true,
        });
      }
    }
  }

  return segments;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full min-h-svh bg-[#f6f7fb] py-6 px-4 sm:px-6 lg:px-8 space-y-4">
        <header className="flex h-5 items-center gap-3">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((segment, index) => [
                index > 0 && <BreadcrumbSeparator key={`seperator-${index}`} />,
                <BreadcrumbItem key={segment.href}>
                  {segment.isCurrentPage ? (
                    <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={segment.href}>
                      {segment.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>,
              ])}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {children}
      </main>
    </SidebarProvider>
  );
}
