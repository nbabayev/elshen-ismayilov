type MetaItem = {
  label: string;
  value?: string | number | null;
};

export function BookMeta({ items }: { items: MetaItem[] }) {
  const visible = items.filter(
    (item) => item.value !== null && item.value !== undefined && item.value !== ""
  );

  if (!visible.length) return null;

  const mid = Math.ceil(visible.length / 2);
  const left = visible.slice(0, mid);
  const right = visible.slice(mid);

  const renderColumn = (column: MetaItem[]) => (
    <dl className="space-y-3">
      {column.map((item) => (
        <div key={item.label} className="flex gap-2 text-[14px] md:text-[15px] leading-[1.5]">
          <dt className="text-[#909090] shrink-0 font-lexend">{item.label}:</dt>
          <dd className="text-[#003A3C] font-lexend font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <div className="mt-8 md:mt-10 pt-8 border-t border-[#D9D9D9]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
        {renderColumn(left)}
        {renderColumn(right)}
      </div>
    </div>
  );
}
