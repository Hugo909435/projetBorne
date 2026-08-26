import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import HeroBoard from "@/components/home/HeroBoard";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative overflow-hidden bg-cream">
      {/* a quiet road winding across the hero, with a little car driving along it.
          preserveAspectRatio="meet" (never "none"/"slice") scales it uniformly and keeps both ends on screen
          at any viewport ratio, so it can't warp or get cropped off the sides. */}
      <svg
        aria-hidden="true"
        className="road-line pointer-events-none absolute inset-0 hidden h-full w-full md:block"
        viewBox="0 0 1200 480"
        preserveAspectRatio="xMidYMid meet"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 3%, black 97%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 3%, black 97%, transparent)",
        }}
      >
        <path
          className="road-path"
          d="M-40 380 C 170 380, 220 170, 430 190 S 710 380, 910 250 S 1050 130, 1100 110 S 1180 80, 1260 60"
          fill="none"
          stroke="var(--ink-400)"
          strokeWidth="2.5"
          strokeDasharray="1.5 13"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* the car, positioned along the road via CSS offset-path in globals.css */}
        <g className="car">
          <rect x="-15" y="-6" width="30" height="10" rx="4" fill="var(--forest-900)" />
          <rect x="-6" y="-11" width="15" height="7" rx="3" fill="var(--forest-900)" />
          <circle cx="-8" cy="5" r="3.5" fill="var(--ink-900)" />
          <circle cx="8" cy="5" r="3.5" fill="var(--ink-900)" />
          <circle cx="16" cy="-1" r="1.6" fill="var(--lime-400)" />
        </g>
      </svg>

      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-16 md:pt-24">
        <div className="grid items-start gap-12 md:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-xl">
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-green-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
              </span>
              {t("eyebrow")}
            </p>

            <h1 className="text-[2.4rem] font-semibold leading-[1.1] text-ink-900 sm:text-[3.1rem]">
              {t.rich("title", {
                em: (chunks) => (
                  <span className="relative inline-block whitespace-nowrap not-italic">
                    {chunks}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 100 12"
                      preserveAspectRatio="none"
                      className="absolute -bottom-1 left-0 h-3 w-full"
                    >
                      <path
                        d="M0 7 Q 8 2, 16 7 T 32 7 T 48 7 T 64 7 T 80 7 T 100 7"
                        fill="none"
                        stroke="var(--lime-400)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                ),
              })}
            </h1>
            <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-ink-600">
              {t("lede")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="#carte"
                className="rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-lime-300 transition hover:bg-forest-800"
              >
                {t("ctaMap")}
              </a>
              <Link
                href="/blog/types-de-bornes-electriques"
                className="group inline-flex items-center gap-1.5 border-b border-ink-900/30 pb-0.5 text-sm font-semibold text-ink-900 transition-colors hover:border-ink-900"
              >
                {t("ctaGuide")}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            </div>
          </div>

          <HeroBoard />
        </div>
      </div>
    </section>
  );
}
