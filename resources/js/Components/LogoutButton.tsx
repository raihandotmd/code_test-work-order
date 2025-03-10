// resources/js/Components/LogoutButton.tsx
import { useForm } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { Button, ButtonProps } from '@/Components/ui/Button';

interface LogoutButtonProps extends Omit<ButtonProps, 'onClick'> {
  children?: React.ReactNode;
}

export function LogoutButton({ children, ...props }: LogoutButtonProps) {
  const form = useForm({});

  const handleLogout = () => {
    form.post(route('logout'));
  };

  return (
    <Button onClick={handleLogout} {...props}>
      {children || (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  );
}
