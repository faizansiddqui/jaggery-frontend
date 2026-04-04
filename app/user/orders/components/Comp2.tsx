export default function Comp2() {
  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest z-50 flex justify-around items-center py-4 px-6 border-t border-on-surface/5">
        <button className="flex flex-col items-center gap-1 text-on-surface/40 active:scale-95 duration-150">
          <span className="material-symbols-outlined">home</span>
          <span className="font-headline text-[8px] font-bold tracking-widest">
            HOME
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface/40 active:scale-95 duration-150">
          <span className="material-symbols-outlined">explore</span>
          <span className="font-headline text-[8px] font-bold tracking-widest">
            SHOP
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#b90c1b] active:scale-95 duration-150">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            person
          </span>
          <span className="font-headline text-[8px] font-bold tracking-widest">
            ACCOUNT
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 text-on-surface/40 active:scale-95 duration-150 relative">
          <span className="material-symbols-outlined">shopping_bag</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
          <span className="font-headline text-[8px] font-bold tracking-widest">
            CART
          </span>
        </button>
      </div>
    </>
  );
}
