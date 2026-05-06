"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/privacy", label: "Privacy" },
  { href: "/#download", label: "Download" },
];

const adminLinks = [
  { href: "/admin?view=overview", label: "Overview" },
  { href: "/admin?view=users", label: "Users" },
  { href: "/admin?view=posts", label: "Posts" },
  { href: "/admin?view=reports", label: "Reports" },
];

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdminLogin) {
    return null;
  }

  if (isAdminRoute) {
    const activeView = getAdminViewLabel(searchParams.get("view"));

    return (
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-slate-950/95 text-white backdrop-blur lg:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/admin?view=overview" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Ventaway"
                width={36}
                height={36}
              />
              <div>
                <p className="text-sm font-semibold text-white">Ventaway Admin</p>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {activeView}
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="rounded-xl border border-white/10 bg-white/5 p-2"
              aria-expanded={isOpen}
              aria-label="Toggle admin navigation"
            >
              <div className="space-y-1.5">
                <span
                  className={`block h-0.5 w-6 bg-white transition ${
                    isOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-white transition ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-white transition ${
                    isOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              isOpen ? "max-h-[420px] pb-4 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-3">
              {adminLinks.map((link) => (
                <MobileAdminItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={isAdminLinkActive(link.href, searchParams.get("view"))}
                  onClick={() => setIsOpen(false)}
                />
              ))}

              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                Back to site
              </Link>

              <button
                type="button"
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  router.push("/admin/login");
                  router.refresh();
                }}
                className="block w-full rounded-xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Ventaway"
              width={40}
              height={40}
            />
            <span className="hidden text-xl font-bold text-teal-500 sm:inline sm:text-2xl">
              Ventaway
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {publicLinks.map((link) => (
              <NavItem key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          <Link
            href="/#download"
            className="hidden rounded-full bg-gradient-to-r from-teal-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white md:inline-flex"
          >
            Get App
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-lg p-2 active:scale-95 md:hidden"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-6 bg-black transition ${
                  isOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-black transition ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-black transition ${
                  isOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            isOpen
              ? "max-h-[400px] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-2 opacity-0"
          }`}
        >
          <div className="mt-3 space-y-2 rounded-xl border bg-white p-3 shadow-md">
            {publicLinks.map((link) => (
              <MobileItem
                key={link.href}
                href={link.href}
                label={link.label}
                close={() => setIsOpen(false)}
              />
            ))}

            <Link
              href="/#download"
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 py-3 text-center font-semibold text-white active:scale-95"
            >
              Get the App
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavItem({ href, label }) {
  return (
    <Link
      href={href}
      className="px-2 py-1 text-sm font-medium text-gray-700 transition hover:text-teal-600"
    >
      {label}
    </Link>
  );
}

function MobileItem({ href, label, close }) {
  return (
    <Link
      href={href}
      onClick={close}
      className="block w-full rounded-lg bg-gray-50 px-4 py-3 text-base font-medium text-gray-800 transition hover:bg-teal-50 hover:text-teal-600 active:scale-95"
    >
      {label}
    </Link>
  );
}

function MobileAdminItem({ href, label, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-teal-400/15 text-white"
          : "text-slate-200 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function getAdminViewLabel(view) {
  switch (view) {
    case "users":
      return "Users";
    case "posts":
      return "Posts";
    case "reports":
      return "Reports";
    default:
      return "Overview";
  }
}

function isAdminLinkActive(href, currentView) {
  if (href.includes("view=overview")) {
    return !currentView || currentView === "overview";
  }

  return href.includes(`view=${currentView}`);
}
