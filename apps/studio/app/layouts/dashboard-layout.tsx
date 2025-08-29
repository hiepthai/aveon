import type { ReactElement } from 'react';

import { AppSidebar } from '~/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';
import { Separator } from '~/components/ui/separator';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-[#f6f7fb] py-6 px-4 sm:px-6 lg:px-8 space-y-4">
        <header className="flex h-5 items-center gap-3">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        {children}
      </main>
    </SidebarProvider>
  );
}
