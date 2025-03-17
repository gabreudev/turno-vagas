import { AdminShiftsTable } from '@/components/schedule/admin-shift-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgendamentosPage(): JSX.Element {
  // const agendamentos = [{}] // Lista vazia

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">
          Turnos por Usuário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AdminShiftsTable />
      </CardContent>
    </Card>
  );
}
