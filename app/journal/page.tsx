import Comp1 from './components/Comp1';
import Comp2 from './components/Comp2';
import Comp7 from '@/app/components/Comp7';

export default function JournalRoute() {
  return (
    <main className="bg-[#fcf8f8] min-h-screen">
      <div data-scroll-section>
        <Comp1 />
        <Comp2 />
        <Comp7 />
      </div>
    </main>
  );
}