import { HOME } from '@/common/constants/routes';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound(): JSX.Element {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="space-y-6">
        <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Página não encontrada
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Desculpe, não conseguimos encontrar a página que você está
            procurando.
          </p>
        </div>
        <Button asChild>
          <Link href={HOME}>Voltar para a página inicial</Link>
        </Button>
      </div>
    </div>
  );
}
