/**
 * Wholesale WhatsApp: set digits-only or E.164 in env (exposed to browser).
 * Example: NEXT_PUBLIC_WHOLESALE_WHATSAPP=919876543210
 */
export function getWholesaleWhatsAppUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_WHOLESALE_WHATSAPP ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "";
  const digits = String(raw).replace(/\D/g, "");
  if (!digits) return "#";

  const text =
    process.env.NEXT_PUBLIC_WHOLESALE_WHATSAPP_MESSAGE?.trim() ||
    "Hello, I would like to inquire about wholesale.";
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${query}`;
}
