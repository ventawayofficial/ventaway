import { createClient } from "@/lib/supabase/server";

const DEFAULT_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (explicitSiteUrl) {
    return explicitSiteUrl.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, "")}`;
  }

  return DEFAULT_SITE_URL;
}

export async function getPublicPostById(id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
        id,
        userid,
        content,
        "communityId",
        "mediaType",
        "mediaUrl",
        created_at,
        views,
        users:userid (
          id,
          username,
          avatar
        ),
        communities:communityId (
          name
        )
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[PublicPost] Failed to load post:", error);
    return null;
  }

  return data;
}

export function getPostDescription(post) {
  const rawText =
    post?.content ||
    `View this Ventaway post from @${post?.users?.username || "someone"}.`;

  const singleLineText = String(rawText).replace(/\s+/g, " ").trim();

  if (singleLineText.length <= 160) {
    return singleLineText;
  }

  return `${singleLineText.slice(0, 157)}...`;
}

export function getPostTitle(post) {
  const username = post?.users?.username || "someone";
  return `Post by @${username} | Ventaway`;
}

export function formatPostDate(value) {
  if (!value) {
    return "Recently shared";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently shared";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
