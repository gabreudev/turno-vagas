import { Card } from '@/components/ui/card';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="flex w-80 flex-col gap-4 bg-secondary pt-5">
        {children}
      </Card>
    </main>
  );
}
