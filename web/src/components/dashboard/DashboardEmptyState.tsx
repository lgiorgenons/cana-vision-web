const DashboardEmptyState = () => {
  return (
    <section className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10">
      <div className="max-w-md text-center">
        <p className="text-lg font-semibold text-slate-700">Nenhum dado por aqui ainda.</p>
        <p className="mt-2 text-sm text-slate-500">
          Assim que os monitoramentos forem iniciados, os indicadores e alertas aparecem automaticamente.
        </p>
      </div>
    </section>
  );
};

export default DashboardEmptyState;
