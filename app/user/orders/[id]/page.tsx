import OrderDetail from './components/Comp1';
import Comp7 from '@/app/components/Comp7';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
      <OrderDetail orderId={id ?? ''} />
      <Comp7 />
    </div>
  );
}
