'use client';

type AuthHeaderProps = {
    loginStep: 'email' | 'otp';
    loginEmail: string;
};

export default function AuthHeader({ loginStep, loginEmail }: AuthHeaderProps) {
    return (
        <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold italic text-primary mb-4">
                {loginStep === 'email' ? 'Welcome Back' : 'Verify Email'}
            </h1>
            <p className="text-on-surface-variant text-sm">
                {loginStep === 'email'
                    ? 'Enter your email to sign in or create an account'
                    : `Enter the OTP sent to ${loginEmail}`}
            </p>
        </div>
    );
}
