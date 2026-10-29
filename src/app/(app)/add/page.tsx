import { addSpending } from "@/app/actions";
import { SpendingForm } from "@/components/spending-form";
import { getCategories } from "@/lib/data";
import { today } from "@/lib/format";

export default async function AddPage({ searchParams }: PageProps<"/add">) {
  const { error } = await searchParams;
  const categories = await getCategories();

  return (
    <>
      <h1 className="text-2xl font-semibold">Add spending</h1>
      {error && (
        <p className="text-sm text-danger">
          Couldn&apos;t save that. Check the amount and date.
        </p>
      )}
      <SpendingForm
        action={addSpending}
        categories={categories}
        defaultDate={today()}
        submitLabel="Save"
      />
    </>
  );
}
