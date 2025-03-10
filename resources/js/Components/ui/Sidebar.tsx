import * as React from 'react';
import { cn } from '@/lib/utils';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/Components/ui/Button';

// Create a context for the sidebar
type SidebarContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

// Sidebar Provider component
export function SidebarProvider({ children, defaultOpen = true }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);

  const toggleSidebar = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Hook to use sidebar context
export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

// Sidebar component
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right';
}

export function Sidebar({ className, side = 'left', ...props }: SidebarProps) {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        'bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out',
        open ? 'w-80' : 'w-0',
        className
      )}
      data-state={open ? 'open' : 'closed'}
      data-side={side}
      {...props}
    />
  );
}

// Sidebar Header component
export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex h-16 items-center border-b border-sidebar-border px-4', className)}
      {...props}
    />
  );
}

// Sidebar Content component
export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex min-h-0 flex-1 flex-col overflow-auto', className)}
      {...props}
    />
  );
}

// Sidebar Group component
export function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  );
}

// Sidebar Group Label component
export function SidebarGroupLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useSidebar();

  return (
    <div
      className={cn(
        'mb-1 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70',
        className
      )}
      {...props}
    />
  );
}

// Sidebar Group Content component
export function SidebarGroupContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('w-full text-sm', className)}
      {...props}
    />
  );
}

// Sidebar Menu component
export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn('flex w-full min-w-0 flex-col gap-2', className)}
      {...props}
    />
  );
}

// Sidebar Menu Item component
export function SidebarMenuItem({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={cn('group/menu-item relative', className)}
      {...props}
    />
  );
}

// Sidebar Menu Button component
interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  asChild?: boolean;
}

export function SidebarMenuButton({
  className,
  isActive = false,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const { open } = useSidebar();

  return (
    <button
      data-active={isActive}
      className={cn(
        'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground',
        !open && 'justify-center',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Sidebar Trigger component
export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-7 w-7', className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

// Sidebar Inset component
export function SidebarInset({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('relative flex min-h-screen flex-1 flex-col bg-background', className)}
      {...props}
    />
  );
}
