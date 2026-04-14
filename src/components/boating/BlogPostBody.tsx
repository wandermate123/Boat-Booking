import Link from "next/link";
import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
};

export function BlogPostBody({ content }: Props) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="mt-12 scroll-mt-28 font-serif text-2xl font-semibold tracking-tight text-foreground first:mt-0 md:text-3xl">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 font-serif text-xl font-semibold tracking-tight text-foreground">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mt-4 leading-relaxed text-muted first:mt-0">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        a: ({ href, children }) => {
          if (href?.startsWith("/")) {
            return (
              <Link
                href={href}
                className="font-medium text-accent underline-offset-4 hover:underline"
              >
                {children}
              </Link>
            );
          }
          return (
            <a
              href={href}
              className="font-medium text-accent underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
        ul: ({ children }) => (
          <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-accent">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mt-4 list-decimal space-y-2 pl-6 marker:text-accent">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed text-muted">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="my-6 border-l-4 border-accent/50 pl-5 italic text-muted">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="my-12 border-border" />,
        img: ({ src, alt }) => (
          // eslint-disable-next-line @next/next/no-img-element -- MDX images are external or /public paths
          <img
            src={src ?? ""}
            alt={alt ?? ""}
            className="my-8 w-full max-w-3xl rounded-2xl border border-border object-cover"
            loading="lazy"
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
