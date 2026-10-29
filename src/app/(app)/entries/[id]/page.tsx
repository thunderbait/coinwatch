import { notFound } from "next/navigation";
import { deleteSpending, updateSpending } from "@/app/actions";
import { SpendingForm } from "@/components/spending-form";
import { getCategories, getSpendingEntry } from "@/lib/data";
import { today } from "@/lib/format";

export default async function EntryPage({
  params,
  searchParams,
}: PageProps<"/entries/[id]">) {
  const { id } = await params;
  const { error } = await searchParams;
  const [entry, categories] = await Promise.all([
    getSpendingEntry(id),
    getCategories(),
  ]);
  if (!entry) notFound();

  return (
    <>
      <h1 className="text-2xl font-semibold">Edit spending</h1>
      {error && (
        <p className="text-sm text-danger">
          Couldn&apos;t save that. Check the amount and date.
        </p>
      )}
      <SpendingForm
        action={updateSpending.bind(null, entry.id)}
        categories={categories}
        entry={entry}
        defaultDate={today()}
        submitLabel="Save changes"
      />
      <form action={deleteSpending.bind(null, entry.id)}>
        <button className="w-full py-2 text-sm text-danger">Delete this entry</button>
      </form>
    </>
  );
}
