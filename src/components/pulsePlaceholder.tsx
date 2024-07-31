export const LgPlaceholder = () => {
  return (
    <div>
      <div className="animate-pulse flex-auto">
        <div className="grid grid-cols-4 gap-1">
          <div className="h-2 bg-slate-700 rounded col-span-2" />
          <div className="h-2 bg-slate-700 rounded col-span-3" />
          <div className="h-2 bg-slate-700 rounded col-span-1" />
          <div className="h-2 bg-slate-700 rounded col-span-4" />
        </div>
      </div>
    </div>
  );
};

export const TxtPlaceholder = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-4 gap-1">
        <div className="h-2 bg-slate-700 rounded col-span-3" />
        <div className="h-2 bg-slate-700 rounded col-span-1" />
        <div className="h-2 bg-slate-700 rounded col-span-4" />
      </div>
    </div>
  );
};
