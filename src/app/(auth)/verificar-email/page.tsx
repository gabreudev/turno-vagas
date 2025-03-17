import { verifyEmail } from '@/app/actions';

import { CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { LOGIN } from '@/common/constants/routes';
import { Button } from '@/components/ui/button';

interface VerifyEmailPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps): Promise<JSX.Element> {
  let message = 'Verificando email...';

  if ('token' in searchParams && typeof searchParams.token === 'string') {
    const response = await verifyEmail(searchParams.token);

    console.log(response);

    if (!response.ok) {
      message = response.error;
    } else {
      message = 'Email verificado';
    }
  } else {
    message = 'Token inválido';
  }

  return (
    <>
      <CardTitle className="text-center">Verificar Email</CardTitle>
      <CardContent className="p-4 text-center">{message}</CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href={LOGIN}>Ir para a tela de entrada</Link>
        </Button>
      </CardFooter>
    </>
  );
}
