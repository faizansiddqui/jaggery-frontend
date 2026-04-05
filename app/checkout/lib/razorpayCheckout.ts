'use client';

type RazorpaySuccessResponse = {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
};

type LaunchRazorpayCheckoutInput = {
    key: string;
    amount: number;
    currency: string;
    orderId: string;
    name: string;
    description: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    themeColor?: string;
};

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

const loadRazorpayScript = async () => {
    if (typeof window === 'undefined') return false;
    if ((window as Window & { Razorpay?: unknown }).Razorpay) return true;

    return new Promise<boolean>((resolve) => {
        const script = document.createElement('script');
        script.src = RAZORPAY_SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const launchRazorpayCheckout = async (
    input: LaunchRazorpayCheckoutInput,
): Promise<RazorpaySuccessResponse> => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
        throw new Error('Could not load Razorpay checkout. Check your internet connection and try again.');
    }

    const RazorpayCtor = (window as Window & { Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: (data: { error?: { description?: string } }) => void) => void } }).Razorpay;

    if (!RazorpayCtor) {
        throw new Error('Razorpay SDK is unavailable in this browser session.');
    }

    return new Promise<RazorpaySuccessResponse>((resolve, reject) => {
        const razorpay = new RazorpayCtor({
            key: input.key,
            amount: input.amount,
            currency: input.currency,
            name: input.name,
            description: input.description,
            order_id: input.orderId,
            prefill: input.prefill || {},
            theme: { color: input.themeColor || '#b90c1b' },
            handler: (response: RazorpaySuccessResponse) => {
                resolve(response);
            },
            modal: {
                ondismiss: () => {
                    reject(new Error('Payment cancelled by user.'));
                },
            },
        });

        razorpay.on('payment.failed', (payload) => {
            const message = payload?.error?.description || 'Payment failed. Please try again.';
            reject(new Error(message));
        });

        razorpay.open();
    });
};

export type { RazorpaySuccessResponse };
