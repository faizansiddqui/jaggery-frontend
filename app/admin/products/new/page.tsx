
import { redirect } from 'next/navigation';

export default function AdminProductUploadRoute() {
  redirect('/admin/products?mode=new');
}