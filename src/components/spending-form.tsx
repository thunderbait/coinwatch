import type { Category, SpendingEntry } from "@/lib/data";

export function SpendingForm({
  action,
  categories,
  entry,
  defaultDate,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  entry?: SpendingEntry;
  defaultDate: string;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm text-muted">Amount (€)</span>
        <input
          name="amount"
          type="text"
          inputMode="decimal"
          required
          autoFocus={!entry}
          placeholder="0.00"
          defaultValue={entry?.amount.toFixed(2)}
          pattern="[0-9]+([.,][0-9]{1,2})?"
          className="input text-2xl font-semibold"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-muted">Category</span>
        <select
          name="category_id"
          defaultValue={entry?.category_id ?? ""}
          className="input"
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-muted">Date</span>
        <input
          name="spent_on"
          type="date"
          required
          defaultValue={entry?.spent_on ?? defaultDate}
          className="input"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-muted">Note (optional)</span>
        <input
          name="note"
          type="text"
          defaultValue={entry?.note ?? ""}
          className="input"
        />
      </label>

      <button className="button-primary">{submitLabel}</button>
    </form>
  );
}
