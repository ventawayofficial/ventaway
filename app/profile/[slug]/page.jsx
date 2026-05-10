import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatJoinedDate,
  getProfileDescription,
  getProfileTitle,
  getProfileUrl,
  getPublicProfileBySlug,
} from "@/lib/profiles";
import { getSiteUrl } from "@/lib/posts";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const profile = await getPublicProfileBySlug(slug);

  if (!profile) {
    return {
      title: "Profile not found | Ventaway",
      description: "This Ventaway profile could not be found.",
    };
  }

  const title = getProfileTitle(profile);
  const description = getProfileDescription(profile);
  const imageUrl = profile.avatar || null;
  const pageUrl = getProfileUrl(profile.username || profile.id || slug);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "profile",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function SharedProfilePage({ params }) {
  const { slug } = await params;
  const profile = await getPublicProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  const displayName = profile.name || profile.username || "Ventaway member";
  const username = profile.username || profile.id;
  const deepLink = `ventaway://profile/${encodeURIComponent(username)}`;

  return (
    <main className="min-h-[calc(100vh-5rem)] overflow-hidden bg-[radial-gradient(circle_at_top,#f2fffd_0%,#eff8ff_40%,#ffffff_100%)] px-6 pb-16 pt-8 text-slate-900 sm:pt-12">
      <div className="hero-grid pointer-events-none absolute inset-x-0 top-0 h-[30rem] opacity-50" />
      <div className="absolute left-[-9rem] top-24 -z-10 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="absolute right-[-7rem] top-56 -z-10 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />

      <div className="mx-auto max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-semibold text-teal-700 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Shared from a Ventaway profile
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_24px_70px_rgba(15,23,42,0.07)] backdrop-blur">
          <div className="border-b border-slate-200/80 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={`Avatar for @${username}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-teal-500 text-xl font-semibold text-white">
                      {displayName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xl font-semibold text-slate-950">
                    {displayName}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    @{username} · Joined {formatJoinedDate(profile.createdat)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={deepLink}
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Open in app
                </a>
                <Link
                  href="/#download"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700"
                >
                  Get Ventaway
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard label="Followers" value={String(profile.followersCount ?? 0)} />
              <MetricCard label="Following" value={String(profile.followingCount ?? 0)} />
              <MetricCard label="Posts" value={String(profile.postsCount ?? 0)} />
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                About
              </p>
              <p className="mt-3 whitespace-pre-wrap text-base leading-8 text-slate-700 sm:text-lg">
                {profile.bio?.trim() || `${displayName} has not added a bio yet.`}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-[1.4rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}
