'use client'

import Image from 'next/image'
import { useActionState, useMemo, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { deleteHomeCardImage, updateHomeCardImage } from './actions'
import HomeCardUploadForm from './HomeCardUploadForm'

const initialActionState = {
  status: 'idle',
  message: '',
}

export default function HomeCardManager({
  cards,
  counts,
  searchQuery,
  sectionFilter,
  filterOptions,
}) {
  const [activeCard, setActiveCard] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const emptyLabel = useMemo(() => {
    if (searchQuery && sectionFilter) {
      return `No home card images matched "${searchQuery}" in ${formatSectionLabel(sectionFilter)}.`
    }

    if (searchQuery) {
      return `No home card images matched "${searchQuery}".`
    }

    if (sectionFilter) {
      return `No home card images are currently assigned to ${formatSectionLabel(sectionFilter)}.`
    }

    return 'No home card images have been uploaded yet.'
  }, [searchQuery, sectionFilter])

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total images" value={String(counts.total)} tone="from-slate-900 to-slate-700" />
        <StatCard label="Venters" value={String(counts.venters)} tone="from-teal-500 to-cyan-500" />
        <StatCard label="Listeners" value={String(counts.listeners)} tone="from-sky-500 to-blue-600" />
        <StatCard label="Community" value={String(counts.community)} tone="from-amber-500 to-orange-500" />
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/80 p-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600">
              Browse and filter
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Home card library
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Scan the table, filter by section, then open a focused modal to create or update the selected asset.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
              {cards.length} result{cards.length === 1 ? '' : 's'}
            </div>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add new image
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {filterOptions.map((option) => {
            const isActive = option.value === sectionFilter

            return (
              <a
                key={option.value || 'all'}
                href={option.href}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'border-teal-300 bg-teal-500/10 text-teal-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:text-teal-700'
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isActive ? 'bg-teal-500' : 'bg-slate-300'
                  }`}
                />
                {option.label}
                <span className="text-slate-400">{option.count}</span>
              </a>
            )
          })}
        </div>
      </section>

      {cards.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-12 text-center">
          <p className="text-lg font-semibold text-slate-900">Nothing to manage yet</p>
          <p className="mt-2 text-sm leading-7 text-slate-500">{emptyLabel}</p>
        </div>
      ) : (
        <HomeCardTable cards={cards} onOpen={setActiveCard} />
      )}

      {isCreateOpen ? <CreateHomeCardModal onClose={() => setIsCreateOpen(false)} /> : null}
      {activeCard ? <HomeCardModal card={activeCard} onClose={() => setActiveCard(null)} /> : null}
    </div>
  )
}

function HomeCardTable({ cards, onOpen }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-[1.5rem] border border-slate-200/80 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 bg-white">
            <thead className="bg-slate-50">
              <tr>
                {['Section', 'Preview', 'Uploaded', 'Source', 'Actions'].map((column) => (
                  <th
                    key={column}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cards.map((card) => (
                <tr key={card.id || card.image_url} className="align-middle">
                  <td className="px-5 py-4">
                    <StatusPill tone={getSectionTone(card.title)} label={formatSectionLabel(card.title)} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onOpen(card)}
                      className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-teal-200 hover:bg-white"
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                        <Image
                          src={card.image_url}
                          alt={`${formatSectionLabel(card.title)} home card`}
                          fill
                          unoptimized
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">View image</span>
                    </button>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {formatDate(card.created_at || card.createdat)}
                  </td>
                  <td className="max-w-[360px] px-5 py-4 text-sm text-slate-600">
                    <p className="truncate">{card.image_url}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onOpen(card)}
                        className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Open
                      </button>
                      <a
                        href={card.image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
                      >
                        File
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {cards.map((card) => (
          <div
            key={card.id || card.image_url}
            className="rounded-[1.4rem] border border-slate-200/80 bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <StatusPill tone={getSectionTone(card.title)} label={formatSectionLabel(card.title)} />
                <p className="mt-3 text-sm text-slate-500">{formatDate(card.created_at || card.createdat)}</p>
              </div>
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src={card.image_url}
                  alt={`${formatSectionLabel(card.title)} home card`}
                  fill
                  unoptimized
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            </div>

            <p className="mt-4 truncate text-sm text-slate-600">{card.image_url}</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onOpen(card)}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open image
              </button>
              <a
                href={card.image_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
              >
                Original file
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function HomeCardModal({ card, onClose }) {
  const [updateState, updateAction] = useActionState(updateHomeCardImage, initialActionState)
  const [deleteState, deleteAction] = useActionState(deleteHomeCardImage, initialActionState)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600">
              Home card image
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              {formatSectionLabel(card.title)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
            aria-label="Close image modal"
          >
            X
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
          <div className="bg-slate-100">
            <div className="relative h-52 sm:h-60 lg:h-full lg:min-h-[260px]">
              <Image
                src={card.image_url}
                alt={`${formatSectionLabel(card.title)} home card`}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="min-h-0 space-y-4 overflow-y-auto p-5">
            <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Uploaded</p>
              <p className="mt-2 text-base font-semibold text-slate-950">
                {formatDate(card.created_at || card.createdat)}
              </p>
            </div>

            <div className="rounded-[1.3rem] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Public URL</p>
              <p className="mt-2 break-all text-sm leading-7 text-slate-600">{card.image_url}</p>
            </div>

            <form action={updateAction} className="space-y-4 rounded-[1.3rem] border border-slate-200 bg-white p-4">
              <input type="hidden" name="id" value={card.id || ''} />
              <input type="hidden" name="currentImageUrl" value={card.image_url} />

              <div>
                <p className="text-sm font-semibold text-slate-900">Update image</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Reassign the section or replace the uploaded asset from this modal.
                </p>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-800">Section</span>
                <select
                  name="title"
                  defaultValue={card.title}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-teal-400"
                >
                  <option value="venters">Venters</option>
                  <option value="listeners">Listeners</option>
                  <option value="community">Community</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-800">Replace image</span>
                <input
                  type="file"
                  name="replacementImage"
                  accept="image/*"
                  className="block w-full cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </label>

              <ActionMessage state={updateState} />

              <div className="flex flex-wrap gap-3">
                <SubmitButton idleLabel="Save changes" pendingLabel="Saving..." />
                <a
                  href={card.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
                >
                  Open original
                </a>
              </div>
            </form>

            <form
              action={deleteAction}
              onSubmit={(event) => {
                if (!window.confirm('Delete this home card image? This will remove the record and try to remove the stored file.')) {
                  event.preventDefault()
                }
              }}
              className="rounded-[1.3rem] border border-rose-200 bg-rose-50/70 p-4"
            >
              <input type="hidden" name="id" value={card.id || ''} />
              <input type="hidden" name="imageUrl" value={card.image_url} />

              <p className="text-sm font-semibold text-rose-900">Danger zone</p>
              <p className="mt-1 text-sm leading-6 text-rose-700">
                Remove this record and attempt to remove the stored image file too.
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <ActionMessage state={deleteState} />
                <div className="flex flex-wrap gap-3">
                  <SubmitButton
                    idleLabel="Delete image"
                    pendingLabel="Deleting..."
                    className="bg-rose-600 hover:bg-rose-500"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreateHomeCardModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-600">
              Create image
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Add new home card image
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
            aria-label="Close create modal"
          >
            X
          </button>
        </div>

        <div className="p-6">
          <HomeCardUploadForm />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, tone }) {
  return (
    <div className="rounded-[1.6rem] border border-white/70 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950">{value}</p>
        </div>
        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${tone} shadow-[0_16px_35px_rgba(15,23,42,0.14)]`} />
      </div>
    </div>
  )
}

function StatusPill({ tone, label }) {
  const tones = {
    amber: 'border-amber-200 bg-amber-50 text-amber-800',
    cyan: 'border-cyan-200 bg-cyan-50 text-cyan-800',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    slate: 'border-slate-200 bg-slate-100 text-slate-700',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
        tones[tone] || tones.slate
      }`}
    >
      {label}
    </span>
  )
}

function ActionMessage({ state }) {
  if (!state?.message) {
    return <p className="text-sm text-slate-500">Changes are applied securely through the admin action.</p>
  }

  return (
    <p className={`text-sm ${state.status === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}>
      {state.message}
    </p>
  )
}

function SubmitButton({ idleLabel, pendingLabel, className = '' }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  )
}

function formatSectionLabel(value) {
  if (!value) {
    return 'Unassigned'
  }

  return String(value).charAt(0).toUpperCase() + String(value).slice(1)
}

function formatDate(value) {
  if (!value) {
    return 'Unknown date'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function getSectionTone(title) {
  const normalized = String(title || '').toLowerCase()

  if (normalized === 'venters') {
    return 'emerald'
  }

  if (normalized === 'listeners') {
    return 'cyan'
  }

  if (normalized === 'community') {
    return 'amber'
  }

  return 'slate'
}
