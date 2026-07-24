interface InfoPageProps {
  title: string;
  children: React.ReactNode;
}

export function InfoPage({ title, children }: InfoPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-ds-6 py-16 lg:px-ds-8">
      <h1 className="font-display text-3xl text-gradient-royal sm:text-4xl">{title}</h1>
      <div className="prose prose-neutral mt-ds-8 max-w-none text-charcoal/80">{children}</div>
    </div>
  );
}
