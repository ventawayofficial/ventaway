import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/posts";

export async function getPublicProfileBySlug(slug) {
  const normalizedSlug = `${slug || ""}`.trim();

  if (!normalizedSlug) {
    return null;
  }

  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, name, username, avatar, bio, createdat")
    .or(`username.eq.${normalizedSlug},id.eq.${normalizedSlug}`)
    .limit(1)
    .maybeSingle();

  if (profileError) {
    console.error("[PublicProfile] Failed to load profile:", profileError);
    return null;
  }

  if (!profile) {
    return null;
  }

  const [postsResult, followersResult, followingResult] = await Promise.all([
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("userid", profile.id),
    supabase
      .from("follows")
      .select("follower_id", { count: "exact", head: true })
      .eq("followed_id", profile.id),
    supabase
      .from("follows")
      .select("followed_id", { count: "exact", head: true })
      .eq("follower_id", profile.id),
  ]);

  return {
    ...profile,
    postsCount: postsResult.count ?? 0,
    followersCount: followersResult.count ?? 0,
    followingCount: followingResult.count ?? 0,
  };
}

export function getProfileTitle(profile) {
  const displayName = profile?.name || profile?.username || "Ventaway member";
  const username = profile?.username ? `@${profile.username}` : "Ventaway";
  return `${displayName} (${username}) | Ventaway`;
}

export function getProfileDescription(profile) {
  const bio = `${profile?.bio || ""}`.replace(/\s+/g, " ").trim();

  if (bio) {
    return bio.length <= 160 ? bio : `${bio.slice(0, 157)}...`;
  }

  const displayName = profile?.name || profile?.username || "This Ventaway member";
  return `${displayName} shared their Ventaway profile.`;
}

export function getProfileUrl(slug) {
  return `${getSiteUrl()}/profile/${encodeURIComponent(slug)}`;
}

export function formatJoinedDate(value) {
  if (!value) {
    return "Recently joined";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently joined";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
