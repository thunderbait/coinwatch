import Link from "next/link";
import { SpendingList } from "@/components/spending-list";
import { getCategories, getSpending } from "@/lib/data";
import { formatEuro, formatMonth, monthRange, today } from "@/lib/format";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { added } = await searchParams;
  const now = today();
  const { start, end } = monthRange(now);
  const [categories, spending] = await Promise.all([
    getCategories(),
    getSpending({ from: start, to: end }),
  ]);

  const total = spending.reduce((sum, s) => sum + s.amount, 0);
  const byCategory = new Map<string, number>();
  for (const s of spending) {
    const key = s.category_id ?? "none";
    byCategory.set(key, (byCategory.get(key) ?? 0) + s.amount);
  }

  const rows = categories
    .map((c) => ({ ...c, spent: byCategory.get(c.id) ?? 0 }))
    .filter((c) => c.spent > 0 || c.monthly_budget !== null)
    .sort((a, b) => b.spent - a.spent);
  const uncategorised = byCategory.get("none") ?? 0;
  const totalBudget = categories.reduce((sum, c) => sum + (c.monthly_budget ?? 0), 0);

  return (
    <>
      {added && (
        <p className="rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent">
          Spending saved.
        </p>
      )}

      <section>
        <p className="text-sm text-muted">Spent in {formatMonth(now)}</p>
        <p className="text-4xl font-semibold tracking-tight tabular-nums">
          {formatEuro(total)}
        </p>
        {totalBudget > 0 && (
          <p className="mt-1 text-sm text-muted">
            of {formatEuro(totalBudget)} budgeted
          </p>
        )}
      </section>

      <Link href="/add" className="button-primary text-center">
        Add spending
      </Link>

      <section className="card">
        <h2 className="mb-3 font-semibold">By category</h2>
        {rows.length === 0 && uncategorised === 0 ? (
          <p className="text-sm text-muted">Nothing spent yet this month.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {rows.map((c) => (
              <CategoryRow
                key={c.id}
                name={c.name}
                spent={c.spent}
                budget={c.monthly_budget}
              />
            ))}
            {uncategorised > 0 && (
              <CategoryRow name="No category" spent={uncategorised} budget={null} />
            )}
          </ul>
        )}
      </section>

      <section className="card">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-semibold">Recent</h2>
          <Link href="/history" className="text-sm text-accent">
            See all
          </Link>
        </div>
        {spending.length === 0 ? (
          <p className="text-sm text-muted">No spending logged this month.</p>
        ) : (
          <SpendingList entries={spending.slice(0, 5)} categories={categories} />
        )}
      </section>
    </>
  );
}

function CategoryRow({
  name,
  spent,
  budget,
}: {
  name: string;
  spent: number;
  budget: number | null;
}) {
  const over = budget !== null && spent > budget;
  const share = budget ? Math.min(spent / budget, 1) : 0;

  return (
    <li>
      <div className="flex items-baseline justify-between gap-3">
        <span>{name}</span>
        <span className="text-sm tabular-nums">
          <span className={over ? "font-semibold text-danger" : ""}>
            {formatEuro(spent)}
          </span>
          {budget !== null && (
            <span className="text-muted"> / {formatEuro(budget)}</span>
          )}
        </span>
      </div>
      {budget !== null && (
        <>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full ${
                over ? "bg-danger" : share >= 0.8 ? "bg-warning" : "bg-accent"
              }`}
              style={{ width: `${share * 100}%` }}
            />
          </div>
          {over && (
            <p className="mt-1 text-xs text-danger">
              {formatEuro(spent - budget)} over budget
            </p>
          )}
        </>
      )}
    </li>
  );
}
