import Image from "next/image";

const heroSlides = [
  {
    src: "/images/welcome/splash1.png",
    alt: "Ventaway onboarding screen connecting listeners and seekers",
  },
  {
    src: "/images/welcome/splash2.png",
    alt: "Ventaway onboarding screen about secure and private conversation",
  },
  {
    src: "/images/welcome/splash3.png",
    alt: "Ventaway onboarding screen inviting users into a supportive community",
  },
];

const trustPoints = [
  "Anonymous conversations",
  "Real human listeners",
  "Private, calm, judgment-free support",
];

const features = [
  {
    title: "Anonymous Chats",
    desc: "Speak freely without revealing your identity or worrying about being judged.",
  },
  {
    title: "Real Listeners",
    desc: "Connect with people who genuinely care and know how to hold space for you.",
  },
  {
    title: "Instant Support",
    desc: "Start talking when the weight feels heavy instead of waiting to be understood.",
  },
];

const featureMockups = [
  {
    src: "/mockup/home.png",
    alt: "Ventaway home screen mockup",
    className: "sm:translate-y-8 lg:rotate-[-6deg]",
  },
  {
    src: "/mockup/1.png",
    alt: "Ventaway conversation mockup",
    className: "sm:-translate-y-4 lg:translate-y-6 lg:rotate-[5deg]",
  },
  {
    src: "/mockup/2.png",
    alt: "Ventaway support flow mockup",
    className: "sm:translate-y-2 lg:rotate-[6deg]",
  },
  {
    src: "/mockup/prifile.png",
    alt: "Ventaway profile screen mockup",
    className: "sm:-translate-y-6 lg:translate-y-10 lg:rotate-[-5deg]",
  },
];

