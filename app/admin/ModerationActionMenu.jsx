"use client";

import { useMemo, useState } from "react";
import {
  moderatePostAction,
  moderateUserAction,
  updateModerationReportStatusAction,
} from "./actions";

const CONFIG = {
  user: {
    title: "Moderate user",
    options: [
      { value: "active", label: "Restore account" },
      { value: "suspended", label: "Suspend account" },
      { value: "banned", label: "Ban account" },
    ],
  },
  post: {
    title: "Moderate post",
    options: [
      { value: "active", label: "Restore post" },
      { value: "hidden", label: "Hide post" },
      { value: "removed", label: "Remove post" },
    ],
  },
  report: {
    title: "Moderate report",
    options: [
      { value: "reviewing", label: "Mark as reviewing" },
      { value: "dismissed", label: "Dismiss report" },
      { value: "hide_post", label: "Hide reported post" },
      { value: "remove_post", label: "Remove reported post" },
      { value: "suspend_user", label: "Suspend reported user" },
      { value: "ban_user", label: "Ban reported user" },
    ],
  },
};

export default function ModerationActionMenu({
  kind,
  recordId,
  reportId = "",
  currentStatus = "",
  targetType = "",
  targetId = "",
  defaultReason = "",
}) {
  const config = CONFIG[kind];
  const [open, setOpen] = useState(false);

  const initialAction = useMemo(() => {
    if (kind === "user") {
      return currentStatus && currentStatus !== "active" ? "active" : "suspended";
    }

    if (kind === "post") {
      return currentStatus && currentStatus !== "active" ? "active" : "hidden";
    }

    return "reviewing";
  }, [currentStatus, kind]);

  const [selectedAction, setSelectedAction] = useState(initialAction);
  const [reason, setReason] = useState(defaultReason || "");
  const [suspendedUntil, setSuspendedUntil] = useState("");

  const visibleOptions = useMemo(() => {
    if (kind !== "report") {
      return config.options;
    }

    return config.options.filter((option) => {
      if (targetType === "post") {
        return !["suspend_user", "ban_user"].includes(option.value);
      }

      return !["hide_post", "remove_post"].includes(option.value);
    });
  }, [config.options, kind, targetType]);

  const actionMeta = useMemo(() => {
    if (kind === "user") {
      return {
        formAction: moderateUserAction,
        fields: [
          ["userId", recordId],
          ["accountStatus", selectedAction],
          ["reportId", reportId],
        ],
      };
    }

    if (kind === "post") {
      return {
        formAction: moderatePostAction,
        fields: [
          ["postId", recordId],
          ["moderationStatus", selectedAction],
          ["reportId", reportId],
        ],
      };
    }

    if (selectedAction === "hide_post" || selectedAction === "remove_post") {
      return {
        formAction: moderatePostAction,
        fields: [
          ["postId", targetId],
          ["reportId", recordId],
          ["moderationStatus", selectedAction === "hide_post" ? "hidden" : "removed"],
        ],
      };
    }

    if (selectedAction === "suspend_user" || selectedAction === "ban_user") {
      return {
        formAction: moderateUserAction,
        fields: [
          ["userId", targetId],
          ["reportId", recordId],
          ["accountStatus", selectedAction === "suspend_user" ? "suspended" : "banned"],
        ],
      };
    }

    return {
      formAction: updateModerationReportStatusAction,
      fields: [["reportId", recordId], ["status", selectedAction]],
    };
  }, [kind, recordId, reportId, selectedAction, targetId]);

  const needsReason =
    kind === "user" || kind === "post" || ["hide_post", "remove_post", "suspend_user", "ban_user", "dismissed"].includes(selectedAction);
  const needsSuspensionTime =
    (kind === "user" && selectedAction === "suspended") ||
    (kind === "report" && selectedAction === "suspend_user");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        Actions
        <svg className="h-3 w-3 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
          <div className="w-full max-w-sm rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">
                  Moderation
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{config.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                aria-label="Close moderation panel"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.22 4.22a.75.75 0 011.06 0L10 8.94l4.72-4.72a.75.75 0 111.06 1.06L11.06 10l4.72 4.72a.75.75 0 11-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 11-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <form
              action={actionMeta.formAction}
              className="mt-5 space-y-4"
              onSubmit={() => setOpen(false)}
            >
              {actionMeta.fields.map(([name, value]) => (
                <input key={`${name}-${value}`} type="hidden" name={name} value={value || ""} />
              ))}

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Action
                </span>
                <select
                  value={selectedAction}
                  onChange={(event) => setSelectedAction(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
                >
                  {visibleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              {needsReason ? (
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Reason
                  </span>
                  <textarea
                    name={kind === "report" && !["reviewing", "dismissed"].includes(selectedAction) ? "moderationReason" : "adminNote"}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    rows={3}
                    placeholder="Add the moderation reason"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
                  />
                </label>
              ) : null}

              {needsSuspensionTime ? (
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Suspend until
                  </span>
                  <input
                    type="datetime-local"
                    name="suspendedUntil"
                    value={suspendedUntil}
                    onChange={(event) => setSuspendedUntil(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:bg-white"
                  />
                </label>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Save action
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
