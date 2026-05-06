"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// export const metadata = {
//   title: "Privacy Policy | Ventaway",
//   description:
//     "Learn how Ventaway protects anonymous conversations, limits data collection, and keeps emotional support private and secure.",
// };

const privacySections = [
  {
    id: "anonymity",
    title: "Anonymity Guaranteed",
    content:
      "All vents are designed to feel private and identity-safe. Ventaway is built to help people express themselves freely without unnecessary personal exposure.",
  },
  {
    id: "data",
    title: "Minimal Data Collection",
    content:
      "We only collect limited technical information needed to run, secure, and improve the service. We avoid unnecessary tracking and do not build the experience around invasive data collection.",
  },
  {
    id: "security",
    title: "Secure Communication",
    content:
      "We use secure infrastructure and modern safeguards to protect communication and reduce unauthorized access to sensitive information.",
  },
  {
    id: "compliance",
    title: "Respect for User Rights",
    content:
      "Our privacy approach is intended to respect major global privacy expectations and give users a clear path to ask questions or raise concerns.",
  },
  {
    id: "nosell",
    title: "No Data Selling",
    content:
      "We do not sell user data. Trust is central to the product, and privacy should never be treated as a monetization shortcut.",
  },
];

const trustPoints = [
  "Privacy-first by design",
  "Simple, readable policy",
  "Built for emotional safety",
];

export default function PrivacyPage() {
  const [openSections, setOpenSections] = useState({
    anonymity: true,
  });

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#f3fffd_0%,#eef8ff_42%,#ffffff_100%)] text-slate-900">
      <section className="relative isolate border-b border-slate-200/70 px-6 pb-14 pt-10 sm:pt-14">
        <div className="hero-grid absolute inset-0 -z-20 opacity-45" />
        <div className="absolute inset-x-0 top-0 -z-20 h-52 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.24),transparent_72%)]" />
        <div className="absolute left-[-7rem] top-24 -z-10 h-64 w-64 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute right-[-6rem] top-8 -z-10 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-teal-700 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            Privacy Policy
          </div>

          <div className="mt-6 space-y-5">
            <Image
              src="/images/logo.png"
              alt="Ventaway"
              width={58}
              height={58}
              className="mx-auto"
            />

            <h1 className="font-display text-4xl tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Your privacy comes first.
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Ventaway is built to feel safe, private, and respectful. This
              page gives a simple overview of how we think about privacy and
              protect the trust behind every conversation.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {trustPoints.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-white/70 bg-white/80 px-4 py-4 text-sm font-medium text-slate-700 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur"
              >
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600">
              Overview
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              We believe emotional expression should stay protected. That means
              keeping privacy understandable, limiting unnecessary data
              collection, and treating user trust as a core part of the
              product.
            </p>
          </div>

          <div className="space-y-4">
            {privacySections.map((section) => {
              const isOpen = Boolean(openSections[section.id]);

              return (
                <article
                  key={section.id}
                  className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/92 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    aria-expanded={isOpen}
                  >
                    <div>
                      <p className="text-lg font-semibold text-slate-950">
                        {section.title}
                      </p>
                    </div>

                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6">
                        <p className="text-sm leading-7 text-slate-600 sm:text-base">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="rounded-[1.75rem] bg-slate-950 px-6 py-8 text-center text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-200">
              Contact
            </p>
            <p className="mt-3 text-base leading-7 text-slate-300 sm:text-lg">
              Questions about privacy or data handling? Reach out directly.
            </p>

            <a
              href="mailto:privacy@ventaway.com"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              privacy@ventaway.com
            </a>

            <div className="mt-5">
              <Link
                href="/"
                className="inline-flex items-center justify-center text-sm font-medium text-teal-200 transition hover:text-white"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
