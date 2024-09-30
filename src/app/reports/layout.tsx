export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-full">
      <div className="inline-block text-center max-w-screen-xl justify-center w-full">
        {children}
      </div>
    </section>
  );
}
