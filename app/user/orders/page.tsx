"use client";
import React from "react";
import Link from "next/link";

const ORDERS = [
  {
    id: "#AG-2024-8841",
    date: "Oct 14, 2024",
    status: "In Transit",
    statusColor: "text-secondary",
    statusBg: "bg-secondary",
    icon: null,
    total: "$124.50",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDb_zITIg8SyrMgppVFcWtjSEL08xFuSgKiF26Wi5FZfzcahg9_CiOq2bc0NeDQ-GXovw4uSLyCPylP4Qf1E_4XTA_I0e7_WKO1UWOXE6brDFlkIgzBItKXdS9WoVLsKn5iqncX6xzW4r8bzZZqTO-mJC4BIM6REUfzrO1ImKw5gRAoUIqnC6uxL08kz7fOTVj3JI5GuVq4Z5UBa7iQtgczKhhvLQy26zH5UxRRY2RlBT9KlbCOFx9gciIX7DKsjFbtAdfnHwje_cI",
    opacityClass: "",
  },
  {
    id: "#AG-2024-9102",
    date: "Oct 18, 2024",
    status: "Harvesting",
    statusColor: "text-primary",
    statusBg: null,
    icon: "eco",
    total: "$89.00",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuACFH53JRsK-2c45bjnYPOqCdxcND36BlyqkouCYIMnKstzhfScaQau1PF5E3_Or8cYnYHtJ7ScJnLy8aAiQHXvVrClrk-eIYpDytVkYIywbYdKsIaQazrFmwfODjcQwzjRuCRIpLS3r9LqNw5s_AZh3AcozfTUEqdIzkHHWceo_mvGrJl74LOKcwxckvPvsnvqwCt4NFK5JHjysmpLj0kAqyz99DO39k0wuhyNlwXgy0-IvGju5D9wE2MaHzz2cDQW8rASfPfuCVk",
    opacityClass: "",
  },
  {
    id: "#AG-2024-7622",
    date: "Sep 12, 2024",
    status: "Delivered",
    statusColor: "text-on-surface-variant",
    statusBg: null,
    icon: "check_circle",
    total: "$210.15",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsULFmkhwdQubwSh1sGKrRlL2AD_XhapX4-6vIEfPuzMHCGFjU9X0niXo5tLcGuaGs-jHUudZpqxfTY3DeQ-8_ETu2AzKACcIeTbjjq63sfoFAJ-_kSPsTPOJeUM39hoHZkZFX4rFj6w2NXRDu5GXPd1GTmH28mzviTMJynfnu2EsHJIX36I81cnRYOFr8F3yFzORp-5D2aCV19Su60aCd4r-bwiWQrZTJy7peOq1EMUTxEu7FQDIVFWGOFAuIFwEra5EvK3yO_Y0",
    opacityClass: "opacity-80 grayscale-[10%]",
  },
];

export default function OrdersPage() {
  return (
    <div className="flex-grow">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline tracking-tighter text-primary italic">Order History</h1>
          <p className="text-on-surface-variant mt-2 font-body text-sm">Tracking your journey through the harvest.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-secondary font-bold uppercase tracking-widest cursor-pointer hover:bg-secondary/10 px-3 py-1.5 rounded-lg transition-colors">
          <span>All Seasons</span>
          <span className="material-symbols-outlined text-lg">expand_more</span>
        </div>
      </div>

      {/* Orders Grid/List */}
      <div className="space-y-8">
        {ORDERS.map((order) => (
          <div key={order.id} className={`bg-surface-container-low rounded-xl p-6 md:p-8 transition-all hover:bg-surface-container group border border-transparent hover:border-outline-variant/30 ${order.opacityClass}`}>
            <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-white shadow-sm">
                <img alt="Order Item" className="w-full h-full object-cover" src={order.img} />
              </div>
              
              <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 w-full">
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Order Number</p>
                  <p className="font-bold text-primary text-sm md:text-base">{order.id}</p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Date Placed</p>
                  <p className="font-body text-sm md:text-base text-primary/80">{order.date}</p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Status</p>
                  <div className={`flex items-center gap-2 ${order.statusColor}`}>
                    {order.statusBg && <span className={`w-2 h-2 rounded-full ${order.statusBg}`}></span>}
                    {order.icon && <span className="material-symbols-outlined text-[16px] md:text-[20px]">{order.icon}</span>}
                    <p className="font-bold text-sm md:text-base">{order.status}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Total</p>
                  <p className="font-headline italic text-lg md:text-xl text-primary font-bold">{order.total}</p>
                </div>
              </div>
              
              <div className="w-full xl:w-auto self-stretch flex items-end">
                <Link
                  href={`/user/orders/${encodeURIComponent(order.id)}`}
                  className="w-full xl:w-auto px-8 py-3 rounded-full border-[1.5px] border-secondary text-secondary font-bold text-xs uppercase tracking-widest hover:bg-secondary-container/20 transition-all text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Message */}
      <div className="mt-20 py-16 border-t border-outline-variant/20 flex flex-col items-center text-center">
        <span className="material-symbols-outlined text-4xl text-outline mb-4 opacity-50">history</span>
        <p className="font-headline text-2xl text-primary italic font-bold">Looking for older harvests?</p>
        <p className="text-on-surface-variant max-w-sm mt-3 text-sm leading-relaxed">
          Orders older than one year are archived. Please contact our heritage concierge for historical records.
        </p>
      </div>
    </div>
  );
}
