import React from 'react';
import { Link } from '@inertiajs/react';
import { Home, Plus, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/Components/ThemeToggle';
    import { LogoutButton } from '@/Components/LogoutButton';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/Components/ui/Sidebar';

interface DashboardShellProps {
    children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <Sidebar>
                    <SidebarHeader className="border-b">
                        <div className="flex h-14 items-center px-4 font-semibold">Work Order Management</div>
                    </SidebarHeader>
                    <SidebarContent>
                        <DashboardNav />
                    </SidebarContent>
                </Sidebar>
                <SidebarInset>
                    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <LogoutButton variant="outline" size="icon">
                                <LogOut className="h-[1.2rem] w-[1.2rem]" />
                                <span className="sr-only">Logout</span>
                            </LogoutButton>
                        </div>
                    </header>
                    <main className="flex-1 space-y-4 p-4 pt-6 lg:p-8">{children}</main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}

function DashboardNav() {
    const pathname = window.location.pathname;

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/work-orders/lists'}>
                            <Link href="/work-orders/lists" className="flex items-center gap-2 p-2">
                                <Home className="h-4 w-4" />
                                <span>Work Orders</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
