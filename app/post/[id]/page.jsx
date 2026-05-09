import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatPostDate,
  getPostDescription,
  getPostTitle,
  getPublicPostById,
  getSiteUrl,
} from "@/lib/posts";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPublicPostById(id);

  if (!post) {
    return {
      title: "Post not found | Ventaway",
      description: "This Ventaway post could not be found.",
    };
  }

  const title = getPostTitle(post);
  const description = getPostDescription(post);
  const imageUrl = post.mediaType === "image" ? post.mediaUrl : null;
  const pageUrl = `${getSiteUrl()}/post/${post.id}`;

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
      type: "article",
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

export default async function SharedPostPage({ params }) {
  const { id } = await params;
  const post = await getPublicPostById(id);

  if (!post) {
    notFound();
  }

  const username = post.users?.username || "Ventaway member";
  const communityName = post.communities?.name || "Community";
  const avatar = post.users?.avatar;
  const content = post.content?.trim();
  const deepLink = `ventaway://post/${post.id}`;

  return (
    <main className="min-h-[calc(100vh-5rem)] overflow-hidden bg-[radial-gradient(circle_at_top,#f2fffd_0%,#eff8ff_40%,#ffffff_100%)] px-6 pb-16 pt-8 text-slate-900 sm:pt-12">
      <div className="hero-grid pointer-events-none absolute inset-x-0 top-0 h-[30rem] opacity-50" />
      <div className="absolute left-[-9rem] top-24 -z-10 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
      <div className="absolute right-[-7rem] top-56 -z-10 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />

      <div className="mx-auto max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-semibold text-teal-700 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Shared from the Ventaway community
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_24px_70px_rgba(15,23,42,0.07)] backdrop-blur">
          <div className="border-b border-slate-200/80 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={`Avatar for @${username}`}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-teal-500 text-lg font-semibold text-white">
                      {username.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xl font-semibold text-slate-950">
                    @{username}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {communityName} · {formatPostDate(post.created_at)}
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
            {content ? (
              <p className="whitespace-pre-wrap text-base leading-8 text-slate-700 sm:text-lg">
                {content}
              </p>
            ) : (
              <p className="text-base leading-8 text-slate-500 sm:text-lg">
                This post was shared with media only.
              </p>
            )}

            <PostMedia post={post} />

            <div className="grid gap-4 border-t border-slate-200/80 pt-6 sm:grid-cols-3">
              <MetricCard label="Shared in" value={communityName} />
              <MetricCard
                label="Post type"
                value={formatMediaType(post.mediaType)}
              />
              <MetricCard
                label="Views"
                value={String(post.views ?? 0)}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PostMedia({ post }) {
  if (!post.mediaUrl) {
    return null;
  }

  if (post.mediaType === "image") {
    return (
      <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-100">
        <Image
          src={post.mediaUrl}
          alt="Shared Ventaway post media"
          width={1200}
          height={800}
          className="h-auto w-full object-cover"
          sizes="(max-width: 1024px) 100vw, 900px"
        />
      </div>
    );
  }

  if (post.mediaType === "video") {
    return (
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-950">
        <video
          src={post.mediaUrl}
          controls
          playsInline
          className="h-auto max-h-[34rem] w-full"
        />
      </div>
    );
  }

  if (post.mediaType === "audio") {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600">
          Voice post
        </p>
        <p className="mt-2 text-base text-slate-600">
          Listen to the shared voice note directly in your browser.
        </p>
        <audio src={post.mediaUrl} controls className="mt-5 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
      This post includes unsupported media for the web preview.
    </div>
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

function formatMediaType(value) {
  if (!value) {
    return "Text";
  }

  const normalized = String(value).toLowerCase();

  if (normalized === "audio") {
    return "Voice post";
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}
