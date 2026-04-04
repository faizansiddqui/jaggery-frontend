export default function Comp2() {
  return (
    <>
      <header className="bg-white dark:bg-[#1c1b1b] flex justify-between items-center w-full px-8 h-20 sticky top-0 z-30">
        <h1 className="text-2xl font-black text-[#1c1b1b] dark:text-[#fcf8f8] tracking-tighter font-['Space_Grotesk'] uppercase">
          ADMIN - NEW PRODUCT UPLOAD
        </h1>
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined text-on-surface">
            notifications
          </span>
          <div className="w-10 h-10 bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined">account_circle</span>
          </div>
        </div>
      </header>
    </>
  );
}
