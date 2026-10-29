import Link from "next/link";
import { SpendingList } from "@/components/spending-list";
import { getCategories, getSpending, type SpendingEntry } from "@/lib/data";
import { formatEuro, formatMonth } from "@/lib/format";

export default async function HistoryPage({ searchParams }: PageProps<"/history">) {
  const { category } = await searchParams;
  const categoryId = typeof category === "string" ? category : undefined;
  const [categories, spending] = await Promise.all([
    getCategories(),
    getSpending({ categoryId }),
  ]);

  // Entries arrive newest first, so months come out in order
  const months = new Map<string, SpendingEntry[]>();
  for (const entry of spending) {
    const month = entry.spent_on.slice(0, 7);
    months.set(month, [...(months.get(month) ?? []), entry]);
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">History</h1>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <FilterChip href="/history" label="All" active={!categoryId} />
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            href={`/history?category=${c.id}`}
            label={c.name}
            active={categoryId === c.id}
          />
        ))}
      </div>

      {months.size === 0 ? (
        <p className="text-muted">No spending logged yet.</p>
      ) : (
        [...months].map(([month, entries]) => (
          <section key={month} className="card">
            <div className="mb-1 flex items-baseline justify-between">
              <h2 className="font-semibold">{formatMonth(month)}</h2>
              <span className="text-sm tabular-nums text-muted">
                {formatEuro(entries.reduce((sum, e) => sum + e.amount, 0))}
              </span>
            </div>
            <SpendingList entries={entries} categories={categories} />
          </section>
        ))
      )}
    </>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-surface"
      }`}
    >
      {label}
    </Link>
  );
}
