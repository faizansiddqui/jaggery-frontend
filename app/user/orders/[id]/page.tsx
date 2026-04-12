"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Placeholder data since we do not have an API integrated for orders
const ORDER_ITEMS = [
  {
    id: 1,
    name: "Wild Forest Jaggery Blocks",
    collection: "Legacy Collection",
    details: "500g • Artisanal Press",
    price: "$42.00",
    qty: "01",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJC4ir3XT2ZZYLJw3R4lxnOaACchwHHnUv2yz0r1bJowKwzf6tznAdKPz9zslreOQ5dL9VR3bJ92INCv6heQ8oGkue05_K7bKd9u1eo8UqZu4o5vRNvcW1lONT1NpGOthrqUBmt0JRONCzKldz-AYhehmuXt7quSUa6D13QoscMkjRmNffkt5hvNOZ4yg56jEGJsVHEdqkihtNOnS0xfZxDKHxDTBSW95cBSG74KgFrRrBuCIPl9IEUrWB-twsQStY6ZK3_u4mwUc",
  },
  {
    id: 2,
    name: "Spiced Jaggery Nectar",
    collection: "Liquid Gold",
    details: "250ml • Limited Edition",
    price: "$28.00",
    qty: "02",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAt1PxUz5okBI1Bz3ItzWc3xaffKqpoNsw9Gm2Xvt7wkXLazAlya7WF124Li-9wqnUSrF_w3iFh1ELq9QRK3I4z6urmMreedjA4OphQV5u9spp-AmhXupv_NGeGUyOwo4IQC5NZ8dKKnGPf5gqo1G5LlHU0aXZD6CUOwVXXRC17qtq1dAmIIOozM4Vto6qCI2qErxWD29mjWfASSGsFkPMOktwuSC2aS6P7OUxeggsvem1IcMswFw7ydjFzjMCTayqDjZE9bAqK4uc",
  },
];

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params?.id ? decodeURIComponent(params.id as string) : "#AG-882910";

  return (
    <div className="flex-1 w-full max-w-screen-2xl mx-auto flex flex-col md:flex-row pb-24">
      {/* Main Content Canvas */}
      <div className="flex-1 overflow-x-hidden">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 gap-8">
          <div>
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-4 font-bold">
              <Link href="/user/orders" className="hover:text-primary transition-colors">Orders</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-secondary tracking-widest">Order {orderId}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline italic tracking-tighter text-primary">Order Details</h1>
            <p className="mt-4 text-on-surface-variant max-w-md font-body text-sm leading-relaxed">
              Placed on October 24, 2024. Your artisanal collection is currently in transit to its final destination.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 self-start xl:self-end">
            <button className="px-6 py-3 rounded-full border border-secondary text-secondary text-xs uppercase tracking-widest font-bold hover:bg-secondary/5 transition-colors">
              Download Invoice
            </button>
            <button className="px-8 py-3 rounded-full bg-primary text-on-primary text-xs uppercase tracking-widest font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
              Track Courier
            </button>
          </div>
        </div>

        {/* Delivery Progress Tracker */}
        <div className="bg-surface-container-low rounded-xl p-8 md:p-12 mb-12 relative overflow-hidden shadow-sm">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-8">
            <div className="flex-1 w-full">
              <div className="flex justify-between mb-8 relative">
                <div className="text-center z-10 w-20 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center mb-3 ring-4 ring-surface shadow-md">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                  </div>
                  <p className="text-[9px] uppercase tracking-tighter font-bold text-primary">Confirmed</p>
                </div>
                <div className="text-center z-10 w-20 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center mb-3 ring-4 ring-surface shadow-md">
                    <span className="material-symbols-outlined text-lg">inventory_2</span>
                  </div>
                  <p className="text-[9px] uppercase tracking-tighter font-bold text-primary">Processed</p>
                </div>
                <div className="text-center z-10 w-20 flex flex-col items-center">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-secondary text-on-primary flex items-center justify-center mb-3 ring-8 ring-secondary/20 shadow-lg">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                  </div>
                  <p className="text-[9px] uppercase tracking-tighter font-bold text-secondary">In Transit</p>
                </div>
                <div className="text-center opacity-40 z-10 w-20 flex flex-col items-center">
                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-outline-variant text-on-surface-variant flex items-center justify-center mb-3 ring-4 ring-surface">
                    <span className="material-symbols-outlined text-lg">house</span>
                  </div>
                  <p className="text-[9px] uppercase tracking-tighter font-bold">Delivered</p>
                </div>
                
                {/* Progress Line */}
                <div className="absolute top-5 left-10 right-10 h-1 bg-surface-variant rounded-full -z-10">
                  <div className="h-full bg-primary rounded-full w-2/3"></div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-64 bg-surface p-6 rounded-xl shadow-sm border border-outline-variant/10">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-2 font-bold">Estimated Arrival</p>
              <p className="text-2xl font-headline italic text-primary font-bold">Oct 29, 2024</p>
              <p className="text-xs text-on-surface-variant mt-2 font-medium">Via Premium Express</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Order Items */}
          <div className="xl:col-span-2 space-y-8">
            <h3 className="text-2xl lg:text-3xl font-headline italic text-primary font-bold">Purchased Items</h3>
            <div className="bg-surface rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
              <div className="divide-y divide-outline-variant/10">
                {ORDER_ITEMS.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 hover:bg-surface-container-low transition-colors group">
                    <div className="w-24 h-24 bg-surface-variant rounded-lg overflow-hidden flex-shrink-0">
                      <img className="w-full h-full object-cover" src={item.img} alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-1.5">{item.collection}</p>
                      <h4 className="text-lg lg:text-xl font-headline font-bold text-primary group-hover:text-secondary group-hover:underline transition-colors">{item.name}</h4>
                      <p className="text-xs text-on-surface-variant mt-1">{item.details}</p>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <p className="text-lg font-bold text-primary">{item.price}</p>
                      <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-8">
            {/* Address & Payment */}
            <div className="bg-surface-container rounded-xl p-8 space-y-8 shadow-sm">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 mb-4 font-bold">Shipping Address</p>
                <p className="text-sm font-bold text-primary">Julian Sterling</p>
                <p className="text-sm text-on-surface-variant leading-relaxed mt-2">
                  482 Heritage Way, Suite 12<br />
                  Charleston, SC 29401<br />
                  United States
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 mb-4 font-bold">Payment Method</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-primary rounded flex items-center justify-center shadow-inner">
                    <span className="text-[9px] text-on-primary font-bold tracking-wider">AMEX</span>
                  </div>
                  <p className="text-sm text-primary font-bold">Ending in •••• 9002</p>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-primary text-on-primary rounded-xl p-8 shadow-2xl shadow-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychiatry</span>
              </div>
              
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-primary-container/80 mb-8 font-bold">Order Summary</p>
              <div className="space-y-5 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Subtotal</span>
                  <span className="font-medium">$98.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Heritage Shipping</span>
                  <span className="font-medium">$12.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-80">Taxes</span>
                  <span className="font-medium">$8.40</span>
                </div>
                <div className="pt-6 mt-2 border-t border-on-primary/20 flex justify-between items-baseline">
                  <span className="text-[10px] uppercase tracking-widest font-bold">Total</span>
                  <span className="text-3xl font-headline italic font-bold">$118.40</span>
                </div>
              </div>
              <button className="w-full mt-10 py-4 rounded-full bg-secondary text-on-primary text-[10px] xl:text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-primary transition-colors shadow-lg relative z-10">
                Repeat Order
              </button>
            </div>

            {/* Support Badge */}
            <div className="text-center p-6 border border-outline-variant/30 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group">
              <p className="text-xs text-on-surface-variant mb-3">Need assistance with this order?</p>
              <a className="inline-flex items-center justify-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest border-b-2 border-secondary pb-1 group-hover:text-primary group-hover:border-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-sm">headset_mic</span>
                Contact Concierge
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
