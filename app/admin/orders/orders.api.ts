import {
  fetchAdminOrders,
  updateAdminOrderStatus,
  type AdminOrder,
} from '@/app/lib/apiClient';

export type { AdminOrder };

export async function loadAdminOrders(): Promise<AdminOrder[]> {
  return fetchAdminOrders();
}

export async function changeAdminOrderStatus(orderId: string, status: string): Promise<void> {
  await updateAdminOrderStatus(orderId, status);
}