
import { SeatingPlanForm } from '@/components/custom/SeatingPlanForm';

export default function Home() {
  return (
    <div className="min-h-full bg-background flex flex-col items-center justify-center p-4 md:p-6 selection:bg-primary/20 selection:text-primary">
      <SeatingPlanForm />
    </div>
  );
}
