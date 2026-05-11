import { createClient } from "@/lib/supabase/server";
import HomeCardManager from "./HomeCardManager";
import ModerationActionMenu from "./ModerationActionMenu";
import { redirect } from "next/navigation";

const overviewCards = [
  {
    key: "users",
    label: "Total users",
    tone: "from-cyan-500 to-teal-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M18 20a6 6 0 00-12 0m12 0h3m-3 0H6m6-8a4 4 0 100-8 4 4 0 000 8zm6 4a4 4 0 00-3-3.87M6 16a4 4 0 013-3.87"
      />
    ),
  },
  {
    key: "posts",
    label: "Total posts",
    tone: "from-sky-500 to-blue-600",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M8 10h8M8 14h5m-7 7h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    ),
  },
  {
    key: "reports",
    label: "Open reports",
    tone: "from-amber-500 to-orange-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 9v3.75m0 3h.008v.008H12v-.008zm8.25-.75c0 3.286-2.686 5.973-6 5.973h-4.5c-3.314 0-6-2.687-6-6V9c0-3.313 2.686-6 6-6h4.5c3.314 0 6 2.687 6 6v6z"
      />
    ),
  },
  {
    key: "reviews",
    label: "Active reviews",
    tone: "from-rose-500 to-pink-600",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M18.364 5.636l-12.728 12.728M8 8a4 4 0 015.657 5.657M6 18a6 6 0 108.485-8.485"
      />
    ),
  },
];

const views = [
  { key: "overview", label: "Overview" },
  { key: "users", label: "Users" },
  { key: "posts", label: "Posts" },
  { key: "reports", label: "Reports" },
  { key: "home-cards", label: "Home Cards" },
];

