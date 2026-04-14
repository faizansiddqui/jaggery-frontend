export default function Comp3() {
  return (
    <>
      <div className="flex items-center gap-2 mb-8 text-[10px] font-bold tracking-widest opacity-40">
        <span>Admin</span>
        <span
          className="material-symbols-outlined text-[10px]"
          data-icon="chevron_right"
        >
          chevron_right
        </span>
        <span>Customers</span>
        <span
          className="material-symbols-outlined text-[10px]"
          data-icon="chevron_right"
        >
          chevron_right
        </span>
        <span className="text-on-surface opacity-100">
          Profile: Elena Vance
        </span>
      </div>
    </>
  );
}
