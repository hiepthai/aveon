import type { ReactElement } from 'react';

import { AppSidebar } from '~/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-[#f6f7fb] py-6 px-4 sm:px-6 lg:px-8 space-y-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
