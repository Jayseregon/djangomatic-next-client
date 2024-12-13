export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-fit">
      <section className="flex-grow flex flex-col items-center py-8 md:py-10">
        <div className="inline-block w-full text-center justify-center">
          {children}
        </div>
      </section>
    </div>
  );
}