export default async function AdminDashboard({ searchParams }) {
  const supabase = await createClient();
  const params = await searchParams;
  const searchQuery = normalizeSearch(params?.q);
  const activeView = normalizeView(params?.view);
  const homeCardSection = normalizeHomeCardSection(params?.section);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { data: adminUser, error: adminUserError } = await supabase
    .from("users")
    .select("id, is_admin, email, name, username")
    .eq("id", session.user.id)
    .maybeSingle();

  if (adminUserError || !adminUser?.is_admin) {
    redirect("/");
  }

  const [
    usersCountResult,
    postsCountResult,
    openReportsCountResult,
    activeReviewsCountResult,
    usersResult,
    postsResult,
    reportsResult,
    homeCardImagesResult,
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase
      .from("moderation_reports")
      .select("*", { count: "exact", head: true })
      .neq("status", "actioned")
      .neq("status", "dismissed"),
    supabase
      .from("moderation_reports")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "reviewing"]),
    supabase
      .from("users")
      .select("id, email, name, username, createdat, is_admin, account_status")
      .order("createdat", { ascending: false })
      .limit(100),
    supabase
      .from("posts")
      .select(
        'id, userid, content, "communityId", "mediaType", "mediaUrl", created_at, views, moderation_status'
      )
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("moderation_reports")
      .select(
        "id, created_at, reporter_id, target_type, reported_user_id, reported_post_id, reason, details, status, resolved_at, resolved_by, admin_note, action_taken"
      )
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("home_card_images").select("*").limit(300),
  ]);

  const users = filterUsers(usersResult.data ?? [], searchQuery);
  const posts = filterPosts(postsResult.data ?? [], searchQuery);
  const reports = filterReports(reportsResult.data ?? [], searchQuery);
  const homeCardImages = sortHomeCardImages(
    filterHomeCardImages(homeCardImagesResult.data ?? [], searchQuery, homeCardSection)
  );

  const counts = {
    users: usersCountResult.count ?? 0,
    posts: postsCountResult.count ?? 0,
    reports: openReportsCountResult.count ?? 0,
    reviews: activeReviewsCountResult.count ?? 0,
  };
  const homeCardCounts = countHomeCardImages(homeCardImagesResult.data ?? []);

  const errors = [
    usersCountResult.error?.message,
    postsCountResult.error?.message,
    openReportsCountResult.error?.message,
    activeReviewsCountResult.error?.message,
    usersResult.error?.message,
    postsResult.error?.message,
    reportsResult.error?.message,
    homeCardImagesResult.error?.message,
  ].filter(Boolean);

  const searchSummary = getAdminSearchSummary({
    activeView,
    searchQuery,
    homeCardSection,
  });
  const showsSearch = true;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f3fffd_0%,#eef8ff_42%,#f8fafc_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
        <aside className="hidden bg-slate-950 px-5 py-6 text-white lg:sticky lg:top-0 lg:block lg:h-screen lg:w-72 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-white/10">
          <div className="flex h-full flex-col">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-teal-200">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Ventaway admin
              </div>

              <div className="mt-6">
                <p className="font-display text-3xl tracking-[-0.04em] text-white">
                  Control room
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Move through app management one workspace at a time.
                </p>
              </div>
            </div>

            <nav className="mt-8 space-y-2">
              {views.map((view) => {
                const isActive = activeView === view.key;
                const href = buildAdminHref(view.key, searchQuery);

                return (
                  <a
                    key={view.key}
                    href={href}
                    className={`block rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "border-teal-400/40 bg-teal-400/12 text-white"
                        : "border-white/8 bg-white/5 text-slate-200 hover:border-teal-400/30 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {view.label}
                  </a>
                );
              })}
            </nav>

            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">
                Signed in
              </p>
              <p className="mt-3 text-sm font-semibold text-white">
                {adminUser.name || adminUser.username || "Admin user"}
              </p>
              <p className="mt-1 break-all text-sm text-slate-300">
                {adminUser.email || session.user.email}
              </p>
            </div>

            <div className="mt-auto pt-8">
              <form
                action={async () => {
                  "use server";
                  const supabase = await createClient();
                  await supabase.auth.signOut();
                  redirect("/admin/login");
                }}
              >
                <button className="inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="space-y-8">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600">
                    {getViewLabel(activeView)}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                    {searchSummary}
                  </p>
                </div>

                {showsSearch ? (
                  <form className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
                    <input type="hidden" name="view" value={activeView} />
                    {activeView === "home-cards" && homeCardSection ? (
                      <input type="hidden" name="section" value={homeCardSection} />
                    ) : null}
                    <input
                      type="search"
                      name="q"
                      defaultValue={searchQuery}
                      placeholder={`Search ${getViewLabel(activeView).toLowerCase()}`}
                      className="h-12 flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Search
                    </button>
                    {searchQuery ? (
                      <a
                        href={buildAdminHref(
                          activeView,
                          "",
                          activeView === "home-cards" ? homeCardSection : ""
                        )}
                        className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                      >
                        Clear
                      </a>
                    ) : null}
                  </form>
                ) : null}
              </div>
            </div>

            {errors.length > 0 ? (
              <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
                Some admin data could not be loaded from Supabase. Check the
                table structure or permissions for `users`, `posts`, and
                `moderation_reports`.
              </section>
            ) : null}

            {activeView === "overview" ? (
              <section className="space-y-8">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {overviewCards.map((card) => (
                    <article
                      key={card.key}
                      className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            {card.label}
                          </p>
                          <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
                            {counts[card.key]}
                          </p>
                        </div>

                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tone} text-white shadow-[0_16px_35px_rgba(15,23,42,0.14)]`}
                        >
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {card.icon}
                          </svg>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="grid gap-8 xl:grid-cols-3">
                  <SummaryPanel
                    title="Latest users"
                    count={users.length}
                    href={buildAdminHref("users", searchQuery)}
                  >
                    {users.slice(0, 5).map((user) => (
                      <SummaryRow
                        key={user.id}
                        title={user.name || user.username || "Unnamed user"}
                        meta={`@${user.username || "no-username"}`}
                        side={formatDate(user.createdat)}
                      />
                    ))}
                  </SummaryPanel>

                  <SummaryPanel
                    title="Latest posts"
                    count={posts.length}
                    href={buildAdminHref("posts", searchQuery)}
                  >
                    {posts.slice(0, 5).map((post) => (
                      <SummaryRow
                        key={post.id}
                        title={truncateText(getPostPreview(post), 64)}
                        meta={`User ${truncateId(post.userid)}`}
                        side={formatDate(post.created_at)}
                      />
                    ))}
                  </SummaryPanel>

                  <SummaryPanel
                    title="Latest reports"
                    count={reports.length}
                    href={buildAdminHref("reports", searchQuery)}
                  >
                    {reports.slice(0, 5).map((report) => (
                      <SummaryRow
                        key={report.id}
                        title={report.reason || "Report"}
                        meta={report.status || "pending"}
                        side={formatDate(report.created_at)}
                      />
                    ))}
                  </SummaryPanel>
                </div>
              </section>
            ) : null}

            {activeView === "users" ? (
              <TablePanel
                title="Users"
                description="A responsive table for browsing recent users, account roles, and moderation state."
              >
                <ResponsiveTable
                  columns={["User", "Email", "Username", "Joined", "Role", "Status", "Actions"]}
                  emptyLabel="No users matched your search."
                  rows={users.map((user) => [
                    user.name || "Unnamed user",
                    user.email || "No email",
                    `@${user.username || "no-username"}`,
                    formatDate(user.createdat),
                    <StatusPill
                      key={`${user.id}-role`}
                      tone={user.is_admin ? "cyan" : "emerald"}
                      label={user.is_admin ? "Admin" : "User"}
                    />,
                    <StatusPill
                      key={`${user.id}-status`}
                      tone={getAccountTone(user.account_status)}
                      label={user.account_status || "active"}
                    />,
                    renderUserActionMenu(user),
                  ])}
                  mobileRows={users.map((user) => ({
                    key: user.id,
                    title: user.name || user.username || "Unnamed user",
                    items: [
                      { label: "Email", value: user.email || "No email" },
                      {
                        label: "Username",
                        value: `@${user.username || "no-username"}`,
                      },
                      {
                        label: "Joined",
                        value: formatDate(user.createdat),
                      },
                      {
                        label: "Role",
                        value: user.is_admin ? "Admin" : "User",
                      },
                      {
                        label: "Status",
                        value: (
                          <StatusPill
                            tone={getAccountTone(user.account_status)}
                            label={user.account_status || "active"}
                          />
                        ),
                      },
                      {
                        label: "Actions",
                        value: renderUserActionMenu(user),
                      },
                    ],
                  }))}
                />
              </TablePanel>
            ) : null}

            {activeView === "posts" ? (
              <TablePanel
                title="Posts"
                description="A responsive table for tracking community content and engagement."
              >
                <ResponsiveTable
                  columns={["Preview", "User", "Community", "Type", "Views", "Status", "Created", "Actions"]}
                  emptyLabel="No posts matched your search."
                  rows={posts.map((post) => [
                    truncateText(getPostPreview(post), 90),
                    truncateId(post.userid),
                    post.communityId || "General",
                    post.mediaType || "text",
                    String(post.views ?? 0),
                    <StatusPill
                      key={`${post.id}-status`}
                      tone={getPostTone(post.moderation_status)}
                      label={post.moderation_status || "active"}
                    />,
                    formatDate(post.created_at),
                    renderPostActionMenu(post),
                  ])}
                  mobileRows={posts.map((post) => ({
                    key: post.id,
                    title: truncateText(getPostPreview(post), 72),
                    items: [
                      { label: "User", value: truncateId(post.userid) },
                      {
                        label: "Community",
                        value: post.communityId || "General",
                      },
                      { label: "Type", value: post.mediaType || "text" },
                      { label: "Views", value: String(post.views ?? 0) },
                      {
                        label: "Status",
                        value: (
                          <StatusPill
                            tone={getPostTone(post.moderation_status)}
                            label={post.moderation_status || "active"}
                          />
                        ),
                      },
                      {
                        label: "Created",
                        value: formatDate(post.created_at),
                      },
                      {
                        label: "Actions",
                        value: renderPostActionMenu(post),
                      },
                    ],
                  }))}
                />
              </TablePanel>
            ) : null}

            {activeView === "reports" ? (
              <TablePanel
                title="Reports"
                description="A responsive table for reviewing moderation signals and report state."
              >
                <ResponsiveTable
                  columns={["Reason", "Type", "Status", "Target", "Reporter", "Created", "Actions"]}
                  emptyLabel="No reports matched your search."
                  rows={reports.map((report) => [
                    report.reason || "Report",
                    report.target_type,
                    <StatusPill
                      key={`${report.id}-status`}
                      tone={getReportTone(report.status)}
                      label={report.status || "Pending"}
                    />,
                    report.target_type === "post"
                      ? truncateId(report.reported_post_id)
                      : truncateId(report.reported_user_id),
                    truncateId(report.reporter_id),
                    formatDate(report.created_at),
                    renderReportActionMenu(report),
                  ])}
                  mobileRows={reports.map((report) => ({
                    key: report.id,
                    title: report.reason || "Report",
                    items: [
                      { label: "Type", value: report.target_type },
                      { label: "Status", value: report.status || "Pending" },
                      {
                        label: "Target",
                        value:
                          report.target_type === "post"
                            ? truncateId(report.reported_post_id)
                            : truncateId(report.reported_user_id),
                      },
                      {
                        label: "Reporter",
                        value: truncateId(report.reporter_id),
                      },
                      {
                        label: "Created",
                        value: formatDate(report.created_at),
                      },
                      {
                        label: "Actions",
                        value: renderReportActionMenu(report),
                      },
                    ],
                  }))}
                />
              </TablePanel>
            ) : null}

            {activeView === "home-cards" ? (
              <TablePanel
                title="Home card manager"
                description="Search, filter, preview, upload, update, and delete the images used across the homepage cards."
              >
                <HomeCardManager
                  cards={homeCardImages}
                  counts={homeCardCounts}
                  searchQuery={searchQuery}
                  sectionFilter={homeCardSection}
                  filterOptions={buildHomeCardFilterOptions(
                    homeCardCounts,
                    searchQuery
                  )}
                />
              </TablePanel>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function TablePanel({ title, description, children }) {
  return (
    <section className="rounded-[1.8rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] backdrop-blur sm:p-7">
      <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
        {description}
      </p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function SummaryPanel({ title, count, href, children }) {
  return (
    <section className="rounded-[1.8rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.07)] backdrop-blur sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{count} results</p>
        </div>
        <a
          href={href}
          className="text-sm font-semibold text-teal-600 transition hover:text-teal-700"
        >
          Open
        </a>
      </div>
      <div className="mt-5 space-y-3">{children}</div>
    </section>
  );
}

function SummaryRow({ title, meta, side }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-950">{title}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
          {meta}
        </p>
      </div>
      <p className="shrink-0 text-xs uppercase tracking-[0.18em] text-slate-400">
        {side}
      </p>
    </div>
  );
}

function ResponsiveTable({ columns, rows, mobileRows, emptyLabel }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-sm text-slate-500">
        {emptyLabel}
      </div>
    );
  }

  return (
    <>
      <div className="hidden rounded-[1.4rem] border border-slate-200/80 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.04)] md:block">
        <div className="overflow-x-auto overflow-y-visible rounded-[1.4rem]">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row, index) => (
                <tr key={index} className="align-top">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-5 py-4 text-sm leading-7 text-slate-700 ${
                        cellIndex === row.length - 1 ? "relative overflow-visible" : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {mobileRows.map((row) => (
          <div
            key={row.key}
            className="rounded-[1.4rem] border border-slate-200/80 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.04)]"
          >
            <p className="text-base font-semibold text-slate-950">{row.title}</p>
            <div className="mt-4 space-y-3">
              {row.items.map((item) => (
                <div
                  key={`${row.key}-${item.label}`}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <span className="font-medium text-slate-500">{item.label}</span>
                  <span className="text-right text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StatusPill({ tone, label }) {
  const tones = {
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-800",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    rose: "border-rose-200 bg-rose-50 text-rose-800",
    slate: "border-slate-200 bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
        tones[tone] || tones.slate
      }`}
    >
      {label}
    </span>
  );
}

function renderUserActionMenu(user) {
  return (
    <ModerationActionMenu
      kind="user"
      recordId={user.id}
      currentStatus={user.account_status || "active"}
      defaultReason={user.moderation_reason || ""}
    />
  );
}

function renderPostActionMenu(post) {
  return (
    <ModerationActionMenu
      kind="post"
      recordId={post.id}
      currentStatus={post.moderation_status || "active"}
      defaultReason={post.moderation_reason || ""}
    />
  );
}

function renderReportActionMenu(report) {
  return (
    <ModerationActionMenu
      kind="report"
      recordId={report.id}
      targetType={report.target_type}
      targetId={report.target_type === "post" ? report.reported_post_id : report.reported_user_id}
      currentStatus={report.status || "pending"}
      defaultReason={report.reason || ""}
    />
  );
}

function truncateId(value) {
  if (!value) {
    return "N/A";
  }

  return String(value).slice(0, 8);
}

function formatDate(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getPostPreview(post) {
  return (
    post.content ||
    post.body ||
    post.caption ||
    post.text ||
    post.title ||
    "No preview text available for this post."
  );
}

function truncateText(value, maxLength) {
  const text = String(value || "");
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1)}...`;
}

function normalizeSearch(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeView(value) {
  if (typeof value !== "string") {
    return "overview";
  }

  return views.some((view) => view.key === value) ? value : "overview";
}

function getViewLabel(view) {
  return views.find((item) => item.key === view)?.label || "Overview";
}

function buildAdminHref(view, query, section) {
  const params = new URLSearchParams();
  params.set("view", view);

  if (query) {
    params.set("q", query);
  }

  if (view === "home-cards" && section) {
    params.set("section", section);
  }

  return `/admin?${params.toString()}`;
}

function includesText(value, query) {
  if (!query) {
    return true;
  }

  return String(value || "").toLowerCase().includes(query.toLowerCase());
}

function filterUsers(users, query) {
  if (!query) {
    return users;
  }

  return users.filter((user) =>
    [user.name, user.username, user.email, user.account_status].some((value) =>
      includesText(value, query)
    )
  );
}

function filterPosts(posts, query) {
  if (!query) {
    return posts;
  }

  return posts.filter((post) =>
    [post.content, post.communityId, post.mediaType, post.userid, post.moderation_status].some((value) =>
      includesText(value, query)
    )
  );
}

function filterReports(reports, query) {
  if (!query) {
    return reports;
  }

  return reports.filter((report) =>
    [
      report.reason,
      report.details,
      report.status,
      report.action_taken,
      report.admin_note,
      report.target_type,
      report.reported_user_id,
      report.reported_post_id,
      report.reporter_id,
    ].some((value) => includesText(value, query))
  );
}

function getReportTone(status) {
  const normalizedStatus = String(status || "pending").toLowerCase();

  if (
    normalizedStatus === "resolved" ||
    normalizedStatus === "closed" ||
    normalizedStatus === "actioned"
  ) {
    return "emerald";
  }

  if (normalizedStatus === "dismissed") {
    return "slate";
  }

  if (normalizedStatus === "reviewing" || normalizedStatus === "in_review") {
    return "cyan";
  }

  return "amber";
}

function getAccountTone(status) {
  const normalizedStatus = String(status || "active").toLowerCase();

  if (normalizedStatus === "banned") {
    return "rose";
  }

  if (normalizedStatus === "suspended") {
    return "amber";
  }

  return "emerald";
}

function getPostTone(status) {
  const normalizedStatus = String(status || "active").toLowerCase();

  if (normalizedStatus === "removed") {
    return "rose";
  }

  if (normalizedStatus === "hidden") {
    return "amber";
  }

  return "emerald";
}

function normalizeHomeCardSection(value) {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.trim().toLowerCase();

  return ["venters", "listeners", "community"].includes(normalized)
    ? normalized
    : "";
}

function getAdminSearchSummary({ activeView, searchQuery, homeCardSection }) {
  if (activeView === "home-cards") {
    if (searchQuery && homeCardSection) {
      return `Showing home card images matching "${searchQuery}" in ${formatHomeCardSection(homeCardSection)}.`;
    }

    if (searchQuery) {
      return `Showing home card images matching "${searchQuery}".`;
    }

    if (homeCardSection) {
      return `Showing all home card images assigned to ${formatHomeCardSection(homeCardSection)}.`;
    }

    return "Search by section or URL, then preview, update, or remove images from one management workspace.";
  }

  return searchQuery
    ? `Showing filtered results for "${searchQuery}".`
    : "Search by name, username, email, post text, report reason, or status.";
}

function filterHomeCardImages(images, query, section) {
  return images.filter((image) => {
    const matchesSection = section ? String(image.title || "").toLowerCase() === section : true;
    const matchesQuery = query
      ? [image.title, image.image_url, image.id].some((value) => includesText(value, query))
      : true;

    return matchesSection && matchesQuery;
  });
}

function sortHomeCardImages(images) {
  return [...images].sort((left, right) => {
    const leftTime = getSortableTime(left.created_at || left.createdat);
    const rightTime = getSortableTime(right.created_at || right.createdat);

    return rightTime - leftTime;
  });
}

function getSortableTime(value) {
  const time = new Date(value || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function countHomeCardImages(images) {
  return {
    total: images.length,
    venters: images.filter((image) => String(image.title || "").toLowerCase() === "venters").length,
    listeners: images.filter((image) => String(image.title || "").toLowerCase() === "listeners").length,
    community: images.filter((image) => String(image.title || "").toLowerCase() === "community").length,
  };
}

function buildHomeCardFilterOptions(counts, query) {
  return [
    {
      value: "",
      label: "All sections",
      count: counts.total,
      href: buildAdminHref("home-cards", query, ""),
    },
    {
      value: "venters",
      label: "Venters",
      count: counts.venters,
      href: buildAdminHref("home-cards", query, "venters"),
    },
    {
      value: "listeners",
      label: "Listeners",
      count: counts.listeners,
      href: buildAdminHref("home-cards", query, "listeners"),
    },
    {
      value: "community",
      label: "Community",
      count: counts.community,
      href: buildAdminHref("home-cards", query, "community"),
    },
  ];
}

function formatHomeCardSection(value) {
  if (!value) {
    return "all sections";
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
