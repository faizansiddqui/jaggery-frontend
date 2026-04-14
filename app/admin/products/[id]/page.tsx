import { redirect } from 'next/navigation';

export default async function ProductEditor({ params }: { params: Promise<{ id: string }> }) {
   const { id } = await params;
   redirect(`/admin/products?mode=edit&productId=${id}`);
}
