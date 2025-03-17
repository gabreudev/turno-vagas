import { LoginForm } from '@/components/auth/login-form';
import { CardTitle, CardContent } from '@/components/ui/card';

export default function LoginPage(): JSX.Element {
  return (
    <>
      <CardTitle className="text-center">Entrar</CardTitle>
      <CardContent>
        <LoginForm />
      </CardContent>
    </>
  );
}
