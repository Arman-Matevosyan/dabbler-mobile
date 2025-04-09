import { useCheckIn } from '@/hooks/checkin/useCheckIn';
import CheckinClassesScreen from './CheckinClassesScreen';

export default function CheckinClassesRoute() {
  const { checkInData, isLoading } = useCheckIn();
  return <CheckinClassesScreen data={checkInData} isLoading={isLoading} />;
}