const steps = [
  { num: "01", title: "Choose your mood" },
  { num: "02", title: "Get matched instantly" },
  { num: "03", title: "Start talking" },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_top,#f2fffd_0%,#eff8ff_40%,#ffffff_100%)] text-slate-900">
      <section className="relative isolate min-h-[calc(100vh-5rem)] px-6 pb-16 pt-8 sm:pt-12">
        <div className="hero-grid absolute inset-0 -z-20 opacity-60" />
        <div className="absolute inset-x-0 top-0 -z-20 h-64 bg-[radial-gradient(circle_at_top,#67e8f9_0%,rgba(103,232,249,0.18)_35%,transparent_70%)]" />
        <div className="absolute left-[-10rem] top-28 -z-10 h-72 w-72 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute bottom-0 right-[-8rem] -z-10 h-80 w-80 rounded-full bg-teal-200/40 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8 pt-8 lg:pt-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-semibold text-teal-700 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Emotional support that feels safe, warm, and human
            </div>

            <div className="max-w-3xl space-y-5">
              <h1 className="font-display text-5xl leading-none tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
                A modern space to
                <span className="block bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 bg-clip-text text-transparent">
                  vent, breathe, and feel heard.
                </span>
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Ventaway connects you with real people who are ready to listen,
                so you can release what you are carrying and feel supported in
                the moment you need it most.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#download"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Download App
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-7 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700"
              >
                Explore Features
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border border-white/70 bg-white/75 px-4 py-4 text-sm font-medium text-slate-700 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div className="pointer-events-none absolute inset-0 -z-10 scale-110 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.22),transparent_62%)] blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.28)] sm:p-5">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(45,212,191,0.18),rgba(255,255,255,0.02),rgba(59,130,246,0.18))]" />

              <div className="relative min-h-[420px] overflow-hidden rounded-[1.5rem] bg-slate-900 sm:min-h-[520px]">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.src}
                    className="hero-slide absolute inset-0"
                    style={{ animationDelay: `${index * 5}s` }}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 42vw"
                    />
                  </div>
                ))}

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.06),rgba(15,23,42,0.58))]" />
                <div className="absolute inset-y-0 left-0 w-24 bg-[linear-gradient(90deg,rgba(15,23,42,0.45),transparent)]" />
                <div className="absolute inset-y-0 right-0 w-24 bg-[linear-gradient(270deg,rgba(15,23,42,0.45),transparent)]" />

                <div className="relative flex min-h-[420px] flex-col justify-between p-6 sm:min-h-[520px] sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur">
                      Live support
                    </div>
                    <div className="flex gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-white/50" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/50" />
                      <span className="h-2.5 w-2.5 rounded-full bg-teal-300" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div className="max-w-md rounded-[1.75rem] border border-white/20 bg-white/12 p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.22)] backdrop-blur-md">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">
                        Why people stay
                      </p>
                      <p className="mt-3 text-2xl font-semibold leading-tight">
                        Designed to feel like a deep breath, not another noisy
                        app.
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/78">
                        A calmer first impression, a clearer value story, and
                        onboarding visuals that now work as a living backdrop.
                      </p>
                    </div>

                    <div className="hero-float rounded-[1.75rem] border border-white/20 bg-white/92 p-4 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
                      <p className="text-sm font-semibold text-slate-500">
                        Trusted promise
                      </p>
                      <p className="mt-2 max-w-[12rem] text-lg font-semibold leading-snug">
                        Private support with a softer, more premium first look.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600">
              Features
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.03em] text-slate-950 sm:text-5xl">
              A better way to express yourself
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Built for real conversations, emotional release, and meaningful
              human connection without the pressure of performing online.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="relative">
              <div className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/40 blur-3xl" />
              <div className="absolute inset-x-12 top-10 -z-10 h-64 rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.6),rgba(207,250,254,0.5),rgba(191,219,254,0.4))] blur-2xl" />

              <div className="grid gap-5 sm:grid-cols-2 lg:min-h-[42rem] lg:gap-6">
                {featureMockups.map((mockup) => (
                  <div
                    key={mockup.src}
                    className={`relative mx-auto w-full max-w-[14rem] ${mockup.className}`}
                  >
                    <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-slate-950 p-2 shadow-[0_28px_60px_rgba(15,23,42,0.18)]">
                      <div className="relative aspect-[9/19] overflow-hidden rounded-[1.55rem] bg-slate-900">
                        <Image
                          src={mockup.src}
                          alt={mockup.alt}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 640px) 60vw, (max-width: 1024px) 28vw, 18vw"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-1">
              {features.map((feature) => (
                <Feature
                  key={feature.title}
                  title={feature.title}
                  desc={feature.desc}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600">
                Journey
              </p>
              <h2 className="mt-4 font-display text-4xl tracking-[-0.03em] text-slate-950 sm:text-5xl">
                How it works
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              A simple flow built to get someone from overwhelm to relief in
              just a few taps.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <Step key={step.num} num={step.num} title={step.title} />
            ))}
          </div>
        </div>
      </section>

      <section id="download" className="px-6 pb-24 pt-10">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-slate-950 px-8 py-12 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:px-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-200">
                Download
              </p>
              <h2 className="mt-4 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                You don&apos;t have to go through it alone.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Join Ventaway and talk to someone who listens, understands, and
                helps you feel lighter.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <StoreButton
                  href="#"
                  eyebrow="Download on the"
                  label="App Store"
                  icon={
                    <Image
                      src="/images/apple.png"
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                    />
                  }
                />
                <StoreButton
                  href="#"
                  eyebrow="Get it on"
                  label="Google Play"
                  icon={<Image
                      src="/images/playstore.png"
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                    />
                  }
                />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/12 bg-white/6 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.2)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-200">
                Ready for launch
              </p>
              <p className="mt-3 max-w-xs text-lg font-semibold leading-8 text-white">
                Store buttons are in place, so you can drop in the final iOS
                and Android links when they are ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 px-6 py-12 text-center text-slate-500">
        <p className="mb-2">&copy; 2026 Ventaway</p>
        <a href="/privacy" className="transition hover:text-slate-900">
          Privacy Policy
        </a>
      </footer>
    </main>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/85 p-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(15,23,42,0.1)]">
      <div className="mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500" />
      <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{desc}</p>
    </div>
  );
}

function Step({ num, title }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200/70 bg-white p-7 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-600">
        {num}
      </div>
      <h4 className="mt-6 text-2xl font-semibold text-slate-950">{title}</h4>
      <p className="mt-3 leading-7 text-slate-600">
        A smoother, more reassuring flow that helps users reach support
        quickly.
      </p>
    </div>
  );
}

function StoreButton({ href, eyebrow, label, icon }) {
  return (
    <a
      href={href}
      className="inline-flex min-w-[220px] items-center gap-4 rounded-2xl border border-white/12 bg-white/8 px-5 py-4 text-left shadow-[0_16px_40px_rgba(15,23,42,0.18)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/12"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
        {icon}
      </span>
      <span>
        <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">
          {eyebrow}
        </span>
        <span className="mt-1 block text-xl font-semibold text-white">
          {label}
        </span>
      </span>
    </a>
  );
}

function AndroidIcon() {
  return (
    <svg
      className="h-7 w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 9.5h8m-7-3.5 1.2-2m4.6 2L16 4M7.5 10.5v5.5a1 1 0 0 0 1 1h.5v2a1 1 0 1 0 2 0v-2h2v2a1 1 0 1 0 2 0v-2h.5a1 1 0 0 0 1-1v-5.5c0-2.8-2.2-5-5-5s-5 2.2-5 5Zm-2 0v4m13-4v4M10 7.5h.01M14 7.5h.01"
      />
    </svg>
  );
}
