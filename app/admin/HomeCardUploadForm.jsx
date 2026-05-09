'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { uploadHomeCardImages } from './actions'

const initialState = {
  status: 'idle',
  message: '',
}

export default function HomeCardUploadForm() {
  const [state, formAction] = useActionState(uploadHomeCardImages, initialState)
  const formRef = useRef(null)

  useEffect(() => {
    if (state.status === 'success') {
      formRef.current?.reset()
    }
  }, [state.status])

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,220px)_1fr]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">Card section</span>
          <select
            name="title"
            defaultValue="venters"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-teal-400"
            required
          >
            <option value="venters">Venters</option>
            <option value="listeners">Listeners</option>
            <option value="community">Community</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-800">Images</span>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            required
            className="block h-12 w-full cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
        </label>
      </div>

      <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-7 text-slate-600">
        Upload one or more images and they will be stored in the `home-cards` bucket and
        saved in `home_card_images` with the matching section title.
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          aria-live="polite"
          className={`text-sm ${
            state.status === 'error'
              ? 'text-rose-600'
              : state.status === 'success'
                ? 'text-emerald-600'
                : 'text-slate-500'
          }`}
        >
          {state.message || 'Supported sections: Venters, Listeners, Community.'}
        </p>
        <SubmitButton />
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {pending ? 'Uploading...' : 'Upload images'}
    </button>
  )
}
