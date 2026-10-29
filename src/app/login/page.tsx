import { sendMagicLink } from "./actions";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { sent, error } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">coinwatch</h1>
        <p className="mt-1 text-muted">Sign in with a link sent to your email.</p>
      </div>

      {sent ? (
        <p className="rounded-xl bg-surface p-4">
          Check your inbox for a sign-in link. You can close this tab.
        </p>
      ) : (
        <form action={sendMagicLink} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-muted">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="input"
            />
          </label>
          <button className="button-primary">Send sign-in link</button>
          {error && (
            <p className="text-sm text-danger">
              Something went wrong. Try again in a minute.
            </p>
          )}
        </form>
      )}
    </main>
  );
}
