import Link from "next/link";
import type { Category, SpendingEntry } from "@/lib/data";
import { formatDay, formatEuro } from "@/lib/format";

export function SpendingList({
  entries,
  categories,
}: {
  entries: SpendingEntry[];
  categories: Category[];
}) {
  const names = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <ul className="divide-y divide-border">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link
            href={`/entries/${entry.id}`}
            className="flex items-center justify-between gap-3 py-3"
          >
            <div className="min-w-0">
              <p className="truncate">
                {(entry.category_id && names.get(entry.category_id)) ||
                  "No category"}
              </p>
              <p className="truncate text-sm text-muted">
                {formatDay(entry.spent_on)}
                {entry.note && ` · ${entry.note}`}
              </p>
            </div>
            <span className="shrink-0 font-medium tabular-nums">
              {formatEuro(entry.amount)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
