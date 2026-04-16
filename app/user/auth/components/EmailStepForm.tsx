'use client';

type EmailStepFormProps = {
  email: string;
  isLoading: boolean;
  error: string | null;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
};

export default function EmailStepForm({ email, isLoading, error, onEmailChange, onSubmit }: EmailStepFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="group relative">
        <label className="text-[11px] uppercase tracking-[0.15em] text-on-surface-variant/80 font-semibold mb-2 block ml-1 transition-colors group-focus-within:text-primary">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="name@company.com"
          className="w-full bg-surface-variant/20 border border-outline-variant/30 rounded-2xl px-5 py-4 text-primary text-base focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 placeholder:text-on-surface-variant/30"
          required
        />
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error text-xs p-3 rounded-xl animate-shake">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white py-4 rounded-2xl text-sm font-bold uppercase tracking-[0.12em] shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Processing...
          </span>
        ) : 'Continue'}
      </button>
    </form>
  );
}