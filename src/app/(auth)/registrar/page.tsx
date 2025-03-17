import { RegisterForm } from '@/components/auth/register-form';
import { CardTitle, CardContent } from '@/components/ui/card';

export default function RegisterPage(): JSX.Element {
  return (
    <>
      <CardTitle className="text-center">Registrar</CardTitle>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </>
  );
}
