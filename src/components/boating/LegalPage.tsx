import { SiteFooter } from "@/components/boating/SiteFooter";
import { SiteHeader } from "@/components/boating/SiteHeader";

type Props = {
  title: string;
  children: React.ReactNode;
};

export function LegalPage({ title, children }: Props) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 px-5 pb-24 pt-28 md:px-8 md:pt-32">
        <article className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Legal
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h1>
          <div className="mt-10 space-y-6 text-base leading-relaxed text-muted md:text-lg">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

export function LegalSection({
  id,
  heading,
  children,
}: {
  id?: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-4 border-t border-border pt-10 first:border-t-0 first:pt-0">
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
        {heading}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6 marker:text-accent">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
