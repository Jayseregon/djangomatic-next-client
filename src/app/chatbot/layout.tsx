export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label="Chat Interface"
      className="flex flex-col items-center w-full"
      role="region"
    >
      {children}
    </section>
  );
}
