import Link from 'next/link';
import Comp7 from '@/app/components/Comp7';

type CheckoutSuccessPageProps = {
    searchParams: Promise<{
        orderCode?: string;
        paymentId?: string;
    }>;
};

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
    const params = await searchParams;
    const orderCode = params.orderCode || 'N/A';
    const paymentId = params.paymentId || 'N/A';
    const brandName = (process.env.NEXT_PUBLIC_SITE_NAME || 'STREETRIOT').toUpperCase();

    return (
        <main className="bg-[#fcf8f8] min-h-screen text-[#1c1b1b]">
            <section className="pt-28 pb-16 px-4 md:px-8 max-w-[1100px] mx-auto">
                <div className="border-4 border-[#1c1b1b] bg-white p-8 md:p-12">
                    <p className="font-headline text-[10px] uppercase tracking-[0.35em] text-[#b90c1b] font-black">
                        Payment Verified
                    </p>
                    <h1 className="font-brand text-5xl md:text-7xl uppercase tracking-tighter mt-3">
                        Order Success
                    </h1>
                    <p className="font-headline text-xs uppercase tracking-widest opacity-60 mt-4">
                        Thank you for shopping with {brandName}.
                    </p>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-[#1c1b1b]/20 p-4">
                            <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Order Code</p>
                            <p className="font-brand text-2xl uppercase mt-2 break-all">{orderCode}</p>
                        </div>
                        <div className="border border-[#1c1b1b]/20 p-4">
                            <p className="font-headline text-[9px] uppercase tracking-widest opacity-50">Payment ID</p>
                            <p className="font-brand text-2xl uppercase mt-2 break-all">{paymentId}</p>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-3">
                        <Link
                            href="/user/orders"
                            className="bg-[#1c1b1b] text-white px-8 py-3 font-headline text-[10px] uppercase tracking-widest hover:bg-[#b90c1b]"
                        >
                            Track My Order
                        </Link>
                        <Link
                            href="/shop"
                            className="border border-[#1c1b1b]/30 px-8 py-3 font-headline text-[10px] uppercase tracking-widest hover:border-[#1c1b1b]"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </section>
            <Comp7 />
        </main>
    );
}
