"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const supabase = createClient();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
    setLoading(false);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#f3fffd_0%,#eef8ff_40%,#ffffff_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="rounded-[2rem] border border-white/70 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-200">
            Ventaway admin
          </p>
          <h1 className="mt-5 font-display text-4xl tracking-[-0.04em]">
            Manage users, posts, and safety issues from one place.
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-300">
            This route is for team members responsible for moderation, user
            oversight, and the overall health of the Ventaway community.
          </p>

          <div className="mt-8 grid gap-3">
            <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm text-slate-200">
              Review user accounts and account states
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm text-slate-200">
              Track recent posts and content activity
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm text-slate-200">
              Follow reports involving posts or accounts
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600">
              Sign in
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
              Admin login
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Use your authorized admin account to access the dashboard.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
                  placeholder="admin@ventaway.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in to dashboard"}
            </button>

            <div className="pt-1 text-center">
              <Link
                href="/"
                className="text-sm font-medium text-teal-600 transition hover:text-teal-700"
              >
                Back to Home
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
