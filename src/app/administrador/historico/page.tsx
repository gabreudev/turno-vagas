import { RefreshHistoryButton } from '@/components/history/refresh-history-button';
import { UsersHistory } from '@/components/history/users-history';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HistoryPage(): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl md:text-3xl">
            Histórico de Presença
          </CardTitle>
          <RefreshHistoryButton />
        </div>
      </CardHeader>
      <CardContent>
        <UsersHistory />
      </CardContent>
    </Card>
  );
}
