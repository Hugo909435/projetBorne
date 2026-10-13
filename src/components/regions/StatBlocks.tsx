import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

/**
 * The building blocks every location page (French department, German state,
 * Spanish and UK region) lays its statistics out with. Purely presentational:
 * the pages decide what the figures are and how they are worded.
 */

const headingClass = "mt-10 font-display text-2xl font-semibold text-ink-900";

export function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className={headingClass}>{children}</h2>;
}

export type KeyFigure = { label: string; value: string; note?: string | null };

export function KeyFigures({ heading, figures }: { heading: string; figures: KeyFigure[] }) {
  return (
    <>
      <SectionHeading>{heading}</SectionHeading>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {figures.map((figure) => (
          <div key={figure.label} className="rounded-2xl border border-line bg-card p-4">
            <dt className="text-xs text-ink-400">{figure.label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-ink-900">{figure.value}</dd>
            {figure.note && <dd className="mt-0.5 text-xs text-ink-600">{figure.note}</dd>}
          </div>
        ))}
      </dl>
    </>
  );
}

export type BreakdownRow = {
  key: string;
  label: string;
  /** Links the label, for a row that has a page of its own. */
  href?: string;
  value: string;
  share?: string;
};

export function Breakdown({
  heading,
  intro,
  note,
  rows,
}: {
  heading: string;
  intro?: string;
  note?: string;
  rows: BreakdownRow[];
}) {
  if (rows.length === 0) return null;
  return (
    <>
      <SectionHeading>{heading}</SectionHeading>
      {intro && <p className="mt-3 text-ink-600">{intro}</p>}
      <ul className="mt-3 space-y-2 text-ink-600">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center justify-between gap-4 border-b border-line pb-2">
            {row.href ? (
              <Link href={row.href} className="font-semibold text-green-700 underline">
                {row.label}
              </Link>
            ) : (
              <span>{row.label}</span>
            )}
            <span className="whitespace-nowrap font-semibold text-ink-900">
              {row.value}
              {row.share && <span className="ml-2 font-normal text-ink-400">{row.share}</span>}
            </span>
          </li>
        ))}
      </ul>
      {note && <p className="mt-2 text-xs text-ink-400">{note}</p>}
    </>
  );
}

export function TownsTable({
  heading,
  columns,
  rows,
}: {
  heading: string;
  /** The first column is the town name, the others are figures. */
  columns: string[];
  rows: { name: string; cells: string[] }[];
}) {
  if (rows.length === 0) return null;
  return (
    <>
      <SectionHeading>{heading}</SectionHeading>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-ink-400">
              {columns.map((column, index) => (
                <th key={column} scope="col" className={`py-2 font-medium ${index > 0 ? "text-right" : ""}`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b border-line">
                <td className="py-2 text-ink-600">{row.name}</td>
                {row.cells.map((cell, index) => (
                  <td
                    key={index}
                    className={`py-2 text-right ${index === 0 ? "font-semibold text-ink-900" : "text-ink-600"}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function NearbyLinks({
  heading,
  items,
}: {
  heading: string;
  items: { href: string; label: string; note?: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <>
      <SectionHeading>{heading}</SectionHeading>
      <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.href} className="border-b border-line pb-2">
            <Link href={item.href} className="font-semibold text-green-700 underline">
              {item.label}
            </Link>
            {item.note && <span className="block text-sm text-ink-600">{item.note}</span>}
          </li>
        ))}
      </ul>
    </>
  );
}

export function FaqItem({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details className="mt-3 rounded-xl border border-line p-4">
      <summary className="cursor-pointer font-semibold text-ink-900">{question}</summary>
      <p className="mt-2 text-ink-600">{children}</p>
    </details>
  );
}
