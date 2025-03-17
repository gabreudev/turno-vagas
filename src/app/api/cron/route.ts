import { historiesService } from '@/modules/history';

export async function GET(): Promise<Response> {
  console.log('Running cron job');
  try {
    await historiesService.addShiftsToHistory();
    return new Response('Cron job completed successfully', { status: 200 });
  } catch (error) {
    console.error('Error running job', error);
    return new Response('Error running cron job', { status: 500 });
  }
}
