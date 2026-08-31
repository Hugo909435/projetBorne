import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site, languageAlternates, author, byLabel, publisherJsonLd } from "@/lib/site";
import { blogPosts, formatBlogDate } from "@/lib/blogPosts";
import type { Locale } from "@/i18n/routing";

const FAQ_HEADING: Record<Locale, string> = {
  fr: "Questions fréquentes",
  en: "Frequently asked questions",
  de: "Häufig gestellte Fragen",
  es: "Preguntas frecuentes",
};

const UPDATED_LABEL: Record<Locale, string> = {
  fr: "Mis à jour le",
  en: "Updated",
  de: "Aktualisiert am",
  es: "Actualizado el",
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  const content = post.content[locale as Locale];

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `/${locale}/blog/${post.slug}`,
      languages: languageAlternates(`/blog/${post.slug}`),
    },
    openGraph: {
      url: `${site.url}/${locale}/blog/${post.slug}`,
      images: post.image.src ? [`${site.url}${post.image.src}`] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  setRequestLocale(locale);

  const content = post.content[locale as Locale];
  const tNav = await getTranslations({ locale, namespace: "Nav" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.metaDescription,
    image: post.image.src ? [`${site.url}${post.image.src}`] : undefined,
    author: { "@type": "Person", name: author.name, url: author.url, sameAs: [author.linkedin] },
    publisher: publisherJsonLd,
    mainEntityOfPage: `${site.url}/${locale}/blog/${post.slug}`,
    inLanguage: locale,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
  };

  const faqJsonLd =
    content.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: content.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: `${site.url}/${locale}` },
      { "@type": "ListItem", position: 2, name: tNav("blog"), item: `${site.url}/${locale}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: content.title,
        item: `${site.url}/${locale}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-ink-400">
        <Link href="/" className="hover:text-green-700">
          {tNav("home")}
        </Link>
        <span className="mx-1.5">/</span>
        <Link href="/blog" className="hover:text-green-700">
          {tNav("blog")}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-600">{content.title}</span>
      </nav>

      {post.image.src && (
        <>
          <Image
            src={post.image.src}
            alt={post.image.alt[locale as Locale]}
            width={1200}
            height={675}
            className="mt-2 w-full rounded-2xl object-cover"
          />
          {post.image.credit && (
            <p className="mt-2 text-xs text-ink-400">
              Photo:{" "}
              <a
                href={post.image.credit.url}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {post.image.credit.name}
              </a>{" "}
              ({post.image.credit.license})
            </p>
          )}
        </>
      )}

      <p className="mb-3 mt-6 border-l-[3px] border-green-500 pl-3 text-sm font-semibold text-green-700">
        {content.eyebrow}
      </p>
      <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{content.title}</h1>
      <p className="mt-3 text-sm text-ink-400">
        {formatBlogDate(locale, post.publishedAt)}
        {post.updatedAt && (
          <> · {UPDATED_LABEL[locale as Locale]} {formatBlogDate(locale, post.updatedAt)}</>
        )}
      </p>
      <p className="mt-1 text-sm text-ink-400">
        {byLabel[locale as Locale]} {author.name}, {author.role[locale as Locale]}
      </p>
      <p className="mt-4 text-ink-600">{content.excerpt}</p>

      {content.body.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2 key={index} className="mt-10 font-display text-2xl font-semibold text-ink-900">
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={index} className="mt-8 font-display text-xl font-semibold text-ink-900">
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="mt-3 space-y-2 text-ink-600">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="mt-3 leading-relaxed text-ink-600">
            {block.text}
          </p>
        );
      })}

      {content.faq.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">
            {FAQ_HEADING[locale as Locale]}
          </h2>
          {content.faq.map((item, index) => (
            <details key={index} className="mt-3 rounded-xl border border-line p-4">
              <summary className="cursor-pointer font-semibold text-ink-900">
                {item.question}
              </summary>
              <p className="mt-2 text-ink-600">{item.answer}</p>
            </details>
          ))}
        </>
      )}

      <div className="mt-10 rounded-2xl border border-line bg-card p-6">
        <p className="text-sm text-ink-600">
          {content.ctaBefore}
          <Link href="/#carte" className="font-semibold text-green-700 underline">
            {content.ctaLinkText}
          </Link>
          {content.ctaAfter}
        </p>
      </div>

      <div className="mt-10 flex items-start gap-4 rounded-2xl border border-line bg-card p-6">
        <Image
          src={author.photo}
          alt={author.name}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-ink-900">{author.name}</p>
          <p className="text-sm text-ink-400">{author.role[locale as Locale]}</p>
          <p className="mt-2 text-sm text-ink-600">{author.bio[locale as Locale]}</p>
          <a
            href={author.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="mt-2 inline-flex text-green-700 hover:text-green-800"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
