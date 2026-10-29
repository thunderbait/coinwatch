import {
  addCategory,
  deleteCategory,
  signOut,
  updateCategory,
} from "@/app/actions";
import { getCategories } from "@/lib/data";

export default async function SettingsPage() {
  const categories = await getCategories();

  return (
    <>
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="card flex flex-col gap-4">
        <div>
          <h2 className="font-semibold">Categories and budgets</h2>
          <p className="text-sm text-muted">
            Set a monthly budget in euros, or leave it empty for no budget.
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {categories.map((c) => (
            <li key={c.id} className="flex items-center gap-2">
              <form
                action={updateCategory.bind(null, c.id)}
                className="flex flex-1 items-center gap-2"
              >
                <input
                  name="name"
                  defaultValue={c.name}
                  required
                  aria-label="Category name"
                  className="input min-w-0 flex-1"
                />
                <input
                  name="monthly_budget"
                  inputMode="decimal"
                  placeholder="No budget"
                  defaultValue={c.monthly_budget ?? ""}
                  aria-label={`Monthly budget for ${c.name}`}
                  className="input w-24 text-right"
                />
                <button className="button-secondary">Save</button>
              </form>
              <form action={deleteCategory.bind(null, c.id)}>
                <button
                  aria-label={`Delete ${c.name}`}
                  className="px-2 py-2 text-lg text-danger"
                >
                  ×
                </button>
              </form>
            </li>
          ))}
        </ul>

        <form action={addCategory} className="flex items-center gap-2 border-t border-border pt-4">
          <input
            name="name"
            required
            placeholder="New category"
            className="input min-w-0 flex-1"
          />
          <input
            name="monthly_budget"
            inputMode="decimal"
            placeholder="Budget"
            className="input w-24 text-right"
          />
          <button className="button-secondary">Add</button>
        </form>
      </section>

      <form action={signOut}>
        <button className="button-secondary w-full">Sign out</button>
      </form>
    </>
  );
}
