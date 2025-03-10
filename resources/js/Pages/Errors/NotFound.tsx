import { Head, Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';

interface NotFoundProps {
  message: string;
  description: string;
}

export default function NotFound({ message, description }: NotFoundProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <Head title="Not Found" />

      <div className="mb-4 text-6xl font-bold text-primary">404</div>
      <h1 className="mb-2 text-2xl font-bold">{message}</h1>
      <p className="mb-8 text-muted-foreground">{description}</p>

      <Link href="/dashboard">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  );
}
